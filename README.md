# NewsDash

**Real-Time AI News Intelligence & Decision Dashboard**

<p align="center">
  <img src="public/logo.png" alt="NewsDash — LIVE NEWS 24/7" width="180" />
</p>

NewsDash aggregates live headlines across technology and markets into a Control Center dashboard — plus a [Visual Studio Code extension](./extension) so the same intelligence stays inside your editor.

**Live app:** [https://news-dashboard-e69n.vercel.app](https://news-dashboard-e69n.vercel.app/)

---

## Features

| Area | What it does |
|------|----------------|
| **Control Center** | Top technology news, global hot trends, operations timeline, framework & research radar |
| **Critical Breaking Alert** | High-significance stories surfaced immediately |
| **Live ticker** | London weather and major crypto prices with up/down movement |
| **Sectors** | Technology, AI, Cybersecurity, Cloud & DevOps, GitHub, Research, Startups, Crypto, Forex, Gold, Trading, Geopolitics |
| **AI Chat & Quick Summary** | Conversational briefing and daily category summaries |
| **VS Code extension** | Full dashboard experience inside VS Code (Activity Bar + webview) |

---

## Repository layout

```
├── src/           # Next.js web dashboard + API routes
├── public/        # Static assets (logo, icons)
└── extension/     # VS Code extension (NewsDash)
```

---

## Web app

Production is deployed on Vercel. Local development:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional environment variable for AI features:

```bash
GROQ_API_KEY=your_key
```

---

## VS Code extension

See [extension/README.md](./extension/README.md) for install, usage, and Marketplace details.

Package locally:

```bash
cd extension
npm install
cd webview-ui && npm install && cd ..
npm run package
```

---

## Contributors

Internship collaboration project.

| Name | Role |
|------|------|
| [Usman Yousaf](https://github.com/usmanyousaaf) | Publisher & Lead |
| Sameer Qureshi | Contributor |
| Faiza BB | Contributor |

### Organizations

- [byteboom.ai](https://byteboom.ai)
- [Croven AI](http://crovenai.com/)

---

## Links

- Web: [news-dashboard-e69n.vercel.app](https://news-dashboard-e69n.vercel.app/)
- Marketplace: [NewsDash](https://marketplace.visualstudio.com/items?itemName=usmanyousaaf.newsdash)
- Source: [github.com/osmanyousaaf/news-dashboard](https://github.com/osmanyousaaf/news-dashboard)

## License

MIT © NewsDash contributors
