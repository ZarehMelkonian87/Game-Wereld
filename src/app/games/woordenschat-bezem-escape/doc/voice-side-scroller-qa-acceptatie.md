# Zeg & Vlieg: QA En Acceptatie

Datum: 2026-06-06

## Scope

Deze QA controleert de huidige MVP van `Zeg & Vlieg` binnen `+1 Woordenschat Bezem Escape`.

De game blijft een oefenspel. De QA controleert geen medische, diagnostische of officiele testscore-functionaliteit.

## Automatisch Gecontroleerd

### Browser Rendercheck

Route:

```text
/games/language/woordenschat-bezem-escape?screen=zeg-en-vlieg
```

Portrait viewport:

```text
390 x 844
```

Resultaat:

- `VoiceSideScrollerScreen` zichtbaar.
- `VoiceSideScrollerStage` zichtbaar.
- `VoiceSideScrollerVoiceMeter` zichtbaar.
- Fallback controls zichtbaar.
- Start-overlay zichtbaar.
- Geen horizontale overflow.
- Geen verticale overflow.
- Geen console-errors.

Landscape viewport:

```text
844 x 390
```

Resultaat:

- `VoiceSideScrollerScreen` zichtbaar.
- `VoiceSideScrollerStage` zichtbaar.
- `VoiceSideScrollerVoiceMeter` zichtbaar.
- Fallback controls zichtbaar.
- Start-overlay zichtbaar.
- Geen horizontale overflow.
- Geen verticale overflow.
- Geen console-errors.

### Oude Bezem Race

Route:

```text
/games/language/woordenschat-bezem-escape?screen=broom-escape-run
```

Resultaat:

- Oude `RaceScreen` wordt niet gerenderd.
- Oude voice/race-laag wordt niet zichtbaar.
- De onbekende screen-parameter valt terug naar het startscherm.
- Geen console-errors.

### Codecontrole

Resultaat van actieve code-zoekactie:

- Geen actieve `RaceScreen`.
- Geen actieve `broom-escape-run` mode in gameflow.
- Alleen historische verwijzingen in documentatie/concept-art.

## Technische Acceptatie

Deze checks moeten groen zijn voor acceptatie:

```bash
npx tsc --noEmit
npm run build
git diff --check
```

## Handmatig Nog Te Testen

Deze punten moeten op echte toestellen worden getest:

- iPhone Safari via HTTPS.
- Android Chrome via HTTPS.
- Telefoonmicrofoon aan/uit.
- Headsetmicrofoon.
- Microfoon-permission prompt accepteren/weigeren.
- Stemhoogte-besturing in een echte kamer met achtergrondgeluid.
- Woordherkenning met kinderstem.

## Acceptatiecriteria

`Zeg & Vlieg` is technisch accepteerbaar wanneer:

- De game opent in portrait en landscape zonder layout-overlap.
- De stage, speler, targetwoorden, stemmeter en fallback-bediening zichtbaar blijven.
- De oude Bezem Race niet meer bereikbaar is als actieve game.
- Typecheck en build groen zijn.
- Het dashboard blijft alleen oefenobservaties tonen.

Volledige mobiele acceptatie is pas afgerond na de handmatige iPhone-, Android- en microfoontests.
