import * as vscode from 'vscode';
import { fetchFeeds } from './api-client';
import {
  ExtensionSettings,
  HostToWebview,
  NewsItem,
  SectorId,
  WebviewToHost,
} from './types';

const SAVED_KEY = 'newsdash.saved';
const WATCHLIST_KEY = 'newsdash.watchlist';

let dashboardPanel: vscode.WebviewPanel | undefined;
let refreshTimer: ReturnType<typeof setInterval> | undefined;
let currentSector: SectorId = 'all';

export function activate(context: vscode.ExtensionContext) {
  const openCmd = vscode.commands.registerCommand('newsdash.openDashboard', () => {
    openDashboard(context);
  });

  const refreshCmd = vscode.commands.registerCommand('newsdash.refresh', () => {
    if (dashboardPanel) {
      void loadFeeds(context, dashboardPanel.webview, currentSector);
    } else {
      openDashboard(context);
    }
  });

  const sidebarProvider = new NewsDashSidebarProvider(context);
  context.subscriptions.push(
    openCmd,
    refreshCmd,
    vscode.window.registerWebviewViewProvider('newsdash.sidebar', sidebarProvider)
  );

  // Open dashboard on first activation from activity bar click is handled by the sidebar CTA
}

export function deactivate() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = undefined;
  }
}

function getSettings(): ExtensionSettings {
  const cfg = vscode.workspace.getConfiguration('newsdash');
  return {
    apiBaseUrl: cfg.get<string>('apiBaseUrl') ?? 'https://news-dashboard-six-indol.vercel.app',
    refreshInterval: cfg.get<number>('refreshInterval') ?? 60,
  };
}

async function updateSettings(partial: Partial<ExtensionSettings>) {
  const cfg = vscode.workspace.getConfiguration('newsdash');
  if (partial.apiBaseUrl !== undefined) {
    await cfg.update('apiBaseUrl', partial.apiBaseUrl, vscode.ConfigurationTarget.Global);
  }
  if (partial.refreshInterval !== undefined) {
    await cfg.update('refreshInterval', partial.refreshInterval, vscode.ConfigurationTarget.Global);
  }
}

function getSaved(context: vscode.ExtensionContext): NewsItem[] {
  return context.globalState.get<NewsItem[]>(SAVED_KEY) ?? [];
}

function getWatchlist(context: vscode.ExtensionContext): NewsItem[] {
  return context.globalState.get<NewsItem[]>(WATCHLIST_KEY) ?? [];
}

async function setSaved(context: vscode.ExtensionContext, items: NewsItem[]) {
  await context.globalState.update(SAVED_KEY, items);
}

async function setWatchlist(context: vscode.ExtensionContext, items: NewsItem[]) {
  await context.globalState.update(WATCHLIST_KEY, items);
}

function post(webview: vscode.Webview, msg: HostToWebview) {
  void webview.postMessage(msg);
}

async function loadFeeds(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
  sector: SectorId
) {
  currentSector = sector;
  post(webview, { type: 'loading', loading: true });
  try {
    const { apiBaseUrl } = getSettings();
    const items = await fetchFeeds(apiBaseUrl, sector);
    post(webview, { type: 'feedsResult', items, sector });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    post(webview, { type: 'feedsResult', items: [], sector, error: message });
  } finally {
    post(webview, { type: 'loading', loading: false });
  }
}

function pushLocalState(context: vscode.ExtensionContext, webview: vscode.Webview) {
  post(webview, { type: 'savedItems', items: getSaved(context) });
  post(webview, { type: 'watchlistItems', items: getWatchlist(context) });
  post(webview, { type: 'settings', settings: getSettings() });
}

function setupRefresh(context: vscode.ExtensionContext, webview: vscode.Webview) {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = undefined;
  }
  const { refreshInterval } = getSettings();
  if (refreshInterval > 0) {
    refreshTimer = setInterval(() => {
      void loadFeeds(context, webview, currentSector);
    }, refreshInterval * 1000);
  }
}

