import React from 'react';
import {
  X,
  CheckCircle2,
  MapPin,
  Briefcase,
  DollarSign,
  Phone,
  Mail,
  Shield,
  Award,
  Sparkles,
  ExternalLink,
  ThumbsUp,
  Building2,
  Eye
} from 'lucide-react';

export default function CandidateATSPreviewModal({ isOpen, onClose, candidate }) {
  if (!isOpen || !candidate) return null;

  const privacy = candidate.privacySettings || {
    visibleToEmployers: true,
    showContactNumber: true,
    showTargetSalary: true
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 1100 }}>
      <div
        className="modal-content glass-panel"
        style={{
          maxWidth: 720,
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="icon-btn"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
          aria-label="Close ATS Preview"
        >
          <X size={20} />
        </button>

        {/* ATS View Badge & Informative Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Eye size={13} /> ATS HIRING MANAGER PERSPECTIVE
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Live preview of your verified profile card in employer pipelines
          </span>
        </div>

        {/* Candidate Card Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            position: 'relative',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
            <img
              src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
              alt={candidate.name}
              style={{
                width: 80,
                height: 80,
                borderRadius: 'var(--radius-lg)',
                objectFit: 'cover',
                border: '2px solid var(--primary)'
              }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
                  {candidate.name}
                </h2>
                <span className="badge badge-emerald">
                  <CheckCircle2 size={12} /> Verified Candidate
                </span>
                <span className="badge badge-purple">
                  {candidate.subscriptionTier || 'Pro'} Member
                </span>
              </div>

              <div style={{ fontSize: '0.98rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 500 }}>
                {candidate.headline || 'Software Professional'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.6rem', fontSize: '0.82rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={13} color="var(--primary)" /> {candidate.location || 'Bengaluru, India'}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Briefcase size={13} color="var(--primary)" /> {candidate.yearsOfExperience || 5} Years Experience
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Preferred: {candidate.preferredRemote || 'Hybrid'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details & Privacy Display */}
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.84rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
                <Mail size={14} color="var(--primary)" /> {candidate.email}
              </span>

              {candidate.phone ? (
                privacy.showContactNumber ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontWeight: 600 }}>
                    <Phone size={14} /> {candidate.phone}
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
                    <Phone size={14} /> [Contact Hidden - Available upon application]
                  </span>
                )
              ) : (
                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                  No phone number provided
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <DollarSign size={14} color="#10b981" />
              <span style={{ color: '#94a3b8' }}>Target:</span>
              <strong style={{ color: '#34d399' }}>
                {privacy.showTargetSalary ? (candidate.targetSalary || 'Market Competitive') : 'Confidential'}
              </strong>
            </div>
          </div>
        </div>

        {/* Bio / Summary */}
        {candidate.bio && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Candidate Executive Summary
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              {candidate.bio}
            </p>
          </div>
        )}

        {/* Verified Skills Grid */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
            Verified Skills Matrix ({(candidate.skills || []).length})
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(candidate.skills || []).map((skill, idx) => {
              const name = typeof skill === 'string' ? skill : skill.name;
              const level = skill.level || 'Intermediate';
              const endorsements = skill.endorsements || 5;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem'
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>• {level}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.72rem' }}>
                    <ThumbsUp size={11} /> {endorsements}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Work Experience */}
        {(candidate.experience || []).length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
              Demonstrated Work History
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(candidate.experience || []).map((exp, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{exp.role}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{exp.period}</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--primary)', fontWeight: 600 }}>{exp.company}</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encouraging Footer */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}
        >
          <Sparkles size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Pratibha Advantage:</strong> Unlike traditional job portals where resumes are lost in PDF parsers, your Pratibha profile provides hiring managers with instant verified skills, transparent salary alignment, and STAR-evaluated competency scores.
          </span>
        </div>
      </div>
    </div>
  );
}
