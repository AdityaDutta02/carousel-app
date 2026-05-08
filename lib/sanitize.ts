import type { Slide } from './types';

export function sanitizeText(s: string): string {
  return s.replace(/[—–]/g, ' - ').replace(/  +/g, ' ').trim();
}

function walkStrings<T>(value: T): T {
  if (typeof value === 'string') return sanitizeText(value) as unknown as T;
  if (Array.isArray(value)) return value.map(walkStrings) as unknown as T;
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = walkStrings(v);
    }
    return out as unknown as T;
  }
  return value;
}

export function sanitizeSlides(slides: Slide[]): Slide[] {
  return walkStrings(slides);
}
