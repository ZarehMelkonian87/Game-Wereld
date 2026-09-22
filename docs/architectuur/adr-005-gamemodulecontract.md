# ADR-005 — Gamemodulecontract en isolatie tussen games

**Status:** geaccepteerd · **Herzien:** 2026-09-22

## Context

De app moet meerdere games kunnen herbergen zonder dat ze elkaar of de app-schil beïnvloeden, en zonder dat de bundel van de schil meegroeit met elke game.

## Besluit

**Een game is een module met een manifest en een lazy loader.** De registry (`src/app/games/registry.ts`) koppelt een game-id aan een manifest en — als de game speelbaar is — aan een dynamische import. Een game zonder loader is een catalogus-placeholder die als "Binnenkort beschikbaar" wordt getoond.

**Het manifest** is schema-gevalideerd en bevat onder meer: id, titel, beschrijving, icoon, zone (`themeId`), leeftijdsbereik, contractversie, contentversie, benodigde capabilities, ondersteunde oriëntaties, offline-pakketten en `releaseStatus` (`available` of `coming-soon`).

**Alle communicatie loopt via `GameRuntime`** (zie het [architectuuroverzicht](README.md)). Een game raakt nooit de router, contexts, schermen of storage-adapters van de app.

**De host** (`GameHost`) laadt de module, opent en sluit de gamesessie, controleert de benodigde capabilities, vangt fouten op en toont bij `coming-soon` het binnenkort-scherm.

**Isolatie wordt afgedwongen** met dependency-cruiser: geen import van game naar game, geen game naar app-schil of storage, geen React in pure logica.

**Geen gedeelde UI-bibliotheek tussen games.** Elke game heeft zijn eigen componentenmap. Alleen wat aantoonbaar door twee consumenten met dezelfde semantiek wordt gebruikt, verhuist naar `game-platform`. Kopieer geen bestaande game als template: begin bij het contract.

## Gevolgen

Games kunnen los ontwikkeld, getest (met een nep-runtime) en uitgezet worden, en de schil blijft klein. De prijs is enige duplicatie tussen games — bewust geaccepteerd boven een gedeelde laag die aan beide kanten knelt.
