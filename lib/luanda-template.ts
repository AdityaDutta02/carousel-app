import type { Slide, CarouselMeta } from './types';

// Luanda — figr-b Brutalist Stack template
// Palette: ink #0A0A0A / yolk #F5E614 / flare #FF3D00
// Font: Inter 900 throughout — oversized heroes, thick black borders, UI mockup panels
// Slide rhythm: Cover(dk) → Intro(yl) → Critique01(yl+8px) → Critique02(yl+8px) → Critique03(yl+8px) → Principle(dk) → CTA(yl+10px)
// Rule U1: dark cover preserved as template signature (zine identity); yellow CTA passes via luminance exception
// Rule U2: Cover + Principle use 3-stop radial gradient + grain overlay + yolk glow blob
// Rule U3: all labels, counters, eyebrows at minimum 18px

const CSS = `
:root {
  --ink:#0A0A0A; --yolk:#F5E614; --flare:#FF3D00; --panel:#FFFFFF;
  --grey-1:#E5E5E5; --grey-2:#EFEFEF;
  --ink-55:rgba(10,10,10,0.55); --ink-40:rgba(10,10,10,0.40);
  --ink-25:rgba(10,10,10,0.25); --ink-20:rgba(10,10,10,0.20);
  --yolk-70:rgba(245,230,20,0.70); --yolk-55:rgba(245,230,20,0.55);
}
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:1080px; font-family:'Inter',system-ui,-apple-system,sans-serif; -webkit-font-smoothing:antialiased; }

.slide { width:1080px; height:1350px; position:relative; overflow:hidden; color:var(--ink); display:none; }
.slide.active { display:flex; flex-direction:column; }

/* DARK SLIDES — Cover, Principle (Rule U2) */
.dk {
  color:var(--yolk);
  background:
    radial-gradient(ellipse 130% 90% at 30% 22%, rgba(245,230,20,0.06) 0%, transparent 55%),
    radial-gradient(ellipse 110% 70% at 70% 70%, #1A1A1A 0%, #0A0A0A 60%, #050505 100%);
}
.dk::before {
  content:""; position:absolute; inset:0; pointer-events:none; z-index:1;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.96  0 0 0 0 0.90  0 0 0 0 0.12  0 0 0 0.22 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  mix-blend-mode:overlay; opacity:0.22;
}

/* YELLOW SLIDES — Intro, Critiques, CTA */
.yl { background:var(--yolk); color:var(--ink); }

/* Critique outer border (s3-s5) */
.bd-8  { border:8px solid var(--ink); }
/* CTA outer border (s7) */
.bd-10 { border:10px solid var(--ink); }

/* Padding wrappers */
.pad      { padding:80px; flex:1; display:flex; flex-direction:column; justify-content:space-between; position:relative; z-index:2; }
.pad-crit { padding:72px; flex:1; display:flex; flex-direction:column; gap:40px; position:relative; z-index:2; }

/* Row helpers */
.row-top { display:flex; align-items:baseline; justify-content:space-between; }

/* Eyebrows (Rule U3: min 18px) */
.eb     { font-weight:800; font-size:18px; letter-spacing:0.22em; text-transform:uppercase; }
.eb-22  { font-weight:800; font-size:22px; letter-spacing:0.22em; text-transform:uppercase; }
.eb-tight { font-weight:700; font-size:18px; letter-spacing:0.22em; text-transform:uppercase; }
.counter  { font-weight:700; font-size:18px; letter-spacing:0.22em; text-transform:uppercase; opacity:0.55; }

/* Hero type */
.hero  { font-weight:900; text-transform:uppercase; letter-spacing:-0.045em; }
.h180  { font-size:180px; line-height:0.92; }
.h200  { font-size:170px; line-height:0.92; white-space:nowrap; }
.h185  { font-size:185px; line-height:0.90; }
.h150  { font-size:150px; line-height:0.92; }
.h88   { font-size:88px;  line-height:0.88; letter-spacing:-0.04em; font-weight:900; text-transform:uppercase; }
.h-num { font-size:200px; line-height:0.78; letter-spacing:-0.06em; font-weight:900; }
.flare { color:var(--flare); }

/* Body */
.body-30 { font-weight:500; font-size:30px; line-height:1.4; max-width:820px; }
.body-26 { font-weight:500; font-size:26px; line-height:1.4; max-width:620px; }
.body-24 { font-weight:500; font-size:24px; line-height:1.5; max-width:720px; }
.body-22 { font-weight:500; font-size:22px; line-height:1.4; max-width:800px; }

/* Underline accent on Intro */
.ul-flare {
  font-weight:900;
  text-decoration:underline;
  text-decoration-color:var(--flare);
  text-decoration-thickness:6px;
  text-underline-offset:6px;
}

/* Bars */
.bar-yolk      { width:44px; height:4px; background:var(--yolk); }
.bar-yolk-tall { width:64px; height:5px; background:var(--yolk); }
.bar-ink       { width:60px; height:5px; background:var(--ink);  }
.bar-ink-tall  { width:50px; height:5px; background:var(--ink);  }

/* Mockup panel */
.mock       { background:var(--panel); border:5px solid var(--ink); flex:1; position:relative; padding:36px; display:flex; flex-direction:column; }
.mock-form  { padding:48px; align-items:center; justify-content:center; }
.mock-modal { padding:32px; align-items:center; justify-content:center; }

/* Corner X badge */
.x-badge { position:absolute; top:-7px; right:-7px; background:var(--yolk); border:5px solid var(--ink); padding:8px; line-height:0; }

/* CTA pill */
.cta-pill { background:var(--ink); color:var(--yolk); padding:20px 36px; font-weight:900; font-size:28px; letter-spacing:0.12em; text-transform:uppercase; display:inline-block; }

/* Grey placeholder bars */
.gb1 { background:var(--grey-1); }
.gb2 { background:var(--grey-2); }
`;

