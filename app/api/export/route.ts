import { NextRequest, NextResponse } from 'next/server'
import { buildCarouselHTML } from '@/lib/template-engine'
import { exportSlides } from '@/lib/playwright-export'
import { registerExport, OUTPUT_DIR } from '@/lib/export-registry'
import { appendEntry, getViewerId } from '@/lib/history'
import type { Slide, CarouselMeta } from '@/lib/types'
import * as crypto from 'crypto'
import * as path from 'path'

export const maxDuration = 120

let exporting = false

export async function POST(req: NextRequest) {
  if (exporting) {
    return NextResponse.json({ error: 'An export is already in progress. Please wait.' }, { status: 429 })
  }

  const { slides, meta, embedToken } = await req.json() as {
    slides: Slide[]
    meta: CarouselMeta
    embedToken: string
  }

  if (!embedToken) {
    return NextResponse.json({ error: 'Missing embed token' }, { status: 401 })
  }
  if (!slides?.length || !meta?.handle || !meta?.pageName) {
    return NextResponse.json({ error: 'slides and meta are required' }, { status: 400 })
  }

  exporting = true
  try {
    const html = buildCarouselHTML(slides, meta)
    const paths = await exportSlides(html, slides.length)
    const filenames = paths.map(p => path.basename(p))

    const exportId = crypto.randomUUID()
    registerExport(exportId, OUTPUT_DIR, filenames)

    const viewerId = getViewerId(embedToken)
    await appendEntry({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      topic: meta.topic,
      handle: meta.handle,
      pageName: meta.pageName,
      theme: meta.theme ?? 'default',
      slides,
      exportId,
      slideCount: slides.length,
    }, viewerId, embedToken)

    return NextResponse.json({ exportId, slideCount: slides.length, filenames })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[export]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  } finally {
    exporting = false
  }
}
