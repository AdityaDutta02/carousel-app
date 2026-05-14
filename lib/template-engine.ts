import type { Slide, CarouselMeta } from './types';
import { buildEditorialHTML } from './editorial-template';
import { buildWolfMediaV2HTML } from './wolf-media-v2-template';
import { buildEditorialStepHTML } from './editorial-step-template';
import { buildAsciiPixelHTML } from './ascii-pixel-template';

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  width: 1080px;
  background: #141210;
  font-family: 'Outfit', -apple-system, 'Helvetica Neue', sans-serif;
}

.slide {
  width: 1080px;
  height: 1350px;
  display: none;
  position: relative;
  overflow: hidden;
}
.slide.active { display: block; }

/* DARK SLIDE — warm charcoal + radial vignette + film grain */
.dk {
  background:
    radial-gradient(ellipse 130% 90% at 30% 20%, rgba(38,32,24,0.65) 0%, transparent 55%),
    #131110;
}
.dk::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.50' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 300px 300px;
  opacity: 0.26;
  pointer-events: none;
  z-index: 1;
}

/* WHITE SLIDE */
.wt { background: #FFFFFF; }

/* CTA SLIDE */
.ct {
  background:
    radial-gradient(ellipse 120% 80% at 20% 80%, rgba(12,30,80,0.70) 0%, transparent 60%),
    #1B6AE4;
}
.ct::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.50' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 300px 300px;
  opacity: 0.22;
  pointer-events: none;
  z-index: 1;
}

/* CONTENT PAD — anchored from top */
.pad {
  position: absolute;
  inset: 0;
  padding: 90px;
  padding-top: 350px;
  z-index: 2;
}
.wt .pad { padding-top: 350px; }

/* HANDLE PILL */
.handle-tl {
  position: absolute;
  top: 55px;
  left: 90px;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.30);
  border-radius: 100px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.68);
  letter-spacing: 0.01em;
  z-index: 3;
}
.handle-tr {
  position: absolute;
  top: 55px;
  right: 90px;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.30);
  border-radius: 100px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.68);
  letter-spacing: 0.01em;
  z-index: 3;
}

/* PROGRESS BAR */
.prog-track {
  position: absolute;
  bottom: 60px;
  left: 90px;
  right: 90px;
  height: 2px;
  z-index: 3;
}
.dk .prog-track { background: rgba(255,255,255,0.14); }
.wt .prog-track { background: rgba(0,0,0,0.10); }
.ct .prog-track { background: rgba(255,255,255,0.22); }
.prog-fill { height: 100%; }
.dk .prog-fill { background: rgba(255,255,255,0.68); }
.wt .prog-fill { background: rgba(0,0,0,0.52); }
.ct .prog-fill { background: rgba(255,255,255,0.88); }

/* TYPOGRAPHY */
.h1 {
  font-weight: 800;
  font-size: 100px;
  line-height: 0.92;
  letter-spacing: -0.04em;
  color: #FFFFFF;
}
.h1-xl {
  font-weight: 800;
  font-size: 116px;
  line-height: 0.90;
  letter-spacing: -0.04em;
  color: #FFFFFF;
}
.h1-sm {
  font-weight: 800;
  font-size: 86px;
  line-height: 0.93;
  letter-spacing: -0.04em;
  color: #FFFFFF;
}