// X badge SVG — flare orange, stroke-width 5
const X_BADGE_SVG = `<div class="x-badge"><svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#FF3D00" stroke-width="5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></div>`;

// Inline X SVG — flare orange, 48px, stroke-width 5
const X_INLINE_SVG = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF3D00" stroke-width="5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Splits a headline at the ~ prefix — text after ~ gets wrapped in a flare span
function applyAccent(text: string): string {
  const idx = text.indexOf('~');
  if (idx === -1) return esc(text);
  const before = text.slice(0, idx);
  const after = text.slice(idx + 1);
  return `${esc(before)}<span class="flare">${esc(after)}</span>`;
}

// Breaks a headline into individual lines split at " / " for stacked heroes
// Returns array of processed line strings (with accent applied)
function heroLines(headline: string): string[] {
  return headline
    .split(/\s*\/\s*/)
    .map(line => applyAccent(line));
}

// Wraps hero lines in <div> elements for stacking
function stackedHero(headline: string): string {
  return heroLines(headline)
    .map(line => `<div>${line}</div>`)
    .join('\n      ');
}

// Nav / Fail mockup — over-stuffed navigation bar
function mockupNav(): string {
  return `<div class="mock">
      <div style="display:flex; align-items:center; gap:20px; border-bottom:3px solid var(--ink); padding-bottom:20px;">
        <div style="width:90px; height:24px; background:var(--ink); flex-shrink:0;"></div>
        <div style="display:flex; align-items:center; gap:12px; font-weight:800; font-size:18px; letter-spacing:0.04em; text-transform:uppercase; white-space:nowrap; overflow:hidden;">
          <span>Dashboard</span><span>Projects</span><span>Calendar</span><span>Inbox</span>
          <span>Reports</span><span>Goals</span><span>Team</span><span>Billing</span><span>Settings</span>
        </div>
      </div>
      <div style="margin-top:36px; display:flex; gap:24px; flex:1;">
        <div style="width:200px; display:flex; flex-direction:column; gap:16px;">
          <div class="gb1" style="height:16px;"></div>
          <div class="gb1" style="height:16px; width:75%;"></div>
          <div class="gb1" style="height:16px; width:66%;"></div>
          <div class="gb1" style="height:16px; width:50%;"></div>
          <div class="gb1" style="height:16px; width:60%;"></div>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; gap:16px;">
          <div style="height:28px; background:var(--ink); width:50%;"></div>
          <div class="gb2" style="height:12px;"></div>
          <div class="gb2" style="height:12px; width:83%;"></div>
          <div class="gb2" style="height:12px; width:75%;"></div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-top:12px; flex:1;">
            <div class="gb2"></div><div class="gb2"></div><div class="gb2"></div>
          </div>
        </div>
      </div>
      ${X_BADGE_SVG}
    </div>`;
}

