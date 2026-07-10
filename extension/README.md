# NewsDash for Visual Studio Code

**Real-time AI News Intelligence inside your editor.**

NewsDash brings a Technology Control Center into VS Code: live sector headlines, market telemetry, critical alerts, AI chat, and daily summaries — without leaving your workspace.

![NewsDash](https://raw.githubusercontent.com/osmanyousaaf/news-dashboard/main/extension/media/logo.png)

## Highlights

- **Control Center** — Top technology news, global hot trends, operations timeline, and framework & research radar
- **Critical Breaking Alert** — High-significance stories surface immediately when detected
- **Live market ticker** — London weather plus major crypto prices with clear up/down movement
- **Sector intelligence** — Technology, AI, Cybersecurity, Cloud & DevOps, GitHub, Research, Startups, Crypto, Forex, Gold, Trading, Geopolitics
- **AI Chat & Quick Summary** — Conversational briefing and distilled daily intelligence
- **Saved & Watchlist** — Keep important stories locally in VS Code
- **Light / Dark theme** — Clean, readable interface for long reading sessions

## Install

1. Open VS Code
2. Go to **Extensions**
3. Search for **NewsDash** by `usmanyousaaf`
4. Click **Install**
5. Run **NewsDash: Open Dashboard** from the Command Palette, or use the Activity Bar icon

Marketplace: [NewsDash](https://marketplace.visualstudio.com/items?itemName=usmanyousaaf.newsdash)

## Usage

| Action | How |
|--------|-----|
| Open dashboard | Command Palette → `NewsDash: Open Dashboard` |
| Switch sectors | Left navigation (Technology / Markets & Global) |
| Save an article | Bookmark icon on a card or **Save** in the detail panel |
| Open source article | **Open Full Article** |
| Theme | Moon icon in the top bar |
| AI Chat / Summary | Robot and briefing icons in the top bar |

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `newsdash.apiBaseUrl` | Production NewsDash API | Base URL for live intelligence endpoints |
| `newsdash.refreshInterval` | `60` | Auto-refresh interval in seconds (`0` disables) |

## Privacy

- Saved articles and watchlist items are stored locally in VS Code (`globalState`)
- API keys for AI features remain on the server; they are never bundled in the extension
- The extension requests only the news, market, weather, briefing, and chat endpoints required for the dashboard

## Team

Internship collaboration project.

| Name | Role / Affiliation |
|------|--------------------|
| [Usman Yousaf](https://github.com/usmanyousaaf) (`usmanyousaaf`) | Publisher & Lead |
| Sameer Qureshi | Contributor |
| Faiza BB | Contributor |

### Organizations

- [byteboom.ai](https://byteboom.ai)
- [Croven AI](https://crovenai.com)

## Repository

Source: [github.com/osmanyousaaf/news-dashboard](https://github.com/osmanyousaaf/news-dashboard)

## License

MIT © NewsDash contributors
