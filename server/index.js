import express from 'express';
import cors from 'cors';
import { db, getStore, saveStore, checkPostgresStatus } from './db.js';
import {
  evaluateJobDescription,
  calculateCandidateFit,
  generateJDInterviewQuestions,
  evaluateInterviewResponse,
  optimizeResumeBullet,
  generateCareerPathing,
  parseLinkedInProfile,
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
app.get('/api/jobs', async (req, res) => {
  try {
    const {
      q,
      domain,
      experienceLevel,
      workCondition,
      jobType,
      location,
      candidateId
    } = req.query;

    const allJobs = await db.getJobs();
    let candidate = null;
    if (candidateId) {
      candidate = await db.getUserById(candidateId);
    }

    let filtered = allJobs.map(job => {
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
        (j.title || '').toLowerCase().includes(term) ||
        (j.company || '').toLowerCase().includes(term) ||
        (j.mustHaveSkills || []).some(s => s.toLowerCase().includes(term)) ||
        (j.summary || '').toLowerCase().includes(term)
      );
    }

    // Domain filter
    if (domain && domain !== 'All') {
      filtered = filtered.filter(j => (j.domain || '').toLowerCase() === domain.toLowerCase());
    }

    // Experience level filter (e.g. '4-6 years')
    if (experienceLevel && experienceLevel !== 'All') {
      filtered = filtered.filter(j => (j.experienceLevel || '').toLowerCase().includes(experienceLevel.toLowerCase()));
    }

    // Work Condition (Remote, Hybrid, In-Office)
    if (workCondition && workCondition !== 'All') {
      filtered = filtered.filter(j => (j.workCondition || '').toLowerCase() === workCondition.toLowerCase());
    }

    // Job Type (Full-Time, Part-Time, Contract, Internship)
    if (jobType && jobType !== 'All') {
      filtered = filtered.filter(j => (j.jobType || '').toLowerCase() === jobType.toLowerCase());
    }

    // Location filter
    if (location && location !== 'All') {
      filtered = filtered.filter(j => (j.location || '').toLowerCase().includes(location.toLowerCase()));
    }

    // Sort: Featured first, then highest fit (if candidate), then newest
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
    console.error('Error fetching jobs:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single job with full JD assessment
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await db.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const { candidateId } = req.query;
    let candidateFit = null;
    if (candidateId) {
      const candidate = await db.getUserById(candidateId);
      if (candidate) {
        candidateFit = calculateCandidateFit(job, candidate);
      }
    }

    res.json({ success: true, job: { ...job, candidateFit } });
  } catch (err) {
    console.error('Error fetching job details:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Live Parameterized JD Quality Evaluation endpoint (for Hiring Managers during drafting)
app.post('/api/jobs/evaluate-jd', (req, res) => {
  const evaluation = evaluateJobDescription(req.body);
  res.json({ success: true, evaluation });
});

// Create new job posting with automatic Parameterized Assessment
app.post('/api/jobs', async (req, res) => {
  try {
    const jobData = req.body;

    // Run Parameterized Evaluation
    const evalResult = evaluateJobDescription(jobData);

    const newJob = {
      id: jobData.id || `job_${Date.now()}`,
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

    const savedJob = await db.createJob(newJob);
    res.status(201).json({ success: true, job: savedJob });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 2. AUTHENTICATION & USER PROFILES
// ==========================================

// Register a new user (Candidate or Employer) with email, optional phone & profile details
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role = 'candidate', headline, location, preferredRemote } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Name and email are required fields.' });
    }

    // Check if user already exists
    const existing = await db.getUserByEmail(email.trim());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    const newUser = await db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      password: password || 'pratibha_secure',
      role: role === 'employer' ? 'employer' : 'candidate',
      headline: headline || (role === 'employer' ? 'Hiring Lead' : 'Job Seeker & Professional'),
      location: location || 'Bengaluru, India',
      preferredRemote: preferredRemote || 'Hybrid',
      privacySettings: {
        visibleToEmployers: true,
        showContactNumber: Boolean(phone),
        showTargetSalary: true
      }
    });

    // Send a welcoming real-time notification
    try {
      await db.createNotification({
        userId: newUser.id,
        title: 'Welcome to Pratibha! 🌟',
        message: 'Your profile has been created. Add your skills and preferences to unlock 95%+ precision job matches.',
        type: 'welcome',
        actionUrl: '/profile'
      });
    } catch (notifErr) {
      console.warn('Welcome notification warning:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Pratibha.',
      user: newUser
    });
  } catch (err) {
    console.error('Error in registration:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login user with email & password
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const user = await db.getUserByEmail(email.trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with this email address.' });
    }

    // If password check is requested
    if (password && user.password && user.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password entered.' });
    }

    res.json({ success: true, message: 'Welcome back!', user });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json({ success: true, users });
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user profile
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
  try {
    const updated = await db.updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: updated });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endorse or add a skill
app.post('/api/users/:id/skills', async (req, res) => {
  try {
    const { name, level = 'Intermediate', verified = false } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Skill name required' });

    const skills = await db.addOrEndorseSkill(req.params.id, { name, level, verified });
    if (!skills) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, skills });
  } catch (err) {
    console.error('Error adding skill:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Parse LinkedIn profile (preview before saving)
app.post('/api/linkedin/parse', async (req, res) => {
  try {
    const { url, rawText, manualData, userId } = req.body;
    let currentUser = {};
    if (userId) {
      currentUser = (await db.getUserById(userId)) || {};
    }
    const parsed = await parseLinkedInProfile({ url, rawText, manualData, currentProfile: currentUser });
    res.json({ success: true, profile: parsed });
  } catch (err) {
    console.error('Error parsing LinkedIn profile:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Import LinkedIn profile directly into Candidate user record
app.post('/api/users/:id/import-linkedin', async (req, res) => {
  try {
    const { url, rawText, parsedData } = req.body;
    const user = await db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let imported = parsedData;
    if (!imported) {
      imported = await parseLinkedInProfile({ url, rawText, currentProfile: user });
    }

    // Merge strategy: enrich user profile with verified LinkedIn data
    const updates = {
      name: imported.name || user.name,
      headline: imported.headline || user.headline,
      location: imported.location || user.location,
      bio: imported.bio || user.bio,
      skills: (imported.skills && imported.skills.length > 0) ? imported.skills : user.skills,
      experience: (imported.experience && imported.experience.length > 0) ? imported.experience : user.experience,
      education: (imported.education && imported.education.length > 0) ? imported.education : user.education,
      projects: (imported.projects && imported.projects.length > 0) ? imported.projects : user.projects,
      socialLinks: {
        ...(user.socialLinks || {}),
        linkedin: imported.linkedinUrl || url || user.socialLinks?.linkedin || ''
      },
      resumeDetails: {
        ...(user.resumeDetails || {}),
        linkedinSynced: true,
        linkedinUrl: imported.linkedinUrl || url,
        lastSyncedAt: new Date().toISOString()
      }
    };

    const updated = await db.updateUser(req.params.id, updates);

    // Create a real-time notification
    try {
      await db.createNotification({
        userId: user.id,
        title: 'LinkedIn Profile Successfully Synced! 🚀',
        message: `Imported ${updates.skills.length} skills and ${updates.experience.length} career positions from LinkedIn.`,
        type: 'profile_sync',
        actionUrl: '/profile'
      });
    } catch (notifErr) {
      console.warn('Sync notification warning:', notifErr.message);
    }

    res.json({
      success: true,
      message: 'LinkedIn profile imported successfully!',
      user: updated,
      importedData: imported
    });
  } catch (err) {
    console.error('Error importing LinkedIn profile:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 3. APPLICATIONS & HIRING ATS APIS
// ==========================================

// Get applications
app.get('/api/applications', async (req, res) => {
  try {
    const { candidateId, jobId } = req.query;
    const apps = await db.getApplications({ candidateId, jobId });
    const allJobs = await db.getJobs();
    const allUsers = await db.getUsers();

    // Populate job and candidate details
    const enriched = apps.map(appItem => {
      const job = allJobs.find(j => j.id === appItem.jobId);
      const candidate = allUsers.find(u => u.id === appItem.candidateId);
      return {
        ...appItem,
        job,
        candidate
      };
    });

    res.json({ success: true, applications: enriched });
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Submit job application
app.post('/api/applications', async (req, res) => {
  try {
    const { jobId, candidateId, candidateNotes } = req.body;

    if (!jobId || !candidateId) {
      return res.status(400).json({ success: false, message: 'jobId and candidateId are required' });
    }

    // Check existing application
    const existingList = await db.getApplications({ candidateId, jobId });
    if (existingList.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already applied to this position' });
    }

    const job = await db.getJobById(jobId);
    const candidate = await db.getUserById(candidateId);

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

    const savedApp = await db.createApplication(newApp);

    // Send real-time notification to employer
    await db.createNotification({
      id: `notif_${Date.now()}`,
      userId: job?.postedBy || 'employer_1',
      title: `New Candidate Application: ${job?.title || 'Job'}`,
      message: `${candidate?.name || 'A candidate'} (${fit.matchScore}% Fit) applied for ${job?.title}.`,
      type: 'application',
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: '/ats'
    });

    res.status(201).json({ success: true, application: savedApp });
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update Application Status (ATS Workflow)
app.patch('/api/applications/:id/status', async (req, res) => {
  try {
    const { status, interviewDate, interviewStage, interviewLink } = req.body;
    const updated = await db.updateApplicationStatus(req.params.id, {
      status,
      interviewDate,
      interviewStage,
      interviewLink
    });

    if (!updated) return res.status(404).json({ success: false, message: 'Application not found' });

    const job = await db.getJobById(updated.jobId);

    // Notify candidate of status change
    await db.createNotification({
      id: `notif_${Date.now()}`,
      userId: updated.candidateId,
      title: `Application Update: ${job?.title || 'Position'}`,
      message: status === 'Interview Scheduled'
        ? `Interview scheduled for ${job?.title} on ${new Date(interviewDate || Date.now()).toLocaleDateString()} for stage: ${interviewStage || 'Next Round'}.`
        : `Your application status for ${job?.title} changed to: ${status}.`,
      type: status === 'Interview Scheduled' ? 'interview' : 'status_update',
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: '/applications'
    });

    res.json({ success: true, application: updated });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Submit Employer Feedback on Candidate against JD
app.post('/api/applications/:id/feedback', async (req, res) => {
  try {
    const { technicalScore, cultureScore, communicationScore, strengths, areasOfImprovement, summary } = req.body;
    const feedback = {
      technicalScore: Number(technicalScore) || 8,
      cultureScore: Number(cultureScore) || 8,
      communicationScore: Number(communicationScore) || 8,
      strengths: strengths || '',
      areasOfImprovement: areasOfImprovement || '',
      summary: summary || '',
      submittedAt: new Date().toISOString()
    };

    const savedFeedback = await db.saveEmployerFeedback(req.params.id, feedback);
    if (!savedFeedback) return res.status(404).json({ success: false, message: 'Application not found' });

    const appItem = await db.getApplicationById(req.params.id);
    const job = appItem ? await db.getJobById(appItem.jobId) : null;

    // Notify candidate
    if (appItem) {
      await db.createNotification({
        id: `notif_${Date.now()}`,
        userId: appItem.candidateId,
        title: `Constructive Feedback Received: ${job?.title || 'Application'}`,
        message: `${job?.company || 'The employer'} left detailed interview and profile feedback to assist your professional growth.`,
        type: 'feedback',
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/applications'
      });
    }

    res.json({ success: true, feedback: savedFeedback });
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 4. AI INTERVIEW COACH & FEEDBACK APIS
// ==========================================

// Generate JD-tailored interview questions
app.post('/api/interview/generate-questions', async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;
    const allJobs = await db.getJobs();
    const allUsers = await db.getUsers();

    const job = (jobId ? await db.getJobById(jobId) : null) || allJobs[0];
    const candidate = (candidateId ? await db.getUserById(candidateId) : null) || allUsers[0];

    const questions = generateJDInterviewQuestions(job, candidate);
    res.json({ success: true, jobTitle: job?.title || 'Software Role', questions });
  } catch (err) {
    console.error('Error generating questions:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Evaluate Candidate Answer against JD Criteria (using local LLM)
app.post('/api/interview/evaluate', async (req, res) => {
  try {
    const { question, userAnswer, jobId } = req.body;
    const allJobs = await db.getJobs();
    const job = (jobId ? await db.getJobById(jobId) : null) || allJobs[0];

    const evaluation = await evaluateInterviewResponse(question, userAnswer, job);
    res.json({ success: true, evaluation });
  } catch (err) {
    console.error('Error evaluating response:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Save completed mock interview session
app.post('/api/interview/save-session', async (req, res) => {
  try {
    const { candidateId, jobId, overallScore, questions } = req.body;
    const job = jobId ? await db.getJobById(jobId) : null;

    const session = {
      id: `mock_${Date.now()}`,
      candidateId: candidateId || 'candidate_1',
      jobId: jobId || 'job_1',
      jobTitle: job?.title || 'Software Role',
      date: new Date().toISOString().split('T')[0],
      overallScore: overallScore || 85,
      status: 'Completed',
      questions: questions || []
    };

    const saved = await db.saveMockInterview(session);
    res.status(201).json({ success: true, session: saved });
  } catch (err) {
    console.error('Error saving interview session:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user mock interviews
app.get('/api/interview/history/:candidateId', async (req, res) => {
  try {
    const list = await db.getMockInterviewHistory(req.params.candidateId);
    res.json({ success: true, interviews: list });
  } catch (err) {
    console.error('Error fetching interview history:', err);
    res.status(500).json({ success: false, message: err.message });
  }
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
  const config = await db.getLLMConfig(DEFAULT_LLM_CONFIG);
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
  const config = await db.getLLMConfig(DEFAULT_LLM_CONFIG);
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
app.post('/api/ai/config', async (req, res) => {
  try {
    const { provider, endpointUrl, modelName, enabled, parameters } = req.body;

    const newConfig = {
      provider: provider || 'llama.cpp',
      endpointUrl: endpointUrl || 'http://127.0.0.1:8080',
      modelName: modelName || 'Qwen3-0.6B-Q4_K_M-Instruct.gguf',
      enabled: enabled !== undefined ? Boolean(enabled) : true,
      parameters: typeof parameters === 'string' ? parameters : JSON.stringify(parameters, null, 2)
    };

    const updated = await db.updateLLMConfig(newConfig);
    res.json({ success: true, config: updated });
  } catch (err) {
    console.error('Error updating LLM config:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Test connection with supplied LLM configuration on-demand
app.post('/api/ai/test-connection', async (req, res) => {
  const result = await testLLMConnection(req.body);
  res.json(result);
});

// Reset LLM configuration to default local 0.6B llama.cpp
app.post('/api/ai/reset-config', async (req, res) => {
  try {
    const updated = await db.updateLLMConfig(DEFAULT_LLM_CONFIG);
    res.json({ success: true, config: updated });
  } catch (err) {
    console.error('Error resetting LLM config:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Career Pathing & Salary Benchmark
app.get('/api/career/pathing', async (req, res) => {
  try {
    const { candidateId } = req.query;
    const allUsers = await db.getUsers();
    const candidate = (candidateId ? await db.getUserById(candidateId) : null) || allUsers[0];

    const pathing = generateCareerPathing(candidate?.skills || [], candidate?.currentRole || '');
    res.json({ success: true, pathing });
  } catch (err) {
    console.error('Error generating career pathing:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 6. NOTIFICATIONS APIS
// ==========================================

// Get notifications for a user
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const userNotifs = await db.getNotifications(req.params.userId);
    const unreadCount = userNotifs.filter(n => !n.read).length;
    res.json({ success: true, notifications: userNotifs, unreadCount });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mark notification as read
app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notif = await db.markNotificationRead(req.params.id);
    res.json({ success: true, notification: notif });
  } catch (err) {
    console.error('Error marking notification read:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 7. ANALYTICS & PLATFORM METRICS API
// ==========================================
app.get('/api/analytics', async (req, res) => {
  try {
    const stats = await db.getAnalytics();
    res.json({ success: true, stats });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve production built client if present
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// Check database backend status on startup
checkPostgresStatus().then((connected) => {
  if (connected) {
    console.log(`[Database Engine] Connected to PostgreSQL on ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'pratibha'}`);
  } else {
    console.warn(`[Database Engine Notice] PostgreSQL not connected. Running in modular fallback mode with store.json.`);
  }
});

app.listen(PORT, () => {
  console.log(`Pratibha Backend API server running on http://localhost:${PORT}`);
});
