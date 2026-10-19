import express from 'express';
import cors from 'cors';
import { getStore, saveStore } from './db.js';
import {
  evaluateJobDescription,
  calculateCandidateFit,
  generateJDInterviewQuestions,
  evaluateInterviewResponse,
  optimizeResumeBullet,
  generateCareerPathing,
  DEFAULT_LLM_CONFIG,
  getActiveLLMConfig,
  testLLMConnection
} from './services/aiEngine.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// 1. JOBS & PARAMETERIZED JD SCORING APIS
// ==========================================

// Get all jobs with multi-faceted filtering & AI candidate fit matching
app.get('/api/jobs', (req, res) => {
  const store = getStore();
  const {
    q,
    domain,
    experienceLevel,
    workCondition,
    jobType,
    location,
    candidateId
  } = req.query;

  let candidate = null;
  if (candidateId) {
    candidate = store.users.find(u => u.id === candidateId);
  }

  let filtered = store.jobs.map(job => {
    let fitData = null;
    if (candidate) {
      fitData = calculateCandidateFit(job, candidate);
    }
    return {
      ...job,
      candidateFit: fitData
    };
  });

  // Query search
  if (q) {
    const term = q.toLowerCase();
    filtered = filtered.filter(j =>
      j.title.toLowerCase().includes(term) ||
      j.company.toLowerCase().includes(term) ||
      (j.mustHaveSkills || []).some(s => s.toLowerCase().includes(term)) ||
      (j.summary || '').toLowerCase().includes(term)
    );
  }

  // Domain filter
  if (domain && domain !== 'All') {
    filtered = filtered.filter(j => j.domain.toLowerCase() === domain.toLowerCase());
  }

  // Experience level filter (e.g. '4-6 years')
  if (experienceLevel && experienceLevel !== 'All') {
    filtered = filtered.filter(j => j.experienceLevel.toLowerCase().includes(experienceLevel.toLowerCase()));
  }

  // Work Condition (Remote, Hybrid, In-Office)
  if (workCondition && workCondition !== 'All') {
    filtered = filtered.filter(j => j.workCondition.toLowerCase() === workCondition.toLowerCase());
  }

  // Job Type (Full-Time, Part-Time, Contract, Internship)
  if (jobType && jobType !== 'All') {
    filtered = filtered.filter(j => j.jobType.toLowerCase() === jobType.toLowerCase());
  }

  // Location filter
  if (location && location !== 'All') {
    filtered = filtered.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
  }

  // Sort: Featured first, then highest fit (if candidate), then newest
  filtered.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (a.candidateFit && b.candidateFit) {
      return b.candidateFit.matchScore - a.candidateFit.matchScore;
    }
    return new Date(b.postedDate) - new Date(a.postedDate);
  });

  res.json({ success: true, count: filtered.length, jobs: filtered });
});

// Get single job with full JD assessment
app.get('/api/jobs/:id', (req, res) => {
  const store = getStore();
  const job = store.jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  const { candidateId } = req.query;
  let candidateFit = null;
  if (candidateId) {
    const candidate = store.users.find(u => u.id === candidateId);
    if (candidate) {
      candidateFit = calculateCandidateFit(job, candidate);
    }
  }

  res.json({ success: true, job: { ...job, candidateFit } });
});

// Live Parameterized JD Quality Evaluation endpoint (for Hiring Managers during drafting)
app.post('/api/jobs/evaluate-jd', (req, res) => {
  const evaluation = evaluateJobDescription(req.body);
  res.json({ success: true, evaluation });
});

