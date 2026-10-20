import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Brain,
  FileText,
  Compass,
  ArrowRight,
  TrendingUp,
  Shield,
  Eye,
  MapPin,
  DollarSign,
  Plus,
  Phone,
  UserCheck,
  Award,
  Zap,
  Lock,
  ChevronRight
} from 'lucide-react';
import LinkedInIcon from './LinkedInIcon';
import SocialBadgesRow from './SocialBadgesRow';

export default function CandidateHome({
  currentUser,
  jobs = [],
  applications = [],
  onNavigate,
  onSelectJob,
  onStartInterview,
  onOpenProfilePreview,
  onOpenLinkedInModal
}) {
  // Calculate Profile Completeness dynamically
  const calculateCompleteness = () => {
    let score = 0;
    const missing = [];

    // Basic details (20%)
    if (currentUser.name && currentUser.headline) score += 20;
    else missing.push({ id: 'basic', label: 'Add professional headline & title', weight: 20, tab: 'profile' });

    // Contact & Phone (15%)
    if (currentUser.phone) {
      score += 15;
    } else {
      missing.push({
        id: 'phone',
        label: 'Add phone number (Optional - enables instant SMS/WhatsApp interview invites)',
        weight: 15,
        tab: 'profile'
      });
    }

    // Bio & Career Goals (15%)
    if (currentUser.bio && currentUser.bio.length > 20) {
      score += 15;
    } else {
      missing.push({ id: 'bio', label: 'Write a compelling career summary / bio', weight: 15, tab: 'profile' });
    }

    // Verified Skills (20%)
    const skillCount = (currentUser.skills || []).length;
    if (skillCount >= 4) {
      score += 20;
    } else if (skillCount > 0) {
      score += 10;
      missing.push({ id: 'skills', label: 'Add at least 4 core verified skills', weight: 10, tab: 'profile' });
    } else {
      missing.push({ id: 'skills', label: 'Add your primary technical skills', weight: 20, tab: 'profile' });
    }

    // Experience (15%)
    if ((currentUser.experience || []).length > 0) {
      score += 15;
    } else {
      missing.push({ id: 'experience', label: 'Add past work experience & achievements', weight: 15, tab: 'profile' });
    }

    // Target Salary & Preferences (15%)
    if (currentUser.targetSalary && currentUser.preferredRemote) {
      score += 15;
    } else {
      missing.push({ id: 'salary', label: 'Specify target compensation & work conditions', weight: 15, tab: 'profile' });
    }

    // Social Profiles (GitHub, Twitter, Instagram, Facebook, Portfolio) (10%)
    const social = currentUser.socialLinks || currentUser.social_links || {};
    const custom = Array.isArray(social.customLinks) ? social.customLinks : [];
    const activeSocialCount = Object.entries(social).filter(([k, v]) => k !== 'customLinks' && typeof v === 'string' && v.trim().length > 0).length +
      custom.filter(c => c && c.url && c.url.trim().length > 0).length;

    if (activeSocialCount >= 2) {
      score += 10;
    } else if (activeSocialCount === 1) {
      score += 5;
      missing.push({ id: 'social', label: 'Connect a second social profile (GitHub, Twitter, Instagram, Facebook, Portfolio)', weight: 5, tab: 'profile' });
    } else {
      missing.push({ id: 'social', label: 'Link GitHub, Facebook, Instagram, Twitter/X or Portfolio', weight: 10, tab: 'profile' });
    }

    return { score: Math.min(score, 100), missing };
  };

  const { score: completenessScore, missing: checklistItems } = calculateCompleteness();

  // Tier level
  const getTier = (s) => {
    if (s >= 85) return { label: '⭐ All-Star Talent', color: '#10b981', desc: 'Highest priority in hiring manager candidate search' };
    if (s >= 60) return { label: '⚡ Rising Star', color: '#6366f1', desc: 'Strong profile, few high-impact details remaining' };
    return { label: '🚀 Starter Profile', color: '#f59e0b', desc: 'Complete remaining items to unlock 90%+ match accuracy' };
  };

  const currentTier = getTier(completenessScore);

  // Top Precision Matched Jobs
  const precisionJobs = jobs
    .filter(j => j.candidateFit && j.candidateFit.matchScore >= 75)
    .sort((a, b) => (b.candidateFit?.matchScore || 0) - (a.candidateFit?.matchScore || 0))
    .slice(0, 3);

  // Candidate Applications count
  const myApps = applications.filter(a => a.candidateId === currentUser.id);
  const interviewApps = myApps.filter(a => a.status === 'Interviewing' || a.interviewDate);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Warm Welcome Hero Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.25rem 2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(168, 85, 247, 0.12) 50%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-primary)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
                title="Profile Verified"
              >
                <CheckCircle2 size={14} />
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  Welcome home, {currentUser.name.split(' ')[0]}! ✨
                </h1>
                <span className="badge badge-purple" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                  Candidate Portal
                </span>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.78rem', fontWeight: 700 }}>
                  {currentTier.label}
                </span>
              </div>

              <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: 640 }}>
                {currentUser.headline || 'Job Seeker & Professional'} • {currentUser.location || 'Bengaluru, India'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.84rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Briefcase size={14} color="var(--primary)" /> Preferred: {currentUser.preferredRemote || 'Hybrid'}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <DollarSign size={14} color="var(--primary)" /> Target: {currentUser.targetSalary || 'Competitive'}
                </span>
                {currentUser.phone && (
                  <>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Phone size={14} color="#10b981" /> {currentUser.phone}
                    </span>
                  </>
                )}
              </div>

              {/* Connected Social Profiles */}
              <div style={{ marginTop: '0.85rem' }}>
                <SocialBadgesRow
                  socialLinks={currentUser.socialLinks || currentUser.social_links}
                  size="sm"
                  onEmptyClick={() => onNavigate('profile')}
                  emptyPrompt="+ Link GitHub, Twitter, Instagram, Facebook & Portfolio"
                />
              </div>
            </div>
          </div>

          {/* Quick Action Preview ATS button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={onOpenLinkedInModal}
              className="btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                background: '#0a66c2',
                color: 'white',
                boxShadow: '0 4px 14px rgba(10, 102, 194, 0.4)'
              }}
            >
              <LinkedInIcon size={16} /> Import from LinkedIn
            </button>
            <button
              onClick={onOpenProfilePreview}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                fontSize: '0.88rem',
                fontWeight: 700
              }}
            >
              <Eye size={15} /> Preview How Employers See Me
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="btn"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.82rem'
              }}
            >
              Update Full Profile & Privacy
            </button>
          </div>
        </div>
      </div>

      {/* Profile Completeness & Motivational Gamification */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color={currentTier.color} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Profile Strength & Precision Index</h2>
              <span className="badge badge-purple" style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                {completenessScore}% Complete
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {currentTier.desc} Every detail you provide increases precision matching and protects your candidacy from unqualified filters.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Status:</span>
            <span style={{ fontWeight: 700, color: currentTier.color, fontSize: '0.9rem' }}>
              {currentTier.label}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: 10,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginBottom: '1.5rem',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: `${completenessScore}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #10b981 100%)',
              borderRadius: '9999px',
              transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>

        {/* Actionable Next Steps Checklist */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.15rem',
            background: 'rgba(10, 102, 194, 0.12)',
            border: '1px solid rgba(10, 102, 194, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <LinkedInIcon size={22} color="#0a66c2" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                Have a LinkedIn profile? Import everything in seconds
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Automatically sync your verified work history, skills matrix, and bio to boost your profile strength.
              </div>
            </div>
          </div>
          <button
            onClick={onOpenLinkedInModal}
            className="btn btn-sm"
            style={{ background: '#0a66c2', color: 'white', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Sparkles size={13} /> 1-Click Import
          </button>
        </div>

        {checklistItems.length > 0 ? (
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={15} color="#f59e0b" /> Complete these high-value items to unlock full visibility:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {checklistItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => onNavigate(item.tab || 'profile')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {item.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.78rem' }}>
                    <span>+{item.weight}%</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#34d399' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              Spectacular! Your profile is 100% complete and fully optimized for top-tier employer matching.
            </span>
          </div>
        )}
      </div>

      {/* Cockpit Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div
          className="glass-panel"
          onClick={() => onNavigate('jobs')}
          style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s ease', position: 'relative' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Precision Matches</span>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
            {precisionJobs.length || jobs.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '0.35rem', fontWeight: 600 }}>
            Curated roles matching your verified skills →
          </div>
        </div>

        <div
          className="glass-panel"
          onClick={() => onNavigate('applications')}
          style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Applications</span>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
            {myApps.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#c084fc', marginTop: '0.35rem', fontWeight: 600 }}>
            {interviewApps.length > 0 ? `${interviewApps.length} in interview stages` : 'Track hiring progress live →'}
          </div>
        </div>

        <div
          className="glass-panel"
          onClick={() => onNavigate('interview-coach')}
          style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>AI Interview Coach</span>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <Brain size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
            STAR
          </div>
          <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '0.35rem', fontWeight: 600 }}>
            Simulate JD questions with AI feedback →
          </div>
        </div>

        <div
          className="glass-panel"
          onClick={() => onNavigate('profile')}
          style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Privacy & Trust</span>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
              <Shield size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.8rem', color: 'var(--text-primary)' }}>
            {currentUser.privacySettings?.visibleToEmployers ? '🟢 Discoverable' : '🔒 Incognito'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#fbbf24', marginTop: '0.35rem', fontWeight: 600 }}>
            Manage who sees contact & salary →
          </div>
        </div>
      </div>

      {/* Precision Job Recommendations Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Precision Matches Calibrated For You
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Calculated using semantic skill overlap, experience level, and salary expectations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('jobs')}
            className="btn btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          >
            <span>View All ({jobs.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {precisionJobs.map(job => (
            <div
              key={job.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <h3
                      onClick={() => onSelectJob(job)}
                      style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                      {job.title}
                    </h3>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.15rem' }}>
                      {job.company}
                    </div>
                  </div>

                  {job.candidateFit && (
                    <span
                      className="badge"
                      style={{
                        background: job.candidateFit.matchScore >= 85 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: job.candidateFit.matchScore >= 85 ? '#34d399' : '#818cf8',
                        border: `1px solid ${job.candidateFit.matchScore >= 85 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                        fontWeight: 800,
                        fontSize: '0.82rem'
                      }}
                    >
                      {job.candidateFit.matchScore}% Match
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={13} /> {job.location} ({job.workCondition})
                  </span>
                  <span>•</span>
                  <span>{job.salaryFormatted || 'Transparent Range'}</span>
                </div>

                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {(job.summary || '').slice(0, 110)}...
                </p>

                {/* Skills Preview */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {(job.mustHaveSkills || []).slice(0, 3).map((skill, sIdx) => {
                    const candidateHas = (currentUser.skills || []).some(
                      s => (typeof s === 'string' ? s : s.name).toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <span
                        key={sIdx}
                        className="badge"
                        style={{
                          fontSize: '0.72rem',
                          background: candidateHas ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)',
                          color: candidateHas ? '#34d399' : 'var(--text-muted)',
                          border: `1px solid ${candidateHas ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`
                        }}
                      >
                        {candidateHas && '✓ '}{skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => onSelectJob(job)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  View Details & Apply
                </button>
                <button
                  onClick={() => onStartInterview(job)}
                  className="btn btn-sm"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                  title="Practice AI Mock Interview for this job"
                >
                  <Brain size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Empowerment Modules Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
            <FileText size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.25rem' }}>AI Resume Studio</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Generate STAR-formatted bullet points calibrated against modern Applicant Tracking Systems.
            </p>
            <button
              onClick={() => onNavigate('resume-studio')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', padding: 0, marginTop: '0.5rem' }}
            >
              Open Studio →
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', flexShrink: 0 }}>
            <Compass size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.25rem' }}>Career Path Intelligence</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Discover higher-impact milestone roles, salary progression charts, and targeted skill bridges.
            </p>
            <button
              onClick={() => onNavigate('career-guidance')}
              style={{ background: 'none', border: 'none', color: '#c084fc', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', padding: 0, marginTop: '0.5rem' }}
            >
              View Career Map →
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', flexShrink: 0 }}>
            <Shield size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.25rem' }}>Candidate Privacy Shield</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              You maintain total sovereignty over your profile. Hide contact details or target compensation anytime.
            </p>
            <button
              onClick={() => onNavigate('profile')}
              style={{ background: 'none', border: 'none', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', padding: 0, marginTop: '0.5rem' }}
            >
              Configure Privacy →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
