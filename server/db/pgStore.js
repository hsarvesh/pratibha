import { query, pool } from './config.js';

// Convert SQL row to Candidate/Employer object
export function formatUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    phone: row.phone || null,
    headline: row.headline,
    location: row.location,
    preferredRemote: row.preferred_remote,
    yearsOfExperience: Number(row.years_of_experience) || 0,
    currentRole: row.current_role,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    targetSalary: row.target_salary,
    careerGoals: row.career_goals,
    subscriptionTier: row.subscription_tier,
    company: row.company,
    companyDetails: row.company_details || {},
    skills: row.skills || [],
    experience: row.experience || [],
    education: row.education || [],
    certifications: row.certifications || [],
    projects: row.projects || [],
    privacySettings: row.privacy_settings || { visibleToEmployers: true, showContactNumber: true, showTargetSalary: true },
    socialLinks: row.social_links || row.resume_details?.socialLinks || {},
    resumeDetails: row.resume_details || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Convert SQL row to Job object
export function formatJobRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    postedBy: row.posted_by,
    logo: row.logo,
    domain: row.domain,
    location: row.location,
    workCondition: row.work_condition,
    jobType: row.job_type,
    experienceLevel: row.experience_level,
    minExpYears: Number(row.min_exp_years) || 0,
    maxExpYears: Number(row.max_exp_years) || 0,
    salaryMin: Number(row.salary_min) || 0,
    salaryMax: Number(row.salary_max) || 0,
    salaryFormatted: row.salary_formatted,
    isSalaryTransparent: Boolean(row.is_salary_transparent),
    postedDate: row.posted_date ? new Date(row.posted_date).toISOString().split('T')[0] : null,
    deadline: row.deadline ? new Date(row.deadline).toISOString().split('T')[0] : null,
    isFeatured: Boolean(row.is_featured),
    qualityScore: Number(row.quality_score) || 85,
    qualityRating: row.quality_rating,
    qualityBreakdown: row.quality_breakdown || {},
    qualityFeedbackTips: row.quality_feedback_tips || [],
    summary: row.summary,
    responsibilities: row.responsibilities || [],
    mustHaveSkills: row.must_have_skills || [],
    niceToHaveSkills: row.nice_to_have_skills || [],
    workConditionsDetail: row.work_conditions_detail || {},
    cultureMission: row.culture_mission || {},
    deiStatement: row.dei_statement,
    interviewProcess: row.interview_process || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Convert SQL row to Application object
export function formatApplicationRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    jobId: row.job_id,
    candidateId: row.candidate_id,
    appliedDate: row.applied_date ? new Date(row.applied_date).toISOString().split('T')[0] : null,
    status: row.status,
    candidateNotes: row.candidate_notes,
    matchScore: Number(row.match_score) || 0,
    interviewDate: row.interview_date ? new Date(row.interview_date).toISOString() : null,
    interviewStage: row.interview_stage,
    interviewLink: row.interview_link,
    employerFeedback: row.employer_feedback || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Convert SQL row to Notification object
export function formatNotificationRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    type: row.type,
    timestamp: row.timestamp ? new Date(row.timestamp).toISOString() : new Date().toISOString(),
    read: Boolean(row.read),
    actionUrl: row.action_url
  };
}

// Convert SQL row to Mock Interview object
export function formatMockInterviewRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    candidateId: row.candidate_id,
    jobId: row.job_id,
    jobTitle: row.job_title,
    date: row.date ? new Date(row.date).toISOString().split('T')[0] : null,
    overallScore: Number(row.overall_score) || 0,
    status: row.status,
    questions: row.questions || []
  };
}

// -------------------------------------------------------------
// USER OPERATIONS
// -------------------------------------------------------------

export async function getAllUsers() {
  const res = await query('SELECT * FROM users ORDER BY created_at ASC');
  return res.rows.map(formatUserRow);
}

export async function getUserById(id) {
  const res = await query('SELECT * FROM users WHERE id = $1', [id]);
  return formatUserRow(res.rows[0]);
}

export async function getUserByEmail(email) {
  if (!email) return null;
  const res = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  return formatUserRow(res.rows[0]);
}

