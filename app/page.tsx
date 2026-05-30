'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { CarouselMeta } from '@/lib/types';

type Theme = NonNullable<CarouselMeta['theme']>;

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const TEMPLATES: Array<{ value: Theme; label: string; sub: string; thumb: string }> = [
  { value: 'marrakech',  label: 'Marrakech',  sub: 'Dark charcoal · data explainers',      thumb: '/thumbnails/marrakech.webp'  },
  { value: 'reykjavik',  label: 'Reykjavik',  sub: 'Bold report · metrics & results',       thumb: '/thumbnails/reykjavik.webp'  },
  { value: 'valletta',   label: 'Valletta',   sub: 'Cream tutorial · step-by-step guides',  thumb: '/thumbnails/valletta.webp'   },
  { value: 'tbilisi',    label: 'Tbilisi',    sub: 'ASCII terminal · AI & tech topics',      thumb: '/thumbnails/tbilisi.webp'    },
  { value: 'havana',     label: 'Havana',     sub: 'Gold noir · chrome yellow accent',       thumb: '/thumbnails/havana.png'      },
  { value: 'medellin',   label: 'Medellín',   sub: 'Figr manifesto · principle frameworks', thumb: '/thumbnails/medellin.png'    },
  { value: 'luanda',     label: 'Luanda',     sub: 'Figr brutalist · bold critiques',        thumb: '/thumbnails/luanda.webp'     },
  { value: 'tangier',    label: 'Tangier',    sub: 'Figr before/after · shift contrasts',   thumb: '/thumbnails/tangier.png'     },
  { value: 'tallinn',    label: 'Tallinn',    sub: 'Figr system · data & research',          thumb: '/thumbnails/tallinn.webp'    },
  { value: 'cartagena',  label: 'Cartagena',  sub: 'Figr color sequence · sequential',      thumb: '/thumbnails/cartagena.webp'  },
  { value: 'kyoto',      label: 'Kyoto',      sub: 'Figr notebook · spacing & editorial',   thumb: '/thumbnails/kyoto.webp'      },
  { value: 'copenhagen', label: 'Copenhagen', sub: 'Bold blue grotesk · electric contrast', thumb: '/thumbnails/copenhagen.webp' },
  { value: 'zurich',     label: 'Zürich',     sub: 'Color blocks · architectural splits',   thumb: '/thumbnails/zurich.webp'     },
];

