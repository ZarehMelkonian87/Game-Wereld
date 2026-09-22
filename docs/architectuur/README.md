# 🏛️ Architectuur — Game Wereld

> Beschrijft de architectuur zoals die nu draait, plus de besluiten die eraan ten grondslag liggen (ADR's). Historische migratierapporten zijn verwijderd; wat nog geldt, staat hier.

| Veld                  | Waarde                            |
| :-------------------- | :-------------------------------- |
| **Laatst bijgewerkt** | 2026-09-22                        |
| **Status**            | 🟢 Beschrijft de actuele situatie |

## Besluiten

| ADR                                                      | Onderwerp                                    | Status       |
| :------------------------------------------------------- | :------------------------------------------- | :----------- |
| [ADR-001](adr-001-opslag-indexeddb-dexie.md)             | Opslag: IndexedDB via Dexie, migratiebeleid  | Geaccepteerd |
| [ADR-002](adr-002-oefenobservaties-en-projectie.md)      | Oefenobservaties, projectie en retentie      | Geaccepteerd |
| [ADR-003](adr-003-offline-pakketten-en-download-gate.md) | Offline-pakketten, download-gate, basispaden | Geaccepteerd |
| [ADR-004](adr-004-geen-externe-foutmonitoring.md)        | Geen externe foutmonitoring                  | Geaccepteerd |
| [ADR-005](adr-005-gamemodulecontract.md)                 | Gamemodulecontract en isolatie tussen games  | Geaccepteerd |
| [ADR-006](adr-006-spraakherkenning.md)                   | Spraakherkenning via de Web Speech API       | Geaccepteerd |

## De app in het kort

Game Wereld is één offline-first React/Vite-PWA: een app-shell met lokale kinderprofielen, en games die als aparte modules lazy worden geladen.

```
src/app/
├── screens/        Platform-schermen (welkom, profiel, zones, spellenlijst, instellingen, voortgang, diagnose)
├── game-host/      Laadt en draait een game; sessiebeheer en foutafhandeling
├── game-platform/  Het contract tussen app en game: GameRuntime, UI-primitives, speech, text
├── platform/       Platformdetectie, download-gate, portret-guard
├── games/          Eén map per game + de registry met manifests
├── storage/        Repositories boven IndexedDB (Dexie) en bootvoorkeuren
├── pwa/            Service worker, offline-pakketten, assetsynchronisatie
└── diagnostics/    Diagnose-logging en -export (lokaal)
```

**Vier regels die de structuur bewaken** (afgedwongen met dependency-cruiser, zie `dependency-cruiser.config.cjs`):

1. Een game importeert nooit uit een andere game.
2. Een game importeert nooit uit de app-schil (`contexts`, `routes`, `screens`, `game-host`).
3. Een game importeert nooit rechtstreeks uit `storage` — alles loopt via het runtime-contract.
4. Pure logica (`logic/`, `domain/`) importeert geen React.

Daarnaast: de storage-adapters (Dexie, migraties) zijn alleen binnen `src/app/storage/` zichtbaar, de app-schil kent geen interne bestanden van een game (alleen de registry), en er zijn geen circulaire afhankelijkheden.

## Het runtime-contract

Een game krijgt bij het starten één object mee en gebruikt niets daarbuiten:

| Onderdeel     | Waarvoor                                               |
| :------------ | :----------------------------------------------------- |
| `identity`    | Profiel- en game-id (gepseudonimiseerd, geen naam)     |
| `storage`     | Kleine sleutel-waarde-opslag per profiel               |
| `practice`    | Oefenobservaties wegschrijven (append-only)            |
| `speech`      | Spraakherkenning, microfoontoestemming, spraaksynthese |
| `media`       | Geluid afspelen, alle media pauzeren                   |
| `clock`       | Tijd (testbaar)                                        |
| `diagnostics` | Gebeurtenissen loggen met correlatie-id                |

Daardoor kan een game volledig met een nep-runtime worden getest, en kan het platform de opslag of spraaklaag vervangen zonder gamecode te raken.

## Kwaliteitspoorten

`npm run check` draait: prettier, eslint (`--max-warnings 0`), TypeScript (app én node-config), Vitest, de scripttests, dependency-cruiser en de documentlinkcheck. In CI (`quality.yml`) komen daar bij: knip (dode code), coverage, productiebuild met bundlebudget, en Playwright (chromium-tablet per push, webkit-tablet wekelijks en op aanvraag).

**Budgetten** (`config/performance-budgets.json`): app-shell JS ≤ 200 kB gzip, app-shell CSS ≤ 40 kB gzip, gamechunk ≤ 250 kB gzip, offline-pakket ≤ 200 MB (boven 50 MB vraagt de gate om bevestiging), langste hoofddraadtaak ≤ 100 ms.

## Documentatie per game

Het gamedossier van [Magisch Strand-Avontuur](../magisch-strand-avontuur/GDD-index.md) beschrijft die game inhoudelijk: ontwerp, modi, features, reizen en tests.
