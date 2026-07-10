import { CATEGORY_LABELS, NewsItem } from '../types';
import { formatRelativeTime, postToHost, stripHtml } from '../vscode';

interface Props {
  items: NewsItem[];
  loading: boolean;
  error?: string;
  onSelect: (item: NewsItem) => void;
}

function sortHomeFeed(items: NewsItem[]): NewsItem[] {
  const tech = new Set(['tech', 'ai', 'github', 'research']);
  let geo = 0;
  const filtered = items.filter((item) => {
    if (item.category === 'global') return geo++ < 2;
    return true;
  });
  return filtered.sort((a, b) => {
    const as = (a.significance || 5) * (tech.has(a.category) ? 1.15 : 1);
    const bs = (b.significance || 5) * (tech.has(b.category) ? 1.15 : 1);
    return bs - as || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

function hotTrends(items: NewsItem[]) {
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const counts = new Map<string, number>();
  for (const item of items) {
    if (new Date(item.publishedAt).getTime() < since) continue;
    for (const tag of item.tags?.slice(0, 4) ?? []) {
      const key = tag.trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
}

export function ControlCenter({ items, loading, error, onSelect }: Props) {
  if (loading && items.length === 0) {
    return (
      <div className="loader-wrap">
        <div className="spinner" />
        <div>Synchronizing intelligence streams…</div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return <div className="error">{error}</div>;
  }

  const sorted = sortHomeFeed(items);
  const breaking = sorted.find((i) => i.significance >= 9) ?? null;
  const top = sorted.filter((i) => i.id !== breaking?.id).slice(0, 8);
  const trends = hotTrends(items);
  const timeline = items
    .filter((i) => Date.now() - new Date(i.publishedAt).getTime() < 24 * 60 * 60 * 1000)
    .slice(0, 8);
  const github = items.filter((n) => n.category === 'github').slice(0, 3);
  const research = items
    .filter((n) => {
      const text = `${n.title} ${n.source} ${n.subcategory ?? ''}`;
      return (n.subcategory ?? '').toLowerCase().includes('academic') || /arxiv|preprint/i.test(text);
    })
    .slice(0, 5);

  return (
    <div>
      <h2 className="page-title">Technology Control Center</h2>
      <p className="page-sub">
        Real-time AI, security, developer and research signal — prioritized by importance, not just
        recency.
      </p>

      {breaking && (
        <div
          className="breaking"
          onClick={() => postToHost({ type: 'openExternal', url: breaking.url })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && postToHost({ type: 'openExternal', url: breaking.url })}
        >
          <div className="badge">CRITICAL BREAKING ALERT</div>
          <h3>{breaking.title}</h3>
          {breaking.description && <p>{stripHtml(breaking.description)}</p>}
          <div className="meta">
            <span>{breaking.source}</span>
            <span>{formatRelativeTime(breaking.publishedAt)}</span>
          </div>
        </div>
      )}

      <div className="home-grid">
        <div className="panel">
          <div className="panel-h">
            <h3>Top Technology News</h3>
          </div>
          <div className="panel-b">
            {top.map((item) => (
              <div key={item.id} className="news-row" onClick={() => onSelect(item)}>
                <div>
                  <h4>{item.title}</h4>
                  <p>{stripHtml(item.description).slice(0, 120)}</p>
                  <div className="meta-line">
                    <span className="tag">{CATEGORY_LABELS[item.category] ?? item.category}</span>
                    <span>{formatRelativeTime(item.publishedAt)}</span>
                    <span>{item.source}</span>
                  </div>
                </div>
              </div>
            ))}
            {top.length === 0 && <div className="empty">No headlines available.</div>}
          </div>
        </div>

        <div className="panel">
          <div className="panel-h">
            <h3>Global Hot Trends</h3>
          </div>
          <div className="panel-b">
            {trends.map(([tag, count], idx) => (
              <div key={tag} className="trend-row">
                <div className="rank">{idx + 1}</div>
                <div>
                  <h4>{tag}</h4>
                  <p>{count} mentions in the last 24 hours</p>
                </div>
              </div>
            ))}
            {trends.length === 0 && <div className="empty">Collecting trend signals…</div>}
          </div>
        </div>

        <div className="panel">
          <div className="panel-h">
            <h3>Global Operations Timeline</h3>
          </div>
          <div className="panel-b">
            {timeline.map((item) => (
              <div key={item.id} className="timeline-row" onClick={() => onSelect(item)}>
                <div>
                  <h4>{item.title}</h4>
                  <div className="meta-line">
                    {item.significance >= 8 && <span className="pill-high">HIGH</span>}
                    <span>{formatRelativeTime(item.publishedAt)}</span>
                    <span>{item.source}</span>
                  </div>
                </div>
              </div>
            ))}
            {timeline.length === 0 && <div className="empty">No recent operations events.</div>}
          </div>
        </div>

        <div className="panel">
          <div className="panel-h">
            <h3>Framework & Research Radar</h3>
          </div>
          <div className="panel-b">
            {[...github, ...research].map((item) => (
              <div key={item.id} className="radar-row" onClick={() => onSelect(item)}>
                <div>
                  <h4>{item.title}</h4>
                  <div className="meta-line">
                    <span className="tag">
                      {item.category === 'github' ? 'Framework' : 'Research'}
                    </span>
                    <span>{item.source}</span>
                  </div>
                </div>
              </div>
            ))}
            {github.length + research.length === 0 && (
              <div className="empty">Radar is quiet right now.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
