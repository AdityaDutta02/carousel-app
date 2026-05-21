import type { Slide, CarouselMeta } from './types';

// Copenhagen (bold-blue-grotesk): electric statement template
// Palette: electric blue #1A1AF0 / soft grey #D8D6D2 / white #FFFFFF / near-black #0D0D0D
// Font: Inter 900 throughout, tight tracking -0.03em
// Eyebrow rail (top): two-piece persistent topic header, NO handle pill
// Footer rail (bottom): two-piece attribution, NO slide counter
// Blue slides: radial vignette + white dot grid pseudo-element
// Grey slides: feTurbulence SVG grain (opacity 0.45, multiply) + blue highlight rectangle on headline
// Cover: blue background, pixel cursor SVG on right, large 4-word hero stack
// Slide type mapping: hook -> blue cover, insight/data/list -> grey statement slides, cta -> blue closing

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; font-family: 'Inter', -apple-system, 'Helvetica Neue', sans-serif; -webkit-font-smoothing: antialiased; }

.slide { width: 1080px; height: 1350px; display: none; position: relative; overflow: hidden; }
.slide.active { display: block; }

/* ---------- BLUE VARIANT ---------- */
.bg-blue {
  background:
    radial-gradient(ellipse 130% 90% at 50% 35%, rgba(80,80,255,0.18) 0%, transparent 60%),
    #1A1AF0;
}
/* Dot grid: small white dots at ~22% opacity, 36px spacing */
.bg-blue::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.22) 1.4px, transparent 1.6px);
  background-size: 36px 36px;
  pointer-events: none;
  z-index: 1;
}

/* ---------- GREY GRAIN VARIANT ---------- */
.bg-grey {
  background: #D8D6D2;
}
/* Heavy feTurbulence grain: newsprint/screenprint texture, multiply blend */
.bg-grey::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.55'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 320px 320px;
  mix-blend-mode: multiply;
  opacity: 0.45;
  pointer-events: none;
  z-index: 1;
}

