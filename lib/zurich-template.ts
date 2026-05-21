import type { Slide, CarouselMeta } from './types';

// figr-H: Zurich / Color Blocks template
// Three-color Bauhaus / Swiss editorial poster series
// Palette: --cream #F1ECDB / --red #D04437 / --navy #1B2540 (+ --ink #1A1A1C for body on cream)
// Typography: Inter 900 heroes, Inter 700 eyebrows (18px 0.22em tracking), Inter 500 body (24px)
// Rule U2: every .navy panel uses 3-stop radial gradient + grain ::before + red glow blob
// Rule U3: all eyebrow/label text 18px minimum
// Locked 7-slide structure: Cover / Intro / Critique 01–03 / Principle / CTA

const CSS = `
  :root {
    --cream: #F1ECDB;
    --red: #D04437;
    --navy: #1B2540;
    --ink: #1A1A1C;
    --cream-85: rgba(241,236,219,0.85);
    --cream-70: rgba(241,236,219,0.70);
    --cream-55: rgba(241,236,219,0.55);
    --ink-65: rgba(26,26,28,0.65);
    --ink-55: rgba(26,26,28,0.55);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: #0a0a0a;
    -webkit-font-smoothing: antialiased;
  }

  .slide {
    width: 1080px;
    height: 1350px;
    position: relative;
    overflow: hidden;
    display: none;
    color: var(--ink);
    font-family: 'Inter', system-ui, sans-serif;
  }
  .slide.active { display: flex; }

  /* Color fields */
  .cream { background: var(--cream); color: var(--ink); }
  .red   { background: var(--red);   color: var(--cream); }

  /* Rule U2: navy panel — 3-stop radial gradient + grain + red glow blob */
  .navy {
    color: var(--cream);
    background:
      radial-gradient(ellipse 110% 80% at 30% 22%, rgba(208,68,55,0.06) 0%, transparent 55%),
      radial-gradient(ellipse 130% 100% at 70% 80%, #243056 0%, #1B2540 55%, #131A32 100%);
    position: relative;
  }
  .navy::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.92 0 0 0 0 0.86 0 0 0 0.22 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
    mix-blend-mode: overlay;
    opacity: 0.22;
    z-index: 1;
  }

  /* Eyebrow / label type — Rule U3: 18px floor */
  .eb       { font-weight: 700; font-size: 18px; letter-spacing: 0.22em; text-transform: uppercase; }
  .eb-tight { font-weight: 600; font-size: 18px; letter-spacing: 0.22em; text-transform: uppercase; }

  /* Body */
  .body-24 { font-weight: 500; font-size: 24px; line-height: 1.45; }

  /* Layer above navy ::before grain */
  .lay { position: relative; z-index: 2; width: 100%; height: 100%; display: flex; }

  /* Critique shared: navy-panel numeral */
  .crit-num {
    font-weight: 900;
    line-height: 0.82;
    letter-spacing: -0.06em;
    color: var(--cream);
  }

  /* Critique headline on cream panels */
  .crit-hd {
    font-weight: 900;
    line-height: 0.9;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: var(--ink);
  }

  /* Critique body text on cream panels */
  .crit-body {
    font-weight: 500;
    font-size: 24px;
    line-height: 1.45;
    color: var(--ink-65);
  }
`;

// Escape HTML special characters for safe interpolation into HTML strings
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Format handle: ensure it starts with @
function formatHandle(handle: string): string {
  return handle.startsWith('@') ? handle : `@${handle}`;
}

// Apply red accent treatment: a leading ~ on any headline field marks the word/phrase in red.
// Strips the ~ and wraps the text in a red span.
function applyAccent(raw: string, colorVar: string = 'var(--red)'): string {
  if (raw.startsWith('~')) {
    return `<span style="color:${colorVar};">${esc(raw.slice(1))}</span>`;
  }
  return esc(raw);
}

// Split a headline string on " / " to produce individual <div> lines.
// Each segment may carry the ~ accent prefix independently.
function headlineLines(raw: string, accentColor: string = 'var(--red)'): string {
  const segments = raw.split(' / ');
  return segments
    .map(seg => `<div>${applyAccent(seg.trim(), accentColor)}</div>`)
    .join('\n        ');
}

