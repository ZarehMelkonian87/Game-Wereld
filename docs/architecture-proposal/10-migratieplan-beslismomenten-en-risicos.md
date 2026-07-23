# 10. Migratieplan, beslismomenten en risico's

## 10.1 Strategie

Migreer met een **strangler-aanpak**: maak eerst veiligheidsnetten, introduceer nieuwe contracten naast bestaande code en verplaats één verticale flow tegelijk. Geen brede maprename en geen gelijktijdige rewrite van game, opslag, UI en analytics.

Iedere fase heeft een meetbare exitcriteria. Een kalenderinschatting volgt pas nadat fase 0 de huidige fouten en testbaarheid zichtbaar heeft gemaakt.

## 10.2 Fase 0 — Baseline bevriezen

Doel: weten wat nu werkt en releases niet verder laten afdrijven.

Werk:

- leg huidige productieflow en ondersteunde devices/browsers vast;
- archiveer de huidige bundle- en assetrapportage als baseline;
- voeg `typecheck` toe en herstel alle bestaande TypeScript-fouten;
- voeg ESLint, Prettier en een minimale CI-workflow toe;
- voeg smoke-E2E toe voor profiel aanmaken en één gameflow;
- laat `npm run check` blokkeren op nieuwe fouten;
- inventariseer directe browseropslagkeys en payloadvormen.

Exit:

- `npm run check` en `npm run build` zijn groen;
- geen onbekende TypeScript-fouten zijn uitgezonderd;
- minstens één Playwright-trace kan bij een geforceerde fout worden bekeken;
- baseline bevat entry-JS, CSS, totale assets en kernflowduur.

## 10.3 Fase 1 — Contracten en importgrenzen

Doel: afhankelijkheden omkeren zonder gedrag te veranderen.

Werk:

- voeg Dependency Cruiser-regels toe;
- definieer branded ids, `GameManifest`, `GameRuntime` en repositorypoorten;
- maak `GameHost` met loading- en error boundary;
- geef actief profiel en lifecyclecallbacks via runtimeprops;
- verwijder game-import van `ProfileContext`;
- verenig catalogusmetadata en registry-id;
- zet gamecomponent achter statische dynamische import;
- voeg gamecontracttests toe.

Exit:

- initiële appchunk bevat de game-implementatie niet;
- registry-key, manifest-id, route-id en progressie-id zijn identiek;
- game importeert niets uit app-shell, context of infrastructuur;
- lazy-loadfout is herstelbaar.

## 10.4 Fase 2 — Opslag en datamigratie

Doel: één valide, transactionele bron voor duurzame gegevens.

Werk:

- definieer Zod-schema's voor bestaande profielen, settings, rewards, werelden en events;
- bouw Dexie-database en repositoryadapters;
- schrijf fixturetests voor bestaande `localStorage`-vormen;
- voer een eenmalige, idempotente importmigratie uit;
- bewaar migratiestatus; verwijder oude keys pas na succesvolle validatie en rollbackperiode;
- implementeer cascade delete en zichtbare non-persistent mode;
- vervang `Date.now()`-ids door runtime UUID/clock.

Exit:

- bestaande testfixtures migreren zonder dataverlies;
- dubbele migratie maakt geen duplicaten;
- quota/corruptie/migratiefout hebben herstel-UI;
- profielverwijdering laat geen gerelateerde records of gamekeys achter.

Rollback:

- oude keys blijven read-only bewaard gedurende minimaal één stabiele release;
- een feature flag kan tijdelijk de oude reader gebruiken, nooit beide writers tegelijk.

## 10.5 Fase 3 — Oefenevents en projecties

Doel: semantisch consistente leerdata.

Werk:

- kies met inhoudelijk/pedagogisch eigenaar de definitie van skill, assistance en status;
- implementeer `PracticeEventV1` en idempotente writer;
- vertaal één gameflow naar het nieuwe event;
- maak een versieerbare projector en vergelijk dashboardresultaten met verwachte fixtures;
- migreer overige gameflows één voor één;
- verwijder oude directe `GameProgress`-mutaties pas na paritycontrole.

Exit:

- ieder zichtbaar dashboardgetal is herleidbaar tot events en projectorversie;
- projecties zijn verwijderbaar en volledig herbouwbaar;
- geen game schrijft zelf `mastered`/`supported` als waarheid;
- geen event bevat naam, transcript of audio.

## 10.6 Fase 4 — PWA en assetpipeline

Doel: aantoonbare offlinebetrouwbaarheid en kleinere startdownload.

Werk:

- genereer assetmetadata en detecteer orphans/ontbrekende files;
- introduceer Workbox-precache voor de shell;
- implementeer game/world offlinepakketten met voortgang, quota en verificatie;
- code-split routes, games en zware optionele UI;
- optimaliseer beelden/video's op basis van meetrapport;
- voeg updateprompt en veilige activatiegrens toe;
- test productiebuild offline in Playwright en op referentietablet.

Exit:

