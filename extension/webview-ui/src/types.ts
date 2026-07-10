export type Category =
  | 'ai'
  | 'crypto'
  | 'trading'
  | 'github'
  | 'tech'
  | 'research'
  | 'startups'
  | 'global';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  sourceIcon?: string;
  category: Category;
  subcategory?: string;
  publishedAt: string;
  imageUrl?: string;
  significance: number;
  tags: string[];
}

export type SectorId =
  | 'all'
  | 'tech'
  | 'cybersecurity'
  | 'clouddevops'
  | 'finance'
  | 'crypto'
  | 'markets'
  | 'research'
  | 'global';

export interface SectorDef {
  id: SectorId;
  label: string;
}

export const SECTORS: SectorDef[] = [
  { id: 'all', label: 'All Sectors' },
  { id: 'tech', label: 'Technology' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'clouddevops', label: 'Cloud & DevOps' },
  { id: 'finance', label: 'Finance' },
  { id: 'crypto', label: 'Crypto & DeFi' },
  { id: 'markets', label: 'Markets' },
  { id: 'research', label: 'Science & Research' },
  { id: 'global', label: 'Global' },
];

export type NavView = 'all' | 'sector' | 'saved' | 'watchlist' | 'settings';

export interface ExtensionSettings {
  apiBaseUrl: string;
  refreshInterval: number;
}

export type WebviewToHost =
  | { type: 'ready' }
  | { type: 'fetchFeeds'; sector: SectorId }
  | { type: 'saveItem'; item: NewsItem }
  | { type: 'unsaveItem'; id: string }
  | { type: 'watchItem'; item: NewsItem }
  | { type: 'unwatchItem'; id: string }
  | { type: 'openExternal'; url: string }
  | { type: 'getSettings' }
  | { type: 'updateSettings'; settings: Partial<ExtensionSettings> }
  | { type: 'copyUrl'; url: string };

export type HostToWebview =
  | { type: 'feedsResult'; items: NewsItem[]; sector: SectorId; error?: string }
  | { type: 'savedItems'; items: NewsItem[] }
  | { type: 'watchlistItems'; items: NewsItem[] }
  | { type: 'settings'; settings: ExtensionSettings }
  | { type: 'settingsUpdated'; settings: ExtensionSettings }
  | { type: 'loading'; loading: boolean };

declare global {
  function acquireVsCodeApi(): {
    postMessage(message: WebviewToHost): void;
    getState(): unknown;
    setState(state: unknown): void;
  };
}

export const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AI',
  tech: 'Technology',
  crypto: 'Crypto & DeFi',
  trading: 'Markets',
  research: 'Science & Research',
  github: 'GitHub',
  startups: 'Startups',
  global: 'Global',
  cybersecurity: 'Cybersecurity',
  clouddevops: 'Cloud & DevOps',
  forex: 'Finance',
};
