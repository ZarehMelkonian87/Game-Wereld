# Uitvoerbewijs Groep B — modulecontracten, GameHost en lazy loading

Datum: 23 juli 2026  
Status: afgerond

## Resultaat

Groep B vervangt de oude directe koppeling tussen routes, catalogus, profielcontext en de concrete game door een expliciete modulegrens:

```txt
route → GameHost → registry/manifest → lazy GameModule
             └── GameRuntime → browseradapters
```

`Strand Bezem Escape` ontvangt uitsluitend een `GameRuntime`. Profiel- en sessie-identiteit, oefenevents, lifecycle, opslag, audio, spraakherkenning, microfoontoestemming en diagnostiek lopen via runtimepoorten. De game importeert geen appcontext, router, host of concrete browseropslag.

## Uitgevoerde onderdelen

### B01 — grenscontracten

- Gebrande `GameId`, `ThemeId`, `ProfileId`, `SessionId`, `TaskId` en `EventId` met parsers die lege waarden weigeren.
- Benoemde `Result`- en `RuntimeFailure`-typen.
- Injecteerbare klok, idgenerator en diagnostiek.
- Compile-time scheiding tussen idtypen en gerichte constructortests.

### B02 — manifest en catalogus

- Zod valideert ieder manifest bij de grens.
- Titel, beschrijving, leeftijd, thema, capabilities, oriëntatie en releasestatus hebben één bron.
- Registry-key en manifest-id zijn identiek.
- `coming-soon`-items hebben bewust geen loader.
- Oude ids zijn expliciete aliases naar één canonical id.
- Het lichte manifest importeert geen gamecomponenten of assets.

### B03 — GameRuntime

- Stabiele contractvelden: identity, clock, ids, practice, media, speech, diagnostics, lifecycle, profile en storage.
- Browserimplementaties staan buiten de contractmap.
- De fake runtime vangt lifecyclecalls, observaties, logs en opslag af.
- Complete en exit zijn samen idempotent; oefenevents zijn idempotent op `eventId`.
- De grens tussen stabiel contract en interne implementatie is vastgelegd in `src/app/game-platform/contracts/README.md`.

### B04 — GameHost

- Valideert en resolveert route-id en legacy-alias.
- Controleert vereiste capabilities vóór de game mount.
- Beheert een tijdelijke in-memory sessie totdat Groep C de duurzame repository levert.
- Onderscheidt onbekende game, coming soon, loading, chunk-loadfout en runtimecrash.
- Biedt teruggaan, opnieuw proberen en app verversen als herstelacties.
- Route- en game-error boundaries tonen een correlation-id zonder de shell neer te halen.
- Sessiestart en afsluiting zijn beschermd tegen dubbele lifecyclecalls.

### B05 — lazy loading en budget

- Routes gebruiken React Router `lazy`.
- De registry gebruikt een statisch analyseerbare `import("./strand-bezem-escape")`.
- `vite:preloadError` komt in de load-errorinterface terecht.
- `rollup-plugin-visualizer` genereert alleen met `ANALYZE=true` een lokaal, genegeerd rapport.
- CI voert na de build de bundelbudgetcontrole uit.

| Budget                         | Gemeten        | Limiet      | Resultaat |
| ------------------------------ | -------------- | ----------- | --------- |
| App-shell JavaScript           | 101,56 kB gzip | 200 kB gzip | geslaagd  |
| Strand Bezem Escape game-entry | 53,28 kB gzip  | 250 kB gzip | geslaagd  |
| Shell-CSS                      | 27,66 kB gzip  | 40 kB gzip  | geslaagd  |

De baseline rapporteerde circa 300 kB gzip als initiële monoliet. De nieuwe shell blijft onder het budget en de game-implementatie staat in een afzonderlijke dynamische chunk.

### B06 — ontkoppeling van de game

