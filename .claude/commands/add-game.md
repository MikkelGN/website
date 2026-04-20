# Add New Game

Use this skill when the user asks to add a new game to the Migini Games website.

Before writing any code, ask the user:
1. What is the game name (English + Danish)?
2. Does it have a **score** to persist (leaderboard), or is it a tool (like Wordle Helper)?
3. Does it use **AI/Ollama** (like LinkedIn Speech)?
4. What color should the game card use on the home page?

Then implement the full game end-to-end using the checklist below.

---

## Checklist

Work through every item in order. Check each off as you complete it.

### Backend (skip sections 1–5 if no leaderboard)

- [ ] **1. Flyway migration** — `backend/src/main/resources/db/migration/V{n}__{gamename}_scores.sql`
  - Table: `{gamename}_scores` with at minimum: `id BIGSERIAL PRIMARY KEY`, `user_id BIGINT REFERENCES app_users(id)`, `score INT NOT NULL`, `played_at TIMESTAMPTZ DEFAULT now()`
  - Add game-specific columns (e.g. `level INT`, `lines INT` for Tetris)

- [ ] **2. Domain model** — `domain/model/{GameName}Score.java` and `{GameName}LeaderboardEntry.java`
  - Pure Java records, zero framework imports

- [ ] **3. Output port** — `domain/port/out/{GameName}ScoreRepository.java`
  - Interface methods: `save(score)`, `findTopN(limit)`

- [ ] **4. Input port** — `domain/port/in/{GameName}UseCase.java`
  - Interface methods: `submitScore(...)`, `getLeaderboard(limit)`

- [ ] **5. Application service** — `application/service/{GameName}Service.java`
  - Implements `{GameName}UseCase`, injects `{GameName}ScoreRepository`

- [ ] **6. JPA entity** — `infrastructure/adapter/out/persistence/entity/{GameName}ScoreEntity.java`
  - `@Entity @Table(name = "{gamename}_scores")`, map all columns

- [ ] **7. JPA repository** — `infrastructure/adapter/out/persistence/repository/{GameName}ScoreJpaRepository.java`
  - Extends `JpaRepository`, add `findTop{N}ByOrderByScoreDesc`

- [ ] **8. Persistence adapter** — `infrastructure/adapter/out/persistence/{GameName}ScorePersistenceAdapter.java`
  - Implements `{GameName}ScoreRepository`, maps entity ↔ domain model
  - Annotated `@Component`

- [ ] **9. REST controller** — `infrastructure/adapter/in/web/{GameName}Controller.java`
  - `POST /api/{gamename}/scores` — submit score (requires auth)
  - `GET /api/{gamename}/leaderboard?limit=20` — public or auth
  - Use `@RestController @RequestMapping("/api/{gamename}")`

- [ ] **10. Security** — verify the new endpoints fit the existing `SecurityConfig` permit/auth rules. Add if needed.

---

### Frontend

- [ ] **11. API client** — `frontend/src/api/client.ts`
  - Add `{GameName}LeaderboardEntry` interface
  - Add `submit{GameName}Score(...)` function
  - Add `get{GameName}Leaderboard(limit = 20)` function

- [ ] **12. Page files** — `frontend/src/pages/{GameName}Page.tsx` + `{GameName}Page.module.css`
  - Include `<NavBar />` and a back-to-menu button
  - Handle touch events on canvas with `{ passive: false }` + `e.preventDefault()` if the game captures swipes
  - Submit score to backend on game over
  - Show new-high-score feedback if score beats previous best

- [ ] **13. Route** — `frontend/src/App.tsx`
  - Import the new page
  - Add `<Route path="/{gamename}" element={<RequireAuth><{GameName}Page /></RequireAuth>} />`

- [ ] **14. Home page card** — `frontend/src/pages/HomePage.tsx`
  - Add a `<button>` card with icon, title, description, and play button
  - `onClick={() => navigate('/{gamename}')}`

- [ ] **15. Home page CSS** — `frontend/src/pages/HomePage.module.css`
  - Add `.{gamename}Card` with `border` and `box-shadow` in the game's color
  - Add `.{gamename}Card:hover` with stronger glow
  - Add `.{gamename}PlayBtn` with matching border/color

- [ ] **16. Leaderboard tab** (skip if no leaderboard) — `frontend/src/pages/LeaderboardPage.tsx`
  - Add game name to `Tab` type union
  - Add `useState` for the entries array
  - Add fetch branch in `useEffect`
  - Add tab button with active style
  - Add table/list render section

- [ ] **17. Leaderboard CSS** (if new tab active color needed) — `frontend/src/pages/LeaderboardPage.module.css`
  - Add `.tabActive{GameName}` class

- [ ] **18. Translations** — add keys to **both** `frontend/src/i18n/en.json` and `da.json`

  Minimum keys (add game-specific ones as needed):
  ```json
  "{gamename}": {
    "title": "...",
    "hint": "...",
    "start": "START",
    "paused": "PAUSED / PAUSE",
    "resume": "RESUME / FORTSÆT",
    "gameover": "GAME OVER / SPIL SLUT",
    "score": "Score",
    "best": "Best / Bedst",
    "newHigh": "NEW HIGH SCORE / NY REKORD",
    "playAgain": "PLAY AGAIN / SPIL IGEN",
    "menu": "MENU"
  }
  ```
  Also add to `home.*`:
  ```json
  "{gamename}Title": "...",
  "{gamename}Desc": "..."
  ```
  And to `leaderboard.*` if applicable:
  ```json
  "tab{GameName}": "..."
  ```

---

### Wrap-up

- [ ] **19. Test** — start the dev server, open the game, play through it, verify score submits and appears on the leaderboard.

- [ ] **20. Commit and push** to `claude/kids-games-website-LZ45x` (the designated development branch).

---

## Reference: existing game implementations

| Game | Score columns | Card color | i18n prefix |
|---|---|---|---|
| Word Blitz | `total_score`, `correct_answers`, `max_streak` | `--color-primary` (magenta) | `game.` |
| Snake | `score` | `--color-success` (green) | `snake.` |
| Tetris | `score`, `level`, `lines` | `--color-secondary` (cyan) | `tetris.` |
| Wordle Helper | — (no score) | `--color-accent` (yellow) | `wordle.` |
| LinkedIn Speech | — (uses Ollama) | `#0077b5` (LinkedIn blue) | `linkedin.` |
