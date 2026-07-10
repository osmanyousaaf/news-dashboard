import { CATEGORY_LABELS, NewsItem } from '../types';
import { formatRelativeTime, stripHtml } from '../vscode';

interface Props {
  title: string;
  subtitle?: string;
  items: NewsItem[];
  selectedId: string | null;
  search: string;
  loading: boolean;
  error?: string;
  savedIds: Set<string>;
  emptyLabel: string;
  onSearchChange: (v: string) => void;
  onSelect: (item: NewsItem) => void;
  onToggleSave: (item: NewsItem) => void;
}

export function FeedPanel({
  title,
  subtitle,
  items,
  selectedId,
  search,
  loading,
  error,
  savedIds,
  emptyLabel,
  onSearchChange,
  onSelect,
  onToggleSave,
}: Props) {
  return (
    <div>
      <h2 className="page-title">{title}</h2>
      {subtitle && <p className="page-sub">{subtitle}</p>}

      <div className="search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Search headlines, sources, keywords…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {loading && (
        <div className="loader-wrap">
          <div className="spinner" />
          <div>Loading headlines…</div>
        </div>
      )}

      {!loading && error && <div className="error">{error}</div>}
      {!loading && !error && items.length === 0 && <div className="empty">{emptyLabel}</div>}

      {!loading &&
        items.map((item, index) => {
          const saved = savedIds.has(item.id);
          return (
            <article
              key={item.id}
              className={`card${selectedId === item.id ? ' selected' : ''}`}
              style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
              onClick={() => onSelect(item)}
            >
              <div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-snippet">{stripHtml(item.description)}</p>
                <div className="meta-line">
                  <span className="tag">{CATEGORY_LABELS[item.category] ?? item.category}</span>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="15" height="15">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
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
                  <svg
                    viewBox="0 0 24 24"
                    fill={saved ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.7"
                    width="15"
                    height="15"
                  >
                    <path d="M6 3h12v18l-6-4-6 4V3z" />
                  </svg>
                </button>
              </div>
            </article>
          );
        })}
    </div>
  );
}