// Button / Fail mockup — form with generic Submit CTA
function mockupButton(): string {
  return `<div class="mock mock-form">
      <div style="width:640px; display:flex; flex-direction:column; gap:28px;">
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="height:16px; background:var(--ink); width:30%;"></div>
          <div style="height:56px; border:3px solid var(--ink); background:var(--panel);"></div>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="height:16px; background:var(--ink); width:22%;"></div>
          <div style="height:56px; border:3px solid var(--ink); background:var(--panel);"></div>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="height:16px; background:var(--ink); width:36%;"></div>
          <div style="height:56px; border:3px solid var(--ink); background:var(--panel);"></div>
        </div>
        <div style="margin-top:24px; display:flex; align-items:center; justify-content:space-between;">
          <div style="font-weight:700; font-size:18px; letter-spacing:0.16em; color:var(--ink-40); text-transform:uppercase;">STEP 3 OF 3</div>
          <div style="display:flex; align-items:center; gap:20px;">
            ${X_INLINE_SVG}
            <div style="background:var(--ink); color:var(--yolk); padding:16px 32px; font-weight:900; font-size:17px; letter-spacing:0.18em;">SUBMIT</div>
          </div>
        </div>
      </div>
    </div>`;
}

// Modal / Fail mockup — modal opens another modal
function mockupModal(): string {
  return `<div class="mock mock-modal">
      <div style="position:absolute; inset:32px; display:flex; flex-direction:column; gap:12px; padding:24px; opacity:0.30;">
        <div style="height:16px; background:var(--ink); width:33%;"></div>
        <div style="height:12px; background:var(--ink-40);"></div>
        <div style="height:12px; background:var(--ink-40); width:83%;"></div>
        <div style="height:12px; background:var(--ink-40); width:66%;"></div>
      </div>
      <div style="position:absolute; inset:0; background:var(--ink-25);"></div>
      <div style="position:relative; background:var(--panel); border:5px solid var(--ink); width:78%; height:80%; display:flex; align-items:center; justify-content:center; padding:24px;">
        <div style="position:absolute; top:16px; left:24px; font-weight:800; font-size:18px; letter-spacing:0.2em;">EDIT ITEM</div>
        <div style="position:absolute; top:16px; right:20px; width:24px; height:24px; border:3px solid var(--ink);"></div>
        <div style="position:absolute; inset:0; background:var(--ink-20);"></div>
        <div style="position:relative; background:var(--yolk); border:5px solid var(--ink); width:72%; height:72%; display:flex; align-items:center; justify-content:center; padding:20px;">
          <div style="position:absolute; top:12px; left:20px; font-weight:800; font-size:18px; letter-spacing:0.2em;">CONFIRM CHANGE</div>
          <div style="position:absolute; top:12px; right:16px; width:20px; height:20px; border:3px solid var(--ink);"></div>
          <div style="background:var(--panel); border:4px solid var(--ink); width:78%; height:70%; display:flex; flex-direction:column; padding:20px; gap:12px;">
            <div style="font-weight:800; font-size:18px; letter-spacing:0.18em;">ARE YOU SURE?</div>
            <div class="gb1" style="height:10px;"></div>
            <div class="gb1" style="height:10px; width:80%;"></div>
            <div style="margin-top:auto; align-self:flex-end; display:flex; gap:12px;">
              <div style="height:32px; width:80px; border:3px solid var(--ink); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:18px;">CANCEL</div>
              <div style="height:32px; width:80px; background:var(--ink); color:var(--yolk); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:18px;">YES</div>
            </div>
          </div>
        </div>
      </div>
      ${X_BADGE_SVG}
    </div>`;
}

// Selects mockup type by critique index (0-based among critiques: 0=nav, 1=button, 2=modal)
function selectMockup(critiqueIndex: number): string {
  const mockups = [mockupNav, mockupButton, mockupModal];
  const fn = mockups[critiqueIndex % mockups.length];
  return fn();
}

// Slide 0 — Cover (dark)
// headline: 5-line stacked hero (split at " / ")
// Uses meta.pageName for vol number if extractable
function buildCover(s: Slide, isFirst: boolean, meta: CarouselMeta): string {
  const volLabel = s.pill ?? `VOL · 01`;
  // Split headline into up to 5 lines; last line gets flare period if not already ending in .
  const lines = s.headline.split(/\s*\/\s*/);
  // Ensure last line ends with flare period
  const lastRaw = lines[lines.length - 1] ?? '';
  const lastLine = lastRaw.endsWith('.')
    ? `${esc(lastRaw.slice(0, -1))}<span class="flare">.</span>`
    : `${esc(lastRaw)}<span class="flare">.</span>`;
  const middleLines = lines.slice(0, -1).map(l => `<div>${esc(l)}</div>`).join('\n      ');

  return `<section class="slide dk${isFirst ? ' active' : ''}" id="slide-0">
  <div class="pad">
    <div class="row-top">
      <div class="eb">[ ${esc(volLabel)} ]</div>
      <div class="eb-tight" style="color:var(--yolk-70);">A FIGR FIELD GUIDE</div>
    </div>
    <div class="hero h180">
      ${middleLines}
      <div>${lastLine}</div>
    </div>
    <div class="row-top" style="align-items:center;">
      <div class="eb" style="font-size:26px; letter-spacing:0.24em;">&#x21B3; SWIPE</div>
      <div style="display:flex; align-items:center; gap:12px;">
        <div class="bar-yolk"></div>
        <div class="eb">@FIGR.DESIGN</div>
      </div>
    </div>
  </div>
</section>`;
}

