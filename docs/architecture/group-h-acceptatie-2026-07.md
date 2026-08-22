# Groep H — Architectuurevaluatie en eindacceptatie

Datum: 23 juli 2026  
Besluit: **gedeeltelijk geïmplementeerd; productierelease en legacy-opruiming blijven open**

## Tweede game

“Schelpen Tellen” oefent hoeveelheden 1–5. De inhoudelijk eigenaar is de repository-/producteigenaar; skill-id `number-quantity-1-5` en taken `tel-1` tot en met `tel-5` zijn expliciet en stabiel. De game gebruikt alleen publieke platform-UI en `GameRuntime`, registreert neutrale oefenobservaties, heeft tekst naast de visuele hoeveelheid en vereist geen audio, spraak, drag of tijdslimiet.

Integratie vergde één registryentry en generalisering van twee bestaande één-gameaannames. Routes, profielrepository, databaseschema en projectorimplementatie veranderden niet.

## Succescriteria uit hoofdstuk 1

| Criterium                             | Bewijs                                       | Status |
| ------------------------------------- | -------------------------------------------- | ------ |
| Schone checkout check/build           | volledige kwaliteitsstraat                   | groen  |
| Tweede game via registry/contracttest | beide loadbare entries door generieke suite  | groen  |
| Gamefout blijft binnen boundary       | correlation-id/boundarytest                  | groen  |
| Schema-upgrade behoudt of herstelt    | migratie-, rollback- en corruptiefixtures    | groen  |
| Gedownloade wereld start offline      | Chromium productie-PWA-E2E voor beide games  | groen  |
| Profieldelete wist alle records       | cascade-unit- en productie-E2E               | groen  |
| Projecties zijn herbouwbaar           | projectorfixtures en multi-gameprojectietest | groen  |

## Hardening en opruiming

- ongebruikte 48-bestanden UI-catalogus en 78 transitieve npm-packages verwijderd;
- brede Knip-ignore en tijdelijke uitzondering gesloten;
- `.DS_Store` en ingetrokken routealiases verwijderd;
- inline bootstrap-script verwijderd;
- CSP, Permissions Policy, Referrer Policy, nosniff en framebeleid toegevoegd en getest;
- bundlecontrole meet nu alle gamechunks en offlinepakketten;
- actuele README's en architectuurpagina's vervangen tegenstrijdige transitietekst.

## Baselinevergelijking

| Metriek          |   IMP-A01 |     Groep H-doel/resultaat |
| ---------------- | --------: | -------------------------: |
| Initiële JS gzip | 299,06 kB |  118,42 kB / 200 kB-budget |
| CSS gzip         |  28,31 kB |    19,22 kB / 40 kB-budget |
| Lazy gamechunks  |      geen | 85,33 kB max.; twee chunks |
| TypeScript       | 27 fouten |                          0 |
| Audit            |    1 high |           0 kwetsbaarheden |

De offlinepakketten bevatten samen 114 vereiste buildassets (180.399.705 bytes). De 21 orphan-signalen zijn bewust niet automatisch verwijderd: het gaat om alternatieve avatars, bezems, mascottes, wereldiconen en een logovariant die product- en licentiebeoordeling vereisen.

De finale geautomatiseerde pipeline omvatte 85 unit-/componenttests, 7 buildscripttests, 324 modules en 785 dependencies zonder architectuurovertreding, 47 gecontroleerde Markdownbestanden en 9 geslaagde tablet-E2E's in Chromium/WebKit. De Chromium-only netwerkloze PWA-proef was groen; de overeenkomstige WebKit-proef is bewust overgeslagen omdat service-worker/offline-interceptie daar niet stabiel als blokkerende CI-fixture kan worden getest.

## Open risico's

| Risico                                                                                                    | Eigenaar                 | Vervolg                                               |
| --------------------------------------------------------------------------------------------------------- | ------------------------ | ----------------------------------------------------- |
| Fysieke iPad-/screenreaderproef kan niet in repositoryautomatisering worden bewezen                       | releaseverantwoordelijke | verplicht vóór publieke release                       |
| Legacy `localStorage`-bronkeys/readers moeten minimaal één werkelijk stabiele release beschikbaar blijven | repository-eigenaar      | verwijder in een release ná bewezen rollbackperiode   |
| Externe monitoring is uitgesteld                                                                          | repository-eigenaar      | herbeoordeel volgens ADR-004 bij aantoonbare behoefte |

## Eindoordeel

De modulaire architectuur werkt voor twee echte games en de geautomatiseerde acceptatiecriteria zijn behaald. Het voorstel wordt niet als volledig afgerond gemarkeerd zolang de echte rollbackperiode en fysieke device-/screenreadercheck ontbreken. Deze terughoudendheid voorkomt dat lokale data of releasebewijs administratief wordt weggepoetst.
