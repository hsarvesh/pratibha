import React from 'react';
import { ExternalLink, Plus } from 'lucide-react';
import {
  GithubIcon,
  LinkedInIcon,
  TwitterIcon,
  InstagramIcon,
  FacebookIcon,
  GlobeIcon,
  YoutubeIcon,
  BlogIcon
} from './SocialIcons';

// Map key to icon and styling
const ICON_MAP = {
  github: { icon: GithubIcon, name: 'GitHub', color: '#f0f6fc', bg: 'rgba(255, 255, 255, 0.08)' },
  linkedin: { icon: LinkedInIcon, name: 'LinkedIn', color: '#0a66c2', bg: 'rgba(10, 102, 194, 0.15)' },
  twitter: { icon: TwitterIcon, name: 'Twitter/X', color: '#1d9bf0', bg: 'rgba(29, 155, 240, 0.15)' },
  x: { icon: TwitterIcon, name: 'X', color: '#1d9bf0', bg: 'rgba(29, 155, 240, 0.15)' },
  instagram: { icon: InstagramIcon, name: 'Instagram', color: '#e1306c', bg: 'rgba(225, 48, 108, 0.15)' },
  facebook: { icon: FacebookIcon, name: 'Facebook', color: '#1877f2', bg: 'rgba(24, 119, 242, 0.15)' },
  portfolio: { icon: GlobeIcon, name: 'Portfolio', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  website: { icon: GlobeIcon, name: 'Website', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  youtube: { icon: YoutubeIcon, name: 'YouTube', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  blog: { icon: BlogIcon, name: 'Blog', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' }
};

export function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function SocialBadgesRow({
  socialLinks = {},
  size = 'md', // 'sm' | 'md' | 'lg'
  showLabels = true,
  onEmptyClick = null,
  emptyPrompt = 'Connect Social Profiles'
}) {
  const links = socialLinks || {};
  const customLinks = Array.isArray(links.customLinks) ? links.customLinks : [];

  // Standard platforms
  const standardActive = Object.entries(links)
    .filter(([key, val]) => key !== 'customLinks' && typeof val === 'string' && val.trim().length > 0)
    .map(([key, val]) => {
      const meta = ICON_MAP[key.toLowerCase()] || {
        icon: GlobeIcon,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        color: '#94a3b8',
        bg: 'rgba(148, 163, 184, 0.12)'
      };
      return {
        key,
        name: meta.name,
        url: normalizeUrl(val),
        icon: meta.icon,
        color: meta.color,
        bg: meta.bg
      };
    });

  // Custom platforms
  const customActive = customLinks
    .filter(c => c && c.url && typeof c.url === 'string' && c.url.trim().length > 0)
    .map((c, i) => {
      const keyLower = (c.platform || c.name || c.label || '').toLowerCase();
      const meta = ICON_MAP[keyLower] || {
        icon: GlobeIcon,
        name: c.label || c.name || c.platform || 'Link',
        color: '#a855f7',
        bg: 'rgba(168, 85, 247, 0.12)'
      };
      return {
        key: `custom_${i}`,
        name: meta.name,
        url: normalizeUrl(c.url),
        icon: meta.icon,
        color: meta.color,
        bg: meta.bg
      };
    });

  const allActive = [...standardActive, ...customActive];

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18
  };

  const padStyles = {
    sm: { padding: '0.25rem 0.55rem', fontSize: '0.72rem', gap: '0.35rem' },
    md: { padding: '0.35rem 0.75rem', fontSize: '0.78rem', gap: '0.45rem' },
    lg: { padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.55rem' }
  };

  if (allActive.length === 0) {
    if (!onEmptyClick) return null;
    return (
      <button
        type="button"
        onClick={onEmptyClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.75rem',
          borderRadius: '9999px',
          border: '1px dashed rgba(255, 255, 255, 0.25)',
          background: 'rgba(255, 255, 255, 0.04)',
          color: 'var(--text-muted)',
          fontSize: '0.76rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.color = 'var(--text-muted)';
        }}
      >
        <Plus size={13} /> {emptyPrompt}
      </button>
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      {allActive.map(item => {
        const IconComponent = item.icon;
        return (
          <a
            key={item.key}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${item.name}: ${item.url}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              ...padStyles[size],
              borderRadius: '9999px',
              background: item.bg,
              border: `1px solid ${item.color}35`,
              color: item.color,
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.borderColor = item.color;
              e.currentTarget.style.boxShadow = `0 4px 12px ${item.color}35`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = `${item.color}35`;
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
            }}
          >
            <IconComponent size={iconSizes[size]} color={item.color} />
            {showLabels && <span>{item.name}</span>}
            <ExternalLink size={iconSizes[size] - 3} style={{ opacity: 0.65 }} />
          </a>
        );
      })}
    </div>
  );
}
