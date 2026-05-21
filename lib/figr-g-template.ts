import type { Slide, CarouselMeta } from './types';

// figr-G: spacing/rules notebook template
// Palette: cream paper #F5F0E6 / charcoal #1F1E1D / coral #E85844 / yellow #F2D94A
// Fonts: Anton (display) + DM Serif Display italic (kickers) + Caveat (note labels) + Inter (body)
// Rule U1: hook → cover (light), CTA → light (override)
// Dark slides: index 1 (myth) + odd-indexed rule slides + takeaway
// Light slides: index 0 (cover) + even-indexed rule slides + CTA

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; font-family: 'Inter', sans-serif; }
.fg-slide { width: 1080px; height: 1350px; display: none; position: relative; overflow: hidden; }
.fg-slide.active { display: block; }

/* Paper grain SVG (inline, reused) */
/* Light slides — cream paper */
.fg-light {
  background: radial-gradient(ellipse 140% 120% at 40% 30%, #F5F0E6 0%, #ECE5D6 50%, #E4DDCC 100%);
  position: relative;
}
.fg-light::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
  background-size: 300px 300px; mix-blend-mode: multiply; opacity: 0.55;
}
/* Dark slides — charcoal */
.fg-dark {
  background: linear-gradient(160deg, #1F1E1D 0%, #161514 100%);
  position: relative;
}
.fg-dark::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
  background-size: 300px 300px; mix-blend-mode: overlay; opacity: 0.35;
}
/* Coral accent glow on dark */
.fg-dark::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background: radial-gradient(ellipse 50% 40% at 80% 20%, rgba(232,88,68,0.07) 0%, transparent 70%);
}

