import type { Slide, CarouselMeta } from './types';

// Figr-B: figr.design toolkit style. ALL light slides.
// White hook, dot-grid content slides with centered card. Cyan accent #00C8B4.
// Use for: playbooks, toolkits, step-by-step educational carousels.

const CYAN = '#00C8B4';

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; background: #FAFAFA; font-family: 'Inter', sans-serif; }

.fb-slide { width: 1080px; height: 1350px; display: none; position: relative; overflow: hidden; }
.fb-slide.active { display: block; }

/* HOOK SLIDE */
.fb-hook {
  background: #FFFFFF;
  display: flex; flex-direction: column;
  justify-content: center;
  padding: 90px;
  position: relative; overflow: hidden;
}
.fb-hook::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 560px; height: 560px;
  border-radius: 50%;
  border: 1.5px solid rgba(0,200,180,0.18);
  pointer-events: none;
}
.fb-hook::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 380px; height: 380px;
  border-radius: 50%;
  border: 1.5px solid rgba(0,200,180,0.10);
  pointer-events: none;
}

.fb-hook-content { position: relative; z-index: 1; }

/* CHIP */
.fb-chip {
  display: inline-block;
  background: ${CYAN}; color: #fff;
  font-size: 18px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.12em;
  padding: 10px 22px; border-radius: 4px;
  margin-bottom: 44px; align-self: flex-start;
}

/* HOOK HEADLINE */
.fb-h1 {
  font-size: 86px; font-weight: 700;
  color: #0D0D0D; line-height: 1.06;
  letter-spacing: -0.025em;
  max-width: 920px; margin-bottom: 0;
}

/* HOOK RULE */
.fb-hook-rule { width: 80px; height: 3px; background: ${CYAN}; margin: 24px 0 36px; }

/* HOOK SUBTITLE */
.fb-hook-sub {
  font-size: 28px; font-weight: 400;
  color: #5C5C5C; line-height: 1.45;
  max-width: 880px;
}

/* BOTTOM ACCENT BAR */
.fb-bottom-bar {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 3px; background: ${CYAN};
}

/* CONTENT SLIDE (dot-grid) */
.fb-content {
  background-color: #FAFAFA;
  background-image: radial-gradient(circle, rgba(0,0,0,0.07) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
  display: flex; align-items: center;
  justify-content: center;
  padding: 60px; position: relative;
}

/* CARD */
.fb-card {
  width: 940px;
  background: #FFFFFF;
  border-left: 4px solid ${CYAN};
  box-shadow: 0 8px 48px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05);
  border-radius: 20px;
  padding: 64px 72px;
}

/* BADGE ROW */
.fb-badge-row {
  display: flex; align-items: center;
  gap: 18px; margin-bottom: 36px;
}
.fb-badge-ring {
  width: 72px; height: 72px;
  border-radius: 50%;
  border: 2px solid rgba(0,200,180,0.25);
  display: flex; align-items: center;
  justify-content: center; flex-shrink: 0;
}
.fb-badge {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: ${CYAN};
  display: flex; align-items: center;
  justify-content: center;
  font-size: 28px; font-weight: 700; color: #FFFFFF;
}

/* CARD LABEL */
.fb-card-label {
  font-size: 18px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.14em;
  color: ${CYAN};
}

/* CARD HEADLINE */
.fb-h2 {
  font-size: 56px; font-weight: 700;
  color: #0D0D0D; line-height: 1.15;
  letter-spacing: -0.02em; margin-bottom: 32px;
}

