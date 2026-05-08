import { dbList, dbInsert, dbDelete } from './db'
import type { Slide } from './types'

export interface HistoryEntry {
  id: string
  createdAt: string
  topic: string
  handle: string
  pageName: string
  theme: 'default' | 'editorial' | 'wolf-v2' | 'editorial-step' | 'ascii-pixel'
  slides: Slide[]
  exportId: string
  slideCount: number
}

interface DBHistoryRow {
  id: string
  viewer_id: string
  created_at: string
  topic: string
  handle: string
  page_name: string
  theme: string
  slides: Slide[]
  export_id: string
  slide_count: number
}

function rowToEntry(row: DBHistoryRow): HistoryEntry {
  return {
    id: row.id,
    createdAt: row.created_at,
    topic: row.topic,
    handle: row.handle,
    pageName: row.page_name,
    theme: row.theme as HistoryEntry['theme'],
    slides: row.slides,
    exportId: row.export_id,
    slideCount: row.slide_count,
  }
}

export function getViewerId(embedToken: string): string {
  try {
    const payload = JSON.parse(atob(embedToken.split('.')[1])) as Record<string, unknown>
    return (payload.userId ?? payload.sub ?? 'anon') as string
  } catch {
    return 'anon'
  }
}

export async function appendEntry(entry: HistoryEntry, viewerId: string, embedToken: string): Promise<void> {
  await dbInsert('carousel_history', {
    viewer_id: viewerId,
    topic: entry.topic,
    handle: entry.handle,
    page_name: entry.pageName,
    theme: entry.theme,
    slides: entry.slides,
    export_id: entry.exportId,
    slide_count: entry.slideCount,
  }, embedToken)
}

export async function listEntries(viewerId: string, embedToken: string): Promise<HistoryEntry[]> {
  const rows = await dbList<DBHistoryRow>('carousel_history', { viewer_id: viewerId }, embedToken)
  return rows
    .map(rowToEntry)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 100)
}

export async function deleteEntry(id: string, embedToken: string): Promise<void> {
  await dbDelete('carousel_history', id, embedToken)
}