// Slide 1 — Cover (RED, 66/34 horizontal split, giant hardcoded "7")
// Content: s.headline = 4-line title stack (segments separated by " / ")
// Brand block: @figr.design bottom-right of right column
function buildSlide1Cover(s: Slide, isActive: boolean): string {
  const issueLabel = s.pill ? esc(s.pill) : 'Issue 01';
  const titleLines = headlineLines(s.headline, 'var(--red)');
  const activeClass = isActive ? ' active' : '';

  return `<!-- SLIDE 1 — Cover (RED) -->
<section class="slide red s1${activeClass}" id="slide-1">
  <div class="lay">
    <div style="flex:0.66; display:flex; align-items:center; justify-content:center; padding-left:40px;">
      <div style="font-weight:900; font-size:920px; line-height:0.78; letter-spacing:-0.06em; color:var(--cream);">7</div>
    </div>
    <div style="flex:0.34; display:flex; flex-direction:column; justify-content:space-between; padding:64px 64px 64px 0;">
      <div class="eb" style="color:var(--cream-70);">${issueLabel}</div>
      <div style="font-weight:900; font-size:62px; line-height:0.92; letter-spacing:-0.035em; text-transform:uppercase; color:var(--cream);">
        ${titleLines}
      </div>
      <div class="eb" style="color:var(--cream-70);">@figr.design</div>
    </div>
  </div>
</section>`;
}

// Slide 2 — Intro (NAVY top 55% + CREAM bottom 45%, vertical split)
// Content: s.headline = hero question/word in navy panel, s.body = lead sentence on cream
function buildSlide2Intro(s: Slide, isActive: boolean): string {
  const heroText = esc(s.headline ?? 'Why?');
  const leadText = esc(s.body ?? '');
  const footerText = esc(s.supporting ?? 'Three of them are next.');
  const eyebrow = s.pill ? esc(s.pill) : '02 &middot; Preface';
  const activeClass = isActive ? ' active' : '';

  return `<!-- SLIDE 2 — Intro (NAVY top + CREAM bottom) -->
<section class="slide cream s2${activeClass}" id="slide-2">
  <div class="lay" style="flex-direction:column;">
    <div class="navy" style="flex:0.55; display:flex; align-items:center; justify-content:center;">
      <div class="lay" style="align-items:center; justify-content:center;">
        <div style="font-weight:900; font-size:360px; line-height:0.85; letter-spacing:-0.05em; text-transform:uppercase; color:var(--cream);">${heroText}</div>
      </div>
    </div>
    <div style="flex:0.45; display:flex; flex-direction:column; justify-content:space-between; padding:80px; color:var(--ink);">
      <div class="eb" style="color:var(--red);">${eyebrow}</div>
      <div style="font-weight:900; font-size:78px; line-height:0.95; letter-spacing:-0.035em;">${leadText}</div>
      <div class="eb-tight" style="color:var(--ink-55);">${footerText}</div>
    </div>
  </div>
</section>`;
}

// Slide 3 — Critique 01 (NAVY left 42% + CREAM right 58%, horizontal split)
// Content: s.headline + s.headline2 = verdict lines, s.body = body sentence, s.pill = eyebrow category
// s.tagline or s.footnote = action verb label for bottom counter
function buildSlide3Critique01(s: Slide, isActive: boolean): string {
  const eyebrow = s.pill ? esc(s.pill) : 'Navigation';
  const line1 = s.headline ? applyAccent(s.headline) : '';
  const line2 = s.headline2 ? applyAccent(s.headline2) : '';
  const bodyText = esc(s.body ?? '');
  const actionVerb = s.tagline ? esc(s.tagline) : 'Cut to five';
  const activeClass = isActive ? ' active' : '';

  return `<!-- SLIDE 3 — Critique 01 (NAVY left + CREAM right) -->
<section class="slide cream s3${activeClass}" id="slide-3">
  <div class="lay">
    <div class="navy" style="flex:0.42; display:flex; align-items:center; justify-content:center;">
      <div class="lay" style="align-items:center; justify-content:center;">
        <div class="crit-num" style="font-size:620px;">01</div>
      </div>
    </div>
    <div style="flex:0.58; display:flex; flex-direction:column; justify-content:space-between; padding:72px;">
      <div class="eb" style="color:var(--red);">${eyebrow}</div>
      <div>
        <div class="crit-hd" style="font-size:92px;">
          ${line1 ? `<div>${line1}</div>` : ''}
          ${line2 ? `<div>${line2}</div>` : ''}
        </div>
        ${bodyText ? `<div class="crit-body" style="margin-top:32px; max-width:480px;">${bodyText}</div>` : ''}
      </div>
      <div class="eb-tight" style="color:var(--ink-55);">${actionVerb} &middot; 03 / 07</div>
    </div>
  </div>
</section>`;
}

