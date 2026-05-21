import type { Slide, CarouselMeta } from './types';

// Cartagena — figr-f Color Sequence template
// Seven full-bleed hues cycling through 7 locked slides — pure typography editorial poster
// Palette cycle: aubergine → cream → terracotta → sage → ochre → navy → cream
// Rule U1: CTA (s7) is cream (lightest token); aubergine cover preserved as template signature
// Rule U2: aubergine (s1), sage (s4), navy (s6) — 3-stop radial gradient + grain + accent glow
// Rule U3: all eyebrow/counter/label tokens at minimum 18px
// No splits, no borders, no mockups, no numerals, no icons — one color field, two rails, one hero

const CSS = `
:root {
  --cream:#F2EDE3;
  --aubergine:#2C1F2D;
  --terracotta:#BE4A2F;
  --sage:#5F6B4F;
  --ochre:#C99848;
  --navy:#1B2840;
  --ink:#1A1A1C;
  --cream-55:rgba(242,237,227,0.55);
  --ink-55:rgba(26,26,28,0.55);
}
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:1080px; font-family:'Inter',system-ui,-apple-system,sans-serif; -webkit-font-smoothing:antialiased; }

.slide { width:1080px; height:1350px; position:relative; overflow:hidden; display:none; }
.slide.active { display:block; }

/* Shared padding frame — full height, flex column, 96px pad all sides */
.pad-frame {
  position:relative; z-index:2;
  width:100%; height:100%;
  padding:96px;
  display:flex; flex-direction:column;
}

/* Eyebrow / counter / label (Rule U3: min 18px) */
.eb { font-weight:700; font-size:18px; letter-spacing:0.28em; text-transform:uppercase; }

/* Hero base */
.hero { font-weight:900; letter-spacing:-0.035em; }

/* Hero region fills remaining vertical space */
.hero-area { flex:1; display:flex; }

/* Per-slide hero alignment */
.ha-end-left   { align-items:flex-end;   justify-content:flex-start; }
.ha-center     { align-items:center;     justify-content:center; }
.ha-center-r   { align-items:center;     justify-content:flex-end; }
.ha-start-left { align-items:flex-start; justify-content:flex-start; padding-top:16px; }

/* ---- Flat color fields ---- */
.cream      { background:var(--cream);      color:var(--ink); }
.terracotta { background:var(--terracotta); color:var(--cream); }
.ochre      { background:var(--ochre);      color:var(--ink); }

/* ---- Rule U2 depth treatments for dark slides ---- */
/* Aubergine (s1 Cover) — terracotta glow blob upper-third */
.aubergine {
  color:var(--cream);
  background:
    radial-gradient(ellipse 90% 70% at 30% 25%, rgba(190,74,47,0.10) 0%, transparent 60%),
    radial-gradient(ellipse 130% 110% at 70% 75%, #3A2A3B 0%, #2C1F2D 55%, #1E1320 100%);
  position:relative;
}
/* Sage (s4 Critique 02) — cream glow blob */
.sage {
  color:var(--cream);
  background:
    radial-gradient(ellipse 100% 70% at 80% 20%, rgba(242,237,227,0.06) 0%, transparent 55%),
    radial-gradient(ellipse 130% 110% at 30% 80%, #6E7A5E 0%, #5F6B4F 55%, #4B563E 100%);
  position:relative;
}
/* Navy (s6 Principle) — terracotta glow blob */
.navy {
  color:var(--cream);
  background:
    radial-gradient(ellipse 110% 80% at 30% 22%, rgba(190,74,47,0.08) 0%, transparent 55%),
    radial-gradient(ellipse 130% 100% at 70% 80%, #243056 0%, #1B2840 55%, #131A32 100%);
  position:relative;
}
/* SVG turbulence grain on all three dark slides */
.aubergine::before,
.sage::before,
.navy::before {
  content:""; position:absolute; inset:0; pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.92 0 0 0 0 0.86 0 0 0 0.22 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  mix-blend-mode:overlay; opacity:0.22; z-index:1;
}

/* ---- Per-slide hero sizing (spec-locked, do not normalize) ---- */
/* s1 Cover — 178px, ALL CAPS, bottom-left */
.h-cover     { font-size:178px; line-height:0.88; letter-spacing:-0.045em; text-transform:uppercase; }
/* s2 Intro — 108px, sentence-case, centered */
.h-intro     { font-size:108px; line-height:0.95; }
/* s3 Critique 01 — 168px, right-aligned, nowrap */
.h-crit-r    { font-size:168px; line-height:0.92; text-align:right; white-space:nowrap; }
/* s4 Critique 02 — 200px, left-aligned, bottom */
.h-crit-bl   { font-size:200px; line-height:0.90; text-align:left; }
/* s5 Critique 03 — 172px, centered */
.h-crit-c    { font-size:172px; line-height:0.95; text-align:center; }
/* s6 Principle — 190px, ALL CAPS, top-aligned */
.h-principle { font-size:190px; line-height:0.90; letter-spacing:-0.045em; text-transform:uppercase; }
/* s7 CTA — 220px, bottom-left */
.h-cta       { font-size:220px; line-height:0.92; }

/* s7 terracotta tag line — only color-on-color moment in the deck */
.cta-tag { font-weight:500; font-size:26px; line-height:1.4; color:var(--terracotta); max-width:640px; margin-top:40px; }
`;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Splits headline at " / " into individual stacked <div> lines
function stackLines(headline: string): string {
  return headline
    .split(/\s*\/\s*/)
    .map(line => `<div>${esc(line)}</div>`)
    .join('\n        ');
}

