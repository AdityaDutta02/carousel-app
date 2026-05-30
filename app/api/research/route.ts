import { NextRequest } from 'next/server'
import { researchTopic } from '@/lib/tavily'
import { generateSlides } from '@/lib/qwen'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/content-prompt'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const { topic, handle, pageName, embedToken, theme, angle, sourceUrl, audience, tone } = await req.json() as {
    topic: string
    handle: string
    pageName: string
    embedToken: string
    theme?: string
    angle?: string
    sourceUrl?: string
    audience?: string
    tone?: string
  }

  if (!embedToken) {
    return new Response(JSON.stringify({ error: 'Missing embed token' }), { status: 401 })
  }
  if (!topic?.trim() || !handle?.trim() || !pageName?.trim()) {
    return new Response(JSON.stringify({ error: 'topic, handle, and pageName are required' }), { status: 400 })
  }
  if (topic.trim().length > 300) {
    return new Response(JSON.stringify({ error: 'topic must be 300 characters or fewer' }), { status: 400 })
  }
  if (pageName.trim().length > 100) {
    return new Response(JSON.stringify({ error: 'pageName must be 100 characters or fewer' }), { status: 400 })
  }
  if (handle.trim().length > 50) {
    return new Response(JSON.stringify({ error: 'handle must be 50 characters or fewer' }), { status: 400 })
  }
  if (angle && angle.trim().length > 500) {
    return new Response(JSON.stringify({ error: 'angle must be 500 characters or fewer' }), { status: 400 })
  }
  if (sourceUrl && sourceUrl.trim().length > 1000) {
    return new Response(JSON.stringify({ error: 'sourceUrl must be 1000 characters or fewer' }), { status: 400 })
  }

  const normalizedHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`
  const audienceCtx = audience ? `\nAudience: ${audience}` : ''
  const toneCtx = tone ? `\nTone: ${tone}` : ''
  const extraCtx = audienceCtx + toneCtx

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      function send(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        send({ type: 'status', message: 'Searching the web' })

        const research = await researchTopic(topic.trim(), embedToken, sourceUrl?.trim())

        send({ type: 'status', message: 'Writing slides' })

        const system = buildSystemPrompt(theme)
        const user = buildUserPrompt(topic.trim(), research + extraCtx, angle?.trim())
        const slides = await generateSlides(system, user, embedToken)

        send({
          type: 'done',
          slides,
          meta: {
            topic: topic.trim(),
            handle: normalizedHandle,
            pageName: pageName.trim(),
            theme,
            angle: angle?.trim() || undefined,
            sourceUrl: sourceUrl?.trim() || undefined,
          },
        })
      } catch (err) {
        const e = err as Error & { code?: string; redirect?: string }
        if (e.code === 'INSUFFICIENT_CREDITS') {
          send({ type: 'error', message: e.message, code: 'INSUFFICIENT_CREDITS', redirect: e.redirect })
        } else {
          send({ type: 'error', message: e.message ?? 'Generation failed' })
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
