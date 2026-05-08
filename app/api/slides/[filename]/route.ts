import { NextRequest, NextResponse } from 'next/server';
import { OUTPUT_DIR } from '@/lib/export-registry';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;

  if (!filename.endsWith('.png') || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return NextResponse.json({ error: 'invalid filename' }, { status: 400 });
  }

  const filePath = path.resolve(path.join(OUTPUT_DIR, filename));
  if (!filePath.startsWith(OUTPUT_DIR + path.sep) && !filePath.startsWith(OUTPUT_DIR + '/')) {
    return NextResponse.json({ error: 'invalid filename' }, { status: 400 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const data = fs.readFileSync(filePath);
  return new NextResponse(data, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
  });
}