// Derives an eyebrow label:
// - Prefers s.pill
// - Falls back to meta.pageName
// - For critique slides, uses the category prefix from the spec ("01 · Navigation" etc.)
function eyebrowLabel(s: Slide, fallback: string): string {
  return s.pill ?? fallback;
}

// Slide 0 — Cover (AUBERGINE, bottom-left, ALL CAPS 178px)
// Top: issue marker. Hero: 2-line stacked title. Bottom: @figr.design
function buildCover(s: Slide, isFirst: boolean, meta: CarouselMeta): string {
  const issueLabel = s.pill ?? `UI Critique · Issue 01`;

  // Hero: use headline + headline2 for 2 lines; or split headline at " / "
  let heroHtml: string;
  if (s.headline2) {
    heroHtml = `<div>${esc(s.headline)}</div>\n        <div>${esc(s.headline2)}</div>`;
  } else {
    heroHtml = stackLines(s.headline);
  }

  return `<section class="slide aubergine${isFirst ? ' active' : ''}" id="slide-0">
  <div class="pad-frame">
    <div class="eb" style="opacity:0.55;">${esc(issueLabel)}</div>
    <div class="hero-area ha-end-left">
      <div class="hero h-cover">
        ${heroHtml}
      </div>
    </div>
    <div class="eb" style="opacity:0.55;">@figr.design</div>
  </div>
</section>`;
}

// Slide 1 — Intro (CREAM, centered, 108px)
// Top: "Preface". Hero: 4-line sentence-case preface. Bottom: "02 of 07"
function buildIntro(s: Slide, isFirst: boolean): string {
  // Build hero lines from headline + headline2/headline3 or split at " / "
  let heroHtml: string;
  if (s.headline.includes('/')) {
    heroHtml = stackLines(s.headline);
  } else if (s.headline2) {
    const lines = [s.headline, s.headline2, s.headline3].filter(Boolean) as string[];
    heroHtml = lines.map(l => `<div>${esc(l)}</div>`).join('\n        ');
  } else {
    heroHtml = `<div>${esc(s.headline)}</div>`;
  }

  const topLabel = eyebrowLabel(s, 'Preface');

  return `<section class="slide cream${isFirst ? ' active' : ''}" id="slide-1">
  <div class="pad-frame">
    <div class="eb" style="color:var(--ink-55);">${esc(topLabel)}</div>
    <div class="hero-area ha-center">
      <div class="hero h-intro">
        ${heroHtml}
      </div>
    </div>
    <div class="eb" style="color:var(--ink-55);">02 of 07</div>
  </div>
</section>`;
}

// Slide 2 — Critique 01 (TERRACOTTA, right-aligned, 168px, nowrap)
// Top: "01 · [category]". Hero: 2-line verdict right-aligned. Bottom: action verb
function buildCritique01(s: Slide, isFirst: boolean): string {
  const topLabel = eyebrowLabel(s, '01 · Navigation');
  const bottomVerb = s.supporting ?? s.footnote ?? 'Cut to five.';

  // Hero: headline + headline2 as 2 lines
  let heroHtml: string;
  if (s.headline2) {
    heroHtml = `<div>${esc(s.headline)}</div>\n        <div>${esc(s.headline2)}</div>`;
  } else {
    heroHtml = stackLines(s.headline);
  }

  return `<section class="slide terracotta${isFirst ? ' active' : ''}" id="slide-2">
  <div class="pad-frame">
    <div class="eb" style="opacity:0.55;">${esc(topLabel)}</div>
    <div class="hero-area ha-center-r">
      <div class="hero h-crit-r">
        ${heroHtml}
      </div>
    </div>
    <div class="eb" style="opacity:0.55;">${esc(bottomVerb)}</div>
  </div>
</section>`;
}

// Slide 3 — Critique 02 (SAGE, bottom-left, 200px)
// Top: "02 · [category]". Hero: 3-line verdict bottom-left. Bottom: action verb
function buildCritique02(s: Slide, isFirst: boolean): string {
  const topLabel = eyebrowLabel(s, '02 · Call to action');
  const bottomVerb = s.supporting ?? s.footnote ?? 'Name the act.';

  let heroHtml: string;
  if (s.headline2) {
    const lines = [s.headline, s.headline2, s.headline3].filter(Boolean) as string[];
    heroHtml = lines.map(l => `<div>${esc(l)}</div>`).join('\n        ');
  } else {
    heroHtml = stackLines(s.headline);
  }

  return `<section class="slide sage${isFirst ? ' active' : ''}" id="slide-3">
  <div class="pad-frame">
    <div class="eb" style="opacity:0.55;">${esc(topLabel)}</div>
    <div class="hero-area ha-end-left">
      <div class="hero h-crit-bl">
        ${heroHtml}
      </div>
    </div>
    <div class="eb" style="opacity:0.55;">${esc(bottomVerb)}</div>
  </div>
</section>`;
}