// Slide 4 — Critique 02 (RED left 58% + CREAM right 42%, horizontal split — mirror of s3)
// s4 accent rule: final headline line uses --navy on red background (not --red)
// Content: s.headline + s.headline2 = verdict lines on red, s.body = body, s.pill = eyebrow
// s.tagline = action verb label for bottom counter
function buildSlide4Critique02(s: Slide, isActive: boolean): string {
  const eyebrow = s.pill ? esc(s.pill) : 'Call to action';
  const line1 = esc(s.headline ?? '');
  const line2 = s.headline2 ? esc(s.headline2) : '';
  // headline3 carries the final accented line (navy on red)
  const line3 = s.headline3 ? esc(s.headline3) : '';
  const bodyText = esc(s.body ?? '');
  const actionVerb = s.tagline ? esc(s.tagline) : 'Name the act';
  const activeClass = isActive ? ' active' : '';

  return `<!-- SLIDE 4 — Critique 02 (RED left + CREAM right) -->
<section class="slide red s4${activeClass}" id="slide-4">
  <div class="lay">
    <div style="flex:0.58; display:flex; flex-direction:column; justify-content:space-between; padding:72px; color:var(--cream);">
      <div class="eb" style="color:var(--cream-85);">${eyebrow}</div>
      <div>
        <div style="font-weight:900; font-size:96px; line-height:0.9; letter-spacing:-0.04em; text-transform:uppercase;">
          ${line1 ? `<div>${line1}</div>` : ''}
          ${line2 ? `<div>${line2}</div>` : ''}
          ${line3 ? `<div style="color:var(--navy);">${line3}</div>` : ''}
        </div>
        ${bodyText ? `<div class="body-24" style="margin-top:32px; color:var(--cream-85); max-width:480px;">${bodyText}</div>` : ''}
      </div>
      <div class="eb-tight" style="color:var(--cream-85);">${actionVerb} &middot; 04 / 07</div>
    </div>
    <div style="flex:0.42; background:var(--cream); display:flex; align-items:center; justify-content:center; color:var(--navy); overflow:hidden;">
      <div style="font-weight:900; font-size:340px; line-height:0.82; letter-spacing:-0.06em; white-space:nowrap;">02</div>
    </div>
  </div>
</section>`;
}

// Slide 5 — Critique 03 (NAVY top 45% + CREAM bottom 55%, vertical split — mirror axis of s2)
// Content: s.headline + s.headline2 = verdict lines, s.body = body, s.pill = eyebrow category
// s.tagline = action verb label for bottom counter
function buildSlide5Critique03(s: Slide, isActive: boolean): string {
  const eyebrow = s.pill ? esc(s.pill) : 'Modal depth';
  const line1 = s.headline ? applyAccent(s.headline) : '';
  const line2 = s.headline2 ? applyAccent(s.headline2) : '';
  const bodyText = esc(s.body ?? '');
  const actionVerb = s.tagline ? esc(s.tagline) : 'One layer, always';
  const activeClass = isActive ? ' active' : '';

  return `<!-- SLIDE 5 — Critique 03 (NAVY top + CREAM bottom) -->
<section class="slide cream s5${activeClass}" id="slide-5">
  <div class="lay" style="flex-direction:column;">
    <div class="navy" style="flex:0.45; display:flex; align-items:center; justify-content:center;">
      <div class="lay" style="align-items:center; justify-content:center;">
        <div class="crit-num" style="font-size:480px;">03</div>
      </div>
    </div>
    <div style="flex:0.55; display:flex; flex-direction:column; justify-content:space-between; padding:72px; color:var(--ink);">
      <div class="eb" style="color:var(--red);">${eyebrow}</div>
      <div>
        <div class="crit-hd" style="font-size:92px;">
          ${line1 ? `<div>${line1}</div>` : ''}
          ${line2 ? `<div>${line2}</div>` : ''}
        </div>
        ${bodyText ? `<div class="crit-body" style="margin-top:32px; max-width:680px;">${bodyText}</div>` : ''}
      </div>
      <div class="eb-tight" style="color:var(--ink-55);">${actionVerb} &middot; 05 / 07</div>
    </div>
  </div>
</section>`;
}

// Slide 6 — Principle (NAVY full slide, centered single-word hero with red period)
// Content: s.headline = principle word/phrase (one word ideally), period in red is appended
// Top-left: "Principle · 06" eyebrow. Bottom-right: "Always." in red.
function buildSlide6Principle(s: Slide, isActive: boolean): string {
  // Strip trailing period from headline if present — we render it in red ourselves
  const raw = s.headline ?? 'Less';
  const stripped = raw.endsWith('.') ? raw.slice(0, -1) : raw;
  const heroText = esc(stripped);
  const bottomLabel = s.tagline ? esc(s.tagline) : 'Always.';
  const activeClass = isActive ? ' active' : '';

  return `<!-- SLIDE 6 — Principle (NAVY full) -->
<section class="slide navy s6${activeClass}" id="slide-6">
  <div class="lay" style="align-items:center; justify-content:center;">
    <div class="eb" style="position:absolute; top:80px; left:80px; color:var(--cream-55); z-index:3;">Principle &middot; 06</div>
    <div class="eb" style="position:absolute; bottom:80px; right:80px; color:var(--red); z-index:3;">${bottomLabel}</div>
    <div style="font-weight:900; font-size:380px; line-height:0.85; letter-spacing:-0.05em; text-transform:uppercase; color:var(--cream); text-align:center; z-index:2;">${heroText}<span style="color:var(--red);">.</span></div>
  </div>
</section>`;
}

