import type { Slide, CarouselMeta } from './types';

// Figr-C: figr.design before/after split template
// Inter font. Stacked dark BEFORE / white AFTER panels for content slides. Light hook/CTA.
// Use for: frameworks, before/after transformations, shift-based thinking posts

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; font-family: 'Inter', sans-serif; }
.fc-slide { width: 1080px; height: 1350px; display: none; position: relative; overflow: hidden; }
.fc-slide.active { display: block; }

/* Light hook (Rule U1) */
.fc-hook {
  background-color: #FAFAFA;
  background-image: radial-gradient(circle, rgba(0,0,0,0.10) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
  display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: 90px;
  position: relative;
}
/* Cyan left bar on hook */
.fc-hook .fc-cyan-bar {
  position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  width: 5px; height: 180px;
  background: linear-gradient(180deg, transparent, #00C8B4 40%, #00C8B4 60%, transparent);
  border-radius: 0 3px 3px 0; z-index: 1;
}
.fc-hook-content { position: relative; z-index: 1; }
.fc-chip { display: inline-block; background: #00C8B4; color: #fff; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 10px 22px; border-radius: 4px; margin-bottom: 44px; }
.fc-h1 { font-size: 88px; font-weight: 700; color: #0D0D0D; line-height: 1.04; letter-spacing: -0.03em; max-width: 920px; margin-bottom: 36px; }
.fc-hook-sub { font-size: 28px; font-weight: 400; color: #6B6B6B; line-height: 1.4; }

/* BA slide — stacked panels */
.fc-ba { display: flex; flex-direction: column; }
.fc-ba-header {
  height: 76px; background: #18181B; flex-shrink: 0;
  display: flex; align-items: center; padding: 0 60px;
}
.fc-ba-label { font-size: 18px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #00C8B4; }
.fc-panel-before {
  height: 500px; flex-shrink: 0;
  background-color: #18181B;
  background-image: radial-gradient(circle, rgba(255,255,255,0.065) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
  padding: 44px 60px;
  display: flex; flex-direction: column; justify-content: center; gap: 16px;
}
.fc-ba-bridge {
  height: 60px; flex-shrink: 0;
  background: linear-gradient(to bottom, #18181B 50%, #FFFFFF 50%);
  position: relative; z-index: 2;
}
.fc-ba-bridge::after {
  content: ''; position: absolute; top: 50%; left: 60px; right: 60px; height: 2px;
  background: linear-gradient(90deg, transparent 0%, #00C8B4 15%, #00C8B4 85%, transparent 100%);
  transform: translateY(-50%);
}
.fc-panel-after {
  flex: 1;
  background-color: #FFFFFF;
  background-image: radial-gradient(circle, rgba(0,0,0,0.055) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
  padding: 44px 60px 110px;
  display: flex; flex-direction: column; justify-content: center; gap: 16px;
}
.fc-panel-mark { font-size: 56px; font-weight: 700; line-height: 1; letter-spacing: -0.02em; }
.fc-panel-before .fc-panel-mark { color: #FF4D4D; }
.fc-panel-after  .fc-panel-mark { color: #00C8B4; }
.fc-panel-badge { font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; margin-top: -4px; }
.fc-panel-before .fc-panel-badge { color: rgba(255,90,90,0.72); }
.fc-panel-after  .fc-panel-badge { color: #00C8B4; }
.fc-panel-before .fc-panel-h2 { font-size: 46px; font-weight: 700; color: #F1F5F9; line-height: 1.14; letter-spacing: -0.025em; }
.fc-panel-after  .fc-panel-h2 { font-size: 46px; font-weight: 700; color: #0D0D0D; line-height: 1.14; letter-spacing: -0.025em; }
.fc-panel-before .fc-panel-p { font-size: 22px; font-weight: 400; color: rgba(255,255,255,0.58); line-height: 1.55; max-width: 900px; }
.fc-panel-after  .fc-panel-p { font-size: 22px; font-weight: 400; color: #5C5C5C; line-height: 1.55; max-width: 900px; }

/* CTA — light (Rule U1) */
.fc-cta {
  background-color: #FAFAFA;
  background-image: radial-gradient(circle, rgba(0,0,0,0.10) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 90px; position: relative;
}
.fc-cta-marks { display: flex; align-items: center; gap: 28px; margin-bottom: 48px; }
.fc-cta-x     { font-size: 60px; font-weight: 700; color: #FF4D4D; letter-spacing: -0.02em; line-height: 1; }
.fc-cta-arr   { font-size: 32px; color: rgba(0,0,0,0.25); }
.fc-cta-check { font-size: 60px; font-weight: 700; color: #00C8B4; letter-spacing: -0.02em; line-height: 1; }
.fc-cta-h { font-size: 56px; font-weight: 700; color: #0D0D0D; letter-spacing: -0.025em; margin-bottom: 28px; max-width: 820px; line-height: 1.08; }
.fc-cta-sub { font-size: 26px; font-weight: 400; color: #6B6B6B; margin-bottom: 56px; max-width: 620px; line-height: 1.5; }
.fc-cta-btn { display: inline-block; background: #00C8B4; color: #fff; font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 600; padding: 20px 52px; border-radius: 10px; }

/* Brand + counter */
.fc-brand {
  position: absolute; bottom: 36px; right: 52px;
  display: flex; flex-direction: column; align-items: flex-end; gap: 3px; z-index: 10;
}
.fc-brand-name { font-size: 22px; font-weight: 700; line-height: 1; }
.fc-hook .fc-brand-name, .fc-cta .fc-brand-name { color: #0D0D0D; }
.fc-ba .fc-brand-name { color: #0D0D0D; }
.fc-brand-handle { font-size: 18px; font-weight: 500; color: #00C8B4; line-height: 1; }
.fc-counter { position: absolute; bottom: 42px; left: 52px; font-size: 18px; font-weight: 500; letter-spacing: 0.06em; z-index: 10; }
.fc-hook .fc-counter, .fc-cta .fc-counter { color: #BBBBBB; }
.fc-ba .fc-counter { color: #BBBBBB; }
`;

const CONTENT_SLIDE_TYPES = new Set(['findings', 'insight', 'data', 'grid', 'list']);

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function brand(pageName: string, handle: string): string {
  return `<div class="fc-brand">
    <span class="fc-brand-name">${esc(pageName)}</span>
    <span class="fc-brand-handle">${esc(handle)}</span>
  </div>`;
}

function counter(index: number, total: number): string {
  return `<div class="fc-counter">${index + 1} / ${total}</div>`;
}

function buildHook(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  const headlineLines = [s.headline, s.headline2, s.headline3]
    .filter(Boolean)
    .map(t => esc(t!))
    .join('<br>');
  const sub = s.pill
    ? `<div class="fc-hook-sub">${esc(s.pill)}</div>`
    : '';
  return `<section class="fc-slide fc-hook${index === 0 ? ' active' : ''}" id="fc-slide-${s.id}">
  <div class="fc-cyan-bar"></div>
  <div class="fc-hook-content">
    <div class="fc-chip">${esc(meta.pageName)}</div>
    <div class="fc-h1">${headlineLines}</div>
    ${sub}
  </div>
  ${brand(meta.pageName, meta.handle)}
  ${counter(index, total)}
</section>`;
}

// Resolve the sequential header label for a content slide.
// The first content slide gets "The Problem", subsequent ones get "Shift 01", "Shift 02", etc.
function resolveLabel(contentIndex: number): string {
  if (contentIndex === 0) return 'The Problem';
  return `Shift ${String(contentIndex).padStart(2, '0')}`;
}

function buildBA(
  s: Slide,
  meta: CarouselMeta,
  index: number,
  total: number,
  contentIndex: number,
): string {
  const label = resolveLabel(contentIndex);
  const beforeBadge = contentIndex === 0 ? 'What Happens' : 'Before';
  const afterBadge = contentIndex === 0 ? 'What Should Happen' : 'After';

  const beforeH2 = s.headline;
  const beforeP = s.body ?? '';
  const afterH2 = s.headline2 ?? s.headline;
  const afterP = s.supporting ?? '';

  return `<section class="fc-slide fc-ba" id="fc-slide-${s.id}">
  <div class="fc-ba-header">
    <span class="fc-ba-label">${esc(label)}</span>
  </div>
  <div class="fc-panel-before">
    <div class="fc-panel-mark">✗</div>
    <div class="fc-panel-badge">${esc(beforeBadge)}</div>
    <div class="fc-panel-h2">${esc(beforeH2)}</div>
    ${beforeP ? `<div class="fc-panel-p">${esc(beforeP)}</div>` : ''}
  </div>
  <div class="fc-ba-bridge"></div>
  <div class="fc-panel-after">
    <div class="fc-panel-mark">✓</div>
    <div class="fc-panel-badge">${esc(afterBadge)}</div>
    <div class="fc-panel-h2">${esc(afterH2)}</div>
    ${afterP ? `<div class="fc-panel-p">${esc(afterP)}</div>` : ''}
  </div>
  ${brand(meta.pageName, meta.handle)}
  ${counter(index, total)}
</section>`;
}

function buildCTA(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  const tagline = s.tagline ?? 'Which shift will you make first?';
  return `<section class="fc-slide fc-cta" id="fc-slide-${s.id}">
  <div class="fc-cta-marks">
    <span class="fc-cta-x">✗</span>
    <span class="fc-cta-arr">→</span>
    <span class="fc-cta-check">✓</span>
  </div>
  <div class="fc-cta-h">${esc(tagline)}</div>
  <div class="fc-cta-sub">Follow ${esc(meta.handle)} for more frameworks.</div>
  <a class="fc-cta-btn">Follow for more →</a>
  ${brand(meta.pageName, meta.handle)}
  ${counter(index, total)}
</section>`;
}

export function buildFigrCHTML(slides: Slide[], meta: CarouselMeta): string {
  const total = slides.length;

  // Pre-compute a running content-slide counter so labels are sequential
  let contentSlideCount = 0;

  const slidesHTML = slides.map((s, i) => {
    if (s.type === 'hook') {
      return buildHook(s, meta, i, total);
    }
    if (s.type === 'cta') {
      return buildCTA(s, meta, i, total);
    }
    if (CONTENT_SLIDE_TYPES.has(s.type)) {
      const html = buildBA(s, meta, i, total, contentSlideCount);
      contentSlideCount++;
      return html;
    }
    // Fallback: treat unknown types as BA slides
    const html = buildBA(s, meta, i, total, contentSlideCount);
    contentSlideCount++;
    return html;
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${slidesHTML}
</body>
</html>`;
}
