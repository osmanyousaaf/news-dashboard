import { WebviewToHost } from './types';

type VsCodeApi = {
  postMessage(message: WebviewToHost): void;
  getState(): unknown;
  setState(state: unknown): void;
};

function getApi(): VsCodeApi {
  try {
    return acquireVsCodeApi();
  } catch {
    return {
      postMessage() {},
      getState() {
        return undefined;
      },
      setState() {},
    };
  }
}

const vscode = getApi();

export function postToHost(message: WebviewToHost) {
  vscode.postMessage(message);
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function formatPrice(n: number): string {
  if (n >= 1000) {
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
  if (n >= 1) {
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
}

export function getLogoUri(): string {
  const el = document.getElementById('root');
  return el?.getAttribute('data-logo-uri') ?? '';
}