// Slide 1 — Intro (yellow)
// headline: 2-line hero (split at " / "), body: audit framing sentence
// One phrase in body can be wrapped with ~phrase~ for orange underline
function buildIntro(s: Slide, isFirst: boolean): string {
  const critCount = 3;
  // Parse headline lines
  const lines = s.headline.split(/\s*\/\s*/);
  const line1 = lines[0] ?? s.headline;
  const line2 = (lines[1] ?? '') + ' →';

  // Build body with underline accent — wrap first ~...~ in ul-flare span
  const rawBody = s.body ?? 'We audited design patterns this year. Here\'s what hurt to look at.';
  const bodyHtml = rawBody.replace(/~([^~]+)~/g, (_, inner: string) =>
    `<span class="ul-flare">${esc(inner)}</span>`
  );

  return `<section class="slide yl${isFirst ? ' active' : ''}" id="slide-1">
  <div class="pad">
    <div class="row-top">
      <div class="eb-22">INTRO / 02</div>
      <div class="eb-tight" style="color:var(--ink-55);">${critCount} CRITIQUES INCOMING</div>
    </div>
    <div class="hero h200">
      <div>${esc(line1)}</div>
      <div>${esc(line2)}</div>
    </div>
    <div>
      <div class="body-30">${bodyHtml}</div>
      <div style="margin-top:40px; display:flex; align-items:center; gap:16px;">
        <div class="bar-ink"></div>
        <div class="eb">KEEP SCROLLING</div>
      </div>
    </div>
  </div>
</section>`;
}

// Slides 2-4 — Critique (yellow + 8px border)
// critiqueIndex: 0, 1, 2 (maps to 01, 02, 03)
// slideNumber: 3, 4, 5 (for counter "03 / 07")
function buildCritique(
  s: Slide,
  slideIndex: number,
  critiqueIndex: number,
  isFirst: boolean,
): string {
  const num = String(critiqueIndex + 1).padStart(2, '0');
  const slideNum = String(slideIndex + 1).padStart(2, '0');

  // Derive category label from headline or pill
  const category = s.pill ?? `CRITIQUE ${num}`;

  // Headline split into 2 lines
  const hlines = s.headline.split(/\s*\/\s*/);
  const hLine1 = hlines[0] ?? s.headline;
  const hLine2 = hlines[1] ?? '';
  const headlineHtml = hLine2
    ? `${applyAccent(hLine1)}<br>${applyAccent(hLine2)}`
    : applyAccent(hLine1);

  // Verdict body — first bold phrase before ". " or "," prefix
  const rawBody = s.body ?? 'Fix this now.';
  const boldMatch = rawBody.match(/^([^.]+\.)\s*([\s\S]*)/);
  const verdictHtml = boldMatch
    ? `<span style="font-weight:900;">${esc(boldMatch[1])}</span> ${esc(boldMatch[2])}`
    : `<span style="font-weight:900;">${esc(rawBody)}</span>`;

  const mockup = selectMockup(critiqueIndex);

  return `<section class="slide yl bd-8${isFirst ? ' active' : ''}" id="slide-${slideIndex}">
  <div class="pad-crit">
    <div class="row-top" style="align-items:flex-start;">
      <div style="display:flex; align-items:baseline; gap:28px;">
        <div class="h-num">${num}</div>
        <div>
          <div class="eb-22">${esc(category)}</div>
          <div class="eb-tight" style="margin-top:8px; color:var(--ink-55); letter-spacing:0.2em;">CRITIQUE ${num} / 03</div>
        </div>
      </div>
      <div class="counter" style="padding-top:12px;">${slideNum} / 07</div>
    </div>
    <div class="h88">${headlineHtml}</div>
    ${mockup}
    <div class="body-22">${verdictHtml}</div>
  </div>
</section>`;
}

