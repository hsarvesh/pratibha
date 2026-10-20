import React from 'react';

// Crisp, high-fidelity SVGs for major social networks & platforms
export const GithubIcon = ({ size = 18, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const LinkedInIcon = ({ size = 18, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const TwitterIcon = ({ size = 18, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export const InstagramIcon = ({ size = 18, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const FacebookIcon = ({ size = 18, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const GlobeIcon = ({ size = 18, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const YoutubeIcon = ({ size = 18, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill={color} />
  </svg>
);

export const BlogIcon = ({ size = 18, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

// Metadata catalog for social platforms
export const SOCIAL_PLATFORMS = [
  {
    key: 'github',
    name: 'GitHub',
    icon: GithubIcon,
    color: '#f0f6fc',
    bgColor: 'rgba(240, 246, 252, 0.1)',
    borderColor: 'rgba(240, 246, 252, 0.25)',
    placeholder: 'https://github.com/username',
    description: 'Repositories, open source contributions & code samples'
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    icon: LinkedInIcon,
    color: '#0a66c2',
    bgColor: 'rgba(10, 102, 194, 0.12)',
    borderColor: 'rgba(10, 102, 194, 0.3)',
    placeholder: 'https://linkedin.com/in/username',
    description: 'Professional network, recommendations & career milestones'
  },
  {
    key: 'twitter',
    name: 'Twitter / X',
    icon: TwitterIcon,
    color: '#1d9bf0',
    bgColor: 'rgba(29, 155, 240, 0.12)',
    borderColor: 'rgba(29, 155, 240, 0.3)',
    placeholder: 'https://twitter.com/username or @handle',
    description: 'Tech thoughts, public conversations & community engagement'
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: InstagramIcon,
    color: '#e1306c',
    bgColor: 'rgba(225, 48, 108, 0.12)',
    borderColor: 'rgba(225, 48, 108, 0.3)',
    placeholder: 'https://instagram.com/username',
    description: 'Visual portfolio, design aesthetics & personal brand'
  },
  {
    key: 'facebook',
    name: 'Facebook',
    icon: FacebookIcon,
    color: '#1877f2',
    bgColor: 'rgba(24, 119, 242, 0.12)',
    borderColor: 'rgba(24, 119, 242, 0.3)',
    placeholder: 'https://facebook.com/username',
    description: 'Community groups, professional connections & social network'
  },
  {
    key: 'portfolio',
    name: 'Personal Website / Portfolio',
    icon: GlobeIcon,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    placeholder: 'https://yourname.dev or portfolio URL',
    description: 'Live case studies, custom interactive demos & personal domain'
  },
  {
    key: 'youtube',
    name: 'YouTube',
    icon: YoutubeIcon,
    color: '#ff0000',
    bgColor: 'rgba(255, 0, 0, 0.1)',
    borderColor: 'rgba(255, 0, 0, 0.3)',
    placeholder: 'https://youtube.com/@channel',
    description: 'Tech talks, project walkthroughs & engineering demos'
  },
  {
    key: 'blog',
    name: 'Blog / Medium / Dev.to',
    icon: BlogIcon,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    placeholder: 'https://medium.com/@username or personal blog',
    description: 'Technical articles, system architecture blogs & tutorials'
  }
];

export default SOCIAL_PLATFORMS;
