import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, '../data/store.json');

export async function migrateLocalDataToPostgres() {
  console.log('====================================================');
  console.log('[Data Migration] Starting migration from store.json to PostgreSQL');
  console.log('====================================================');

  if (!fs.existsSync(STORE_PATH)) {
    throw new Error(`store.json not found at ${STORE_PATH}`);
  }

  const raw = fs.readFileSync(STORE_PATH, 'utf-8');
  const store = JSON.parse(raw);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Migrate Users
    let userCount = 0;
    if (Array.isArray(store.users)) {
      for (const u of store.users) {
        await client.query(`
          INSERT INTO users (
            id, role, name, email, headline, location, preferred_remote,
            years_of_experience, "current_role", bio, avatar_url,
            target_salary, career_goals, subscription_tier, company,
            company_details, skills, experience, education, certifications, projects
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
          ON CONFLICT (id) DO UPDATE SET
            role = EXCLUDED.role,
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            headline = EXCLUDED.headline,
            location = EXCLUDED.location,
            preferred_remote = EXCLUDED.preferred_remote,
            years_of_experience = EXCLUDED.years_of_experience,
            "current_role" = EXCLUDED."current_role",
            bio = EXCLUDED.bio,
            avatar_url = EXCLUDED.avatar_url,
            target_salary = EXCLUDED.target_salary,
            career_goals = EXCLUDED.career_goals,
            subscription_tier = EXCLUDED.subscription_tier,
            company = EXCLUDED.company,
            company_details = EXCLUDED.company_details,
            skills = EXCLUDED.skills,
            experience = EXCLUDED.experience,
            education = EXCLUDED.education,
            certifications = EXCLUDED.certifications,
            projects = EXCLUDED.projects,
            updated_at = CURRENT_TIMESTAMP;
        `, [
          u.id,
          u.role || 'candidate',
          u.name,
          u.email,
          u.headline || null,
          u.location || null,
          u.preferredRemote || 'Hybrid',
          u.yearsOfExperience || 0,
          u.currentRole || null,
          u.bio || null,
          u.avatarUrl || null,
          u.targetSalary || null,
          u.careerGoals || null,
          u.subscriptionTier || 'Free',
          u.company || null,
          JSON.stringify(u.companyDetails || {}),
          JSON.stringify(u.skills || []),
          JSON.stringify(u.experience || []),
          JSON.stringify(u.education || []),
          JSON.stringify(u.certifications || []),
          JSON.stringify(u.projects || [])
        ]);
        userCount++;
      }
    }
    console.log(`[Data Migration] Migrated ${userCount} users.`);

    // 2. Migrate Jobs
    let jobCount = 0;
    if (Array.isArray(store.jobs)) {
      for (const j of store.jobs) {
        await client.query(`
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
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            company = EXCLUDED.company,
            posted_by = EXCLUDED.posted_by,
            logo = EXCLUDED.logo,
            domain = EXCLUDED.domain,
            location = EXCLUDED.location,
            work_condition = EXCLUDED.work_condition,
            job_type = EXCLUDED.job_type,
            experience_level = EXCLUDED.experience_level,
            min_exp_years = EXCLUDED.min_exp_years,
            max_exp_years = EXCLUDED.max_exp_years,
            salary_min = EXCLUDED.salary_min,
            salary_max = EXCLUDED.salary_max,
            salary_formatted = EXCLUDED.salary_formatted,
            is_salary_transparent = EXCLUDED.is_salary_transparent,
            posted_date = EXCLUDED.posted_date,
            deadline = EXCLUDED.deadline,
            is_featured = EXCLUDED.is_featured,
            quality_score = EXCLUDED.quality_score,
            quality_rating = EXCLUDED.quality_rating,
            quality_breakdown = EXCLUDED.quality_breakdown,
            quality_feedback_tips = EXCLUDED.quality_feedback_tips,
            summary = EXCLUDED.summary,
            responsibilities = EXCLUDED.responsibilities,
            must_have_skills = EXCLUDED.must_have_skills,
            nice_to_have_skills = EXCLUDED.nice_to_have_skills,
            work_conditions_detail = EXCLUDED.work_conditions_detail,
            culture_mission = EXCLUDED.culture_mission,
            dei_statement = EXCLUDED.dei_statement,
            interview_process = EXCLUDED.interview_process,
            updated_at = CURRENT_TIMESTAMP;
        `, [
          j.id,
          j.title,
          j.company,
          j.postedBy || null,
          j.logo || null,
          j.domain || 'Software & Technology',
          j.location || 'Remote',
          j.workCondition || 'Remote',
          j.jobType || 'Full-Time',
          j.experienceLevel || null,
          j.minExpYears || 0,
          j.maxExpYears || 0,
          j.salaryMin || 0,
          j.salaryMax || 0,
          j.salaryFormatted || null,
          j.isSalaryTransparent !== undefined ? j.isSalaryTransparent : true,
          j.postedDate || new Date().toISOString().split('T')[0],
          j.deadline || null,
          Boolean(j.isFeatured),
          j.qualityScore || 85,
          j.qualityRating || 'A',
          JSON.stringify(j.qualityBreakdown || {}),
          JSON.stringify(j.qualityFeedbackTips || []),
          j.summary || null,
          JSON.stringify(j.responsibilities || []),
          JSON.stringify(j.mustHaveSkills || []),
          JSON.stringify(j.niceToHaveSkills || []),
          JSON.stringify(j.workConditionsDetail || {}),
          JSON.stringify(j.cultureMission || {}),
          j.deiStatement || null,
          JSON.stringify(j.interviewProcess || [])
        ]);
        jobCount++;
      }
    }
    console.log(`[Data Migration] Migrated ${jobCount} jobs.`);

    // 3. Migrate Applications
    let appCount = 0;
    if (Array.isArray(store.applications)) {
      for (const a of store.applications) {
        await client.query(`
          INSERT INTO applications (
            id, job_id, candidate_id, applied_date, status, candidate_notes,
            match_score, interview_date, interview_stage, interview_link, employer_feedback
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            job_id = EXCLUDED.job_id,
            candidate_id = EXCLUDED.candidate_id,
            applied_date = EXCLUDED.applied_date,
            status = EXCLUDED.status,
            candidate_notes = EXCLUDED.candidate_notes,
            match_score = EXCLUDED.match_score,
            interview_date = EXCLUDED.interview_date,
            interview_stage = EXCLUDED.interview_stage,
            interview_link = EXCLUDED.interview_link,
            employer_feedback = EXCLUDED.employer_feedback,
            updated_at = CURRENT_TIMESTAMP;
        `, [
          a.id,
          a.jobId,
          a.candidateId,
          a.appliedDate || new Date().toISOString().split('T')[0],
          a.status || 'Applied',
          a.candidateNotes || null,
          a.matchScore || 0,
          a.interviewDate ? new Date(a.interviewDate) : null,
          a.interviewStage || null,
          a.interviewLink || null,
          a.employerFeedback ? JSON.stringify(a.employerFeedback) : null
        ]);
        appCount++;
      }
    }
    console.log(`[Data Migration] Migrated ${appCount} applications.`);

    // 4. Migrate Notifications
    let notifCount = 0;
    if (Array.isArray(store.notifications)) {
      for (const n of store.notifications) {
        await client.query(`
          INSERT INTO notifications (
            id, user_id, title, message, type, timestamp, read, action_url
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            title = EXCLUDED.title,
            message = EXCLUDED.message,
            type = EXCLUDED.type,
            timestamp = EXCLUDED.timestamp,
            read = EXCLUDED.read,
            action_url = EXCLUDED.action_url;
        `, [
          n.id,
          n.userId,
          n.title,
          n.message,
          n.type || 'info',
          n.timestamp ? new Date(n.timestamp) : new Date(),
          Boolean(n.read),
          n.actionUrl || null
        ]);
        notifCount++;
      }
    }
    console.log(`[Data Migration] Migrated ${notifCount} notifications.`);

    // 5. Migrate Mock Interviews
    let mockCount = 0;
    if (Array.isArray(store.mockInterviews)) {
      for (const m of store.mockInterviews) {
        await client.query(`
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
            questions = EXCLUDED.questions;
        `, [
          m.id,
          m.candidateId,
          m.jobId || null,
          m.jobTitle,
          m.date || new Date().toISOString().split('T')[0],
          m.overallScore || 0,
          m.status || 'Completed',
          JSON.stringify(m.questions || [])
        ]);
        mockCount++;
      }
    }
    console.log(`[Data Migration] Migrated ${mockCount} mock interviews.`);

    // 6. Migrate System Settings (LLM Config)
    if (store.llmConfig) {
      await client.query(`
        INSERT INTO system_settings (key, value, description)
        VALUES ('llm_config', $1, 'Active AI / LLM Engine Settings')
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          updated_at = CURRENT_TIMESTAMP;
      `, [JSON.stringify(store.llmConfig)]);
      console.log(`[Data Migration] Migrated LLM configuration into system_settings.`);
    }

    await client.query('COMMIT');
    console.log('====================================================');
    console.log('[Data Migration] Migration completed successfully!');
    console.log('====================================================');

    return {
      success: true,
      migrated: {
        users: userCount,
        jobs: jobCount,
        applications: appCount,
        notifications: notifCount,
        mockInterviews: mockCount
      }
    };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Data Migration Error]: Failed during migration, rolled back transaction.', err);
    throw err;
  } finally {
    client.release();
  }
}

// Allow direct execution: node server/db/migrateData.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrateLocalDataToPostgres()
    .then((res) => {
      console.log('Migration Result Summary:', JSON.stringify(res, null, 2));
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration Fatal Error:', err.message);
      process.exit(1);
    });
}
