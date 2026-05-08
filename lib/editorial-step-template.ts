import type { Slide, CarouselMeta } from './types';

// Editorial Step: cream paper + Playfair serif, step labels, terminal panels
// Use for: step-by-step tutorials, how-to guides, tool walkthroughs

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; background: #0E0E0E; font-family: 'Outfit', sans-serif; }

.slide { width: 1080px; height: 1350px; display: none; position: relative; overflow: hidden; }
.slide.active { display: block; }

/* DARK SLIDE — near black cover */
.dke { background: #0E0E0E; }

/* CREAM SLIDE — warm paper */
.cre { background: #F5F2ED; }

/* CTA SLIDE — cream with dark footer */
.cte { background: #F5F2ED; }

/* CONTENT PAD */
.pade {
  position: absolute; inset: 0;
  padding: 90px; padding-top: 480px;
  z-index: 2;
}
.cre .pade, .cte .pade { padding-top: 450px; }

/* HANDLE PILL */
.handle-tle {
  position: absolute; top: 54px; left: 90px;
  display: inline-flex; align-items: center;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 100px; padding: 10px 22px;
  font-size: 13px; font-weight: 500;
  color: rgba(255,255,255,0.48); z-index: 3;
}
.handle-tre {
  position: absolute; top: 54px; right: 90px;
  display: inline-flex; align-items: center;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 100px; padding: 10px 22px;
  font-size: 13px; font-weight: 500;
  color: rgba(255,255,255,0.48); z-index: 3;
}
.handle-tle-lk {
  position: absolute; top: 54px; left: 90px;
  display: inline-flex; align-items: center;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 100px; padding: 10px 22px;
  font-size: 13px; font-weight: 500;
  color: rgba(0,0,0,0.36); z-index: 3;
}

/* PROGRESS BAR */
.proge {
  position: absolute; bottom: 60px; left: 90px; right: 90px;
  height: 1.5px; z-index: 3;
}
.dke .proge { background: rgba(255,255,255,0.10); }
.cre .proge, .cte .proge { background: rgba(0,0,0,0.08); }
.proge-fill { height: 100%; }
.dke .proge-fill { background: rgba(255,255,255,0.55); }
.cre .proge-fill, .cte .proge-fill { background: rgba(0,0,0,0.36); }

/* TYPOGRAPHY — Playfair for headlines */
.he-xl {
  font-family: 'Playfair Display', serif;
  font-weight: 700; font-size: 108px; line-height: 0.91;
  letter-spacing: -0.01em; color: #FFFFFF;
  font-style: italic;
}
.he {
  font-family: 'Playfair Display', serif;
  font-weight: 700; font-size: 90px; line-height: 0.92;
  letter-spacing: -0.01em; color: #FFFFFF;
}
.he-sm {
  font-family: 'Playfair Display', serif;
  font-weight: 700; font-size: 74px; line-height: 0.93;
  letter-spacing: -0.01em; color: #FFFFFF;
}
.he-lk { color: #1A1A1A; }
.he-xl-lk {
  font-family: 'Playfair Display', serif;
  font-weight: 700; font-size: 108px; line-height: 0.91;
  letter-spacing: -0.01em; color: #1A1A1A;
  font-style: italic;
}

/* Accent line — italic colored */
.em-acc { font-style: italic; color: rgba(255,255,255,0.45); }
.em-acc-lk { font-style: italic; color: #A8936A; }

/* BODY TEXT */
.bbe  { font-size: 26px; font-weight: 600; line-height: 1.50; color: rgba(255,255,255,0.88); }
.bre  { font-size: 24px; font-weight: 400; line-height: 1.65; color: rgba(255,255,255,0.45); }
.wbbe { font-size: 26px; font-weight: 600; line-height: 1.50; color: #1A1A1A; }
.wbre { font-size: 24px; font-weight: 400; line-height: 1.65; color: #777777; }

/* SUBTITLE PILL — hook */
.sub-pile {
  display: inline-flex; align-items: center;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 100px; padding: 13px 32px;
  font-size: 20px; font-weight: 400; font-style: italic;
  color: rgba(255,255,255,0.65); margin-top: 48px;
  font-family: 'Playfair Display', serif;
}

/* STAT ROWS — editorial style */
.stat-rowe {
  display: flex; align-items: baseline;
  padding: 28px 0; border-bottom: 1px solid rgba(255,255,255,0.08);
  gap: 24px;
}
.stat-rowe:first-child { border-top: 1px solid rgba(255,255,255,0.08); }
.stat-lble {
  font-size: 21px; font-weight: 400; color: rgba(255,255,255,0.44);
  flex: 1; line-height: 1.4;
}
.stat-vale {
  font-family: 'Playfair Display', serif;
  font-size: 72px; line-height: 1; color: #FFFFFF;
  font-weight: 700;
}

/* STEP LABEL */
.step-lbl {
  font-size: 11px; font-weight: 700; letter-spacing: 0.16em;
  text-transform: uppercase; color: rgba(255,255,255,0.30);
  margin-bottom: 24px;
}
.step-lbl-lk {
  font-size: 11px; font-weight: 700; letter-spacing: 0.16em;
  text-transform: uppercase; color: rgba(0,0,0,0.25);
  margin-bottom: 24px;
}

/* NUMBERED LIST — step slides */
.step-item {
  display: flex; align-items: flex-start; gap: 28px;
  padding: 28px 0; border-top: 1px solid rgba(255,255,255,0.07);
}
.step-item:last-child { border-bottom: 1px solid rgba(255,255,255,0.07); }
.step-num {
  font-family: 'Playfair Display', serif;
  font-size: 13px; font-weight: 700; font-style: italic;
  color: rgba(255,255,255,0.22); min-width: 32px; padding-top: 5px;
  letter-spacing: 0.06em;
}
.step-title { font-size: 23px; font-weight: 700; color: rgba(255,255,255,0.88); line-height: 1.35; margin-bottom: 7px; }
.step-desc  { font-size: 22px; font-weight: 400; color: rgba(255,255,255,0.40); line-height: 1.55; }

/* TERMINAL WINDOW — for list/step slides */
.terminal {
  background: #1C1C1C; border-radius: 8px;
  overflow: hidden; margin-top: 40px;
}
.terminal-chrome {
  background: #2D2D2D; height: 36px;
  display: flex; align-items: center; padding: 0 16px; gap: 8px;
}
.tc-red   { width: 12px; height: 12px; border-radius: 50%; background: #FF5F57; }
.tc-amber { width: 12px; height: 12px; border-radius: 50%; background: #FFBD2E; }
.tc-green { width: 12px; height: 12px; border-radius: 50%; background: #28CA41; }
.terminal-body {
  padding: 24px 28px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px; line-height: 1.65; color: rgba(255,255,255,0.72);
}

/* FINDINGS GRID */
.findings-gride { display: grid; grid-template-columns: 1fr 1fr; }
.findinge { padding: 28px 0; border-bottom: 1px solid #DDD6CB; }
.findinge:nth-child(odd) { padding-right: 50px; }
.findinge:nth-child(even) { padding-left: 50px; border-left: 1px solid #DDD6CB; }
.findinge:nth-last-child(-n+2) { border-bottom: none; }
.finding-titlee {
  font-family: 'Playfair Display', serif;
  font-size: 26px; font-weight: 700; color: #1A1A1A;
  line-height: 1.3; margin-bottom: 9px; font-style: italic;
}
.finding-desce { font-size: 20px; font-weight: 400; color: #888880; line-height: 1.55; }

/* COMPANY GRID */
.co-gride { display: grid; grid-template-columns: 1fr 1fr; margin-top: 40px; }
.co-iteme { padding: 18px 0; border-bottom: 1px solid #DDD6CB; }
.co-iteme:nth-child(odd) { padding-right: 44px; }
.co-iteme:nth-child(even) { padding-left: 44px; border-left: 1px solid #DDD6CB; }
.co-iteme:nth-last-child(-n+2) { border-bottom: none; }
.co-namee {
  font-family: 'Playfair Display', serif;
  font-size: 24px; font-weight: 700; color: #1A1A1A; font-style: italic;
}
.co-rolee { font-size: 18px; color: #999990; margin-top: 3px; }
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
    const cls = isLight ? 'em-acc-lk' : 'em-acc';
    return `<span class="${cls}">${esc(text.slice(1))}</span>`;
  }
  return esc(text);
}

function headlineLines(slide: Slide, isLight: boolean): string {
  return [slide.headline, slide.headline2, slide.headline3]
    .filter(Boolean)
    .map(t => renderLine(t!, isLight))
    .join('<br>');
}

function progressBar(index: number, total: number): string {
  const pct = (((index + 1) / total) * 100).toFixed(1);
  return `<div class="proge"><div class="proge-fill" style="width:${pct}%;"></div></div>`;
}

function hookSizeClass(s: Slide): { cls: string; padTop: number } {
  const totalChars = [s.headline, s.headline2, s.headline3]
    .filter(Boolean)
    .map(t => t!.replace(/^~/, '').length)
    .reduce((a, b) => a + b, 0);
  if (totalChars <= 28) return { cls: 'he-xl', padTop: 560 };
  if (totalChars <= 45) return { cls: 'he',    padTop: 510 };
  return                       { cls: 'he-sm', padTop: 475 };
}

function buildHook(s: Slide, handle: string, index: number, total: number): string {
  const { cls, padTop } = hookSizeClass(s);
  const pill = s.pill
    ? `<div class="sub-pile">${esc(s.pill)}</div>`
    : '';
  return `<section class="slide dke${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  <div class="handle-tre">${esc(handle)}</div>
  <div class="pade" style="padding-top:${padTop}px;">
    <div class="${cls}">${headlineLines(s, false)}</div>
    ${pill}
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildData(s: Slide, handle: string, index: number, total: number): string {
  const stats = (s.stats ?? [])
    .map(st => `<div class="stat-rowe"><span class="stat-lble">${esc(st.label)}</span><span class="stat-vale">${esc(st.value)}</span></div>`)
    .join('');
  const footnote = s.footnote
    ? `<p style="margin-top:28px;font-size:20px;font-weight:400;color:rgba(255,255,255,0.30);line-height:1.55;">${esc(s.footnote)}</p>`
    : '';
  return `<section class="slide dke" id="slide-${s.id}">
  <div class="handle-tle">${esc(handle)}</div>
  <div class="pade">
    <div class="he">${headlineLines(s, false)}</div>
    <div style="margin-top:44px;">${stats}</div>
    ${footnote}
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildInsight(s: Slide, index: number, total: number): string {
  const body = s.body
    ? `<p class="wbbe">${esc(s.body)}</p>`
    : '';
  const supporting = s.supporting
    ? `<p class="wbre" style="margin-top:12px;">${esc(s.supporting)}</p>`
    : '';
  return `<section class="slide cre" id="slide-${s.id}">
  <div class="handle-tle-lk">${''}</div>
  <div class="pade">
    <div class="he-xl-lk">${headlineLines(s, true)}</div>
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
      return `<div class="step-item">
        <span class="step-num">${num}.</span>
        <div>
          <div class="step-title">${esc(step.title)}</div>
          <div class="step-desc">${esc(step.desc)}</div>
        </div>
      </div>`;
    })
    .join('');
  return `<section class="slide dke" id="slide-${s.id}">
  <div class="handle-tle">${esc(handle)}</div>
  <div class="pade" style="padding-top:360px;">
    <div class="step-lbl">— Step by step</div>
    <div class="he-sm">${headlineLines(s, false)}</div>
    <div style="margin-top:40px;display:flex;flex-direction:column;">
${items}
    </div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildGrid(s: Slide, index: number, total: number): string {
  const items = (s.items ?? [])
    .map(item => `      <div class="co-iteme"><div class="co-namee">${esc(item.name)}</div><div class="co-rolee">${esc(item.role)}</div></div>`)
    .join('\n');
  return `<section class="slide cre" id="slide-${s.id}">
  <div class="pade" style="padding-top:380px;">
    <div class="step-lbl-lk">Overview</div>
    <div class="he-sm he-lk">${headlineLines(s, true)}</div>
    <div class="co-gride">
${items}
    </div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildFindings(s: Slide, index: number, total: number): string {
  const items = (s.items ?? [])
    .map(item => `      <div class="findinge"><div class="finding-titlee">${esc(item.name)}</div><div class="finding-desce">${esc(item.role)}</div></div>`)
    .join('\n');
  return `<section class="slide cre" id="slide-${s.id}">
  <div class="pade" style="padding-top:380px;">
    <div class="step-lbl-lk">Key findings</div>
    <div class="he he-lk">${headlineLines(s, true)}</div>
    <div class="findings-gride" style="margin-top:44px;">
${items}
    </div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

function buildCTA(s: Slide, handle: string, pageName: string, index: number, total: number): string {
  const tagline = s.tagline
    ? `<div style="margin-top:36px;max-width:740px;font-family:'Playfair Display',serif;font-size:26px;font-weight:400;font-style:italic;line-height:1.60;color:#5A5248;">${esc(s.tagline)}</div>`
    : '';
  return `<section class="slide cte" id="slide-${s.id}">
  <div class="pade" style="padding-top:420px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.18em;color:rgba(0,0,0,0.30);text-transform:uppercase;margin-bottom:32px;">Follow for more</div>
    <div style="font-family:'Playfair Display',serif;font-weight:700;font-size:104px;line-height:0.90;letter-spacing:-0.01em;color:#1A1A1A;font-style:italic;">${esc(pageName)}.</div>
    ${tagline}
    <div style="margin-top:44px;font-size:14px;font-weight:600;letter-spacing:0.10em;color:rgba(0,0,0,0.30);text-transform:uppercase;">${esc(handle)}</div>
  </div>
  ${progressBar(index, total)}
</section>`;
}

export function buildEditorialStepHTML(slides: Slide[], meta: CarouselMeta): string {
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
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${slidesHTML}
</body>
</html>`;
}
