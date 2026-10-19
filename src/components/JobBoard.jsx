import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Brain,
  Award
} from 'lucide-react';

export default function JobBoard({
  jobs = [],
  currentUser,
  onSelectJob,
  onStartInterview,
  savedJobIds = [],
  onToggleSaveJob
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedWorkCondition, setSelectedWorkCondition] = useState('All');
  const [selectedExpLevel, setSelectedExpLevel] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [sortBy, setSortBy] = useState('fit'); // 'fit', 'newest', 'quality', 'salary'

  const domains = [
    'All',
    'Software & Technology',
    'Artificial Intelligence',
    'Marketing & Growth',
    'Product & Design',
    'Healthcare & Biotech'
  ];

  const workConditions = ['All', 'Remote', 'Hybrid', 'In-Office'];
  const expLevels = ['All', '1-3 years', '2-4 years', '3-5 years', '4-6 years', '5+ years'];
  const jobTypes = ['All', 'Full-Time', 'Part-Time', 'Contract', 'Internship'];

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.company.toLowerCase().includes(q);
        const matchSummary = (job.summary || '').toLowerCase().includes(q);
        const matchSkill = (job.mustHaveSkills || []).some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchSummary && !matchSkill) return false;
      }

      // Domain
      if (selectedDomain !== 'All' && job.domain.toLowerCase() !== selectedDomain.toLowerCase()) {
        return false;
      }

      // Work condition
      if (selectedWorkCondition !== 'All' && job.workCondition.toLowerCase() !== selectedWorkCondition.toLowerCase()) {
        return false;
      }

      // Experience level
      if (selectedExpLevel !== 'All' && !job.experienceLevel.toLowerCase().includes(selectedExpLevel.toLowerCase())) {
        return false;
      }

      // Job type
      if (selectedJobType !== 'All' && job.jobType.toLowerCase() !== selectedJobType.toLowerCase()) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'fit') {
        const scoreA = a.candidateFit?.matchScore || 0;
        const scoreB = b.candidateFit?.matchScore || 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'quality') {
        return (b.qualityScore || 0) - (a.qualityScore || 0);
      }
      if (sortBy === 'salary') {
        return (b.salaryMax || 0) - (a.salaryMax || 0);
      }
      return new Date(b.postedDate) - new Date(a.postedDate);
    });
  }, [jobs, searchQuery, selectedDomain, selectedWorkCondition, selectedExpLevel, selectedJobType, sortBy]);

  // Top recommendation for current candidate
  const topMatch = useMemo(() => {
    if (currentUser.role !== 'candidate') return null;
    return [...jobs].sort((a, b) => (b.candidateFit?.matchScore || 0) - (a.candidateFit?.matchScore || 0))[0];
  }, [jobs, currentUser]);

  return (
    <div className="animate-fade-in">
      {/* Hero Search Section */}
      <section className="hero-banner">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(99, 102, 241, 0.25)', marginBottom: '1.25rem' }}>
          <Sparkles size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
            AI-Engineered Job Matching & Parameterized JD Scoring
          </span>
        </div>

        <h1 className="hero-title">
          Discover Roles Where <span className="gradient-text">Your Talent Excels</span>
        </h1>
        <p className="hero-subtitle">
          Eliminate the "hit-and-miss" ratio. Pratibha analyzes real candidate skills, evaluates transparent job descriptions, and coaches you to interview mastery.
        </p>

        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <div className="search-input-field">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by role title, core skills (React, Python, AWS), or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Job Search Input"
            />
          </div>
          <button
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-lg)' }}
            onClick={() => {}}
          >
            Find Opportunities
          </button>
        </div>
      </section>

      {/* Personalized AI Candidate Match Banner */}
      {currentUser.role === 'candidate' && topMatch && (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Brain size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  Personalized AI Match for {currentUser.name}
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {topMatch.candidateFit?.summary || 'High alignment with your skills and preferred work conditions.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-emerald" style={{ fontSize: '0.88rem', padding: '0.4rem 0.85rem' }}>
                <Sparkles size={14} /> {topMatch.candidateFit?.matchScore || 94}% Fit
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onSelectJob(topMatch)}
              >
                Review Top Match <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Domain Category Filter Pills */}
      <div className="filter-pills-row" role="tablist" aria-label="Job Domain Categories">
        {domains.map(domain => (
          <button
            key={domain}
            className={`filter-pill ${selectedDomain === domain ? 'active' : ''}`}
            onClick={() => setSelectedDomain(domain)}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Multi-Faceted Filter Control Bar */}
      <div className="glass-panel filter-controls-card">
        {/* Work Condition Filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} /> Work Condition
          </label>
          <select
            className="form-select"
            value={selectedWorkCondition}
            onChange={(e) => setSelectedWorkCondition(e.target.value)}
          >
            {workConditions.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        {/* Experience Level Filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} /> Experience Range
          </label>
          <select
            className="form-select"
            value={selectedExpLevel}
            onChange={(e) => setSelectedExpLevel(e.target.value)}
          >
            {expLevels.map(exp => <option key={exp} value={exp}>{exp}</option>)}
          </select>
        </div>

        {/* Job Type Filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Briefcase size={14} /> Employment Type
          </label>
          <select
            className="form-select"
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
          >
            {jobTypes.map(jt => <option key={jt} value={jt}>{jt}</option>)}
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <TrendingUp size={14} /> Sort Results By
          </label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="fit">AI Candidate Fit</option>
            <option value="quality">JD Quality Score (Pratibha Metric)</option>
            <option value="salary">Highest Compensation</option>
            <option value="newest">Recently Posted</option>
          </select>
        </div>
      </div>

      {/* Results Header Count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredJobs.length}</strong> verified opportunities
          {selectedDomain !== 'All' && ` in ${selectedDomain}`}
        </p>

        {(selectedDomain !== 'All' || selectedWorkCondition !== 'All' || selectedExpLevel !== 'All' || searchQuery) && (
          <button
            style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'underline' }}
            onClick={() => {
              setSelectedDomain('All');
              setSelectedWorkCondition('All');
              setSelectedExpLevel('All');
              setSelectedJobType('All');
              setSearchQuery('');
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.6 }} />
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No matching job postings found</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 450, margin: '0 auto 1.5rem' }}>
            Try broadening your search keywords or clearing specific experience/domain filters.
          </p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setSelectedDomain('All');
              setSelectedWorkCondition('All');
              setSelectedExpLevel('All');
              setSearchQuery('');
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="job-grid">
          {filteredJobs.map(job => {
            const isSaved = savedJobIds.includes(job.id);
            const fitScore = job.candidateFit?.matchScore;

            return (
              <div
                key={job.id}
                className={`glass-panel job-card ${job.isFeatured ? 'featured-card' : ''}`}
              >
                {/* Header */}
                <div className="job-card-header">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="company-logo-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="job-title-group">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <h2
                        className="job-role-title"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSelectJob(job)}
                      >
                        {job.title}
                      </h2>
                      <button
                        className="icon-btn"
                        style={{ width: 32, height: 32 }}
                        onClick={() => onToggleSaveJob(job.id)}
                        title={isSaved ? 'Remove from saved' : 'Save job'}
                        aria-label="Save Job"
                      >
                        {isSaved ? <BookmarkCheck size={16} color="var(--primary)" /> : <Bookmark size={16} />}
                      </button>
                    </div>

                    <div className="job-company-line">
                      <span>{job.company}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={13} /> {job.location}
                      </span>
                      <span>•</span>
                      <span className="badge badge-primary">{job.workCondition}</span>
                    </div>

                    {/* Scores row: Pratibha Parameterized JD Quality + AI Candidate Fit */}
                    <div className="scores-row">
                      {/* Parameterized JD Quality Badge */}
                      <span
                        className="badge badge-purple"
                        title="Evaluated by Pratibha's Parameterized System: High clarity, transparent compensation, and verified expectations."
                      >
                        <ShieldCheck size={12} /> JD Quality: {job.qualityRating || 'A+'} ({job.qualityScore || 94}%)
                      </span>

                      {/* Candidate Fit Badge */}
                      {fitScore && (
                        <span
                          className={`badge ${fitScore >= 85 ? 'badge-emerald' : fitScore >= 70 ? 'badge-amber' : 'badge-primary'}`}
                          title={job.candidateFit?.summary}
                        >
                          <Sparkles size={12} /> {fitScore}% Match Fit
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {job.summary}
                </p>

                {/* Transparent Salary & Requirements */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div className="salary-tag">
                    {job.salaryFormatted}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Req: {job.experienceLevel} • {job.jobType}
                  </div>
                </div>

                {/* Skills Chips */}
                <div className="skills-chips-list">
                  {(job.mustHaveSkills || []).slice(0, 5).map(skill => {
                    const isMatched = (currentUser.skills || []).some(s => {
                      const name = typeof s === 'string' ? s : s.name;
                      return name.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(name.toLowerCase());
                    });
                    return (
                      <span
                        key={skill}
                        className={`skill-chip ${isMatched ? 'matched' : ''}`}
                        title={isMatched ? 'Matched in your verified profile' : 'Required skill'}
                      >
                        {isMatched && <CheckCircle2 size={11} style={{ marginRight: 3, display: 'inline' }} />}
                        {skill}
                      </span>
                    );
                  })}
                </div>

                {/* Card Footer Actions */}
                <div className="job-card-footer">
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.8rem' }}
                    onClick={() => onStartInterview(job)}
                    title="Prepare for this role with JD-anchored mock interview"
                  >
                    <Brain size={14} color="var(--primary)" /> AI Interview Prep
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onSelectJob(job)}
                  >
                    View & Apply <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
