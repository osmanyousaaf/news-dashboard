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

export interface FeedResponse {
  items: NewsItem[];
  total: number;
  lastUpdated: string;
  category: Category | null;
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
  query: { category?: string; module?: string };
}

export const SECTORS: SectorDef[] = [
  { id: 'all', label: 'All Sectors', query: {} },
  { id: 'tech', label: 'Technology', query: { category: 'tech' } },
  { id: 'cybersecurity', label: 'Cybersecurity', query: { module: 'cybersecurity' } },
  { id: 'clouddevops', label: 'Cloud & DevOps', query: { module: 'clouddevops' } },
  { id: 'finance', label: 'Finance', query: { module: 'forex' } },
  { id: 'crypto', label: 'Crypto & DeFi', query: { category: 'crypto' } },
  { id: 'markets', label: 'Markets', query: { category: 'trading' } },
  { id: 'research', label: 'Science & Research', query: { category: 'research' } },
  { id: 'global', label: 'Global', query: { category: 'global' } },
];

export type NavView = 'all' | 'sector' | 'saved' | 'watchlist' | 'settings';

export interface ExtensionSettings {
  apiBaseUrl: string;
  refreshInterval: number;
}

/** Messages: webview → extension host */
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

/** Messages: extension host → webview */
export type HostToWebview =
  | { type: 'feedsResult'; items: NewsItem[]; sector: SectorId; error?: string }
  | { type: 'savedItems'; items: NewsItem[] }
  | { type: 'watchlistItems'; items: NewsItem[] }
  | { type: 'settings'; settings: ExtensionSettings }
  | { type: 'settingsUpdated'; settings: ExtensionSettings }
  | { type: 'loading'; loading: boolean };