export default function HomePage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [handle, setHandle] = useState('@');
  const [pageName, setPageName] = useState('');
  const [angle, setAngle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [theme, setTheme] = useState<Theme>('marrakech');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!topic.trim() || !handle.trim() || !pageName.trim()) {
      setError('Topic, page name, and handle are required.');
      return;
    }
    // Store params for the clarify page
    localStorage.setItem('carousel_draft', JSON.stringify({
      topic: topic.trim(),
      handle: handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`,
      pageName: pageName.trim(),
      theme,
      angle: angle.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
    }));
    router.push('/clarify');
  }

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .page-cols { flex-direction: column !important; max-width: 520px !important; }
          .right-panel { max-height: none !important; overflow-y: visible !important; }
          .template-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
      <main style={{
        minHeight: 'calc(100dvh - 52px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '48px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 700,
          background: 'radial-gradient(circle, rgba(232,137,74,0.055) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <motion.div
          className="page-cols"
          style={{
            width: '100%',
            maxWidth: 1100,
            display: 'flex',
            gap: 48,
            alignItems: 'flex-start',
            position: 'relative',
          }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          {/* ── LEFT COL: inputs ── */}
          <div style={{ width: 420, flexShrink: 0 }}>
            <motion.div
              style={{ marginBottom: 44 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08, duration: 0.45 }}
            >
              <span style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: 14,
              }}>
                AI-powered carousel generator
              </span>
              <h1 style={{
                fontSize: 'clamp(30px, 5vw, 44px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                marginBottom: 12,
              }}>
                Carousel Studio
              </h1>
              <p style={{ color: 'var(--ink-muted)', fontSize: 15, lineHeight: 1.65 }}>
                Enter a topic and we&apos;ll research, write, and design your slides.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45, ease }}
            >
              <Field label="Topic" hint="What should it be about?">
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. seed funding for startups"
                  required
                  className="field-input"
                />
              </Field>

              <Field label="Page name" hint="Your Instagram display name">
                <input
                  type="text"
                  value={pageName}
                  onChange={e => setPageName(e.target.value)}
                  placeholder="e.g. The Founder Lab"
                  required
                  className="field-input"
                />
              </Field>

              <Field label="Handle" hint="Your @handle">
                <input
                  type="text"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  placeholder="@yourhandle"
                  required
                  className="field-input"
                />
              </Field>

              {/* Optional fields */}
              <div style={{
                borderTop: '1px solid var(--border)',
                paddingTop: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-faint)',
                  marginBottom: -4,
                }}>
                  Optional
                </div>

                <Field label="Angle" hint="Lock the specific thesis">
                  <input
                    type="text"
                    value={angle}
                    onChange={e => setAngle(e.target.value)}
                    placeholder="e.g. VC money is making founders worse"
                    className="field-input"
                  />
                </Field>

                <Field label="Source URL" hint="Primary article or report">
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={e => setSourceUrl(e.target.value)}
                    placeholder="https://..."
                    className="field-input"
                  />
                </Field>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{
                      background: 'rgba(220,60,60,0.10)',
                      border: '1px solid rgba(220,60,60,0.22)',
                      borderRadius: 8,
                      padding: '12px 16px',
                      color: '#ff7a7a',
                      fontSize: 14,
                      overflow: 'hidden',
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                style={{
                  marginTop: 4,
                  padding: '15px 24px',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                Continue →
              </motion.button>
            </motion.form>
          </div>

          {/* ── RIGHT COL: template selector ── */}
          <motion.div
            className="right-panel"
            style={{
              flex: 1,
              minWidth: 0,
              maxHeight: 'calc(100dvh - 120px)',
              overflowY: 'auto',
              paddingRight: 4,
            }}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.45, ease }}
          >
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--ink-faint)',
              marginBottom: 14,
            }}>
              Template — {TEMPLATES.find(t => t.value === theme)?.label ?? theme}
            </div>
            <div
              className="template-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}
            >
              {TEMPLATES.map(({ value: t, label, sub, thumb }) => (
                <ThemeBtn key={t} active={theme === t} onClick={() => setTheme(t)} label={label} sub={sub} thumb={thumb} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}

function ThemeBtn({ active, onClick, label, sub, thumb }: { active: boolean; onClick: () => void; label: string; sub: string; thumb?: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={{
        padding: 0,
        borderRadius: 'var(--radius)',
        border: '2px solid',
        cursor: 'pointer',
        textAlign: 'left',
        overflow: 'hidden',
        background: 'transparent',
      }}
      animate={{ borderColor: active ? 'var(--accent)' : 'var(--border)' }}
      whileHover={{ scale: !active ? 1.02 : 1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
    >
      {thumb && (
        <div style={{ width: '100%', aspectRatio: '1080 / 1350', overflow: 'hidden', position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />
          {active && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(var(--accent-rgb, 74,144,226), 0.18)',
              pointerEvents: 'none',
            }} />
          )}
        </div>
      )}
      <motion.div
        style={{ padding: '8px 10px' }}
        animate={{ background: active ? 'var(--accent)' : 'var(--surface)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#ffffff' : 'rgba(255,255,255,0.80)' }}>{label}</div>
        <div style={{ fontSize: 10, fontWeight: 400, marginTop: 1, color: active ? 'rgba(255,255,255,0.70)' : 'rgba(255,255,255,0.40)' }}>{sub}</div>
      </motion.div>
    </motion.button>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.01em', color: 'var(--ink)' }}>
          {label}
        </label>
        <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{hint}</span>
      </div>
      {children}
    </div>
  );
}
