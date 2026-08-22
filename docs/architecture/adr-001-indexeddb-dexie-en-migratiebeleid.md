# ADR-001 — IndexedDB, Dexie en migratiebeleid

Status: geaccepteerd  
Datum: 23 juli 2026

## Context

Profielen, game-instellingen en oefendata stonden verspreid in `localStorage`. Daardoor ontbraken transacties, query-indexen, runtimevalidatie, cascade-delete en herstelbare migratiefouten. De gegevens hebben verschillende levensduren: profielrecords, sessies, append-only events, projecties en bootvoorkeuren.

## Besluit

Gestructureerde duurzame data wordt opgeslagen in IndexedDB via Dexie. Dexie is uitsluitend een interne adapter achter repositorycontracten.

Databaseversie 1 bevat:

- `profiles`: `&id, createdAt, updatedAt`;
- `profileSettings`: `&profileId, updatedAt`;
- `settings`: `&[profileId+scope], profileId, scope, updatedAt`;
- `gameSessions`: `&id, profileId, gameId, startedAt, [profileId+startedAt]`;
- `practiceEvents`: `&id, profileId, gameId, sessionId, occurredAt, [profileId+gameId], [profileId+occurredAt]`;
- `progressProjections`: `&[profileId+gameId], profileId, gameId, status`;
- `databaseMeta`: `&key, updatedAt`.

Databaseversie 2 voegt een statusindex aan `gameSessions` toe en migreert bestaande sessies zonder `contentVersion` naar de expliciete waarde `legacy-unknown`. De oefenevents zelf blijven ongewijzigd; uitgebreidere projectievelden zijn herbouwbaar uit events.

Alle persistente records worden met Zod gevalideerd. Tijden zijn UTC ISO-8601, ids worden via `crypto.randomUUID()` en branded grensconstructors gemaakt en ieder versioneerbaar contract start op versie 1. Actuele schemas mogen compatibele onbekende velden bewaren; onbekende contractversies worden geweigerd.

## Migratiebeleid

- Legacydata wordt read-only gelezen en met afzonderlijke legacyschemas geparsed.
- De import draait transactioneel en schrijft pas een complete migratiestatus na succes.
- Een bronfingerprint maakt een tweede run idempotent.
- Legacykeys blijven minimaal één stabiele release als rollbackbron staan.
- Corrupte data wordt niet door lege defaults overschreven; boot stopt met een herstelinterface, diagnose-export en expliciete tijdelijke modus.
- Iedere volgende databaseversie krijgt een oplopende Dexie-upgrade en fixtures voor alle ondersteunde vorige versies.

## `localStorage`-uitzonderingen

Alleen `game-wereld-active-profile-id` en `game-wereld-global-mute` blijven toegestaan als kleine, niet-kritieke bootvoorkeur. De oude keys worden niet meer geschreven. Rewardresultaten en zone-devtoolsdata blijven vluchtig in runtimegeheugen.

## Fout- en fallbackbeleid

Technische fouten worden vertaald naar `storage-unavailable`, `quota-exceeded`, `migration-failed`, `invalid-persisted-data`, `duplicate` of `not-found`. Tijdelijke in-memory repositories worden alleen na een expliciete gebruikersactie geactiveerd. Een permanente melding maakt duidelijk dat voortgang dan niet wordt bewaard; de eventbuffer is begrensd op 100 events.

## Gevolgen

Voordelen:

- transactionele cascade-delete en event/projectie-updates;
- idempotente events en migraties;
- testbare consumers zonder Dexie;
- gerichte indexen en herbouwbare projecties;
- zichtbare herstelpaden in plaats van stil dataverlies.

Kosten:

- asynchrone boot- en profielstates zijn nu expliciet onderdeel van de UI;
- een extra runtime-dependency en databasefixturetests;
- legacykeys blijven tijdelijk bestaan en moeten na de rollbackperiode bewust worden opgeschoond.
