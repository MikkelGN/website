# Migini Games

A bilingual (Danish/English) game hub for kids — built for my own children. Minimalistic, rounded design with a fixed five-colour palette. Kids log in by picking their profile and entering a 4-digit PIN.

## Games

| Category | Game | Description |
|---|---|---|
| Sprog (Language) | **Word Blitz** | Sort Danish words into word classes before the timer runs out |
| Matematik & logik (Math & Logic) | **Math Blitz** | Solve arithmetic problems against the clock — three difficulty tiers |
| Arkade (Arcade) | **Snake** | Classic snake with keyboard + touch controls |
| Arkade (Arcade) | **Tetris** | Classic tetris with hold/next, ghost piece, touch controls |

All games post scores to a per-game leaderboard (best score per player). A parent admin panel manages player profiles (name, avatar, PIN), word categories/words, and shows per-player progress across all games.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Spring Boot 3 + Java 21 |
| Architecture | Hexagonal (Ports & Adapters) |
| Database | PostgreSQL 16 + Flyway |
| Auth | JWT (player PIN login via BCrypt + separate admin login) |
| Reverse Proxy | Traefik v3 + Let's Encrypt |
| Containerisation | Docker + Docker Compose |
| E2E Tests | Playwright (chromium + firefox) |
| CI/CD | GitHub Actions |

## Project Structure

```
website/
├── backend/                    # Spring Boot (Java 21)
│   └── src/main/
│       ├── java/dk/wordblitz/
│       │   ├── domain/         # Core business logic
│       │   │   ├── model/      # Domain records (Player, Category, Word, *Score…)
│       │   │   ├── port/in/    # Use case interfaces
│       │   │   ├── port/out/   # Repository interfaces
│       │   │   ├── exception/  # Domain exceptions (InvalidPin, PinLocked)
│       │   │   └── service/    # Domain services (ScoreCalculator)
│       │   ├── application/    # Use case implementations
│       │   └── infrastructure/ # Spring adapters
│       │       ├── security/   # JWT auth filter + config
│       │       └── adapter/
│       │           ├── in/web/          # REST controllers
│       │           └── out/persistence/ # JPA entities + adapters
│       └── resources/db/migration/     # Flyway V1–V9
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── api/                # Axios client + types
│   │   ├── components/         # NavBar, PinPad, ArcadeGameShell, TimerBar…
│   │   ├── i18n/               # da.json + en.json translations
│   │   ├── lib/                # avatars, mathProblemGenerator
│   │   ├── pages/              # Route-level pages
│   │   └── store/              # Zustand auth store
│   └── e2e/                    # Playwright suite (pages/, specs/, fixtures/)
├── docker-compose.yml          # traefik + frontend + backend + db
└── .github/workflows/          # CI (deploy + e2e tests)
```

## Routes

- `/login` — profile picker + PIN pad
- `/` — home hub (Language / Math & Logic / Arcade sections)
- `/play/word-blitz`, `/play/math-blitz`, `/play/snake`, `/play/tetris`
- `/leaderboard` — tabbed, one tab per game
- `/admin` — parent panel (categories, words, players, progress)

## Key API endpoints

- `GET /api/auth/players` + `POST /api/auth/players/{id}/login` — profile picker + PIN login (PIN attempts are throttled)
- `POST /api/sessions` … — Word Blitz server-driven game sessions
- `POST /api/{math|snake|tetris}/scores` — client-side games submit final scores
- `GET /api/leaderboard/{game-type}` — unified leaderboard (backed by the `leaderboard_entries` SQL view)
- `/api/admin/**` — admin CRUD (categories, words, players) + `GET /api/admin/progress`

## Local development

```bash
docker compose up          # traefik + frontend (vite dev) + backend (spring-boot:run) + postgres
# Frontend: http://localhost:5173 — Backend: http://localhost:8080
```

Dev admin credentials are set in `docker-compose.override.yml` (`admin` / `admindev`). Two starter profiles are seeded with PIN `1234` (Gæst, Demo) — create real profiles in the admin panel and delete the starters.

Running the backend outside Docker? Point the vite proxy at it: `BACKEND_URL=http://localhost:8080 npm run dev`.

## Tests

```bash
cd backend && mvn test            # unit tests (scoring, PIN auth + lockout)
cd frontend && npm run test:e2e   # Playwright suite against the running stack
```

The e2e suite covers login (PIN pad, wrong-PIN errors), hub navigation, all four games (including actually playing Word Blitz and Math Blitz to game over), leaderboards, and the admin panel. See `frontend/E2E_SETUP.md`.

## Deployment

Pushing to `main` triggers the deploy workflow; watchtower pulls updated images on the server. `.env` on the server provides `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` and the Postgres credentials.