- Alle `ProfileContext`-imports zijn uit de game verwijderd.
- Practice, complete, exit, opslag, achtergrondaudio, spraakuitvoer, spraakherkenning en microfoontoestemming gebruiken runtimepoorten.
- Verouderde directe progress- en speechimplementaties zijn verwijderd.
- De voortgangspagina leest de tijdelijke eventopslag via een aangewezen, runtime-gevalideerde browseradapter in plaats van een deep import naar game-internals.
- Dependency Cruiser blokkeert games naar contexten, routes, schermen, host, infrastructuur en andere games.
- Een tijdelijke negatieve probe met een `ProfileContext`-import faalde correct op `no-game-to-app-context` en is daarna verwijderd.

### B07 — generieke contracttest

De suite controleert:

- manifestschema, unieke ids en registry-idgelijkheid;
- legacy-alias en onbekende id;
- loaderexport en loader rejection;
- mount van iedere loadbare game met alleen een fake runtime;
- afwezigheid van rechtstreekse browseropslag tijdens mount;
- idempotente lifecycle en oefenevents;
- vereiste tegenover optionele capabilities;
- opvang van een rendercrash.

Offlineassetvalidatie blijft als expliciete `todo` zichtbaar tot de assetpipeline uit Groep E bestaat.

## Technologiebeslissingen

- **Zod** beschermt de runtimegrens waar TypeScript alleen compile-time zekerheid biedt.
- **react-error-boundary** levert een kleine, onderhouden foutgrens met resetgedrag; zelfbouw zou hier vooral lifecycle- en edge-casecode dupliceren.
- **rollup-plugin-visualizer** is alleen ontwikkeltooling en maakt chunkgroei inspecteerbaar zonder productieruntimekosten.
- Er is bewust geen state-library, dependency-injectionframework of microfrontendframework toegevoegd. De benodigde isolatie ontstaat met TypeScript-contracten, één host en gewone dynamische imports.

## Controle tegen Code Quality & Architecture Requirements

- Nieuwe en gewijzigde functies gebruiken arrow functions; ESLint blokkeert andere functievormen.
- Externe en persistente manifest-/eventdata begint als `unknown` en wordt met Zod gevalideerd.
- Games gebruiken uitsluitend publieke platformcontracten.
- Fout-, loading- en retrytoestanden zijn zichtbaar en actiegericht.
- Oefenevents en logs bevatten geen kindnaam, ruwe audio of speechtranscript vanuit de runtime.
- Nieuwe dependencies hebben een concrete grens-, foutafhandelings- of debugfunctie.
- Geen nieuwe tijdelijke architectuuruitzondering was nodig.

## Verificatie

| Controle                       | Resultaat                                          |
| ------------------------------ | -------------------------------------------------- |
| `npm run format:check`         | geslaagd                                           |
| `npm run lint`                 | geslaagd, 0 warnings                               |
| `npm run typecheck`            | geslaagd voor app- en Nodeconfiguratie             |
| `npm run test`                 | 7 bestanden, 22 tests geslaagd, 1 bewuste `todo`   |
| `npm run test:architecture`    | 328 modules, 797 dependencies, 0 violations        |
| `npm run check:dead-code`      | 0 ongebruikte files/dependencies in bewaakte scope |
| `npm audit --audit-level=high` | 0 kwetsbaarheden                                   |
| `npm run build`                | geslaagd                                           |
| `npm run build:analyze`        | geslaagd; lokaal `reports/bundle.html` gegenereerd |
| `npm run check:bundle`         | shell-, game- en CSS-budgetten groen               |
| `npm run test:e2e`             | Chromium-tablet en WebKit-tablet geslaagd          |

## Bewuste vervolgstappen

- De tijdelijke in-memory sessierepository wordt in Groep C vervangen door een duurzame repository.
- De tijdelijke browser-eventopslag en voortgangsprojectie worden in Groep C vervangen door versieerbare events en een centrale projector.
- De offlineasset-`todo` wordt in Groep E een blokkerende contracttest.

## Commitbericht

Voor de volledige groep:

```text
feat(architecture): introduce game runtime contracts and lazy GameHost
```
