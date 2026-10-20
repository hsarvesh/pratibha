import React, { useState, useEffect } from 'react';
import {
  Building2,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Search,
  MessageSquare,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import SocialBadgesRow from './SocialBadgesRow';

export default function HiringManagerATS({
  currentUser,
  jobs = [],
  onJobCreated,
  applications = [],
  onUpdateApplicationStatus,
  onSubmitFeedback
}) {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'post-job'
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');

  // Job Posting Form State
  const [formData, setFormData] = useState({
    title: '',
    company: currentUser.company || 'CloudScale Technologies',
    domain: 'Software & Technology',
    location: 'Bengaluru, India',
    workCondition: 'Hybrid',
    jobType: 'Full-Time',
    experienceLevel: '3-5 years',
    minExpYears: 3,
    maxExpYears: 5,
    salaryMin: 2400000,
    salaryMax: 3600000,
    summary: '',
    responsibilities: 'Architect and scale distributed cloud services.\nCollaborate with product and architecture teams on roadmap execution.\nOptimize PostgreSQL query plans and Redis cache invalidation.\nDrive automated test coverage and mentor junior software engineers.',
    mustHaveSkills: 'React, Node.js, TypeScript, PostgreSQL, AWS Cloud',
    niceToHaveSkills: 'Docker, Kubernetes, GraphQL, Kafka',
    mission: 'Empowering software engineering teams worldwide with zero-friction developer tooling.',
    values: 'Radical Candor, Craftsmanship, Continuous Learning',
    deiStatement: 'We are an Equal Opportunity Employer and celebrate diversity across all backgrounds.',
    isFeatured: true
  });

  // Live Parameterized Quality Assessment State
  const [liveEvaluation, setLiveEvaluation] = useState({
    score: 88,
    qualityRating: 'A (Strong)',
    breakdown: {
      responsibilitiesClarity: 18,
      compensationTransparency: 20,
      qualificationsDistinction: 18,
      cultureAndMission: 14,
      deiCommitment: 10,
      processTransparency: 8
    },
    feedbackTips: [
      'Detail the complete interview stages and expected duration to minimize candidate anxiety.'
    ]
  });

  // Modal states for Scheduling & Feedback
  const [scheduleModalApp, setScheduleModalApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('2026-10-24T14:30');
  const [interviewStage, setInterviewStage] = useState('Technical Deep-Dive');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/pba-round-eval');

  const [feedbackModalApp, setFeedbackModalApp] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    technicalScore: 9,
    cultureScore: 8,
    communicationScore: 9,
    strengths: 'Demonstrated outstanding distributed systems mastery and clean code principles.',
    areasOfImprovement: 'Could explore Kubernetes canary deployment patterns in more depth.',
    summary: 'Strong candidate recommendation. Proceed to final leadership discussion.'
  });

  // Calculate live JD assessment as user edits fields
  useEffect(() => {
    const payload = {
      ...formData,
      responsibilities: formData.responsibilities.split('\n').filter(Boolean),
      mustHaveSkills: formData.mustHaveSkills.split(',').map(s => s.trim()).filter(Boolean),
      niceToHaveSkills: formData.niceToHaveSkills.split(',').map(s => s.trim()).filter(Boolean),
      cultureMission: {
        mission: formData.mission,
        values: formData.values.split(',').map(s => s.trim()).filter(Boolean)
      }
    };

    fetch('/api/jobs/evaluate-jd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.evaluation) {
          setLiveEvaluation(data.evaluation);
        }
      })
      .catch(console.error);
  }, [formData]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      postedBy: currentUser.id,
      responsibilities: formData.responsibilities.split('\n').filter(Boolean),
      mustHaveSkills: formData.mustHaveSkills.split(',').map(s => s.trim()).filter(Boolean),
      niceToHaveSkills: formData.niceToHaveSkills.split(',').map(s => s.trim()).filter(Boolean),
      cultureMission: {
        mission: formData.mission,
        values: formData.values.split(',').map(s => s.trim()).filter(Boolean)
      },
      salaryFormatted: `₹${Number(formData.salaryMin).toLocaleString()} - ₹${Number(formData.salaryMax).toLocaleString()} / year`
    };

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onJobCreated(data.job);
        setActiveTab('pipeline');
        alert('Job Posting published successfully with Parameterized Quality Rating: ' + data.job.qualityRating);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered applications
  const employerApps = applications.filter(app => {
    if (selectedJobFilter !== 'All' && app.jobId !== selectedJobFilter) return false;
    return true;
  });

  const stages = [
    { id: 'Applied', label: 'New Applicants', color: 'var(--primary)' },
    { id: 'Screening', label: 'AI & HR Screening', color: 'var(--blue)' },
    { id: 'Interview Scheduled', label: 'Interview Scheduled', color: 'var(--amber)' },
    { id: 'Offer Extended', label: 'Offer Extended', color: 'var(--emerald)' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Building2 size={20} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              Employer ATS & Talent Acquisition Hub
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {currentUser.name} • {currentUser.company || 'Enterprise Portal'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Leverage Pratibha's Parameterized System to draft high-converting JDs and evaluate pre-vetted candidates.
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.35rem', borderRadius: 'var(--radius-lg)' }}>
          <button
            className={`btn btn-sm ${activeTab === 'pipeline' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('pipeline')}
          >
            <Users size={15} /> Candidate Pipeline ({employerApps.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'post-job' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('post-job')}
          >
            <PlusCircle size={15} /> Post Job (Live Parameterized Scorer)
          </button>
        </div>
      </div>

      {activeTab === 'pipeline' ? (
        /* KANBAN ATS CANDIDATE PIPELINE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Job Filter Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-secondary)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Filter by Job Role:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
              >
                <option value="All">All Active Roles ({jobs.length})</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total Candidates in Pipeline: <strong>{employerApps.length}</strong>
            </span>
          </div>

          {/* Kanban Columns */}
          <div className="kanban-board">
            {stages.map(stage => {
              const stageApps = employerApps.filter(a => a.status === stage.id);
              return (
                <div key={stage.id} className="kanban-column">
                  <div className="kanban-column-header">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }}></span>
                      {stage.label}
                    </span>
                    <span className="badge badge-primary">{stageApps.length}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                    {stageApps.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        No applicants in this stage
                      </div>
                    ) : (
                      stageApps.map(app => (
                        <div key={app.id} className="kanban-card">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <img
                                src={app.candidate?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                                alt={app.candidate?.name}
                                style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <h2 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{app.candidate?.name}</h2>
                                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{app.job?.title}</p>
                              </div>
                            </div>
                            <span className="badge badge-emerald">
                              <Sparkles size={11} /> {app.matchScore}% Fit
                            </span>
                          </div>

                          {app.candidateNotes && (
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'var(--bg-tertiary)', padding: '0.45rem', borderRadius: 'var(--radius-sm)' }}>
                              "{app.candidateNotes}"
                            </p>
                          )}

                          {/* Interview Scheduled Details */}
                          {app.status === 'Interview Scheduled' && app.interviewDate && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Calendar size={13} />
                              {new Date(app.interviewDate).toLocaleDateString()} ({app.interviewStage})
                            </div>
                          )}

                          {/* Existing Feedback Tag */}
                          {app.employerFeedback && (
                            <div style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                              ✓ Feedback Submitted (Rating: {app.employerFeedback.technicalScore}/10)
                            </div>
                          )}

                          {/* Candidate Linked Social Profiles */}
                          {(app.candidate?.socialLinks || app.candidate?.social_links) && (
                            <div style={{ marginTop: '0.45rem', marginBottom: '0.2rem' }}>
                              <SocialBadgesRow socialLinks={app.candidate.socialLinks || app.candidate.social_links} size="sm" />
                            </div>
                          )}

                          {/* Actions Bar */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
                            {stage.id === 'Applied' && (
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.75rem', width: '100%' }}
                                onClick={() => onUpdateApplicationStatus(app.id, 'Screening')}
                              >
                                Move to Screening <ArrowRight size={12} />
                              </button>
                            )}

                            {stage.id === 'Screening' && (
                              <button
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.75rem', width: '100%' }}
                                onClick={() => setScheduleModalApp(app)}
                              >
                                <Calendar size={12} /> Schedule Interview
                              </button>
                            )}

                            {stage.id === 'Interview Scheduled' && (
                              <div style={{ display: 'flex', gap: '0.35rem', width: '100%' }}>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.72rem', flex: 1 }}
                                  onClick={() => setFeedbackModalApp(app)}
                                >
                                  <MessageSquare size={12} /> Leave Feedback
                                </button>
                                <button
                                  className="btn btn-success btn-sm"
                                  style={{ fontSize: '0.72rem', flex: 1 }}
                                  onClick={() => onUpdateApplicationStatus(app.id, 'Offer Extended')}
                                >
                                  Extend Offer
                                </button>
                              </div>
                            )}

                            {stage.id === 'Offer Extended' && (
                              <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
                                🎉 Offer in Negotiation
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* LIVE PARAMETERIZED JOB POSTING STUDIO */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '1.5rem' }}>
            {/* Form Column */}
            <form onSubmit={handleCreateJob} className="glass-panel" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                Create New Role with Parameterized Quality Guard
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Role Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Full-Stack Cloud Architect"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Domain Category</label>
                  <select
                    className="form-select"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  >
                    <option value="Software & Technology">Software & Technology</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Marketing & Growth">Marketing & Growth</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Work Condition</label>
                  <select
                    className="form-select"
                    value={formData.workCondition}
                    onChange={(e) => setFormData({ ...formData, workCondition: e.target.value })}
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="In-Office">In-Office</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Experience Range</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    placeholder="e.g. 4-6 years"
                  />
                </div>
              </div>

              {/* Transparent Compensation Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Min Annual Salary (INR ₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({ ...formData, salaryMin: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Annual Salary (INR ₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({ ...formData, salaryMax: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Responsibilities */}
              <div className="form-group">
                <label className="form-label">Key Responsibilities (One per line with action verbs)</label>
                <textarea
                  className="form-textarea"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Skills */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Must-Have Core Skills (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.mustHaveSkills}
                    onChange={(e) => setFormData({ ...formData, mustHaveSkills: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nice-to-Have Skills (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.niceToHaveSkills}
                    onChange={(e) => setFormData({ ...formData, niceToHaveSkills: e.target.value })}
                  />
                </div>
              </div>

              {/* Culture & DEI */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Company Mission</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Core Cultural Values</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.values}
                    onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Diversity & Equal Opportunity Statement</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.deiStatement}
                  onChange={(e) => setFormData({ ...formData, deiStatement: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
                <PlusCircle size={18} /> Publish Job with Pratibha Quality Seal
              </button>
            </form>

            {/* LIVE PARAMETERIZED QUALITY SCORECARD PANEL (Document USP) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '80px', border: '1.5px solid var(--primary)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <ShieldCheck size={22} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Real-Time JD Quality</h3>
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '0.9rem', padding: '0.35rem 0.8rem' }}>
                    {liveEvaluation.qualityRating}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                    {liveEvaluation.score}
                  </span>
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100 Quality Index</span>
                </div>

                {/* Progress breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span>Responsibilities Actionability</span>
                      <span>{liveEvaluation.breakdown?.responsibilitiesClarity || 0}/20</span>
                    </div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${((liveEvaluation.breakdown?.responsibilitiesClarity || 0) / 20) * 100}%` }}></div></div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span>Compensation Transparency</span>
                      <span>{liveEvaluation.breakdown?.compensationTransparency || 0}/20</span>
                    </div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${((liveEvaluation.breakdown?.compensationTransparency || 0) / 20) * 100}%` }}></div></div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span>Must-Have vs Nice-to-Have Skills</span>
                      <span>{liveEvaluation.breakdown?.qualificationsDistinction || 0}/20</span>
                    </div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${((liveEvaluation.breakdown?.qualificationsDistinction || 0) / 20) * 100}%` }}></div></div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span>Culture & Values Clarity</span>
                      <span>{liveEvaluation.breakdown?.cultureAndMission || 0}/15</span>
                    </div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${((liveEvaluation.breakdown?.cultureAndMission || 0) / 15) * 100}%` }}></div></div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span>DEI & Inclusion Commitment</span>
                      <span>{liveEvaluation.breakdown?.deiCommitment || 0}/10</span>
                    </div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${((liveEvaluation.breakdown?.deiCommitment || 0) / 10) * 100}%` }}></div></div>
                  </div>
                </div>

                {/* Targeted Advice to Reduce Hit-and-Miss Ratio */}
                {liveEvaluation.feedbackTips?.length > 0 && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                      <AlertCircle size={14} /> Optimization Suggestions:
                    </div>
                    <ul style={{ paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {liveEvaluation.feedbackTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {scheduleModalApp && (
        <div className="modal-overlay" onClick={() => setScheduleModalApp(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Schedule Interview: {scheduleModalApp.candidate?.name}</h3>
              <button className="icon-btn" onClick={() => setScheduleModalApp(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Interview Stage Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={interviewStage}
                  onChange={(e) => setInterviewStage(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Video Meeting Link (Google Meet / Zoom)</label>
                <input
                  type="text"
                  className="form-input"
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setScheduleModalApp(null)}>Cancel</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onUpdateApplicationStatus(scheduleModalApp.id, 'Interview Scheduled', {
                    interviewDate,
                    interviewStage,
                    interviewLink
                  });
                  setScheduleModalApp(null);
                  alert(`Interview scheduled and invitation sent to ${scheduleModalApp.candidate?.name}!`);
                }}
              >
                Send Interview Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRUCTURED FEEDBACK MODAL (Document Requirement) */}
      {feedbackModalApp && (
        <div className="modal-overlay" onClick={() => setFeedbackModalApp(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 550 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Structured Candidate Feedback against JD</h3>
              <button className="icon-btn" onClick={() => setFeedbackModalApp(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Constructive feedback improves candidate experience and trains Pratibha’s AI matching models.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Technical (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="form-input"
                    value={feedbackData.technicalScore}
                    onChange={(e) => setFeedbackData({ ...feedbackData, technicalScore: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Culture (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="form-input"
                    value={feedbackData.cultureScore}
                    onChange={(e) => setFeedbackData({ ...feedbackData, cultureScore: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Comm (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="form-input"
                    value={feedbackData.communicationScore}
                    onChange={(e) => setFeedbackData({ ...feedbackData, communicationScore: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Key Strengths Demonstrated</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={feedbackData.strengths}
                  onChange={(e) => setFeedbackData({ ...feedbackData, strengths: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Areas of Improvement / Gaps against JD</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={feedbackData.areasOfImprovement}
                  onChange={(e) => setFeedbackData({ ...feedbackData, areasOfImprovement: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Overall Evaluation Summary</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={feedbackData.summary}
                  onChange={(e) => setFeedbackData({ ...feedbackData, summary: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setFeedbackModalApp(null)}>Cancel</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onSubmitFeedback(feedbackModalApp.id, feedbackData);
                  setFeedbackModalApp(null);
                  alert('Feedback recorded and candidate notified!');
                }}
              >
                Submit Constructive Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