// Slide 7 — CTA (RED full slide, centered giant arrow, hero footer-left)
// Content: hardcoded "→" arrow. s.tagline or meta.handle for closing hero text.
// Two-line hero comes from splitting s.headline on " / " if provided, else defaults to "Share / this."
function buildSlide7CTA(s: Slide, isActive: boolean, meta: CarouselMeta): string {
  const handle = formatHandle(meta.handle);
  // CTA hero: use s.headline split by " / " if provided, else "Share / this."
  const rawCTA = s.headline ?? 'Share / this.';
  const ctaLines = rawCTA.split(' / ').map(seg => `<div>${esc(seg.trim())}</div>`).join('\n        ');
  const activeClass = isActive ? ' active' : '';

  return `<!-- SLIDE 7 — CTA (RED) -->
<section class="slide red s7${activeClass}" id="slide-7">
  <div class="lay" style="flex-direction:column;">
    <div style="display:flex; align-items:baseline; justify-content:space-between; padding:72px 72px 0 72px;">
      <div class="eb-tight" style="color:var(--cream-85);">Postscript</div>
      <div class="eb-tight" style="color:var(--cream-85);">07 of 07</div>
    </div>
    <div style="flex:1; display:flex; align-items:center; justify-content:center;">
      <div style="font-weight:900; font-size:700px; line-height:0.78; letter-spacing:-0.06em; color:var(--cream);">&#8594;</div>
    </div>
    <div style="padding:0 72px 72px 72px; display:flex; align-items:flex-end; justify-content:space-between;">
      <div style="font-weight:900; font-size:92px; line-height:0.9; letter-spacing:-0.04em; text-transform:uppercase; color:var(--cream);">
        ${ctaLines}
      </div>
      <div class="eb" style="color:var(--cream-85); padding-bottom:12px;">${esc(handle)}</div>
    </div>
  </div>
</section>`;
}

/**
 * buildZurichHTML — renders all 7 slides of the figr-H Color Blocks template.
 *
 * Slide index to content field mapping:
 *   index 0 (Cover):        s.pill = issue label, s.headline = 4-line title stack (split on " / ")
 *   index 1 (Intro):        s.headline = hero question/word, s.body = lead sentence, s.supporting = footer label, s.pill = eyebrow
 *   index 2 (Critique 01):  s.pill = category, s.headline + s.headline2 = verdict lines, s.body = body, s.tagline = action verb
 *   index 3 (Critique 02):  s.pill = category, s.headline + s.headline2 + s.headline3 = verdict lines (headline3 in navy), s.body = body, s.tagline = action verb
 *   index 4 (Critique 03):  s.pill = category, s.headline + s.headline2 = verdict lines, s.body = body, s.tagline = action verb
 *   index 5 (Principle):    s.headline = principle word (period auto-appended in red), s.tagline = bottom-right label
 *   index 6 (CTA):          s.headline = 2-line hero (split on " / "), meta.handle = brand handle
 *
 * The ~ prefix on any headline field renders that text in --red (accent treatment).
 * No em dashes are used anywhere in this template.
 */
export function buildZurichHTML(slides: Slide[], meta: CarouselMeta): string {
  const TOTAL = 7;

  // Always operate on exactly 7 slides; pad or trim to match the locked structure
  const normalised = slides.slice(0, TOTAL);
  while (normalised.length < TOTAL) {
    const placeholder: Slide = {
      id: normalised.length + 1,
      type: 'insight',
      headline: '',
    };
    normalised.push(placeholder);
  }

  const [s1, s2, s3, s4, s5, s6, s7] = normalised;

  const slidesHTML = [
    buildSlide1Cover(s1, true),
    buildSlide2Intro(s2, false),
    buildSlide3Critique01(s3, false),
    buildSlide4Critique02(s4, false),
    buildSlide5Critique03(s5, false),
    buildSlide6Principle(s6, false),
    buildSlide7CTA(s7, false, meta),
  ].join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <title>Template H — ${esc(meta.topic)} | figr.design</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${slidesHTML}
</body>
</html>`;
}
