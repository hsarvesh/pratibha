import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  Globe2,
  Volume2,
  Pause,
  Play,
  RotateCcw,
  Compass,
  CheckCircle2,
  ChevronRight,
  Layers
} from 'lucide-react';

const GLOBAL_WORDS = [
  {
    id: 'greek',
    language: 'Greek',
    nativeLang: 'Ελληνικά',
    word: 'Eunoia / Noēsis',
    nativeScript: 'εὔνοια / νόησις',
    pronunciation: 'év-ni-a / nó-i-sis',
    region: '🇬🇷 Mediterranean & Classical Greece',
    meaning: 'Direct, intuitive intellectual perception and inspired insight without the need for step-by-step discursive reasoning.'
  },
  {
    id: 'latin',
    language: 'Latin',
    nativeLang: 'Lingua Latina',
    word: 'Ingenium',
    nativeScript: 'Ingenium',
    pronunciation: 'in-gén-i-um',
    region: '🏛️ Classical Antiquity',
    meaning: 'Innate creative talent, inborn disposition, and inventive genius (the historical root of engine and ingenious).'
  },
  {
    id: 'arabic',
    language: 'Arabic',
    nativeLang: 'العربية',
    word: 'Qarihah',
    nativeScript: 'قَرِيحَة',
    pronunciation: 'qa-rī-ḥah',
    region: '🇸🇦 Arab World & Levant',
    meaning: 'Innate talent, poetic disposition, and natural creative aptitude that bubbles up spontaneously like fresh spring water.'
  },
  {
    id: 'persian',
    language: 'Persian',
    nativeLang: 'فارسی',
    word: 'Farasat',
    nativeScript: 'فِراسَت',
    pronunciation: 'fe-rā-sat',
    region: '🇮🇷 Persia & Silk Road',
    meaning: 'Keen mental acumen, penetrating perception, intuitive flash, and sharp discernment.'
  },
  {
    id: 'german',
    language: 'German',
    nativeLang: 'Deutsch',
    word: 'Geistesblitz',
    nativeScript: 'Geistesblitz',
    pronunciation: 'gáys-tes-blits',
    region: '🇩🇪 Central Europe',
    meaning: 'Literally a "flash of the spirit/mind"—a sudden stroke of inspiration, brilliant creative idea, or intuitive spark.'
  },
  {
    id: 'japanese',
    language: 'Japanese',
    nativeLang: '日本語',
    word: 'Sai-chi',
    nativeScript: '才知 (さいち)',
    pronunciation: 'sai-chi',
    region: '🇯🇵 East Asia & Japan',
    meaning: 'The union of innate creative talent (sai / 才) and quick-witted, intuitive intelligence (chi / 知).'
  },
  {
    id: 'chinese',
    language: 'Chinese (Mandarin)',
    nativeLang: '中文',
    word: 'Cáihuá',
    nativeScript: '才华',
    pronunciation: 'cái-huá',
    region: '🇨🇳 East Asia',
    meaning: 'Radiant creative talent, brilliant literary/artistic flair, and manifested genius.'
  },
  {
    id: 'french',
    language: 'French',
    nativeLang: 'Français',
    word: 'Génie',
    nativeScript: 'Génie',
    pronunciation: 'zhé-nee',
    region: '🇫🇷 Francophonie & Europe',
    meaning: 'Innate brilliance, inventive imagination, and original creative spirit.'
  },
  {
    id: 'russian',
    language: 'Russian',
    nativeLang: 'Русский',
    word: 'Ozarénie',
    nativeScript: 'Озарение',
    pronunciation: 'o-za-ryé-ni-ye',
    region: '🇷🇺 Eurasia & Eastern Europe',
    meaning: 'A sudden illumination, flash of insight, or moment of poetic and intellectual revelation.'
  },
  {
    id: 'italian',
    language: 'Italian',
    nativeLang: 'Italiano',
    word: 'Ingegno',
    nativeScript: 'Ingegno',
    pronunciation: 'in-jén-nyo',
    region: '🇮🇹 Southern Europe & Renaissance',
    meaning: 'Bright inventive wit, mental sharpness, and original creative capacity.'
  }
];