/* CSS Gradient Text */
.gd {
  background: linear-gradient(90deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.22) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  width: fit-content;
}
.gl {
  background: linear-gradient(90deg, #2C2C2C 0%, #ABABAB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  width: fit-content;
}
.blk { color: #111111; }

/* Body text */
.bb {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.45;
  color: rgba(255,255,255,0.92);
}
.br {
  font-size: 30px;
  font-weight: 400;
  line-height: 1.60;
  color: rgba(255,255,255,0.50);
}
.wbb {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.45;
  color: #141414;
}
.wbr {
  font-size: 30px;
  font-weight: 400;
  line-height: 1.60;
  color: #888888;
}

/* STAT BOXES */
.stat-row {
  display: flex;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 10px;
  padding: 20px 28px;
  background: rgba(255,255,255,0.04);
  width: fit-content;
  min-width: 580px;
}
.stat-row + .stat-row { margin-top: 12px; }
.stat-lbl {
  font-size: 28px;
  font-weight: 400;
  color: rgba(255,255,255,0.68);
}
.stat-val {
  font-size: 30px;
  font-weight: 800;
  color: #FFFFFF;
}

/* SUBTITLE PILL */
.sub-pill {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid rgba(255,255,255,0.26);
  border-radius: 100px;
  padding: 14px 34px;
  font-size: 28px;
  font-weight: 500;
  color: rgba(255,255,255,0.80);
  margin-top: 46px;
  letter-spacing: 0.01em;
}

/* TWO-COL FINDINGS GRID */
.findings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.finding {
  padding: 24px 0;
  border-bottom: 1px solid #E4E4E4;
}
.finding:nth-child(odd) { padding-right: 50px; }
.finding:nth-child(even) { padding-left: 50px; border-left: 1px solid #E4E4E4; }
.finding:nth-last-child(-n+2) { border-bottom: none; }
.finding-title {
  font-size: 32px;
  font-weight: 700;
  color: #111111;
  line-height: 1.3;
  margin-bottom: 8px;
}
.finding-desc {
  font-size: 26px;
  font-weight: 400;
  color: #888888;
  line-height: 1.55;
}

/* COMPANY GRID */
.co-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 36px;
}
.co-item {
  padding: 16px 0;
  border-bottom: 1px solid #E4E4E4;
}
.co-item:nth-child(odd) { padding-right: 44px; }
.co-item:nth-child(even) { padding-left: 44px; border-left: 1px solid #E4E4E4; }
.co-item:nth-last-child(-n+2) { border-bottom: none; }
.co-name {
  font-size: 30px;
  font-weight: 700;
  color: #111111;
}
.co-role {
  font-size: 24px;
  color: #999999;
  margin-top: 2px;
}
`;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderLine(text: string, isWhite: boolean): string {
  if (text.startsWith('~')) {
    const cls = isWhite ? 'gl' : 'gd';
    return `<span class="${cls}">${esc(text.slice(1))}</span>`;
  }
  return esc(text);
}

function headlineLines(slide: Slide, isWhite: boolean): string {
  return [slide.headline, slide.headline2, slide.headline3]
    .filter(Boolean)
    .map(t => renderLine(t!, isWhite))
    .join('<br>');
}

function progressBar(index: number, total: number): string {
  const pct = (((index + 1) / total) * 100).toFixed(1);
  return `<div class="prog-track"><div class="prog-fill" style="width:${pct}%;"></div></div>`;
}

function hookSizeClass(s: Slide): { cls: string; padTop: number } {
  const totalChars = [s.headline, s.headline2, s.headline3]
    .filter(Boolean)
    .map(t => t!.replace(/^~/, '').length)
    .reduce((a, b) => a + b, 0);
  if (totalChars <= 28) return { cls: 'h1-xl', padTop: 460 };
  if (totalChars <= 45) return { cls: 'h1',    padTop: 420 };
  return                       { cls: 'h1-sm', padTop: 385 };
}

function buildHook(s: Slide, handle: string, index: number, total: number): string {
  const { cls, padTop } = hookSizeClass(s);
  const pill = s.pill ? `<div class="sub-pill">${esc(s.pill)}</div>` : '';
  return `<section class="slide dk${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  <div class="handle-tr">${esc(handle)}</div>
  <div class="pad" style="padding-top:${padTop}px;">
    <div class="${cls}">${headlineLines(s, false)}</div>
    ${pill}
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildData(s: Slide, handle: string, index: number, total: number): string {
  const stats = (s.stats ?? [])
    .map(st => `    <div class="stat-row"><span class="stat-lbl">${esc(st.label)}&nbsp;</span><span class="stat-val">${esc(st.value)}</span></div>`)
    .join('\n');
  const footnote = s.footnote
    ? `    <div style="margin-top:30px;"><p class="br">${esc(s.footnote)}</p></div>`
    : '';
  return `<section class="slide dk" id="slide-${s.id}">
  <div class="handle-tl">${esc(handle)}</div>
  <div class="pad">
    <div class="h1">${headlineLines(s, false)}</div>
    <div style="margin-top:46px;">
${stats}
    </div>
${footnote}
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildInsight(s: Slide, index: number, total: number): string {
  const body = s.body
    ? `<p class="wbb">${esc(s.body)}</p>`
    : '';
  const supporting = s.supporting
    ? `<p class="wbr" style="margin-top:10px;">${esc(s.supporting)}</p>`
    : '';
  return `<section class="slide wt" id="slide-${s.id}">
  <div class="pad">
    <div class="h1 blk">${headlineLines(s, true)}</div>
    <div style="margin-top:44px;max-width:820px;">
      ${body}
      ${supporting}
    </div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildList(s: Slide, handle: string, index: number, total: number): string {
  const steps = (s.steps ?? []);
  const items = steps
    .map((step, i) => {
      const num = String(i + 1).padStart(2, '0');
      const borderBottom = i === steps.length - 1 ? ' border-bottom: 1px solid rgba(255,255,255,0.10);' : '';
      return `      <div style="display:flex;align-items:flex-start;gap:32px;padding:30px 0;border-top:1px solid rgba(255,255,255,0.10);${borderBottom}">
        <span style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.28);letter-spacing:0.08em;min-width:28px;padding-top:6px;">${num}</span>
        <div>
          <div style="font-size:30px;font-weight:700;color:rgba(255,255,255,0.92);line-height:1.3;margin-bottom:8px;">${esc(step.title)}</div>
          <div style="font-size:28px;font-weight:400;color:rgba(255,255,255,0.46);line-height:1.50;">${esc(step.desc)}</div>
        </div>
      </div>`;
    })
    .join('\n');
  return `<section class="slide dk" id="slide-${s.id}">
  <div class="handle-tl">${esc(handle)}</div>
  <div class="pad" style="padding-top:300px;">
    <div class="h1-sm">${headlineLines(s, false)}</div>
    <div style="margin-top:50px;display:flex;flex-direction:column;">
${items}
    </div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildGrid(s: Slide, index: number, total: number): string {
  const items = (s.items ?? [])
    .map(item => `      <div class="co-item"><div class="co-name">${esc(item.name)}</div><div class="co-role">${esc(item.role)}</div></div>`)
    .join('\n');
  return `<section class="slide wt" id="slide-${s.id}">
  <div class="pad" style="padding-top:300px;">
    <div class="h1-sm blk">${headlineLines(s, true)}</div>
    <div class="co-grid">
${items}
    </div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildFindings(s: Slide, index: number, total: number): string {
  const items = (s.items ?? [])
    .map(item => `      <div class="finding"><div class="finding-title">${esc(item.name)}</div><div class="finding-desc">${esc(item.role)}</div></div>`)
    .join('\n');
  return `<section class="slide wt" id="slide-${s.id}">
  <div class="pad" style="padding-top:300px;">
    <div class="h1 blk">${headlineLines(s, true)}</div>
    <div class="findings-grid" style="margin-top:44px;">
${items}
    </div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildCTA(s: Slide, handle: string, pageName: string, index: number, total: number): string {
  const tagline = s.tagline ? `<div style="margin-top:40px;max-width:740px;font-size:34px;font-weight:400;line-height:1.50;color:rgba(255,255,255,0.78);">${esc(s.tagline)}</div>` : '';
  return `<section class="slide ct" id="slide-${s.id}">
  <div class="handle-tl">${esc(handle)}</div>
  <div style="position:absolute;inset:0;padding:90px;padding-top:350px;z-index:2;">
    <div style="font-size:13px;font-weight:700;letter-spacing:0.14em;color:rgba(255,255,255,0.50);text-transform:uppercase;margin-bottom:36px;">Follow for more</div>
    <div style="font-family:'Outfit',sans-serif;font-weight:800;font-size:108px;line-height:0.90;letter-spacing:-0.04em;color:#FFFFFF;">${esc(pageName)}.</div>
    ${tagline}
  </div>
  ${progressBar(index, total)}
</section>`;
}

export function buildCarouselHTML(slides: Slide[], meta: CarouselMeta): string {
  if (meta.theme === 'editorial') return buildEditorialHTML(slides, meta);
  if (meta.theme === 'wolf-v2') return buildWolfMediaV2HTML(slides, meta);
  if (meta.theme === 'editorial-step') return buildEditorialStepHTML(slides, meta);
  if (meta.theme === 'ascii-pixel') return buildAsciiPixelHTML(slides, meta);
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
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${slidesHTML}
</body>
</html>`;
}
