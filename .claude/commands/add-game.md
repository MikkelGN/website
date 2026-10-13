# Add New Game

Use when the user asks to add a new game to Migini.

Before writing code, confirm with the user:
1. Game name in Danish and English.
2. What Kapi and Bao do in the game (who plays, who helps).
3. The core interaction (tap, drag, sort, match...) and the target age.

Then follow "Adding a game" in `AGENTS.md`. Checklist:

- [ ] `frontend/src/games/<name>/` with the game component and CSS module
- [ ] Route in `App.tsx`, card in `HomePage.tsx`
- [ ] Kapi and Bao appear via `Character`, instructions via `SpeechBubble`
- [ ] No fail state, no external links, works offline
- [ ] Progress in `progressStore` if the game rewards stars
- [ ] Strings in both `da.json` and `en.json`
- [ ] Playwright spec in `frontend/e2e/` playing the game through
- [ ] `npm run type-check && npm run test:e2e` pass