// Slide 5 — Principle (dark)
// headline: 4-line stacked hero; last line entirely in flare
function buildPrinciple(s: Slide, slideIndex: number, isFirst: boolean): string {
  const lines = s.headline.split(/\s*\/\s*/);
  // Last line in flare, rest in yolk
  const lastRaw = lines[lines.length - 1] ?? '';
  const lastLine = `<div class="flare">${esc(lastRaw)}</div>`;
  const middleLines = lines.slice(0, -1)
    .map(l => `<div>${esc(l)}</div>`)
    .join('\n      ');

  const bodyText = s.body ?? 'Good design removes the comfort of the familiar. The friction is the feature.';
  const slideNum = String(slideIndex + 1).padStart(2, '0');

  return `<section class="slide dk${isFirst ? ' active' : ''}" id="slide-${slideIndex}">
  <div class="pad">
    <div class="row-top">
      <div class="eb-22">PRINCIPLE / ${slideNum}</div>
      <div class="eb-tight" style="color:var(--yolk-55);">THE TAKEAWAY</div>
    </div>
    <div class="hero h185">
      ${middleLines}
      ${lastLine}
    </div>
    <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:40px;">
      <div style="max-width:620px;">
        <div class="bar-yolk-tall" style="margin-bottom:24px;"></div>
        <div class="body-26" style="color:var(--yolk);">${esc(bodyText)}</div>
      </div>
      <div class="counter" style="color:var(--yolk-55); white-space:nowrap; padding-bottom:4px; opacity:1;">${slideNum} / 07</div>
    </div>
  </div>
</section>`;
}

// Slide 6 — CTA (yellow + 10px border)
// tagline or fallback 4-line CTA hero; flare period on last line
function buildCTA(s: Slide, slideIndex: number, isFirst: boolean, meta: CarouselMeta): string {
  const ctaText = s.tagline ?? meta.pageName;
  // Build 4-line hero: use tagline split or default
  const ctaLines = ctaText.includes('/')
    ? ctaText.split(/\s*\/\s*/)
    : ['&#x21B3; Tag a', 'Designer', 'Who needs', 'This'];

  const lastRaw = ctaLines[ctaLines.length - 1] ?? 'This';
  const lastLineHtml = lastRaw.endsWith('.')
    ? `<div>${esc(lastRaw.slice(0, -1))}<span class="flare">.</span></div>`
    : `<div>${esc(lastRaw)}<span class="flare">.</span></div>`;
  const middleCtaLines = ctaLines.slice(0, -1)
    .map(l => `<div>${esc(l)}</div>`)
    .join('\n      ');

  const bodyText = s.body ?? 'Save it. Share it. Send it to the designer who needs to hear this.';
  const slideNum = String(slideIndex + 1).padStart(2, '0');

  return `<section class="slide yl bd-10${isFirst ? ' active' : ''}" id="slide-${slideIndex}">
  <div class="pad">
    <div class="row-top">
      <div class="eb-22">END / ${slideNum}</div>
      <div class="eb-tight" style="color:var(--ink-55);">YOUR TURN</div>
    </div>
    <div class="hero h150">
      ${middleCtaLines}
      ${lastLineHtml}
    </div>
    <div>
      <div class="body-24" style="margin-bottom:40px;">${esc(bodyText)}</div>
      <div style="display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap;">
        <div class="cta-pill">@FIGR.DESIGN</div>
        <div style="display:flex; align-items:center; gap:16px;">
          <div class="bar-ink-tall"></div>
          <div class="eb">&#x21BB; FOLLOW FOR MORE</div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

// Main export — builds a locked 7-slide Luanda carousel
// Expects exactly 7 slides: [cover, intro, critique01, critique02, critique03, principle, cta]
// If fewer slides are provided, fallback slots use empty placeholders
export function buildLuandaHTML(slides: Slide[], meta: CarouselMeta): string {
  // Pad slides array to 7 with minimal fallbacks so the template never crashes
  const padded = [...slides];
  while (padded.length < 7) {
    padded.push({
      id: padded.length,
      type: 'hook',
      headline: 'DESIGN / FAILS / DAILY',
    });
  }

  const [s0, s1, s2, s3, s4, s5, s6] = padded;

  const slideHtml = [
    buildCover(s0, true, meta),
    buildIntro(s1, false),
    buildCritique(s2, 2, 0, false),
    buildCritique(s3, 3, 1, false),
    buildCritique(s4, 4, 2, false),
    buildPrinciple(s5, 5, false),
    buildCTA(s6, 6, false, meta),
  ].join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <title>${esc(meta.topic)} | figr.design</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${slideHtml}
</body>
</html>`;
}
