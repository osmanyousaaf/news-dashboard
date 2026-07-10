import { useEffect } from 'react';
import { CategorySummary, DailyBriefing } from '../types';
import { postToHost } from '../vscode';

interface Props {
  loading: boolean;
  briefing: DailyBriefing | null;
  summaries: CategorySummary[];
  error?: string;
}

export function SummaryPanel({ loading, briefing, summaries, error }: Props) {
  useEffect(() => {
    postToHost({ type: 'fetchBriefing' });
    postToHost({ type: 'fetchSummary' });
  }, []);

  if (loading && !briefing && summaries.length === 0) {
    return (
      <div className="loader-wrap">
        <div className="spinner" />
        <div>Building quick summary…</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Quick Summary</h2>
      <p className="page-sub">Daily briefing and category intelligence distilled for rapid review.</p>
      {error && <div className="error">{error}</div>}

      {briefing && (
        <div className="summary-card">
          <h3>Daily Briefing — {briefing.date}</h3>
          {briefing.topEvents?.slice(0, 5).map((ev) => (
            <p key={ev.rank}>
              <strong>{ev.rank}.</strong> {ev.title}
            </p>
          ))}
          {briefing.breakingHighlights?.length > 0 && (
            <>
              <h3 style={{ marginTop: 12 }}>Breaking highlights</h3>
              {briefing.breakingHighlights.slice(0, 4).map((a) => (
                <p key={a.id}>{a.title}</p>
              ))}
            </>
          )}
        </div>
      )}

      {summaries.map((s) => (
        <div key={s.categoryId} className="summary-card">
          <h3>{s.category}</h3>
          <p>{s.summary}</p>
          <ul>
            {s.headlines.slice(0, 4).map((h) => (
              <li key={h.url}>{h.title}</li>
            ))}
          </ul>
        </div>
      ))}

      {!briefing && summaries.length === 0 && !loading && (
        <div className="empty">No summary data available yet.</div>
      )}
    </div>
  );
}
