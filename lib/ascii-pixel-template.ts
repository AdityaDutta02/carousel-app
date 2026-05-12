import type { Slide, CarouselMeta } from './types';

// ASCII/Pixel: warm beige + Space Mono, ASCII globe, pixel bot, orange accent
// Use for: AI/tech marketing, Anthropic-style, cutting-edge topics

const ORANGE = '#F7892B';

// ASCII globe SVG — wireframe sphere, dark version (for dark slides)
const ASCII_GLOBE_DARK = `<svg width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:48px;right:72px;opacity:0.22;z-index:1;pointer-events:none;" aria-hidden="true">
  <circle cx="140" cy="140" r="120" fill="none" stroke="${ORANGE}" stroke-width="1"/>
  <ellipse cx="140" cy="140" rx="80" ry="120" fill="none" stroke="${ORANGE}" stroke-width="0.8"/>
  <ellipse cx="140" cy="140" rx="40" ry="120" fill="none" stroke="${ORANGE}" stroke-width="0.6"/>
  <line x1="20" y1="140" x2="260" y2="140" stroke="${ORANGE}" stroke-width="0.7"/>
  <ellipse cx="140" cy="100" rx="105" ry="18" fill="none" stroke="${ORANGE}" stroke-width="0.5"/>
  <ellipse cx="140" cy="180" rx="105" ry="18" fill="none" stroke="${ORANGE}" stroke-width="0.5"/>
  <ellipse cx="140" cy="60" rx="70" ry="10" fill="none" stroke="${ORANGE}" stroke-width="0.4"/>
  <ellipse cx="140" cy="220" rx="70" ry="10" fill="none" stroke="${ORANGE}" stroke-width="0.4"/>
</svg>`;

// ASCII globe SVG — light version (for light slides)
const ASCII_GLOBE_LIGHT = `<svg width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:48px;right:72px;opacity:0.14;z-index:1;pointer-events:none;" aria-hidden="true">
  <circle cx="140" cy="140" r="120" fill="none" stroke="#1C1C1C" stroke-width="1"/>
  <ellipse cx="140" cy="140" rx="80" ry="120" fill="none" stroke="#1C1C1C" stroke-width="0.8"/>
  <ellipse cx="140" cy="140" rx="40" ry="120" fill="none" stroke="#1C1C1C" stroke-width="0.6"/>
  <line x1="20" y1="140" x2="260" y2="140" stroke="#1C1C1C" stroke-width="0.7"/>
  <ellipse cx="140" cy="100" rx="105" ry="18" fill="none" stroke="#1C1C1C" stroke-width="0.5"/>
  <ellipse cx="140" cy="180" rx="105" ry="18" fill="none" stroke="#1C1C1C" stroke-width="0.5"/>
  <ellipse cx="140" cy="60" rx="70" ry="10" fill="none" stroke="#1C1C1C" stroke-width="0.4"/>
  <ellipse cx="140" cy="220" rx="70" ry="10" fill="none" stroke="#1C1C1C" stroke-width="0.4"/>
</svg>`;

// Pixel bot — 8×8 retina pixel art
const PIXEL_BOT = `<svg width="64" height="64" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;shape-rendering:crispEdges;position:absolute;bottom:100px;right:90px;opacity:0.70;z-index:2;" aria-hidden="true">
  <rect x="2" y="0" width="4" height="1" fill="${ORANGE}"/>
  <rect x="1" y="1" width="6" height="3" fill="${ORANGE}"/>
  <rect x="2" y="2" width="1" height="1" fill="#1C1C1C"/>
  <rect x="5" y="2" width="1" height="1" fill="#1C1C1C"/>
  <rect x="0" y="4" width="1" height="2" fill="${ORANGE}"/>
  <rect x="7" y="4" width="1" height="2" fill="${ORANGE}"/>
  <rect x="1" y="4" width="6" height="3" fill="${ORANGE}"/>
  <rect x="2" y="7" width="1" height="1" fill="${ORANGE}"/>
  <rect x="5" y="7" width="1" height="1" fill="${ORANGE}"/>
</svg>`;

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; background: #1C1C1C; font-family: 'Space Mono', monospace; }