/* CARD RULE */
.fb-card-rule { height: 1px; background: #E8E8E8; margin-bottom: 32px; }

/* CARD BODY */
.fb-body {
  font-size: 28px; font-weight: 400;
  color: #5C5C5C; line-height: 1.55;
}

/* TAG */
.fb-tag {
  display: inline-block;
  background: #E6FAF8; color: ${CYAN};
  font-size: 18px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.1em;
  padding: 8px 16px; border-radius: 4px;
  margin-top: 32px;
}

/* CTA SLIDE */
.fb-cta {
  background: #FFFFFF;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 90px;
  position: relative;
}

/* CTA ARROW WRAP */
.fb-cta-arrow-wrap {
  width: 110px; height: 110px;
  background: #E6FAF8; border-radius: 50%;
  display: flex; align-items: center;
  justify-content: center; margin-bottom: 44px;
}
.fb-cta-arrow { font-size: 50px; color: ${CYAN}; line-height: 1; }

/* CTA HEADLINE */
.fb-cta-h {
  font-size: 54px; font-weight: 700;
  color: #0D0D0D; letter-spacing: -0.02em;
  margin-bottom: 24px;
}

/* CTA SUBTITLE */
.fb-cta-sub { font-size: 28px; color: #5C5C5C; margin-bottom: 48px; }

/* CTA BUTTON */
.fb-cta-btn {
  display: inline-block;
  border: 2px solid ${CYAN}; color: ${CYAN};
  font-family: 'Inter', sans-serif;
  font-size: 20px; font-weight: 500;
  padding: 18px 44px; border-radius: 10px;
}

/* BRAND BLOCK */
.fb-brand {
  position: absolute; bottom: 36px; right: 52px;
  display: flex; flex-direction: column;
  align-items: flex-end; gap: 3px; z-index: 2;
}
.fb-brand-name {
  font-size: 22px; font-weight: 700;
  color: #0D0D0D; line-height: 1;
}
.fb-brand-handle {
  font-size: 18px; font-weight: 500;
  color: ${CYAN}; line-height: 1;
}

/* SLIDE COUNTER */
.fb-counter {
  position: absolute; bottom: 42px; left: 52px;
  font-size: 18px; font-weight: 500;
  letter-spacing: 0.06em; color: #BBBBBB; z-index: 2;
}
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
  return `<div class="fb-brand">
    <span class="fb-brand-name">${esc(pageName)}</span>
    <span class="fb-brand-handle">${esc(handle)}</span>
  </div>`;
}

function counterBlock(index: number, total: number): string {
  return `<div class="fb-counter">${index + 1} / ${total}</div>`;
}

function buildHook(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  return `<section class="fb-slide fb-hook${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  <div class="fb-hook-content">
    <div class="fb-chip">${esc(meta.pageName || 'How To')}</div>
    <div class="fb-h1">${headlineLines(s)}</div>
    <div class="fb-hook-rule"></div>
    <div class="fb-hook-sub">${esc(s.pill ?? '')}</div>
  </div>
  <div class="fb-bottom-bar"></div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildInsight(
  s: Slide,
  meta: CarouselMeta,
  index: number,
  total: number,
  contentIndex: number,
): string {
  const tagText = s.supporting ?? meta.topic.slice(0, 20).toUpperCase();
  return `<section class="fb-slide fb-content" id="slide-${s.id}">
  <div class="fb-card">
    <div class="fb-badge-row">
      <div class="fb-badge-ring">
        <div class="fb-badge">${contentIndex}</div>
      </div>
      <div class="fb-card-label">${esc(s.pill ?? 'Tip')}</div>
    </div>
    <div class="fb-h2">${headlineLines(s)}</div>
    <div class="fb-card-rule"></div>
    <div class="fb-body">${esc(s.body ?? '')}</div>
    <div class="fb-tag">${esc(tagText)}</div>
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildData(
  s: Slide,
  meta: CarouselMeta,
  index: number,
  total: number,
  contentIndex: number,
): string {
  const statsHTML = (s.stats ?? [])
    .map(
      st =>
        `      <div style="display:flex;gap:16px;padding:18px 0;border-bottom:1px solid #F0F0F0;align-items:center;">` +
        `<span style="font-size:24px;font-weight:400;color:#6B6B6B;flex:1;">${esc(st.label)}</span>` +
        `<span style="font-size:44px;font-weight:700;color:${CYAN};letter-spacing:-0.02em;line-height:1;">${esc(st.value)}</span>` +
        `</div>`,
    )
    .join('\n');
  const footnoteHTML = s.footnote
    ? `<div style="margin-top:24px;font-size:20px;font-weight:400;color:#9E9E9E;line-height:1.5;">${esc(s.footnote)}</div>`
    : '';
  return `<section class="fb-slide fb-content" id="slide-${s.id}">
  <div class="fb-card">
    <div class="fb-badge-row">
      <div class="fb-badge-ring">
        <div class="fb-badge">${contentIndex}</div>
      </div>
    </div>
    <div class="fb-h2">${headlineLines(s)}</div>
    <div class="fb-card-rule"></div>
    <div style="display:flex;flex-direction:column;">
${statsHTML}
    </div>
    ${footnoteHTML}
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildList(
  s: Slide,
  meta: CarouselMeta,
  index: number,
  total: number,
  contentIndex: number,
): string {
  const steps = s.steps ?? [];
  const itemsHTML = steps
    .map((step, i) => {
      const num = String(i + 1).padStart(2, '0');
      return (
        `      <div style="display:flex;align-items:flex-start;gap:22px;padding:18px 0;border-top:1px solid #F0F0F0;">` +
        `<span style="font-size:14px;font-weight:700;color:${CYAN};letter-spacing:0.06em;min-width:28px;padding-top:4px;">${num}</span>` +
        `<div>` +
        `<div style="font-size:26px;font-weight:700;color:#0D0D0D;line-height:1.3;margin-bottom:5px;">${esc(step.title)}</div>` +
        `<div style="font-size:22px;font-weight:400;color:#6B6B6B;line-height:1.55;">${esc(step.desc)}</div>` +
        `</div></div>`
      );
    })
    .join('\n');
  return `<section class="fb-slide fb-content" id="slide-${s.id}">
  <div class="fb-card">
    <div class="fb-badge-row">
      <div class="fb-badge-ring">
        <div class="fb-badge">${contentIndex}</div>
      </div>
    </div>
    <div class="fb-h2">${headlineLines(s)}</div>
    <div class="fb-card-rule"></div>
    <div style="display:flex;flex-direction:column;">
${itemsHTML}
    </div>
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildGrid(
  s: Slide,
  meta: CarouselMeta,
  index: number,
  total: number,
  contentIndex: number,
): string {
  const itemsHTML = (s.items ?? [])
    .map(
      item =>
        `      <div style="padding:18px 0;border-bottom:1px solid #F0F0F0;">` +
        `<div style="font-size:26px;font-weight:700;color:#0D0D0D;line-height:1.3;margin-bottom:4px;">${esc(item.name)}</div>` +
        `<div style="font-size:22px;font-weight:400;color:#6B6B6B;line-height:1.5;">${esc(item.role)}</div>` +
        `</div>`,
    )
    .join('\n');
  return `<section class="fb-slide fb-content" id="slide-${s.id}">
  <div class="fb-card">
    <div class="fb-badge-row">
      <div class="fb-badge-ring">
        <div class="fb-badge">${contentIndex}</div>
      </div>
    </div>
    <div class="fb-h2">${headlineLines(s)}</div>
    <div class="fb-card-rule"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 40px;">
${itemsHTML}
    </div>
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildFindings(
  s: Slide,
  meta: CarouselMeta,
  index: number,
  total: number,
  contentIndex: number,
): string {
  const itemsHTML = (s.items ?? [])
    .map(
      (item, i) =>
        `      <div style="padding:20px 0;border-bottom:1px solid #F0F0F0;${i % 2 === 1 ? 'padding-left:36px;border-left:1px solid #F0F0F0;' : 'padding-right:36px;'}">` +
        `<div style="font-size:26px;font-weight:700;color:#0D0D0D;line-height:1.3;margin-bottom:5px;">${esc(item.name)}</div>` +
        `<div style="font-size:22px;font-weight:400;color:#6B6B6B;line-height:1.55;">${esc(item.role)}</div>` +
        `</div>`,
    )
    .join('\n');
  return `<section class="fb-slide fb-content" id="slide-${s.id}">
  <div class="fb-card">
    <div class="fb-badge-row">
      <div class="fb-badge-ring">
        <div class="fb-badge">${contentIndex}</div>
      </div>
    </div>
    <div class="fb-h2">${headlineLines(s)}</div>
    <div class="fb-card-rule"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;">
${itemsHTML}
    </div>
  </div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

function buildCTA(s: Slide, meta: CarouselMeta, index: number, total: number): string {
  return `<section class="fb-slide fb-cta" id="slide-${s.id}">
  <div class="fb-cta-arrow-wrap">
    <div class="fb-cta-arrow">&#8595;</div>
  </div>
  <div class="fb-cta-h">Follow ${esc(meta.pageName)}</div>
  <div class="fb-cta-sub">${esc(s.tagline ?? 'Weekly frameworks for design leads.')}</div>
  <div class="fb-cta-btn">Visit us &#8594;</div>
  <div class="fb-bottom-bar"></div>
  ${brandBlock(meta.pageName, meta.handle)}
  ${counterBlock(index, total)}
</section>`;
}

export function buildFigrBHTML(slides: Slide[], meta: CarouselMeta): string {
  const total = slides.length;
  let contentIndex = 0;

  const slidesHTML = slides
    .map((s, i) => {
      switch (s.type) {
        case 'hook':
          return buildHook(s, meta, i, total);
        case 'insight': {
          contentIndex += 1;
          return buildInsight(s, meta, i, total, contentIndex);
        }
        case 'data': {
          contentIndex += 1;
          return buildData(s, meta, i, total, contentIndex);
        }
        case 'list': {
          contentIndex += 1;
          return buildList(s, meta, i, total, contentIndex);
        }
        case 'grid': {
          contentIndex += 1;
          return buildGrid(s, meta, i, total, contentIndex);
        }
        case 'findings': {
          contentIndex += 1;
          return buildFindings(s, meta, i, total, contentIndex);
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
