'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { CarouselMeta } from '@/lib/types';
import { useEmbedToken } from '@/hooks/use-embed-token';

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

type Audience = 'Beginner' | 'Intermediate' | 'Expert' | 'Mixed';
type Tone = 'Educational' | 'Opinionated' | 'Data-heavy' | 'Story-first';

interface DraftParams {
  topic: string;
  handle: string;
  pageName: string;
  theme?: string;
  angle?: string;
  sourceUrl?: string;
}

export default function ClarifyPage() {
  const router = useRouter();
  const embedToken = useEmbedToken();

  const [draft, setDraft] = useState<DraftParams | null>(null);
  const [angle, setAngle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [audience, setAudience] = useState<Audience | ''>('');
  const [tone, setTone] = useState<Tone | ''>('');
  const [loading, setLoading] = useState(false);
  const [statusPhase, setStatusPhase] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<number | null>(null);
  // Track which fields were pre-filled from the homepage draft
  const [prefilledAngle, setPrefilledAngle] = useState(false);
  const [prefilledSource, setPrefilledSource] = useState(false);

  const angleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem('carousel_draft');
    if (!raw) { router.push('/'); return; }
    const parsed = JSON.parse(raw) as DraftParams;
    setDraft(parsed);
    if (parsed.angle) { setAngle(parsed.angle); setPrefilledAngle(true); }
    if (parsed.sourceUrl) { setSourceUrl(parsed.sourceUrl); setPrefilledSource(true); }
    // Auto-focus first visible field
    setTimeout(() => angleRef.current?.focus(), 120);
  }, [router]);

  async function handleGenerate() {
    if (!draft || !embedToken) return;
    setError('');
    setLoading(true);
    setStatusPhase('Searching the web');
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: draft.topic,
          handle: draft.handle,
          pageName: draft.pageName,
          embedToken,
          theme: draft.theme,
          angle: angle.trim() || undefined,
          sourceUrl: sourceUrl.trim() || undefined,
          audience: audience || undefined,
          tone: tone || undefined,
        }),
      });

      if (!res.ok || !res.body) {
        let msg = `Error ${res.status}`;
        try { const d = await res.json(); msg = d.error ?? msg; } catch { /* noop */ }
        throw new Error(msg);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const event = JSON.parse(line.slice(6)) as {
            type: string;
            message?: string;
            code?: string;
            redirect?: string;
            slides?: CarouselMeta[];
            meta?: CarouselMeta;
          };

          if (event.type === 'status' && event.message) {
            setStatusPhase(event.message);
          } else if (event.type === 'done') {
            localStorage.setItem('carousel_slides', JSON.stringify(event.slides));
            localStorage.setItem('carousel_meta', JSON.stringify({ ...event.meta, theme: draft.theme }));
            router.push('/review');
            return;
          } else if (event.type === 'error') {
            if (event.code === 'INSUFFICIENT_CREDITS' && event.redirect) {
              window.location.href = event.redirect;
              return;
            }
            throw new Error(event.message ?? 'Generation failed');
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setStatusPhase('');
    }
  }

  function handleKeyDown(e: KeyboardEvent, fieldIndex: number) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (e.metaKey || e.ctrlKey) {
        handleGenerate();
        return;
      }
      if (fieldIndex === 0) {
        // Advance to source URL field only if it's visible
        const next = document.getElementById('clarify-field-1');
        if (next) next.focus();
        else (e.target as HTMLElement).blur();
      } else {
        (e.target as HTMLElement).blur();
      }
    }
  }

  if (!draft) return null;

  const questions: Array<{
    num: string;
    label: string;
    sub: string;
  }> = [
    { num: '01', label: 'What\'s your angle?', sub: 'Lock the specific thesis. Leave blank to let the AI pick the most surprising one.' },
    { num: '02', label: 'Primary source?', sub: 'Paste a URL to an article or report. We\'ll read it as the main research input.' },
    { num: '03', label: 'Who\'s reading?', sub: 'Audience expertise level affects vocabulary and how much context to provide.' },
    { num: '04', label: 'What\'s the tone?', sub: 'Sets the writing style for the entire carousel.' },
  ];

  return (
    <>
      <style>{`
        .clarify-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(255,255,255,0.12);
          padding: 10px 0;
          font-size: 18px;
          font-weight: 400;
          color: var(--ink);
          outline: none;
          transition: border-color 0.18s;
          font-family: inherit;
        }
        .clarify-input::placeholder { color: rgba(255,255,255,0.22); }
        .clarify-input:focus { border-bottom-color: var(--accent); }
        .pill-btn {
          padding: 8px 18px;
          border-radius: 100px;
          border: 1.5px solid var(--border);
          background: transparent;
          color: var(--ink-muted);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
          font-family: inherit;
        }
        .pill-btn:hover { border-color: rgba(255,255,255,0.28); color: var(--ink); }
        .pill-btn.active { border-color: var(--accent); background: rgba(232,137,74,0.12); color: #fff; }
      `}</style>
      <main style={{
        minHeight: 'calc(100dvh - 52px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '64px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(232,137,74,0.04) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <motion.div
          style={{ width: '100%', maxWidth: 620, position: 'relative' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          {/* Topic header */}
          <motion.div
            style={{ marginBottom: 56 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.4 }}
          >
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ink-faint)',
                fontSize: 13,
                cursor: 'pointer',
                padding: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'inherit',
              }}
            >
              ← Back
            </button>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 10,
            }}>
              Narrow it down
            </div>
            <h1 style={{
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 8,
            }}>
              {draft.topic}
            </h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>
              All fields are optional. Press Enter to advance, Cmd+Enter to generate.
            </p>
          </motion.div>

          {/* Pre-filled chips from homepage */}
          {(prefilledAngle || prefilledSource) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04, duration: 0.35 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 4 }}>
                From homepage
              </div>
              {prefilledAngle && (
                <PrefilledChip
                  label="Angle"
                  value={angle}
                  onClear={() => { setAngle(''); setPrefilledAngle(false); }}
                />
              )}
              {prefilledSource && (
                <PrefilledChip
                  label="Source"
                  value={sourceUrl}
                  onClear={() => { setSourceUrl(''); setPrefilledSource(false); }}
                />
              )}
            </motion.div>
          )}

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>
            {/* Q1 — Angle (hidden if pre-filled) */}
            {!prefilledAngle && (
              <QuestionBlock
                question={questions[0]}
                index={0}
                focused={focusedField === 0}
                staggerDelay={0.08}
              >
                <input
                  id="clarify-field-0"
                  ref={angleRef}
                  type="text"
                  className="clarify-input"
                  value={angle}
                  onChange={e => setAngle(e.target.value)}
                  onFocus={() => setFocusedField(0)}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={e => handleKeyDown(e, 0)}
                  placeholder="e.g. VC money is making founders worse"
                />
                {angle && (
                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--accent)', opacity: 0.8 }}>
                    Press Enter →
                  </div>
                )}
              </QuestionBlock>
            )}

            {/* Q2 — Source URL (hidden if pre-filled) */}
            {!prefilledSource && (
              <QuestionBlock
                question={questions[1]}
                index={1}
                focused={focusedField === 1}
                staggerDelay={0.14}
              >
                <input
                  id="clarify-field-1"
                  type="url"
                  className="clarify-input"
                  value={sourceUrl}
                  onChange={e => setSourceUrl(e.target.value)}
                  onFocus={() => setFocusedField(1)}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={e => handleKeyDown(e, 1)}
                  placeholder="https://example.com/article"
                />
              </QuestionBlock>
            )}

            {/* Q3 — Audience */}
            <QuestionBlock
              question={questions[2]}
              index={2}
              focused={false}
              staggerDelay={0.20}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
                {(['Beginner', 'Intermediate', 'Expert', 'Mixed'] as Audience[]).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`pill-btn${audience === opt ? ' active' : ''}`}
                    onClick={() => setAudience(audience === opt ? '' : opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </QuestionBlock>

            {/* Q4 — Tone */}
            <QuestionBlock
              question={questions[3]}
              index={3}
              focused={false}
              staggerDelay={0.26}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
                {(['Educational', 'Opinionated', 'Data-heavy', 'Story-first'] as Tone[]).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`pill-btn${tone === opt ? ' active' : ''}`}
                    onClick={() => setTone(tone === opt ? '' : opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </QuestionBlock>
          </div>

          {/* Error */}
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
                  marginTop: 32,
                  overflow: 'hidden',
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate button */}
          <motion.div
            style={{ marginTop: 52, display: 'flex', gap: 12, alignItems: 'center' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.4 }}
          >
            <motion.button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              style={{
                padding: '16px 32px',
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
                gap: 8,
                fontFamily: 'inherit',
              }}
              whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {loading ? (
                <ResearchStatus phase={statusPhase} />
              ) : 'Generate slides →'}
            </motion.button>

            {!loading && (
              <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
                or Cmd+Enter
              </span>
            )}
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}

function QuestionBlock({
  question,
  index,
  focused,
  staggerDelay,
  children,
}: {
  question: { num: string; label: string; sub: string };
  index: number;
  focused: boolean;
  staggerDelay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: staggerDelay, duration: 0.4, ease }}
    >
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Number */}
        <div style={{
          flexShrink: 0,
          width: 32,
          paddingTop: 2,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.10em',
          color: focused ? 'var(--accent)' : 'var(--ink-faint)',
          transition: 'color 0.18s',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {question.num}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: focused ? 'var(--ink)' : 'rgba(255,255,255,0.72)',
            marginBottom: 6,
            transition: 'color 0.18s',
          }}>
            {question.label}
          </div>
          <div style={{
            fontSize: 13,
            color: 'var(--ink-faint)',
            marginBottom: 18,
            lineHeight: 1.5,
          }}>
            {question.sub}
          </div>
          {children}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        marginTop: 28,
        height: 1,
        background: 'var(--border)',
        opacity: 0.5,
      }} />
    </motion.div>
  );
}

function ResearchStatus({ phase }: { phase: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={phase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          style={{ fontSize: 14 }}
        >
          {phase || 'Starting'}
        </motion.span>
      </AnimatePresence>
      <LoadingDots />
    </span>
  );
}

function PrefilledChip({ label, value, onClear }: { label: string; value: string; onClear: () => void }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 14px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      minWidth: 0,
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{
        fontSize: 13,
        color: 'var(--ink-muted)',
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {value}
      </span>
      <motion.button
        onClick={onClear}
        style={{ background: 'none', border: 'none', color: 'var(--ink-faint)', cursor: 'pointer', fontSize: 13, flexShrink: 0, padding: '0 2px', fontFamily: 'inherit' }}
        whileHover={{ color: 'var(--ink)' }}
        transition={{ duration: 0.15 }}
        title="Edit"
      >
        Edit
      </motion.button>
    </div>
  );
}

function LoadingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
        />
      ))}
    </span>
  );
}
