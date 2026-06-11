# Playwright E2E Tests

End-to-end tests for Migini Games. They run against a live stack (frontend + backend + db).

## Running locally

```bash
docker compose up -d        # from the repo root — full stack on :5173/:8080
cd frontend
npx playwright install      # first time only: download browsers
npm run test:e2e            # all specs, chromium + firefox
npm run test:e2e:ui         # interactive UI mode
```

The dev compose stack must be running; the Playwright `webServer` reuses the vite server on :5173. Tests log in with the seeded `Gæst` profile (PIN `1234`, from migration V7) and the admin specs use the dev credentials `admin`/`admindev` (override with `ADMIN_USERNAME`/`ADMIN_PASSWORD`).

## Layout

```
e2e/
├── fixtures/customFixtures.ts   # authenticatedPage fixture (logs in as Gæst)
├── pages/                       # Page objects (ProfilePicker, Home, WordBlitz, MathBlitz)
└── specs/
    ├── profile-login.spec.ts    # picker, PIN pad, wrong-PIN error
    ├── menu-navigation.spec.ts  # login → hub → leaderboard → logout
    ├── home-hub.spec.ts         # categories, tiles, language toggle, legacy redirects
    ├── game-navigation.spec.ts  # tiles navigate to /play/*
    ├── word-blitz.spec.ts       # plays a real round to game over
    ├── math-blitz.spec.ts       # solves problems, verifies score + leaderboard
    ├── leaderboard.spec.ts      # all four tabs
    └── admin.spec.ts            # admin login, players + progress tabs
```

Selectors use `[class*="name"]` substring matching because CSS-module class names are hashed.

## CI

`.github/workflows/e2e-tests.yml` spins up Postgres, builds and starts the backend jar, and runs the suite against a vite dev server (`BACKEND_URL=http://localhost:8080` points the proxy at the local backend). The HTML report is uploaded as an artifact.
