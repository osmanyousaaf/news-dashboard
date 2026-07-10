import { IconBookmark, IconExternal, IconShare } from '../icons';
import { CATEGORY_LABELS, NewsItem } from '../types';
import { extractHighlights, formatRelativeTime, postToHost, stripHtml } from '../vscode';

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
        <div className="detail-empty">
          <h2>Select an article</h2>
          <p>Pick a headline from the feed to see summary, highlights, and source.</p>
        </div>
      </aside>
    );
  }

  const label =
    CATEGORY_LABELS[item.subcategory ?? ''] ||
    CATEGORY_LABELS[item.category] ||
    item.category;
  const summary = stripHtml(item.description);
  const highlights = extractHighlights(item.description);

  return (
    <aside className="detail">
      <h2>{item.title}</h2>
      <div className="detail-meta">
        <span className="tag">{label}</span>
        <span>{formatRelativeTime(item.publishedAt)}</span>
        <span>{item.source}</span>
      </div>

      <div className="detail-actions">
        <button type="button" className="btn" onClick={onToggleSave}>
          <IconBookmark filled={saved} />
          {saved ? 'Saved' : 'Save'}
        </button>
        <button type="button" className="btn" onClick={onToggleWatch}>
          {watched ? 'Watching' : 'Watch'}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => postToHost({ type: 'copyUrl', url: item.url })}
        >
          <IconShare />
          Share
        </button>
      </div>

      {summary && (
        <div className="section">
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}

      {highlights.length > 0 && (
        <div className="section">
          <h3>Key Highlights</h3>
          <ul>
            {highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
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
        <IconExternal />
      </button>
    </aside>
  );
}
