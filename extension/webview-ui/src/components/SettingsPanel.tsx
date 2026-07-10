import { useEffect, useState } from 'react';
import { ExtensionSettings } from '../types';
import { postToHost } from '../vscode';

interface Props {
  settings: ExtensionSettings | null;
}

export function SettingsPanel({ settings }: Props) {
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [refreshInterval, setRefreshInterval] = useState('60');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (!settings) return;
    setApiBaseUrl(settings.apiBaseUrl);
    setRefreshInterval(String(settings.refreshInterval));
  }, [settings]);

  const onSave = () => {
    const interval = Math.max(0, Number.parseInt(refreshInterval, 10) || 0);
    postToHost({
      type: 'updateSettings',
      settings: {
        apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
        refreshInterval: interval,
      },
    });
    setSavedMsg('Settings saved.');
    window.setTimeout(() => setSavedMsg(''), 2000);
  };

  return (
    <section className="center">
      <div className="settings-panel">
        <h2>Settings</h2>
        <div className="field">
          <label htmlFor="apiBaseUrl">API Base URL</label>
          <input
            id="apiBaseUrl"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            placeholder="https://news-dashboard-six-indol.vercel.app"
          />
        </div>
        <div className="field">
          <label htmlFor="refreshInterval">Refresh interval (seconds, 0 = off)</label>
          <input
            id="refreshInterval"
            type="number"
            min={0}
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(e.target.value)}
          />
        </div>
        <button type="button" className="btn primary" onClick={onSave}>
          Save Settings
        </button>
        {savedMsg && <p className="status-bar">{savedMsg}</p>}
        <p className="status-bar" style={{ marginTop: 16 }}>
          Tip: point API Base URL at <code>http://localhost:3000</code> while running the Next.js
          app locally.
        </p>
      </div>
    </section>
  );
}
