import { NextRequest, NextResponse } from 'next/server'
import { listEntries, deleteEntry, getViewerId } from '@/lib/history'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('Authorization')
  const embedToken = auth?.replace('Bearer ', '') ?? ''
  if (!embedToken) return NextResponse.json({ error: 'Missing auth' }, { status: 401 })
  const viewerId = getViewerId(embedToken)
  return NextResponse.json(await listEntries(viewerId, embedToken))
}

export async function DELETE(req: NextRequest) {
  const auth = req.headers.get('Authorization')
  const embedToken = auth?.replace('Bearer ', '') ?? ''
  if (!embedToken) return NextResponse.json({ error: 'Missing auth' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await deleteEntry(id, embedToken)
  return NextResponse.json({ ok: true })
}
