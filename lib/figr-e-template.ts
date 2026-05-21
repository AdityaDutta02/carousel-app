import type { Slide, CarouselMeta } from './types';

// Figr-E: figr.design system/data template
// Inter + JetBrains Mono. Dark left stat panel (320px) with bleeding cyan number + cream right content panel. Light hook.
// Use for: data-driven posts, system frameworks, numbered rules, research breakdowns

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; font-family: 'Inter', sans-serif; }
.fe-slide { width: 1080px; height: 1350px; display: none; position: relative; overflow: hidden; }
.fe-slide.active { display: block; }

/* Light hook (Rule U1) */
.fe-hook {
  background: #F4F3EF;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 92px;
  position: relative;
}
.fe-hook-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; }
.fe-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 500; color: #8A8682; text-transform: uppercase; letter-spacing: 0.10em; }
.fe-hook-counter { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 400; color: #AAAAAA; }
.fe-hook-hed { font-size: 88px; font-weight: 800; color: #0D0D0D; line-height: 0.98; letter-spacing: -0.03em; margin-bottom: 36px; max-width: 880px; }
.fe-hook-hed .fe-cyan { color: #00C8B4; }
.fe-hook-div { height: 1px; background: rgba(0,0,0,0.10); margin: 36px 0; }
.fe-hook-bottom { display: flex; justify-content: space-between; align-items: center; }
.fe-hook-sub { font-size: 22px; font-weight: 400; color: #6B6B6B; max-width: 640px; line-height: 1.55; }
.fe-hook-stat { display: flex; flex-direction: column; align-items: flex-end; }
.fe-hook-stat-num { font-family: 'JetBrains Mono', monospace; font-size: 52px; font-weight: 700; color: #00C8B4; line-height: 1; }
.fe-hook-stat-lbl { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 500; color: #8A8682; text-transform: uppercase; letter-spacing: 0.10em; text-align: right; }

/* System slide — split layout */
.fe-sys { display: flex; flex-direction: row; }
.fe-sys-left {
  width: 320px; flex-shrink: 0; position: relative;
  background-color: #1A2035;
  background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  overflow: hidden;
}
/* Cyan right border on left panel */
.fe-sys-left::after {
  content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 3px;
  background: linear-gradient(to bottom, transparent, #00C8B4 20%, #00C8B4 80%, transparent);
}
.fe-stat-bg-num {
  position: absolute; top: -20px; left: -16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 260px; font-weight: 800; color: #00C8B4;
  line-height: 1; letter-spacing: -0.06em; opacity: 0.88;
  white-space: nowrap;
}
.fe-sys-left-bottom {
  position: absolute; bottom: 52px; left: 28px; right: 28px;
}
.fe-stat-unit { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 500; color: #00C8B4; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
.fe-stat-desc { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 400; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.04em; line-height: 1.4; }

.fe-sys-right {
  flex: 1; display: flex; flex-direction: column;
  background-color: #F4F3EF;
  background-image: radial-gradient(circle, rgba(0,0,0,0.065) 1px, transparent 1px);
  background-size: 24px 24px;
}
.fe-sys-right-top {
  height: 80px; flex-shrink: 0;
  border-bottom: 1px solid #E0DED9;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 52px;
  background: rgba(255,255,255,0.70);
}
.fe-rule-label { font-size: 18px; font-weight: 600; color: #00C8B4; text-transform: uppercase; letter-spacing: 0.12em; }
.fe-sys-counter { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 400; color: #AAAAAA; }
.fe-sys-right-body {
  flex: 1; padding: 52px 52px 36px;
  background: rgba(255,255,255,0.72);
  display: flex; flex-direction: column; justify-content: center;
}
.fe-content-hed { font-size: 52px; font-weight: 700; color: #0D0D0D; line-height: 1.1; letter-spacing: -0.018em; margin-bottom: 28px; }
.fe-content-div { width: 40px; height: 3px; background: #00C8B4; margin-bottom: 32px; }
.fe-content-body { font-size: 24px; font-weight: 400; color: #5C5C5C; line-height: 1.62; }
.fe-sys-right-footer {
  height: 80px; flex-shrink: 0; border-top: 1px solid #E0DED9;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 52px; background: rgba(255,255,255,0.70);
}
.fe-footer-source { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 400; color: #AAAAAA; text-transform: uppercase; letter-spacing: 0.06em; }

/* CTA — light (Rule U1) */
.fe-cta {
  background: #F4F3EF;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 92px;
  position: relative;
}
.fe-cta-dark {
  flex: 1; display: flex; flex-direction: column; justify-content: center;
}
.fe-cta-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 400; color: #8A8682; text-transform: uppercase; letter-spacing: 0.10em; margin-bottom: 44px; }
.fe-cta-hed { font-size: 72px; font-weight: 800; color: #0D0D0D; line-height: 1.04; letter-spacing: -0.026em; margin-bottom: 28px; max-width: 820px; }
.fe-cta-hed .fe-cyan { color: #00C8B4; }
.fe-cta-rule { width: 48px; height: 3px; background: #00C8B4; margin-bottom: 32px; }
.fe-cta-sub { font-size: 22px; font-weight: 400; color: #6B6B6B; line-height: 1.55; max-width: 680px; }
.fe-cta-strip {
  border-top: 3px solid #00C8B4;
  padding-top: 28px;
  display: flex; justify-content: space-between; align-items: center;
}
.fe-cta-handle { font-size: 22px; font-weight: 700; color: #0D0D0D; }
.fe-cta-tagline { font-size: 18px; font-weight: 400; color: #8A8682; }

/* Brand block */
.fe-brand {
  position: absolute; bottom: 36px; right: 52px;
  display: flex; flex-direction: column; align-items: flex-end; gap: 3px; z-index: 2;
}
.fe-brand-name { font-size: 22px; font-weight: 700; color: #0D0D0D; line-height: 1; }
.fe-brand-handle { font-size: 18px; font-weight: 500; color: #00C8B4; line-height: 1; }
`;

const SYSTEM_SLIDE_TYPES = new Set(['data', 'insight', 'list', 'grid', 'findings']);

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function brand(pageName: string, handle: string): string {
  return `<div class="fe-brand">
    <span class="fe-brand-name">${esc(pageName)}</span>
    <span class="fe-brand-handle">${esc(handle)}</span>
  </div>`;
}

// Render hook headline, wrapping headline2 in cyan span if it starts with ~
function renderHookHeadline(s: Slide): string {
  const lines: string[] = [];

  if (s.headline) {
    lines.push(esc(s.headline));
  }
  if (s.headline2) {
    if (s.headline2.startsWith('~')) {
      lines.push(`<span class="fe-cyan">${esc(s.headline2.slice(1))}</span>`);
    } else {
      lines.push(esc(s.headline2));
    }
  }
  if (s.headline3) {
    if (s.headline3.startsWith('~')) {
      lines.push(`<span class="fe-cyan">${esc(s.headline3.slice(1))}</span>`);
    } else {
      lines.push(esc(s.headline3));
    }
  }

  return lines.join('<br>');
}

function buildHook(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  const statNum = s.stats?.[0]?.value ?? meta.topic.slice(0, 6);
  const statLbl = s.stats?.[0]?.label ?? '';
  const sub = s.pill ?? '';

  const statBlock = `<div class="fe-hook-stat">
      <div class="fe-hook-stat-num">${esc(statNum)}</div>
      ${statLbl ? `<div class="fe-hook-stat-lbl">${esc(statLbl)}</div>` : ''}
    </div>`;

  return `<section class="fe-slide fe-hook${index === 0 ? ' active' : ''}" id="fe-slide-${s.id}">
  <div class="fe-hook-top">
    <div class="fe-eyebrow">${esc(meta.topic.slice(0, 30))}</div>
    <div class="fe-hook-counter">1 / ${total}</div>
  </div>
  <div class="fe-hook-hed">${renderHookHeadline(s)}</div>
  <div class="fe-hook-div"></div>
  <div class="fe-hook-bottom">
    <div class="fe-hook-sub">${esc(sub)}</div>
    ${statBlock}
  </div>
  ${brand(meta.pageName, meta.handle)}
</section>`;
}

function buildSys(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  const bgNum = s.stats?.[0]?.value ?? s.headline2 ?? '∞';
  const statUnit = s.stats?.[0]?.label ?? '';
  const statDesc = s.stats?.[1]?.label ?? s.footnote ?? '';
  const ruleLabel = s.pill ?? 'Rule';
  const footerSource = s.footnote ?? '';
  const body = s.body ?? '';

  return `<section class="fe-slide fe-sys" id="fe-slide-${s.id}">
  <div class="fe-sys-left">
    <div class="fe-stat-bg-num">${esc(bgNum)}</div>
    <div class="fe-sys-left-bottom">
      ${statUnit ? `<div class="fe-stat-unit">${esc(statUnit)}</div>` : ''}
      ${statDesc ? `<div class="fe-stat-desc">${esc(statDesc)}</div>` : ''}
    </div>
  </div>
  <div class="fe-sys-right">
    <div class="fe-sys-right-top">
      <span class="fe-rule-label">${esc(ruleLabel)}</span>
      <span class="fe-sys-counter">${index + 1} / ${total}</span>
    </div>
    <div class="fe-sys-right-body">
      <div class="fe-content-hed">${esc(s.headline)}</div>
      <div class="fe-content-div"></div>
      <div class="fe-content-body">${esc(body)}</div>
    </div>
    <div class="fe-sys-right-footer">
      <span class="fe-footer-source">${esc(footerSource)}</span>
      ${brand(meta.pageName, meta.handle)}
    </div>
  </div>
</section>`;
}

function buildCTA(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  const tagline = s.tagline ?? 'Weekly frameworks for design leads.';

  return `<section class="fe-slide fe-cta${index === 0 ? ' active' : ''}" id="fe-slide-${s.id}">
  <div class="fe-cta-dark">
    <div class="fe-cta-eyebrow">// apply_to_your_product</div>
    <div class="fe-cta-hed">${esc(meta.pageName)} <span class="fe-cyan">${esc(meta.handle)}</span></div>
    <div class="fe-cta-rule"></div>
    <div class="fe-cta-sub">${esc(tagline)}</div>
  </div>
  <div class="fe-cta-strip">
    <span class="fe-cta-handle">${esc(meta.handle)}</span>
    <span class="fe-cta-tagline">${esc(tagline)}</span>
  </div>
</section>`;
}

export function buildFigrEHTML(slides: Slide[], meta: CarouselMeta): string {
  const total = slides.length;

  const slidesHTML = slides.map((s, i) => {
    if (s.type === 'hook') {
      return buildHook(s, meta, i, total);
    }
    if (s.type === 'cta') {
      return buildCTA(s, meta, i, total);
    }
    if (SYSTEM_SLIDE_TYPES.has(s.type)) {
      return buildSys(s, meta, i, total);
    }
    // Fallback: treat unknown types as system slides
    return buildSys(s, meta, i, total);
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${slidesHTML}
</body>
</html>`;
}
