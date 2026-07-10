import type { ReactNode } from 'react';
import {
  IconBookmark,
  IconFeed,
  IconFilter,
  IconMoon,
  IconNews,
  IconSectors,
  IconSettings,
  IconWatch,
} from '../icons';
import { NavView } from '../types';
import { postToHost } from '../vscode';

interface Props {
  view: NavView;
  onNavigate: (view: NavView) => void;
}

const NAV: { id: NavView; label: string; icon: ReactNode }[] = [
  { id: 'all', label: 'All News', icon: <IconNews /> },
  { id: 'sector', label: 'By Sector', icon: <IconSectors /> },
  { id: 'saved', label: 'Saved News', icon: <IconBookmark /> },
  { id: 'watchlist', label: 'Watchlist', icon: <IconWatch /> },
  { id: 'settings', label: 'Settings', icon: <IconSettings /> },
];

const FEATURES = [
  { label: 'Real-time News Feed', icon: <IconFeed /> },
  { label: 'Sector Filtering', icon: <IconFilter /> },
  { label: 'Open Full Article', icon: <IconNews /> },
  { label: 'Smart Search', icon: <IconFilter /> },
  { label: 'Dark / Light Mode', icon: <IconMoon /> },
];

export function Sidebar({ view, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">N</div>
        <div className="brand-text">
          <h1>NEWSDASH</h1>
          <p>Real-time AI News Intelligence</p>
        </div>
      </div>

      <nav className="nav">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${view === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="features">
        <h3>FEATURES</h3>
        {FEATURES.map((f) => (
          <div key={f.label} className="feature-row">
            {f.icon}
            <span>{f.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="feedback-btn"
          onClick={() =>
            postToHost({
              type: 'openExternal',
              url: 'https://github.com/osmanyousaaf/news-dashboard/issues',
            })
          }
        >
          Provide Feedback
        </button>
        <div className="version">Version 1.0.0</div>
      </div>
    </aside>
  );
}
