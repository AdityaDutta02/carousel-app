import type { Slide, CarouselMeta } from './types';

// Wolf Media v2: stark black + bold ALL CAPS, red #E02020 accent, map texture
// Use for: performance reports, metrics, case studies, before/after analysis

const MAP_TEXTURE = `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='60' y2='60' stroke='white' stroke-width='0.35' opacity='1'/%3E%3Cline x1='-30' y1='30' x2='30' y2='90' stroke='white' stroke-width='0.35' opacity='1'/%3E%3Cline x1='30' y1='-30' x2='90' y2='30' stroke='white' stroke-width='0.35' opacity='1'/%3E%3Cline x1='0' y1='30' x2='60' y2='30' stroke='white' stroke-width='0.2' opacity='1'/%3E%3Cline x1='30' y1='0' x2='30' y2='60' stroke='white' stroke-width='0.2' opacity='1'/%3E%3C/svg%3E")`;

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; background: #0D0D0D; font-family: 'Outfit', sans-serif; }

.slide { width: 1080px; height: 1350px; display: none; position: relative; overflow: hidden; }
.slide.active { display: block; }

/* DARK SLIDE — stark black with map texture */
.dk2 { background: #0D0D0D; }
.dk2::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: ${MAP_TEXTURE};
  background-size: 60px 60px;
  opacity: 0.055;
  pointer-events: none;
  z-index: 1;
}

/* LIGHT SLIDE — near-white with warm tint */
.lt2 { background: #F4F4F2; }

/* CTA SLIDE — dark with red accent */
.ct2 {
  background: #0D0D0D;
}
.ct2::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: ${MAP_TEXTURE};
  background-size: 60px 60px;
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}