// Slide 4 — Critique 03 (OCHRE, centered, 172px, INK type)
// Ochre is too light for cream labels — must use --ink / --ink-55
// Top: "03 · [category]". Hero: 3-line verdict centered. Bottom: action verb
function buildCritique03(s: Slide, isFirst: boolean): string {
  const topLabel = eyebrowLabel(s, '03 · Modal depth');
  const bottomVerb = s.supporting ?? s.footnote ?? 'One layer, always.';

  let heroHtml: string;
  if (s.headline2) {
    const lines = [s.headline, s.headline2, s.headline3].filter(Boolean) as string[];
    heroHtml = lines.map(l => `<div>${esc(l)}</div>`).join('\n        ');
  } else {
    heroHtml = stackLines(s.headline);
  }

  return `<section class="slide ochre${isFirst ? ' active' : ''}" id="slide-4">
  <div class="pad-frame">
    <div class="eb" style="color:var(--ink-55);">${esc(topLabel)}</div>
    <div class="hero-area ha-center">
      <div class="hero h-crit-c">
        ${heroHtml}
      </div>
    </div>
    <div class="eb" style="color:var(--ink-55);">${esc(bottomVerb)}</div>
  </div>
</section>`;
}

// Slide 5 — Principle (NAVY, top-aligned, ALL CAPS 190px)
// Top: "Principle". Hero: 2-line ALL CAPS principle (single words ending in periods). Bottom: "06 of 07"
function buildPrinciple(s: Slide, isFirst: boolean): string {
  let heroHtml: string;
  if (s.headline2) {
    heroHtml = `<div>${esc(s.headline)}</div>\n        <div>${esc(s.headline2)}</div>`;
  } else {
    heroHtml = stackLines(s.headline);
  }

  return `<section class="slide navy${isFirst ? ' active' : ''}" id="slide-5">
  <div class="pad-frame">
    <div class="eb" style="opacity:0.55;">Principle</div>
    <div class="hero-area ha-start-left">
      <div class="hero h-principle">
        ${heroHtml}
      </div>
    </div>
    <div class="eb" style="opacity:0.55;">06 of 07</div>
  </div>
</section>`;
}

// Slide 6 — CTA (CREAM, bottom-left, 220px)
// Top: "Postscript". Hero: 2-line action verb + terracotta tag line. Bottom: @figr.design
// tagline used as hero if provided; otherwise defaults to "Share / this."
function buildCTA(s: Slide, isFirst: boolean, meta: CarouselMeta): string {
  // Hero lines: prefer tagline split at " / ", else default
  const heroSource = s.tagline ?? 'Share / this.';
  let heroHtml: string;
  if (heroSource.includes('/')) {
    heroHtml = stackLines(heroSource);
  } else {
    heroHtml = `<div>${esc(heroSource)}</div>`;
  }

  // Tag line — the one terracotta-on-cream moment
  const tagLine = s.body
    ?? `Follow ${meta.handle.startsWith('@') ? esc(meta.handle) : `@${esc(meta.handle)}`} for more frameworks.`;

  return `<section class="slide cream${isFirst ? ' active' : ''}" id="slide-6">
  <div class="pad-frame">
    <div class="eb" style="color:var(--ink-55);">Postscript</div>
    <div class="hero-area ha-end-left">
      <div>
        <div class="hero h-cta">
          ${heroHtml}
        </div>
        <div class="cta-tag">${esc(tagLine)}</div>
      </div>
    </div>
    <div class="eb" style="color:var(--ink-55);">@figr.design</div>
  </div>
</section>`;
}

// Main export — builds a locked 7-slide Cartagena carousel
// Color cycle is always: aubergine → cream → terracotta → sage → ochre → navy → cream
// Slide assignments are deterministic by index regardless of content
export function buildCartagenaHTML(slides: Slide[], meta: CarouselMeta): string {
  // Pad slides array to 7 with minimal fallbacks so the template never crashes
  const padded = [...slides];
  while (padded.length < 7) {
    padded.push({
      id: padded.length,
      type: 'hook',
      headline: 'Design.',
    });
  }

  const [s0, s1, s2, s3, s4, s5, s6] = padded;

  const slideHtml = [
    buildCover(s0, true, meta),
    buildIntro(s1, false),
    buildCritique01(s2, false),
    buildCritique02(s3, false),
    buildCritique03(s4, false),
    buildPrinciple(s5, false),
    buildCTA(s6, false, meta),
  ].join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <title>${esc(meta.topic)} | figr.design</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${slideHtml}
</body>
</html>`;
}
