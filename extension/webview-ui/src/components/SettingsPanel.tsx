import { useEffect, useState } from 'react';
import { ExtensionSettings } from '../types';
import { postToHost } from '../vscode';

interface Props {
  settings: ExtensionSettings | null;
}

export function SettingsPanel({ settings }: Props) {
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [refreshInterval, setRefreshInterval] = useState('60');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!settings) return;
    setApiBaseUrl(settings.apiBaseUrl);
    setRefreshInterval(String(settings.refreshInterval));
  }, [settings]);

  const onSave = () => {
    postToHost({
      type: 'updateSettings',
      settings: {
        apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
        refreshInterval: Math.max(0, Number.parseInt(refreshInterval, 10) || 0),
      },
    });
    setMsg('Settings saved.');
    window.setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div>
      <h2 className="page-title">Settings</h2>
      <p className="page-sub">Configure the NewsDash intelligence endpoint and refresh cadence.</p>
      <div className="field">
        <label htmlFor="apiBaseUrl">API Base URL</label>
        <input
          id="apiBaseUrl"
          value={apiBaseUrl}
          onChange={(e) => setApiBaseUrl(e.target.value)}
          placeholder="https://your-deployment.vercel.app"
        />
      </div>
      <div className="field">
        <label htmlFor="refreshInterval">Auto-refresh (seconds, 0 = off)</label>
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
      {msg && <p className="page-sub" style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
