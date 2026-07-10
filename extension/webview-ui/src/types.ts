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

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
}

export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windKmh: number;
  condition: string;
  isDay: boolean;
  updatedAt: string;
}

export interface BriefingArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface DailyBriefing {
  date: string;
  lastUpdated: string;
  breakingHighlights: BriefingArticle[];
  techUpdates: BriefingArticle[];
  githubUpdates: BriefingArticle[];
  researchHighlights: BriefingArticle[];
  startupUpdates: BriefingArticle[];
  marketSummary: BriefingArticle[];
  geopoliticsUpdates: BriefingArticle[];
  topEvents: { rank: number; title: string; summary: string; url: string }[];
}

export interface CategorySummary {
  category: string;
  categoryId: string;
  summary: string;
  headlines: { title: string; url: string }[];
  generatedAt: string;
}

export type SectorId =
  | 'control'
  | 'tech'
  | 'ai'
  | 'cybersecurity'
  | 'clouddevops'
  | 'github'
  | 'research'
  | 'startups'
  | 'crypto'
  | 'forex'
  | 'gold'
  | 'trading'
  | 'global'
  | 'saved'
  | 'watchlist'
  | 'settings'
  | 'chat'
  | 'summary';

export interface SectorDef {
  id: SectorId;
  label: string;
  section?: 'ops' | 'tech' | 'markets' | 'library' | 'tools';
  accent?: string;
}

export const NAV_ITEMS: SectorDef[] = [
  { id: 'control', label: 'Control Center', section: 'ops', accent: '#5b8def' },
  { id: 'tech', label: 'Technology', section: 'tech', accent: '#8b7cf6' },
  { id: 'ai', label: 'AI & Machine Learning', section: 'tech', accent: '#a78bfa' },
  { id: 'cybersecurity', label: 'Cybersecurity', section: 'tech', accent: '#f07178' },
  { id: 'clouddevops', label: 'Cloud & DevOps', section: 'tech', accent: '#67e8f9' },
  { id: 'github', label: 'GitHub Developer', section: 'tech', accent: '#2dd4bf' },
  { id: 'research', label: 'Science & Research', section: 'tech', accent: '#c084fc' },
  { id: 'startups', label: 'Startups & VC', section: 'tech', accent: '#fb7185' },
  { id: 'crypto', label: 'Crypto & DeFi', section: 'markets', accent: '#fbbf24' },
  { id: 'forex', label: 'Forex Market', section: 'markets', accent: '#34d399' },
  { id: 'gold', label: 'Gold & Metals', section: 'markets', accent: '#f59e0b' },
  { id: 'trading', label: 'Financial Trading', section: 'markets', accent: '#60a5fa' },
  { id: 'global', label: 'Global Geopolitics', section: 'markets', accent: '#22d3ee' },
  { id: 'saved', label: 'Saved News', section: 'library' },
  { id: 'watchlist', label: 'Watchlist', section: 'library' },
  { id: 'chat', label: 'AI Chat', section: 'tools' },
  { id: 'summary', label: 'Quick Summary', section: 'tools' },
  { id: 'settings', label: 'Settings', section: 'tools' },
];

export interface ExtensionSettings {
  apiBaseUrl: string;
  refreshInterval: number;
}

export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export type WebviewToHost =
  | { type: 'ready' }
  | { type: 'fetchFeeds'; sector: SectorId }
  | { type: 'fetchDashboard' }
  | { type: 'fetchTicker' }
  | { type: 'fetchBriefing' }
  | { type: 'fetchSummary' }
  | { type: 'chat'; messages: ChatMessage[] }
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
  | { type: 'dashboardResult'; items: NewsItem[]; error?: string }
  | {
      type: 'tickerResult';
      weather: WeatherData | null;
      assets: CryptoAsset[];
      error?: string;
    }
  | { type: 'briefingResult'; briefing: DailyBriefing | null; error?: string }
  | { type: 'summaryResult'; summaries: CategorySummary[]; error?: string }
  | { type: 'chatResult'; content: string; mode?: string; error?: string }
  | { type: 'savedItems'; items: NewsItem[] }
  | { type: 'watchlistItems'; items: NewsItem[] }
  | { type: 'settings'; settings: ExtensionSettings }
  | { type: 'settingsUpdated'; settings: ExtensionSettings }
  | { type: 'loading'; loading: boolean; scope?: string };

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
  crypto: 'Crypto',
  trading: 'Markets',
  research: 'Research',
  github: 'GitHub',
  startups: 'Startups',
  global: 'Global',
};