- shellbudget en gamechunkbudget zijn groen of via ADR gemotiveerd;
- offline-status is per wereld betrouwbaar;
- een onderbroken download resulteert nooit in `ready`;
- een SW-update onderbreekt geen actieve sessie;
- oude caches worden begrensd opgeruimd.

## 10.7 Fase 5 — Hardening en tweede game

Doel: bewijzen dat de architectuur uitbreidbaar is.

Werk:

- bouw een kleine tweede echte game of verticale proof-of-concept;
- hergebruik alleen aantoonbaar gedeelde platformonderdelen;
- voer volledige accessibility- en browsermatrix uit;
- activeer Knip, bundle diff en volledige architecture rules blokkerend;
- schrijf runbooks voor storage-, media-, speech- en releaseproblemen;
- evalueer ontwikkeltijd en frictie van het contract.

Exit:

- tweede game vereist geen wijziging in routes, profielrepository of progressieprojectorcode buiten registry/contentconfig;
- contracttests en kern-E2E zijn groen;
- resterende duplicatie leidt alleen tot platformextractie wanneer beide games dezelfde semantiek hebben.

## 10.8 Volgorde van PR's

Aanbevolen kleine levereenheden:

1. scripts + CI + herstel typefouten;
2. eerste Vitest-tests voor pure progressie/parsing;
3. eerste Playwright-smoke en traceconfig;
4. architecture rules in waarschuwingmodus, daarna blokkeren;
5. manifest/ids consolideren;
6. `GameHost` + error boundary;
7. lazy registry;
8. repositories/schema's zonder writerwissel;
9. read-migratie + dual-readvergelijking;
10. writer cutover per datatype;
11. event/projector cutover per gameflow;
12. Workbox en offlinepakket per wereld.

Elke PR moet zelfstandig releasable of achter een expliciete tijdelijke feature flag staan.

## 10.9 Risicomatrix

| Risico | Kans | Impact | Beheersing |
| --- | --- | --- | --- |
| Bestaande lokale data raakt kwijt | Middel | Hoog | Fixtures, idempotente migratie, read-only backupkeys, cascade- en rollbacktests |
| Refactor verandert pedagogische semantiek | Middel | Hoog | Projectorvoorbeelden met inhoudelijk eigenaar; parallelle resultaatvergelijking |
| Safari/iPad wijkt af in storage/media/speech | Hoog | Hoog | WebKit-E2E, echt device, capabilityfakes en manual releasecheck |
| Offlinepakket overschrijdt quota | Hoog | Middel | Grootte vooraf, estimate, expliciete download, LRU en herstel-UI |
| Lazy chunk niet beschikbaar na release | Middel | Middel | load boundary, retry/update, consistente SW-versie en cached actieve release |
| Te veel abstracties vertragen features | Middel | Middel | two-consumer-regel, ADR, tweede-gameproef |
| Externe observability lekt kinddata | Laag zonder SDK | Zeer hoog | Opt-in besluit, allowlist, geen replay/transcript, privacytest |
| CI wordt traag/flaky | Middel | Middel | snelle checks eerst, deterministische fakes, kleine PR-matrix, nightly volledige matrix |
| Dubbele UI-stack blijft groeien | Middel | Middel | Knip, één UI-basis, dependency-approval |

## 10.10 Beslismomenten en ADR's

Maak minimaal de volgende ADR's wanneer implementatie start:

1. Modulaire monoliet en importgrenzen.
2. GameRuntime-contract en compile-time lazy registry.
3. IndexedDB/Dexie en migratiebeleid.
4. `PracticeEventV1` en pedagogische projector.
5. Workbox- en offlinepakketbeleid.
6. Performancebudgetten en referentiedevices.
7. Eventuele externe foutmonitoring en privacyconfiguratie.

Een ADR bevat context, keuze, afgewezen alternatieven, consequenties, meetpunt en heroverwegingsconditie.

## 10.11 Herbeoordelingscriteria

Deze architectuur wordt opnieuw geëvalueerd wanneer:

- synchronisatie tussen apparaten/scholen een productrequirement wordt;
- meer dan één team games onafhankelijk wil releasen;
- IndexedDB-limieten aantoonbaar het product blokkeren;
- de gamecontracten bij twee opeenvolgende games veel uitzonderingen vereisen;
- profilerdata een globale state-oplossing rechtvaardigt;
- privacy- of wetgevingsvereisten lokale analytics veranderen.

## 10.12 Eindverdediging

Dit voorstel is beter dan het vorige omdat het de grootste actuele risico's eerst sluit, voordelen meetbaar maakt en abstracties beperkt tot echte grenzen. Het biedt uitbreidbaarheid via een kleine host en contracten, niet via een fictief volledig pluginplatform. Het beschermt leerdata met schema's, transacties, privacy en herbouwbare projecties. En het maakt debugging een producteigenschap met traces, fakes en lokale diagnose, in plaats van te vertrouwen op losse logs.

De architectuur is bewust minder spectaculair en daardoor sterker: één deploybare app, duidelijke eigenaars, afgedwongen grenzen en een migratie die op ieder moment kan stoppen met een werkend product.
