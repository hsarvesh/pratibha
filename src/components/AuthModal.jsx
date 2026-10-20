import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Briefcase,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'register' }) {
  const [tab, setTab] = useState(initialTab); // 'register' | 'login'
  const [role, setRole] = useState('candidate'); // 'candidate' | 'employer'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register Form State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    headline: '',
    location: 'Bengaluru, India',
    preferredRemote: 'Hybrid'
  });

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regForm.name.trim() || !regForm.email.trim()) {
      setErrorMsg('Please enter your full name and email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...regForm,
          role
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccessMsg('Account created successfully! Welcome to Pratibha.');
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginForm.email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      setSuccessMsg('Signed in successfully! Welcome back.');
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click Demo Profiles for effortless evaluation
  const handleQuickDemoLogin = async (demoUserId) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/users/${demoUserId}`);
      const data = await res.json();
      if (data.success && data.user) {
        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg('Could not switch to demo profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 1100 }}>
      <div
        className="modal-content glass-panel"
        style={{
          maxWidth: 580,
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="icon-btn"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
          aria-label="Close authentication modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--primary-gradient)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '0.75rem',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)'
            }}
          >
            <Sparkles size={26} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {tab === 'register' ? 'Join Pratibha' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {tab === 'register'
              ? 'Unlock AI-powered precision matching, skills verification & career growth.'
              : 'Sign in to access your applications, interview coaching & career insights.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.3rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              background: tab === 'register' ? 'var(--primary)' : 'transparent',
              color: tab === 'register' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Register New Account
          </button>
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              background: tab === 'login' ? 'var(--primary)' : 'transparent',
              color: tab === 'login' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
        </div>

        {/* Feedback Banners */}
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

        {successMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.86rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Role Selection Segmented Control */}
            <div>
              <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.4rem' }}>
                I am registering as:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div
                  onClick={() => setRole('candidate')}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${role === 'candidate' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: role === 'candidate' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <User size={18} color={role === 'candidate' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      Candidate / Job Seeker
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Seeking career opportunities
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setRole('employer')}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${role === 'employer' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: role === 'employer' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Building2 size={18} color={role === 'employer' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      Employer / Recruiter
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Hiring qualified talent
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} /> Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={role === 'candidate' ? 'e.g. Aarav Sharma' : 'e.g. Vikramaditya Rao'}
                required
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
              />
            </div>

            {/* Email Address */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} /> Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                required
                value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
              />
            </div>

            {/* Optional Phone Number (Requested explicitly by User) */}
            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                  <Phone size={14} /> Phone Number <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                  For prompt SMS/WhatsApp alerts
                </span>
              </div>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98765 43210 (Optional)"
                value={regForm.phone}
                onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                🔒 Your phone number is never shared with third parties. Used only for direct interview scheduling.
              </div>
            </div>

            {/* Password */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={14} /> Create Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                required
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
              />
            </div>

            {/* Basic Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Briefcase size={14} /> {role === 'candidate' ? 'Headline / Current Role' : 'Company Name'}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={role === 'candidate' ? 'e.g. Senior Backend Engineer' : 'e.g. CloudScale Tech'}
                  value={regForm.headline}
                  onChange={(e) => setRegForm({ ...regForm, headline: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} /> Location
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bengaluru, India"
                  value={regForm.location}
                  onChange={(e) => setRegForm({ ...regForm, location: e.target.value })}
                />
              </div>
            </div>

            {/* Trust Assurance */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-secondary)',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '0.25rem'
              }}
            >
              <ShieldCheck size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span>
                By registering, you gain full control of your profile visibility, salary transparency & data privacy.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.98rem',
                fontWeight: 700,
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? 'Creating Your Profile...' : (
                <>
                  <span>Create My {role === 'candidate' ? 'Candidate' : 'Employer'} Profile</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* SIGN IN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} /> Registered Email
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.98rem',
                fontWeight: 700,
                marginTop: '0.5rem'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In to Pratibha'}
            </button>

            {/* Demo Quick Select */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>
                OR INSTANT DEMO SWITCH:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('candidate_1')}
                  className="btn"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: '0.6rem 0.85rem'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                    alt="Aarav"
                    style={{ width: 28, height: 28, borderRadius: '50%', marginRight: '0.65rem' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>Aarav Sharma (Candidate)</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Staff Full-Stack Engineer • 95% Fit Profile</div>
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>Candidate Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('candidate_2')}
                  className="btn"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: '0.6rem 0.85rem'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&auto=format&fit=crop&q=80"
                    alt="Priya"
                    style={{ width: 28, height: 28, borderRadius: '50%', marginRight: '0.65rem' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>Priya Nair (Candidate)</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lead AI/ML Research Engineer</div>
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>Candidate Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('employer_1')}
                  className="btn"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: '0.6rem 0.85rem'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80"
                    alt="Vikram"
                    style={{ width: 28, height: 28, borderRadius: '50%', marginRight: '0.65rem' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>Vikramaditya Rao (Employer)</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>VP of Engineering • CloudScale Tech</div>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Employer Portal</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