/* RED ACCENT BAR — top of dark slides */
.red-bar { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #E02020; z-index: 4; }

/* CONTENT PAD — all text anchored from top */
.pad2 {
  position: absolute;
  inset: 0;
  padding: 90px;
  padding-top: 490px;
  z-index: 2;
}
.lt2 .pad2 { padding-top: 460px; }

/* HANDLE PILL */
.handle-tl2 {
  position: absolute; top: 52px; left: 90px;
  display: inline-flex; align-items: center;
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 4px; padding: 8px 18px;
  font-size: 13px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(255,255,255,0.50); z-index: 3;
}
.handle-tr2 {
  position: absolute; top: 52px; right: 90px;
  display: inline-flex; align-items: center;
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 4px; padding: 8px 18px;
  font-size: 13px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(255,255,255,0.50); z-index: 3;
}

/* PROGRESS BAR */
.prog2 {
  position: absolute; bottom: 60px; left: 90px; right: 90px;
  height: 2px; z-index: 3;
}
.dk2 .prog2, .ct2 .prog2 { background: rgba(255,255,255,0.10); }
.lt2 .prog2 { background: rgba(0,0,0,0.08); }
.prog2-fill { height: 100%; }
.dk2 .prog2-fill, .ct2 .prog2-fill { background: #E02020; }
.lt2 .prog2-fill { background: #E02020; }

/* TYPOGRAPHY — ALL CAPS always */
.h2-xl {
  font-weight: 900; font-size: 110px; line-height: 0.88;
  letter-spacing: -0.02em; color: #FFFFFF;
  text-transform: uppercase;
}
.h2 {
  font-weight: 900; font-size: 92px; line-height: 0.90;
  letter-spacing: -0.02em; color: #FFFFFF;
  text-transform: uppercase;
}
.h2-sm {
  font-weight: 900; font-size: 76px; line-height: 0.92;
  letter-spacing: -0.02em; color: #FFFFFF;
  text-transform: uppercase;
}
.h2-lk { color: #111111; }

/* RED accent on headline */
.rd { color: #E02020; }

/* BODY TEXT — uppercase */
.bb2  { font-size: 31px; font-weight: 700; line-height: 1.45; color: rgba(255,255,255,0.90); text-transform: uppercase; letter-spacing: 0.04em; }
.br2  { font-size: 29px; font-weight: 400; line-height: 1.60; color: rgba(255,255,255,0.44); text-transform: uppercase; letter-spacing: 0.03em; }
.wbb2 { font-size: 31px; font-weight: 700; line-height: 1.45; color: #111111; text-transform: uppercase; letter-spacing: 0.04em; }
.wbr2 { font-size: 29px; font-weight: 400; line-height: 1.60; color: #666666; text-transform: uppercase; letter-spacing: 0.03em; }

/* SUBTITLE PILL — hook slide */
.sub-pill2 {
  display: inline-flex; align-items: center;
  border: 1.5px solid rgba(255,255,255,0.20);
  border-radius: 4px; padding: 14px 28px;
  font-size: 26px; font-weight: 700;
  color: rgba(255,255,255,0.68); margin-top: 44px;
  letter-spacing: 0.10em; text-transform: uppercase;
}

/* STAT ROWS — v2 style */
.stat-row2 {
  display: flex; align-items: center;
  border: 1px solid rgba(255,255,255,0.12);
  border-left: 3px solid #E02020;
  border-radius: 0 6px 6px 0;
  padding: 18px 28px;
  background: rgba(255,255,255,0.02);
  width: fit-content; min-width: 600px;
}
.stat-row2 + .stat-row2 { margin-top: 10px; }
.stat-lbl2 { font-size: 26px; font-weight: 700; color: rgba(255,255,255,0.52); letter-spacing: 0.08em; text-transform: uppercase; flex: 1; }
.stat-val2 { font-size: 32px; font-weight: 900; color: #E02020; letter-spacing: -0.01em; }

/* FINDINGS GRID */
.findings-grid2 { display: grid; grid-template-columns: 1fr 1fr; }
.finding2 { padding: 28px 0; border-bottom: 1px solid #DDDDDD; }
.finding2:nth-child(odd) { padding-right: 50px; }
.finding2:nth-child(even) { padding-left: 50px; border-left: 1px solid #DDDDDD; }
.finding2:nth-last-child(-n+2) { border-bottom: none; }
.finding-title2 { font-size: 30px; font-weight: 900; color: #111111; line-height: 1.3; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.04em; }
.finding-desc2 { font-size: 26px; font-weight: 400; color: #888888; line-height: 1.55; text-transform: uppercase; letter-spacing: 0.02em; }

/* COMPANY GRID */
.co-grid2 { display: grid; grid-template-columns: 1fr 1fr; margin-top: 40px; }
.co-item2 { padding: 18px 0; border-bottom: 1px solid #DDDDDD; }
.co-item2:nth-child(odd) { padding-right: 44px; }
.co-item2:nth-child(even) { padding-left: 44px; border-left: 1px solid #DDDDDD; }
.co-item2:nth-last-child(-n+2) { border-bottom: none; }
.co-name2 { font-size: 28px; font-weight: 900; color: #111111; text-transform: uppercase; letter-spacing: 0.04em; }
.co-role2 { font-size: 23px; color: #999999; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.03em; }
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
    return `<span class="rd">${esc(text.slice(1).toUpperCase())}</span>`;
  }
  return esc(text.toUpperCase());
}

function headlineLines(slide: Slide, isLight: boolean): string {
  return [slide.headline, slide.headline2, slide.headline3]
    .filter(Boolean)
    .map(t => renderLine(t!, isLight))
    .join('<br>');
}

function progressBar(index: number, total: number): string {
  const pct = (((index + 1) / total) * 100).toFixed(1);
  return `<div class="prog2"><div class="prog2-fill" style="width:${pct}%;"></div></div>`;
}

function hookSizeClass(s: Slide): { cls: string; padTop: number } {
  const totalChars = [s.headline, s.headline2, s.headline3]
    .filter(Boolean)
    .map(t => t!.replace(/^~/, '').length)
    .reduce((a, b) => a + b, 0);
  if (totalChars <= 28) return { cls: 'h2-xl', padTop: 540 };
  if (totalChars <= 45) return { cls: 'h2',    padTop: 500 };
  return                       { cls: 'h2-sm', padTop: 470 };
}

function buildHook(s: Slide, handle: string, index: number, total: number): string {
  const { cls, padTop } = hookSizeClass(s);
  const pill = s.pill
    ? `<div class="sub-pill2">${esc(s.pill.toUpperCase())}</div>`
    : '';
  return `<section class="slide dk2${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  <div class="red-bar"></div>
  <div class="handle-tr2">${esc(handle)}</div>
  <div class="pad2" style="padding-top:${padTop}px;">
    <div class="${cls}">${headlineLines(s, false)}</div>
    ${pill}
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildData(s: Slide, handle: string, index: number, total: number): string {
  const stats = (s.stats ?? [])
    .map(st => `    <div class="stat-row2"><span class="stat-lbl2">${esc(st.label.toUpperCase())}&nbsp;&nbsp;</span><span class="stat-val2">${esc(st.value)}</span></div>`)
    .join('\n');
  const footnote = s.footnote
    ? `    <div style="margin-top:28px;"><p class="br2">${esc(s.footnote)}</p></div>`
    : '';
  return `<section class="slide dk2" id="slide-${s.id}">
  <div class="red-bar"></div>
  <div class="handle-tl2">${esc(handle)}</div>
  <div class="pad2">
    <div class="h2">${headlineLines(s, false)}</div>
    <div style="margin-top:44px;">
${stats}
    </div>
${footnote}
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildInsight(s: Slide, index: number, total: number): string {
  const body = s.body
    ? `<p class="wbb2">${esc(s.body)}</p>`
    : '';
  const supporting = s.supporting
    ? `<p class="wbr2" style="margin-top:10px;">${esc(s.supporting)}</p>`
    : '';
  return `<section class="slide lt2" id="slide-${s.id}">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:#E02020;z-index:4;"></div>
  <div class="pad2">
    <div class="h2 h2-lk">${headlineLines(s, true)}</div>
    <div style="margin-top:44px;max-width:820px;">
      ${body}
      ${supporting}
    </div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildList(s: Slide, handle: string, index: number, total: number): string {
  const steps = s.steps ?? [];
  const items = steps
    .map((step, i) => {
      const num = String(i + 1).padStart(2, '0');
      const borderBottom = i === steps.length - 1 ? ' border-bottom: 1px solid rgba(255,255,255,0.08);' : '';
      return `      <div style="display:flex;align-items:flex-start;gap:28px;padding:26px 0;border-top:1px solid rgba(255,255,255,0.08);${borderBottom}">
        <span style="font-size:11px;font-weight:900;color:#E02020;letter-spacing:0.14em;min-width:28px;padding-top:6px;text-transform:uppercase;">${num}</span>
        <div>
          <div style="font-size:28px;font-weight:900;color:rgba(255,255,255,0.90);line-height:1.3;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em;">${esc(step.title)}</div>
          <div style="font-size:27px;font-weight:400;color:rgba(255,255,255,0.40);line-height:1.50;text-transform:uppercase;letter-spacing:0.03em;">${esc(step.desc)}</div>
        </div>
      </div>`;
    })
    .join('\n');
  return `<section class="slide dk2" id="slide-${s.id}">
  <div class="red-bar"></div>
  <div class="handle-tl2">${esc(handle)}</div>
  <div class="pad2" style="padding-top:360px;">
    <div class="h2-sm">${headlineLines(s, false)}</div>
    <div style="margin-top:44px;display:flex;flex-direction:column;">
${items}
    </div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildGrid(s: Slide, index: number, total: number): string {
  const items = (s.items ?? [])
    .map(item => `      <div class="co-item2"><div class="co-name2">${esc(item.name)}</div><div class="co-role2">${esc(item.role)}</div></div>`)
    .join('\n');
  return `<section class="slide lt2" id="slide-${s.id}">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:#E02020;z-index:4;"></div>
  <div class="pad2" style="padding-top:380px;">
    <div class="h2-sm h2-lk">${headlineLines(s, true)}</div>
    <div class="co-grid2">
${items}
    </div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildFindings(s: Slide, index: number, total: number): string {
  const items = (s.items ?? [])
    .map(item => `      <div class="finding2"><div class="finding-title2">${esc(item.name)}</div><div class="finding-desc2">${esc(item.role)}</div></div>`)
    .join('\n');
  return `<section class="slide lt2" id="slide-${s.id}">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:#E02020;z-index:4;"></div>
  <div class="pad2" style="padding-top:380px;">
    <div class="h2 h2-lk">${headlineLines(s, true)}</div>
    <div class="findings-grid2" style="margin-top:44px;">
${items}
    </div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildCTA(s: Slide, handle: string, pageName: string, index: number, total: number): string {
  const tagline = s.tagline
    ? `<div style="margin-top:40px;max-width:740px;font-size:32px;font-weight:400;line-height:1.55;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:0.04em;">${esc(s.tagline)}</div>`
    : '';
  return `<section class="slide ct2" id="slide-${s.id}">
  <div class="red-bar"></div>
  <div class="handle-tl2">${esc(handle)}</div>
  <div style="position:absolute;inset:0;padding:90px;padding-top:420px;z-index:2;">
    <div style="font-size:12px;font-weight:900;letter-spacing:0.18em;color:#E02020;text-transform:uppercase;margin-bottom:32px;">Follow for more</div>
    <div style="font-family:'Outfit',sans-serif;font-weight:900;font-size:100px;line-height:0.90;letter-spacing:-0.02em;color:#FFFFFF;text-transform:uppercase;">${esc(pageName)}.</div>
    ${tagline}
  </div>
  ${progressBar(index, total)}
</section>`;
}

export function buildWolfMediaV2HTML(slides: Slide[], meta: CarouselMeta): string {
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