// Create new job posting with automatic Parameterized Assessment
app.post('/api/jobs', (req, res) => {
  const store = getStore();
  const jobData = req.body;

  // Run Parameterized Evaluation
  const evalResult = evaluateJobDescription(jobData);

  const newJob = {
    id: `job_${Date.now()}`,
    title: jobData.title || 'Untitled Role',
    company: jobData.company || 'Innovative Enterprise',
    postedBy: jobData.postedBy || 'employer_1',
    logo: jobData.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    domain: jobData.domain || 'Software & Technology',
    location: jobData.location || 'Remote',
    workCondition: jobData.workCondition || 'Remote',
    jobType: jobData.jobType || 'Full-Time',
    experienceLevel: jobData.experienceLevel || '3-5 years',
    minExpYears: parseInt(jobData.minExpYears || 3, 10),
    maxExpYears: parseInt(jobData.maxExpYears || 5, 10),
    salaryMin: parseInt(jobData.salaryMin || 2000000, 10),
    salaryMax: parseInt(jobData.salaryMax || 3500000, 10),
    salaryFormatted: jobData.salaryFormatted || `₹${jobData.salaryMin?.toLocaleString() || '20,00,000'} - ₹${jobData.salaryMax?.toLocaleString() || '35,00,000'} / year`,
    isSalaryTransparent: Boolean(jobData.salaryMin && jobData.salaryMax),
    postedDate: new Date().toISOString().split('T')[0],
    deadline: jobData.deadline || '2026-12-31',
    isFeatured: Boolean(jobData.isFeatured),
    qualityScore: evalResult.score,
    qualityRating: evalResult.qualityRating,
    qualityBreakdown: evalResult.breakdown,
    qualityFeedbackTips: evalResult.feedbackTips,
    summary: jobData.summary || '',
    responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities : (jobData.responsibilities ? jobData.responsibilities.split('\n').filter(Boolean) : []),
    mustHaveSkills: Array.isArray(jobData.mustHaveSkills) ? jobData.mustHaveSkills : (jobData.mustHaveSkills ? jobData.mustHaveSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
    niceToHaveSkills: Array.isArray(jobData.niceToHaveSkills) ? jobData.niceToHaveSkills : (jobData.niceToHaveSkills ? jobData.niceToHaveSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
    workConditionsDetail: jobData.workConditionsDetail || {
      weeklyHours: 40,
      schedule: 'Flexible core hours',
      perks: ['Comprehensive Health Insurance', 'Annual Learning Stipend']
    },
    cultureMission: jobData.cultureMission || {
      mission: 'Empowering innovation through transparent collaboration.',
      values: ['Excellence', 'Transparency', 'Inclusive Growth']
    },
    deiStatement: jobData.deiStatement || 'We are an equal opportunity employer committed to a diverse workforce.',
    interviewProcess: jobData.interviewProcess || [
      { stage: 1, title: 'Screening Call', duration: '30 mins' },
      { stage: 2, title: 'Technical Deep-Dive', duration: '60 mins' },
      { stage: 3, title: 'Leadership & Team Fit', duration: '45 mins' }
    ]
  };

  store.jobs.unshift(newJob);
  saveStore(store);

  res.status(201).json({ success: true, job: newJob });
});

// ==========================================
// 2. USER PROFILES & RESUME APIS
// ==========================================

// Get user profile
app.get('/api/users/:id', (req, res) => {
  const store = getStore();
  const user = store.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user });
});

// Update user profile
app.put('/api/users/:id', (req, res) => {
  const store = getStore();
  const index = store.users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  store.users[index] = { ...store.users[index], ...req.body };
  saveStore(store);
  res.json({ success: true, user: store.users[index] });
});

// Endorse or add a skill
app.post('/api/users/:id/skills', (req, res) => {
  const store = getStore();
  const user = store.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const { name, level = 'Intermediate', verified = false } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Skill name required' });

  const existingSkill = (user.skills || []).find(s => s.name.toLowerCase() === name.toLowerCase());
  if (existingSkill) {
    existingSkill.endorsements = (existingSkill.endorsements || 0) + 1;
  } else {
    user.skills = user.skills || [];
    user.skills.push({ name, level, verified, endorsements: 1 });
  }

  saveStore(store);
  res.json({ success: true, skills: user.skills });
});

