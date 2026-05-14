'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide, CarouselMeta } from '@/lib/types';
import { useEmbedToken } from '@/hooks/use-embed-token';

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export default function HomePage() {
  const router = useRouter();
  const embedToken = useEmbedToken();
  const [topic, setTopic] = useState('');
  const [handle, setHandle] = useState('@');
  const [pageName, setPageName] = useState('');
  const [theme, setTheme] = useState<'default' | 'editorial' | 'wolf-v2' | 'editorial-step' | 'ascii-pixel'>('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, handle, pageName, embedToken }),
      });
      let data: { slides?: Slide[]; meta?: CarouselMeta; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server error ${res.status} — check your API keys and try again`);
      }
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
      if (!data.slides || !data.meta) throw new Error('Unexpected response from server');
      localStorage.setItem('carousel_slides', JSON.stringify(data.slides));
      localStorage.setItem('carousel_meta', JSON.stringify({ ...data.meta, theme }));
      router.push('/review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: 'calc(100dvh - 52px)',
      display: 'flex',
      alignItems: 'center',
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
        style={{ width: '100%', maxWidth: 520, position: 'relative' }}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        {/* Header */}
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

        {/* Form */}
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

          <Field label="Template" hint="Visual style">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {(
                [
                  { value: 'default',        label: 'Dark Charcoal',  sub: 'Data explainers',      thumb: '/thumbnails/default.png'        },
                  { value: 'wolf-v2',        label: 'Bold Report',    sub: 'Metrics & results',    thumb: '/thumbnails/wolf-v2.png'        },
                  { value: 'editorial-step', label: 'Cream Tutorial', sub: 'Step-by-step guides',  thumb: '/thumbnails/editorial-step.png' },
                  { value: 'ascii-pixel',    label: 'ASCII Terminal', sub: 'AI / tech topics',     thumb: '/thumbnails/ascii-pixel.png'    },
                  { value: 'editorial',      label: 'Gold Noir',      sub: 'Chrome yellow accent', thumb: '/thumbnails/editorial.png'      },
                ] as const
              ).map(({ value: t, label, sub, thumb }) => (
                <ThemeBtn key={t} active={theme === t} onClick={() => setTheme(t)} label={label} sub={sub} thumb={thumb} />
              ))}
            </div>
          </Field>

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
            disabled={loading}
            style={{
              marginTop: 4,
              padding: '15px 24px',
              background: loading ? 'rgba(255,255,255,0.05)' : 'var(--accent)',
              color: loading ? 'var(--ink-muted)' : '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.01em',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
            whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {loading ? (
              <>
                Researching &amp; writing
                <LoadingDots />
              </>
            ) : 'Generate slides →'}
          </motion.button>
        </motion.form>
      </motion.div>
    </main>
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
      animate={{
        borderColor: active ? 'var(--accent)' : 'var(--border)',
      }}
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

function LoadingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          style={{
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'currentColor',
            display: 'inline-block',
          }}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
        />
      ))}
    </span>
  );
}
