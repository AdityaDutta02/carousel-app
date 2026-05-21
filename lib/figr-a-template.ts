import type { Slide, CarouselMeta } from './types';

// Figr-A: figr.design manifesto style. Inter font. Alternating dark/light.
// Dot-grid backgrounds. Cyan accent #00C8B4. Deep navy dark #0F172A.
// Use for: design-forward content, manifesto/thesis carousels, premium branding topics.

const CYAN = '#00C8B4';

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; background: #0F172A; font-family: 'Inter', sans-serif; }

.fa-slide { width: 1080px; height: 1350px; display: none; position: relative; overflow: hidden; }
.fa-slide.active { display: block; }

/* DARK SLIDE */
.fa-dk {
  background-color: #0F172A;
  background-image: radial-gradient(circle, rgba(255,255,255,0.09) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
}
.fa-dk::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,200,180,0.12) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}
.fa-dk::after {
  content: '';
  position: absolute;
  bottom: -160px; left: -160px;
  width: 320px; height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,200,180,0.06) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

/* LIGHT SLIDE */
.fa-lt {
  background-color: #FAFAFA;
  background-image: radial-gradient(circle, rgba(0,0,0,0.10) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
}

/* CTA SLIDE — same dark base as fa-dk */
.fa-cta {
  background-color: #0F172A;
  background-image: radial-gradient(circle, rgba(255,255,255,0.09) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
}
.fa-cta::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,200,180,0.12) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}
.fa-cta::after {
  content: '';
  position: absolute;
  bottom: -160px; left: -160px;
  width: 320px; height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,200,180,0.06) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

/* INNER LAYOUT */
.fa-inner {
  position: relative; z-index: 1;
  display: flex; flex-direction: column;
  justify-content: center;
  height: 100%; padding: 90px;
}

/* CHIP / PILL */
.fa-chip {
  display: inline-block;
  background: ${CYAN}; color: #fff;
  font-size: 18px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.12em;
  padding: 10px 22px; border-radius: 4px;
  margin-bottom: 44px; align-self: flex-start;
}

