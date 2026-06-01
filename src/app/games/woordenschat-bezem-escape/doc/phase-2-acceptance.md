# Fase 2 Acceptatie

Datum: 2026-05-30

Deze acceptatie is een technische UI-acceptatie voor het mobile-first fundament van `+1 Woordenschat Bezem Escape`.

## Geteste Schermen

- Scene builder: `/games/language/woordenschat-bezem-escape`
- Woord kiezen: `/games/language/woordenschat-bezem-escape?screen=word-choice`
- Race: `/games/language/woordenschat-bezem-escape?screen=race`
- Beloning: `/games/language/woordenschat-bezem-escape?screen=reward`

## Geteste Viewports

- Portrait telefoon: `390x844`
- Landscape telefoon: `844x390`

## Technische Checks

- TypeScript check: geslaagd.
- Productie-build: geslaagd.
- Geen console-errors tijdens browsercontrole.
- Geen kapotte afbeeldingen.
- Geen horizontale pagina-overflow.
- Geen verticale pagina-scroll op fullscreen game-schermen.
- Alle zichtbare knoppen blijven minimaal 44px hoog.
- Belangrijke UI blijft binnen beeld in portrait en landscape.

## Visuele Acceptatiepunten

- Achtergrondpositie is technisch gevalideerd.
- Top HUD is technisch gevalideerd.
- Opdrachtbubble is technisch gevalideerd.
- Speed/statusbalk is technisch gevalideerd.
- Objecttray positie is technisch gevalideerd.
- Eerste stickerformaten zijn technisch gevalideerd.
- Woord kiezen static layout is technisch gevalideerd.
- Race static layout is technisch gevalideerd.
- Beloning static layout is technisch gevalideerd.

## Screenshotbeleid

De oude QA-screenshots zijn na acceptatie verwijderd om de repository klein te houden. Nieuwe screenshots maken we alleen wanneer ze nodig zijn voor een actieve visuele review.

## Opmerking

Deze fase rondt het technische mobile UI-fundament af. Definitieve smaak- of ontwerpkeuzes kunnen later nog worden bijgesteld, maar de basis is klaar om in Fase 3 met echte interactie verder te gaan.
