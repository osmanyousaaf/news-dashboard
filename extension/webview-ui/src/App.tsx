import { useEffect, useMemo, useState } from 'react';
import { DetailPanel } from './components/DetailPanel';
import { FeedPanel } from './components/FeedPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { Sidebar } from './components/Sidebar';
import {
  ExtensionSettings,
  HostToWebview,
  NavView,
  NewsItem,
  SectorId,
} from './types';
import { postToHost, stripHtml } from './vscode';

export default function App() {
  const [view, setView] = useState<NavView>('sector');
  const [sector, setSector] = useState<SectorId>('all');
  const [items, setItems] = useState<NewsItem[]>([]);
  const [saved, setSaved] = useState<NewsItem[]>([]);
  const [watchlist, setWatchlist] = useState<NewsItem[]>([]);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [settings, setSettings] = useState<ExtensionSettings | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent<HostToWebview>) => {
      const msg = event.data;
      if (!msg || typeof msg !== 'object' || !('type' in msg)) return;

      switch (msg.type) {
        case 'loading':
          setLoading(msg.loading);
          break;
        case 'feedsResult':
          setItems(msg.items);
          setError(msg.error);
          setSector(msg.sector);
          if (msg.items.length > 0) {
            setSelected((prev) => {
              if (prev && msg.items.some((i) => i.id === prev.id)) return prev;
              return msg.items[0];
            });
          }
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

  const sourceItems = useMemo(() => {
    if (view === 'saved') return saved;
    if (view === 'watchlist') return watchlist;
    return items;
  }, [view, saved, watchlist, items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sourceItems;
    return sourceItems.filter((item) => {
      const hay = `${item.title} ${stripHtml(item.description)} ${item.source} ${item.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [sourceItems, search]);

  const onNavigate = (next: NavView) => {
    setView(next);
    setSearch('');
    if (next === 'all') {
      setSector('all');
      postToHost({ type: 'fetchFeeds', sector: 'all' });
    } else if (next === 'sector') {
      postToHost({ type: 'fetchFeeds', sector });
    }
  };

  const onSectorChange = (next: SectorId) => {
    setSector(next);
    setView('sector');
    postToHost({ type: 'fetchFeeds', sector: next });
  };

  const onToggleSave = (item: NewsItem) => {
    if (savedIds.has(item.id)) {
      postToHost({ type: 'unsaveItem', id: item.id });
    } else {
      postToHost({ type: 'saveItem', item });
    }
  };

  const onToggleWatch = (item: NewsItem) => {
    if (watchIds.has(item.id)) {
      postToHost({ type: 'unwatchItem', id: item.id });
    } else {
      postToHost({ type: 'watchItem', item });
    }
  };

  const emptyLabel =
    view === 'saved'
      ? 'No saved articles yet. Bookmark headlines to see them here.'
      : view === 'watchlist'
        ? 'Watchlist is empty. Add articles from the detail panel.'
        : 'No headlines for this sector.';

  return (
    <div className="app">
      <Sidebar view={view} onNavigate={onNavigate} />

      {view === 'settings' ? (
        <>
          <SettingsPanel settings={settings} />
          <DetailPanel
            item={null}
            saved={false}
            watched={false}
            onToggleSave={() => undefined}
            onToggleWatch={() => undefined}
          />
        </>
      ) : (
        <>
          <FeedPanel
            items={filtered}
            selectedId={selected?.id ?? null}
            sector={sector}
            search={search}
            loading={loading && (view === 'all' || view === 'sector')}
            error={view === 'all' || view === 'sector' ? error : undefined}
            savedIds={savedIds}
            showSectorPills={view === 'all' || view === 'sector'}
            emptyLabel={emptyLabel}
            onSearchChange={setSearch}
            onSectorChange={onSectorChange}
            onSelect={setSelected}
            onToggleSave={onToggleSave}
          />
          <DetailPanel
            item={selected}
            saved={selected ? savedIds.has(selected.id) : false}
            watched={selected ? watchIds.has(selected.id) : false}
            onToggleSave={() => selected && onToggleSave(selected)}
            onToggleWatch={() => selected && onToggleWatch(selected)}
          />
        </>
      )}
    </div>
  );
}
