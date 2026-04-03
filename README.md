# V Edit — Video Editor

A production-grade browser-based video timeline editor built with React + Vite + Zustand.

## Architecture

```
vedit/
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Root layout (TopBar / Preview / Timeline / RightPanel)
│   ├── store.js              # Zustand global state (clips, tracks, playback)
│   └── components/
│       ├── TopBar.jsx        # App header, undo/redo, save
│       ├── PreviewPanel.jsx  # Video preview monitor + playback controls
│       ├── Timeline.jsx      # Main timeline canvas with playhead
│       ├── TimelineRuler.jsx # Time ruler with tick marks
│       ├── TrackHeaders.jsx  # Track labels, mute, lock, delete
│       ├── Clip.jsx          # Draggable/resizable clip blocks
│       └── RightPanel.jsx    # Inspector / Media / Effects / Export panels
├── index.html
├── vite.config.js
├── vercel.json               # Vercel one-click deploy
├── netlify.toml              # Netlify deploy config
├── Dockerfile                # Docker container
└── nginx.conf                # Nginx for Docker
```

## Features
- Multi-track timeline (video, audio, text, effects)
- Drag clips to reposition, drag edges to resize
- Double-click clip to delete
- Real-time playhead with animated preview
- Inspector panel: edit clip label, start, duration, transform
- Media library panel
- Effects & color grading panel
- Export settings panel
- Zoom in/out, grid toggle, snap toggle
- Track mute, lock, delete, add

---

## 🚀 Deploy to get a URL

### Option 1: Vercel (fastest — 2 min)

```bash
npm install -g vercel
npm install
vercel --prod
```

Your URL: `https://vedit-XXXX.vercel.app`

---

### Option 2: Netlify

```bash
npm install -g netlify-cli
npm install && npm run build
netlify deploy --prod --dir=dist
```

Your URL: `https://vedit-XXXX.netlify.app`

---

### Option 3: Docker (self-hosted / any cloud VM)

```bash
docker build -t vedit .
docker run -p 80:80 vedit
```

Then deploy to any cloud:
- **Railway**: `railway up`
- **Render**: Connect GitHub repo, set build=`npm run build`, publish=`dist`
- **AWS/GCP/Azure**: Push Docker image, run on port 80

---

### Option 4: GitHub Pages

```bash
npm install
npm run build
npx gh-pages -d dist
```

Your URL: `https://YOUR_USERNAME.github.io/vedit`

---

## Local dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Use in automation frameworks

Once deployed, your base URL is the app root:

```
https://your-deploy-url.vercel.app/
```

For Playwright / Selenium / Cypress:
```js
await page.goto('https://your-deploy-url.vercel.app/')
```

The app is a pure SPA — all state lives in memory (Zustand), all routes resolve to `/`.