// ==========================================
// 3. APPLICATIONS & HIRING ATS APIS
// ==========================================

// Get applications
app.get('/api/applications', (req, res) => {
  const store = getStore();
  const { candidateId, jobId } = req.query;
  let apps = [...store.applications];

  if (candidateId) {
    apps = apps.filter(a => a.candidateId === candidateId);
  }
  if (jobId) {
    apps = apps.filter(a => a.jobId === jobId);
  }

  // Populate job and candidate details
  const enriched = apps.map(app => {
    const job = store.jobs.find(j => j.id === app.jobId);
    const candidate = store.users.find(u => u.id === app.candidateId);
    return {
      ...app,
      job,
      candidate
    };
  });

  res.json({ success: true, applications: enriched });
});

// Submit job application
app.post('/api/applications', (req, res) => {
  const store = getStore();
  const { jobId, candidateId, candidateNotes } = req.body;

  if (!jobId || !candidateId) {
    return res.status(400).json({ success: false, message: 'jobId and candidateId are required' });
  }

  // Check existing application
  const existing = store.applications.find(a => a.jobId === jobId && a.candidateId === candidateId);
  if (existing) {
    return res.status(400).json({ success: false, message: 'You have already applied to this position' });
  }

  const job = store.jobs.find(j => j.id === jobId);
  const candidate = store.users.find(u => u.id === candidateId);

  const fit = calculateCandidateFit(job, candidate);

  const newApp = {
    id: `app_${Date.now()}`,
    jobId,
    candidateId,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    candidateNotes: candidateNotes || '',
    matchScore: fit.matchScore,
    employerFeedback: null
  };

  store.applications.unshift(newApp);

  // Send real-time notification to employer
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: job?.postedBy || 'employer_1',
    title: `New Candidate Application: ${job?.title || 'Job'}`,
    message: `${candidate?.name || 'A candidate'} (${fit.matchScore}% Fit) applied for ${job?.title}.`,
    type: 'application',
    timestamp: new Date().toISOString(),
    read: false,
    actionUrl: '/ats'
  });

  saveStore(store);

  res.status(201).json({ success: true, application: newApp });
});

// Update Application Status (ATS Workflow)
app.patch('/api/applications/:id/status', (req, res) => {
  const store = getStore();
  const app = store.applications.find(a => a.id === req.params.id);
  if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

  const { status, interviewDate, interviewStage, interviewLink } = req.body;
  if (status) app.status = status;
  if (interviewDate) app.interviewDate = interviewDate;
  if (interviewStage) app.interviewStage = interviewStage;
  if (interviewLink) app.interviewLink = interviewLink;

  const job = store.jobs.find(j => j.id === app.jobId);

  // Notify candidate of status change
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: app.candidateId,
    title: `Application Update: ${job?.title || 'Position'}`,
    message: status === 'Interview Scheduled'
      ? `Interview scheduled for ${job?.title} on ${new Date(interviewDate || Date.now()).toLocaleDateString()} for stage: ${interviewStage || 'Next Round'}.`
      : `Your application status for ${job?.title} changed to: ${status}.`,
    type: status === 'Interview Scheduled' ? 'interview' : 'status_update',
    timestamp: new Date().toISOString(),
    read: false,
    actionUrl: '/applications'
  });

  saveStore(store);
  res.json({ success: true, application: app });
});

