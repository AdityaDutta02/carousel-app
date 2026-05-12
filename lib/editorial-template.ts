import type { Slide, CarouselMeta } from './types';

// Signage palette: ink × chrome yellow
// Fonts: DM Serif Display (display), Bebas Neue (numerals), Inter (body/labels)

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; background: #1A1A1A; font-family: 'Inter', sans-serif; }

.slide { width: 1080px; height: 1350px; display: none; position: relative; overflow: hidden; }
.slide.active { display: block; }

.dk  { background: #1A1A1A; }
.wt  { background: #FFFFFF; }
.yw  { background: #F5C800; }

/* chrome */
.top-bar { position: absolute; top: 0; left: 0; right: 0; height: 8px; background: #F5C800; z-index: 4; }

.right-strip {
  position: absolute; top: 0; right: 0; bottom: 0; width: 40px;
  border-left: 1px solid #2E2E2E;
  display: flex; align-items: center; justify-content: center; z-index: 4;
}
.right-strip span {
  font-family: 'Inter', sans-serif; font-weight: 500; font-size: 11px;
  letter-spacing: 0.22em; color: #444444; text-transform: uppercase;
  transform: rotate(90deg); white-space: nowrap;
}

.left-gutter { position: absolute; top: 0; left: 0; bottom: 0; width: 8px; background: #F5C800; z-index: 4; }

/* bottom strips */
.bot-yw {
  position: absolute; bottom: 0; left: 0; right: 40px; height: 160px;
  background: #F5C800;
  display: flex; flex-direction: row; align-items: center;
  justify-content: space-between; padding: 0 60px; z-index: 3;
}
.bot-dk {
  position: absolute; bottom: 0; left: 0; right: 0; height: 120px;
  background: #0D0D0D;
  display: flex; flex-direction: row; align-items: center;
  justify-content: space-between; padding: 0 80px; z-index: 3;
}

/* hook pill */
.pill {
  display: inline-flex; align-items: center;
  background: rgba(245,200,0,0.12); border: 1px solid rgba(245,200,0,0.28);
  padding: 18px 40px; margin-top: 56px;
  font-family: 'Inter', sans-serif; font-weight: 300;
  font-size: 32px; color: rgba(255,255,255,0.68); line-height: 1.45;
  max-width: 860px;
}

/* stat rows */
.stats { margin-top: 60px; }
.sr { display: flex; flex-direction: row; align-items: baseline; gap: 28px; padding: 34px 0; border-bottom: 1px solid #2E2E2E; }
.sr:first-child { border-top: 1px solid #2E2E2E; }
.sr-lbl { font-family: 'Inter', sans-serif; font-weight: 300; font-size: 32px; color: rgba(255,255,255,0.42); flex: 1; line-height: 1.4; }
.sr-val { font-family: 'Bebas Neue', sans-serif; font-size: 88px; line-height: 1; color: #F5C800; }

/* list split layout */
.split-left {
  width: 220px; background: #0D0D0D; flex-shrink: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: space-between;
  padding: 64px 0 52px;
}
.split-right {
  flex: 1; display: flex; flex-direction: column;
  justify-content: space-between;
  padding: 64px 80px 64px 56px; overflow: hidden;
}

/* list items */
.li { display: flex; flex-direction: row; align-items: flex-start; gap: 36px; padding: 34px 0; border-top: 1px solid #2E2E2E; }
.li:last-child { border-bottom: 1px solid #2E2E2E; }
.li-n { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 12px; color: rgba(255,255,255,0.20); letter-spacing: 0.12em; min-width: 28px; padding-top: 8px; }
.li-title { font-family: 'DM Serif Display', serif; font-size: 40px; color: #FFFFFF; line-height: 1.25; margin-bottom: 10px; }
.li-desc { font-family: 'Inter', sans-serif; font-weight: 300; font-size: 28px; color: rgba(255,255,255,0.44); line-height: 1.55; }

/* findings two-col */
.fg { display: grid; grid-template-columns: 1fr 1fr; margin-top: 60px; }
.fi { padding: 40px 0; border-bottom: 1px solid #E4E4E4; }
.fi:nth-child(odd)  { padding-right: 56px; }
.fi:nth-child(even) { padding-left: 56px; border-left: 1px solid #E4E4E4; }
.fi:nth-last-child(-n+2) { border-bottom: none; }
.fi-title { font-family: 'DM Serif Display', serif; font-size: 40px; color: #0D0D0D; line-height: 1.2; margin-bottom: 14px; }
.fi-desc { font-family: 'Inter', sans-serif; font-weight: 300; font-size: 28px; color: #888888; line-height: 1.60; }

/* company/grid two-col */
.cg { display: grid; grid-template-columns: 1fr 1fr; margin-top: 60px; }
.ci { padding: 28px 0; border-bottom: 1px solid #E4E4E4; }
.ci:nth-child(odd)  { padding-right: 48px; }
.ci:nth-child(even) { padding-left: 48px; border-left: 1px solid #E4E4E4; }
.ci:nth-last-child(-n+2) { border-bottom: none; }
.ci-name { font-family: 'DM Serif Display', serif; font-size: 38px; color: #0D0D0D; line-height: 1.25; margin-bottom: 4px; }
.ci-role { font-family: 'Inter', sans-serif; font-weight: 300; font-size: 26px; color: #999999; }

/* cta button */
.cta-btn {
  display: inline-flex; align-items: center; gap: 16px;
  background: #0D0D0D; padding: 26px 48px; margin-top: 56px;
  font-family: 'Inter', sans-serif; font-weight: 700;
  font-size: 18px; letter-spacing: 0.12em; color: #F5C800; text-transform: uppercase;
}
`;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ~ prefix → yellow italic accent (editorial "hot word")
function accent(text: string): string {
  if (text.startsWith('~')) {
    return `<em style="color:#F5C800;font-style:italic;">${esc(text.slice(1))}</em>`;
  }
  return esc(text);
}

function hl(s: Slide): string {
  return [s.headline, s.headline2, s.headline3]
    .filter(Boolean)
    .map(t => accent(t!))
    .join('<br>');
}

// Font size based on total headline character count
function hs(s: Slide, light = false): string {
  const chars = [s.headline, s.headline2, s.headline3]
    .filter(Boolean)
    .map(t => t!.replace(/^~/, '').length)
    .reduce((a, b) => a + b, 0);
  const color = light ? '#0D0D0D' : '#FFFFFF';
  if (chars <= 22) return `font-size:148px;line-height:0.92;letter-spacing:-0.03em;color:${color};`;
  if (chars <= 38) return `font-size:120px;line-height:0.93;letter-spacing:-0.028em;color:${color};`;
  return                 `font-size:96px;line-height:0.95;letter-spacing:-0.022em;color:${color};`;
}

function prog(index: number, total: number, light: boolean, bottom = 0): string {
  const pct = (((index + 1) / total) * 100).toFixed(1);
  const track = light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.10)';
  return `<div style="position:absolute;bottom:${bottom}px;left:0;right:0;height:3px;background:${track};z-index:10;"><div style="width:${pct}%;height:100%;background:#F5C800;"></div></div>`;
}

function num(n: number): string {
  return String(n).padStart(2, '0');
}

// ─── Slide builders ─────────────────────────────────────────────────────────

function buildHook(s: Slide, pageName: string, handle: string, index: number, total: number): string {
  const pill = s.pill ? `<div class="pill">${esc(s.pill)}</div>` : '';
  return `<section class="slide dk${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  <div class="top-bar"></div>
  <div class="right-strip"><span>${index + 1} / ${total} — ${esc(pageName)}</span></div>
  <div style="position:absolute;inset:0;right:40px;padding:80px 80px 200px 80px;display:flex;flex-direction:column;justify-content:flex-end;z-index:2;">
    <p style="font-family:'Inter',sans-serif;font-weight:700;font-size:13px;letter-spacing:0.18em;color:#F5C800;text-transform:uppercase;margin-bottom:28px;">${esc(pageName)}</p>
    <div style="font-family:'DM Serif Display',serif;font-weight:400;${hs(s)}">${hl(s)}</div>
    ${pill}
  </div>
  <div class="bot-yw">
    <div>
      <p style="font-family:'Inter',sans-serif;font-weight:700;font-size:18px;letter-spacing:0.04em;color:#0D0D0D;">${esc(pageName)}</p>
      <p style="font-family:'Inter',sans-serif;font-weight:300;font-size:14px;color:#5A4C00;letter-spacing:0.04em;margin-top:4px;">${esc(handle)}</p>
    </div>
    <span style="font-family:'Bebas Neue',sans-serif;font-size:140px;line-height:1;color:#0D0D0D;opacity:0.12;">${num(index + 1)}</span>
  </div>
  ${prog(index, total, false, 160)}
</section>`;
}

function buildData(s: Slide, handle: string, index: number, total: number): string {
  const stats = (s.stats ?? [])
    .map(st => `<div class="sr"><span class="sr-lbl">${esc(st.label)}</span><span class="sr-val">${esc(st.value)}</span></div>`)
    .join('');
  const footnote = s.footnote
    ? `<p style="margin-top:36px;font-family:'Inter',sans-serif;font-weight:300;font-size:26px;color:rgba(255,255,255,0.30);line-height:1.55;">${esc(s.footnote)}</p>`
    : '';
  return `<section class="slide dk" id="slide-${s.id}">
  <div class="top-bar"></div>
  <div class="right-strip"><span>${index + 1} / ${total} — ${esc(handle)}</span></div>
  <div style="position:absolute;top:8px;left:0;right:40px;padding:72px 80px 80px;z-index:2;">
    <p style="font-family:'Inter',sans-serif;font-weight:700;font-size:13px;letter-spacing:0.18em;color:#F5C800;text-transform:uppercase;margin-bottom:44px;">Data</p>
    <div style="font-family:'DM Serif Display',serif;font-weight:400;${hs(s)}">${hl(s)}</div>
    <div class="stats">${stats}</div>
    ${footnote}
  </div>
  ${prog(index, total, false)}
</section>`;
}

function buildInsight(s: Slide, index: number, total: number): string {
  const body = s.body
    ? `<p style="font-family:'Inter',sans-serif;font-weight:300;font-size:33px;line-height:1.65;color:#555555;margin-top:56px;max-width:880px;">${esc(s.body)}</p>`
    : '';
  const supporting = s.supporting
    ? `<p style="font-family:'Inter',sans-serif;font-weight:400;font-size:30px;line-height:1.55;color:#AAAAAA;margin-top:28px;max-width:880px;">${esc(s.supporting)}</p>`
    : '';
  return `<section class="slide wt" id="slide-${s.id}">
  <div class="left-gutter"></div>
  <div style="position:absolute;top:0;left:8px;right:0;padding:64px 80px 0 64px;display:flex;justify-content:space-between;align-items:center;z-index:2;">
    <span style="font-family:'Inter',sans-serif;font-weight:700;font-size:11px;letter-spacing:0.20em;color:#CCCCCC;text-transform:uppercase;">Insight</span>
    <span style="font-family:'Inter',sans-serif;font-weight:300;font-size:11px;letter-spacing:0.10em;color:#CCCCCC;">${index + 1} / ${total}</span>
  </div>
  <div style="position:absolute;inset:0;left:8px;padding:0 80px 80px 64px;display:flex;flex-direction:column;justify-content:center;z-index:1;">
    <div style="font-family:'DM Serif Display',serif;font-weight:400;${hs(s, true)}">${hl(s)}</div>
    <div style="width:100%;height:1px;background:#E8E8E8;margin-top:52px;"></div>
    ${body}
    ${supporting}
  </div>
  ${prog(index, total, true)}
</section>`;
}

function buildList(s: Slide, handle: string, index: number, total: number): string {
  const steps = s.steps ?? [];
  const items = steps
    .map((step, i) => `<div class="li">
      <span class="li-n">${num(i + 1)}</span>
      <div>
        <div class="li-title">${esc(step.title)}</div>
        <div class="li-desc">${esc(step.desc)}</div>
      </div>
    </div>`)
    .join('');
  return `<section class="slide dk" id="slide-${s.id}">
  <div style="display:flex;flex-direction:row;width:1080px;height:1350px;">
    <div class="split-left">
      <span style="font-family:'Inter',sans-serif;font-weight:500;font-size:10px;letter-spacing:0.22em;color:#444444;text-transform:uppercase;writing-mode:vertical-rl;transform:rotate(180deg);">Steps</span>
      <span style="font-family:'Bebas Neue',sans-serif;font-size:200px;line-height:1;color:#F5C800;letter-spacing:-0.02em;">${num(index + 1)}</span>
      <div style="width:28px;height:1px;background:#2E2E2E;"></div>
    </div>
    <div class="split-right">
      <div>
        <p style="font-family:'Inter',sans-serif;font-weight:500;font-size:11px;letter-spacing:0.20em;color:#555555;text-transform:uppercase;margin-bottom:28px;">${index + 1} / ${total} — ${esc(handle)}</p>
        <div style="font-family:'DM Serif Display',serif;font-weight:400;font-size:88px;line-height:0.93;letter-spacing:-0.025em;color:#FFFFFF;margin-bottom:52px;">${hl(s)}</div>
        <div style="width:40px;height:4px;background:#F5C800;margin-bottom:0;"></div>
      </div>
      <div>${items}</div>
      <span style="font-family:'Inter',sans-serif;font-weight:300;font-size:11px;letter-spacing:0.14em;color:#333333;text-transform:uppercase;">Swipe →</span>
    </div>
  </div>
  ${prog(index, total, false)}
</section>`;
}

function buildGrid(s: Slide, index: number, total: number): string {
  const items = (s.items ?? [])
    .map(it => `<div class="ci"><div class="ci-name">${esc(it.name)}</div><div class="ci-role">${esc(it.role)}</div></div>`)
    .join('');
  return `<section class="slide wt" id="slide-${s.id}">
  <div class="left-gutter"></div>
  <div style="position:absolute;top:0;left:8px;right:0;padding:64px 80px 0 64px;display:flex;justify-content:space-between;align-items:center;z-index:2;">
    <span style="font-family:'Inter',sans-serif;font-weight:700;font-size:11px;letter-spacing:0.20em;color:#CCCCCC;text-transform:uppercase;">Overview</span>
    <span style="font-family:'Inter',sans-serif;font-weight:300;font-size:11px;letter-spacing:0.10em;color:#CCCCCC;">${index + 1} / ${total}</span>
  </div>
  <div style="position:absolute;inset:0;left:8px;padding:0 80px 80px 64px;display:flex;flex-direction:column;justify-content:center;z-index:1;">
    <div style="font-family:'DM Serif Display',serif;font-weight:400;${hs(s, true)}">${hl(s)}</div>
    <div class="cg">${items}</div>
  </div>
  ${prog(index, total, true)}
</section>`;
}

function buildFindings(s: Slide, index: number, total: number): string {
  const items = (s.items ?? [])
    .map(it => `<div class="fi"><div class="fi-title">${esc(it.name)}</div><div class="fi-desc">${esc(it.role)}</div></div>`)
    .join('');
  return `<section class="slide wt" id="slide-${s.id}">
  <div class="left-gutter"></div>
  <div style="position:absolute;top:0;left:8px;right:0;padding:64px 80px 0 64px;display:flex;justify-content:space-between;align-items:center;z-index:2;">
    <span style="font-family:'Inter',sans-serif;font-weight:700;font-size:11px;letter-spacing:0.20em;color:#CCCCCC;text-transform:uppercase;">Findings</span>
    <span style="font-family:'Inter',sans-serif;font-weight:300;font-size:11px;letter-spacing:0.10em;color:#CCCCCC;">${index + 1} / ${total}</span>
  </div>
  <div style="position:absolute;inset:0;left:8px;padding:0 80px 80px 64px;display:flex;flex-direction:column;justify-content:center;z-index:1;">
    <div style="font-family:'DM Serif Display',serif;font-weight:400;${hs(s, true)}">${hl(s)}</div>
    <div class="fg">${items}</div>
  </div>
  ${prog(index, total, true)}
</section>`;
}

function buildCTA(s: Slide, handle: string, pageName: string, index: number, total: number): string {
  const tagline = s.tagline
    ? `<p style="font-family:'Inter',sans-serif;font-weight:300;font-size:33px;line-height:1.65;color:#5A4C00;margin-top:32px;max-width:800px;">${esc(s.tagline)}</p>`
    : '';
  return `<section class="slide yw" id="slide-${s.id}">
  <div style="position:absolute;top:0;left:0;right:0;padding:60px 80px 0;display:flex;justify-content:space-between;align-items:center;z-index:2;">
    <span style="font-family:'Inter',sans-serif;font-weight:700;font-size:11px;letter-spacing:0.22em;color:#0D0D0D;text-transform:uppercase;">That&apos;s a wrap</span>
    <span style="font-family:'Inter',sans-serif;font-weight:300;font-size:11px;letter-spacing:0.10em;color:#8A7500;">${index + 1} / ${total}</span>
  </div>
  <div style="position:absolute;inset:0;padding:0 80px 160px;display:flex;flex-direction:column;justify-content:center;z-index:1;">
    <div style="font-family:'DM Serif Display',serif;font-weight:400;font-size:136px;line-height:0.92;letter-spacing:-0.03em;color:#0D0D0D;">${esc(pageName)}.</div>
    ${tagline}
    <div class="cta-btn">${esc(handle)} &rarr;</div>
  </div>
  <div class="bot-dk">
    <span style="font-family:'Inter',sans-serif;font-weight:300;font-size:13px;letter-spacing:0.14em;color:#444444;text-transform:uppercase;">Follow for more</span>
    <span style="font-family:'Bebas Neue',sans-serif;font-size:88px;line-height:1;color:#F5C800;opacity:0.60;">${num(index + 1)}</span>
  </div>
  ${prog(index, total, true)}
</section>`;
}

// ─── Public entry point ──────────────────────────────────────────────────────

export function buildEditorialHTML(slides: Slide[], meta: CarouselMeta): string {
  const total = slides.length;
  const slidesHTML = slides
    .map((s, i) => {
      switch (s.type) {
        case 'hook':     return buildHook(s, meta.pageName, meta.handle, i, total);
        case 'data':     return buildData(s, meta.handle, i, total);
        case 'insight':  return buildInsight(s, i, total);
        case 'list':     return buildList(s, meta.handle, i, total);
        case 'grid':     return buildGrid(s, i, total);
        case 'findings': return buildFindings(s, i, total);
        case 'cta':      return buildCTA(s, meta.handle, meta.pageName, i, total);
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
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${slidesHTML}
</body>
</html>`;
}
