# NewsDash for VS Code

Real-time AI News Intelligence inside VS Code. Browse sector-filtered headlines, save articles, and open full stories without leaving the editor.

## Features

- **All News / By Sector** — Technology, Cybersecurity, Cloud & DevOps, Finance, Crypto, Markets, Research, Global
- **Search** — filter loaded headlines by title, description, source
- **Saved News & Watchlist** — stored locally in VS Code (`globalState`)
- **Open Full Article** — opens the source URL in your browser
- **Settings** — API base URL and auto-refresh interval

## Requirements

- VS Code 1.85+
- Network access to the NewsDash API (default: production Vercel deployment)

## Getting started

1. Install the extension (Marketplace or `.vsix`)
2. Click the **NewsDash** icon in the Activity Bar, or run **NewsDash: Open Dashboard** from the Command Palette
3. Browse sectors and open articles

### Local API (optional)

While developing the Next.js backend:

1. Run `npm run dev` in the repo root
2. In VS Code settings, set `newsdash.apiBaseUrl` to `http://localhost:3000`

## Extension settings

| Setting | Default | Description |
|---------|---------|-------------|
| `newsdash.apiBaseUrl` | `https://news-dashboard-six-indol.vercel.app` | API host (no trailing slash) |
| `newsdash.refreshInterval` | `60` | Auto-refresh seconds (`0` = off) |

## Develop this extension

```bash
cd extension
npm install
cd webview-ui && npm install && cd ..
npm run compile
```

Then press **F5** in this workspace (launch config: **Run NewsDash Extension**).

### Package

```bash
cd extension
npm run package
```

Produces `newsdash-1.0.0.vsix`. Install via **Extensions: Install from VSIX…**.

## Publish checklist (Microsoft Marketplace)

1. Create a [publisher](https://marketplace.visualstudio.com/manage) with your Microsoft account
2. Update `"publisher"` in `extension/package.json` to your publisher id
3. Create an Azure DevOps PAT with **Marketplace (Manage)** scope
4. Run:
   ```bash
   npx vsce login <your-publisher-id>
   npx vsce publish
   ```
5. Confirm the listing on [marketplace.visualstudio.com](https://marketplace.visualstudio.com)

**Do not** put `GROQ_API_KEY` or other secrets in the extension — they stay on the Vercel API only.

## Architecture

The extension host fetches `/api/feeds` from your configured API base URL and posts results into a React webview. Saved/Watchlist never leave the local VS Code machine.

## License

MIT
