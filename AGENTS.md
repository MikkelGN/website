# AGENTS.md — Migini Games

AI agent guide for this codebase. Read this before making changes.

## Project Overview

Retro arcade-style game website for kids. Built with React + Spring Boot. Runs in production on a self-hosted Linux server behind Cloudflare Tunnel + Traefik reverse proxy.

**Live games:** Word Blitz, Snake, Tetris, Wordle Helper, LinkedIn Speech

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + CSS Modules |
| Backend | Spring Boot 3.3.6 + Java 21 |
| Architecture | Hexagonal (Ports & Adapters) |
| Database | PostgreSQL 16 + Flyway migrations |
| AI | Spring AI 1.0.0 + Ollama (local LLM) |
| Auth | JWT (honor-based username login, no passwords) |
| i18n | react-i18next — Danish (`da.json`) and English (`en.json`) |
| Reverse Proxy | Traefik v3 + Let's Encrypt |
| Containers | Docker Compose |
| CI/CD | GitHub Actions → GHCR → Watchtower auto-deploy |

## Repository Layout

```
website/
├── backend/
│   └── src/main/java/dk/wordblitz/
│       ├── domain/
│       │   ├── model/          # Pure Java records (no framework deps)
│       │   ├── port/in/        # UseCase interfaces (input ports)
│       │   ├── port/out/       # Repository interfaces (output ports)
│       │   └── service/        # Domain services (ScoreCalculator)
│       ├── application/
│       │   └── service/        # UseCase implementations
│       └── infrastructure/
│           ├── security/       # JWT filter + SecurityConfig
│           └── adapter/
│               ├── in/web/     # REST controllers
│               └── out/persistence/  # JPA entities + adapters
│   └── src/main/resources/
│       ├── application.yml
│       ├── db/migration/       # Flyway SQL migrations (V1–V5)
│       └── words/              # Static word lists (danish5.txt)
├── frontend/
│   └── src/
│       ├── api/client.ts       # Axios client, all typed API calls
│       ├── components/         # NavBar, shared UI
│       ├── i18n/               # da.json + en.json
│       ├── pages/              # One file per route (e.g. TetrisPage.tsx)
│       ├── store/authStore.ts  # Zustand — token + username
│       └── styles/global.css   # CSS custom properties (design tokens)
├── docker-compose.yml
├── docker-compose.override.yml # Local dev overrides
└── traefik/
```

## Architecture Rules

### Backend — Hexagonal

- **Domain layer** knows nothing about Spring, JPA, or HTTP. Use Java records.
- **Application layer** implements use case interfaces from `domain/port/in/`.
- **Infrastructure layer** wires everything: controllers call use cases; persistence adapters implement output ports.
- Controllers inject **port interfaces**, never concrete service classes.
- JPA entities live only in `infrastructure/adapter/out/persistence/entity/` — map them to domain records before returning.

### Frontend

- Every route gets its own `Page.tsx` + `Page.module.css` in `pages/`.
- CSS uses **module files** for component-scoped styles + **global CSS variables** (`var(--color-primary)` etc.) for theming. Never hardcode colors that aren't game-specific.
- State lives in Zustand (`authStore`). No Redux, no Context for auth.
- All API calls go through `src/api/client.ts` — typed with interfaces.

## Key Patterns

### Adding a Score-Based Game

Backend:
1. Add Flyway migration `V{n}__gamename_scores.sql` with a `gamename_scores` table.
2. Create domain model record in `domain/model/`.
3. Create output port interface in `domain/port/out/`.
4. Create input port (UseCase) interface in `domain/port/in/`.
5. Implement the use case in `application/service/`.
6. Create JPA entity in `infrastructure/adapter/out/persistence/entity/`.
7. Create JPA repository interface in `infrastructure/adapter/out/persistence/repository/`.
8. Create persistence adapter in `infrastructure/adapter/out/persistence/`.
9. Create REST controller in `infrastructure/adapter/in/web/`.

Frontend:
1. Add typed interfaces and API functions to `src/api/client.ts`.
2. Create `GameNamePage.tsx` + `GameNamePage.module.css` in `pages/`.
3. Register route in `App.tsx` inside `<RequireAuth>`.
4. Add game card to `HomePage.tsx` with matching CSS in `HomePage.module.css`.
5. Add leaderboard tab to `LeaderboardPage.tsx` (type union + fetch + render).
6. Add translation keys to both `da.json` and `en.json`.

### Migrations

- File: `backend/src/main/resources/db/migration/V{n}__{snake_case_description}.sql`
- Never modify existing migrations — always add a new version.
- Current state: V1 (schema), V2 (seed), V3 (fix), V4 (snake), V5 (tetris).

### Translations

Every user-visible string needs a key in **both** `da.json` and `en.json`. Group keys by feature prefix (`tetris.`, `snake.`, `game.`, etc.). Use `t('key')` or `t('key', { variable: value })` in components.

### Touch / Mobile

Games that capture keyboard input must also handle touch events on the canvas element with `{ passive: false }` and call `e.preventDefault()` to stop the page scrolling during swipes.

### Ollama / AI

The LinkedIn Speech feature uses Spring AI + a local Ollama instance. The backend reaches Ollama via `http://host.docker.internal:11434` (mapped by `extra_hosts: host-gateway` in `docker-compose.yml`). The model is configured in `application.yml` under `spring.ai.ollama.chat.options.model`.

## Security Notes

- JWT secret is injected via `JWT_SECRET` env var — never hardcoded.
- Admin credentials via `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars.
- All `/api/admin/**` endpoints require admin JWT role.
- The word list, leaderboard, and game endpoints require player JWT.
- `/api/auth/**` and `/api/wordle/**` are public (no auth required).

## Environment Variables

| Variable | Description |
|---|---|
| `JWT_SECRET` | 32+ char random string |
| `ADMIN_USERNAME` | Admin panel username |
| `ADMIN_PASSWORD` | Admin panel password |
| `DB_PASSWORD` | PostgreSQL password |
| `OLLAMA_BASE_URL` | Defaults to `http://host.docker.internal:11434` |
| `SPRING_DATASOURCE_URL` | Defaults to local PostgreSQL |

## Development

```bash
# Start everything locally
docker compose up -d

# Backend only (native)
cd backend
export JWT_SECRET=dev-secret-32-chars-minimum-here
export ADMIN_USERNAME=admin ADMIN_PASSWORD=admin
mvn spring-boot:run

# Frontend only (native)
cd frontend && npm install && npm run dev
```

## Deployment

Push to `main` → GitHub Actions builds Docker images → pushes to GHCR → Watchtower on the server detects new image and redeploys automatically. No manual SSH required.
