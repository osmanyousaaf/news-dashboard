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
  query?: { category?: string; module?: string };
  section?: 'ops' | 'tech' | 'markets' | 'library' | 'tools';
}

export const SECTORS: SectorDef[] = [
  { id: 'control', label: 'Control Center', section: 'ops' },
  { id: 'tech', label: 'Technology', query: { category: 'tech' }, section: 'tech' },
  { id: 'ai', label: 'AI & Machine Learning', query: { category: 'ai' }, section: 'tech' },
  { id: 'cybersecurity', label: 'Cybersecurity', query: { module: 'cybersecurity' }, section: 'tech' },
  { id: 'clouddevops', label: 'Cloud & DevOps', query: { module: 'clouddevops' }, section: 'tech' },
  { id: 'github', label: 'GitHub Developer', query: { category: 'github' }, section: 'tech' },
  { id: 'research', label: 'Science & Research', query: { category: 'research' }, section: 'tech' },
  { id: 'startups', label: 'Startups & VC', query: { category: 'startups' }, section: 'tech' },
  { id: 'crypto', label: 'Crypto & DeFi', query: { category: 'crypto' }, section: 'markets' },
  { id: 'forex', label: 'Forex Market', query: { module: 'forex' }, section: 'markets' },
  { id: 'gold', label: 'Gold & Metals', query: { module: 'gold' }, section: 'markets' },
  { id: 'trading', label: 'Financial Trading', query: { category: 'trading' }, section: 'markets' },
  { id: 'global', label: 'Global Geopolitics', query: { category: 'global' }, section: 'markets' },
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

/** Messages: webview → extension host */
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

/** Messages: extension host → webview */
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
