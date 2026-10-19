import React from 'react';
import {
  FileText,
  Calendar,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Building,
  CheckCircle2,
  Clock,
  Video,
  Award,
  ChevronRight,
  Brain
} from 'lucide-react';

export default function CandidateApplications({
  applications = [],
  currentUser,
  onStartInterview,
  onBrowseJobs
}) {
  const candidateApps = applications.filter(a => a.candidateId === currentUser.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Interview Scheduled':
        return <span className="badge badge-amber"><Calendar size={12} /> Interview Scheduled</span>;
      case 'Screening':
        return <span className="badge badge-primary"><Clock size={12} /> Under Screening</span>;
      case 'Offer Extended':
        return <span className="badge badge-emerald"><Award size={12} /> 🎉 Offer Extended</span>;
      default:
        return <span className="badge badge-purple"><CheckCircle2 size={12} /> Application Submitted</span>;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '2rem 1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.2)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', marginBottom: '0.5rem' }}>
              <FileText size={15} color="var(--primary)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                Application Journey Tracker
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>My Active Applications</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Track real-time status updates, scheduled video interviews, and review constructive feedback from hiring teams.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onBrowseJobs}>
            Explore More Roles <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {candidateApps.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.6 }} />
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Active Applications Yet</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 450, margin: '0 auto 1.5rem' }}>
            Browse verified job listings that match your verified skill set and apply in one click.
          </p>
          <button className="btn btn-primary btn-sm" onClick={onBrowseJobs}>
            Discover Matching Opportunities
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {candidateApps.map(app => (
            <div key={app.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={app.job?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                    alt={app.job?.company}
                    style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{app.job?.title}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: 600 }}>{app.job?.company}</span>
                      <span>•</span>
                      <span>{app.job?.location}</span>
                      <span>•</span>
                      <span className="badge badge-primary">{app.job?.workCondition}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-emerald">
                    <Sparkles size={12} /> {app.matchScore}% Match
                  </span>
                  {getStatusBadge(app.status)}
                </div>
              </div>

              {/* Scheduled Interview Banner */}
              {app.status === 'Interview Scheduled' && app.interviewDate && (
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111827' }}>
                      <Video size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fbbf24' }}>
                        Interview Confirmed: {app.interviewStage || 'Technical Architecture'}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        Date & Time: {new Date(app.interviewDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onStartInterview(app.job)}
                      title="Practice questions tailored to this role"
                    >
                      <Brain size={14} color="var(--primary)" /> AI Interview Practice
                    </button>
                    {app.interviewLink && (
                      <a
                        href={app.interviewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        Join Video Meeting <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Constructive Employer Feedback Card (Design Plan Feature) */}
              {app.employerFeedback && (
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <MessageSquare size={16} color="var(--emerald)" />
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>
                        Constructive Feedback from {app.job?.company}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem' }}>
                      <span className="badge badge-emerald">Technical: {app.employerFeedback.technicalScore}/10</span>
                      <span className="badge badge-primary">Culture: {app.employerFeedback.cultureScore}/10</span>
                      <span className="badge badge-purple">Communication: {app.employerFeedback.communicationScore}/10</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div>
                      <strong style={{ color: '#34d399' }}>Strengths:</strong>
                      <p style={{ color: 'var(--text-secondary)' }}>{app.employerFeedback.strengths}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#fbbf24' }}>Areas of Growth against JD:</strong>
                      <p style={{ color: 'var(--text-secondary)' }}>{app.employerFeedback.areasOfImprovement}</p>
                    </div>
                    <div style={{ fontStyle: 'italic', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                      "{app.employerFeedback.summary}"
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Applied on: {new Date(app.appliedDate).toLocaleDateString()}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => onStartInterview(app.job)}
                >
                  <Brain size={13} color="var(--primary)" /> Practice AI Mock Interview for this Role
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