export default function GlobalLandingIntro({ onComplete }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  const DURATION_PER_WORD = 3800; // ms per word
  const TOTAL_CYCLE_WORDS = GLOBAL_WORDS.length;
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Cycle through words automatically unless paused
  useEffect(() => {
    if (isPaused || isExiting) return;

    const interval = 50; // update progress every 50ms
    const step = (interval / DURATION_PER_WORD) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setActiveIndex(idx => (idx + 1) % TOTAL_CYCLE_WORDS);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(progressIntervalRef.current);
  }, [activeIndex, isPaused, isExiting, TOTAL_CYCLE_WORDS]);

  const handleEnterPortal = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 700);
  };

  const handleSelectWord = (index) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const activeWord = GLOBAL_WORDS[activeIndex];

  return (
    <div
      className={`global-landing-overlay ${isExiting ? 'exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Pratibha Global Sanskrit and Universal Words Welcoming Screen"
    >
      {/* Top Bar with Brand Badge & Quick Skip */}
      <div className="global-landing-topbar">
        <div className="global-brand-badge">
          <Globe2 size={16} style={{ color: 'var(--primary)' }} />
          <span>Universal Career Intelligence</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
          <span style={{ color: '#fbbf24' }}>10 Civilizations & Languages</span>
        </div>

        <button
          onClick={handleEnterPortal}
          className="badge"
          style={{
            cursor: 'pointer',
            padding: '0.45rem 1rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#f8fafc',
            fontWeight: 600,
            fontSize: '0.8rem',
            borderRadius: 'var(--radius-full)',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
          title="Proceed directly to Pratibha Job & Career Portal"
          id="skip-landing-intro-btn"
        >
          <span>Skip to Portal</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Main Centerpiece Stage */}
      <div className="global-landing-stage">
        {/* Sanskrit Sacred Centerpiece */}
        <div className="sanskrit-aura-wrapper">
          <div className="sanskrit-glow-ring" />
          <div className="sanskrit-aura-pulse" />
          
          <h1 className="sanskrit-title" aria-label="Pratibha in Sanskrit script">
            प्रतिभा
          </h1>
          
          <div className="sanskrit-transliteration">
            Pratibhā
          </div>
          
          <div className="sanskrit-phonetic-badge">
            <Sparkles size={13} />
            <span>[ prʌ - tɪ - bʱɑː ] • Sanskrit Root</span>
          </div>

          <p className="sanskrit-tagline">
            The primordial flash of spontaneous intuitive illumination, inventive brilliance, and innate creative genius that transcends discursive reasoning.
          </p>
        </div>

        {/* Global Constellation Chips (Interactive Selector) */}
        <div className="global-constellation-track" role="tablist" aria-label="Select global cultural equivalent">
          {GLOBAL_WORDS.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectWord(idx)}
                className={`constellation-chip ${isActive ? 'active' : ''}`}
                title={`Explore ${item.language}: ${item.nativeScript} (${item.word})`}
                id={`lang-pill-${item.id}`}
              >
                <span>{item.region.split(' ')[0]}</span>
                <span className="constellation-chip-native">{item.nativeScript}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({item.language})</span>
              </button>
            );
          })}
        </div>

        {/* Active Featured Cultural Insight Card */}
        <div className="global-active-card">
          <div className="active-card-header">
            <div className="active-lang-badge">
              <Compass size={16} />
              <span>{activeWord.region}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="icon-btn"
                style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.06)' }}
                title={isPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
                aria-label={isPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
              >
                {isPaused ? <Play size={13} /> : <Pause size={13} />}
              </button>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                {activeIndex + 1} of {TOTAL_CYCLE_WORDS}
              </span>
            </div>
          </div>

          <div className="active-script-display" lang={activeWord.id}>
            {activeWord.nativeScript}
          </div>

          <div className="active-word-roman">
            {activeWord.word} • <span style={{ fontWeight: 400, opacity: 0.85, fontSize: '0.95rem' }}>/{activeWord.pronunciation}/</span>
          </div>

          <p className="active-word-meaning">
            "{activeWord.meaning}"
          </p>

          <div style={{ marginTop: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.6rem' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
              Cultural Parallel to Pratibhā
            </span>
            <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
              Innate Genius & Intuitive Spark
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Timeline and Enter Portal Button */}
      <div className="global-landing-bottom">
        <div className="timeline-progress-container">
          <button
            onClick={() => handleSelectWord((activeIndex - 1 + TOTAL_CYCLE_WORDS) % TOTAL_CYCLE_WORDS)}
            className="icon-btn"
            style={{ width: 26, height: 26 }}
            title="Previous culture"
            aria-label="Previous culture"
          >
            ‹
          </button>
          
          <div className="timeline-progress-track">
            <div
              className="timeline-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={() => handleSelectWord((activeIndex + 1) % TOTAL_CYCLE_WORDS)}
            className="icon-btn"
            style={{ width: 26, height: 26 }}
            title="Next culture"
            aria-label="Next culture"
          >
            ›
          </button>
        </div>

        <button
          onClick={handleEnterPortal}
          className="enter-portal-button"
          id="enter-pratibha-portal-btn"
        >
          <span>Enter Pratibha Career Portal</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
