import type { ReactNode } from 'react';
import { NAV_ITEMS, SectorId } from '../types';

interface Props {
  active: SectorId;
  onNavigate: (id: SectorId) => void;
}

const ICONS: Record<string, ReactNode> = {
  control: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  saved: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 3h12v18l-6-4-6 4V3z" />
    </svg>
  ),
  watchlist: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="4" y="5" width="16" height="12" rx="3" />
      <circle cx="9" cy="11" r="1.2" fill="currentColor" />
      <circle cx="15" cy="11" r="1.2" fill="currentColor" />
    </svg>
  ),
  summary: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 4h10v16H7z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M4.2 6.2l1.4 1.4M18.4 16.4l1.4 1.4M3 12h2M19 12h2M4.2 17.8l1.4-1.4M18.4 7.6l1.4-1.4" />
    </svg>
  ),
};

const SECTIONS: { key: 'ops' | 'tech' | 'markets' | 'library' | 'tools'; title: string }[] = [
  { key: 'ops', title: 'OPERATIONS' },
  { key: 'tech', title: 'TECHNOLOGY' },
  { key: 'markets', title: 'MARKETS & GLOBAL' },
  { key: 'library', title: 'LIBRARY' },
  { key: 'tools', title: 'TOOLS' },
];

export function Sidebar({ active, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      {SECTIONS.map((section) => {
        const items = NAV_ITEMS.filter((i) => i.section === section.key);
        if (!items.length) return null;
        return (
          <div key={section.key} className="nav-section">
            <h3>{section.title}</h3>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-item${active === item.id ? ' active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                {item.accent ? (
                  <span className="nav-dot" style={{ background: item.accent }} />
                ) : (
                  ICONS[item.id] ?? <span className="nav-dot" style={{ background: 'var(--text-dim)' }} />
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        );
      })}
    </aside>
  );
}
