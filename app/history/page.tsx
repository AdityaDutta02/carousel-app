'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { HistoryEntry } from '@/lib/history';
import { useEmbedToken } from '@/hooks/use-embed-token';

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export default function HistoryPage() {
  const router = useRouter();
  const embedToken = useEmbedToken();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load(token: string) {
    const res = await fetch('/api/history', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json() as HistoryEntry[];
    setEntries(data);
    setLoading(false);
  }

  useEffect(() => {
    if (embedToken) load(embedToken);
  }, [embedToken]);

  async function handleDelete(id: string) {
    if (!embedToken) return;
    await fetch(`/api/history?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${embedToken}` },
    });
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  function handleReopen(entry: HistoryEntry) {
    localStorage.setItem('carousel_slides', JSON.stringify(entry.slides));
    localStorage.setItem('carousel_meta', JSON.stringify({
      topic: entry.topic,
      handle: entry.handle,
      pageName: entry.pageName,
      theme: entry.theme,
    }));
    router.push('/review');
  }

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
            History
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: 13 }}>
            Past generations - reopen to edit and re-export.
          </p>
        </div>
        <motion.button
          onClick={() => router.push('/')}
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
          ← New carousel
        </motion.button>
      </div>

      {loading && (
        <p style={{ color: 'var(--ink-faint)', fontSize: 14 }}>Loading…</p>
      )}

      {!loading && entries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: 56,
            textAlign: 'center',
            color: 'var(--ink-faint)',
            fontSize: 14,
          }}
        >
          No history yet. Generate your first carousel to see it here.
        </motion.div>
      )}

      <AnimatePresence>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12, height: 0 }}
              transition={{ duration: 0.28, delay: Math.min(i * 0.05, 0.3), ease }}
              layout
            >
              <motion.div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
                whileHover={{ borderColor: 'rgba(255,255,255,0.12)', y: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.10em',
                      textTransform: 'uppercase',
                      color: entry.theme === 'editorial' ? '#F5C800'
                           : entry.theme === 'wolf-v2' ? '#E02020'
                           : entry.theme === 'editorial-step' ? '#A8936A'
                           : entry.theme === 'ascii-pixel' ? '#F7892B'
                           : 'var(--accent)',
                    }}>
                      {entry.theme === 'default' ? 'Dark Charcoal'
                        : entry.theme === 'wolf-v2' ? 'Bold Report'
                        : entry.theme === 'editorial-step' ? 'Cream Tutorial'
                        : entry.theme === 'ascii-pixel' ? 'ASCII Terminal'
                        : 'Gold Noir'}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
                      {entry.slideCount} slides · {entry.handle}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: 3,
                  }}>
                    {entry.topic}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
                    {entry.pageName} · {new Date(entry.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <motion.button
                    onClick={() => handleReopen(entry)}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--accent)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    whileHover={{ scale: 1.04, y: -0.5 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    Reopen
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(entry.id)}
                    style={{
                      padding: '8px 12px',
                      background: 'transparent',
                      color: 'rgba(255,100,100,0.45)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                    whileHover={{ color: '#ff6b6b', borderColor: 'rgba(220,60,60,0.35)', scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    ✕
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.main>
  );
}