// Submit Employer Feedback on Candidate against JD
app.post('/api/applications/:id/feedback', (req, res) => {
  const store = getStore();
  const app = store.applications.find(a => a.id === req.params.id);
  if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

  const { technicalScore, cultureScore, communicationScore, strengths, areasOfImprovement, summary } = req.body;
  
  app.employerFeedback = {
    technicalScore: Number(technicalScore) || 8,
    cultureScore: Number(cultureScore) || 8,
    communicationScore: Number(communicationScore) || 8,
    strengths: strengths || '',
    areasOfImprovement: areasOfImprovement || '',
    summary: summary || '',
    submittedAt: new Date().toISOString()
  };

  const job = store.jobs.find(j => j.id === app.jobId);

  // Notify candidate
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: app.candidateId,
    title: `Constructive Feedback Received: ${job?.title}`,
    message: `${job?.company || 'The employer'} left detailed interview and profile feedback to assist your professional growth.`,
    type: 'feedback',
    timestamp: new Date().toISOString(),
    read: false,
    actionUrl: '/applications'
  });

  saveStore(store);
  res.json({ success: true, feedback: app.employerFeedback });
});

// ==========================================
// 4. AI INTERVIEW COACH & FEEDBACK APIS
// ==========================================

// Generate JD-tailored interview questions
app.post('/api/interview/generate-questions', (req, res) => {
  const store = getStore();
  const { jobId, candidateId } = req.body;
  const job = store.jobs.find(j => j.id === jobId) || store.jobs[0];
  const candidate = store.users.find(u => u.id === candidateId) || store.users[0];

  const questions = generateJDInterviewQuestions(job, candidate);
  res.json({ success: true, jobTitle: job.title, questions });
});

// Evaluate Candidate Answer against JD Criteria
// Evaluate Candidate Answer against JD Criteria (using local LLM)
app.post('/api/interview/evaluate', async (req, res) => {
  const store = getStore();
  const { question, userAnswer, jobId } = req.body;
  const job = store.jobs.find(j => j.id === jobId) || store.jobs[0];

  const evaluation = await evaluateInterviewResponse(question, userAnswer, job);
  res.json({ success: true, evaluation });
});

// Save completed mock interview session
app.post('/api/interview/save-session', (req, res) => {
  const store = getStore();
  const { candidateId, jobId, overallScore, questions } = req.body;

  const session = {
    id: `mock_${Date.now()}`,
    candidateId: candidateId || 'candidate_1',
    jobId: jobId || 'job_1',
    jobTitle: store.jobs.find(j => j.id === jobId)?.title || 'Software Role',
    date: new Date().toISOString().split('T')[0],
    overallScore: overallScore || 85,
    status: 'Completed',
    questions: questions || []
  };

  store.mockInterviews = store.mockInterviews || [];
  store.mockInterviews.unshift(session);
  saveStore(store);

  res.status(201).json({ success: true, session });
});

// Get user mock interviews
app.get('/api/interview/history/:candidateId', (req, res) => {
  const store = getStore();
  const list = (store.mockInterviews || []).filter(m => m.candidateId === req.params.candidateId);
  res.json({ success: true, interviews: list });
});

// ==========================================
// 5. RESUME OPTIMIZER & CAREER GUIDANCE APIS
// ==========================================

// AI Resume Bullet Point Enhancer (using local LLM)
app.post('/api/resume/optimize-bullet', async (req, res) => {
  const { bullet, targetRole } = req.body;
  const result = await optimizeResumeBullet(bullet, targetRole);
  res.json({ success: true, result });
});

// Local / Modular LLM Engine Status
app.get('/api/ai/status', async (req, res) => {
  const config = getActiveLLMConfig();
  const endpointUrl = (config.endpointUrl || 'http://127.0.0.1:8080').replace(/\/+$/, '');
  try {
    const check = await fetch(`${endpointUrl}/v1/models`);
    if (check.ok) {
      const data = await check.json();
      return res.json({
        success: true,
        llm: {
          running: true,
          provider: config.provider || 'llama.cpp',
          model: config.modelName || 'Qwen3-0.6B-Q4_K_M-Instruct.gguf',
          endpoint: endpointUrl,
          models: data.data || []
        }
      });
    }
  } catch (err) {
    // not responding
  }
  res.json({
    success: true,
    llm: {
      running: false,
      provider: config.provider || 'llama.cpp',
      endpoint: endpointUrl,
      status: 'offline or starting'
    }
  });
});

