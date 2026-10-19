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
  BarChart3
} from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  currentUser,
  switchUserRole,
  theme,
  toggleTheme,
  notifications = [],
  markNotificationRead
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'jobs', label: 'Explore Jobs', icon: Briefcase },
    { id: 'applications', label: currentUser.role === 'candidate' ? 'My Applications' : 'ATS Pipeline', icon: currentUser.role === 'candidate' ? FileText : Building2 },
    { id: 'interview-coach', label: 'AI Interview Coach', icon: Brain },
    { id: 'resume-studio', label: 'Resume Studio', icon: FileText },
    { id: 'career-guidance', label: 'Career Pathing', icon: Compass },
    { id: 'hiring-hub', label: 'Post a Job', icon: Building2 },
    { id: 'pricing', label: 'Plans & Pricing', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div
          className="brand-logo"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentView('jobs');
            setMobileMenuOpen(false);
          }}
        >
          <div className="brand-icon-wrapper">
            <Brain size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ lineHeight: 1.1 }}>Pratibha</span>
            <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Career Intelligence
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-links-desktop">
          {navItems.map(item => {
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

        {/* Actions: Role Selector, Notifications, Theme, Profile */}
        <div className="nav-actions">
          {/* Role Switcher Pill */}
          <div className="role-badge" title="Switch between Job Seeker and Hiring Manager perspective">
            <button
              className={`role-pill-btn ${currentUser.role === 'candidate' ? 'active' : ''}`}
              onClick={() => switchUserRole('candidate_1')}
            >
              Job Seeker
            </button>
            <button
              className={`role-pill-btn ${currentUser.role === 'employer' ? 'active' : ''}`}
              onClick={() => switchUserRole('employer_1')}
            >
              Employer
            </button>
          </div>

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
                          if (n.actionUrl === '/applications') setCurrentView('applications');
                          else if (n.actionUrl === '/jobs') setCurrentView('jobs');
                          else if (n.actionUrl === '/ats') setCurrentView('applications');
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

          {/* User Profile Quick Access */}
          <button
            className="icon-btn"
            onClick={() => setCurrentView('profile')}
            title={`View Profile: ${currentUser.name}`}
            style={{ overflow: 'hidden', padding: 0 }}
          >
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={18} />
            )}
          </button>

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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Current User: {currentUser.name} ({currentUser.role})
            </span>
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              setCurrentView('profile');
              setMobileMenuOpen(false);
            }}
            className={`mobile-nav-item ${currentView === 'profile' ? 'active' : ''}`}
          >
            <User size={18} />
            <span>My Profile</span>
          </button>
        </div>
      )}
    </header>
  );
}