async function handleMessage(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
  raw: WebviewToHost
) {
  switch (raw.type) {
    case 'ready':
      pushLocalState(context, webview);
      await loadFeeds(context, webview, currentSector);
      setupRefresh(context, webview);
      break;
    case 'fetchFeeds':
      await loadFeeds(context, webview, raw.sector);
      break;
    case 'saveItem': {
      const saved = getSaved(context);
      if (!saved.some((i) => i.id === raw.item.id)) {
        await setSaved(context, [raw.item, ...saved]);
      }
      post(webview, { type: 'savedItems', items: getSaved(context) });
      break;
    }
    case 'unsaveItem': {
      await setSaved(
        context,
        getSaved(context).filter((i) => i.id !== raw.id)
      );
      post(webview, { type: 'savedItems', items: getSaved(context) });
      break;
    }
    case 'watchItem': {
      const list = getWatchlist(context);
      if (!list.some((i) => i.id === raw.item.id)) {
        await setWatchlist(context, [raw.item, ...list]);
      }
      post(webview, { type: 'watchlistItems', items: getWatchlist(context) });
      break;
    }
    case 'unwatchItem': {
      await setWatchlist(
        context,
        getWatchlist(context).filter((i) => i.id !== raw.id)
      );
      post(webview, { type: 'watchlistItems', items: getWatchlist(context) });
      break;
    }
    case 'openExternal':
      await vscode.env.openExternal(vscode.Uri.parse(raw.url));
      break;
    case 'copyUrl':
      await vscode.env.clipboard.writeText(raw.url);
      void vscode.window.showInformationMessage('Link copied to clipboard');
      break;
    case 'getSettings':
      post(webview, { type: 'settings', settings: getSettings() });
      break;
    case 'updateSettings':
      await updateSettings(raw.settings);
      post(webview, { type: 'settingsUpdated', settings: getSettings() });
      setupRefresh(context, webview);
      break;
  }
}

function getWebviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const distUri = vscode.Uri.joinPath(extensionUri, 'dist', 'webview');
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(distUri, 'assets', 'index.js'));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(distUri, 'assets', 'style.css'));
  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https: data:; font-src ${webview.cspSource}; connect-src 'none';" />
  <link rel="stylesheet" href="${styleUri}" />
  <title>NewsDash</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function openDashboard(context: vscode.ExtensionContext) {
  if (dashboardPanel) {
    dashboardPanel.reveal(vscode.ViewColumn.One);
    return;
  }

  dashboardPanel = vscode.window.createWebviewPanel(
    'newsdash.dashboard',
    'NewsDash',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview'),
        vscode.Uri.joinPath(context.extensionUri, 'media'),
      ],
    }
  );

  dashboardPanel.iconPath = {
    light: vscode.Uri.joinPath(context.extensionUri, 'media', 'icon.png'),
    dark: vscode.Uri.joinPath(context.extensionUri, 'media', 'icon.png'),
  };

  dashboardPanel.webview.html = getWebviewHtml(dashboardPanel.webview, context.extensionUri);

  dashboardPanel.webview.onDidReceiveMessage(
    (msg: WebviewToHost) => handleMessage(context, dashboardPanel!.webview, msg),
    undefined,
    context.subscriptions
  );

  dashboardPanel.onDidDispose(
    () => {
      dashboardPanel = undefined;
      if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = undefined;
      }
    },
    undefined,
    context.subscriptions
  );
}

class NewsDashSidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'media'),
      ],
    };

    webviewView.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      padding: 16px;
      margin: 0;
    }
    h2 { font-size: 13px; font-weight: 600; margin: 0 0 8px; }
    p { font-size: 12px; opacity: 0.85; line-height: 1.45; margin: 0 0 16px; }
    button {
      width: 100%;
      padding: 8px 12px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      cursor: pointer;
      font-size: 13px;
      border-radius: 2px;
    }
    button:hover { background: var(--vscode-button-hoverBackground); }
  </style>
</head>
<body>
  <h2>NewsDash</h2>
  <p>Real-time AI News Intelligence across tech, markets, crypto, and research.</p>
  <button id="open">Open Dashboard</button>
  <script>
    const vscode = acquireVsCodeApi();
    document.getElementById('open').addEventListener('click', () => {
      vscode.postMessage({ type: 'openDashboard' });
    });
  </script>
</body>
</html>`;

    webviewView.webview.onDidReceiveMessage(() => {
      openDashboard(this.context);
    });
  }
}

function getNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}
