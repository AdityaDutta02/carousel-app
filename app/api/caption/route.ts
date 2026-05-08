import { NextRequest, NextResponse } from 'next/server'
import { sanitizeText } from '@/lib/sanitize'
import { callGateway } from '@/lib/terminal-ai'
import type { Slide, CarouselMeta } from '@/lib/types'

const SYSTEM = `You write Instagram captions that get saved and shared.

RULES:
- 3-5 sentences. Each sentence must be complete, flowing prose - no fragments, no 2-3 word sentences.
- Minimum 10 words per sentence.
- Open with the single most surprising fact from the carousel, stated as a complete sentence.
- Second sentence: the implication - why this matters, with one specific named detail.
- Third sentence: the counterintuitive takeaway, framed as a revelation the reader can hold onto.
- Optional fourth sentence: a direct read prompt ("Swipe through." or "Full breakdown in the carousel.").
- Banned words: "dive into", "delve", "game-changer", "landscape", "pivotal", vague positive endings.
- Write like a Substack writer who knows the data cold, not a brand manager.
- No hashtags. No emojis. No em-dashes.

OUTPUT: Just the caption text. No quotes around it. No explanation.`

export const maxDuration = 30

export async function POST(req: NextRequest) {
  const { slides, meta, embedToken } = await req.json() as {
    slides: Slide[]
    meta: CarouselMeta
    embedToken: string
  }

  if (!embedToken) {
    return NextResponse.json({ error: 'Missing embed token' }, { status: 401 })
  }
  if (!slides?.length || !meta) {
    return NextResponse.json({ error: 'slides and meta required' }, { status: 400 })
  }

  const slidesSummary = slides
    .filter(s => s.type !== 'cta')
    .map(s => {
      const lines = [s.headline, s.headline2, s.headline3]
        .filter(Boolean)
        .map(t => t!.replace(/^~/, ''))
        .join(' - ')
      const body = s.body ?? s.supporting ?? s.footnote ?? ''
      const stats = (s.stats ?? []).map(st => `${st.label} ${st.value}`).join(', ')
      const items = (s.items ?? []).map(i => i.name).join(', ')
      const steps = (s.steps ?? []).map(st => st.title).join(', ')
      const extra = [body, stats, items, steps].filter(Boolean).join(' | ')
      return extra ? `${lines} - ${extra}` : lines
    })
    .join('\n')

  const user = `Topic: ${meta.topic}\nPage: ${meta.pageName} (${meta.handle})\n\nCarousel content:\n${slidesSummary}\n\nWrite the caption.`

  try {
    const result = await callGateway(
      [{ role: 'user', content: user }],
      embedToken,
      { category: 'chat', tier: 'good', system: SYSTEM },
    )
    return NextResponse.json({ caption: sanitizeText(result.content.trim()) })
  } catch (err) {
    const e = err as Error & { code?: string; redirect?: string }
    if (e.code === 'INSUFFICIENT_CREDITS') {
      return NextResponse.json({ error: e.message, code: 'INSUFFICIENT_CREDITS', redirect: e.redirect }, { status: 402 })
    }
    return NextResponse.json({ error: e.message ?? 'Caption failed' }, { status: 500 })
  }
}
