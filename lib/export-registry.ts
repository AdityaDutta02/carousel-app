import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export const OUTPUT_DIR = path.join(os.tmpdir(), 'carousel-app-output');

interface ExportRecord {
  outputDir: string;
  filenames: string[];
}

function recordPath(exportId: string): string {
  return path.join(OUTPUT_DIR, `${exportId}.json`);
}

export function registerExport(exportId: string, outputDir: string, filenames: string[]): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(recordPath(exportId), JSON.stringify({ outputDir, filenames }), 'utf8');
}

export function resolveExport(exportId: string): ExportRecord | null {
  const p = recordPath(exportId);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8')) as ExportRecord;
  } catch {
    return null;
  }
}

export function cleanupExport(exportId: string): void {
  const p = recordPath(exportId);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

export function validatePath(resolved: string): boolean {
  return resolved.startsWith(OUTPUT_DIR + path.sep) || resolved.startsWith(OUTPUT_DIR + '/');
}
