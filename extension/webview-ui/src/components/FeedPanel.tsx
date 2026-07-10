import { IconBookmark, IconEye, IconSearch } from '../icons';
import {
  CATEGORY_LABELS,
  NewsItem,
  SectorId,
  SECTORS,
} from '../types';
import { formatRelativeTime, stripHtml } from '../vscode';

interface Props {
  items: NewsItem[];
  selectedId: string | null;
  sector: SectorId;
  search: string;
  loading: boolean;
  error?: string;
  savedIds: Set<string>;
  showSectorPills: boolean;
  emptyLabel: string;
  onSearchChange: (value: string) => void;
  onSectorChange: (sector: SectorId) => void;
  onSelect: (item: NewsItem) => void;
  onToggleSave: (item: NewsItem) => void;
}

export function FeedPanel({
  items,
  selectedId,
  sector,
  search,
  loading,
  error,
  savedIds,
  showSectorPills,
  emptyLabel,
  onSearchChange,
  onSectorChange,
  onSelect,
  onToggleSave,
}: Props) {
  return (
    <section className="center">
      <div className="search-wrap">
        <div className="search">
          <IconSearch />
          <input
            type="search"
            placeholder="Search news across sectors, keywords, sources..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {showSectorPills && (
        <div className="pills">
          {SECTORS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`pill${sector === s.id ? ' active' : ''}`}
              onClick={() => onSectorChange(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {error && <div className="status-bar error">{error}</div>}
      {loading && !error && <div className="status-bar">Loading headlines…</div>}
      {!loading && !error && items.length === 0 && (
        <div className="status-bar">{emptyLabel}</div>
      )}

      <div className="feed">
        {items.map((item) => {
          const snippet = stripHtml(item.description);
          const label =
            CATEGORY_LABELS[item.subcategory ?? ''] ||
            CATEGORY_LABELS[item.category] ||
            item.category;
          const saved = savedIds.has(item.id);
          return (
            <article
              key={item.id}
              className={`card${selectedId === item.id ? ' selected' : ''}`}
              onClick={() => onSelect(item)}
            >
              <div>
                <h3 className="card-title">{item.title}</h3>
                {snippet && <p className="card-snippet">{snippet}</p>}
                <div className="card-meta">
                  <span className="tag">{label}</span>
                  <span>{formatRelativeTime(item.publishedAt)}</span>
                  <span>{item.source}</span>
                </div>
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  className="icon-btn"
                  title="View"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item);
                  }}
                >
                  <IconEye />
                </button>
                <button
                  type="button"
                  className={`icon-btn${saved ? ' active' : ''}`}
                  title={saved ? 'Unsave' : 'Save'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(item);
                  }}
                >
                  <IconBookmark filled={saved} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
