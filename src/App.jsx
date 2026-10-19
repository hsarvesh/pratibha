import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import JobBoard from './components/JobBoard';
import JobDetailsModal from './components/JobDetailsModal';
import MockInterviewSimulator from './components/MockInterviewSimulator';
import HiringManagerATS from './components/HiringManagerATS';
import ResumeStudio from './components/ResumeStudio';
import CandidateApplications from './components/CandidateApplications';
import CareerPathGuidance from './components/CareerPathGuidance';
import UserProfile from './components/UserProfile';
import PricingPlans from './components/PricingPlans';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import LLMConfigModal from './components/LLMConfigModal';
import GlobalLandingIntro from './components/GlobalLandingIntro';

export default function App() {
  const [currentView, setCurrentView] = useState('jobs');
  const [theme, setTheme] = useState(() => localStorage.getItem('pratibha_theme') || 'dark');
  const [userId, setUserId] = useState('candidate_1');
  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(['job_1']);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [preselectedJobForInterview, setPreselectedJobForInterview] = useState(null);
  const [showLLMModal, setShowLLMModal] = useState(false);
  const [showLandingIntro, setShowLandingIntro] = useState(true);
  const [loading, setLoading] = useState(true);

  // Sync theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pratibha_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch Current User
  const loadUser = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  // Fetch Jobs with Candidate Fit
  const loadJobs = async (candId) => {
    try {
      const url = candId ? `/api/jobs?candidateId=${candId}` : '/api/jobs';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  // Fetch Applications
  const loadApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  // Fetch Notifications
  const loadNotifications = async (uId) => {
    try {
      const res = await fetch(`/api/notifications/${uId}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // Initial Load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadUser(userId);
      await loadJobs(userId);
      await loadApplications();
      await loadNotifications(userId);
      setLoading(false);
    };
    init();
  }, [userId]);

  // Switch role between Job Seeker (candidate_1) and Employer (employer_1)
  const switchUserRole = (newUserId) => {
    setUserId(newUserId);
    if (newUserId === 'employer_1') {
      setCurrentView('applications'); // View ATS Pipeline
    } else {
      setCurrentView('jobs');
    }
  };

  // Submit Job Application
  const handleApply = async (jobId, candidateNotes) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          candidateId: currentUser.id,
          candidateNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        await loadApplications();
        await loadNotifications(currentUser.id);
        alert('🎉 Application submitted successfully! The hiring team has been notified.');
      } else {
        alert(data.message || 'Error submitting application');
      }
    } catch (err) {
      console.error(err);
      alert('Application submission error');
    }
  };

  // Update ATS Application Status (from Employer Hub)
  const handleUpdateApplicationStatus = async (appId, status, details = {}) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...details })
      });
      const data = await res.json();
      if (data.success) {
        await loadApplications();
        await loadNotifications(userId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Constructive Employer Feedback
  const handleSubmitFeedback = async (appId, feedbackData) => {
    try {
      const res = await fetch(`/api/applications/${appId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      const data = await res.json();
      if (data.success) {
        await loadApplications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // When a new Job is published by Hiring Manager
  const handleJobCreated = (newJob) => {
    setJobs(prev => [newJob, ...prev]);
  };

  // Toggle Save / Bookmark
  const handleToggleSaveJob = (jobId) => {
    setSavedJobIds(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  // Mark notification read
  const handleMarkNotificationRead = async (notifId) => {
    try {
      await fetch(`/api/notifications/${notifId}/read`, { method: 'PATCH' });
      setNotifications(prev =>
        prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Update user profile
  const handleUpdateProfile = async (uId, updateData) => {
    try {
      const res = await fetch(`/api/users/${uId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        await loadJobs(uId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Skill
  const handleAddSkill = async (uId, skillData) => {
    try {
      const res = await fetch(`/api/users/${uId}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(prev => ({ ...prev, skills: data.skills }));
        await loadJobs(uId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Start interview for specific job
  const handleStartInterview = (job) => {
    setPreselectedJobForInterview(job);
    setCurrentView('interview-coach');
  };

  if (loading || !currentUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-gradient)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>
            ⚡
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Loading Pratibha Career Intelligence...</h2>
        </div>
      </div>
    );
  }

  const hasAppliedToSelected = applications.some(
    a => a.jobId === selectedJobForModal?.id && a.candidateId === currentUser.id
  );

  return (
    <div className="app-container">
      {/* Universal Responsive Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        switchUserRole={switchUserRole}
        theme={theme}
        toggleTheme={toggleTheme}
        notifications={notifications}
        markNotificationRead={handleMarkNotificationRead}
        onOpenLLMConfig={() => setShowLLMModal(true)}
        onOpenLandingIntro={() => setShowLandingIntro(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {currentView === 'jobs' && (
          <JobBoard
            jobs={jobs}
            currentUser={currentUser}
            onSelectJob={(job) => setSelectedJobForModal(job)}
            onStartInterview={handleStartInterview}
            savedJobIds={savedJobIds}
            onToggleSaveJob={handleToggleSaveJob}
          />
        )}

        {currentView === 'applications' && (
          currentUser.role === 'candidate' ? (
            <CandidateApplications
              applications={applications}
              currentUser={currentUser}
              onStartInterview={handleStartInterview}
              onBrowseJobs={() => setCurrentView('jobs')}
            />
          ) : (
            <HiringManagerATS
              currentUser={currentUser}
              jobs={jobs}
              onJobCreated={handleJobCreated}
              applications={applications}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
              onSubmitFeedback={handleSubmitFeedback}
            />
          )
        )}

        {currentView === 'interview-coach' && (
          <MockInterviewSimulator
            jobs={jobs}
            currentUser={currentUser}
            preselectedJob={preselectedJobForInterview}
            onSaveSession={() => {}}
          />
        )}

        {currentView === 'resume-studio' && (
          <ResumeStudio
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {currentView === 'career-guidance' && (
          <CareerPathGuidance currentUser={currentUser} />
        )}

        {currentView === 'hiring-hub' && (
          <HiringManagerATS
            currentUser={currentUser.role === 'employer' ? currentUser : {
              id: 'employer_1',
              role: 'employer',
              name: 'Vikramaditya Rao',
              company: 'CloudScale Technologies'
            }}
            jobs={jobs}
            onJobCreated={handleJobCreated}
            applications={applications}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onSubmitFeedback={handleSubmitFeedback}
          />
        )}

        {currentView === 'profile' && (
          <UserProfile
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onAddSkill={handleAddSkill}
          />
        )}

        {currentView === 'pricing' && (
          <PricingPlans currentUser={currentUser} />
        )}

        {currentView === 'analytics' && (
          <AnalyticsDashboard />
        )}
      </main>

      {/* Deep-Dive Job Details Modal with Parameterized Scorecard & Application */}
      {selectedJobForModal && (
        <JobDetailsModal
          job={selectedJobForModal}
          currentUser={currentUser}
          onClose={() => setSelectedJobForModal(null)}
          onApply={handleApply}
          onStartInterview={handleStartInterview}
          hasApplied={hasAppliedToSelected}
        />
      )}

      {/* Modular LLM Configuration Modal (Provider, URL, and long text box for all parameters) */}
      {showLLMModal && (
        <LLMConfigModal
          onClose={() => setShowLLMModal(false)}
        />
      )}

      {/* Global Sanskrit & Universal Words Welcoming Landing Screen */}
      {showLandingIntro && (
        <GlobalLandingIntro
          onComplete={() => setShowLandingIntro(false)}
        />
      )}

      {/* Global Accessibility Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 1.5rem', background: 'var(--bg-secondary)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>Pratibha</strong> — Empowering Job Seekers & Transparent Hiring with AI Intelligence.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>GDPR & Privacy Compliant</span>
            <span>•</span>
            <span>Parameterized ATS Standard</span>
            <span>•</span>
            <span>WCAG 2.1 AAA Accessibility</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
