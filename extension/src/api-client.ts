import {
  CryptoAsset,
  DailyBriefing,
  CategorySummary,
  FeedResponse,
  NewsItem,
  SectorId,
  SECTORS,
  WeatherData,
  ChatMessage,
} from './types';

const DEFAULT_TIMEOUT_MS = 45_000;

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { Accept: 'application/json', ...(init?.headers ?? {}) },
    });
    if (!res.ok) {
      throw new Error(`API ${res.status}: ${res.statusText}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export function getSectorQuery(sector: SectorId): { category?: string; module?: string } | null {
  const def = SECTORS.find((s) => s.id === sector);
  if (!def?.query) return null;
  return def.query;
}

export async function fetchFeeds(
  apiBaseUrl: string,
  sector: SectorId,
  limit = 40
): Promise<NewsItem[]> {
  const base = apiBaseUrl.replace(/\/$/, '');
  const params = new URLSearchParams({ limit: String(limit) });
  const query = getSectorQuery(sector);
  if (query?.category) params.set('category', query.category);
  if (query?.module) params.set('module', query.module);

  const data = await getJson<FeedResponse>(`${base}/api/feeds?${params.toString()}`);
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchDashboardFeeds(apiBaseUrl: string): Promise<NewsItem[]> {
  return fetchFeeds(apiBaseUrl, 'control', 50);
}

export async function fetchWeather(apiBaseUrl: string): Promise<WeatherData | null> {
  const base = apiBaseUrl.replace(/\/$/, '');
  try {
    return await getJson<WeatherData>(
      `${base}/api/weather?lat=51.5074&lon=-0.1278&city=${encodeURIComponent('London, UK')}`
    );
  } catch {
    return null;
  }
}

export async function fetchCryptoMarket(apiBaseUrl: string): Promise<CryptoAsset[]> {
  const base = apiBaseUrl.replace(/\/$/, '');
  try {
    const data = await getJson<{ assets: CryptoAsset[] }>(`${base}/api/crypto/market`);
    return Array.isArray(data.assets) ? data.assets : [];
  } catch {
    return [];
  }
}

export async function fetchBriefing(apiBaseUrl: string): Promise<DailyBriefing> {
  const base = apiBaseUrl.replace(/\/$/, '');
  return getJson<DailyBriefing>(`${base}/api/briefing`);
}

export async function fetchSummary(apiBaseUrl: string): Promise<CategorySummary[]> {
  const base = apiBaseUrl.replace(/\/$/, '');
  const data = await getJson<{ summaries: CategorySummary[] }>(`${base}/api/summary`);
  return Array.isArray(data.summaries) ? data.summaries : [];
}

export async function postChat(
  apiBaseUrl: string,
  messages: ChatMessage[]
): Promise<{ content: string; mode?: string }> {
  const base = apiBaseUrl.replace(/\/$/, '');
  return getJson(`${base}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
}
