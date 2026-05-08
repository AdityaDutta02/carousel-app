import { NextRequest, NextResponse } from 'next/server';
import { OUTPUT_DIR } from '@/lib/export-registry';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export async function POST(req: NextRequest) {
  const { filenames, caption } = await req.json() as {
    filenames: string[];
    caption?: string;
  };

  if (!filenames?.length) {
    return NextResponse.json({ error: 'filenames are required' }, { status: 400 });
  }

  const fullPaths: string[] = [];
  for (const f of filenames) {
    if (!f.endsWith('.png') || f.includes('..') || f.includes('/') || f.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    const resolved = path.resolve(path.join(OUTPUT_DIR, f));
    if (!resolved.startsWith(OUTPUT_DIR + path.sep) && !resolved.startsWith(OUTPUT_DIR + '/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    if (!fs.existsSync(resolved)) {
      return NextResponse.json({ error: 'Slide files not found — please re-export your carousel' }, { status: 404 });
    }
    fullPaths.push(resolved);
  }

  const zipPath = path.join(os.tmpdir(), `carousel-${Date.now().toString(36)}.zip`);
  const captionPath = caption
    ? path.join(os.tmpdir(), `caption-${Date.now().toString(36)}.txt`)
    : null;

  try {
    if (captionPath && caption) {
      fs.writeFileSync(captionPath, caption, 'utf8');
    }

    const zipArgs = ['-j', zipPath, ...fullPaths];
    if (captionPath) zipArgs.push(captionPath);

    const result = spawnSync('zip', zipArgs);
    if (result.status !== 0) {
      return NextResponse.json({ error: 'ZIP creation failed' }, { status: 500 });
    }

    const zipBuffer = fs.readFileSync(zipPath);
    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="carousel.zip"',
      },
    });
  } finally {
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    if (captionPath && fs.existsSync(captionPath)) fs.unlinkSync(captionPath);
  }
}