.slide { width: 1080px; height: 1350px; display: none; position: relative; overflow: hidden; }
.slide.active { display: block; }

/* DARK SLIDE — terminal dark */
.dkp { background: #1C1C1C; }

/* LIGHT SLIDE — warm beige */
.ltp { background: #FBF6EC; }

/* CTA SLIDE — near-black with orange details */
.ctp { background: #111111; }

/* HANDLE PILL */
.handle-tlp {
  position: absolute; top: 54px; left: 90px;
  display: inline-flex; align-items: center;
  border: 1px solid rgba(255,255,255,0.16);
  padding: 9px 18px;
  font-size: 12px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(255,255,255,0.44); z-index: 3;
}
.handle-trp {
  position: absolute; top: 54px; right: 90px;
  display: inline-flex; align-items: center;
  border: 1px solid rgba(255,255,255,0.16);
  padding: 9px 18px;
  font-size: 12px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(255,255,255,0.44); z-index: 3;
}
.handle-tlp-lk {
  position: absolute; top: 54px; left: 90px;
  display: inline-flex; align-items: center;
  border: 1px solid rgba(0,0,0,0.12);
  padding: 9px 18px;
  font-size: 12px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(0,0,0,0.32); z-index: 3;
}

/* CONTENT PAD */
.padp {
  position: absolute; inset: 0;
  padding: 90px; padding-top: 490px;
  z-index: 2;
}
.ltp .padp { padding-top: 460px; }

/* PROGRESS DOT TRACK */
.dot-track {
  position: absolute; bottom: 60px; left: 90px; right: 90px;
  height: 8px; display: flex; align-items: center; gap: 6px;
  z-index: 3;
}

/* TYPOGRAPHY — Space Mono for all headlines */
.hp-xl {
  font-family: 'Space Mono', monospace;
  font-weight: 700; font-size: 92px; line-height: 0.92;
  letter-spacing: -0.03em; color: #FFFFFF;
}
.hp {
  font-family: 'Space Mono', monospace;
  font-weight: 700; font-size: 76px; line-height: 0.93;
  letter-spacing: -0.03em; color: #FFFFFF;
}
.hp-sm {
  font-family: 'Space Mono', monospace;
  font-weight: 700; font-size: 62px; line-height: 0.94;
  letter-spacing: -0.025em; color: #FFFFFF;
}
.hp-lk { color: #1C1C1C; }

/* Orange accent on headline line */
.ora { color: ${ORANGE}; }

/* BODY TEXT — Outfit for readability */
.bbp  { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 700; line-height: 1.50; color: rgba(255,255,255,0.88); }
.brp  { font-family: 'Outfit', sans-serif; font-size: 30px; font-weight: 400; line-height: 1.65; color: rgba(255,255,255,0.44); }
.wbbp { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 700; line-height: 1.50; color: #1C1C1C; }
.wbrp { font-family: 'Outfit', sans-serif; font-size: 30px; font-weight: 400; line-height: 1.65; color: #777060; }

/* SUBTITLE PILL — hook */
.sub-pilp {
  display: inline-flex; align-items: center;
  border: 1px solid rgba(255,255,255,0.16);
  padding: 13px 28px; margin-top: 44px;
  font-family: 'Outfit', sans-serif;
  font-size: 26px; font-weight: 500;
  color: rgba(255,255,255,0.60); letter-spacing: 0.02em;
}

/* STAT BOXES */
.stat-rowp {
  display: flex; align-items: center;
  border: 1px solid rgba(255,255,255,0.10);
  border-left: 2px solid ${ORANGE};
  padding: 18px 24px;
  background: rgba(255,255,255,0.025);
  width: fit-content; min-width: 580px;
}
.stat-rowp + .stat-rowp { margin-top: 10px; }
.stat-lblp { font-size: 24px; font-weight: 400; color: rgba(255,255,255,0.48); letter-spacing: 0.04em; flex: 1; font-family: 'Outfit', sans-serif; }
.stat-valp { font-size: 28px; font-weight: 700; color: ${ORANGE}; letter-spacing: -0.01em; }

/* FINDINGS GRID */
.findings-gridp { display: grid; grid-template-columns: 1fr 1fr; }
.findingp { padding: 28px 0; border-bottom: 1px solid #E5DDD0; }
.findingp:nth-child(odd) { padding-right: 50px; }
.findingp:nth-child(even) { padding-left: 50px; border-left: 1px solid #E5DDD0; }
.findingp:nth-last-child(-n+2) { border-bottom: none; }
.finding-titlep { font-family: 'Space Mono', monospace; font-size: 28px; font-weight: 700; color: #1C1C1C; line-height: 1.3; margin-bottom: 8px; }
.finding-descp { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 400; color: #777060; line-height: 1.55; }

/* COMPANY GRID */
.co-gridp { display: grid; grid-template-columns: 1fr 1fr; margin-top: 40px; }
.co-itemp { padding: 18px 0; border-bottom: 1px solid #E5DDD0; }
.co-itemp:nth-child(odd) { padding-right: 44px; }
.co-itemp:nth-child(even) { padding-left: 44px; border-left: 1px solid #E5DDD0; }
.co-itemp:nth-last-child(-n+2) { border-bottom: none; }
.co-namep { font-family: 'Space Mono', monospace; font-size: 27px; font-weight: 700; color: #1C1C1C; }
.co-rolep { font-family: 'Outfit', sans-serif; font-size: 23px; color: #999088; margin-top: 3px; }

/* TERMINAL PANEL — used in list/step slides */
.terminal-p {
  background: #141414; border: 1px solid rgba(255,255,255,0.08);
  margin-top: 36px; overflow: hidden;
}
.terminal-chrome-p {
  background: #262626; height: 32px;
  display: flex; align-items: center; padding: 0 14px; gap: 7px;
}
.tcp-r { width: 11px; height: 11px; border-radius: 50%; background: #FF5F57; }
.tcp-a { width: 11px; height: 11px; border-radius: 50%; background: #FFBD2E; }
.tcp-g { width: 11px; height: 11px; border-radius: 50%; background: #28CA41; }
.terminal-body-p {
  padding: 20px 24px;
  font-family: 'Space Mono', monospace;
  font-size: 16px; line-height: 1.65; color: rgba(255,255,255,0.65);
}
`;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderLine(text: string, isLight: boolean): string {
  if (text.startsWith('~')) {
    return `<span class="ora">${esc(text.slice(1))}</span>`;
  }
  return esc(text);
}

function headlineLines(slide: Slide, isLight: boolean): string {
  return [slide.headline, slide.headline2, slide.headline3]
    .filter(Boolean)
    .map(t => renderLine(t!, isLight))
    .join('<br>');
}

// Dot track progress — (K-1) orange ● → 1 dot ● → (N-K) grey —
function progressDots(index: number, total: number): string {
  const dots: string[] = [];
  for (let i = 0; i < total; i++) {
    if (i < index) {
      dots.push(`<div style="width:6px;height:6px;border-radius:50%;background:${ORANGE};flex-shrink:0;"></div>`);
      if (i < total - 1) dots.push(`<div style="height:1.5px;background:${ORANGE};flex:1;opacity:0.60;"></div>`);
    } else if (i === index) {
      dots.push(`<div style="width:8px;height:8px;border-radius:50%;background:${ORANGE};flex-shrink:0;box-shadow:0 0 0 2px rgba(247,137,43,0.28);"></div>`);
      if (i < total - 1) dots.push(`<div style="height:1.5px;background:rgba(255,255,255,0.12);flex:1;"></div>`);
    } else {
      dots.push(`<div style="width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,0.18);flex-shrink:0;"></div>`);
      if (i < total - 1) dots.push(`<div style="height:1.5px;background:rgba(255,255,255,0.08);flex:1;"></div>`);
    }
  }
  return `<div class="dot-track">${dots.join('')}</div>`;
}

// Light version of dot track
function progressDotsLight(index: number, total: number): string {
  const dots: string[] = [];
  for (let i = 0; i < total; i++) {
    if (i < index) {
      dots.push(`<div style="width:6px;height:6px;border-radius:50%;background:${ORANGE};flex-shrink:0;"></div>`);
      if (i < total - 1) dots.push(`<div style="height:1.5px;background:${ORANGE};flex:1;opacity:0.60;"></div>`);
    } else if (i === index) {
      dots.push(`<div style="width:8px;height:8px;border-radius:50%;background:${ORANGE};flex-shrink:0;"></div>`);
      if (i < total - 1) dots.push(`<div style="height:1.5px;background:rgba(0,0,0,0.10);flex:1;"></div>`);
    } else {
      dots.push(`<div style="width:4px;height:4px;border-radius:50%;background:rgba(0,0,0,0.15);flex-shrink:0;"></div>`);
      if (i < total - 1) dots.push(`<div style="height:1.5px;background:rgba(0,0,0,0.07);flex:1;"></div>`);
    }
  }
  return `<div class="dot-track">${dots.join('')}</div>`;
}

function hookSizeClass(s: Slide): { cls: string; padTop: number } {
  const totalChars = [s.headline, s.headline2, s.headline3]
    .filter(Boolean)
    .map(t => t!.replace(/^~/, '').length)
    .reduce((a, b) => a + b, 0);
  if (totalChars <= 24) return { cls: 'hp-xl', padTop: 540 };
  if (totalChars <= 40) return { cls: 'hp',    padTop: 500 };
  return                       { cls: 'hp-sm', padTop: 465 };
}

function buildHook(s: Slide, handle: string, index: number, total: number): string {
  const { cls, padTop } = hookSizeClass(s);
  const pill = s.pill
    ? `<div class="sub-pilp">${esc(s.pill)}</div>`
    : '';
  return `<section class="slide dkp${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  ${ASCII_GLOBE_DARK}
  <div class="handle-trp">${esc(handle)}</div>
  <div class="padp" style="padding-top:${padTop}px;">
    <div class="${cls}">${headlineLines(s, false)}</div>
    ${pill}
  </div>
  ${progressDots(index, total)}
</section>`;
}

function buildData(s: Slide, handle: string, index: number, total: number): string {
  const stats = (s.stats ?? [])
    .map(st => `    <div class="stat-rowp"><span class="stat-lblp">${esc(st.label)}&nbsp;&nbsp;</span><span class="stat-valp">${esc(st.value)}</span></div>`)
    .join('\n');
  const footnote = s.footnote
    ? `    <div style="margin-top:28px;"><p class="brp">${esc(s.footnote)}</p></div>`
    : '';
  return `<section class="slide dkp" id="slide-${s.id}">
  <div class="handle-tlp">${esc(handle)}</div>
  <div class="padp">
    <div class="hp">${headlineLines(s, false)}</div>
    <div style="margin-top:44px;">
${stats}
    </div>
${footnote}
  </div>
  ${progressDots(index, total)}
</section>`;
}

function buildInsight(s: Slide, index: number, total: number): string {
  const body = s.body
    ? `<p class="wbbp">${esc(s.body)}</p>`
    : '';
  const supporting = s.supporting
    ? `<p class="wbrp" style="margin-top:12px;">${esc(s.supporting)}</p>`
    : '';
  return `<section class="slide ltp" id="slide-${s.id}">
  ${ASCII_GLOBE_LIGHT}
  <div class="padp">
    <div class="hp hp-lk">${headlineLines(s, true)}</div>
    <div style="margin-top:44px;max-width:820px;">
      ${body}
      ${supporting}
    </div>
  </div>
  ${progressDotsLight(index, total)}
</section>`;
}

function buildList(s: Slide, handle: string, index: number, total: number): string {
  const steps = s.steps ?? [];
  const items = steps
    .map((step, i) => {
      const num = String(i + 1).padStart(2, '0');
      const borderBottom = i === steps.length - 1 ? ' border-bottom: 1px solid rgba(255,255,255,0.07);' : '';
      return `      <div style="display:flex;align-items:flex-start;gap:28px;padding:26px 0;border-top:1px solid rgba(255,255,255,0.07);${borderBottom}">
        <span style="font-size:12px;font-weight:700;color:${ORANGE};letter-spacing:0.06em;min-width:32px;padding-top:5px;">${num}</span>
        <div>
          <div style="font-family:'Space Mono',monospace;font-size:27px;font-weight:700;color:rgba(255,255,255,0.88);line-height:1.3;margin-bottom:7px;">${esc(step.title)}</div>
          <div style="font-family:'Outfit',sans-serif;font-size:27px;font-weight:400;color:rgba(255,255,255,0.42);line-height:1.55;">${esc(step.desc)}</div>
        </div>
      </div>`;
    })
    .join('\n');
  return `<section class="slide dkp" id="slide-${s.id}">
  <div class="handle-tlp">${esc(handle)}</div>
  <div class="padp" style="padding-top:360px;">
    <div class="hp-sm">${headlineLines(s, false)}</div>
    <div style="margin-top:44px;display:flex;flex-direction:column;">
${items}
    </div>
  </div>
  ${progressDots(index, total)}
</section>`;
}

function buildGrid(s: Slide, index: number, total: number): string {
  const items = (s.items ?? [])
    .map(item => `      <div class="co-itemp"><div class="co-namep">${esc(item.name)}</div><div class="co-rolep">${esc(item.role)}</div></div>`)
    .join('\n');
  return `<section class="slide ltp" id="slide-${s.id}">
  <div class="padp" style="padding-top:380px;">
    <div class="hp-sm hp-lk">${headlineLines(s, true)}</div>
    <div class="co-gridp">
${items}
    </div>
  </div>
  ${progressDotsLight(index, total)}
</section>`;
}

function buildFindings(s: Slide, index: number, total: number): string {
  const items = (s.items ?? [])
    .map(item => `      <div class="findingp"><div class="finding-titlep">${esc(item.name)}</div><div class="finding-descp">${esc(item.role)}</div></div>`)
    .join('\n');
  return `<section class="slide ltp" id="slide-${s.id}">
  <div class="padp" style="padding-top:380px;">
    <div class="hp hp-lk">${headlineLines(s, true)}</div>
    <div class="findings-gridp" style="margin-top:44px;">
${items}
    </div>
  </div>
  ${progressDotsLight(index, total)}
</section>`;
}

function buildCTA(s: Slide, handle: string, pageName: string, index: number, total: number): string {
  const tagline = s.tagline
    ? `<div style="margin-top:40px;max-width:740px;font-family:'Outfit',sans-serif;font-size:32px;font-weight:400;line-height:1.55;color:rgba(255,255,255,0.60);">${esc(s.tagline)}</div>`
    : '';
  return `<section class="slide ctp" id="slide-${s.id}">
  ${PIXEL_BOT}
  <div class="handle-tlp">${esc(handle)}</div>
  <div style="position:absolute;inset:0;padding:90px;padding-top:420px;z-index:2;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.16em;color:${ORANGE};text-transform:uppercase;margin-bottom:32px;">Follow for more</div>
    <div style="font-family:'Space Mono',monospace;font-weight:700;font-size:88px;line-height:0.90;letter-spacing:-0.03em;color:#FFFFFF;">${esc(pageName)}.</div>
    ${tagline}
  </div>
  ${progressDots(index, total)}
</section>`;
}

export function buildAsciiPixelHTML(slides: Slide[], meta: CarouselMeta): string {
  const total = slides.length;
  const slidesHTML = slides.map((s, i) => {
    switch (s.type) {
      case 'hook':     return buildHook(s, meta.handle, i, total);
      case 'data':     return buildData(s, meta.handle, i, total);
      case 'insight':  return buildInsight(s, i, total);
      case 'list':     return buildList(s, meta.handle, i, total);
      case 'grid':     return buildGrid(s, i, total);
      case 'findings': return buildFindings(s, i, total);
      case 'cta':      return buildCTA(s, meta.handle, meta.pageName, i, total);
    }
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${slidesHTML}
</body>
</html>`;
}
