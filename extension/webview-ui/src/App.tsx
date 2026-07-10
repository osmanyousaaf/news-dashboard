import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { ControlCenter } from './components/ControlCenter';
import { DetailPanel } from './components/DetailPanel';
import { FeedPanel } from './components/FeedPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { Sidebar } from './components/Sidebar';
import { SummaryPanel } from './components/SummaryPanel';
import { Ticker } from './components/Ticker';
import {
  CategorySummary,
  CryptoAsset,
  DailyBriefing,
  ExtensionSettings,
  HostToWebview,
  NAV_ITEMS,
  NewsItem,
  SectorId,
  WeatherData,
} from './types';
import { getLogoUri, postToHost, stripHtml } from './vscode';

const FEED_SECTORS = new Set<SectorId>([
  'tech',
  'ai',
  'cybersecurity',
  'clouddevops',
  'github',
  'research',
  'startups',
  'crypto',
  'forex',
  'gold',
  'trading',
  'global',
]);

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('newsdash.theme');
    return saved === 'light' ? 'light' : 'dark';
  });
  const [sector, setSector] = useState<SectorId>('control');
  const [items, setItems] = useState<NewsItem[]>([]);
  const [dashboardItems, setDashboardItems] = useState<NewsItem[]>([]);
  const [saved, setSaved] = useState<NewsItem[]>([]);
  const [watchlist, setWatchlist] = useState<NewsItem[]>([]);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [search, setSearch] = useState('');
  const [loadingFeeds, setLoadingFeeds] = useState(true);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [settings, setSettings] = useState<ExtensionSettings | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [summaries, setSummaries] = useState<CategorySummary[]>([]);
  const [summaryError, setSummaryError] = useState<string | undefined>();
  const [chatReply, setChatReply] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | undefined>();
  const [hasBreaking, setHasBreaking] = useState(false);
  const logo = getLogoUri();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('newsdash.theme', theme);
  }, [theme]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<HostToWebview>) => {
      const msg = event.data;
      if (!msg || typeof msg !== 'object' || !('type' in msg)) return;

      switch (msg.type) {
        case 'loading':
          if (msg.scope === 'chat') setLoadingChat(msg.loading);
          else if (msg.scope === 'briefing' || msg.scope === 'summary') setLoadingBriefing(msg.loading);
          else setLoadingFeeds(msg.loading);
          break;
        case 'feedsResult':
          setItems(msg.items);
          setError(msg.error);
          if (msg.items[0]) {
            setSelected((prev) =>
              prev && msg.items.some((i) => i.id === prev.id) ? prev : msg.items[0]
            );
          } else {
            setSelected(null);
          }
          break;
        case 'dashboardResult':
          setDashboardItems(msg.items);
          setHasBreaking(msg.items.some((i) => i.significance >= 9));
          if (msg.error) setError(msg.error);
          break;
        case 'tickerResult':
          setWeather(msg.weather);
          setAssets(msg.assets);
          break;
        case 'briefingResult':
          setBriefing(msg.briefing);
          setSummaryError(msg.error);
          break;
        case 'summaryResult':
          setSummaries(msg.summaries);
          if (msg.error) setSummaryError(msg.error);
          break;
        case 'chatResult':
          if (msg.error) setChatError(msg.error);
          else setChatReply(msg.content);
          break;
        case 'savedItems':
          setSaved(msg.items);
          break;
        case 'watchlistItems':
          setWatchlist(msg.items);
          break;
        case 'settings':
        case 'settingsUpdated':
          setSettings(msg.settings);
          break;
      }
    };

    window.addEventListener('message', onMessage);
    postToHost({ type: 'ready' });
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const savedIds = useMemo(() => new Set(saved.map((i) => i.id)), [saved]);
  const watchIds = useMemo(() => new Set(watchlist.map((i) => i.id)), [watchlist]);

  const clearChatReply = useCallback(() => {
    setChatReply(null);
    setChatError(undefined);
  }, []);

  const onNavigate = (id: SectorId) => {
    setSector(id);
    setSearch('');
    setSelected(null);
    setError(undefined);

    if (id === 'control') {
      setItems([]);
      setDashboardItems([]);
      setLoadingFeeds(true);
      postToHost({ type: 'fetchDashboard' });
      return;
    }

    if (FEED_SECTORS.has(id)) {
      setItems([]);
      setLoadingFeeds(true);
      postToHost({ type: 'fetchFeeds', sector: id });
    }
  };

  const onToggleSave = (item: NewsItem) => {
    if (savedIds.has(item.id)) postToHost({ type: 'unsaveItem', id: item.id });
    else postToHost({ type: 'saveItem', item });
  };

  const onToggleWatch = (item: NewsItem) => {
    if (watchIds.has(item.id)) postToHost({ type: 'unwatchItem', id: item.id });
    else postToHost({ type: 'watchItem', item });
  };

  const sourceItems = useMemo(() => {
    if (sector === 'saved') return saved;
    if (sector === 'watchlist') return watchlist;
    return items;
  }, [sector, saved, watchlist, items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sourceItems;
    return sourceItems.filter((item) => {
      const hay = `${item.title} ${stripHtml(item.description)} ${item.source} ${item.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [sourceItems, search]);

  const navLabel = NAV_ITEMS.find((n) => n.id === sector)?.label ?? 'News';
  const showDetail =
    sector === 'control' ||
    FEED_SECTORS.has(sector) ||
    sector === 'saved' ||
    sector === 'watchlist';

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand-row">
          {logo ? <img src={logo} alt="NewsDash" /> : null}
          <div>
            <h1>NEWSDASH</h1>
            <span>Real-time AI News Intelligence</span>
          </div>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className={`icon-chip${theme === 'dark' ? ' active' : ''}`}
            title="Toggle theme"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
            </svg>
          </button>
          <button
            type="button"
            className={`icon-chip${sector === 'chat' ? ' active' : ''}`}
            title="AI Chat"
            onClick={() => onNavigate('chat')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="4" y="5" width="16" height="12" rx="3" />
              <circle cx="9" cy="11" r="1.2" fill="currentColor" />
              <circle cx="15" cy="11" r="1.2" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            className={`icon-chip${sector === 'summary' ? ' active' : ''}`}
            title="Quick Summary"
            onClick={() => onNavigate('summary')}
          >
            {hasBreaking && <span className="dot" />}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M7 4h10v16H7z" />
              <path d="M9 8h6M9 12h6M9 16h4" />
            </svg>
          </button>
        </div>
      </header>

      <Ticker weather={weather} assets={assets} />

      <div className={`body${showDetail ? ' with-detail' : ''}`}>
        <Sidebar active={sector} onNavigate={onNavigate} />

        <main className="main">
          {sector === 'control' && (
            <ControlCenter
              items={dashboardItems}
              loading={loadingFeeds}
              error={error}
              onSelect={setSelected}
            />
          )}

          {FEED_SECTORS.has(sector) && (
            <FeedPanel
              title={navLabel}
              subtitle="Sector-filtered intelligence stream"
              items={filtered}
              selectedId={selected?.id ?? null}
              search={search}
              loading={loadingFeeds}
              error={error}
              savedIds={savedIds}
              emptyLabel="No headlines for this sector."
              onSearchChange={setSearch}
              onSelect={setSelected}
              onToggleSave={onToggleSave}
            />
          )}

          {(sector === 'saved' || sector === 'watchlist') && (
            <FeedPanel
              title={navLabel}
              items={filtered}
              selectedId={selected?.id ?? null}
              search={search}
              loading={false}
              savedIds={savedIds}
              emptyLabel={
                sector === 'saved'
                  ? 'No saved articles yet.'
                  : 'Watchlist is empty.'
              }
              onSearchChange={setSearch}
              onSelect={setSelected}
              onToggleSave={onToggleSave}
            />
          )}

          {sector === 'chat' && (
            <ChatPanel
              loading={loadingChat}
              reply={chatReply}
              error={chatError}
              onClearReply={clearChatReply}
            />
          )}

          {sector === 'summary' && (
            <SummaryPanel
              loading={loadingBriefing}
              briefing={briefing}
              summaries={summaries}
              error={summaryError}
            />
          )}

          {sector === 'settings' && <SettingsPanel settings={settings} />}
        </main>

        {showDetail && (
          <DetailPanel
            item={selected}
            saved={selected ? savedIds.has(selected.id) : false}
            watched={selected ? watchIds.has(selected.id) : false}
            onToggleSave={() => selected && onToggleSave(selected)}
            onToggleWatch={() => selected && onToggleWatch(selected)}
          />
        )}
      </div>
    </div>
  );
}
