# Uitvoerbewijs Groep C — opslag, schema's en migraties

Datum: 23 juli 2026  
Status: afgerond

## Resultaat

De verspreide browseropslag is vervangen door één opslagmodule met runtime-gevalideerde contracten, repositories en expliciete herstelstates. UI en games kennen geen Dexie-instance. Alleen twee kleine pre-bootvoorkeuren blijven bewust in `localStorage`.

De opslagmodule bestaat uit:

- Zod-schema's voor profiel, profielinstellingen, gamesettings, sessie, oefenevent, projectie en migratiemetadata;
- een versie 1 IndexedDB-database via Dexie met indexen voor de daadwerkelijke queries;
- repositorycontracten en afzonderlijke Dexie- en in-memoryimplementaties;
- een transactionele, idempotente legacy-import met bronfingerprint;
- repository-backed runtimeadapters voor game-instellingen, rewards en wereldselectie;
- een begrensde tijdelijke modus en herstel-UI voor onbeschikbare of corrupte opslag.

## Data-eigenaarschap

| Data                            | Nieuwe eigenaar                            | Levensduur                    |
| ------------------------------- | ------------------------------------------ | ----------------------------- |
| Profiel en profielinstellingen  | `ProfileRepository` / `SettingsRepository` | duurzaam                      |
| Gamesettings, rewards en wereld | gamescope via `SettingsRepository`         | duurzaam                      |
| Gamesessie                      | `SessionRepository`                        | duurzaam sessierecord         |
| Oefenfeit                       | `PracticeRepository`                       | duurzaam en idempotent        |
| Voortgangsprojectie             | `ProgressRepository`                       | duurzaam, afgeleid record     |
| Rewardresultaat                 | runtime-sessiecache                        | tot page/game-exit            |
| Zone-devtoolsoverride           | runtimegeheugen                            | tot paginaclose               |
| Actief profiel en globale mute  | boot preference-adapter                    | kleine niet-kritieke voorkeur |

De volledige keyinventaris, payloadvormen, retentie en verwijderpaden staan in [storage-key-inventory-2026-07.md](storage-key-inventory-2026-07.md). De keuze voor IndexedDB, Dexie, schema's en rollbackbeleid staat in [ADR-001](adr-001-indexeddb-dexie-en-migratiebeleid.md).

## Migratieveiligheid

De migratie leest legacykeys uitsluitend read-only. Alle writes, inclusief migratiestatus, lopen in één transactie. Een fingerprint voorkomt dubbele import bij een tweede run. De oude keys blijven minimaal één stabiele release behouden.

De fixtures bewijzen:

- geldige profiel-, settings-, rewards-, world-, privacy-, progressie- en eventpayloads;
- gedeeltelijke oude profielen met uitsluitend gedocumenteerde legacydefaults;
- syntactisch en semantisch corrupte payloads zonder gedeeltelijke writes;
- rollback wanneer een fout pas na eerdere writes optreedt;
- een tweede migratierun zonder duplicaten;
- weigering van toekomstige onbekende contractversies.

## Herstelgedrag

Databasebootstrap modelleert `opening`, `ready`, `migration-failed` en `unavailable`. Bij falen krijgt de gebruiker geen blanco scherm maar acties voor opnieuw proberen, privacyveilige diagnose-export, bevestigde databasereset of expliciete tijdelijke modus.

Tijdelijke modus gebruikt dezelfde repositorycontracten, toont permanent dat voortgang niet wordt bewaard en begrenst de oefeneventbuffer op 100 records. Asynchrone write failures worden met een zichtbare melding en correlation-id-geschikte application error afgehandeld.

## Architectuur- en kwaliteitscontrole

- Games importeren geen opslagmodule en gebruiken uitsluitend `GameRuntime.storage` en `GameRuntime.practice`.
- UI en consumers kunnen de interne database-, migratie- en Dexie-adapters niet importeren; Dependency Cruiser blokkeert dit.
- Persistente data begint als `unknown` en wordt aan de grens door Zod gevalideerd.
- Multi-recordwrites, event/projectie-updates en cascade delete zijn transactioneel.
- Events bevatten geen kindnaam, avatar, transcript of ruwe audio.
- Alle nieuwe en gewijzigde functies zijn arrow functions.
- De bestaande Knip-uitzondering voor de gegenereerde UI-catalogus is opnieuw beoordeeld, niet uitgebreid en blijft apart gepland onder IMP-H04.

## Verificatie

De volgende controles zijn groen:

- `npm run check`: formatting, ESLint, TypeScript, 36 tests plus één reeds geplande Group-E-`todo`, en Dependency Cruiser;
- migratie-, schema-, repository-, rollback-, cascade-, quota-, unavailable- en runtimeopslagtests;
- `npm run check:dead-code`;
- `npm audit --audit-level=high`: 0 vulnerabilities;
- productiebuild en bundelanalyse;
- bundelbudget: shell 141,50 kB gzip, gamechunk 53,27 kB gzip en CSS 27,72 kB gzip;
- Playwright in Chromium en WebKit: profiel create/select/reload/update/delete, game-open en storage-unavailable met tijdelijke modus.

## Commitbericht

`feat(storage): migrate profiles and game data to repository-backed IndexedDB`
