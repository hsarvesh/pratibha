import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Users,
  MessageSquare,
  ShieldCheck,
  Send,
  Save
} from 'lucide-react';

export default function MockInterviewSimulator({
  jobs = [],
  currentUser,
  preselectedJob = null,
  onSaveSession
}) {
  const [selectedJobId, setSelectedJobId] = useState(preselectedJob?.id || (jobs[0]?.id || 'job_1'));
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  // Fetch JD-tailored questions when job changes
  useEffect(() => {
    if (!selectedJob) return;
    setLoadingQuestions(true);
    fetch('/api/interview/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: selectedJob.id, candidateId: currentUser.id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.questions) {
          setQuestions(data.questions);
          setActiveQuestionIndex(0);
          setUserAnswer('');
          setEvaluationResults({});
          setSessionCompleted(false);
        }
        setLoadingQuestions(false);
      })
      .catch(err => {
        console.error('Error fetching questions:', err);
        setLoadingQuestions(false);
      });
  }, [selectedJobId]);

  const currentQuestion = questions[activeQuestionIndex];
  const currentEval = evaluationResults[currentQuestion?.id];

  // Submit Answer for Real-Time AI Evaluation against JD
  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;
    setEvaluating(true);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          userAnswer: userAnswer.trim(),
          jobId: selectedJob.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setEvaluationResults(prev => ({
          ...prev,
          [currentQuestion.id]: {
            ...data.evaluation,
            userAnswer: userAnswer.trim()
          }
        }));
      }
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  // Sample Answer Auto-Fill for instant demonstration
  const handleFillSample = () => {
    if (activeQuestionIndex === 0) {
      setUserAnswer(
        'In my architecture for high-throughput distributed microservices, I implement connection pooling with strict upper bounds, circuit breakers using exponential backoffs, and an asynchronous queue with Kafka for non-critical writes. We monitor p99 latency via Prometheus & Grafana, caching hot read queries in Redis clusters to prevent database connection exhaustion.'
      );
    } else if (activeQuestionIndex === 1) {
      setUserAnswer(
        'During a production outage where downstream Redis caches became desynchronized, I led root-cause isolation by tracing distributed Jaeger spans. We mitigated the cascade by applying automated rate limiting and warming cache replicas using fallback batch workers, reducing P99 latency back from 3.2s to 45ms.'
      );
    } else if (activeQuestionIndex === 2) {
      setUserAnswer(
        'When our lead architect proposed synchronous HTTP calls for a heavy reporting service, I scheduled a constructive RFC session where I presented load-testing benchmarks demonstrating high failure rates. I proposed an asynchronous event-driven alternative with RabbitMQ that satisfied their requirements while preserving system resilience.'
      );
    } else {
      setUserAnswer(
        'I prioritize by classifying tasks into production SLA impacts vs technical debt. High-severity bugs impacting users are isolated immediately with hotfixes, while architectural refactors are scoped into 2-week sprint milestones with explicit measurable OKRs and automated test guards.'
      );
    }
  };

  // Move to next question or complete
  const handleNext = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setUserAnswer(evaluationResults[questions[activeQuestionIndex + 1]?.id]?.userAnswer || '');
    } else {
      setSessionCompleted(true);
    }
  };

  const calculateOverallScore = () => {
    const scores = Object.values(evaluationResults).map(e => e.score);
    if (!scores.length) return 85;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  return (
    <div className="interview-coach-container animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem 1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.2)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', marginBottom: '0.65rem' }}>
              <Brain size={15} color="var(--primary)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Pratibha AI Flagship Innovation
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
              AI-Powered Interview Coach & Dual Feedback Engine
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 720, fontSize: '0.92rem', marginTop: '0.35rem' }}>
              Unlike generic mock interviews, Pratibha generates questions dynamically anchored to the target <strong>Job Description</strong>. Answers are evaluated with tailored feedback for both the <strong>Candidate</strong> (coaching) and the <strong>Interview Panel</strong> (probing signals).
            </p>
          </div>

          {/* Job Selector Dropdown */}
          <div style={{ minWidth: 260 }}>
            <label className="form-label" style={{ marginBottom: '0.35rem' }}>Select Target Role to Practice:</label>
            <select
              className="form-select"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loadingQuestions ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Sparkles size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.15rem' }}>Synthesizing JD-Anchored Interview Questions...</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Analyzing {selectedJob.title} responsibilities, core skills, and cultural values.
          </p>
        </div>
      ) : sessionCompleted ? (
        /* Completed Summary View */
        <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#34d399' }}>
            <Award size={36} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Interview Simulation Completed!</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 540, margin: '0.5rem auto 1.5rem' }}>
            Great job! You answered all {questions.length} questions tailored to <strong>{selectedJob.title}</strong> at {selectedJob.company}.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-secondary)', padding: '1rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Overall Readiness Score</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>{calculateOverallScore()}%</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Interview Verdict</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--emerald)' }}>Recommended for Final Hiring Panel</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSessionCompleted(false);
                setActiveQuestionIndex(0);
              }}
            >
              <RotateCcw size={16} /> Retake Simulation
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (onSaveSession) {
                  onSaveSession({
                    candidateId: currentUser.id,
                    jobId: selectedJob.id,
                    overallScore: calculateOverallScore(),
                    questions
                  });
                }
                alert('Session saved to your career preparation portfolio!');
              }}
            >
              <Save size={16} /> Save Performance to Portfolio
            </button>
          </div>
        </div>
      ) : (
        /* Active Question & Interactive Evaluation View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Progress Tracker */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuestionIndex(idx);
                    setUserAnswer(evaluationResults[q.id]?.userAnswer || '');
                  }}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: activeQuestionIndex === idx ? 'var(--primary)' : evaluationResults[q.id] ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-tertiary)',
                    color: activeQuestionIndex === idx ? 'white' : evaluationResults[q.id] ? '#34d399' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  Q{idx + 1} {evaluationResults[q.id] && '✓'}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Question {activeQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Current Question Box */}
          {currentQuestion && (
            <div className="glass-panel question-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-primary">{currentQuestion.category}</span>
                <span className="badge badge-purple">JD Skill: {currentQuestion.skillTag}</span>
              </div>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '0.65rem' }}>
                {currentQuestion.question}
              </h2>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Evaluated against: {currentQuestion.evalCriteria}
              </p>
            </div>
          )}

          {/* Answer Input Area */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Your Response (STAR Framework Recommended):</label>
              <button
                type="button"
                onClick={handleFillSample}
                style={{ fontSize: '0.78rem', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Auto-fill Exemplary Candidate Answer (Demo)
              </button>
            </div>

            <textarea
              className="form-textarea"
              placeholder="Structure your answer: Situation, Task, Action, and Measurable Result (STAR)..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              rows={5}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleEvaluateAnswer}
                  disabled={evaluating || !userAnswer.trim()}
                >
                  <Sparkles size={14} /> {evaluating ? 'Analyzing Answer against JD...' : 'Evaluate with AI'}
                </button>

                {currentEval && (
                  <button className="btn btn-secondary btn-sm" onClick={handleNext}>
                    Next Question <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* DUAL EVALUATION RESULTS: CANDIDATE FEEDBACK & PANEL FEEDBACK */}
          {currentEval && (
            <div className="dual-feedback-grid animate-fade-in">
              {/* Candidate Feedback Card */}
              <div className="feedback-card-candidate">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <BookOpen size={18} color="var(--emerald)" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
                      Candidate Feedback Report
                    </h3>
                  </div>
                  <span className="badge badge-emerald">Score: {currentEval.score}/100</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                  <div>
                    <strong style={{ color: '#34d399' }}>Key Strengths Demonstrated:</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{currentEval.candidateFeedback?.strengths}</p>
                  </div>

                  <div>
                    <strong style={{ color: '#fbbf24' }}>Areas for Technical Nuance:</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{currentEval.candidateFeedback?.missedNuances}</p>
                  </div>

                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>💡 Actionable Tip (X-Y-Z Formula):</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{currentEval.candidateFeedback?.actionableTip}</p>
                  </div>
                </div>
              </div>

              {/* Interview Panel Feedback Card (Pratibha USP) */}
              <div className="feedback-card-panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Users size={18} color="var(--primary)" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#818cf8' }}>
                      Interview Panel Intelligence Report
                    </h3>
                  </div>
                  <span className="badge badge-purple">{currentEval.performanceTier}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                  <div>
                    <strong style={{ color: '#818cf8' }}>JD Alignment Signals:</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{currentEval.panelFeedback?.keySignals}</p>
                  </div>

                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>🎯 Recommended Probing Follow-Up Question:</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 2, fontStyle: 'italic' }}>
                      "{currentEval.panelFeedback?.suggestedFollowUp}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
