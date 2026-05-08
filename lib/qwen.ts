import type { Slide } from './types'
import { sanitizeSlides } from './sanitize'
import { callGateway } from './terminal-ai'

export async function generateSlides(
  systemPrompt: string,
  userPrompt: string,
  embedToken: string,
): Promise<Slide[]> {
  const result = await callGateway(
    [{ role: 'user', content: userPrompt }],
    embedToken,
    { category: 'chat', tier: 'quality', system: systemPrompt },
  )
  return parseSlides(result.content)
}

function parseSlides(raw: string): Slide[] {
  let text = raw
  text = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim()
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error(`No JSON array in model output. Raw: ${text.slice(0, 200)}`)

  const parsed = JSON.parse(match[0]) as Slide[]
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Model returned empty or non-array slide list')
  }
  for (let i = 0; i < parsed.length; i++) {
    const s = parsed[i]
    if (!s.type) throw new Error(`Slide ${i + 1} missing required field: type`)
    if (s.type !== 'cta' && !s.headline) throw new Error(`Slide ${i + 1} missing required field: headline`)
  }
  return sanitizeSlides(parsed.map((s, i) => ({ ...s, id: i + 1 })))
}