/* MAIN HEADLINE — hook */
.fa-h1 {
  font-size: 92px; font-weight: 700;
  line-height: 1.04; letter-spacing: -0.03em;
  max-width: 880px; margin-bottom: 36px;
}
.fa-dk .fa-h1 { color: #F1F5F9; }
.fa-lt .fa-h1 { color: #0D0D0D; }

/* HOOK SUBTITLE */
.fa-hook-sub {
  font-size: 28px; font-weight: 400; line-height: 1.4;
}
.fa-dk .fa-hook-sub { color: rgba(255,255,255,0.62); }
.fa-lt .fa-hook-sub { color: #6B6B6B; }

/* HOOK CYAN LEFT BAR */
.fa-cyan-bar {
  position: absolute; left: 0; top: 50%;
  transform: translateY(-50%);
  width: 5px; height: 180px;
  background: linear-gradient(180deg, transparent, ${CYAN} 40%, ${CYAN} 60%, transparent);
  border-radius: 0 3px 3px 0; z-index: 1;
}

/* LABEL — above secondary headline */
.fa-label {
  font-size: 18px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: ${CYAN}; margin-bottom: 24px;
}

/* SECONDARY HEADLINE */
.fa-h2 {
  font-size: 68px; font-weight: 700;
  line-height: 1.08; letter-spacing: -0.03em;
  margin-bottom: 0;
}
.fa-dk .fa-h2 { color: #F1F5F9; }
.fa-lt .fa-h2 { color: #0D0D0D; }

/* RULE */
.fa-rule { width: 64px; height: 3px; background: ${CYAN}; margin: 22px 0 36px; }

/* BODY */
.fa-body {
  font-size: 28px; font-weight: 400;
  line-height: 1.55; max-width: 860px;
}
.fa-dk .fa-body { color: rgba(255,255,255,0.62); }
.fa-lt .fa-body { color: #5C5C5C; }

/* GHOST NUMBER */
.fa-ghost {
  position: absolute; top: 60px; right: 40px;
  font-size: 220px; font-weight: 700;
  line-height: 1; letter-spacing: -0.05em;
  z-index: 0; user-select: none; pointer-events: none;
}
.fa-dk .fa-ghost { color: rgba(255,255,255,0.04); }
.fa-lt .fa-ghost { color: #EBEBEB; }

/* CTA INNER */
.fa-cta-inner {
  position: relative; z-index: 1;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 100%; text-align: center; padding: 90px;
}

/* CTA HEADLINE */
.fa-cta-h {
  font-size: 68px; font-weight: 700;
  color: #F1F5F9; letter-spacing: -0.025em;
  margin-bottom: 28px; max-width: 760px; line-height: 1.08;
}

/* CTA SUBTITLE */
.fa-cta-sub {
  font-size: 28px; font-weight: 400;
  color: rgba(255,255,255,0.6);
  margin-bottom: 48px; line-height: 1.5;
}

/* CTA HANDLE */
.fa-cta-handle { font-size: 28px; font-weight: 500; color: ${CYAN}; }

/* BRAND BLOCK */
.fa-brand {
  position: absolute; bottom: 36px; right: 52px;
  display: flex; flex-direction: column;
  align-items: flex-end; gap: 3px; z-index: 2;
}
.fa-brand-name {
  font-size: 22px; font-weight: 700;
  letter-spacing: -0.01em; line-height: 1;
}
.fa-dk .fa-brand-name { color: #F1F5F9; }
.fa-cta .fa-brand-name { color: #F1F5F9; }
.fa-lt .fa-brand-name { color: #0D0D0D; }
.fa-brand-handle { font-size: 18px; font-weight: 500; color: ${CYAN}; line-height: 1; }

/* SLIDE COUNTER */
.fa-counter {
  position: absolute; bottom: 42px; left: 52px;
  font-size: 18px; font-weight: 500;
  letter-spacing: 0.06em; z-index: 2;
}
.fa-dk .fa-counter { color: rgba(255,255,255,0.30); }
.fa-cta .fa-counter { color: rgba(255,255,255,0.30); }
.fa-lt .fa-counter { color: #BBBBBB; }
`;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function headlineLines(s: Slide): string {
  return [s.headline, s.headline2, s.headline3]
    .filter(Boolean)
    .map(t => esc(t!))
    .join('<br>');
}

function brandBlock(pageName: string, handle: string): string {
  return `<div class="fa-brand">
    <span class="fa-brand-name">${esc(pageName)}</span>
    <span class="fa-brand-handle">${esc(handle)}</span>
  </div>`;
}

function counterBlock(index: number, total: number): string {
  return `<div class="fa-counter">${index + 1} / ${total}</div>`;
}

function buildHook(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  return `<section class="fa-slide fa-lt${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  <div class="fa-cyan-bar"></div>
  <div class="fa-inner">
    <div class="fa-chip">${esc(meta.pageName)}</div>
    <div class="fa-h1">${headlineLines(s)}</div>
    <div class="fa-hook-sub">${esc(s.pill ?? '')}</div>
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildInsight(
  s: Slide,
  meta: CarouselMeta,
  index: number,
  total: number,
  contentSeq: number,
): string {
  const isDark = index % 2 === 1;
  const themeClass = isDark ? 'fa-dk' : 'fa-lt';
  const ghostNum = String(contentSeq).padStart(2, '0');
  return `<section class="fa-slide ${themeClass}" id="slide-${s.id}">
  <div class="fa-ghost">${ghostNum}</div>
  <div class="fa-inner">
    <div class="fa-label">${esc(s.pill ?? 'Tip')}</div>
    <div class="fa-h2">${headlineLines(s)}</div>
    <div class="fa-rule"></div>
    <div class="fa-body">${esc(s.body ?? '')}</div>
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildData(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  const statsHTML = (s.stats ?? [])
    .map(
      st =>
        `    <div style="display:flex;gap:16px;padding:18px 0;border-bottom:1px solid rgba(255,255,255,0.10);">` +
        `<span style="font-size:24px;font-weight:400;color:rgba(255,255,255,0.50);flex:1;">${esc(st.label)}</span>` +
        `<span style="font-size:44px;font-weight:700;color:${CYAN};letter-spacing:-0.02em;line-height:1;">${esc(st.value)}</span>` +
        `</div>`,
    )
    .join('\n');
  return `<section class="fa-slide fa-dk" id="slide-${s.id}">
  <div class="fa-inner">
    <div class="fa-h2">${headlineLines(s)}</div>
    <div class="fa-rule"></div>
    <div style="display:flex;flex-direction:column;margin-top:8px;">
${statsHTML}
    </div>
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildList(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  const steps = s.steps ?? [];
  const itemsHTML = steps
    .map((step, i) => {
      const num = String(i + 1).padStart(2, '0');
      return (
        `    <div style="display:flex;align-items:flex-start;gap:28px;padding:22px 0;border-top:1px solid rgba(255,255,255,0.08);">` +
        `<span style="font-size:14px;font-weight:700;color:${CYAN};letter-spacing:0.06em;min-width:32px;padding-top:4px;">${num}</span>` +
        `<div>` +
        `<div style="font-size:28px;font-weight:700;color:#F1F5F9;line-height:1.3;margin-bottom:6px;">${esc(step.title)}</div>` +
        `<div style="font-size:24px;font-weight:400;color:rgba(255,255,255,0.50);line-height:1.55;">${esc(step.desc)}</div>` +
        `</div></div>`
      );
    })
    .join('\n');
  return `<section class="fa-slide fa-dk" id="slide-${s.id}">
  <div class="fa-inner" style="justify-content:flex-start;padding-top:110px;">
    <div class="fa-h2">${headlineLines(s)}</div>
    <div class="fa-rule"></div>
    <div style="display:flex;flex-direction:column;">
${itemsHTML}
    </div>
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildGrid(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  const itemsHTML = (s.items ?? [])
    .map(
      item =>
        `      <div style="padding:22px 0;border-bottom:1px solid #E0E0E0;">` +
        `<div style="font-size:28px;font-weight:700;color:#0D0D0D;line-height:1.3;margin-bottom:5px;">${esc(item.name)}</div>` +
        `<div style="font-size:24px;font-weight:400;color:#6B6B6B;line-height:1.5;">${esc(item.role)}</div>` +
        `</div>`,
    )
    .join('\n');
  return `<section class="fa-slide fa-lt" id="slide-${s.id}">
  <div class="fa-inner" style="justify-content:flex-start;padding-top:110px;">
    <div class="fa-h2">${headlineLines(s)}</div>
    <div class="fa-rule"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 48px;">
${itemsHTML}
    </div>
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildFindings(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  const itemsHTML = (s.items ?? [])
    .map(
      (item, i) =>
        `      <div style="padding:24px 0;border-bottom:1px solid #E0E0E0;${i % 2 === 1 ? 'padding-left:44px;border-left:1px solid #E0E0E0;' : 'padding-right:44px;'}">` +
        `<div style="font-size:28px;font-weight:700;color:#0D0D0D;line-height:1.3;margin-bottom:6px;">${esc(item.name)}</div>` +
        `<div style="font-size:24px;font-weight:400;color:#6B6B6B;line-height:1.55;">${esc(item.role)}</div>` +
        `</div>`,
    )
    .join('\n');
  return `<section class="fa-slide fa-lt" id="slide-${s.id}">
  <div class="fa-inner" style="justify-content:flex-start;padding-top:110px;">
    <div class="fa-h2">${headlineLines(s)}</div>
    <div class="fa-rule"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;margin-top:8px;">
${itemsHTML}
    </div>
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildCTA(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  return `<section class="fa-slide fa-cta" id="slide-${s.id}">
  <div class="fa-cta-inner">
    <div class="fa-cta-h">${esc(meta.pageName)}</div>
    <div class="fa-cta-sub">${esc(s.tagline ?? 'Follow for more frameworks.')}</div>
    <div class="fa-cta-handle">${esc(meta.handle)}</div>
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

export function buildFigrAHTML(slides: Slide[], meta: CarouselMeta): string {
  const total = slides.length;
  let contentSeq = 0;

  const slidesHTML = slides
    .map((s, i) => {
      switch (s.type) {
        case 'hook':
          return buildHook(s, meta, i, total);
        case 'insight': {
          contentSeq += 1;
          return buildInsight(s, meta, i, total, contentSeq);
        }
        case 'data': {
          contentSeq += 1;
          return buildData(s, meta, i, total);
        }
        case 'list': {
          contentSeq += 1;
          return buildList(s, meta, i, total);
        }
        case 'grid': {
          contentSeq += 1;
          return buildGrid(s, meta, i, total);
        }
        case 'findings': {
          contentSeq += 1;
          return buildFindings(s, meta, i, total);
        }
        case 'cta':
          return buildCTA(s, meta, i, total);
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${slidesHTML}
</body>
</html>`;
}
