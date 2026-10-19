import React, { useState, useEffect } from 'react';
import {
  Compass,
  TrendingUp,
  DollarSign,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  ShieldAlert,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export default function CareerPathGuidance({ currentUser }) {
  const [pathingData, setPathingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTip, setSelectedTip] = useState(0);

  useEffect(() => {
    fetch(`/api/career/pathing?candidateId=${currentUser.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPathingData(data.pathing);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [currentUser.id]);

  const negotiationScripts = [
    {
      title: 'Countering the Initial Offer with Market Data',
      script: '"Based on my 5 years architecting high-throughput microservices and current industry market percentiles for this tier in Bengaluru, I was targeting closer to ₹36L - ₹40L base. Given my verified track record reducing latency by 42%, how can we bridge this difference?"'
    },
    {
      title: 'Negotiating Equity or Performance Bonuses',
      script: '"I understand the current cash base is fixed at ₹32L. In that case, can we consider structuring an accelerated milestone bonus or additional stock option grants (ESOPs) linked to system reliability KPIs?"'
    },
    {
      title: 'Leveraging Multiple Interview Stages',
      script: '"I am really enthusiastic about your team’s culture and technical roadmap. If we can reach ₹38L base with flexible hybrid conditions, I am prepared to sign and commit right away."'
    }
  ];

  if (loading || !pathingData) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem' }}>
        <Sparkles size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Synthesizing personalized AI career pathing...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '2rem 1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.2)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', marginBottom: '0.65rem' }}>
          <Compass size={15} color="var(--primary)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
            AI-Driven Career Pathing & Industry Insights
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Personalized Career Trajectory & Salary Insights</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 720, fontSize: '0.92rem' }}>
          Real-time roadmap from <strong>{currentUser.currentRole || pathingData.currentPosition}</strong> to executive technical leadership, with salary market percentiles and negotiation strategies.
        </p>
      </div>

      {/* Career Milestone Roadmap */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Next Milestone Role</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{pathingData.nextMilestoneRole}</h2>
          </div>
          <span className="badge badge-purple" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
            Estimated Timeframe: {pathingData.timeframeEstimate}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {pathingData.growthSteps.map(step => (
            <div key={step.step} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '0.75rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                {step.step}
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem' }}>Milestone Step {step.step}</strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 2 }}>{step.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Benchmark Percentiles & Negotiation Tool */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        {/* Salary Percentiles */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <DollarSign size={20} color="#34d399" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AI Market Salary Benchmarking</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Calculated across verified compensation reports for {pathingData.nextMilestoneRole} in Bengaluru & Remote tech hubs.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', borderTop: '3px solid #38bdf8' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>25th PERCENTILE</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                {pathingData.marketSalaryRange.p25}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', borderTop: '3px solid #10b981', background: 'rgba(16, 185, 129, 0.05)' }}>
              <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>MEDIAN (50th)</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399', marginTop: 4 }}>
                {pathingData.marketSalaryRange.median}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', borderTop: '3px solid #a855f7' }}>
              <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700 }}>TOP TIER (90th)</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c084fc', marginTop: 4 }}>
                {pathingData.marketSalaryRange.p90}
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              <Lightbulb size={16} color="var(--primary)" /> Negotiation Insight:
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Companies with transparent JDs on Pratibha have an average offer acceptance rate 28% higher when candidates quote realistic 75th percentile market data during initial screening.
            </p>
          </div>
        </div>

        {/* Tactical Negotiation Scripts */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              AI Offer Negotiation Scripts
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Tactical communication templates to advocate for fair compensation without creating friction.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {negotiationScripts.map((s, idx) => (
                <button
                  key={idx}
                  className={`btn btn-sm ${selectedTip === idx ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedTip(idx)}
                  style={{ fontSize: '0.75rem' }}
                >
                  Scenario {idx + 1}
                </button>
              ))}
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                {negotiationScripts[selectedTip].title}
              </strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontStyle: 'italic', marginTop: '0.5rem', lineHeight: 1.6 }}>
                {negotiationScripts[selectedTip].script}
              </p>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '1rem', width: '100%' }}
            onClick={() => {
              navigator.clipboard.writeText(negotiationScripts[selectedTip].script);
              alert('Copied script to clipboard!');
            }}
          >
            Copy Script to Clipboard
          </button>
        </div>
      </div>

      {/* Skill Gaps & Recommended Certifications */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Target size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Priority Skill Gaps to Bridge</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Identified by comparing your profile with job descriptions for {pathingData.nextMilestoneRole}.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {pathingData.skillGapsToBridge.map(gap => (
            <div key={gap.skill} className="glass-panel" style={{ padding: '1rem', borderLeft: `3px solid ${gap.priority === 'High' ? 'var(--rose)' : 'var(--amber)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <strong style={{ fontSize: '0.92rem' }}>{gap.skill}</strong>
                <span className={`badge ${gap.priority === 'High' ? 'badge-rose' : 'badge-amber'}`}>
                  {gap.priority} Priority
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Recommended Course: <strong style={{ color: 'var(--text-secondary)' }}>{gap.recommendedResource}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
