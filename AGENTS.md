# AGENTS.md — Migini

Guide for AI agents working on this codebase. Read before making changes.

## Product

Ad-free games for young children (roughly 3–8 years). One universe with two recurring characters in every game:

- **Kapi** (capybara, `kapi`) and **Bao** (panda, `bao`), drawn as SVG in `frontend/src/characters/Character.tsx`.
- Characters take a `mood` (`idle | happy | hungry | yum | no`) and an optional chef `hat`. Reuse them; don't draw new versions per game.

Design principles, which every game must follow:
- No ads, no external links, no tracking, no accounts, no network calls at runtime. Fonts are self-hosted.
- No fail states or timers that punish. Wrong answers get a gentle shake + sound, never a penalty.
- Kids may not read: every instruction goes in a `SpeechBubble` (read aloud automatically and on tap).
- Touch first: targets ≥ 64px, works in portrait and landscape phones, tablets and desktop.

## Stack

Frontend only: React 18 + TypeScript + Vite + CSS Modules, installable PWA via `vite-plugin-pwa`. There is no backend.

```
frontend/
├── public/                 # favicon.svg (source of all icons) + generated PNG icons
├── scripts/render-icons.mjs
├── e2e/                    # Playwright specs
└── src/
    ├── characters/         # Kapi & Bao (SVG) + names
    ├── components/         # TopBar, SpeechBubble, Celebration
    ├── games/<game>/       # one folder per game; stages/ for multi-step games
    ├── i18n/               # da.json + en.json
    ├── lib/                # sound.ts (Web Audio), speech.ts (Web Speech), useLater.ts
    ├── pages/HomePage.tsx  # game hub
    ├── store/              # Zustand: settingsStore (sound, lang), progressStore (stars)
    └── styles/global.css   # design tokens, .btn
```

## Adding a game

1. Create `src/games/<name>/` with a top-level component that renders `<TopBar onBack=…/>`.
2. Register the route in `App.tsx` and add a card to `HomePage.tsx`.
3. Use `Character` for Kapi/Bao, `SpeechBubble` for instructions, `sfx` for sounds, `useLater` for timeouts.
4. Persist progress in `progressStore` (extend it; keep it on-device).
5. Add every string to both `da.json` and `en.json` under a `<name>.` prefix.
6. Add a Playwright spec in `frontend/e2e/` that plays the game through once. Add `data-testid` where roles/names aren't enough.

## Conventions

- Colors come from CSS variables in `global.css`; game art may use its own colors.
- Call `stopSpeaking()` when leaving a screen mid-sentence.
- Pantry/drag interactions use pointer events with `touch-action: none` plus an `onClick` fallback, so tap, drag and keyboard all work.

## Verification

```bash
cd frontend && npm run type-check && npm run test:e2e
```

In sandboxes without a Playwright browser download, set `CHROMIUM_PATH` to a local Chromium binary.

## Deployment

Push to `main` → GitHub Actions builds `frontend` image (nginx, port 5173) → GHCR → Watchtower redeploys. Traefik routes everything to `wordblitz-frontend:5173`.
