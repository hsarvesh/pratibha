import React, { useState } from 'react';
import {
  User,
  MapPin,
  Briefcase,
  Award,
  CheckCircle2,
  Plus,
  Shield,
  ThumbsUp,
  FileText,
  Save,
  Lock,
  Globe
} from 'lucide-react';

export default function UserProfile({ currentUser, onUpdateProfile, onAddSkill }) {
  const [profileData, setProfileData] = useState({
    name: currentUser.name || '',
    headline: currentUser.headline || '',
    bio: currentUser.bio || '',
    location: currentUser.location || '',
    currentRole: currentUser.currentRole || '',
    preferredRemote: currentUser.preferredRemote || 'Hybrid',
    targetSalary: currentUser.targetSalary || '₹28,00,000 - ₹38,00,000 / year',
    careerGoals: currentUser.careerGoals || ''
  });

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [privacySetting, setPrivacySetting] = useState('public'); // public | recruiters_only

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await onUpdateProfile(currentUser.id, profileData);
    alert('Profile successfully updated!');
  };

  const handleSkillAdd = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    await onAddSkill(currentUser.id, {
      name: newSkillName.trim(),
      level: newSkillLevel,
      verified: true
    });
    setNewSkillName('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Profile Header Card */}
      <div className="glass-panel" style={{ padding: '2rem 1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.name}
            style={{ width: 84, height: 84, borderRadius: 'var(--radius-lg)', objectFit: 'cover', border: '2px solid var(--primary)' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{currentUser.name}</h1>
              <span className="badge badge-emerald" title="Identity and verified technical credentials">
                <CheckCircle2 size={12} /> Verified Profile
              </span>
              <span className="badge badge-purple">{currentUser.subscriptionTier || 'Pro'} Member</span>
            </div>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: 2 }}>{currentUser.headline}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {currentUser.location}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Briefcase size={14} /> {currentUser.yearsOfExperience || 5} Years Experience</span>
              <span>•</span>
              <span>Preferred: {currentUser.preferredRemote}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1fr)', gap: '1.5rem' }}>
        {/* Left Column: Profile Details & Experience */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Basic Info Form */}
          <form onSubmit={handleSaveProfile} className="glass-panel" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Professional Overview</h2>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Headline</label>
              <input
                type="text"
                className="form-input"
                value={profileData.headline}
                onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Summary / Bio</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Work Mode</label>
                <select
                  className="form-select"
                  value={profileData.preferredRemote}
                  onChange={(e) => setProfileData({ ...profileData, preferredRemote: e.target.value })}
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="In-Office">In-Office</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Annual Compensation</label>
              <input
                type="text"
                className="form-input"
                value={profileData.targetSalary}
                onChange={(e) => setProfileData({ ...profileData, targetSalary: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Save size={15} /> Save Changes
            </button>
          </form>

          {/* Work History */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Work History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(currentUser.experience || []).map(exp => (
                <div key={exp.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.98rem' }}>{exp.role}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.period}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginTop: 1 }}>{exp.company}</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills Management & Endorsements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Skills Addition Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Verified Skills & Endorsements</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Skills are evaluated by Pratibha's AI against real-world projects and peer endorsements.
            </p>

            <form onSubmit={handleSkillAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add skill (e.g. Kubernetes, Go)..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  className="form-select"
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Plus size={14} /> Add Skill
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {(currentUser.skills || []).map((skill, idx) => {
                const name = typeof skill === 'string' ? skill : skill.name;
                const level = skill.level || 'Intermediate';
                const endorsements = skill.endorsements || 5;

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-secondary)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.45rem' }}>({level})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}>
                      <ThumbsUp size={12} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{endorsements}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy & Visibility Settings (Document Specification) */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
              <Shield size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Data Privacy & Visibility</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Full compliance with GDPR & data privacy laws. Control which employers discover your profile.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="privacy"
                  checked={privacySetting === 'public'}
                  onChange={() => setPrivacySetting('public')}
                />
                <Globe size={15} /> Open to All Verified Employers
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="privacy"
                  checked={privacySetting === 'recruiters_only'}
                  onChange={() => setPrivacySetting('recruiters_only')}
                />
                <Lock size={15} /> Private Mode (Only Direct Applications)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
