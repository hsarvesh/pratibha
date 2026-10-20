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
  Globe,
  Phone,
  Mail,
  DollarSign,
  Sparkles,
  Eye,
  Trash2,
  ExternalLink,
  Zap,
  GraduationCap,
  Code2,
  FolderGit2
} from 'lucide-react';
import LinkedInIcon from './LinkedInIcon';
import SocialBadgesRow from './SocialBadgesRow';
import SocialLinksEditor from './SocialLinksEditor';
import CandidateATSPreviewModal from './CandidateATSPreviewModal';

export default function UserProfile({ currentUser, onUpdateProfile, onAddSkill, onOpenLinkedInModal }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'skills' | 'experience' | 'projects' | 'privacy'
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [saveToast, setSaveToast] = useState('');

  // Form State
  const [profileData, setProfileData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    headline: currentUser.headline || '',
    bio: currentUser.bio || '',
    location: currentUser.location || '',
    currentRole: currentUser.currentRole || '',
    yearsOfExperience: currentUser.yearsOfExperience || 5,
    preferredRemote: currentUser.preferredRemote || 'Hybrid',
    targetSalary: currentUser.targetSalary || '₹28,00,000 - ₹38,00,000 / year',
    careerGoals: currentUser.careerGoals || '',
    avatarUrl: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    experience: currentUser.experience || [],
    education: currentUser.education || [
      { id: 'edu_1', degree: 'B.Tech in Computer Science & Engineering', institution: 'National Institute of Technology', year: '2019' }
    ],
    projects: currentUser.projects || [
      {
        id: 'proj_1',
        title: 'Distributed Event Streaming Service',
        description: 'Engineered high-throughput event streaming gateway handling 15k req/sec with zero packet loss.',
        techStack: ['Node.js', 'Go', 'Kafka', 'Docker'],
        link: 'https://github.com/example/stream-engine'
      }
    ],
    socialLinks: currentUser.socialLinks || currentUser.social_links || {},
    privacySettings: currentUser.privacySettings || {
      visibleToEmployers: true,
      showContactNumber: true,
      showTargetSalary: true
    }
  });

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  // Quick skill suggestions
  const suggestedSkills = ['React.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'GraphQL', 'AWS', 'System Design', 'Redis']
    .filter(s => !(currentUser.skills || []).some(cs => (typeof cs === 'string' ? cs : cs.name).toLowerCase() === s.toLowerCase()));

  // New Experience Form
  const [newExp, setNewExp] = useState({ role: '', company: '', period: '', description: '' });
  const [showAddExp, setShowAddExp] = useState(false);

  // New Project Form
  const [newProj, setNewProj] = useState({ title: '', description: '', techStack: '', link: '' });
  const [showAddProj, setShowAddProj] = useState(false);

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    await onUpdateProfile(currentUser.id, profileData);
    setSaveToast('Profile successfully saved & updated in PostgreSQL!');
    setTimeout(() => setSaveToast(''), 3500);
  };

  const handleSaveSocialLinks = async (updatedLinks) => {
    const updatedData = { ...profileData, socialLinks: updatedLinks };
    setProfileData(updatedData);
    await onUpdateProfile(currentUser.id, updatedData);
    setSaveToast('Social & Web networking profiles updated & linked successfully! 🚀');
    setTimeout(() => setSaveToast(''), 3500);
  };

  const handleSkillAdd = async (e) => {
    if (e) e.preventDefault();
    if (!newSkillName.trim()) return;
    await onAddSkill(currentUser.id, {
      name: newSkillName.trim(),
      level: newSkillLevel,
      verified: true
    });
    setNewSkillName('');
    setSaveToast(`Skill "${newSkillName.trim()}" added & verified!`);
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleQuickAddSkill = async (skillName) => {
    await onAddSkill(currentUser.id, {
      name: skillName,
      level: 'Advanced',
      verified: true
    });
    setSaveToast(`Skill "${skillName}" added!`);
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleAddExperienceItem = () => {
    if (!newExp.role || !newExp.company) return;
    const updated = [
      ...profileData.experience,
      { id: `exp_${Date.now()}`, ...newExp }
    ];
    setProfileData({ ...profileData, experience: updated });
    setNewExp({ role: '', company: '', period: '', description: '' });
    setShowAddExp(false);
  };

  const handleRemoveExperienceItem = (id) => {
    const updated = profileData.experience.filter(e => e.id !== id);
    setProfileData({ ...profileData, experience: updated });
  };

  const handleAddProjectItem = () => {
    if (!newProj.title) return;
    const techArray = newProj.techStack ? newProj.techStack.split(',').map(t => t.trim()) : [];
    const updated = [
      ...profileData.projects,
      {
        id: `proj_${Date.now()}`,
        title: newProj.title,
        description: newProj.description,
        techStack: techArray,
        link: newProj.link
      }
    ];
    setProfileData({ ...profileData, projects: updated });
    setNewProj({ title: '', description: '', techStack: '', link: '' });
    setShowAddProj(false);
  };

  const handleRemoveProjectItem = (id) => {
    const updated = profileData.projects.filter(p => p.id !== id);
    setProfileData({ ...profileData, projects: updated });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Notification */}
      {saveToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: '#10b981',
            color: 'white',
            padding: '0.85rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <CheckCircle2 size={18} /> {saveToast}
        </div>
      )}

      {/* Profile Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <img
              src={profileData.avatarUrl}
              alt={profileData.name}
              style={{
                width: 88,
                height: 88,
                borderRadius: 'var(--radius-lg)',
                objectFit: 'cover',
                border: '3px solid var(--primary)',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{profileData.name}</h1>
                <span className="badge badge-emerald">
                  <CheckCircle2 size={12} /> Verified Profile
                </span>
                <span className="badge badge-purple">{currentUser.subscriptionTier || 'Pro'} Member</span>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {profileData.headline || 'Job Seeker & Professional'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={14} color="var(--primary)" /> {profileData.location}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Mail size={14} color="var(--primary)" /> {profileData.email}
                </span>
                {profileData.phone ? (
                  <>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontWeight: 600 }}>
                      <Phone size={14} /> {profileData.phone}
                    </span>
                  </>
                ) : (
                  <>
                    <span>•</span>
                    <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontStyle: 'italic' }}>
                      (No phone added yet — optional)
                    </span>
                  </>
                )}
              </div>

              {/* Connected Social Badges */}
              <div style={{ marginTop: '0.65rem' }}>
                <SocialBadgesRow
                  socialLinks={profileData.socialLinks}
                  size="sm"
                  onEmptyClick={() => setActiveTab('social')}
                  emptyPrompt="+ Connect GitHub, Twitter, Instagram & Social Profiles"
                />
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onOpenLinkedInModal}
              className="btn btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#0a66c2',
                color: 'white',
                border: 'none',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(10, 102, 194, 0.4)'
              }}
            >
              <LinkedInIcon size={15} /> Import from LinkedIn
            </button>
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="btn btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                fontWeight: 700
              }}
            >
              <Eye size={15} /> Preview Employer View
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
            >
              <Save size={15} /> Save All Changes
            </button>
          </div>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'overview', label: '1. Personal & Contact', icon: User },
          { id: 'social', label: '2. Social & Web Profiles', icon: Globe },
          { id: 'preferences', label: '3. Career & Compensation', icon: DollarSign },
          { id: 'skills', label: '4. Verified Skills', icon: Award },
          { id: 'experience', label: '5. Work & Education', icon: Briefcase },
          { id: 'projects', label: '6. Featured Projects', icon: FolderGit2 },
          { id: 'privacy', label: '7. Privacy & Trust', icon: Shield }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="btn"
              style={{
                background: isActive ? 'var(--primary)' : 'var(--bg-secondary)',
                color: isActive ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={15} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PERSONAL & CONTACT */}
      {activeTab === 'overview' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {/* LinkedIn Quick Sync Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              background: 'rgba(10, 102, 194, 0.08)',
              border: '1px solid rgba(10, 102, 194, 0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <LinkedInIcon size={22} color="#0a66c2" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Sync Profile with LinkedIn
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  Import your professional summary, verified skills, and past positions directly from your public LinkedIn profile or PDF.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenLinkedInModal}
              className="btn btn-sm"
              style={{ background: '#0a66c2', color: 'white', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Sparkles size={13} /> Import LinkedIn
            </button>
          </div>

          {/* Quick Social & Web Profiles Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Globe size={16} color="var(--primary)" /> Linked Social & Web Profiles
              </div>
              <div style={{ marginTop: '0.4rem' }}>
                <SocialBadgesRow
                  socialLinks={profileData.socialLinks}
                  size="sm"
                  onEmptyClick={() => setActiveTab('social')}
                  emptyPrompt="+ Connect GitHub, Facebook, Instagram, Twitter/X & Portfolio"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('social')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              Manage Social Profiles →
            </button>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Personal Identity & Contact Channels
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Your foundational profile details. A verified contact number allows hiring teams to contact you instantly for interview scheduling.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} /> Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} /> Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                className="form-input"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                  <Phone size={14} /> Phone Number <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>(Optional)</span>
                </label>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                  Enables WhatsApp/SMS interview alerts
                </span>
              </div>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98765 43210 (Optional)"
                value={profileData.phone || ''}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Kept strictly confidential. You can control visibility to employers in the Privacy tab.
              </span>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} /> Current Location
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bengaluru, India"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Briefcase size={14} /> Professional Headline
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Staff Full-Stack Engineer | Distributed Systems & React"
                value={profileData.headline}
                onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileText size={14} /> Career Bio & Executive Summary
              </label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Describe your engineering superpowers, key architectural achievements, and what drives you..."
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
              <label className="form-label">Profile Avatar Image URL</label>
              <input
                type="text"
                className="form-input"
                value={profileData.avatarUrl}
                onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={handleSaveProfile} className="btn btn-primary">
              <Save size={16} /> Save Personal Details
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: SOCIAL & WEB NETWORKING PROFILES */}
      {activeTab === 'social' && (
        <SocialLinksEditor
          socialLinks={profileData.socialLinks || {}}
          onChange={(newLinks) => setProfileData({ ...profileData, socialLinks: newLinks })}
          onSave={handleSaveSocialLinks}
        />
      )}

      {/* TAB 3: CAREER PREFERENCES & COMPENSATION */}
      {activeTab === 'preferences' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Career Expectations & Compensation Clarity
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Transparent expectations prevent lowball offers and eliminate time wasted on mismatched job roles.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Preferred Work Mode</label>
              <select
                className="form-select"
                value={profileData.preferredRemote}
                onChange={(e) => setProfileData({ ...profileData, preferredRemote: e.target.value })}
              >
                <option value="Remote">100% Remote</option>
                <option value="Hybrid">Hybrid (Flexible)</option>
                <option value="In-Office">In-Office</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Total Years of Experience</label>
              <input
                type="number"
                className="form-input"
                min="0"
                max="40"
                value={profileData.yearsOfExperience}
                onChange={(e) => setProfileData({ ...profileData, yearsOfExperience: Number(e.target.value) })}
              />
            </div>

            <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <DollarSign size={14} color="#10b981" /> Target Annual Compensation Range
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ₹28,00,000 - ₹38,00,000 / year"
                value={profileData.targetSalary}
                onChange={(e) => setProfileData({ ...profileData, targetSalary: e.target.value })}
              />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                💡 Stating your target salary ensures you are only contacted by employers whose budgets match your seniority.
              </span>
            </div>

            <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
              <label className="form-label">Long-Term Career Goals</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Seeking Staff Architect roles in high-scale distributed systems or AI infrastructure..."
                value={profileData.careerGoals}
                onChange={(e) => setProfileData({ ...profileData, careerGoals: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={handleSaveProfile} className="btn btn-primary">
              <Save size={16} /> Save Career Preferences
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: VERIFIED SKILLS */}
      {activeTab === 'skills' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Verified Skills Matrix & Endorsements
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Unlike self-reported keyword lists, Pratibha validates your competencies against real projects, code repositories, and interview benchmarks.
            </p>
          </div>

          {/* Add Skill Form */}
          <form onSubmit={handleSkillAdd} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter skill (e.g. Rust, PyTorch, GraphQL, AWS)..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
            />
            <select
              className="form-select"
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
            >
              <option value="Beginner">Beginner (Fundamental)</option>
              <option value="Intermediate">Intermediate (Autonomous)</option>
              <option value="Advanced">Advanced (Proficient)</option>
              <option value="Expert">Expert (Architectural)</option>
            </select>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} /> Add Skill
            </button>
          </form>

          {/* Quick-add suggestions */}
          {suggestedSkills.length > 0 && (
            <div style={{ marginBottom: '1.75rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={14} color="var(--primary)" /> 1-CLICK POPULAR RECOMMENDATIONS:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {suggestedSkills.slice(0, 6).map((skill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickAddSkill(skill)}
                    className="badge"
                    style={{
                      background: 'rgba(99, 102, 241, 0.12)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Plus size={12} /> {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Existing Skills List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
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
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Level: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{level}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={10} /> Verified
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem' }}>
                      <ThumbsUp size={12} /> {endorsements}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: WORK EXPERIENCE & EDUCATION */}
      {activeTab === 'experience' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Work History */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Work Experience History
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Quantify achievements, architectural scope, and metrics where possible.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddExp(!showAddExp)}
                className="btn btn-sm btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Plus size={14} /> Add Role
              </button>
            </div>

            {/* Add Exp Form */}
            {showAddExp && (
              <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Add New Position</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Role Title (e.g. Senior Backend Engineer)"
                    value={newExp.role}
                    onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Company Name (e.g. Swiggy, Stripe)"
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Period (e.g. 2022 - Present)"
                    style={{ gridColumn: '1 / -1' }}
                    value={newExp.period}
                    onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                  />
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Describe core contributions, tech stack, and impact..."
                    style={{ gridColumn: '1 / -1' }}
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowAddExp(false)} className="btn btn-sm">Cancel</button>
                  <button type="button" onClick={handleAddExperienceItem} className="btn btn-sm btn-primary">Save Role</button>
                </div>
              </div>
            )}

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profileData.experience.map(exp => (
                <div
                  key={exp.id}
                  style={{
                    padding: '1.25rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{exp.role}</strong>
                      <div style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.15rem' }}>
                        {exp.company}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.period}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperienceItem(exp.id)}
                        className="icon-btn"
                        style={{ color: '#ef4444', padding: '0.25rem' }}
                        title="Remove role"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.6rem', lineHeight: 1.5 }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Education & Degrees
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {profileData.education.map(edu => (
                <div
                  key={edu.id}
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{edu.degree}</strong>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{edu.institution}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Graduated {edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FEATURED PROJECTS & PORTFOLIO */}
      {activeTab === 'projects' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Featured Engineering Projects & Portfolio
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Hiring managers value live code, case studies, and demonstrated systems over static buzzwords.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddProj(!showAddProj)}
              className="btn btn-sm btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Project
            </button>
          </div>

          {/* Add Project Form */}
          {showAddProj && (
            <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Add Featured Project</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Project Title (e.g. Distributed Cache Engine)"
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                />
                <input
                  type="url"
                  className="form-input"
                  placeholder="Repository or Live Demo URL"
                  value={newProj.link}
                  onChange={(e) => setNewProj({ ...newProj, link: e.target.value })}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Tech Stack (comma separated: Go, Redis, Docker)"
                  style={{ gridColumn: '1 / -1' }}
                  value={newProj.techStack}
                  onChange={(e) => setNewProj({ ...newProj, techStack: e.target.value })}
                />
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Problem solved, architectural choices, and technical benchmarks achieved..."
                  style={{ gridColumn: '1 / -1' }}
                  value={newProj.description}
                  onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddProj(false)} className="btn btn-sm">Cancel</button>
                <button type="button" onClick={handleAddProjectItem} className="btn btn-sm btn-primary">Save Project</button>
              </div>
            </div>
          )}

          {/* Project List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {profileData.projects.map(proj => (
              <div
                key={proj.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{proj.title}</strong>
                    <button
                      type="button"
                      onClick={() => handleRemoveProjectItem(proj.id)}
                      className="icon-btn"
                      style={{ color: '#ef4444', padding: '0.2rem' }}
                      title="Remove project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                    {proj.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.75rem' }}>
                    {(proj.techStack || []).map((t, tIdx) => (
                      <span key={tIdx} className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {proj.link && (
                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                    >
                      <span>Explore Repository / Demo</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PRIVACY & TRUST CONTROLS */}
      {activeTab === 'privacy' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Shield size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Candidate Privacy & Trust Sovereignty
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: 680 }}>
            At Pratibha, candidates own their data. You decide who discovers you, when your contact number is revealed, and whether your target compensation is public.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 640 }}>
            {/* Toggle 1: Discoverability */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Discoverable in Employer Talent Search
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Allows verified hiring managers looking for your exact skills to send direct interview invitations.
                </div>
              </div>
              <input
                type="checkbox"
                checked={profileData.privacySettings.visibleToEmployers}
                onChange={(e) => setProfileData({
                  ...profileData,
                  privacySettings: { ...profileData.privacySettings, visibleToEmployers: e.target.checked }
                })}
                style={{ width: 20, height: 20, cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Toggle 2: Phone number visibility */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Share Phone Number with Verified Employers
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  If turned off, your phone number remains hidden until you explicitly accept an interview request.
                </div>
              </div>
              <input
                type="checkbox"
                checked={profileData.privacySettings.showContactNumber}
                onChange={(e) => setProfileData({
                  ...profileData,
                  privacySettings: { ...profileData.privacySettings, showContactNumber: e.target.checked }
                })}
                style={{ width: 20, height: 20, cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Toggle 3: Target Salary */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Display Target Compensation Upfront
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Filters out companies whose compensation bands are below your expectations.
                </div>
              </div>
              <input
                type="checkbox"
                checked={profileData.privacySettings.showTargetSalary}
                onChange={(e) => setProfileData({
                  ...profileData,
                  privacySettings: { ...profileData.privacySettings, showTargetSalary: e.target.checked }
                })}
                style={{ width: 20, height: 20, cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={handleSaveProfile} className="btn btn-primary">
              <Save size={16} /> Save Privacy Settings
            </button>
          </div>
        </div>
      )}

      {/* Candidate ATS Preview Modal */}
      <CandidateATSPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        candidate={{
          ...currentUser,
          ...profileData
        }}
      />
    </div>
  );
}
