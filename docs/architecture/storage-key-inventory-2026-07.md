# Inventaris browseropslag vóór Groep C

Datum: 23 juli 2026  
Broncontrole: `rg "localStorage|sessionStorage|indexedDB" src`

Deze inventaris beschrijft alle bekende keys vóór de writerwissel. Legacykeys blijven minimaal één stabiele release read-only beschikbaar als rollbackbron.

| Key/patroon                                                    | Payload en eigenaar                                                                 | Classificatie                 | Doel en migratie                                                                                | Retentie/verwijdering                                                                 |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `kids-game-profiles`                                           | JSON-array met profiel, avatar, settings en `GameProgress[]`; oude `ProfileContext` | duurzaam domeinrecord         | `profiles`, `profileSettings`, `progressProjections`; eenmalige Zod-gevalideerde import         | legacykey één stabiele release behouden; nieuwe records bij cascade-delete verwijderd |
| `kids-game-current-profile`                                    | profiel-id; oude shellidentity                                                      | niet-kritieke bootvoorkeur    | read-only fallback naar `game-wereld-active-profile-id`                                         | verwijderen na rollbackperiode; bij profieldelete wordt nieuwe key verwijderd         |
| `game-wereld-active-profile-id`                                | profiel-id; shellidentity                                                           | niet-kritieke bootvoorkeur    | blijft bewust in `localStorage` voor pre-bootselectie                                           | verwijderen bij deselect/delete                                                       |
| `game-wereld-global-mute`                                      | `"true"`/`"false"`; welcome                                                         | niet-kritieke bootvoorkeur    | blijft bewust in `localStorage`                                                                 | door gebruiker overschreven; geen kindanalytics                                       |
| `magisch-strand-avontuur:{profileId}:settings`                 | JSON met audio, hints, muziek en reduced motion                                     | duurzame game-instellingen    | `settings`, scope `magisch-strand-avontuur.preferences` (legacy key: `strand-bezem-escape:...`) | cascade-delete met profiel; legacy read-only                                          |
| `magisch-strand-avontuur:{profileId}:selected-world`           | world-id                                                                            | duurzame gamekeuze            | `settings`, scope `magisch-strand-avontuur.world`                                               | cascade-delete met profiel; legacy read-only                                          |
| `magisch-strand-avontuur:{profileId}:unlocked-rewards`         | JSON-array reward-id's                                                              | duurzaam gamerecord           | `settings`, scope `magisch-strand-avontuur.rewards`                                             | cascade-delete met profiel; legacy read-only                                          |
| `magisch-strand-avontuur:{profileId}:progress`                 | legacy totalen en practice attempts                                                 | duurzame leerdata             | events naar `practiceEvents`, totalen naar herbouwbare `progressProjections`                    | cascade-delete met profiel; legacy read-only                                          |
| `game-runtime:practice:{profileId}:magisch-strand-avontuur`    | Group-B practice-eventarray                                                         | duurzame leerdata             | `practiceEvents` met schema V1 en idempotentie op event-id                                      | cascade-delete met profiel; legacy read-only                                          |
| `magisch-strand-avontuur:{profileId}:voice-privacy:2026-06-01` | `"accepted"`                                                                        | duurzame toestemmingsvoorkeur | `settings`, scope `magisch-strand-avontuur.voice-privacy`                                       | cascade-delete met profiel; opnieuw vragen bij versieverhoging                        |
| `magisch-strand-avontuur:zone-visual-hint-overrides`           | JSON-map zone naar SVG-path                                                         | ontwikkeltoolconfiguratie     | alleen runtimegeheugen; bewust buiten kindprofiel en analytics                                  | verdwijnt bij paginaclose                                                             |
| `magisch-strand-avontuur:reward-result`                        | tijdelijke samenvatting                                                             | sessiestate                   | runtime-sessiecache, niet duurzaam                                                              | verdwijnt bij game-/paginaclose                                                       |

## Voorbeeldfixtures

De uitvoerbare fixtures staan in `src/app/storage/storage.test.ts`.

- geldig: één profiel met avatar, settings en een voltooide game;
- gedeeltelijk oud: ontbrekende progressvelden krijgen uitsluitend in de legacyparser gedocumenteerde defaults;
- corrupt: syntactisch ongeldige JSON veroorzaakt `migration-failed` en geen writes;
- toekomstig: een onbekende `schemaVersion` wordt door het actuele persistente schema geweigerd.

De fixtures bevatten alleen fictieve ids en namen. Er worden geen echte persoonsgegevens, audio of transcripties opgenomen.

## Controle na writerwissel

Na Groep C mogen directe browsercalls in `src` alleen voorkomen in:

- `storage/bootPreferences.ts` voor de twee bootvoorkeuren;
- `storage/platform.ts` om IndexedDB te detecteren en legacydata read-only te importeren.

Dexie blijft intern in `storage/database.ts` en repositoryadapters. UI, contexts en games importeren geen database-instance.
