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
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
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

  // Candidate Navigation
  const candidatePrimaryNav = [
    { id: 'candidate-home', label: 'Cockpit', icon: Home },
    { id: 'jobs', label: 'Explore Jobs', icon: Briefcase },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'applications', label: 'Applications', icon: FileText }
  ];

  const candidateToolsNav = [
    { id: 'interview-coach', label: 'AI Mock Interview', desc: 'Simulate JD questions with STAR evaluation', icon: Brain },
    { id: 'resume-studio', label: 'AI Resume Studio', desc: 'Optimize bullet points for ATS scanners', icon: FileText },
    { id: 'career-guidance', label: 'Career Roadmapping', desc: 'Explore salary bands & growth milestones', icon: Compass }
  ];

  const isCareerToolActive = candidateToolsNav.some(t => t.id === currentView);

  // Employer Navigation
  const employerNavItems = [
    { id: 'applications', label: 'ATS Pipeline', icon: Building2 },
    { id: 'hiring-hub', label: 'Post & Audit JD', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'pricing', label: 'Plans & Pricing', icon: DollarSign }
  ];

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
        {/* Brand & Portal Switcher Section (Left) */}
        <div className="brand-section">
          {/* Logo */}
          <div
            className="brand-logo"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setCurrentView(portalMode === 'candidate' ? 'candidate-home' : 'applications');
              setMobileMenuOpen(false);
            }}
          >
            <div className="brand-icon-wrapper">
              <Brain size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ lineHeight: 1.1 }}>Pratibha</span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: portalMode === 'candidate' ? 'var(--primary)' : '#10b981', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {portalMode === 'candidate' ? 'Talent' : 'Employer'}
              </span>
            </div>
          </div>

          {/* Distinct Portal Switcher Pill */}
          <div
            className="role-badge"
            style={{
              padding: '0.15rem 0.25rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '9999px',
              display: 'flex',
              flexShrink: 0
            }}
          >
            <button
              id="candidate-portal-btn"
              onClick={() => handlePortalSwitch('candidate')}
              className={`role-pill-btn ${portalMode === 'candidate' ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.22rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
              title="Switch to Candidate Portal"
            >
              <User size={13} />
              <span>Candidate</span>
            </button>
            <button
              id="employer-portal-btn"
              onClick={() => handlePortalSwitch('employer')}
              className={`role-pill-btn ${portalMode === 'employer' ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.22rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
              title="Switch to Employer Portal"
            >
              <Building2 size={13} />
              <span>Employer</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation for Current Portal (Center) */}
        <nav className="nav-links-desktop">
          {portalMode === 'candidate' ? (
            <>
              {candidatePrimaryNav.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setToolsDropdownOpen(false);
                    }}
                    className={`nav-btn ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* AI & Career Tools Popover Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  className={`nav-btn ${isCareerToolActive ? 'active' : ''}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Sparkles size={14} color={isCareerToolActive ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span>AI Tools</span>
                  <ChevronDown size={13} style={{ transform: toolsDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>

                {toolsDropdownOpen && (
                  <div
                    className="glass-panel animate-fade-in"
                    style={{
                      position: 'absolute',
                      top: '115%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 270,
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.45)',
                      zIndex: 1050,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    {candidateToolsNav.map(tool => {
                      const Icon = tool.icon;
                      const isActive = currentView === tool.id;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => {
                            setCurrentView(tool.id);
                            setToolsDropdownOpen(false);
                          }}
                          className="btn btn-sm"
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.6rem',
                            padding: '0.55rem 0.65rem',
                            textAlign: 'left',
                            background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                            border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        >
                          <div style={{ marginTop: 2, color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: isActive ? 'var(--primary)' : 'var(--text-primary)' }}>
                              {tool.label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3, marginTop: 1 }}>
                              {tool.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {employerNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`nav-btn ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </>
          )}
        </nav>

        {/* Actions Area (Right - Always Visible & Never Overflowing) */}
        <div className="nav-actions">
          {/* LLM Engine Modular Config Pill */}
          <button
            id="open-llm-config-btn"
            onClick={onOpenLLMConfig}
            className="badge badge-purple"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              border: '1px solid rgba(168, 85, 247, 0.45)',
              background: localLlmActive ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              padding: '0.3rem 0.6rem',
              borderRadius: '9999px',
              color: 'var(--text-primary)',
              flexShrink: 0
            }}
            title="Configure LLM Engine: Provider, Endpoint URL & Parameters"
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: localLlmActive ? '#34d399' : '#f59e0b',
                boxShadow: localLlmActive ? '0 0 8px #34d399' : '0 0 6px #f59e0b'
              }}
            />
            <Sliders size={12} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>
              <span className="hide-on-compact">{localLlmActive ? 'LLM: 0.6B' : 'LLM: Config'}</span>
              <span style={{ display: 'none' }} className="show-compact">LLM</span>
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
              gap: '0.35rem',
              cursor: 'pointer',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '0.3rem 0.6rem',
              borderRadius: '9999px',
              color: '#fbbf24',
              flexShrink: 0
            }}
            title="Experience Sanskrit Pratibhā and Universal Cultural Origins Animation"
          >
            <Sparkles size={12} />
            <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>
              <span className="hide-on-compact">प्रतिभा </span>Origins
            </span>
          </button>

          {/* Notifications Popover */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              className="icon-btn"
              onClick={() => setNotifOpen(!notifOpen)}
              title="Notifications"
              aria-label="Notifications"
              style={{ width: 34, height: 34 }}
            >
              <Bell size={16} />
              {unreadCount > 0 && <span className="badge-counter">{unreadCount}</span>}
            </button>

            {notifOpen && (
              <div
                className="notif-dropdown animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: 300,
                  zIndex: 1100
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Notifications ({unreadCount} new)</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Real-time alerts</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
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
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
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
            style={{ width: 34, height: 34, flexShrink: 0 }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User Account / Auth Trigger */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              id="user-account-menu-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="btn btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.55rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '9999px',
                flexShrink: 0
              }}
              title={`Logged in as ${currentUser.name}`}
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, maxWidth: 90, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
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
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.45)',
                  zIndex: 1100,
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

          {/* Mobile Menu Hamburger (Visible on screens < 1100px) */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open Navigation Menu"
            style={{ width: 34, height: 34, flexShrink: 0 }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
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
            {portalMode === 'candidate' ? (
              <>
                {candidatePrimaryNav.map(item => {
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
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', margin: '0.5rem 0 0.2rem' }}>
                  AI TOOLS
                </div>
                {candidateToolsNav.map(item => {
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
              </>
            ) : (
              <>
                {employerNavItems.map(item => {
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
