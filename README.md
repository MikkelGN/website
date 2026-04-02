# Word Blitz

A retro arcade-style educational game website for kids learning Danish word categories (nouns, verbs, adjectives, etc.).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Spring Boot 3 + Java 21 |
| Architecture | Hexagonal (Ports & Adapters) |
| Database | PostgreSQL 16 |
| Reverse Proxy | Traefik v3 + Let's Encrypt |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |

## Project Structure

```
wordblitz/
├── backend/                    # Spring Boot (Java 21)
│   └── src/main/java/dk/wordblitz/
│       ├── domain/             # Core business logic
│       │   ├── model/          # Domain records (Category, Word, AppUser…)
│       │   ├── port/in/        # Use case interfaces
│       │   ├── port/out/       # Repository interfaces
│       │   └── service/        # Domain services (ScoreCalculator)
│       ├── application/        # Use case implementations
│       │   └── service/
│       └── infrastructure/     # Spring adapters
│           ├── security/       # JWT auth filter + config
│           └── adapter/
│               ├── in/web/     # REST controllers
│               └── out/persistence/ # JPA entities + adapters
├── frontend/                   # React + Vite
│   └── src/
│       ├── api/                # Axios client + types
│       ├── components/         # Reusable UI components
│       ├── i18n/               # da.json + en.json translations
│       ├── pages/              # Route-level pages
│       ├── store/              # Zustand auth store
│       └── styles/             # Global CSS (retro arcade theme)
├── traefik/                    # Traefik config + TLS
├── .github/workflows/          # CI + Deploy workflows
├── docker-compose.yml          # Production
└── docker-compose.override.yml # Local dev
```

## Local Development

### Prerequisites
- Docker + Docker Compose
- Java 21 (for running backend outside Docker)
- Node 20 (for running frontend outside Docker)

### Quick start (Docker)

```bash
# Copy and fill in environment variables
cp .env.example .env

# Start everything
docker compose up -d

# Frontend: http://localhost:5173
# Backend:  http://localhost:8080
# DB:       localhost:5432
```

### Backend (native)

```bash
cd backend
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/wordblitz
export SPRING_DATASOURCE_USERNAME=wordblitz
export SPRING_DATASOURCE_PASSWORD=devpassword
export JWT_SECRET=dev-secret-key-for-local-use-only-32chars
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=admindev
mvn spring-boot:run
```

### Frontend (native)

```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

### First-time server setup

```bash
# On your server
mkdir -p /opt/wordblitz
cd /opt/wordblitz
cp .env.example .env   # Fill in all values
touch traefik/acme.json
chmod 600 traefik/acme.json
```

### GitHub Secrets required

| Secret | Description |
|---|---|
| `SERVER_HOST` | Your server's static IP |
| `SERVER_USER` | SSH username |
| `SERVER_SSH_KEY` | Private SSH key (no passphrase) |
| `SERVER_PORT` | SSH port (default 22) |
| `DEPLOY_PATH` | Path on server (default `/opt/wordblitz`) |

### Environment variables (`.env`)

| Variable | Description |
|---|---|
| `DOMAIN` | Your domain, e.g. `games.example.com` |
| `ACME_EMAIL` | Email for Let's Encrypt |
| `DB_PASSWORD` | Strong random password |
| `JWT_SECRET` | 32+ char random string (`openssl rand -base64 32`) |
| `ADMIN_USERNAME` | Admin panel username |
| `ADMIN_PASSWORD` | Admin panel password |
| `GITHUB_REPOSITORY` | e.g. `yourusername/wordblitz` |
| `IMAGE_TAG` | Usually `latest` |

### Deploy

Push to `main` — GitHub Actions will build, push images to GHCR, then SSH into your server and run `docker compose up -d`.

## Game Mechanics

- Player enters a username (no password) — honor-based
- Select 2+ word categories to train
- A word appears on screen — click the correct category
- Timer starts at 10 seconds; each correct answer reduces it by 10% (floor: 2s)
- Wrong answer or timeout = game over
- Score = base points × streak multiplier × time bonus

## Admin Panel

Navigate to `/admin` → login with env-configured credentials.

- **Categories**: Add/edit/delete word categories with custom neon colors
- **Words**: Add/edit/delete words per category
- **Players**: View all registered players