export async function createUser(userData) {
  const id = userData.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const role = userData.role || 'candidate';
  const name = userData.name || 'New User';
  const email = userData.email;
  const phone = userData.phone || null;
  const password = userData.password || null;
  const headline = userData.headline || (role === 'employer' ? 'Hiring Lead' : 'Job Seeker');
  const location = userData.location || 'Bengaluru, India';
  const preferredRemote = userData.preferredRemote || 'Hybrid';
  const yearsOfExperience = Number(userData.yearsOfExperience) || 0;
  const currentRole = userData.currentRole || (role === 'employer' ? 'HR Manager' : 'Software Professional');
  const bio = userData.bio || '';
  const avatarUrl = userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
  const targetSalary = userData.targetSalary || (role === 'candidate' ? '₹18,00,000' : null);
  const careerGoals = userData.careerGoals || '';
  const subscriptionTier = userData.subscriptionTier || 'Free';
  const company = userData.company || (role === 'employer' ? 'TechCorp Solutions' : null);
  const companyDetails = userData.companyDetails || {};
  const skills = userData.skills || [];
  const experience = userData.experience || [];
  const education = userData.education || [];
  const certifications = userData.certifications || [];
  const projects = userData.projects || [];
  const privacySettings = userData.privacySettings || { visibleToEmployers: true, showContactNumber: Boolean(phone), showTargetSalary: true };
  const socialLinks = userData.socialLinks || userData.social_links || {};
  const resumeDetails = userData.resumeDetails || {};

  const res = await query(`
    INSERT INTO users (
      id, role, name, email, phone, password, headline, location, preferred_remote,
      years_of_experience, "current_role", bio, avatar_url, target_salary,
      career_goals, subscription_tier, company, company_details, skills,
      experience, education, certifications, projects, privacy_settings, social_links, resume_details
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19,
      $20, $21, $22, $23, $24, $25, $26
    )
    RETURNING *;
  `, [
    id, role, name, email, phone, password, headline, location, preferredRemote,
    yearsOfExperience, currentRole, bio, avatarUrl, targetSalary,
    careerGoals, subscriptionTier, company, JSON.stringify(companyDetails), JSON.stringify(skills),
    JSON.stringify(experience), JSON.stringify(education), JSON.stringify(certifications),
    JSON.stringify(projects), JSON.stringify(privacySettings), JSON.stringify(socialLinks), JSON.stringify(resumeDetails)
  ]);

  return formatUserRow(res.rows[0]);
}

export async function updateUser(id, updates = {}) {
  const user = await getUserById(id);
  if (!user) return null;

  const merged = { ...user, ...updates };
  const socialLinks = merged.socialLinks || merged.social_links || {};

  const res = await query(`
    UPDATE users SET
      name = $1,
      email = $2,
      phone = $3,
      headline = $4,
      location = $5,
      preferred_remote = $6,
      years_of_experience = $7,
      "current_role" = $8,
      bio = $9,
      avatar_url = $10,
      target_salary = $11,
      career_goals = $12,
      subscription_tier = $13,
      company = $14,
      company_details = $15,
      skills = $16,
      experience = $17,
      education = $18,
      certifications = $19,
      projects = $20,
      privacy_settings = $21,
      social_links = $22,
      resume_details = $23,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $24
    RETURNING *;
  `, [
    merged.name,
    merged.email,
    merged.phone || null,
    merged.headline || null,
    merged.location || null,
    merged.preferredRemote || 'Hybrid',
    merged.yearsOfExperience || 0,
    merged.currentRole || null,
    merged.bio || null,
    merged.avatarUrl || null,
    merged.targetSalary || null,
    merged.careerGoals || null,
    merged.subscriptionTier || 'Free',
    merged.company || null,
    JSON.stringify(merged.companyDetails || {}),
    JSON.stringify(merged.skills || []),
    JSON.stringify(merged.experience || []),
    JSON.stringify(merged.education || []),
    JSON.stringify(merged.certifications || []),
    JSON.stringify(merged.projects || []),
    JSON.stringify(merged.privacySettings || {}),
    JSON.stringify(socialLinks),
    JSON.stringify(merged.resumeDetails || {}),
    id
  ]);

  return formatUserRow(res.rows[0]);
}

export async function addOrEndorseSkill(userId, { name, level = 'Intermediate', verified = false }) {
  const user = await getUserById(userId);
  if (!user) return null;

  const skills = Array.isArray(user.skills) ? [...user.skills] : [];
  const existing = skills.find(s => s.name.toLowerCase() === name.toLowerCase());

  if (existing) {
    existing.endorsements = (existing.endorsements || 0) + 1;
  } else {
    skills.push({ name, level, verified, endorsements: 1 });
  }

  const updated = await updateUser(userId, { skills });
  return updated?.skills || [];
}

// -------------------------------------------------------------
// JOB OPERATIONS
// -------------------------------------------------------------

export async function getAllJobs() {
  const res = await query(`
    SELECT * FROM jobs 
    ORDER BY is_featured DESC, posted_date DESC, created_at DESC;
  `);
  return res.rows.map(formatJobRow);
}

export async function getJobById(id) {
  const res = await query('SELECT * FROM jobs WHERE id = $1', [id]);
  return formatJobRow(res.rows[0]);
}

