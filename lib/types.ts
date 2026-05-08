export type SlideType = 'hook' | 'data' | 'insight' | 'list' | 'grid' | 'findings' | 'cta';

export interface StatItem {
  label: string;
  value: string;
}

export interface ListItem {
  title: string;
  desc: string;
}

export interface GridItem {
  name: string;
  role: string;
}

export interface Slide {
  id: number;
  type: SlideType;
  headline: string;
  headline2?: string;
  headline3?: string;
  pill?: string;
  body?: string;
  supporting?: string;
  footnote?: string;
  stats?: StatItem[];
  steps?: ListItem[];
  items?: GridItem[];
  tagline?: string;
}

export interface CarouselMeta {
  topic: string;
  handle: string;
  pageName: string;
  theme?: 'default' | 'editorial' | 'wolf-v2' | 'editorial-step' | 'ascii-pixel';
}
