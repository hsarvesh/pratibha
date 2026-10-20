import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cors from 'cors';
import { db } from '../../server/db.js';
import { query, pool } from '../../server/db/config.js';
import {
  evaluateJobDescription,
  calculateCandidateFit,
  generateJDInterviewQuestions,
  evaluateInterviewResponse,
  optimizeResumeBullet,
  generateCareerPathing,
  DEFAULT_LLM_CONFIG
} from '../../server/services/aiEngine.js';

let server;
let baseUrl;
const TEST_PORT = 5055;

test('Pratibha HTTP API End-to-End Test Suite', async (t) => {
  // Setup test HTTP server
  await t.test('0. Start Test Express Server', async () => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // 1. JOBS
    app.get('/api/jobs', async (req, res) => {
      try {
        const { q, domain, experienceLevel, workCondition, jobType, location, candidateId } = req.query;
        const allJobs = await db.getJobs();
        let candidate = null;
        if (candidateId) candidate = await db.getUserById(candidateId);

        let filtered = allJobs.map(job => ({
          ...job,
          candidateFit: candidate ? calculateCandidateFit(job, candidate) : null
        }));

        if (q) {
          const term = q.toLowerCase();
          filtered = filtered.filter(j =>
            (j.title || '').toLowerCase().includes(term) ||
            (j.company || '').toLowerCase().includes(term) ||
            (j.mustHaveSkills || []).some(s => s.toLowerCase().includes(term))
          );
        }
        if (domain && domain !== 'All') filtered = filtered.filter(j => (j.domain || '').toLowerCase() === domain.toLowerCase());
        if (experienceLevel && experienceLevel !== 'All') filtered = filtered.filter(j => (j.experienceLevel || '').toLowerCase().includes(experienceLevel.toLowerCase()));
        if (workCondition && workCondition !== 'All') filtered = filtered.filter(j => (j.workCondition || '').toLowerCase() === workCondition.toLowerCase());
        if (jobType && jobType !== 'All') filtered = filtered.filter(j => (j.jobType || '').toLowerCase() === jobType.toLowerCase());

        // Sort: featured first, then fit, then date
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          if (a.candidateFit && b.candidateFit) {
            return b.candidateFit.matchScore - a.candidateFit.matchScore;
          }
          return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
        });

        res.json({ success: true, count: filtered.length, jobs: filtered });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.get('/api/jobs/:id', async (req, res) => {
      try {
        const job = await db.getJobById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        const { candidateId } = req.query;
        let candidateFit = null;
        if (candidateId) {
          const candidate = await db.getUserById(candidateId);
          if (candidate) candidateFit = calculateCandidateFit(job, candidate);
        }
        res.json({ success: true, job: { ...job, candidateFit } });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.post('/api/jobs/evaluate-jd', (req, res) => {
      try {
        const evaluation = evaluateJobDescription(req.body);
        res.json({ success: true, evaluation });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.post('/api/jobs', async (req, res) => {
      try {
        const jobData = req.body;
        const evalResult = evaluateJobDescription(jobData);
        const newJob = {
          id: jobData.id || `job_${Date.now()}`,
          title: jobData.title || 'Untitled',
          company: jobData.company || 'Enterprise',
          domain: jobData.domain || 'Software & Technology',
          location: jobData.location || 'Remote',
          workCondition: jobData.workCondition || 'Remote',
          jobType: jobData.jobType || 'Full-Time',
          qualityScore: evalResult.score,
          qualityRating: evalResult.qualityRating,
          mustHaveSkills: jobData.mustHaveSkills || [],
          responsibilities: jobData.responsibilities || []
        };
        const created = await db.createJob(newJob);
        res.status(201).json({ success: true, job: created });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    // 2. AUTH & USERS
    app.post('/api/auth/register', async (req, res) => {
      try {
        const { name, email, phone, password, role = 'candidate', headline, location, preferredRemote } = req.body;
        if (!email || !name) return res.status(400).json({ success: false, message: 'Name and email are required fields.' });
        const existing = await db.getUserByEmail(email.trim());
        if (existing) return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
        const newUser = await db.createUser({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? phone.trim() : null,
          password: password || 'pratibha_secure',
          role: role === 'employer' ? 'employer' : 'candidate',
          headline: headline || 'Job Seeker',
          location: location || 'Bengaluru, India',
          preferredRemote: preferredRemote || 'Hybrid',
          privacySettings: { visibleToEmployers: true, showContactNumber: Boolean(phone), showTargetSalary: true }
        });
        res.status(201).json({ success: true, message: 'Account created', user: newUser });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.post('/api/auth/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email address required' });
        const user = await db.getUserByEmail(email.trim());
        if (!user) return res.status(401).json({ success: false, message: 'User not found' });
        if (password && user.password && user.password !== password) {
          return res.status(401).json({ success: false, message: 'Incorrect password' });
        }
        res.json({ success: true, user });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.get('/api/users', async (req, res) => {
      try {
        const users = await db.getUsers();
        res.json({ success: true, users });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.get('/api/users/:id', async (req, res) => {
      try {
        const user = await db.getUserById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.put('/api/users/:id', async (req, res) => {
      try {
        const updated = await db.updateUser(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user: updated });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.post('/api/users/:id/skills', async (req, res) => {
      try {
        const { name, level = 'Intermediate', verified = false } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Skill name required' });
        const skills = await db.addOrEndorseSkill(req.params.id, { name, level, verified });
        if (!skills) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, skills });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    // 3. APPLICATIONS
    app.get('/api/applications', async (req, res) => {
      try {
        const { candidateId, jobId } = req.query;
        const apps = await db.getApplications({ candidateId, jobId });
        res.json({ success: true, applications: apps });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.post('/api/applications', async (req, res) => {
      try {
        const { jobId, candidateId, candidateNotes } = req.body;
        if (!jobId || !candidateId) return res.status(400).json({ success: false, message: 'jobId and candidateId required' });
        const existing = await db.getApplications({ candidateId, jobId });
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Already applied' });

        const newApp = {
          id: `app_api_${Date.now()}`,
          jobId,
          candidateId,
          appliedDate: new Date().toISOString().split('T')[0],
          status: 'Applied',
          candidateNotes: candidateNotes || '',
          matchScore: 90
        };
        const created = await db.createApplication(newApp);

        await db.createNotification({
          id: `notif_api_${Date.now()}`,
          userId: 'employer_1',
          title: 'New Candidate Application',
          message: 'Candidate applied for position',
          type: 'application'
        });

        res.status(201).json({ success: true, application: created });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.patch('/api/applications/:id/status', async (req, res) => {
      try {
        const updated = await db.updateApplicationStatus(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Application not found' });
        res.json({ success: true, application: updated });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.post('/api/applications/:id/feedback', async (req, res) => {
      try {
        const saved = await db.saveEmployerFeedback(req.params.id, req.body);
        if (!saved) return res.status(404).json({ success: false, message: 'Application not found' });
        res.json({ success: true, feedback: saved });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    // 4. INTERVIEW
    app.post('/api/interview/generate-questions', async (req, res) => {
      try {
        const { jobId, candidateId } = req.body;
        const job = (jobId ? await db.getJobById(jobId) : null) || (await db.getJobs())[0];
        const candidate = (candidateId ? await db.getUserById(candidateId) : null) || (await db.getUsers())[0];
        const questions = generateJDInterviewQuestions(job, candidate);
        res.json({ success: true, questions });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.post('/api/interview/evaluate', async (req, res) => {
      try {
        const { question, userAnswer, jobId } = req.body;
        const job = (jobId ? await db.getJobById(jobId) : null) || (await db.getJobs())[0];
        const evaluation = await evaluateInterviewResponse(question, userAnswer, job);
        res.json({ success: true, evaluation });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.post('/api/interview/save-session', async (req, res) => {
      try {
        const { candidateId, jobId, overallScore, questions } = req.body;
        const session = {
          id: `mock_api_${Date.now()}`,
          candidateId: candidateId || 'candidate_1',
          jobId: jobId || 'job_1',
          jobTitle: 'Software Architect',
          overallScore: overallScore || 85,
          status: 'Completed',
          questions: questions || []
        };
        const saved = await db.saveMockInterview(session);
        res.status(201).json({ success: true, session: saved });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.get('/api/interview/history/:candidateId', async (req, res) => {
      try {
        const list = await db.getMockInterviewHistory(req.params.candidateId);
        res.json({ success: true, interviews: list });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    // 5. RESUME & CAREER
    app.post('/api/resume/optimize-bullet', async (req, res) => {
      try {
        const { bullet, targetRole } = req.body;
        const result = await optimizeResumeBullet(bullet, targetRole);
        res.json({ success: true, result });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.get('/api/career/pathing', async (req, res) => {
      try {
        const candidate = (await db.getUserById(req.query.candidateId)) || (await db.getUsers())[0];
        const pathing = generateCareerPathing(candidate?.skills || [], candidate?.currentRole || '');
        res.json({ success: true, pathing });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    // 6. NOTIFICATIONS
    app.get('/api/notifications/:userId', async (req, res) => {
      try {
        const notifs = await db.getNotifications(req.params.userId);
        const unreadCount = notifs.filter(n => !n.read).length;
        res.json({ success: true, notifications: notifs, unreadCount });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.patch('/api/notifications/:id/read', async (req, res) => {
      try {
        const notif = await db.markNotificationRead(req.params.id);
        res.json({ success: true, notification: notif });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    // 7. ANALYTICS
    app.get('/api/analytics', async (req, res) => {
      try {
        const stats = await db.getAnalytics();
        res.json({ success: true, stats });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    // 8. AI CONFIG
    app.get('/api/ai/config', async (req, res) => {
      try {
        const config = await db.getLLMConfig(DEFAULT_LLM_CONFIG);
        res.json({ success: true, config });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.post('/api/ai/config', async (req, res) => {
      try {
        const updated = await db.updateLLMConfig(req.body);
        res.json({ success: true, config: updated });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.post('/api/ai/reset-config', async (req, res) => {
      try {
        const updated = await db.updateLLMConfig(DEFAULT_LLM_CONFIG);
        res.json({ success: true, config: updated });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    await new Promise((resolve) => {
      server = app.listen(TEST_PORT, () => {
        baseUrl = `http://127.0.0.1:${TEST_PORT}`;
        resolve();
      });
    });
    assert.ok(baseUrl, 'Test server running');
  });

  // Endpoints Testing
  await t.test('1. GET /api/jobs and Search/Filtering', async () => {
    // Basic get all
    const res = await fetch(`${baseUrl}/api/jobs`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.count >= 5);

    // Search query 'React'
    const searchRes = await fetch(`${baseUrl}/api/jobs?q=React`);
    const searchData = await searchRes.json();
    assert.ok(searchData.jobs.some(j => (j.title + ' ' + j.company + ' ' + (j.mustHaveSkills || []).join(' ')).toLowerCase().includes('react')));

    // Domain filter
    const domainRes = await fetch(`${baseUrl}/api/jobs?domain=Software%20%26%20Technology`);
    const domainData = await domainRes.json();
    assert.ok(domainData.jobs.every(j => j.domain.toLowerCase().includes('software')));

    // Fit match for candidate_1
    const fitRes = await fetch(`${baseUrl}/api/jobs?candidateId=candidate_1`);
    const fitData = await fitRes.json();
    assert.ok(fitData.jobs[0].candidateFit, 'Jobs should be enriched with candidateFit');
    assert.ok(fitData.jobs[0].candidateFit.matchScore >= 80, `Expected match score >= 80 for top fit, got ${fitData.jobs[0].candidateFit.matchScore}`);
  });

  await t.test('2. GET /api/jobs/:id (Detail & 404)', async () => {
    const res = await fetch(`${baseUrl}/api/jobs/job_1?candidateId=candidate_1`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.job.id, 'job_1');
    assert.ok(data.job.candidateFit, 'Expected candidate fit in job detail');

    const notFoundRes = await fetch(`${baseUrl}/api/jobs/non_existent_id`);
    assert.equal(notFoundRes.status, 404);
  });

  await t.test('3. POST /api/jobs/evaluate-jd (Live Evaluation)', async () => {
    const res = await fetch(`${baseUrl}/api/jobs/evaluate-jd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Lead Cloud Architect',
        responsibilities: [
          'Design resilient microservices architecture and cloud clusters',
          'Lead senior software engineering pods to meet 99.99% availability SLAs',
          'Optimize PostgreSQL clustering, query indexing and Redis caching',
          'Architect automated deployment pipelines and container security'
        ],
        salaryMin: 3000000,
        salaryMax: 4500000,
        mustHaveSkills: ['Node.js', 'PostgreSQL', 'AWS', 'System Design'],
        niceToHaveSkills: ['Docker', 'Kubernetes'],
        cultureMission: {
          mission: 'Resilient cloud infrastructure',
          values: ['Excellence', 'Transparency']
        },
        deiStatement: 'We celebrate diverse perspectives.',
        interviewProcess: [
          { stage: 1, title: 'Screening', duration: '30 mins' },
          { stage: 2, title: 'Architecture', duration: '60 mins' }
        ]
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.evaluation.score >= 80, `Expected score >= 80, got ${data.evaluation.score}`);
    assert.ok(data.evaluation.qualityRating);
  });

  await t.test('4. POST /api/jobs (Creation with Quality Assessment)', async () => {
    const testId = `job_api_post_${Date.now()}`;
    const res = await fetch(`${baseUrl}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testId,
        title: 'Principal AI Infrastructure Lead',
        company: 'NeuralCorp',
        domain: 'Software & Technology',
        salaryMin: 4000000,
        salaryMax: 6000000,
        mustHaveSkills: ['Python', 'PyTorch', 'PostgreSQL'],
        niceToHaveSkills: ['Docker'],
        responsibilities: [
          'Architect distributed AI neural training pipelines',
          'Optimize low-latency PostgreSQL vector storage',
          'Scale high-throughput model inference endpoints',
          'Lead core platform engineering team'
        ],
        cultureMission: { mission: 'Democratizing AI', values: ['Excellence'] },
        deiStatement: 'We welcome diverse backgrounds.',
        interviewProcess: [{ stage: 1, title: 'Screening', duration: '30 mins' }]
      })
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.job.id, testId);
    assert.ok(data.job.qualityScore >= 70, `Expected qualityScore >= 70, got ${data.job.qualityScore}`);

    // Clean up
    await query('DELETE FROM jobs WHERE id = $1', [testId]);
  });

  await t.test('5. Users & Skills Endpoints (GET, PUT, POST skill)', async () => {
    const res = await fetch(`${baseUrl}/api/users/candidate_1`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.user.id, 'candidate_1');
    assert.equal(data.user.name, 'Aarav Sharma');

    // PUT update bio & privacy settings
    const updateRes = await fetch(`${baseUrl}/api/users/candidate_1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preferredRemote: 'Hybrid',
        phone: '+91 98765 43210',
        privacySettings: { visibleToEmployers: true, showContactNumber: true, showTargetSalary: true }
      })
    });
    assert.equal(updateRes.status, 200);
    const updateData = await updateRes.json();
    assert.equal(updateData.user.preferredRemote, 'Hybrid');
    assert.equal(updateData.user.phone, '+91 98765 43210');
    assert.equal(updateData.user.privacySettings.visibleToEmployers, true);

    // POST skill endorsement
    const skillRes = await fetch(`${baseUrl}/api/users/candidate_1/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'System Design', level: 'Expert', verified: true })
    });
    assert.equal(skillRes.status, 200);
    const skillData = await skillRes.json();
    assert.ok(Array.isArray(skillData.skills));
    const sd = skillData.skills.find(s => s.name === 'System Design');
    assert.ok(sd && sd.endorsements >= 1);
  });

  await t.test('5b. User Registration (Email, Optional Phone, Role) & Login Flow', async () => {
    const testEmail = `new_candidate_${Date.now()}@pratibha.ai`;

    // 1. Register candidate with optional phone
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Mehra',
        email: testEmail,
        phone: '+91 98111 22233',
        password: 'rohan_secret_pass',
        role: 'candidate',
        headline: 'Lead Cloud Engineer',
        location: 'Pune, India',
        preferredRemote: 'Remote'
      })
    });
    assert.equal(regRes.status, 201);
    const regData = await regRes.json();
    assert.equal(regData.success, true);
    assert.equal(regData.user.name, 'Rohan Mehra');
    assert.equal(regData.user.email, testEmail);
    assert.equal(regData.user.phone, '+91 98111 22233');
    assert.equal(regData.user.role, 'candidate');

    // 2. Reject duplicate email registration
    const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Duplicate',
        email: testEmail,
        password: 'password123'
      })
    });
    assert.equal(dupRes.status, 409);

    // 3. Login with registered user
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'rohan_secret_pass'
      })
    });
    assert.equal(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.equal(loginData.success, true);
    assert.equal(loginData.user.email, testEmail);

    // Clean up created test user from database
    await query('DELETE FROM users WHERE email = $1', [testEmail]);
  });

  await t.test('6. Applications & ATS Endpoints Flow', async () => {
    const testAppJobId = `job_app_api_${Date.now()}`;
    const testAppCandId = `cand_app_api_${Date.now()}`;
    await query(`
      INSERT INTO jobs (id, title, company, domain, location, work_condition, job_type)
      VALUES ($1, 'Staff Architect', 'CloudScale', 'Software & Technology', 'Remote', 'Remote', 'Full-Time')
    `, [testAppJobId]);
    await query(`
      INSERT INTO users (id, role, name, email)
      VALUES ($1, 'candidate', 'API Tester', $2)
    `, [testAppCandId, `api_${Date.now()}@test.io`]);

    // Submit Application
    const applyRes = await fetch(`${baseUrl}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: testAppJobId,
        candidateId: testAppCandId,
        candidateNotes: 'Excited for the position'
      })
    });
    assert.equal(applyRes.status, 201);
    const applyData = await applyRes.json();
    const createdAppId = applyData.application.id;
    assert.equal(applyData.application.status, 'Applied');

    // Duplicate prevention
    const dupRes = await fetch(`${baseUrl}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: testAppJobId, candidateId: testAppCandId })
    });
    assert.equal(dupRes.status, 400);

    // Update Status
    const statusRes = await fetch(`${baseUrl}/api/applications/${createdAppId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Interview Scheduled',
        interviewStage: 'System Architecture',
        interviewLink: 'https://meet.google.com/test'
      })
    });
    assert.equal(statusRes.status, 200);
    const statusData = await statusRes.json();
    assert.equal(statusData.application.status, 'Interview Scheduled');

    // Submit Feedback
    const feedbackRes = await fetch(`${baseUrl}/api/applications/${createdAppId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        technicalScore: 10,
        cultureScore: 9,
        summary: 'Exemplary architectural acumen.'
      })
    });
    assert.equal(feedbackRes.status, 200);

    // Clean up
    await query('DELETE FROM applications WHERE id = $1', [createdAppId]);
    await query('DELETE FROM jobs WHERE id = $1', [testAppJobId]);
    await query('DELETE FROM users WHERE id = $1', [testAppCandId]);
  });

  await t.test('7. AI Interview Simulator & Evaluation Endpoints', async () => {
    // Generate questions
    const genRes = await fetch(`${baseUrl}/api/interview/generate-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: 'job_1', candidateId: 'candidate_1' })
    });
    assert.equal(genRes.status, 200);
    const genData = await genRes.json();
    assert.ok(genData.questions.length >= 3);

    // Evaluate response
    const evalRes = await fetch(`${baseUrl}/api/interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: genData.questions[0],
        userAnswer: 'I implement connection pool boundaries, circuit breaker patterns, and read-through caching in Redis.',
        jobId: 'job_1'
      })
    });
    assert.equal(evalRes.status, 200);
    const evalData = await evalRes.json();
    assert.ok(evalData.evaluation.score >= 70);
    assert.ok(evalData.evaluation.candidateFeedback);

    // Save mock interview session
    const saveRes = await fetch(`${baseUrl}/api/interview/save-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: 'candidate_1',
        jobId: 'job_1',
        overallScore: 89,
        questions: [{ id: 'q1', score: 90 }]
      })
    });
    assert.equal(saveRes.status, 201);
    const saveData = await saveRes.json();
    const sessionId = saveData.session.id;

    // Get mock interview history
    const historyRes = await fetch(`${baseUrl}/api/interview/history/candidate_1`);
    assert.equal(historyRes.status, 200);
    const historyData = await historyRes.json();
    assert.ok(historyData.interviews.some(s => s.id === sessionId));

    // Clean up
    await query('DELETE FROM mock_interviews WHERE id = $1', [sessionId]);
  });

  await t.test('8. Resume Bullet Optimization & Career Pathing', async () => {
    const bulletRes = await fetch(`${baseUrl}/api/resume/optimize-bullet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bullet: 'Optimized PostgreSQL database performance and indexing',
        targetRole: 'Senior Database Engineer'
      })
    });
    assert.equal(bulletRes.status, 200);
    const bulletData = await bulletRes.json();
    assert.ok(bulletData.result.suggestedEnhancement);
    assert.ok(bulletData.result.atsScoreImpact);

    const careerRes = await fetch(`${baseUrl}/api/career/pathing?candidateId=candidate_1`);
    assert.equal(careerRes.status, 200);
    const careerData = await careerRes.json();
    assert.ok(careerData.pathing.nextMilestoneRole);
    assert.ok(careerData.pathing.marketSalaryRange);
  });

  await t.test('9. Notifications Endpoints', async () => {
    const res = await fetch(`${baseUrl}/api/notifications/candidate_1`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.notifications));
    assert.equal(typeof data.unreadCount, 'number');

    if (data.notifications.length > 0) {
      const notifId = data.notifications[0].id;
      const readRes = await fetch(`${baseUrl}/api/notifications/${notifId}/read`, { method: 'PATCH' });
      assert.equal(readRes.status, 200);
      const readData = await readRes.json();
      assert.equal(readData.notification.read, true);
    }
  });

  await t.test('10. Analytics & Platform Metrics', async () => {
    const res = await fetch(`${baseUrl}/api/analytics`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.stats.totalJobs >= 5);
    assert.ok(data.stats.activeCandidates >= 2);
    assert.ok(data.stats.avgJdQualityScore >= 80);
    assert.ok(data.stats.medianTimeToHire);
  });

  await t.test('11. Modular AI / LLM Configuration API', async () => {
    const getRes = await fetch(`${baseUrl}/api/ai/config`);
    assert.equal(getRes.status, 200);
    const getData = await getRes.json();
    assert.ok(getData.config.provider);

    // Update config
    const updateRes = await fetch(`${baseUrl}/api/ai/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'llama.cpp',
        endpointUrl: 'http://127.0.0.1:8080',
        modelName: 'Qwen3-0.6B-Q4_K_M-Instruct.gguf',
        enabled: true
      })
    });
    assert.equal(updateRes.status, 200);

    // Reset config
    const resetRes = await fetch(`${baseUrl}/api/ai/reset-config`, { method: 'POST' });
    assert.equal(resetRes.status, 200);
  });

  // Teardown test server
  await t.test('99. Teardown Test Express Server', async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
    await pool.end();
  });
});
