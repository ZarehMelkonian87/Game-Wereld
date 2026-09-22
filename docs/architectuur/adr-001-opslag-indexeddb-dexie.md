# ADR-001 — Opslag: IndexedDB via Dexie

**Status:** geaccepteerd · **Herzien:** 2026-09-22

## Context

Profielen, instellingen en oefendata stonden oorspronkelijk verspreid in `localStorage`. Dat mist transacties, indexen, validatie, cascade-delete en herstelbare migraties, terwijl de gegevens heel verschillende levensduren hebben: profielen, sessies, append-only observaties, herbouwbare projecties en kleine bootvoorkeuren.

## Besluit

Alle duurzame, gestructureerde data staat in **IndexedDB via Dexie**. Dexie is uitsluitend een interne adapter achter repositorycontracten: de rest van de app (en zeker geen game) kent Dexie niet.

**Databaseversie 2** (`game-wereld`):

| Tabel                 | Sleutel en indexen                                                                          |
| :-------------------- | :------------------------------------------------------------------------------------------ |
| `profiles`            | `&id, createdAt, updatedAt`                                                                 |
| `profileSettings`     | `&profileId, updatedAt`                                                                     |
| `settings`            | `&[profileId+scope], profileId, scope, updatedAt`                                           |
| `gameSessions`        | `&id, profileId, gameId, status, startedAt, [profileId+startedAt]`                          |
| `practiceEvents`      | `&id, profileId, gameId, sessionId, occurredAt, [profileId+gameId], [profileId+occurredAt]` |
| `progressProjections` | `&[profileId+gameId], profileId, gameId, status`                                            |
| `databaseMeta`        | `&key, updatedAt`                                                                           |

Versie 2 voegde de statusindex op `gameSessions` toe en gaf bestaande sessies zonder contentversie de expliciete waarde `legacy-unknown`.

**Regels:** elk persistent record wordt met Zod gevalideerd bij lezen en schrijven; tijden zijn UTC ISO-8601; id's komen uit `crypto.randomUUID()` achter branded constructors; elk contract begint op versie 1. Onbekende maar compatibele velden blijven bewaard, onbekende contractversies worden geweigerd.

## localStorage-uitzonderingen

Alleen twee kleine, niet-kritieke bootvoorkeuren mogen in `localStorage`: `game-wereld-active-profile-id` en `game-wereld-global-mute`. Verder niets.

Games gebruiken hun eigen, altijd per profiel genoemde sleutels via `runtime.storage` (bijvoorbeeld `magisch-strand-avontuur:{profileId}:settings`). Zo blijft data per kind gescheiden — dat is met tests geborgd.

## Migraties en fouten

- Elke nieuwe databaseversie krijgt een oplopende Dexie-upgrade plus fixtures voor alle eerder ondersteunde versies.
- Migraties draaien transactioneel; de status wordt pas na succes weggeschreven, en een bronfingerprint maakt een tweede run idempotent.
- Corrupte data wordt **niet** door lege defaults overschreven. De app stopt met een herstelinterface, een diagnose-export en een expliciete tijdelijke modus.
- Technische fouten worden vertaald naar begrijpelijke codes: `storage-unavailable`, `quota-exceeded`, `migration-failed`, `invalid-persisted-data`, `duplicate`, `not-found`.
- De tijdelijke in-memory modus start alleen na een bewuste gebruikersactie, meldt permanent dat voortgang niet wordt bewaard, en buffert maximaal 100 observaties.

## Gevolgen

Transacties, cascade-delete bij profielverwijdering en herbouwbare projecties zijn mogelijk. De prijs is een extra abstractielaag en de verplichting om bij elke schemawijziging migratiefixtures te onderhouden.
