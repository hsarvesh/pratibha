import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  User,
  Brain,
  FileText,
  Compass,
  Building2,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  CheckCircle,
  ExternalLink,
  DollarSign,
  BarChart3,
  Sliders,
  Sparkles,
  Globe,
  Home,
  UserPlus,
  LogIn,
  ChevronDown
} from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  portalMode = 'candidate', // 'candidate' | 'employer'
  setPortalMode,
  currentUser,
  switchUserRole,
  theme,
  toggleTheme,
  notifications = [],
  markNotificationRead,
  onOpenLLMConfig,
  onOpenLandingIntro,
  onOpenAuthModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [localLlmActive, setLocalLlmActive] = useState(false);

  useEffect(() => {
    fetch('/api/ai/status')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.llm?.running) {
          setLocalLlmActive(true);
        }
      })
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Distinct navigation sets for Candidate Portal vs Employer Portal
  const candidateNavItems = [
    { id: 'candidate-home', label: 'My Cockpit', icon: Home },
    { id: 'jobs', label: 'Explore Jobs', icon: Briefcase },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'interview-coach', label: 'AI Mock Interview', icon: Brain },
    { id: 'resume-studio', label: 'Resume Studio', icon: FileText },
    { id: 'career-guidance', label: 'Career Guidance', icon: Compass }
  ];

  const employerNavItems = [
    { id: 'applications', label: 'ATS Pipeline', icon: Building2 },
    { id: 'hiring-hub', label: 'Post & Audit JD', icon: Briefcase },
    { id: 'analytics', label: 'Talent Analytics', icon: BarChart3 },
    { id: 'pricing', label: 'Plans & Pricing', icon: DollarSign }
  ];

  const currentNavItems = portalMode === 'candidate' ? candidateNavItems : employerNavItems;

  const handlePortalSwitch = (newMode) => {
    setPortalMode(newMode);
    if (newMode === 'employer') {
      if (currentUser.role !== 'employer') {
        switchUserRole('employer_1');
      } else {
        setCurrentView('applications');
      }
    } else {
      if (currentUser.role !== 'candidate') {
        switchUserRole('candidate_1');
      } else {
        setCurrentView('candidate-home');
      }
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo & Portal Switcher Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            className="brand-logo"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setCurrentView(portalMode === 'candidate' ? 'candidate-home' : 'applications');
              setMobileMenuOpen(false);
            }}
          >
            <div className="brand-icon-wrapper">
              <Brain size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ lineHeight: 1.1 }}>Pratibha</span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: portalMode === 'candidate' ? 'var(--primary)' : '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {portalMode === 'candidate' ? 'Talent Intelligence' : 'Employer ATS'}
              </span>
            </div>
          </div>

          {/* TWO DISTINCT SECTIONS SWITCHER (Requested by User) */}
          <div
            className="role-badge"
            style={{
              padding: '0.2rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '9999px',
              display: 'flex'
            }}
          >
            <button
              id="candidate-portal-btn"
              onClick={() => handlePortalSwitch('candidate')}
              className={`role-pill-btn ${portalMode === 'candidate' ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
            >
              <User size={14} />
              <span>Candidate Portal</span>
            </button>
            <button
              id="employer-portal-btn"
              onClick={() => handlePortalSwitch('employer')}
              className={`role-pill-btn ${portalMode === 'employer' ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
            >
              <Building2 size={14} />
              <span>Employer Portal</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation for Current Portal */}
        <nav className="nav-links-desktop">
          {currentNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`nav-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions Area */}
        <div className="nav-actions">
          {/* LLM Engine Modular Config Pill */}
          <button
            id="open-llm-config-btn"
            onClick={onOpenLLMConfig}
            className="badge badge-purple"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              border: '1px solid rgba(168, 85, 247, 0.45)',
              background: localLlmActive ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              color: 'var(--text-primary)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            title="Configure LLM Engine: Provider, Endpoint URL & Parameters"
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: localLlmActive ? '#34d399' : '#f59e0b',
                boxShadow: localLlmActive ? '0 0 8px #34d399' : '0 0 6px #f59e0b'
              }}
            />
            <Sliders size={13} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>
              {localLlmActive ? 'LLM: 0.6B Active' : 'LLM: Configure'}
            </span>
          </button>

          {/* Sanskrit & Universal Origins Landing Replay Trigger */}
          <button
            id="open-origins-landing-btn"
            onClick={onOpenLandingIntro}
            className="badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '0.35rem 0.7rem',
              borderRadius: '9999px',
              color: '#fbbf24',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            title="Experience Sanskrit Pratibhā and Universal Cultural Origins Animation"
          >
            <Sparkles size={12} />
            <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>प्रतिभा Origins</span>
          </button>

          {/* Notifications Popover */}
          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn"
              onClick={() => setNotifOpen(!notifOpen)}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="badge-counter">{unreadCount}</span>}
            </button>

            {notifOpen && (
              <div className="notif-dropdown animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications ({unreadCount} new)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time alerts</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`notif-item ${!n.read ? 'unread' : ''}`}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.actionUrl === '/profile') setCurrentView('profile');
                          else if (n.actionUrl === '/applications') setCurrentView('applications');
                          else if (n.actionUrl === '/jobs') setCurrentView('jobs');
                          setNotifOpen(false);
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Account / Auth Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              id="user-account-menu-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="btn btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.65rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '9999px'
              }}
              title={`Logged in as ${currentUser.name}`}
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, maxWidth: 110, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {userDropdownOpen && (
              <div
                className="glass-panel animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: 240,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.15rem' }}>
                    Role: {currentUser.role === 'candidate' ? 'Job Seeker (Candidate)' : 'Hiring Manager (Employer)'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('profile');
                    setUserDropdownOpen(false);
                  }}
                  className="btn btn-sm"
                  style={{ justifyContent: 'flex-start', background: 'none', border: 'none', padding: '0.4rem 0.5rem' }}
                >
                  <User size={14} /> My Profile & Privacy
                </button>

                <button
                  id="navbar-register-btn"
                  onClick={() => {
                    onOpenAuthModal('register');
                    setUserDropdownOpen(false);
                  }}
                  className="btn btn-sm"
                  style={{ justifyContent: 'flex-start', background: 'none', border: 'none', padding: '0.4rem 0.5rem', color: 'var(--primary)', fontWeight: 700 }}
                >
                  <UserPlus size={14} /> Register New User
                </button>

                <button
                  id="navbar-signin-btn"
                  onClick={() => {
                    onOpenAuthModal('login');
                    setUserDropdownOpen(false);
                  }}
                  className="btn btn-sm"
                  style={{ justifyContent: 'flex-start', background: 'none', border: 'none', padding: '0.4rem 0.5rem' }}
                >
                  <LogIn size={14} /> Switch Account / Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu animate-fade-in" style={{ padding: '1rem', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
          {/* Mobile Portal Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={() => {
                handlePortalSwitch('candidate');
                setMobileMenuOpen(false);
              }}
              className={`btn btn-sm ${portalMode === 'candidate' ? 'btn-primary' : ''}`}
            >
              Candidate Portal
            </button>
            <button
              onClick={() => {
                handlePortalSwitch('employer');
                setMobileMenuOpen(false);
              }}
              className={`btn btn-sm ${portalMode === 'employer' ? 'btn-primary' : ''}`}
            >
              Employer Portal
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentNavItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`btn ${currentView === item.id ? 'btn-primary' : ''}`}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
