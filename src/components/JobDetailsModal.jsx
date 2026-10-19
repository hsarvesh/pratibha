import React, { useState } from 'react';
import {
  X,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Brain,
  Building,
  HeartHandshake,
  Send,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function JobDetailsModal({
  job,
  currentUser,
  onClose,
  onApply,
  onStartInterview,
  hasApplied = false
}) {
  const [candidateNotes, setCandidateNotes] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!job) return null;

  const quality = job.qualityBreakdown || {
    responsibilitiesClarity: 20,
    compensationTransparency: 20,
    qualificationsDistinction: 19,
    cultureAndMission: 14,
    deiCommitment: 9,
    processTransparency: 12
  };

  const fit = job.candidateFit;

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onApply(job.id, candidateNotes);
    setIsSubmitting(false);
    setShowApplyForm(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src={job.logo}
              alt={job.company}
              style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80';
              }}
            />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{job.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ fontWeight: 600 }}>{job.company}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={13} /> {job.location}</span>
                <span>•</span>
                <span className="badge badge-primary">{job.workCondition}</span>
              </div>
            </div>
          </div>

          <button className="icon-btn" onClick={onClose} aria-label="Close Dialog">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Top Metric Bar: Salary, Exp, Quality Score, AI Match */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
            <div className="glass-panel" style={{ padding: '0.85rem', borderLeft: '3px solid #10b981' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Compensation</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginTop: 2 }}>{job.salaryFormatted}</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--emerald)' }}>100% Transparent</span>
            </div>

            <div className="glass-panel" style={{ padding: '0.85rem', borderLeft: '3px solid var(--primary)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Experience</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: 2 }}>{job.experienceLevel}</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{job.jobType}</span>
            </div>

            <div className="glass-panel" style={{ padding: '0.85rem', borderLeft: '3px solid #a855f7' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>JD Quality Score</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#c084fc', marginTop: 2 }}>
                {job.qualityScore || 94}/100 ({job.qualityRating || 'A+'})
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Pratibha Parameterized</span>
            </div>

            {fit && (
              <div className="glass-panel" style={{ padding: '0.85rem', borderLeft: '3px solid #38bdf8' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Your AI Fit</span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', marginTop: 2 }}>
                  {fit.matchScore}% Fit
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--emerald)' }}>{fit.statusLabel}</span>
              </div>
            )}
          </div>

          {/* AI Precision Fit Analysis Banner */}
          {fit && (
            <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700 }}>AI Candidate Match Diagnostic</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {fit.summary}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', alignSelf: 'center' }}>Matched Skills:</span>
                {fit.matchedSkills?.map(s => (
                  <span key={s} className="badge badge-emerald"><CheckCircle2 size={11} /> {s}</span>
                ))}
                {fit.missingMustHaves?.length > 0 && (
                  <>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', alignSelf: 'center', marginLeft: '0.5rem' }}>Missing:</span>
                    {fit.missingMustHaves.map(s => (
                      <span key={s} className="badge badge-amber"><AlertCircle size={11} /> {s}</span>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Parameterized JD Quality Scorecard (Document USP) */}
          <div className="parameterized-scorecard">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--primary)" />
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700 }}>Parameterized JD Quality Assessment</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Pratibha's automated assessment ensures clear responsibilities, transparent pay, and reduced mismatched applications.
                  </p>
                </div>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                Quality Grade: {job.qualityRating || 'A+'}
              </span>
            </div>

            <div className="dimension-bars-grid">
              <div className="score-bar-item">
                <div className="score-bar-header">
                  <span>Responsibilities Clarity & Action Verbs</span>
                  <span>{quality.responsibilitiesClarity}/20</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${(quality.responsibilitiesClarity / 20) * 100}%` }}></div></div>
              </div>

              <div className="score-bar-item">
                <div className="score-bar-header">
                  <span>Transparent Compensation & Conditions</span>
                  <span>{quality.compensationTransparency}/20</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${(quality.compensationTransparency / 20) * 100}%` }}></div></div>
              </div>

              <div className="score-bar-item">
                <div className="score-bar-header">
                  <span>Must-Have vs Nice-to-Have Skills</span>
                  <span>{quality.qualificationsDistinction}/20</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${(quality.qualificationsDistinction / 20) * 100}%` }}></div></div>
              </div>

              <div className="score-bar-item">
                <div className="score-bar-header">
                  <span>Company Culture & Mission Alignment</span>
                  <span>{quality.cultureAndMission}/15</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${(quality.cultureAndMission / 15) * 100}%` }}></div></div>
              </div>

              <div className="score-bar-item">
                <div className="score-bar-header">
                  <span>Equal Opportunity & DEI Commitment</span>
                  <span>{quality.deiCommitment}/10</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${(quality.deiCommitment / 10) * 100}%` }}></div></div>
              </div>

              <div className="score-bar-item">
                <div className="score-bar-header">
                  <span>Interview Stages Transparency</span>
                  <span>{quality.processTransparency}/15</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${(quality.processTransparency / 15) * 100}%` }}></div></div>
              </div>
            </div>
          </div>

          {/* Job Summary */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Role Summary</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {job.summary}
            </p>
          </div>

          {/* Core Responsibilities */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.65rem' }}>Key Responsibilities</h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {(job.responsibilities || []).map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>

          {/* Skills Requirements: Must-Have vs Nice-To-Have */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} color="var(--primary)" /> Must-Have Core Competencies
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(job.mustHaveSkills || []).map(skill => (
                  <span key={skill} className="skill-chip matched">{skill}</span>
                ))}
              </div>
            </div>

            {job.niceToHaveSkills?.length > 0 && (
              <div className="glass-panel" style={{ padding: '1rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={16} color="var(--amber)" /> Preferred & Nice-to-Have Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {job.niceToHaveSkills.map(skill => (
                    <span key={skill} className="skill-chip">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Work Conditions & Perks */}
          {job.workConditionsDetail && (
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building size={16} color="var(--primary)" /> Work Conditions & Benefits
              </h3>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div><strong>Weekly Commitment:</strong> {job.workConditionsDetail.weeklyHours || 40} hrs/week</div>
                <div><strong>Schedule:</strong> {job.workConditionsDetail.schedule || 'Flexible'}</div>
                <div><strong>Travel:</strong> {job.workConditionsDetail.travelRequirements || 'None'}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(job.workConditionsDetail.perks || []).map(p => (
                  <span key={p} className="badge badge-emerald">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* Company Culture & Mission */}
          {job.cultureMission && (
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Mission & Core Values</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '0.65rem' }}>
                "{job.cultureMission.mission}"
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(job.cultureMission.values || []).map(v => (
                  <span key={v} className="badge badge-primary">{v}</span>
                ))}
              </div>
            </div>
          )}

          {/* Transparent Interview Process Timeline */}
          {job.interviewProcess && job.interviewProcess.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} color="var(--primary)" /> Transparent Interview Process
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {job.interviewProcess.map(step => (
                  <div key={step.stage} className="glass-panel" style={{ padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>STAGE {step.stage}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: 2 }}>{step.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. {step.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Form Drawer */}
          {showApplyForm && (
            <form onSubmit={handleSubmitApplication} className="glass-panel" style={{ padding: '1.25rem', borderColor: 'var(--primary)', background: 'rgba(99, 102, 241, 0.05)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Apply for {job.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Applying as <strong>{currentUser.name}</strong> ({currentUser.currentRole || 'Software Professional'}). Your verified profile credentials and projects will be submitted directly to {job.company}.
              </p>

              <div className="form-group">
                <label className="form-label">Note for the Hiring Team (Optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Highlight why your experience matches this specific JD requirements..."
                  value={candidateNotes}
                  onChange={(e) => setCandidateNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowApplyForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                  <Send size={14} /> {isSubmitting ? 'Submitting...' : 'Confirm & Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              onStartInterview(job);
            }}
          >
            <Brain size={16} color="var(--primary)" /> Practice AI Mock Interview
          </button>

          {hasApplied ? (
            <button className="btn btn-success" disabled style={{ opacity: 0.9 }}>
              <CheckCircle2 size={16} /> Application Submitted
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setShowApplyForm(true)}
            >
              Apply Now <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
