'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide, CarouselMeta } from '@/lib/types';
import { useEmbedToken } from '@/hooks/use-embed-token';

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export default function DonePage() {
  const router = useRouter();
  const embedToken = useEmbedToken();
  const [filenames, setFilenames] = useState<string[]>([]);
  const [exportId, setExportId] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [meta, setMeta] = useState<CarouselMeta | null>(null);
  const [caption, setCaption] = useState('');
  const [captionLoading, setCaptionLoading] = useState(false);
  const [captionError, setCaptionError] = useState('');
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);

  useEffect(() => {
    const f = localStorage.getItem('carousel_filenames');
    const eid = localStorage.getItem('carousel_exportId');
    const s = localStorage.getItem('carousel_slides');
    const m = localStorage.getItem('carousel_meta');
    if (!f || !eid) { router.push('/'); return; }
    setFilenames(JSON.parse(f));
    setExportId(eid);
    if (s) setSlides(JSON.parse(s));
    if (m) setMeta(JSON.parse(m));
  }, [router]);

  async function downloadZip() {
    setZipping(true);
    try {
      const res = await fetch('/api/zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filenames, caption: caption || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'carousel.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'ZIP download failed');
    } finally {
      setZipping(false);
    }
  }

  async function generateCaption() {
    if (!slides.length || !meta) return;
    setCaptionError('');
    setCaptionLoading(true);
    try {
      const res = await fetch('/api/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides, meta, embedToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
      setCaption(data.caption);
    } catch (err) {
      setCaptionError(err instanceof Error ? err.message : 'Caption failed');
    } finally {
      setCaptionLoading(false);
    }
  }

  async function copyCaption() {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!filenames.length) return null;

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
            {filenames.length} slides exported
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: 13 }}>
            Download individually or grab the full ZIP below.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <NavBtn onClick={() => router.push('/review')}>← Edit slides</NavBtn>
          <NavBtn onClick={() => router.push('/')}>New carousel</NavBtn>
          <motion.button
            onClick={downloadZip}
            disabled={zipping}
            style={{
              padding: '10px 20px',
              background: zipping ? 'rgba(255,255,255,0.05)' : 'var(--accent)',
              color: zipping ? 'var(--ink-muted)' : '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: zipping ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
            whileHover={!zipping ? { scale: 1.02, y: -0.5 } : {}}
            whileTap={!zipping ? { scale: 0.97 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {zipping ? <>Zipping <LoadingDots /></> : '↓ Download ZIP'}
          </motion.button>
        </div>
      </div>

      {/* Thumbnail grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
        gap: 14,
        marginBottom: 48,
      }}>
        {filenames.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.5), ease }}
          >
            <SlideThumb filename={name} index={i + 1} />
          </motion.div>
        ))}
      </div>

      {/* Caption section */}
      <motion.div
        style={{ borderTop: '1px solid var(--border)', paddingTop: 36 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 3 }}>
              Caption
            </h2>
            <p style={{ fontSize: 12, color: 'var(--ink-muted)' }}>AI-written caption for this carousel</p>
          </div>
          <motion.button
            onClick={generateCaption}
            disabled={captionLoading || !meta}
            style={{
              padding: '9px 18px',
              background: caption ? 'transparent' : 'var(--accent)',
              color: caption ? 'var(--ink-muted)' : '#fff',
              border: caption ? '1px solid var(--border)' : 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: captionLoading || !meta ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
            whileHover={!captionLoading && !!meta ? { scale: 1.02 } : {}}
            whileTap={!captionLoading && !!meta ? { scale: 0.97 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {captionLoading ? <>Writing <LoadingDots /></> : caption ? 'Regenerate' : 'Generate caption'}
          </motion.button>
        </div>

        <AnimatePresence>
          {captionError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                background: 'rgba(220,60,60,0.10)',
                border: '1px solid rgba(220,60,60,0.22)',
                borderRadius: 8,
                padding: '12px 16px',
                color: '#ff7a7a',
                fontSize: 14,
                marginBottom: 12,
                overflow: 'hidden',
              }}
            >
              {captionError}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {caption && (
            <motion.div
              style={{ position: 'relative' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
            >
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                rows={6}
                className="caption-textarea"
              />
              <motion.button
                onClick={copyCaption}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  padding: '5px 12px',
                  background: copied ? 'rgba(107,194,142,0.15)' : 'rgba(255,255,255,0.06)',
                  color: copied ? '#6BC28E' : 'var(--ink-muted)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                animate={{ color: copied ? '#6BC28E' : 'rgba(255,255,255,0.42)' }}
                transition={{ duration: 0.2 }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {!caption && !captionLoading && (
          <div style={{
            border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '32px',
            textAlign: 'center',
            color: 'var(--ink-faint)',
            fontSize: 14,
          }}>
            Click &quot;Generate caption&quot; to write a caption from your slide content.
          </div>
        )}
      </motion.div>
    </motion.main>
  );
}

function NavBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      style={{
        padding: '10px 16px',
        background: 'transparent',
        color: 'var(--ink-muted)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        fontSize: 13,
        cursor: 'pointer',
      }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.7)' }}
      whileTap={{ scale: 0.97 }}
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

function SlideThumb({ filename, index }: { filename: string; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const src = `/api/slides/${encodeURIComponent(filename)}`;

  return (
    <motion.a
      href={src}
      download={filename}
      style={{ display: 'block', textDecoration: 'none' }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
      }}>
        <div style={{ position: 'relative', width: '100%', paddingBottom: '125%', background: '#0a0908' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Slide ${index}`}
            onLoad={() => setLoaded(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.4s',
            }}
          />
          {!loaded && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.15)',
              fontSize: 11,
            }}>
              loading…
            </div>
          )}
        </div>
        <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Slide {index}</span>
          <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>↓</span>
        </div>
      </div>
    </motion.a>
  );
}
