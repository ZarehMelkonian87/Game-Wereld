# Uitvoerrapport Groep G — Debugging, diagnostiek en observability

Datum: 23 juli 2026  
Status: afgerond

## Resultaat

Game Wereld heeft nu één privacyveilig diagnosepad. Events worden met Zod strict gevalideerd, centraal verrijkt met release, tijd en correlation-id en maximaal 100 items lokaal bewaard. Een development-only, toetsenbordtoegankelijk paneel toont app-, route-, game/content-, capability-, database-, quota-, service-worker-, cache- en offlinepakketstatus zonder kinddata.

Storage-, gamehost-, speech- en service-workerfouten gebruiken dit pad. De GameHost-boundary toont dezelfde correlation-id die in de ringbuffer staat. Herstel is expliciet als retry, typed fallback, tijdelijke opslag, update of doorgaan zonder development-cleanup.

## Privacy en modulegrenzen

- De context is een allowlist; onbekende velden worden geweigerd.
- Profielgegevens, transcript, ruwe antwoorden en audio passen niet in het contract.
- Games kennen alleen `GameRuntime.diagnostics`; zij importeren geen appdiagnostiek of externe SDK.
- De centrale browserlogger en het paneel blijven appinfrastructuur.
- Het paneel wordt alleen onder `import.meta.env.DEV` gemount en zit niet in de normale productieflow.
- Er is geen externe observability-SDK geïnstalleerd.

## Failure-scenario's

Eén declaratief `RuntimeFailureScenario` stuurt vaste tijd, seeded random, UUID's, speechresultaat/time-out/denial, media completion/error, quota/corruptie, offline en service-worker-update. De scenario-suite draait dezelfde fixture herhaald en vergelijkt de volledige uitkomst. Daarmee zijn de kernfouten zonder netwerk, microfoon of echte quota-uitputting reproduceerbaar.

## Externe monitoring

ADR-004 legt het geaccepteerde besluit `uitstellen` vast. De lokale diagnose moet eerst aantonen welke fouten niet oplosbaar zijn. De ADR bevat privacy-, verwerker-, retentie-, kosten-, sampling-, source-map-, scrubbing- en verwijdervoorwaarden voor een eventuele latere invoering. Session replay, DOM/inputcapture, transcript en ruwe content blijven verboden.

## Toetsing aan Code Quality & Architecture Requirements

- Alle nieuwe en gewijzigde functies zijn arrow functions.
- Externe/persistente diagnose-input wordt strict aan de grens gevalideerd.
- Foutpaden hebben correlation-id en benoemd herstelgedrag.
- De ringbuffer is begrensd en uitsluitend lokaal/in-memory.
- Het panel gebruikt native buttons, dialogsemantiek, zichtbare labels, Escape en focus.
- Testfakes zijn injecteerbaar en productiecode importeert geen tests.
- Geen game importeert routes, appcontext, database of observabilityleverancier.

## Verificatie

- `npm run check`: groen; 18 testbestanden en 79 tests plus 4 assettests.
- Architectuur: 367 modules en 919 dependencies zonder overtredingen.
- `npm run build`: groen; de development-diagnoseteksten komen niet voor in de productie-output.
- `npm run test:e2e -- --workers=1`: 9 tests groen; 1 bewuste WebKit-skip voor de Chromium-specifieke PWA-proef.
- `npm run check:dead-code`: groen; alleen bestaande Knip-configuratiehints.
- `npm audit --audit-level=high`: 0 kwetsbaarheden.
- Bundlebudget: shell-JavaScript 118,26/200 kB gzip, gamechunk 85,50/250 kB gzip, CSS 28,00/40 kB gzip en offlinepakket 176167,65/204800 kB.
- Handmatige developmentproef: paneel geopend vanaf welkom, release/build, route, anonieme diagnosesessie, database v2, quota, capabilities, service-workerstatus, caches en offlinepakketstatus zichtbaar; focus startte op Sluiten, Escape sloot het dialog en de Startactie bleef daarna bruikbaar.

## Commitbericht voor de gebruiker

`feat(diagnostics): add privacy-safe observability and failure scenarios`