/* ---------- EYEBROW RAIL: top-left + top-right ---------- */
.rail-top {
  position: absolute;
  top: 76px; left: 90px; right: 90px;
  display: flex; justify-content: space-between;
  z-index: 4;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.005em;
}
.bg-blue .rail-top { color: #FFFFFF; }
.bg-grey .rail-top { color: #0D0D0D; }

/* ---------- FOOTER RAIL: bottom-left + bottom-right ---------- */
.rail-bot {
  position: absolute;
  bottom: 76px; left: 90px; right: 90px;
  display: flex; justify-content: space-between;
  z-index: 4;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.005em;
}
.bg-blue .rail-bot { color: #FFFFFF; }
.bg-grey .rail-bot { color: #0D0D0D; }

/* ---------- PROGRESS BAR ---------- */
.progress-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 5px;
  z-index: 5;
}
.progress-bar-fill {
  height: 100%;
}
.bg-blue .progress-bar { background: rgba(255,255,255,0.18); }
.bg-blue .progress-bar-fill { background: #FFFFFF; }
.bg-grey .progress-bar { background: rgba(0,0,0,0.12); }
.bg-grey .progress-bar-fill { background: #1A1AF0; }

/* ---------- CONTENT PADS ---------- */
/* Body slides: vertically centered */
.pad-center {
  position: absolute;
  inset: 0;
  padding: 0 90px;
  display: flex; flex-direction: column; justify-content: center;
  z-index: 3;
}
/* Cover: top-anchored to leave room for pixel cursor and subtitle */
.pad-cover {
  position: absolute;
  inset: 0;
  padding: 240px 90px 0;
  z-index: 3;
}

/* ---------- TYPOGRAPHY ---------- */
/* Hero cover headline: 4 lines, one word per line */
.h-cover {
  font-weight: 900;
  font-size: 124px;
  line-height: 0.95;
  letter-spacing: -0.035em;
  color: #FFFFFF;
}
/* Standard body headline */
.h-body {
  font-weight: 900;
  font-size: 92px;
  line-height: 0.98;
  letter-spacing: -0.030em;
}
.bg-blue .h-body { color: #FFFFFF; }
.bg-grey .h-body { color: #0D0D0D; }

/* Smaller body headline: use when headline runs 4+ lines */
.h-body-sm {
  font-weight: 900;
  font-size: 76px;
  line-height: 1.00;
  letter-spacing: -0.025em;
}
.bg-blue .h-body-sm { color: #FFFFFF; }
.bg-grey .h-body-sm { color: #0D0D0D; }

/* Subline: regular weight, sits under headline */
.sub {
  font-weight: 500;
  font-size: 60px;
  line-height: 1.06;
  letter-spacing: -0.020em;
  margin-top: 38px;
}
.bg-blue .sub { color: #FFFFFF; }
.bg-grey .sub { color: #0D0D0D; }

/* Cover subtitle: sits below the 4-line hero */
.sub-cover {
  font-weight: 500;
  font-size: 58px;
  line-height: 1.06;
  letter-spacing: -0.020em;
  color: #FFFFFF;
  margin-top: 56px;
}

/* ---------- HIGHLIGHT BLOCK: blue rectangle behind text (grey slides only) ---------- */
/* box-decoration-break: clone ensures each wrapped line gets its own padded blue box.
   Bottom padding is intentionally larger than top to accommodate descenders. */
.highlight {
  display: inline;
  background: #1A1AF0;
  color: #FFFFFF;
  padding: 4px 18px 14px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  line-height: 1.08;
}
/* Wrapper div: extra leading so highlight padding does not crowd adjacent elements */
.h-highlight {
  font-weight: 900;
  font-size: 84px;
  line-height: 1.40;
  letter-spacing: -0.030em;
}

/* ---------- PIXEL CURSOR (cover only) ---------- */
/* Chunky 8-bit arrow cursor SVG: pixelated rendering, no anti-aliasing */
.pixel-cursor {
  position: absolute;
  top: 360px;
  right: 80px;
  width: 280px;
  height: 320px;
  z-index: 3;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  shape-rendering: crispEdges;
}
`;

// Pixel cursor SVG: 18x20 grid, chunky 8-bit arrow, white outline + dark body
const PIXEL_CURSOR_SVG = `<svg class="pixel-cursor" viewBox="0 0 18 20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    <g shape-rendering="crispEdges">
      <rect x="1" y="1" width="2" height="1" fill="#FFFFFF"/>
      <rect x="1" y="2" width="3" height="1" fill="#FFFFFF"/>
      <rect x="1" y="3" width="4" height="1" fill="#FFFFFF"/>
      <rect x="1" y="4" width="5" height="1" fill="#FFFFFF"/>
      <rect x="1" y="5" width="6" height="1" fill="#FFFFFF"/>
      <rect x="1" y="6" width="7" height="1" fill="#FFFFFF"/>
      <rect x="1" y="7" width="8" height="1" fill="#FFFFFF"/>
      <rect x="1" y="8" width="9" height="1" fill="#FFFFFF"/>
      <rect x="1" y="9" width="10" height="1" fill="#FFFFFF"/>
      <rect x="1" y="10" width="11" height="1" fill="#FFFFFF"/>
      <rect x="1" y="11" width="12" height="1" fill="#FFFFFF"/>
      <rect x="1" y="12" width="13" height="1" fill="#FFFFFF"/>
      <rect x="1" y="13" width="6" height="1" fill="#FFFFFF"/>
      <rect x="9" y="13" width="3" height="1" fill="#FFFFFF"/>
      <rect x="1" y="14" width="5" height="1" fill="#FFFFFF"/>
      <rect x="10" y="14" width="3" height="1" fill="#FFFFFF"/>
      <rect x="2" y="15" width="3" height="1" fill="#FFFFFF"/>
      <rect x="10" y="15" width="3" height="1" fill="#FFFFFF"/>
      <rect x="11" y="16" width="3" height="1" fill="#FFFFFF"/>
      <rect x="11" y="17" width="3" height="1" fill="#FFFFFF"/>
      <rect x="12" y="18" width="2" height="1" fill="#FFFFFF"/>
      <rect x="2" y="2" width="1" height="1" fill="#0D0D0D"/>
      <rect x="2" y="3" width="2" height="1" fill="#0D0D0D"/>
      <rect x="2" y="4" width="3" height="1" fill="#0D0D0D"/>
      <rect x="2" y="5" width="4" height="1" fill="#0D0D0D"/>
      <rect x="2" y="6" width="5" height="1" fill="#0D0D0D"/>
      <rect x="2" y="7" width="6" height="1" fill="#0D0D0D"/>
      <rect x="2" y="8" width="7" height="1" fill="#0D0D0D"/>
      <rect x="2" y="9" width="8" height="1" fill="#0D0D0D"/>
      <rect x="2" y="10" width="9" height="1" fill="#0D0D0D"/>
      <rect x="2" y="11" width="10" height="1" fill="#0D0D0D"/>
      <rect x="2" y="12" width="4" height="1" fill="#0D0D0D"/>
      <rect x="8" y="12" width="4" height="1" fill="#0D0D0D"/>
      <rect x="2" y="13" width="4" height="1" fill="#0D0D0D"/>
      <rect x="9" y="13" width="2" height="1" fill="#0D0D0D"/>
      <rect x="3" y="14" width="2" height="1" fill="#0D0D0D"/>
      <rect x="10" y="14" width="2" height="1" fill="#0D0D0D"/>
      <rect x="3" y="15" width="1" height="1" fill="#0D0D0D"/>
      <rect x="10" y="15" width="2" height="1" fill="#0D0D0D"/>
      <rect x="11" y="16" width="2" height="1" fill="#0D0D0D"/>
      <rect x="11" y="17" width="2" height="1" fill="#0D0D0D"/>
    </g>
  </svg>`;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Strips the leading ~ accent marker from headline fields.
// The ~ prefix signals "apply highlight treatment" in grey slides.
function stripAccent(text: string): string {
  return text.startsWith('~') ? text.slice(1) : text;
}

// Returns true if the headline is marked for highlight treatment.
function hasAccent(text: string): boolean {
  return text.startsWith('~');
}

// Splits a topic string into two halves for the eyebrow rail.
// Splits at the last space before or at the midpoint to get balanced halves.
function splitTopic(topic: string): [string, string] {
  const mid = Math.floor(topic.length / 2);
  let splitAt = topic.lastIndexOf(' ', mid);
  if (splitAt <= 0) {
    splitAt = topic.indexOf(' ', mid);
  }
  if (splitAt <= 0) {
    return [topic, ''];
  }
  return [topic.slice(0, splitAt).toLowerCase(), topic.slice(splitAt + 1).toLowerCase()];
}

// Builds the progress bar for a slide.
// Fills proportionally: slide i+1 of total gets (i+1)/total fill width.
function progressBar(index: number, total: number): string {
  const fillPct = total > 1 ? ((index + 1) / total) * 100 : 100;
  return `<div class="progress-bar"><div class="progress-bar-fill" style="width: ${fillPct.toFixed(2)}%;"></div></div>`;
}

// Builds the eyebrow rail HTML (top two-piece header, same on every slide).
function railTop(eyebrowLeft: string, eyebrowRight: string): string {
  return `<div class="rail-top">
    <span>${esc(eyebrowLeft)}</span>
    <span>${esc(eyebrowRight)}</span>
  </div>`;
}

// Builds the footer rail HTML (bottom two-piece attribution, same on every slide).
function railBot(footerLeft: string, footerRight: string): string {
  return `<div class="rail-bot">
    <span>${esc(footerLeft)}</span>
    <span>${esc(footerRight)}</span>
  </div>`;
}

// Splits a multi-line headline string (using <br> or \n) into separate lines
// so the caller can decide on font size class.
function countLines(text: string): number {
  return text.split(/\n|<br\s*\/?>/i).length;
}

// Converts newline characters to <br> for safe injection into HTML.
// Does NOT escape the text since it may contain intentional <br> tags from the data layer.
// All user-supplied plain text fields must be separately escaped before reaching HTML output.
function nlToBr(text: string): string {
  return text.replace(/\n/g, '<br>');
}

// Cover slide: always blue, pixel cursor, 4-line hero headline, subtitle
function buildCoverSlide(
  s: Slide,
  index: number,
  total: number,
  eyebrowLeft: string,
  eyebrowRight: string,
  footerLeft: string,
  footerRight: string,
): string {
  const rawHeadline = stripAccent(s.headline);
  const subtitle = s.body ?? s.supporting ?? '';

  // Cover headline: split words onto individual lines (up to 4)
  const words = rawHeadline.split(/\s+/).slice(0, 4);
  const headlineHtml = words.map(w => esc(w)).join('<br>\n      ');

  const subtitleHtml = subtitle
    ? `<div class="sub-cover">${esc(subtitle).replace(/\n/g, '<br>')}</div>`
    : '';

  return `<section class="slide bg-blue${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  ${railTop(eyebrowLeft, eyebrowRight)}
  <div class="pad-cover">
    <div class="h-cover">
      ${headlineHtml}
    </div>
    ${subtitleHtml}
  </div>
  ${PIXEL_CURSOR_SVG}
  ${railBot(footerLeft, footerRight)}
  ${progressBar(index, total)}
</section>`;
}

// Grey statement slide: grey background, blue highlight block on headline, dark subline
function buildGreySlide(
  s: Slide,
  index: number,
  total: number,
  eyebrowLeft: string,
  eyebrowRight: string,
  footerLeft: string,
  footerRight: string,
): string {
  const rawHeadline = stripAccent(s.headline);
  const useHighlight = hasAccent(s.headline) || true; // grey slides always use highlight block
  const subText = s.body ?? s.supporting ?? '';

  const headlineHtml = useHighlight
    ? `<div class="h-highlight"><span class="highlight">${esc(rawHeadline).replace(/\n/g, '<br>')}</span></div>`
    : `<div class="h-body">${esc(rawHeadline).replace(/\n/g, '<br>')}</div>`;

  const subHtml = subText
    ? `<div class="sub" style="margin-top: 52px; color: #0D0D0D;">${esc(subText).replace(/\n/g, '<br>')}</div>`
    : '';

  return `<section class="slide bg-grey${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  ${railTop(eyebrowLeft, eyebrowRight)}
  <div class="pad-center">
    ${headlineHtml}
    ${subHtml}
  </div>
  ${railBot(footerLeft, footerRight)}
  ${progressBar(index, total)}
</section>`;
}

// Blue body slide: white headline on blue, optional subline
function buildBlueSlide(
  s: Slide,
  index: number,
  total: number,
  eyebrowLeft: string,
  eyebrowRight: string,
  footerLeft: string,
  footerRight: string,
): string {
  const rawHeadline = stripAccent(s.headline);
  const subText = s.body ?? s.supporting ?? '';

  // Use smaller headline class when line count is 4+ or when a subline also exists
  const lineCount = countLines(rawHeadline);
  const headlineClass = lineCount >= 4 ? 'h-body-sm' : 'h-body';

  const headlineHtml = `<div class="${headlineClass}">${esc(rawHeadline).replace(/\n/g, '<br>')}</div>`;
  const subHtml = subText
    ? `<div class="sub" style="margin-top: 42px;">${esc(subText).replace(/\n/g, '<br>')}</div>`
    : '';

  return `<section class="slide bg-blue${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  ${railTop(eyebrowLeft, eyebrowRight)}
  <div class="pad-center">
    ${headlineHtml}
    ${subHtml}
  </div>
  ${railBot(footerLeft, footerRight)}
  ${progressBar(index, total)}
</section>`;
}

// CTA slide: blue, large question-hook headline, invitation subline
function buildCTASlide(
  s: Slide,
  index: number,
  total: number,
  eyebrowLeft: string,
  eyebrowRight: string,
  footerLeft: string,
  footerRight: string,
): string {
  const rawHeadline = stripAccent(s.headline);
  const subText = s.body ?? s.supporting ?? '';

  const headlineHtml = `<div class="h-body" style="font-size: 124px; line-height: 1.00;">${esc(rawHeadline).replace(/\n/g, '<br>')}</div>`;
  const subHtml = subText
    ? `<div class="sub" style="margin-top: 52px;">${esc(subText).replace(/\n/g, '<br>')}</div>`
    : '';

  return `<section class="slide bg-blue${index === 0 ? ' active' : ''}" id="slide-${s.id}">
  ${railTop(eyebrowLeft, eyebrowRight)}
  <div class="pad-center">
    ${headlineHtml}
    ${subHtml}
  </div>
  ${railBot(footerLeft, footerRight)}
  ${progressBar(index, total)}
</section>`;
}

// Determines the visual background variant for a non-cover, non-CTA body slide.
// Alternates grey/blue strictly. Two greys in a row are forbidden.
// bodyIndex is the 0-based position among body slides only (excludes cover and CTA).
function isGreyBodySlide(bodyIndex: number): boolean {
  // bodyIndex 0 -> grey, 1 -> blue, 2 -> grey, ...
  return bodyIndex % 2 === 0;
}

export function buildCopenhagenHTML(slides: Slide[], meta: CarouselMeta): string {
  const total = slides.length;

  // Derive rail text from meta.topic and meta.pageName
  const [eyebrowLeft, eyebrowRight] = splitTopic(meta.topic);

  // Footer rail: split pageName at the last space for a natural two-part attribution
  const pageNameLower = meta.pageName.toLowerCase();
  const [footerLeft, footerRight] = splitTopic(pageNameLower);

  const lastIndex = total - 1;
  const hasCTA = total > 0 && slides[lastIndex]?.type === 'cta';

  // Track bodyIndex separately to drive blue/grey alternation among non-cover, non-CTA slides
  let bodyIndex = 0;

  const slidesHTML = slides
    .map((s, i) => {
      // Cover: always the first slide regardless of type
      if (i === 0) {
        return buildCoverSlide(s, i, total, eyebrowLeft, eyebrowRight, footerLeft, footerRight);
      }

      // CTA: always the last slide when type is 'cta'
      if (hasCTA && i === lastIndex) {
        return buildCTASlide(s, i, total, eyebrowLeft, eyebrowRight, footerLeft, footerRight);
      }

      // Body slides: alternate grey -> blue -> grey strictly
      const grey = isGreyBodySlide(bodyIndex);
      bodyIndex += 1;

      if (grey) {
        return buildGreySlide(s, i, total, eyebrowLeft, eyebrowRight, footerLeft, footerRight);
      }
      return buildBlueSlide(s, i, total, eyebrowLeft, eyebrowRight, footerLeft, footerRight);
    })
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
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
