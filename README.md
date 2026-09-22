# Game Wereld

Game Wereld is een offline-first React/Vite-PWA met lokale kinderprofielen en zelfstandige educatieve games. De app gebruikt een modulaire monoliet: één app-shell, lazy gamemodules, een klein `GameRuntime`-contract en repositoryadapters boven IndexedDB.

## Beschikbare games

- **Magisch Strand-Avontuur** — woordenschat, ruimtelijke relaties en meerdere spelmodi.
- **Groot Circus-Avontuur**, **Rekenen**, **Taal & Lezen** en **Wereldoriëntatie** staan in de catalogus als "Binnenkort beschikbaar".

Games registreren privacyveilige `PracticeEventV1`-observaties. Voortgang wordt centraal en herbouwbaar geprojecteerd; een game slaat geen kindnaam, transcript of pedagogisch eindlabel op.

## Ontwikkelen

Vereisten:

- Node.js 22.21.x;
- npm 10.9.x.

```sh
npm ci
npm run dev
```

De developmentserver toont lokaal een diagnosepaneel. Dit paneel wordt niet in de productie-output gemount.

## Productie en kwaliteit

```sh
npm run check
npm run build
npm run check:bundle
npm run check:dead-code
npm run test:e2e -- --workers=1
```

`npm run check` omvat formatting, lint, TypeScript, unit-/componenttests, asset-/securitytests en Dependency Cruiser.

## Hoofdstructuur

```text
src/
  main.tsx                    bootstrap
  app/
    game-host/                lazy loading, lifecycle en error boundary
    game-platform/            publieke contracten, UI en browser-/testadapters
    games/                    zelfstandige gamemodules en lichte registry
    storage/                  repositories, Dexie, schemas en migraties
    pwa/                      service worker en offlinepakketten
    diagnostics/              lokale privacyveilige diagnostiek
    screens/                  app-features
```

Een nieuwe game levert `manifest.ts`, `index.tsx`, pure domeinregels, tests en eventueel een offlinepakketbron. Alleen `src/app/games/registry.ts` krijgt een nieuwe lazy entry. Zie [Games](src/app/games/README.md).

## Data en privacy

- Duurzame data staat lokaal in IndexedDB.
- Alleen actieve-profiel-id en globale mute zijn kleine `localStorage`-bootvoorkeuren.
- Profielverwijdering wist instellingen, sessies, events en projecties transactioneel.
- Externe foutmonitoring en session replay zijn niet actief.
- Offlinepakketten worden vóór status `ready` volledig gehasht en gecontroleerd.

## Architectuurdocumentatie

- [Actuele apparchitectuur](src/app/ARCHITECTURE.md)
- [Gamecontract en toevoegproces](src/app/games/ARCHITECTURE.md)
- [Gamedossier Magisch Strand-Avontuur](docs/magisch-strand-avontuur/GDD-index.md)
- [Introductie voor logopedisten, ouders en leerkrachten](docs/magisch-strand-avontuur/Voor-begeleiders.md)
- [Gamedossier Groot Circus-Avontuur (in aanbouw)](docs/groot-circus-avontuur/GDD-index.md)
