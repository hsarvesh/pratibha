import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Save,
  Link,
  Info,
  Check
} from 'lucide-react';
import { SOCIAL_PLATFORMS } from './SocialIcons';
import SocialBadgesRow, { normalizeUrl } from './SocialBadgesRow';

export default function SocialLinksEditor({
  socialLinks = {},
  onChange,
  onSave = null,
  isSaving = false
}) {
  const [links, setLinks] = useState({
    github: socialLinks.github || '',
    linkedin: socialLinks.linkedin || '',
    twitter: socialLinks.twitter || '',
    instagram: socialLinks.instagram || '',
    facebook: socialLinks.facebook || '',
    portfolio: socialLinks.portfolio || '',
    youtube: socialLinks.youtube || '',
    blog: socialLinks.blog || '',
    customLinks: Array.isArray(socialLinks.customLinks) ? socialLinks.customLinks : []
  });

  const [newCustomLabel, setNewCustomLabel] = useState('');
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  const handleFieldChange = (key, value) => {
    const updated = { ...links, [key]: value };
    setLinks(updated);
    if (onChange) onChange(updated);
  };

  const handleAddCustom = (e) => {
    if (e) e.preventDefault();
    if (!newCustomLabel.trim() || !newCustomUrl.trim()) return;

    const newCustomItem = {
      id: `custom_${Date.now()}`,
      label: newCustomLabel.trim(),
      url: normalizeUrl(newCustomUrl.trim())
    };

    const updated = {
      ...links,
      customLinks: [...(links.customLinks || []), newCustomItem]
    };
    setLinks(updated);
    setNewCustomLabel('');
    setNewCustomUrl('');
    if (onChange) onChange(updated);
  };

  const handleRemoveCustom = (id) => {
    const updated = {
      ...links,
      customLinks: (links.customLinks || []).filter(c => c.id !== id)
    };
    setLinks(updated);
    if (onChange) onChange(updated);
  };

  const activeCount = Object.entries(links)
    .filter(([k, v]) => k !== 'customLinks' && typeof v === 'string' && v.trim().length > 0).length +
    (links.customLinks || []).filter(c => c.url && c.url.trim().length > 0).length;

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      {/* Header & Value Proposition */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              <Globe size={20} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Social & Web Networking Profiles
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: 700 }}>
            Connect your GitHub repositories, LinkedIn network, Twitter discussions, Instagram design showcase, Facebook, and personal portfolio. Verified links increase employer match confidence and provide evidence of real-world impact.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span
            className="badge"
            style={{
              background: activeCount >= 2 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: activeCount >= 2 ? '#34d399' : '#f59e0b',
              border: `1px solid ${activeCount >= 2 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '0.4rem 0.75rem'
            }}
          >
            {activeCount} {activeCount === 1 ? 'Profile' : 'Profiles'} Linked
          </span>
          {onSave && (
            <button
              type="button"
              onClick={() => onSave(links)}
              disabled={isSaving}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem' }}
            >
              <Save size={15} /> {isSaving ? 'Saving...' : 'Save Profiles'}
            </button>
          )}
        </div>
      </div>

      {/* Live Preview Card */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.15rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 800 }}>
            Public Profile Preview (How Employers See You)
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <SocialBadgesRow socialLinks={links} size="md" />
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Sparkles size={13} color="var(--primary)" /> Clickable links automatically open in new tabs with security rel attributes.
        </div>
      </div>

      {/* Standard Platforms Form Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {SOCIAL_PLATFORMS.map(platform => {
          const Icon = platform.icon;
          const currentValue = links[platform.key] || '';
          const hasValue = currentValue.trim().length > 0;
          const testUrl = normalizeUrl(currentValue);

          return (
            <div
              key={platform.key}
              style={{
                background: 'var(--bg-primary)',
                border: `1px solid ${hasValue ? platform.borderColor : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 'var(--radius-sm)',
                      background: platform.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: platform.color
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {platform.name}
                    </span>
                  </div>
                </div>

                {hasValue && (
                  <span style={{ fontSize: '0.74rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <CheckCircle2 size={12} /> Linked
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.45rem' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{
                    fontSize: '0.84rem',
                    padding: '0.55rem 0.75rem',
                    borderColor: hasValue ? platform.borderColor : undefined
                  }}
                  placeholder={platform.placeholder}
                  value={currentValue}
                  onChange={(e) => handleFieldChange(platform.key, e.target.value)}
                />

                {hasValue && (
                  <a
                    href={testUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    title={`Open & test ${platform.name} link`}
                    style={{
                      background: platform.bgColor,
                      color: platform.color,
                      border: `1px solid ${platform.borderColor}`,
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.45rem' }}>
                {platform.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom & Other Social Networking Sites */}
      <div
        style={{
          marginTop: '2rem',
          paddingTop: '1.75rem',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Link size={16} color="var(--primary)" /> Other Social Networks & Digital Portfolios
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Have profiles on LeetCode, HackerRank, Kaggle, Dribbble, Behance, Substack, Discord, or Mastodon? Add them here with custom labels.
          </p>
        </div>

        {/* Existing Custom Links */}
        {(links.customLinks && links.customLinks.length > 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
            {links.customLinks.map(custom => (
              <div
                key={custom.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                  <Globe size={16} color="#a855f7" />
                  <strong style={{ fontSize: '0.86rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    {custom.label}:
                  </strong>
                  <a
                    href={normalizeUrl(custom.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--primary)',
                      textDecoration: 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {custom.url}
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                  <a
                    href={normalizeUrl(custom.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    title="Open link in new tab"
                    style={{ padding: '0.35rem' }}
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustom(custom.id)}
                    className="icon-btn"
                    title="Remove custom link"
                    style={{ color: '#ef4444', padding: '0.35rem' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Custom Link Input */}
        <div
          style={{
            display: 'flex',
            gap: '0.65rem',
            flexWrap: 'wrap',
            background: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-color)',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            className="form-input"
            style={{ flex: '1 1 180px', fontSize: '0.84rem' }}
            placeholder="Platform Name (e.g. LeetCode, Dribbble, Kaggle)"
            value={newCustomLabel}
            onChange={(e) => setNewCustomLabel(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            style={{ flex: '2 1 280px', fontSize: '0.84rem' }}
            placeholder="Profile URL (e.g. https://leetcode.com/u/yourhandle)"
            value={newCustomUrl}
            onChange={(e) => setNewCustomUrl(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!newCustomLabel.trim() || !newCustomUrl.trim()}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem' }}
          >
            <Plus size={15} /> Add Other Profile
          </button>
        </div>
      </div>

      {/* Save Button Bottom */}
      {onSave && (
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => onSave(links)}
            disabled={isSaving}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', fontWeight: 700 }}
          >
            <Save size={16} /> {isSaving ? 'Saving Changes...' : 'Save All Social Profiles'}
          </button>
        </div>
      )}
    </div>
  );
}
