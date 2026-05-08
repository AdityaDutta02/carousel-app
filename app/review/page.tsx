'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide, CarouselMeta, StatItem, ListItem, GridItem } from '@/lib/types';
import { useEmbedToken } from '@/hooks/use-embed-token';

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export default function ReviewPage() {
  const router = useRouter();
  const embedToken = useEmbedToken();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [meta, setMeta] = useState<CarouselMeta | null>(null);
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
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: meta.topic, pageName: meta.pageName, handle: meta.handle, embedToken }),
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
    <motion.main
      style={{ padding: '40px 24px', maxWidth: 900, margin: '0 auto' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 36,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 5 }}>
            Review slides
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: 13 }}>
            {meta.topic} · {slides.length} slides · {meta.handle}
          </p>
        </div>
        <ActionButtons
          busy={busy}
          exporting={exporting}
          regenerating={regenerating}
          onBack={() => router.push('/')}
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

      {/* Slide list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {slides.map((slide, i) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: Math.min(i * 0.05, 0.35), ease }}
          >
            <motion.div
              whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.13)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 24px',
              }}
            >
              <SlideCard
                slide={slide}
                index={i}
                total={slides.length}
                onChange={updates => updateSlide(slide.id, updates)}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Footer actions */}
      <div style={{ marginTop: 36, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <ActionButtons
          busy={busy}
          exporting={exporting}
          regenerating={regenerating}
          onBack={() => router.push('/')}
          onRegenerate={handleRegenerate}
          onExport={handleExport}
        />
      </div>
    </motion.main>
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
      <Btn ghost onClick={onBack}>← New topic</Btn>
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

function SlideCard({ slide, index, total, onChange }: {
  slide: Slide;
  index: number;
  total: number;
  onChange: (updates: Partial<Slide>) => void;
}) {
  const typeLabel: Record<Slide['type'], string> = {
    hook: 'Hook', data: 'Data', insight: 'Insight',
    list: 'List', grid: 'Grid', findings: 'Findings', cta: 'CTA',
  };
  const typeColor: Record<Slide['type'], string> = {
    hook: '#E8894A', data: '#5B9CF6', insight: '#6BC28E',
    list: '#E8894A', grid: '#6BC28E', findings: '#6BC28E', cta: '#5B9CF6',
  };

  return (
    <div>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
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
          letterSpacing: '0.04em',
          flexShrink: 0,
        }}>
          {index + 1}
        </span>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.10em',
          color: typeColor[slide.type],
          textTransform: 'uppercase',
        }}>
          {typeLabel[slide.type]}
        </span>
        <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>of {total}</span>
      </div>

      {/* Headline fields */}
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
        </div>
      )}

      {slide.type === 'list' && (
        <ListEditor steps={slide.steps ?? []} onChange={steps => onChange({ steps })} />
      )}

      {(slide.type === 'grid' || slide.type === 'findings') && (
        <GridEditor items={slide.items ?? []} onChange={items => onChange({ items })} />
      )}

      {slide.type === 'cta' && (
        <InlineField label="Tagline" value={slide.tagline ?? ''} onChange={v => onChange({ tagline: v })} multiline />
      )}
    </div>
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
