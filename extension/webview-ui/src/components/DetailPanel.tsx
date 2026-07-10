import { CATEGORY_LABELS, NewsItem } from '../types';
import { formatRelativeTime, postToHost, stripHtml } from '../vscode';

interface Props {
  item: NewsItem | null;
  saved: boolean;
  watched: boolean;
  onToggleSave: () => void;
  onToggleWatch: () => void;
}

export function DetailPanel({ item, saved, watched, onToggleSave, onToggleWatch }: Props) {
  if (!item) {
    return (
      <aside className="detail">
        <div className="empty">
          <h2 style={{ color: 'var(--text)', fontSize: 15, marginBottom: 8 }}>Select an article</h2>
          <p>Choose a headline to review summary, source, and actions.</p>
        </div>
      </aside>
    );
  }

  const summary = stripHtml(item.description);

  return (
    <aside className="detail">
      <h2>{item.title}</h2>
      <div className="meta-line">
        <span className="tag">{CATEGORY_LABELS[item.category] ?? item.category}</span>
        <span>{formatRelativeTime(item.publishedAt)}</span>
        <span>{item.source}</span>
      </div>

      <div className="detail-actions">
        <button type="button" className="btn" onClick={onToggleSave}>
          {saved ? 'Saved' : 'Save'}
        </button>
        <button type="button" className="btn" onClick={onToggleWatch}>
          {watched ? 'Watching' : 'Watch'}
        </button>
        <button type="button" className="btn" onClick={() => postToHost({ type: 'copyUrl', url: item.url })}>
          Share
        </button>
      </div>

      {summary && (
        <div className="section">
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}

      <div className="section">
        <h3>Source</h3>
        <a
          href={item.url}
          onClick={(e) => {
            e.preventDefault();
            postToHost({ type: 'openExternal', url: item.url });
          }}
        >
          {item.url}
        </a>
      </div>

      <button
        type="button"
        className="btn primary open-full"
        onClick={() => postToHost({ type: 'openExternal', url: item.url })}
      >
        Open Full Article
      </button>
    </aside>
  );
}
