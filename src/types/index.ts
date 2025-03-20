// Translation types
export interface Translation {
  language: string;
  translation: string;
}

export interface TranslationResponse {
  translations: Translation[];
}

// Domain types
export interface DomainInfo {
  domain: string;
  status: 'checking' | 'available' | 'registered' | 'unknown' | 'error';
  registrationDate?: string;
  message?: string;
  trafficData?: TrafficData;
}

// Traffic types
export interface TrafficMetric {
  month: string;
  visits: number;
}

export interface TrafficData {
  domain: string;
  metrics: TrafficMetric[];
}

// TLD types
export interface TLD {
  extension: string;
  name: string;
  category: 'popular' | 'country' | 'new' | 'other';
}

// Common TLDs for domain registration
export const POPULAR_TLDS: TLD[] = [
  { extension: 'com', name: '.com', category: 'popular' },
  { extension: 'net', name: '.net', category: 'popular' },
  { extension: 'org', name: '.org', category: 'popular' },
  { extension: 'io', name: '.io', category: 'popular' },
  { extension: 'co', name: '.co', category: 'popular' },
  { extension: 'app', name: '.app', category: 'popular' },
  { extension: 'dev', name: '.dev', category: 'popular' },
  { extension: 'me', name: '.me', category: 'popular' },
  { extension: 'ai', name: '.ai', category: 'popular' },
  { extension: 'xyz', name: '.xyz', category: 'popular' },
];
