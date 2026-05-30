'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide, CarouselMeta, StatItem, ListItem, GridItem } from '@/lib/types';
import { useEmbedToken } from '@/hooks/use-embed-token';

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const TYPE_LABEL: Record<Slide['type'], string> = {
  hook: 'Hook', data: 'Data', insight: 'Insight',
  list: 'List', grid: 'Grid', findings: 'Findings', cta: 'CTA',
};
const TYPE_COLOR: Record<Slide['type'], string> = {
  hook: '#E8894A', data: '#5B9CF6', insight: '#6BC28E',
  list: '#E8894A', grid: '#6BC28E', findings: '#6BC28E', cta: '#5B9CF6',
};

export default function ReviewPage() {
  const router = useRouter();
  const embedToken = useEmbedToken();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [meta, setMeta] = useState<CarouselMeta | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const s = localStorage.getItem('carousel_slides');
    const m = localStorage.getItem('carousel_meta');
    if (!s || !m) { router.push('/'); return; }
    setSlides(JSON.parse(s));
    setMeta(JSON.parse(m));
  }, [router]);

  function updateSlide(id: number, updates: Partial<Slide>) {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }

  async function handleRegenerate() {
    if (!meta) return;
    setError('');
    setRegenerating(true);
    setExpandedId(null);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: meta.topic,
          pageName: meta.pageName,
          handle: meta.handle,
          theme: meta.theme,
          angle: meta.angle,
          sourceUrl: meta.sourceUrl,
          embedToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
      setSlides(data.slides);
      localStorage.setItem('carousel_slides', JSON.stringify(data.slides));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Regeneration failed');
    } finally {
      setRegenerating(false);
    }
  }

  async function handleExport() {
    if (!meta) return;
    setError('');
    setExporting(true);
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides, meta, embedToken }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      const data = await res.json() as { exportId: string; slideCount: number; filenames: string[] };
      localStorage.setItem('carousel_exportId', data.exportId);
      localStorage.setItem('carousel_filenames', JSON.stringify(data.filenames));
      localStorage.setItem('carousel_slides', JSON.stringify(slides));
      router.push('/done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  }

  if (!meta) return null;

  const busy = exporting || regenerating;

  return (
    <>
      <style>{`
        @media (max-width: 820px) { .slide-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 520px) { .slide-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <motion.main
        style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 5 }}>
              Review slides
            </h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: 13 }}>
              {meta.topic} · {slides.length} slides · {meta.handle}
              {meta.theme && <span style={{ marginLeft: 8, color: 'var(--ink-faint)' }}>· {meta.theme}</span>}
            </p>
          </div>
          <ActionButtons
            busy={busy}
            exporting={exporting}
            regenerating={regenerating}
            onBack={() => router.push('/clarify')}
            onRegenerate={handleRegenerate}
            onExport={handleExport}
          />
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
                marginBottom: 24,
                overflow: 'hidden',
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3-column grid */}
        <div
          className="slide-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}
        >
          {slides.map((slide, i) => {
            const isExpanded = expandedId === slide.id;
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(i * 0.04, 0.28), ease }}
                style={isExpanded ? { gridColumn: '1 / -1' } : {}}
              >
                <motion.div
                  onClick={() => !isExpanded && setExpandedId(slide.id)}
                  animate={{
                    borderColor: isExpanded ? 'var(--accent)' : 'var(--border)',
                    background: isExpanded ? 'var(--surface)' : 'var(--surface)',
                  }}
                  whileHover={!isExpanded ? { y: -2, borderColor: 'rgba(255,255,255,0.13)' } : {}}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    cursor: isExpanded ? 'default' : 'pointer',
                  }}
                >
                  {/* Card header — always visible */}
                  <div style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 22,
                      height: 22,
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'var(--ink-muted)',
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.10em',
                      color: TYPE_COLOR[slide.type],
                      textTransform: 'uppercase',
                      flex: 1,
                    }}>
                      {TYPE_LABEL[slide.type]}
                    </span>
                    {isExpanded ? (
                      <motion.button
                        onClick={() => setExpandedId(null)}
                        style={{
                          padding: '3px 8px',
                          background: 'transparent',
                          color: 'var(--ink-faint)',
                          border: '1px solid var(--border)',
                          borderRadius: 5,
                          fontSize: 11,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        whileHover={{ color: 'var(--ink)' }}
                        transition={{ duration: 0.15 }}
                      >
                        Done ✕
                      </motion.button>
                    ) : (
                      <span style={{ fontSize: 10, color: 'var(--ink-faint)' }}>Edit</span>
                    )}
                  </div>

                  {/* Compact preview — shown when collapsed */}
                  {!isExpanded && (
                    <div style={{ padding: '10px 16px 14px' }}>
                      <div style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--ink)',
                        lineHeight: 1.35,
                        marginBottom: 5,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {slide.headline || <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>No headline</span>}
                      </div>
                      {(slide.body || slide.supporting) && (
                        <div style={{
                          fontSize: 11,
                          color: 'var(--ink-muted)',
                          lineHeight: 1.5,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {slide.body || slide.supporting}
                        </div>
                      )}
                      {slide.stats && slide.stats.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                          {slide.stats.slice(0, 3).map((st, si) => (
                            <span key={si} style={{
                              fontSize: 10,
                              padding: '2px 6px',
                              background: 'rgba(91,156,246,0.12)',
                              color: '#5B9CF6',
                              borderRadius: 4,
                            }}>
                              {st.value}
                            </span>
                          ))}
                        </div>
                      )}
                      {slide.tagline && (
                        <div style={{ fontSize: 11, color: 'var(--ink-muted)', fontStyle: 'italic', marginTop: 4 }}>
                          {slide.tagline}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expanded edit panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '20px 24px 24px' }}>
                          <SlideEditFields
                            slide={slide}
                            onChange={updates => updateSlide(slide.id, updates)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <ActionButtons
            busy={busy}
            exporting={exporting}
            regenerating={regenerating}
            onBack={() => router.push('/clarify')}
            onRegenerate={handleRegenerate}
            onExport={handleExport}
          />
        </div>
      </motion.main>
    </>
  );
}

function SlideEditFields({ slide, onChange }: {
  slide: Slide;
  onChange: (updates: Partial<Slide>) => void;
}) {
  return (
    <div>
      {slide.type !== 'cta' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <InlineField label="Headline 1" value={slide.headline} onChange={v => onChange({ headline: v })} hint="~ prefix = gradient" />
          {slide.headline2 !== undefined && (
            <InlineField label="Headline 2" value={slide.headline2} onChange={v => onChange({ headline2: v })} hint="~ prefix = gradient" />
          )}
          {slide.headline3 !== undefined && (
            <InlineField label="Headline 3" value={slide.headline3} onChange={v => onChange({ headline3: v })} hint="~ prefix = gradient" />
          )}
        </div>
      )}

      {slide.type === 'hook' && (
        <InlineField label="Pill subtitle" value={slide.pill ?? ''} onChange={v => onChange({ pill: v })} />
      )}

      {slide.type === 'data' && (
        <div>
          <StatEditor stats={slide.stats ?? []} onChange={stats => onChange({ stats })} />
          <div style={{ marginTop: 12 }}>
            <InlineField label="Footnote" value={slide.footnote ?? ''} onChange={v => onChange({ footnote: v })} multiline />
          </div>
        </div>
      )}

      {slide.type === 'insight' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <InlineField label="Body" value={slide.body ?? ''} onChange={v => onChange({ body: v })} multiline />
          <InlineField label="Supporting" value={slide.supporting ?? ''} onChange={v => onChange({ supporting: v })} multiline />
          {slide.tagline !== undefined && (
            <InlineField label="Tagline" value={slide.tagline ?? ''} onChange={v => onChange({ tagline: v })} />
          )}
        </div>
      )}

      {slide.type === 'list' && (
        <ListEditor steps={slide.steps ?? []} onChange={steps => onChange({ steps })} />
      )}

      {(slide.type === 'grid' || slide.type === 'findings') && (
        <GridEditor items={slide.items ?? []} onChange={items => onChange({ items })} />
      )}

      {slide.type === 'cta' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <InlineField label="Headline" value={slide.headline} onChange={v => onChange({ headline: v })} />
          <InlineField label="Tagline" value={slide.tagline ?? ''} onChange={v => onChange({ tagline: v })} multiline />
        </div>
      )}
    </div>
  );
}

function ActionButtons({ busy, exporting, regenerating, onBack, onRegenerate, onExport }: {
  busy: boolean;
  exporting: boolean;
  regenerating: boolean;
  onBack: () => void;
  onRegenerate: () => void;
  onExport: () => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <Btn ghost onClick={onBack}>← Edit inputs</Btn>
      <Btn ghost onClick={onRegenerate} disabled={busy}>
        {regenerating ? <>Regenerating <LoadingDots /></> : '↺ Regenerate'}
      </Btn>
      <Btn primary onClick={onExport} disabled={busy}>
        {exporting ? <>Exporting <LoadingDots /></> : 'Export PNGs →'}
      </Btn>
    </div>
  );
}

function Btn({ primary, ghost, disabled, onClick, children }: {
  primary?: boolean;
  ghost?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: primary ? '10px 22px' : '10px 16px',
        background: primary ? (disabled ? 'rgba(255,255,255,0.06)' : 'var(--accent)') : 'transparent',
        color: primary ? (disabled ? 'var(--ink-muted)' : '#fff') : 'var(--ink-muted)',
        border: primary ? 'none' : '1px solid var(--border)',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: primary ? 700 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
      }}
      whileHover={!disabled ? { scale: 1.02, y: -0.5 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {children}
    </motion.button>
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

function InlineField({ label, value, onChange, hint, multiline }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: 'var(--ink-muted)',
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
        {hint && <span style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{hint}</span>}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="field-area"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="field-sm"
        />
      )}
    </div>
  );
}

function StatEditor({ stats, onChange }: { stats: StatItem[]; onChange: (s: StatItem[]) => void }) {
  function update(i: number, key: keyof StatItem, val: string) {
    onChange(stats.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  }
  function add() { onChange([...stats, { label: '', value: '' }]); }
  function remove(i: number) { onChange(stats.filter((_, idx) => idx !== i)); }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Stats</span>
        <motion.button onClick={add} style={miniBtn} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          + Add stat
        </motion.button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={stat.label} onChange={e => update(i, 'label', e.target.value)} placeholder="Label" className="field-sm" style={{ flex: 2 }} />
            <input value={stat.value} onChange={e => update(i, 'value', e.target.value)} placeholder="Value" className="field-sm" style={{ flex: 1 }} />
            <motion.button onClick={() => remove(i)} style={removeBtn} whileHover={{ color: '#ff6b6b' }} transition={{ duration: 0.15 }}>✕</motion.button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListEditor({ steps, onChange }: { steps: ListItem[]; onChange: (s: ListItem[]) => void }) {
  function update(i: number, key: keyof ListItem, val: string) {
    onChange(steps.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  }
  function add() { onChange([...steps, { title: '', desc: '' }]); }
  function remove(i: number) { onChange(steps.filter((_, idx) => idx !== i)); }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Steps</span>
        <motion.button onClick={add} style={miniBtn} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          + Add step
        </motion.button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.025)', borderRadius: 8, padding: '12px 14px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: 8, right: 8 }}>
              <motion.button onClick={() => remove(i)} style={removeBtn} whileHover={{ color: '#ff6b6b' }} transition={{ duration: 0.15 }}>✕</motion.button>
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input value={step.title} onChange={e => update(i, 'title', e.target.value)} placeholder={`Step ${i + 1} title`} className="field-sm" />
              <textarea value={step.desc} onChange={e => update(i, 'desc', e.target.value)} placeholder="Description" rows={2} className="field-area" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GridEditor({ items, onChange }: { items: GridItem[]; onChange: (s: GridItem[]) => void }) {
  function update(i: number, key: keyof GridItem, val: string) {
    onChange(items.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  }
  function add() { onChange([...items, { name: '', role: '' }]); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Items</span>
        <motion.button onClick={add} style={miniBtn} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          + Add item
        </motion.button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={item.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Name" className="field-sm" style={{ flex: 1 }} />
            <input value={item.role} onChange={e => update(i, 'role', e.target.value)} placeholder="Descriptor" className="field-sm" style={{ flex: 2 }} />
            <motion.button onClick={() => remove(i)} style={removeBtn} whileHover={{ color: '#ff6b6b' }} transition={{ duration: 0.15 }}>✕</motion.button>
          </div>
        ))}
      </div>
    </div>
  );
}

const miniBtn: React.CSSProperties = {
  padding: '4px 10px',
  background: 'rgba(255,255,255,0.05)',
  color: 'var(--ink-muted)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  fontSize: 11,
  cursor: 'pointer',
};

const removeBtn: React.CSSProperties = {
  padding: '4px 8px',
  background: 'transparent',
  color: 'rgba(255,100,100,0.50)',
  border: 'none',
  fontSize: 12,
  flexShrink: 0,
  cursor: 'pointer',
};
