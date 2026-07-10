import { FeedResponse, NewsItem, SectorId, SECTORS } from './types';

const DEFAULT_TIMEOUT_MS = 45_000;

export function getSectorQuery(sector: SectorId): { category?: string; module?: string } {
  const def = SECTORS.find((s) => s.id === sector);
  return def?.query ?? {};
}

export async function fetchFeeds(
  apiBaseUrl: string,
  sector: SectorId,
  limit = 40
): Promise<NewsItem[]> {
  const base = apiBaseUrl.replace(/\/$/, '');
  const query = getSectorQuery(sector);
  const params = new URLSearchParams({ limit: String(limit) });
  if (query.category) params.set('category', query.category);
  if (query.module) params.set('module', query.module);

  const url = `${base}/api/feeds?${params.toString()}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`API ${res.status}: ${res.statusText}`);
    }
    const data = (await res.json()) as FeedResponse;
    return Array.isArray(data.items) ? data.items : [];
  } finally {
    clearTimeout(timer);
  }
}
