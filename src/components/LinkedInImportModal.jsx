import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Upload,
  Link,
  FileText,
  Briefcase,
  Award,
  GraduationCap,
  FolderGit2,
  ArrowRight,
  ShieldCheck,
  Check,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import LinkedInIcon from './LinkedInIcon';

export default function LinkedInImportModal({ isOpen, onClose, currentUser, onImportSuccess }) {
  const [method, setMethod] = useState('url'); // 'url' | 'pdf' | 'text'
  const [linkedinUrl, setLinkedinUrl] = useState(
    currentUser?.resumeDetails?.linkedinUrl || 'https://www.linkedin.com/in/aarav-sharma'
  );
  const [rawText, setRawText] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Field selection toggles
  const [syncOptions, setSyncOptions] = useState({
    headlineAndBio: true,
    skills: true,
    experience: true,
    education: true,
    projects: true
  });

  if (!isOpen) return null;

  // Preset demo profiles for effortless testing
  const presets = [
    { label: 'Aarav Sharma', role: 'Staff Full-Stack Engineer', url: 'https://www.linkedin.com/in/aarav-sharma' },
    { label: 'Priya Nair', role: 'Lead AI & ML Researcher', url: 'https://www.linkedin.com/in/priya-nair-ai' },
    { label: 'Dr. Meera Krishnan', role: 'Principal AI Scientist', url: 'https://www.linkedin.com/in/meera-krishnan' }
  ];

  // Parse LinkedIn data
  const handleParse = async () => {
    setErrorMsg('');
    setIsParsing(true);
    setParsedData(null);

    try {
      const res = await fetch('/api/linkedin/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: method === 'url' ? linkedinUrl : '',
          rawText: method === 'text' || method === 'pdf' ? rawText : '',
          userId: currentUser?.id
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to parse LinkedIn profile');
      }

      setParsedData(data.profile);
    } catch (err) {
      setErrorMsg(err.message || 'Error parsing LinkedIn profile.');
    } finally {
      setIsParsing(false);
    }
  };

  // Simulate file upload from LinkedIn PDF
  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFileName(file.name);
    setIsParsing(true);

    // Read or simulate text from LinkedIn PDF export
    setTimeout(() => {
      const simulatedText = `
        ${currentUser?.name || 'Aarav Sharma'}
        Senior Full-Stack Engineer | Distributed Systems & High-Scale Cloud Architecture
        Bengaluru, Karnataka, India
        Summary:
        Accomplished software engineer with 6+ years specializing in distributed systems, high-throughput microservices in Node.js, Go, React, and AWS.
        Experience:
        Staff Full-Stack Engineer at CloudScale Technologies (2023 - Present)
        Spearheaded distributed microservices serving 2.5M daily active users.
        Senior Software Engineer at NexaTech Innovations (2020 - 2023)
        Engineered financial transaction processing pipelines with zero data loss.
        Skills:
        React.js, Node.js, TypeScript, Go, PostgreSQL, Docker, Kubernetes, Redis, System Design, AWS Cloud
      `;
      setRawText(simulatedText);
      setIsParsing(false);
      // Auto-trigger parse
      fetch('/api/linkedin/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: simulatedText,
          userId: currentUser?.id
        })
      })
        .then(r => r.json())
        .then(d => {
          if (d.success) setParsedData(d.profile);
        });
    }, 800);
  };

  // Final confirmation: Save imported data to Pratibha user profile
  const handleConfirmSync = async () => {
    if (!parsedData) return;
    setIsSyncing(true);
    setErrorMsg('');

    try {
      // Build tailored payload based on selected checkboxes
      const payload = {
        name: parsedData.name,
        headline: syncOptions.headlineAndBio ? parsedData.headline : currentUser?.headline,
        location: parsedData.location || currentUser?.location,
        bio: syncOptions.headlineAndBio ? parsedData.bio : currentUser?.bio,
        skills: syncOptions.skills ? parsedData.skills : currentUser?.skills,
        experience: syncOptions.experience ? parsedData.experience : currentUser?.experience,
        education: syncOptions.education ? parsedData.education : currentUser?.education,
        projects: syncOptions.projects ? parsedData.projects : currentUser?.projects,
        linkedinUrl: parsedData.linkedinUrl || linkedinUrl
      };

      const res = await fetch(`/api/users/${currentUser.id}/import-linkedin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: linkedinUrl,
          parsedData: payload
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error saving LinkedIn profile.');
      }

      setSyncSuccess(true);
      setTimeout(() => {
        onImportSuccess(data.user);
        onClose();
      }, 1400);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile with LinkedIn data.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 1150 }}>
      <div
        className="modal-content glass-panel"
        style={{
          maxWidth: 680,
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          border: '1px solid rgba(10, 102, 194, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="icon-btn"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
          aria-label="Close LinkedIn Import Modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 'var(--radius-md)',
              background: '#0a66c2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 15px rgba(10, 102, 194, 0.4)',
              flexShrink: 0
            }}
          >
            <LinkedInIcon size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Import from LinkedIn
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Sync your verified work history, skills, and executive summary into Pratibha in 1 click.
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {syncSuccess && (
          <div
            className="animate-fade-in"
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}
          >
            <CheckCircle2 size={24} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>
                LinkedIn Profile Successfully Imported & Synced!
              </div>
              <div style={{ fontSize: '0.82rem', marginTop: '0.2rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                Your Pratibha profile has been populated with verified skills and work experience.
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.86rem',
              marginBottom: '1.25rem'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* STEP 1: INPUT METHODS */}
        {!parsedData && !syncSuccess && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Method Tabs */}
            <div
              style={{
                display: 'flex',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '0.25rem',
                border: '1px solid var(--border-color)'
              }}
            >
              {[
                { id: 'url', label: 'Profile URL / Link', icon: Link },
                { id: 'pdf', label: 'Upload LinkedIn PDF', icon: Upload },
                { id: 'text', label: 'Paste Profile Text', icon: FileText }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = method === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMethod(tab.id)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      border: 'none',
                      cursor: 'pointer',
                      background: isActive ? '#0a66c2' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB A: URL */}
            {method === 'url' && (
              <div>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.4rem' }}>
                  LinkedIn Public Profile URL:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://www.linkedin.com/in/your-name"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleParse}
                    disabled={isParsing || !linkedinUrl.trim()}
                    className="btn"
                    style={{
                      background: '#0a66c2',
                      color: 'white',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isParsing ? <RefreshCw size={15} className="spin" /> : <Sparkles size={15} />}
                    <span>{isParsing ? 'Parsing...' : 'Fetch Profile'}</span>
                  </button>
                </div>

                {/* Demo Presets */}
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    QUICK 1-CLICK DEMO PROFILE PRESETS:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {presets.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setLinkedinUrl(p.url);
                        }}
                        className="badge"
                        style={{
                          background: linkedinUrl === p.url ? 'rgba(10, 102, 194, 0.25)' : 'var(--bg-primary)',
                          border: `1px solid ${linkedinUrl === p.url ? '#0a66c2' : 'var(--border-color)'}`,
                          color: linkedinUrl === p.url ? '#60a5fa' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.78rem'
                        }}
                      >
                        {p.label} ({p.role.split(' ')[0]})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB B: PDF */}
            {method === 'pdf' && (
              <div>
                <div
                  style={{
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '2px dashed rgba(10, 102, 194, 0.4)',
                    background: 'rgba(10, 102, 194, 0.04)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handlePdfUpload}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  />
                  <Upload size={32} color="#0a66c2" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {pdfFileName ? `Selected: ${pdfFileName}` : 'Drop your LinkedIn "Save to PDF" file here'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Or click to browse files from your computer
                  </div>
                </div>

                {/* Instructions */}
                <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem', lineHeight: 1.4 }}>
                  <Info size={14} color="#0a66c2" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>
                    <strong>How to get your LinkedIn PDF:</strong> On LinkedIn, open your profile → click <strong>More</strong> in your intro card → choose <strong>Save to PDF</strong>.
                  </span>
                </div>
              </div>
            )}

            {/* TAB C: RAW TEXT */}
            {method === 'text' && (
              <div>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.4rem' }}>
                  Paste LinkedIn Profile Details:
                </label>
                <textarea
                  className="form-textarea"
                  rows={6}
                  placeholder="Paste your headline, about summary, experience list, or skills copied directly from your LinkedIn profile..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleParse}
                  disabled={isParsing || !rawText.trim()}
                  className="btn btn-primary"
                  style={{
                    marginTop: '0.75rem',
                    width: '100%',
                    background: '#0a66c2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {isParsing ? <RefreshCw size={15} className="spin" /> : <Sparkles size={15} />}
                  <span>{isParsing ? 'Analyzing with Pratibha AI...' : 'Parse Profile Details'}</span>
                </button>
              </div>
            )}

            {/* Trust & Sovereignty Guarantee */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)'
              }}
            >
              <ShieldCheck size={16} color="#10b981" style={{ flexShrink: 0 }} />
              <span>
                Pratibha respects LinkedIn terms of service and candidate data ownership. We never post on your behalf or access private messages.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW & CONFIRMATION */}
        {parsedData && !syncSuccess && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Parsed Summary Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(10, 102, 194, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
                border: '1px solid rgba(10, 102, 194, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {parsedData.name}
                    </h3>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={11} /> Verified LinkedIn Match
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {parsedData.headline}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    📍 {parsedData.location}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setParsedData(null)}
                  className="btn btn-sm"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}
                >
                  Change Input
                </button>
              </div>

              {parsedData.bio && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.5, background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  "{parsedData.bio.slice(0, 180)}..."
                </p>
              )}
            </div>

            {/* Granular Field Selectors */}
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Select Elements to Populate into Your Pratibha Profile:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* 1. Experience */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={16} color="var(--primary)" />
                    <div>
                      <strong style={{ fontSize: '0.86rem' }}>Work Experience History</strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                        ({parsedData.experience?.length || 0} career positions found)
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncOptions.experience}
                    onChange={(e) => setSyncOptions({ ...syncOptions, experience: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#0a66c2' }}
                  />
                </label>

                {/* 2. Skills */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={16} color="#10b981" />
                    <div>
                      <strong style={{ fontSize: '0.86rem' }}>Verified Skills Matrix</strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                        ({parsedData.skills?.length || 0} technical skills detected)
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncOptions.skills}
                    onChange={(e) => setSyncOptions({ ...syncOptions, skills: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#0a66c2' }}
                  />
                </label>

                {/* 3. Summary & Headline */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color="#c084fc" />
                    <div>
                      <strong style={{ fontSize: '0.86rem' }}>Executive Bio & Headline</strong>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncOptions.headlineAndBio}
                    onChange={(e) => setSyncOptions({ ...syncOptions, headlineAndBio: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#0a66c2' }}
                  />
                </label>

                {/* 4. Education & Projects */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={16} color="#fbbf24" />
                    <div>
                      <strong style={{ fontSize: '0.86rem' }}>Education & Projects</strong>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncOptions.education}
                    onChange={(e) => setSyncOptions({ ...syncOptions, education: e.target.checked, projects: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#0a66c2' }}
                  />
                </label>
              </div>
            </div>

            {/* Skills Preview Tags */}
            {parsedData.skills && parsedData.skills.length > 0 && (
              <div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Detected Skills:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {parsedData.skills.slice(0, 10).map((s, idx) => (
                    <span key={idx} className="badge" style={{ fontSize: '0.74rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                      {typeof s === 'string' ? s : s.name}
                    </span>
                  ))}
                  {parsedData.skills.length > 10 && (
                    <span className="badge" style={{ fontSize: '0.74rem', color: 'var(--primary)' }}>
                      +{parsedData.skills.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Submit Confirmation Button */}
            <button
              type="button"
              onClick={handleConfirmSync}
              disabled={isSyncing}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                background: '#0a66c2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isSyncing ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Syncing to Pratibha Database...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Confirm & Sync to My Pratibha Profile</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
