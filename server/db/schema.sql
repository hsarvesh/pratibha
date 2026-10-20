-- Pratibha Platform Database Schema (PostgreSQL 14+)
-- Designed for High Scalability, Fast Full-Text & Filter Search, and JSONB Flexibility

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. USERS TABLE (Candidates & Employers)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    role VARCHAR(50) NOT NULL CHECK (role IN ('candidate', 'employer', 'admin')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(255),
    headline TEXT,
    location VARCHAR(255),
    preferred_remote VARCHAR(50) DEFAULT 'Hybrid',
    years_of_experience NUMERIC(4, 1) DEFAULT 0,
    "current_role" TEXT,
    bio TEXT,
    avatar_url TEXT,
    target_salary VARCHAR(150),
    career_goals TEXT,
    subscription_tier VARCHAR(50) DEFAULT 'Free',
    company VARCHAR(255),
    company_details JSONB DEFAULT '{}'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    privacy_settings JSONB DEFAULT '{"visibleToEmployers": true, "showContactNumber": true, "showTargetSalary": true}'::jsonb,
    social_links JSONB DEFAULT '{}'::jsonb,
    resume_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_skills ON users USING gin (skills);

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 2. JOBS TABLE (Parameter-scored Job Listings)
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    posted_by VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
    logo TEXT,
    domain VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    work_condition VARCHAR(50) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    experience_level VARCHAR(100),
    min_exp_years INT DEFAULT 0,
    max_exp_years INT DEFAULT 0,
    salary_min NUMERIC(15, 2) DEFAULT 0,
    salary_max NUMERIC(15, 2) DEFAULT 0,
    salary_formatted VARCHAR(150),
    is_salary_transparent BOOLEAN DEFAULT TRUE,
    posted_date DATE DEFAULT CURRENT_DATE,
    deadline DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    quality_score INT DEFAULT 85,
    quality_rating VARCHAR(50) DEFAULT 'A',
    quality_breakdown JSONB DEFAULT '{}'::jsonb,
    quality_feedback_tips JSONB DEFAULT '[]'::jsonb,
    summary TEXT,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    must_have_skills JSONB DEFAULT '[]'::jsonb,
    nice_to_have_skills JSONB DEFAULT '[]'::jsonb,
    work_conditions_detail JSONB DEFAULT '{}'::jsonb,
    culture_mission JSONB DEFAULT '{}'::jsonb,
    dei_statement TEXT,
    interview_process JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_domain ON jobs(domain);
CREATE INDEX IF NOT EXISTS idx_jobs_work_condition ON jobs(work_condition);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON jobs(is_featured);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_must_have_skills ON jobs USING gin (must_have_skills);

DROP TRIGGER IF EXISTS trigger_jobs_updated_at ON jobs;
CREATE TRIGGER trigger_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 3. APPLICATIONS TABLE (Candidate Job Applications & ATS Pipeline)
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(100) PRIMARY KEY,
    job_id VARCHAR(100) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    applied_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Applied',
    candidate_notes TEXT,
    match_score INT DEFAULT 0,
    interview_date TIMESTAMPTZ,
    interview_stage VARCHAR(150),
    interview_link TEXT,
    employer_feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_candidate_job UNIQUE (candidate_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON applications(applied_date DESC);

DROP TRIGGER IF EXISTS trigger_applications_updated_at ON applications;
CREATE TRIGGER trigger_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. NOTIFICATIONS TABLE (Real-Time Platform Alerts)
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON notifications(timestamp DESC);

-- 5. MOCK INTERVIEWS TABLE (Simulations, Transcript & Evaluation Scores)
CREATE TABLE IF NOT EXISTS mock_interviews (
    id VARCHAR(100) PRIMARY KEY,
    candidate_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id VARCHAR(100) REFERENCES jobs(id) ON DELETE SET NULL,
    job_title VARCHAR(255) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    overall_score INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Completed',
    questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mock_interviews_candidate_id ON mock_interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_date ON mock_interviews(date DESC);

-- 6. SYSTEM SETTINGS TABLE (Modular AI & App Configurations)
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS trigger_system_settings_updated_at ON system_settings;
CREATE TRIGGER trigger_system_settings_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