/* Top progress rule */
.fg-topbar { position: absolute; top: 78px; left: 64px; right: 64px; height: 1px; z-index: 2; }
.fg-light .fg-topbar { background: rgba(0,0,0,0.22); }
.fg-dark  .fg-topbar { background: rgba(255,255,255,0.22); }
.fg-tick { position: absolute; top: -3px; width: 4px; height: 7px; }
.fg-light .fg-tick { background: #E85844; }
.fg-dark  .fg-tick { background: #F2D94A; }

/* Crosshairs — dark slides only */
.fg-crosshair {
  position: absolute; width: 22px; height: 22px; z-index: 1;
  color: rgba(244,239,228,0.55); font-size: 22px; line-height: 1;
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-weight: 400;
}

/* Brand row */
.fg-brand { position: absolute; bottom: 64px; left: 64px; z-index: 3; }
.fg-brand span { font-size: 18px; font-weight: 500; letter-spacing: 0.01em; }
.fg-light .fg-brand span { color: rgba(21,17,14,0.78); }
.fg-dark  .fg-brand span { color: rgba(244,239,228,0.78); }
.fg-brand .fg-dot { color: #E85844; font-weight: 700; }
.fg-bookmark {
  position: absolute; bottom: 60px; right: 64px; z-index: 3;
  width: 22px; height: 30px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%);
}
.fg-light .fg-bookmark { background: rgba(21,17,14,0.78); }
.fg-dark  .fg-bookmark { background: rgba(244,239,228,0.78); }

/* Cover */
.fg-cover-body { position: absolute; inset: 0; z-index: 1; padding: 90px 64px; }
.fg-cover-num { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 138px; color: #E85844; line-height: 1; }
.fg-cover-title { font-family: 'Anton', sans-serif; font-size: 128px; color: #15110E; line-height: 0.95; letter-spacing: -0.01em; text-transform: uppercase; margin-top: -10px; }
.fg-cover-sub { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 52px; color: #E85844; line-height: 1.08; margin-top: 60px; max-width: 800px; }

/* Myth slide (dark) */
.fg-myth-body { position: absolute; inset: 0; z-index: 1; padding: 120px 80px 90px; display: flex; flex-direction: column; justify-content: center; }
.fg-myth-kicker { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 44px; color: rgba(244,239,228,0.55); margin-bottom: 36px; }
.fg-myth-hed { font-family: 'Anton', sans-serif; font-size: 100px; color: #F4EFE4; line-height: 0.97; text-transform: uppercase; letter-spacing: -0.01em; max-width: 900px; margin-bottom: 52px; }
.fg-myth-correction { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 64px; color: #F2D94A; line-height: 1.1; max-width: 860px; }

/* Rule slides */
.fg-rule-body { position: absolute; inset: 0; z-index: 1; padding: 120px 80px 200px; display: flex; flex-direction: column; }
.fg-rule-kicker { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 44px; margin-bottom: 20px; }
.fg-light .fg-rule-kicker { color: #8A8076; }
.fg-dark  .fg-rule-kicker { color: rgba(244,239,228,0.55); }
.fg-rule-hed { font-family: 'Anton', sans-serif; font-size: 90px; line-height: 1.0; text-transform: uppercase; letter-spacing: -0.01em; margin-bottom: 60px; }
.fg-light .fg-rule-hed { color: #15110E; }
.fg-dark  .fg-rule-hed { color: #F4EFE4; }

/* Note block */
.fg-note { position: absolute; bottom: 180px; left: 80px; right: 80px; max-width: 800px; }
.fg-note-label { font-family: 'Caveat', cursive; font-size: 56px; font-weight: 700; color: #E85844; line-height: 1; margin-bottom: 12px; }
.fg-note-body { font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 500; line-height: 1.42; }
.fg-light .fg-note-body { color: #15110E; }
.fg-dark  .fg-note-body { color: rgba(244,239,228,0.88); }

/* Ruler arc (SVG-based, for rule slides) */
.fg-arc { position: absolute; bottom: -240px; left: 50%; transform: translateX(-50%); width: 1100px; height: 600px; z-index: 0; }

/* Takeaway */
.fg-takeaway-body { position: absolute; inset: 0; z-index: 1; padding: 120px 80px; display: flex; flex-direction: column; justify-content: center; gap: 52px; }
.fg-takeaway-row { display: flex; align-items: flex-start; gap: 28px; }
.fg-takeaway-arr { font-family: 'Anton', sans-serif; font-size: 72px; color: #F2D94A; line-height: 1; flex-shrink: 0; margin-top: -6px; }
.fg-takeaway-text { font-family: 'Anton', sans-serif; font-size: 72px; color: #F4EFE4; line-height: 1.02; text-transform: uppercase; }
.fg-takeaway-text .fg-yellow { color: #F2D94A; }

/* CTA — light (Rule U1) */
.fg-cta-body { position: absolute; inset: 0; z-index: 1; padding: 120px 80px 200px; display: flex; flex-direction: column; justify-content: center; }
.fg-cta-hed { font-family: 'Anton', sans-serif; font-size: 90px; color: #15110E; line-height: 1.0; text-transform: uppercase; letter-spacing: -0.01em; max-width: 860px; margin-bottom: 52px; }
.fg-cta-hed .fg-coral { color: #E85844; }
.fg-cta-save { font-family: 'Anton', sans-serif; font-size: 80px; color: #15110E; line-height: 1.0; text-transform: uppercase; margin-bottom: 36px; }
.fg-cta-sub { font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 500; color: #8A8076; line-height: 1.5; max-width: 680px; }
`;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Formats the handle for display, adding @ prefix if not already present
function formatHandle(handle: string): string {
  return handle.startsWith('@') ? handle : `@${handle}`;
}

// Builds the brand row HTML — injected into every slide
function brandRow(handle: string): string {
  const displayed = formatHandle(handle);
  return `<div class="fg-brand"><span>${esc(displayed)}<span class="fg-dot">.design</span></span></div>`;
}

// Builds the bookmark flag HTML
function bookmark(): string {
  return `<div class="fg-bookmark"></div>`;
}

// Builds the top progress bar with a tick at the current slide position
function topbar(index: number, total: number): string {
  const tickLeft = total > 1
    ? 64 + index * ((1080 - 128) / (total - 1))
    : 64;
  return `<div class="fg-topbar"><div class="fg-tick" style="left: ${tickLeft}px;"></div></div>`;
}

// Four corner crosshairs — used on dark slides only
function crosshairs(): string {
  return [
    `style="top: 12px; left: 12px;"`,
    `style="top: 12px; right: 12px;"`,
    `style="bottom: 12px; left: 12px;"`,
    `style="bottom: 12px; right: 12px;"`,
  ]
    .map(pos => `<div class="fg-crosshair" ${pos}>&#8853;</div>`)
    .join('\n  ');
}

// Ruler arc SVG — appended to rule slides
function arcSVG(isLight: boolean): string {
  const stroke = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
  return `<svg class="fg-arc" viewBox="0 0 1100 600" fill="none" aria-hidden="true"><circle cx="550" cy="600" r="540" stroke="${stroke}" stroke-width="1.5"/></svg>`;
}

// Cover slide (index 0, always light)
function buildCover(s: Slide, index: number, total: number, meta: CarouselMeta): string {
  // Extract leading number from headline (e.g. "7 Spacing Rules" → num="7", rest="Spacing Rules")
  const match = s.headline.match(/^(\d+)\s*([\s\S]*)/);
  const coverNum = match ? match[1] : s.headline.charAt(0);
  const coverTitle = match ? match[2] : s.headline.slice(1);
  const coverSub = s.pill ?? s.headline2 ?? '';

  return `<section class="fg-slide fg-light${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  ${topbar(index, total)}
  <div class="fg-cover-body">
    <div class="fg-cover-num">${esc(coverNum)}</div>
    <div class="fg-cover-title">${esc(coverTitle)}</div>
    ${coverSub ? `<div class="fg-cover-sub">${esc(coverSub)}</div>` : ''}
  </div>
  ${brandRow(meta.handle)}
  ${bookmark()}
</section>`;
}

// Myth slide (index 1, always dark)
function buildMyth(s: Slide, index: number, total: number, meta: CarouselMeta): string {
  const correction = s.body ?? s.headline2 ?? '';

  return `<section class="fg-slide fg-dark${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  ${topbar(index, total)}
  ${crosshairs()}
  <div class="fg-myth-body">
    <div class="fg-myth-kicker">Myth buster</div>
    <div class="fg-myth-hed">${esc(s.headline)}</div>
    ${correction ? `<div class="fg-myth-correction">${esc(correction)}</div>` : ''}
  </div>
  ${brandRow(meta.handle)}
  ${bookmark()}
</section>`;
}

// Rule slide (index 2+, alternating light/dark)
function buildRule(
  s: Slide,
  index: number,
  total: number,
  meta: CarouselMeta,
  ruleNumber: number,
  isLight: boolean,
): string {
  const themeClass = isLight ? 'fg-light' : 'fg-dark';
  const noteBody = s.body ?? '';

  return `<section class="fg-slide ${themeClass}${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  ${topbar(index, total)}
  ${!isLight ? crosshairs() : ''}
  <div class="fg-rule-body">
    <div class="fg-rule-kicker">Rule ${ruleNumber}</div>
    <div class="fg-rule-hed">${esc(s.headline)}</div>
  </div>
  <div class="fg-note">
    <div class="fg-note-label">Note:</div>
    <div class="fg-note-body">${esc(noteBody)}</div>
  </div>
  ${arcSVG(isLight)}
  ${brandRow(meta.handle)}
  ${bookmark()}
</section>`;
}

// Takeaway slide (second-to-last non-CTA slide, always dark)
function buildTakeaway(s: Slide, index: number, total: number, meta: CarouselMeta): string {
  // Row 2: wrap first 3 words of headline2 in yellow span
  const row2Text = s.headline2 ?? '';
  const row2Words = row2Text.split(/\s+/);
  const yellowWords = row2Words.slice(0, 3).join(' ');
  const remainingWords = row2Words.slice(3).join(' ');
  const row2Html = remainingWords
    ? `<span class="fg-yellow">${esc(yellowWords)}</span> ${esc(remainingWords)}`
    : `<span class="fg-yellow">${esc(yellowWords)}</span>`;

  return `<section class="fg-slide fg-dark${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  ${topbar(index, total)}
  ${crosshairs()}
  <div class="fg-takeaway-body">
    <div class="fg-takeaway-row">
      <div class="fg-takeaway-arr">&rarr;</div>
      <div class="fg-takeaway-text">${esc(s.headline)}</div>
    </div>
    ${row2Text ? `<div class="fg-takeaway-row">
      <div class="fg-takeaway-arr">&rarr;</div>
      <div class="fg-takeaway-text">${row2Html}</div>
    </div>` : ''}
  </div>
  ${brandRow(meta.handle)}
  ${bookmark()}
</section>`;
}

// CTA slide (last slide, always light per Rule U1)
function buildCTA(s: Slide, index: number, total: number, meta: CarouselMeta): string {
  // Split pageName/tagline at last word, wrap last word in coral span
  const sourceText = s.tagline ?? meta.pageName;
  const words = sourceText.trim().split(/\s+/);
  const lastWord = words.pop() ?? sourceText;
  const ctaHedHtml =
    words.length > 0
      ? `${esc(words.join(' '))} <span class="fg-coral">${esc(lastWord)}</span>`
      : `<span class="fg-coral">${esc(lastWord)}</span>`;

  const displayHandle = formatHandle(meta.handle);

  return `<section class="fg-slide fg-light${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  ${topbar(index, total)}
  <div class="fg-cta-body">
    <div class="fg-cta-hed">${ctaHedHtml}</div>
    <div class="fg-cta-save">Save this post.</div>
    <div class="fg-cta-sub">Follow ${esc(displayHandle)} for more frameworks.</div>
  </div>
  ${arcSVG(true)}
  ${brandRow(meta.handle)}
  ${bookmark()}
</section>`;
}

export function buildFigrGHTML(slides: Slide[], meta: CarouselMeta): string {
  const total = slides.length;

  // Identify special positions
  const lastIndex = total - 1;
  const lastSlide = slides[lastIndex];
  const hasCTA = lastSlide?.type === 'cta';
  // Second-to-last non-CTA slide becomes the takeaway
  const takeawayIndex = hasCTA ? lastIndex - 1 : lastIndex;

  const slidesHTML = slides
    .map((s, i) => {
      // Cover: always index 0
      if (i === 0) {
        return buildCover(s, i, total, meta);
      }

      // CTA: last slide when type is cta
      if (hasCTA && i === lastIndex) {
        return buildCTA(s, i, total, meta);
      }

      // Myth: always index 1 (regardless of slide type)
      if (i === 1) {
        return buildMyth(s, i, total, meta);
      }

      // Takeaway: second-to-last non-CTA slide
      if (i === takeawayIndex && i > 1) {
        return buildTakeaway(s, i, total, meta);
      }

      // Rule slides: index 2 through takeawayIndex-1
      // ruleNumber counts from 1 starting at index 2 → ruleNumber = i - 1
      const ruleNumber = i - 1;
      // Even index = light, odd index = dark
      const isLight = i % 2 === 0;
      return buildRule(s, i, total, meta, ruleNumber, isLight);
    })
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Serif+Display:ital@0;1&family=Caveat:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${slidesHTML}
</body>
</html>`;
}
