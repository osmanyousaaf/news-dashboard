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
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export function extractHighlights(description: string): string[] {
  const text = description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return [];
  const parts = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
  return parts.slice(0, 4);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
