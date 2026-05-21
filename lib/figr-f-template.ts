import type { Slide, CarouselMeta } from './types';

// figr-F: wrong-vs-right contrast template
// Palette: cream #F7F6F3 / terracotta #B8624F / cyan-pale #00C8B4
// Fonts: Inter + JetBrains Mono
// Rule U1: hook and CTA are always light (cream background)

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; font-family: 'Inter', sans-serif; }
.ff-slide { width: 1080px; height: 1350px; display: none; position: relative; overflow: hidden; }
.ff-slide.active { display: block; }

/* Light hook (Rule U1) — cream with terracotta accent */
.ff-hook {
  background: #F7F6F3;
  background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
  background-size: 22px 22px;
  display: flex; flex-direction: column; padding: 92px;
  position: relative;
}
.ff-hook-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 80px; }
.ff-hook-label { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 500; color: #8A8682; text-transform: uppercase; letter-spacing: 0.10em; }
.ff-hook-counter-text { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 400; color: #AAAAAA; }
.ff-hook-body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.ff-hook-hed { font-size: 80px; font-weight: 800; color: #0D0D0D; line-height: 1.0; letter-spacing: -0.03em; max-width: 860px; margin-bottom: 0; }
.ff-hook-hed .ff-accent { color: #B8624F; }
.ff-hook-rule { height: 1px; background: rgba(0,0,0,0.10); margin: 52px 0 44px; }
.ff-hook-bottom { display: flex; justify-content: space-between; align-items: center; }
.ff-hook-sub { font-size: 22px; font-weight: 400; color: #6B6B6B; max-width: 640px; line-height: 1.55; }
.ff-hook-badge { display: flex; flex-direction: column; align-items: flex-end; }
.ff-hook-badge-num { font-family: 'JetBrains Mono', monospace; font-size: 48px; font-weight: 700; color: #B8624F; line-height: 1; }
.ff-hook-badge-lbl { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500; color: #8A8682; text-transform: uppercase; letter-spacing: 0.08em; text-align: right; }

/* Contrast slide — light header/footer, split body */
.ff-contrast { display: flex; flex-direction: column; position: relative; }
.ff-ct-header {
  height: 72px; flex-shrink: 0; border-bottom: 1px solid #DDD9D5;
  background: #F7F6F3; background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px); background-size: 22px 22px;
  display: flex; align-items: center; justify-content: space-between; padding: 0 60px;
}
.ff-ct-label { font-size: 18px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #0D0D0D; }
.ff-ct-counter { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 400; color: #AAAAAA; }
.ff-ct-toggle { height: 56px; flex-shrink: 0; border-bottom: 1px solid #DDD9D5; display: flex; }
.ff-toggle-half { flex: 1; display: flex; align-items: center; gap: 10px; padding: 0 60px; font-size: 18px; font-weight: 500; }
.ff-toggle-wrong { color: #B8624F; border-right: 1px solid #DDD9D5; }
.ff-toggle-right { color: #008A7C; }
.ff-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.ff-dot-wrong { background: #B8624F; }
.ff-dot-right { background: #00C8B4; }
.ff-ct-body { flex: 1; display: flex; }
.ff-ct-wrong {
  flex: 1; background: #EEE5E1;
  background-image: repeating-linear-gradient(-45deg, rgba(191,114,101,0.05) 0, rgba(191,114,101,0.05) 1px, transparent 0, transparent 50%);
  background-size: 12px 12px;
  padding: 52px 60px 52px 72px; border-right: 1px solid #E0D4CF;
  display: flex; flex-direction: column; justify-content: center; gap: 20px;
}
.ff-ct-right {
  flex: 1; background: #EBF9F7;
  background-image: radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 22px 22px;
  padding: 52px 72px 52px 60px; position: relative;
  display: flex; flex-direction: column; justify-content: center; gap: 20px;
}
.ff-ct-right::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; background: #00C8B4; }
.ff-panel-hed { font-size: 42px; font-weight: 700; line-height: 1.1; letter-spacing: -0.018em; }
.ff-ct-wrong .ff-panel-hed { color: #0D0D0D; }
.ff-ct-right .ff-panel-hed { color: #0D0D0D; }
.ff-panel-body { font-size: 22px; font-weight: 400; line-height: 1.68; }
.ff-ct-wrong .ff-panel-body { color: #6B6B6B; }
.ff-ct-right .ff-panel-body { color: #5C5C5C; }
.ff-ex-wrong { font-size: 18px; font-weight: 500; line-height: 1.55; color: #B8624F; border-left: 3px solid #B8624F; padding-left: 14px; background: rgba(184,98,79,0.06); padding: 10px 14px; border-radius: 0 6px 6px 0; }
.ff-ex-right { font-size: 18px; font-weight: 500; line-height: 1.55; color: #008A7C; border-left: 3px solid #00C8B4; padding-left: 14px; background: rgba(0,200,180,0.06); padding: 10px 14px; border-radius: 0 6px 6px 0; }
.ff-ct-footer { height: 64px; flex-shrink: 0; border-top: 1px solid #DDD9D5; display: flex; align-items: center; padding: 0 60px; background: #F7F6F3; }

/* Light CTA (Rule U1) */
.ff-cta {
  background: #F7F6F3;
  background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px); background-size: 22px 22px;
  display: flex; flex-direction: column; justify-content: space-between; padding: 92px;
  position: relative;
}
.ff-cta-body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.ff-cta-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 400; color: #8A8682; text-transform: uppercase; letter-spacing: 0.10em; margin-bottom: 44px; }
.ff-cta-hed { font-size: 72px; font-weight: 800; color: #0D0D0D; line-height: 1.04; letter-spacing: -0.026em; margin-bottom: 36px; max-width: 820px; }
.ff-cta-hed .ff-accent { color: #B8624F; }
.ff-cta-rule { width: 48px; height: 3px; background: #B8624F; margin-bottom: 32px; }
.ff-cta-sub { font-size: 22px; font-weight: 400; color: #6B6B6B; line-height: 1.55; max-width: 660px; }
.ff-cta-strip { border-top: 3px solid #B8624F; padding-top: 28px; display: flex; justify-content: space-between; align-items: center; }
.ff-cta-handle { font-size: 22px; font-weight: 700; color: #0D0D0D; }
.ff-cta-tagline { font-size: 18px; font-weight: 400; color: #8A8682; }

/* Brand */
.ff-brand { position: absolute; bottom: 36px; right: 52px; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; z-index: 2; }
.ff-brand-name { font-size: 20px; font-weight: 700; color: #6B6B6B; line-height: 1; }
.ff-brand-dot { color: #00C8B4; }
`;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function brandBlock(handle: string): string {
  return `<div class="ff-brand"><div class="ff-brand-name">${esc(handle)}<span class="ff-brand-dot">.</span></div></div>`;
}

// Strips a leading tilde used to flag accent text in headline fields
function stripTilde(text: string): string {
  return text.startsWith('~') ? text.slice(1) : text;
}

function buildHookSlide(s: Slide, index: number, total: number, _meta: CarouselMeta): string {
  const eyebrow = s.pill ?? _meta.topic.slice(0, 20);

  // headline: render normally; headline2: wrap in accent span (strip leading ~)
  let hedHtml = esc(s.headline);
  if (s.headline2) {
    hedHtml += `<br><span class="ff-accent">${esc(stripTilde(s.headline2))}</span>`;
  }
  if (s.headline3) {
    hedHtml += `<br>${esc(s.headline3)}`;
  }

  const badgeNum = s.stats?.[0]?.value ?? '5';
  const badgeLbl = s.stats?.[0]?.label ?? 'patterns';
  const subText = s.pill ?? _meta.topic;

  return `<section class="ff-slide ff-hook${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  <div class="ff-hook-top">
    <div class="ff-hook-label">${esc(eyebrow)}</div>
    <div class="ff-hook-counter-text">1 / ${total}</div>
  </div>
  <div class="ff-hook-body">
    <div class="ff-hook-hed">${hedHtml}</div>
  </div>
  <div class="ff-hook-rule"></div>
  <div class="ff-hook-bottom">
    <div class="ff-hook-sub">${esc(subText)}</div>
    <div class="ff-hook-badge">
      <div class="ff-hook-badge-num">${esc(badgeNum)}</div>
      <div class="ff-hook-badge-lbl">${esc(badgeLbl)}</div>
    </div>
  </div>
  ${brandBlock(_meta.handle)}
</section>`;
}

// Returns a short label for the contrast slide header based on position
function contrastLabel(index: number, total: number): string {
  // index 1 is typically the first content slide after hook — treat as "The Core Problem"
  // subsequent content slides are "Pattern 01", "Pattern 02", ...
  if (index === 1) return 'The Core Problem';
  const patternNum = String(index - 1).padStart(2, '0');
  return `Pattern ${patternNum}`;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}

function buildContrastSlide(s: Slide, index: number, total: number, _meta: CarouselMeta): string {
  const label = contrastLabel(index, total);
  const counter = `${index + 1} / ${total}`;

  const wrongLabel = truncate(s.headline, 20);
  const rightLabel = truncate(stripTilde(s.headline2 ?? s.headline), 20);

  const wrongHed = esc(s.headline);
  const rightHed = esc(stripTilde(s.headline2 ?? s.headline));

  const wrongBody = s.body ? `<div class="ff-panel-body">${esc(s.body)}</div>` : '';
  const rightBody = s.supporting ? `<div class="ff-panel-body">${esc(s.supporting)}</div>` : '';

  const wrongEx = s.footnote
    ? `<div class="ff-ex-wrong">${esc(s.footnote)}</div>`
    : '';
  const rightEx = s.footnote
    ? `<div class="ff-ex-right">When done right: ${esc(s.footnote)}</div>`
    : '';

  return `<section class="ff-slide ff-contrast${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  <div class="ff-ct-header">
    <div class="ff-ct-label">${esc(label)}</div>
    <div class="ff-ct-counter">${esc(counter)}</div>
  </div>
  <div class="ff-ct-toggle">
    <div class="ff-toggle-half ff-toggle-wrong">
      <div class="ff-dot ff-dot-wrong"></div>
      ${esc(wrongLabel)}
    </div>
    <div class="ff-toggle-half ff-toggle-right">
      <div class="ff-dot ff-dot-right"></div>
      ${esc(rightLabel)}
    </div>
  </div>
  <div class="ff-ct-body">
    <div class="ff-ct-wrong">
      <div class="ff-panel-hed">${wrongHed}</div>
      ${wrongBody}
      ${wrongEx}
    </div>
    <div class="ff-ct-right">
      <div class="ff-panel-hed">${rightHed}</div>
      ${rightBody}
      ${rightEx}
    </div>
  </div>
  <div class="ff-ct-footer">
    ${brandBlock(_meta.handle)}
  </div>
</section>`;
}

function buildCTASlide(s: Slide, index: number, _total: number, meta: CarouselMeta): string {
  // Split pageName: wrap last word in accent span
  const pageWords = meta.pageName.trim().split(/\s+/);
  const lastWord = pageWords.pop() ?? meta.pageName;
  const ctaHedHtml =
    pageWords.length > 0
      ? `${esc(pageWords.join(' '))} <span class="ff-accent">${esc(lastWord)}</span>`
      : `<span class="ff-accent">${esc(lastWord)}</span>`;

  const sub = s.tagline ?? `Follow ${meta.handle} for more.`;

  return `<section class="ff-slide ff-cta${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  <div class="ff-cta-body">
    <div class="ff-cta-eyebrow">// apply_to_your_product</div>
    <div class="ff-cta-hed">${ctaHedHtml}</div>
    <div class="ff-cta-rule"></div>
    <div class="ff-cta-sub">${esc(sub)}</div>
  </div>
  <div class="ff-cta-strip">
    <div class="ff-cta-handle">${esc(meta.handle)}</div>
    <div class="ff-cta-tagline">${esc(s.tagline ?? meta.topic)}</div>
  </div>
  ${brandBlock(meta.handle)}
</section>`;
}

export function buildFigrFHTML(slides: Slide[], meta: CarouselMeta): string {
  const total = slides.length;

  const slidesHTML = slides
    .map((s, i) => {
      switch (s.type) {
        case 'hook':
          return buildHookSlide(s, i, total, meta);
        case 'cta':
          return buildCTASlide(s, i, total, meta);
        // All content slide types map to the contrast layout
        case 'insight':
        case 'data':
        case 'list':
        case 'grid':
        case 'findings':
          return buildContrastSlide(s, i, total, meta);
        default:
          return buildContrastSlide(s, i, total, meta);
      }
    })
    .join('\n\n');

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