// Get modular LLM configuration
app.get('/api/ai/config', async (req, res) => {
  const store = getStore();
  const config = store.llmConfig || DEFAULT_LLM_CONFIG;
  let detectedModels = [];
  try {
    const endpointUrl = (config.endpointUrl || 'http://127.0.0.1:8080').replace(/\/+$/, '');
    const check = await fetch(`${endpointUrl}/v1/models`);
    if (check.ok) {
      const data = await check.json();
      detectedModels = (data.data || []).map(m => m.id);
    }
  } catch (err) {}

  res.json({
    success: true,
    config,
    detectedModels
  });
});

// Update modular LLM configuration from UI
app.post('/api/ai/config', (req, res) => {
  const store = getStore();
  const { provider, endpointUrl, modelName, enabled, parameters } = req.body;

  store.llmConfig = {
    provider: provider || 'llama.cpp',
    endpointUrl: endpointUrl || 'http://127.0.0.1:8080',
    modelName: modelName || 'Qwen3-0.6B-Q4_K_M-Instruct.gguf',
    enabled: enabled !== undefined ? Boolean(enabled) : true,
    parameters: typeof parameters === 'string' ? parameters : JSON.stringify(parameters, null, 2)
  };

  saveStore(store);
  res.json({ success: true, config: store.llmConfig });
});

// Test connection with supplied LLM configuration on-demand
app.post('/api/ai/test-connection', async (req, res) => {
  const result = await testLLMConnection(req.body);
  res.json(result);
});

// Reset LLM configuration to default local 0.6B llama.cpp
app.post('/api/ai/reset-config', (req, res) => {
  const store = getStore();
  store.llmConfig = { ...DEFAULT_LLM_CONFIG };
  saveStore(store);
  res.json({ success: true, config: store.llmConfig });
});

// Career Pathing & Salary Benchmark
app.get('/api/career/pathing', (req, res) => {
  const store = getStore();
  const { candidateId } = req.query;
  const candidate = store.users.find(u => u.id === candidateId) || store.users[0];

  const pathing = generateCareerPathing(candidate.skills, candidate.currentRole);
  res.json({ success: true, pathing });
});

// ==========================================
// 6. NOTIFICATIONS APIS
// ==========================================

// Get notifications for a user
app.get('/api/notifications/:userId', (req, res) => {
  const store = getStore();
  const userNotifs = (store.notifications || []).filter(n => n.userId === req.params.userId);
  const unreadCount = userNotifs.filter(n => !n.read).length;
  res.json({ success: true, notifications: userNotifs, unreadCount });
});

// Mark notification as read
app.patch('/api/notifications/:id/read', (req, res) => {
  const store = getStore();
  const notif = (store.notifications || []).find(n => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    saveStore(store);
  }
  res.json({ success: true, notification: notif });
});

// ==========================================
// 7. ANALYTICS & PLATFORM METRICS API
// ==========================================
app.get('/api/analytics', (req, res) => {
  const store = getStore();
  const totalJobs = store.jobs.length;
  const avgJdQuality = Math.round(store.jobs.reduce((acc, j) => acc + (j.qualityScore || 85), 0) / (totalJobs || 1));
  const totalApplications = store.applications.length;
  const avgMatchScore = Math.round(store.applications.reduce((acc, a) => acc + (a.matchScore || 80), 0) / (totalApplications || 1));

  res.json({
    success: true,
    stats: {
      totalJobs,
      activeCandidates: store.users.filter(u => u.role === 'candidate').length,
      totalApplications,
      avgJdQualityScore: avgJdQuality,
      avgApplicantMatchRate: `${avgMatchScore}%`,
      interviewConversionRate: '42.8%',
      medianTimeToHire: '14 Days (60% faster with AI screening)',
      unqualifiedDropReduction: '71%'
    }
  });
});

// Serve production built client if present
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Pratibha Backend API server running on http://localhost:${PORT}`);
});