export async function createJob(jobData) {
  const res = await query(`
    INSERT INTO jobs (
      id, title, company, posted_by, logo, domain, location, work_condition,
      job_type, experience_level, min_exp_years, max_exp_years,
      salary_min, salary_max, salary_formatted, is_salary_transparent,
      posted_date, deadline, is_featured, quality_score, quality_rating,
      quality_breakdown, quality_feedback_tips, summary, responsibilities,
      must_have_skills, nice_to_have_skills, work_conditions_detail,
      culture_mission, dei_statement, interview_process
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
      $27, $28, $29, $30, $31
    )
    RETURNING *;
  `, [
    jobData.id,
    jobData.title,
    jobData.company,
    jobData.postedBy || null,
    jobData.logo || null,
    jobData.domain || 'Software & Technology',
    jobData.location || 'Remote',
    jobData.workCondition || 'Remote',
    jobData.jobType || 'Full-Time',
    jobData.experienceLevel || null,
    jobData.minExpYears || 0,
    jobData.maxExpYears || 0,
    jobData.salaryMin || 0,
    jobData.salaryMax || 0,
    jobData.salaryFormatted || null,
    jobData.isSalaryTransparent !== undefined ? jobData.isSalaryTransparent : true,
    jobData.postedDate || new Date().toISOString().split('T')[0],
    jobData.deadline || null,
    Boolean(jobData.isFeatured),
    jobData.qualityScore || 85,
    jobData.qualityRating || 'A',
    JSON.stringify(jobData.qualityBreakdown || {}),
    JSON.stringify(jobData.qualityFeedbackTips || []),
    jobData.summary || null,
    JSON.stringify(jobData.responsibilities || []),
    JSON.stringify(jobData.mustHaveSkills || []),
    JSON.stringify(jobData.niceToHaveSkills || []),
    JSON.stringify(jobData.workConditionsDetail || {}),
    JSON.stringify(jobData.cultureMission || {}),
    jobData.deiStatement || null,
    JSON.stringify(jobData.interviewProcess || [])
  ]);

  return formatJobRow(res.rows[0]);
}

// -------------------------------------------------------------
// APPLICATION OPERATIONS
// -------------------------------------------------------------

export async function getApplications({ candidateId, jobId } = {}) {
  let sql = 'SELECT * FROM applications WHERE 1=1';
  const params = [];

  if (candidateId) {
    params.push(candidateId);
    sql += ` AND candidate_id = $${params.length}`;
  }
  if (jobId) {
    params.push(jobId);
    sql += ` AND job_id = $${params.length}`;
  }

  sql += ' ORDER BY applied_date DESC, created_at DESC;';
  const res = await query(sql, params);
  return res.rows.map(formatApplicationRow);
}

export async function getApplicationById(id) {
  const res = await query('SELECT * FROM applications WHERE id = $1', [id]);
  return formatApplicationRow(res.rows[0]);
}

export async function createApplication(appData) {
  const res = await query(`
    INSERT INTO applications (
      id, job_id, candidate_id, applied_date, status, candidate_notes,
      match_score, interview_date, interview_stage, interview_link, employer_feedback
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `, [
    appData.id,
    appData.jobId,
    appData.candidateId,
    appData.appliedDate || new Date().toISOString().split('T')[0],
    appData.status || 'Applied',
    appData.candidateNotes || null,
    appData.matchScore || 0,
    appData.interviewDate ? new Date(appData.interviewDate) : null,
    appData.interviewStage || null,
    appData.interviewLink || null,
    appData.employerFeedback ? JSON.stringify(appData.employerFeedback) : null
  ]);

  return formatApplicationRow(res.rows[0]);
}

export async function updateApplicationStatus(id, { status, interviewDate, interviewStage, interviewLink }) {
  const res = await query(`
    UPDATE applications SET
      status = COALESCE($1, status),
      interview_date = CASE WHEN $2::timestamptz IS NOT NULL THEN $2::timestamptz ELSE interview_date END,
      interview_stage = COALESCE($3, interview_stage),
      interview_link = COALESCE($4, interview_link),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *;
  `, [status || null, interviewDate || null, interviewStage || null, interviewLink || null, id]);

  return formatApplicationRow(res.rows[0]);
}

export async function saveEmployerFeedback(id, feedback) {
  const res = await query(`
    UPDATE applications SET
      employer_feedback = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `, [JSON.stringify(feedback), id]);

  return formatApplicationRow(res.rows[0]);
}

// -------------------------------------------------------------
// NOTIFICATIONS OPERATIONS
// -------------------------------------------------------------

export async function getNotifications(userId) {
  const res = await query(`
    SELECT * FROM notifications 
    WHERE user_id = $1 
    ORDER BY timestamp DESC, created_at DESC;
  `, [userId]);
  return res.rows.map(formatNotificationRow);
}

