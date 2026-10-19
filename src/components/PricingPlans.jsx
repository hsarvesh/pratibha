import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  Building,
  ShieldCheck,
  Award,
  ArrowRight
} from 'lucide-react';

export default function PricingPlans({ currentUser }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  const jobSeekerPlans = [
    {
      name: 'Job Seeker Basic',
      price: 'Free',
      period: 'forever',
      description: 'Core job search and verified profile creation.',
      features: [
        'Explore all verified job listings',
        '1-Click application directly to employers',
        'Basic ATS profile creation',
        'Email notification alerts'
      ],
      cta: 'Current Plan',
      isCurrent: currentUser.subscriptionTier !== 'Pro',
      popular: false
    },
    {
      name: 'Pratibha Pro Seeker',
      price: billingCycle === 'monthly' ? '₹799' : '₹649',
      period: '/ month',
      description: 'Unlimited AI Mock Interviews, JD analysis, and priority visibility.',
      features: [
        'Unlimited AI JD-Anchored Mock Interviews',
        'AI Resume Bullet Optimizer (Google X-Y-Z formula)',
        'Priority Candidate Badge in recruiter searches',
        'AI Salary Negotiation Insights & Market Benchmarks',
        'Real-time interview feedback reports'
      ],
      cta: 'Upgrade to Pro',
      isCurrent: currentUser.subscriptionTier === 'Pro',
      popular: true
    }
  ];

  const employerPlans = [
    {
      name: 'Growth Employer',
      price: billingCycle === 'monthly' ? '₹4,999' : '₹3,999',
      period: '/ month',
      description: 'For startups and high-growth engineering teams.',
      features: [
        'Post up to 5 Active Job Listings',
        'Live Parameterized JD Quality Scorer',
        'ATS Kanban Pipeline & Candidate Scoring',
        'Structured candidate feedback delivery'
      ],
      cta: 'Start 14-Day Free Trial',
      popular: false
    },
    {
      name: 'Enterprise Talent Suite',
      price: billingCycle === 'monthly' ? '₹14,999' : '₹11,999',
      period: '/ month',
      description: 'Unlimited hiring, AI candidate ranking, and custom branding.',
      features: [
        'Unlimited Featured Job Postings',
        'AI Candidate Pre-Screening & Ranking',
        'Dedicated Talent Acquisition Account Manager',
        'Custom DEI & Employer Branding Showcase',
        'Full ATS API & Webhook Integrations'
      ],
      cta: 'Contact Sales',
      popular: true
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.2)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', marginBottom: '0.65rem' }}>
          <Sparkles size={15} color="var(--primary)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
            Transparent & Diversified Monetization
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Flexible Plans Tailored for Success</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 650, margin: '0.5rem auto 1.5rem', fontSize: '0.95rem' }}>
          Accelerate your career trajectory or streamline enterprise hiring with Pratibha's AI intelligence suite.
        </p>

        {/* Billing cycle switch */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
          <button
            className={`btn btn-sm ${billingCycle === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setBillingCycle('monthly')}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            Monthly Billing
          </button>
          <button
            className={`btn btn-sm ${billingCycle === 'annual' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setBillingCycle('annual')}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            Annual Billing (Save 20%)
          </button>
        </div>
      </div>

      {/* For Job Seekers */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={20} color="var(--primary)" /> For Job Seekers & Professionals
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {jobSeekerPlans.map(plan => (
            <div
              key={plan.name}
              className="glass-panel"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                borderColor: plan.popular ? 'var(--primary)' : 'var(--border-color)',
                boxShadow: plan.popular ? 'var(--shadow-glow)' : 'none'
              }}
            >
              {plan.popular && (
                <span className="badge badge-primary" style={{ position: 'absolute', top: 16, right: 16 }}>
                  Most Popular
                </span>
              )}

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{plan.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, minHeight: 40 }}>{plan.description}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', margin: '1.25rem 0' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{plan.price}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{plan.period}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', margin: '1.5rem 0', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                      <CheckCircle2 size={16} color="var(--primary)" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => alert(`Selected plan: ${plan.name}`)}
              >
                {plan.cta} <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* For Employers */}
      <div style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building size={20} color="var(--primary)" /> For Hiring Teams & Employers
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {employerPlans.map(plan => (
            <div
              key={plan.name}
              className="glass-panel"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: plan.popular ? '#a855f7' : 'var(--border-color)',
                boxShadow: plan.popular ? '0 0 25px rgba(168, 85, 247, 0.25)' : 'none'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{plan.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, minHeight: 40 }}>{plan.description}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', margin: '1.25rem 0' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{plan.price}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{plan.period}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', margin: '1.5rem 0', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                      <CheckCircle2 size={16} color="#a855f7" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => alert(`Selected employer package: ${plan.name}`)}
              >
                {plan.cta} <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
