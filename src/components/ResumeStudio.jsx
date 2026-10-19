import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Upload,
  Download,
  Printer,
  CheckCircle2,
  Copy,
  Plus,
  Trash2,
  Brain,
  Wand2,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ResumeStudio({ currentUser, onUpdateProfile }) {
  const [activeTab, setActiveTab] = useState('optimizer'); // 'optimizer' | 'builder' | 'upload'
  const [rawBullet, setRawBullet] = useState(
    'Responsible for building microservices in Node.js and improving performance for users.'
  );
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Cloud Architect');
  const [optimizedResult, setOptimizedResult] = useState(null);
  const [optimizing, setOptimizing] = useState(false);

  // Resume builder editable state
  const [resumeData, setResumeData] = useState({
    name: currentUser.name || 'Aarav Sharma',
    headline: currentUser.headline || 'Senior Full-Stack Engineer | Distributed Cloud Architecture',
    email: currentUser.email || 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    location: currentUser.location || 'Bengaluru, India',
    summary: currentUser.bio || 'Results-driven Senior Full-Stack Engineer with 5+ years of experience engineering high-throughput distributed microservices in Node.js, React, and AWS Cloud.',
    skills: (currentUser.skills || []).map(s => typeof s === 'string' ? s : s.name).join(', '),
    experience: currentUser.experience || [
      {
        id: 'exp_1',
        role: 'Senior Software Engineer',
        company: 'NexaTech Innovations',
        period: '2022 - Present',
        description: 'Architected and scaled real-time analytics microservices serving 1.5M monthly active users. Reduced latency by 42% through query optimization and Redis caching.'
      }
    ],
    projects: currentUser.projects || [
      {
        id: 'proj_1',
        title: 'HyperQueue - Distributed Task Broker',
        description: 'High-performance asynchronous message broker handling 40k req/sec with guaranteed at-least-once delivery.'
      }
    ]
  });

  // Simulated PDF upload & skills extraction
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleOptimizeBullet = async () => {
    if (!rawBullet.trim()) return;
    setOptimizing(true);
    try {
      const res = await fetch('/api/resume/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: rawBullet, targetRole })
      });
      const data = await res.json();
      if (data.success) {
        setOptimizedResult(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizing(false);
    }
  };

  const handleSimulatedUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('parsing');
    setTimeout(() => {
      setUploadStatus('success');
      alert(`Resume "${file.name}" uploaded & parsed! 14 verified technical skills detected and synced to your profile.`);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '2rem 1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.2)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', marginBottom: '0.5rem' }}>
              <Wand2 size={15} color="var(--primary)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                AI Resume Intelligence Studio
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>AI Resume Builder & Bullet Optimizer</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Supercharge your resume impact using Google's <strong>X-Y-Z formula</strong> ("Accomplished [X] as measured by [Y] by doing [Z]").
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.35rem', borderRadius: 'var(--radius-lg)' }}>
            <button
              className={`btn btn-sm ${activeTab === 'optimizer' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('optimizer')}
            >
              <Sparkles size={14} /> AI Bullet Optimizer
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'builder' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('builder')}
            >
              <FileText size={14} /> Resume Builder
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('upload')}
            >
              <Upload size={14} /> PDF Upload & Parser
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'optimizer' && (
        /* AI BULLET POINT OPTIMIZER */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
            {/* Input Card */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Upgrade Experience Bullets to Google's X-Y-Z Standard
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Paste any standard or weak resume line. Pratibha's AI will inject action verbs, quantifiable metrics, and ATS keywords.
              </p>

              <div className="form-group">
                <label className="form-label">Target Role:</label>
                <input
                  type="text"
                  className="form-input"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Current Resume Bullet Point:</label>
                <textarea
                  className="form-textarea"
                  value={rawBullet}
                  onChange={(e) => setRawBullet(e.target.value)}
                  rows={4}
                  placeholder="e.g. Worked on backend APIs and reduced server crashes..."
                />
              </div>

              {/* Sample Suggestions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Try samples:</span>
                <button
                  type="button"
                  style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'underline' }}
                  onClick={() => setRawBullet('Helped with CI/CD deployments and made tests faster.')}
                >
                  CI/CD Pipeline
                </button>
                <span>•</span>
                <button
                  type="button"
                  style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'underline' }}
                  onClick={() => setRawBullet('Managed database queries and fixed slow loading pages.')}
                >
                  Database Performance
                </button>
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={handleOptimizeBullet}
                disabled={optimizing || !rawBullet.trim()}
              >
                <Sparkles size={16} /> {optimizing ? 'Transforming with AI...' : 'Optimize Bullet with AI'}
              </button>
            </div>

            {/* Results Card */}
            <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Optimized Result</h3>
                  <span className="badge badge-emerald">X-Y-Z Formula</span>
                </div>

                {optimizedResult ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>High-Impact Bullet Point:</span>
                      <p style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                        "{optimizedResult.suggestedEnhancement}"
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="glass-panel" style={{ padding: '0.85rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ATS Score Boost</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{optimizedResult.atsScoreImpact}</div>
                      </div>
                      <div className="glass-panel" style={{ padding: '0.85rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Formula Used</span>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>[X] by [Y] with [Z]</div>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Power Verbs Injected:</span>
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem' }}>
                        {optimizedResult.powerVerbsAdded.map(v => (
                          <span key={v} className="badge badge-primary">{v}</span>
                        ))}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {optimizedResult.recommendation}
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <Brain size={40} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
                    <p style={{ fontSize: '0.9rem' }}>Enter a bullet point on the left and click "Optimize with AI" to generate quantified, impact-driven achievements.</p>
                  </div>
                )}
              </div>

              {optimizedResult && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(optimizedResult.suggestedEnhancement);
                    alert('Copied optimized bullet to clipboard!');
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  <Copy size={14} /> Copy to Clipboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'builder' && (
        /* RESUME BUILDER & LIVE PRINTABLE PREVIEW */
        <div className="resume-layout">
          {/* Editor Column */}
          <div className="glass-panel" style={{ padding: '1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Resume Details</h2>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={resumeData.name}
                onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Professional Headline</label>
              <input
                type="text"
                className="form-input"
                value={resumeData.headline}
                onChange={(e) => setResumeData({ ...resumeData, headline: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  className="form-input"
                  value={resumeData.email}
                  onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={resumeData.phone}
                  onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Summary</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Skills (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                value={resumeData.skills}
                onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                <Printer size={14} /> Print / Export PDF
              </button>
            </div>
          </div>

          {/* Printable Resume Paper Column */}
          <div className="resume-paper" id="printable-resume">
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
              {resumeData.name}
            </h1>
            <div style={{ fontSize: '0.92rem', color: '#6366f1', fontWeight: 600, marginBottom: '0.45rem' }}>
              {resumeData.headline}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
              {resumeData.email} • {resumeData.phone} • {resumeData.location}
            </div>

            <h2>Summary</h2>
            <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
              {resumeData.summary}
            </p>

            <h2>Core Competencies</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '0.5rem 0' }}>
              {resumeData.skills.split(',').map(s => s.trim()).filter(Boolean).map(skill => (
                <span
                  key={skill}
                  style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px', color: '#1e293b', fontWeight: 600 }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <h2>Work Experience</h2>
            {resumeData.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                  <span>{exp.role} — {exp.company}</span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{exp.period}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {exp.description}
                </p>
              </div>
            ))}

            <h2>Featured Projects</h2>
            {resumeData.projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{proj.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>{proj.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        /* PDF UPLOAD & PARSER SIMULATION */
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--primary)' }}>
              <Upload size={32} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Upload Existing Resume (PDF)
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Pratibha's AI will parse your skills, work history, and projects to automatically populate your verified candidate profile and calculate precision match scores.
            </p>

            <label
              className="btn btn-primary"
              style={{ cursor: 'pointer', display: 'inline-flex', padding: '0.85rem 2rem' }}
            >
              <Upload size={16} /> Choose PDF File to Parse
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleSimulatedUpload} style={{ display: 'none' }} />
            </label>

            {uploadStatus === 'parsing' && (
              <div style={{ marginTop: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ animation: 'spin 1.5s linear infinite' }} /> Parsing resume sections & extracting skill badges...
              </div>
            )}

            {uploadStatus === 'success' && (
              <div style={{ marginTop: '1.5rem', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} /> Resume parsed successfully! Skills and experience synced.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
