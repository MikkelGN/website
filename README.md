# Migini

Spil for børn uden reklamer, uden login og uden sporing. Universet har to faste figurer, der går igen i alle spil:

- **Kapi**: en capybara med en appelsin på hovedet
- **Bao**: en panda med et bambusblad bag øret

## Spil

| Spil | Beskrivelse |
|---|---|
| **Køkkenet** | Vælg en ret, find ingredienserne på hylden (tryk eller træk), rør rundt, steg/bag/kog og server for Kapi eller Bao. Hver ret giver en stjerne. |

## Platforme

Appen er en **Progressive Web App (PWA)**: én kodebase, der kører i browseren og kan installeres som app.

- **Web**: åbn siden.
- **Android**: Chrome → menu → *Installer app* / *Føj til startskærm*.
- **iOS/iPadOS**: Safari → Del → *Føj til hjemmeskærm*.

Installeret kører den i fuld skærm og virker offline. Al tekst læses op med enhedens indbyggede stemme (Web Speech API), så børn, der ikke kan læse endnu, kan spille. Fremskridt (stjerner) gemmes kun lokalt på enheden.

Hvis appen senere skal i App Store / Google Play, kan den samme build pakkes med [Capacitor](https://capacitorjs.com/) (`npx cap add android`/`ios`). Det kræver udviklerkonti hos Apple og Google og en Mac til iOS-builds.

## Teknik

| Lag | Teknologi |
|---|---|
| Frontend | React 18 + TypeScript + Vite + CSS Modules |
| App | vite-plugin-pwa (manifest + service worker, offline) |
| State | Zustand med `persist` (localStorage) |
| i18n | react-i18next, dansk og engelsk |
| Lyd | Web Audio (syntetiseret, ingen lydfiler) + Web Speech API |
| Tests | Playwright (telefon, tablet i landscape, desktop) |
| Drift | nginx-container bag Traefik, GitHub Actions → GHCR → Watchtower |

Der er ingen backend. Alt kører i browseren.

## Udvikling

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
npm run type-check
npm run test:e2e     # bygger, starter preview og kører Playwright
npm run icons        # genererer PNG-ikoner fra public/favicon.svg
```

## Deployment

Push til `main` → CI bygger frontend-imaget → GHCR → Watchtower på serveren henter det inden for 5 minutter.