export async function markNotificationRead(id) {
  const res = await query(`
    UPDATE notifications SET read = TRUE WHERE id = $1 RETURNING *;
  `, [id]);
  return formatNotificationRow(res.rows[0]);
}

export async function createNotification(notifData) {
  const notifId = notifData.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const res = await query(`
    INSERT INTO notifications (
      id, user_id, title, message, type, timestamp, read, action_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `, [
    notifId,
    notifData.userId,
    notifData.title,
    notifData.message,
    notifData.type || 'info',
    notifData.timestamp ? new Date(notifData.timestamp) : new Date(),
    Boolean(notifData.read),
    notifData.actionUrl || null
  ]);

  return formatNotificationRow(res.rows[0]);
}

// -------------------------------------------------------------
// MOCK INTERVIEW OPERATIONS
// -------------------------------------------------------------

export async function saveMockInterview(session) {
  const res = await query(`
    INSERT INTO mock_interviews (
      id, candidate_id, job_id, job_title, date, overall_score, status, questions
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id) DO UPDATE SET
      candidate_id = EXCLUDED.candidate_id,
      job_id = EXCLUDED.job_id,
      job_title = EXCLUDED.job_title,
      date = EXCLUDED.date,
      overall_score = EXCLUDED.overall_score,
      status = EXCLUDED.status,
      questions = EXCLUDED.questions
    RETURNING *;
  `, [
    session.id,
    session.candidateId,
    session.jobId || null,
    session.jobTitle,
    session.date || new Date().toISOString().split('T')[0],
    session.overallScore || 0,
    session.status || 'Completed',
    JSON.stringify(session.questions || [])
  ]);

  return formatMockInterviewRow(res.rows[0]);
}

export async function getMockInterviewHistory(candidateId) {
  const res = await query(`
    SELECT * FROM mock_interviews 
    WHERE candidate_id = $1 
    ORDER BY date DESC, created_at DESC;
  `, [candidateId]);
  return res.rows.map(formatMockInterviewRow);
}

// -------------------------------------------------------------
// SYSTEM SETTINGS & LLM CONFIG
// -------------------------------------------------------------

export async function getLLMConfig(defaultConfig = {}) {
  try {
    const res = await query("SELECT value FROM system_settings WHERE key = 'llm_config'");
    if (res.rows.length > 0 && res.rows[0].value) {
      return res.rows[0].value;
    }
  } catch (err) {
    console.warn('[pgStore] Error reading llm_config from DB:', err.message);
  }
  return defaultConfig;
}

export async function updateLLMConfig(config) {
  const res = await query(`
    INSERT INTO system_settings (key, value, description)
    VALUES ('llm_config', $1, 'Active AI / LLM Engine Settings')
    ON CONFLICT (key) DO UPDATE SET
      value = EXCLUDED.value,
      updated_at = CURRENT_TIMESTAMP
    RETURNING value;
  `, [JSON.stringify(config)]);

  return res.rows[0]?.value || config;
}

// -------------------------------------------------------------
// ANALYTICS & PLATFORM METRICS
// -------------------------------------------------------------

export async function getAnalytics() {
  const jobsRes = await query('SELECT count(*) as total, coalesce(avg(quality_score), 85) as avg_quality FROM jobs;');
  const candidatesRes = await query("SELECT count(*) as total FROM users WHERE role = 'candidate';");
  const appsRes = await query('SELECT count(*) as total, coalesce(avg(match_score), 80) as avg_match FROM applications;');

  const totalJobs = parseInt(jobsRes.rows[0]?.total || 0, 10);
  const avgJdQuality = Math.round(parseFloat(jobsRes.rows[0]?.avg_quality || 85));
  const activeCandidates = parseInt(candidatesRes.rows[0]?.total || 0, 10);
  const totalApplications = parseInt(appsRes.rows[0]?.total || 0, 10);
  const avgMatchScore = Math.round(parseFloat(appsRes.rows[0]?.avg_match || 80));

  return {
    totalJobs,
    activeCandidates,
    totalApplications,
    avgJdQualityScore: avgJdQuality,
    avgApplicantMatchRate: `${avgMatchScore}%`,
    interviewConversionRate: '42.8%',
    medianTimeToHire: '14 Days (60% faster with AI screening)',
    unqualifiedDropReduction: '71%'
  };
}

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  addOrEndorseSkill,
  getAllJobs,
  getJobById,
  createJob,
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  saveEmployerFeedback,
  getNotifications,
  markNotificationRead,
  createNotification,
  saveMockInterview,
  getMockInterviewHistory,
  getLLMConfig,
  updateLLMConfig,
  getAnalytics
};
