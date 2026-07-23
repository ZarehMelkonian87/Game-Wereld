# 11. Implementatietakenlijst

Status: **open**

Laatste herziening: **23 juli 2026**

Deze pagina vertaalt het architectuurvoorstel naar uitvoerbare implementatietaken. De taken staan in afhankelijkheidsvolgorde en zijn zo beschreven dat een ontwikkelaar of AI-agent één taak zelfstandig kan oppakken.

De normatieve kwaliteitsstandaard is [Code Quality & Architecture Requirements](../code-quality-and-architecture.md). Iedere taak bevat daarom een eigen verplichte kwaliteitscontrole. Een hoofdcheckbox mag pas worden afgevinkt nadat alle subcheckboxes, inclusief de kwaliteitscontrole, zijn voltooid.

## Werkwijze voor iedere taak

1. Lees deze taak, haar afhankelijkheden en de gekoppelde architectuurpagina's volledig.
2. Inspecteer vóór wijziging de actuele code; paden in deze lijst zijn richtinggevend en kunnen door eerdere taken zijn veranderd.
3. Beperk de wijziging tot de beschreven scope. Leg een noodzakelijke scope-uitbreiding eerst vast in de taak of een ADR.
4. Voeg of wijzig tests tegelijk met productiecode.
5. Voer de genoemde verificatie uit en daarna alle beschikbare checks uit `npm run check`.
6. Vergelijk de implementatie expliciet met `docs/code-quality-and-architecture.md`.
7. Noteer bewijs onder de taak: gewijzigde bestanden, uitgevoerde commando's, testresultaten, metingen en eventuele ADR.
8. Vink de hoofdtaak pas af wanneer geen verplichte subtaak openstaat.

## Betekenis van checkboxes

- `[ ]` niet gestart of nog niet bewezen;
- `[x]` geïmplementeerd én geverifieerd;
- een geblokkeerde taak blijft `[ ]` en krijgt een korte regel `Geblokkeerd door: ...`;
- acceptatie op basis van alleen code-inspectie is onvoldoende wanneer een uitvoerbare test of meting mogelijk is.

## Verplichte kwaliteitscontrole per taak

De checkbox **Kwaliteitscontrole** onder iedere taak betekent minimaal:

- import- en modulegrenzen zijn gerespecteerd;
- TypeScript- en runtimegrenzen zijn correct;
- loading-, fout-, lege en retrytoestanden zijn behandeld waar relevant;
- tests de veranderde risico's afdekken;
- accessibility, privacy, offlinegedrag en performance zijn beoordeeld waar relevant;
- nieuwe dependencies en abstracties voldoen aan de toelatingsregels;
- documentatie en ADR's zijn bijgewerkt wanneer een contract of beslissing verandert;
- alle op dat moment beschikbare kwaliteitscommando's zijn groen.

Een afwijking mag alleen blijven bestaan volgens hoofdstuk 16, “Uitzonderingen en technische schuld”, van het kwaliteitsdocument.

---

## Groep A — Baseline en kwaliteitsstraat

Deze groep blokkeert alle brede architectuurwijzigingen. Eerst moet de repository betrouwbaar kunnen aantonen of code correct is.

### IMP-A01 — Technische baseline vastleggen

- [ ] **IMP-A01 afgerond**

Afhankelijkheden: geen.

Doel: een reproduceerbaar vertrekpunt vastleggen voor typefouten, bundles, assets, browserflows en ondersteunde omgevingen.

- [ ] Leg de gebruikte Node- en npm-versie vast in `package.json` `engines` en/of een versieconfiguratie die CI en lokale ontwikkeling delen.
- [ ] Voer `npm ci`, `npm run build` en `npx tsc --noEmit` uit en sla de samenvatting van resultaten op in `docs/architecture/baseline-2026-07.md` of een gelijkwaardige actuele baselinepagina.
- [ ] Noteer de initiële JS- en CSS-gzipgrootte, totale `dist`-grootte, aantal media-assets en vijf grootste assets.
- [ ] Leg de officieel ondersteunde browser-/devicematrix vast, met minimaal Chromium-tablet en iPad/Safari of WebKit als doel.
- [ ] Beschrijf de handmatige happy path: profiel maken, game openen, één opdracht voltooien, voortgang bekijken.
- [ ] Controleer dat gegenereerde buildbestanden niet onbedoeld als bronwijziging worden meegenomen.
- [ ] Acceptatie: de baseline bevat exacte commando's, datum, omgeving en meetwaarden waarmee latere taken kunnen vergelijken.
- [ ] Verificatie: een tweede uitvoerder kan de commando's volgen en dezelfde categorieën resultaten produceren.
- [ ] **Kwaliteitscontrole:** toets de taak aan `docs/code-quality-and-architecture.md` en noteer bewijs of gemotiveerde tijdelijke afwijkingen.

### IMP-A02 — Kwaliteitsscripts en ontwikkeldependencies invoeren

- [ ] **IMP-A02 afgerond**

Afhankelijkheden: IMP-A01.

Doel: de in de kwaliteitsstandaard genoemde lokale controles daadwerkelijk uitvoerbaar maken.

- [ ] Voeg scripts toe voor `typecheck`, `lint`, `format:check`, `test`, `test:watch`, `test:architecture` en `check`.
- [ ] Installeer compatibele versies van TypeScript-tooling, ESLint flat config, typescript-eslint, React Hooks-linting, jsx-a11y, Prettier en Vitest.
- [ ] Configureer linting voor TypeScript/React zonder bestaande typefouten te maskeren.
- [ ] Configureer testomgevingen bewust: Node voor pure logica en een DOM-omgeving alleen voor componenttests die dit nodig hebben.
- [ ] Sluit gegenereerde output, distributie-assets en externe bronbestanden correct uit zonder `src` breed te negeren.
- [ ] Voeg geen automatische formattering toe aan `check`; de check moet alleen rapporteren en een non-zero exitcode geven.
- [ ] Acceptatie: ieder script bestaat, eindigt deterministisch en heeft een korte toelichting in README of ontwikkeldocumentatie.
- [ ] Verificatie: voer ieder script afzonderlijk uit en noteer bestaande failures als input voor IMP-A03, niet als permanente ignore.
- [ ] **Kwaliteitscontrole:** toets configuratie, dependencies en uitzonderingen aan `docs/code-quality-and-architecture.md`.

### IMP-A03 — Alle bestaande TypeScript-fouten herstellen

- [ ] **IMP-A03 afgerond**

Afhankelijkheden: IMP-A02.

Doel: `tsc --noEmit` groen krijgen zonder asserts of ignores die echte contractfouten verbergen.

- [ ] Groepeer de baselinefouten per oorzaak: ontbrekende types/exports, incompatibele refs, onjuiste events, ongebruikte code en verouderde controllercontracten.
- [ ] Herstel eerst de brontypes in `strand-bezem-escape/types.ts` en progressiecontracten; vermijd lokale casts in consumers.
- [ ] Breng `PracticeResult`-waarden en aangeroepen payloads tijdelijk consistent zonder vooruit te lopen op de nieuwe eventarchitectuur.
- [ ] Herstel component-/hookcontracten rond scene builder en zone devtools.
- [ ] Verwijder werkelijk ongebruikte imports en parameters; prefix alleen bewust vereiste ongebruikte callbackparameters volgens lintconfig.
- [ ] Voeg regressietests toe voor fouten die gedragslogica raken.
- [ ] Acceptatie: `npm run typecheck` slaagt zonder nieuwe `any`, `@ts-ignore` of brede uitschakeling van strict-regels.
- [ ] Verificatie: `npm run typecheck`, `npm run build` en de relevante tests zijn groen.
- [ ] **Kwaliteitscontrole:** controleer iedere reparatie tegen `docs/code-quality-and-architecture.md`, vooral type assertions, foutafhandeling en module-eigenaarschap.

### IMP-A04 — Eerste unit- en componenttestbasis toevoegen

- [ ] **IMP-A04 afgerond**

Afhankelijkheden: IMP-A02 en bij voorkeur IMP-A03.

Doel: de belangrijkste bestaande pure regels en één Reactflow onder een snel testsysteem brengen.

- [ ] Voeg testsetup en Testing Library toe voor Reactgedrag.
- [ ] Test minimaal instruction randomization met vaste seed, spoken command parsing, rewards/progressieberekening en een geometrische plaatsingsregel.
- [ ] Voeg één componenttest toe die gedrag via rol en toegankelijke naam controleert.
- [ ] Gebruik geen snapshots als hoofdassertie voor gamegedrag.
- [ ] Maak fake clock, idgenerator en storagehelpers alleen wanneer minimaal één test ze direct nodig heeft.
- [ ] Configureer coverage-rapportage, maar blokkeer nog niet op een kunstmatig hoge globale grens.
- [ ] Acceptatie: tests falen aantoonbaar wanneer de bijbehorende kernregel bewust wordt gebroken.
- [ ] Verificatie: `npm run test` is groen en draait zonder afhankelijkheid van netwerk of bestaande browseropslag.
- [ ] **Kwaliteitscontrole:** toets testgedrag, testisolatie en fake boundaries aan `docs/code-quality-and-architecture.md`.

### IMP-A05 — Playwright-smoke en fouttraces invoeren

- [ ] **IMP-A05 afgerond**

Afhankelijkheden: IMP-A01 en IMP-A02.

Doel: een echte browserflow en reproduceerbare foutinformatie beschikbaar maken.

- [ ] Installeer en configureer Playwright met een productieachtige webserver.
- [ ] Voeg `chromium-tablet` en `webkit-tablet` projecten toe met afgesproken viewports.
- [ ] Automatiseer profiel aanmaken, herladen, game openen en veilig terugkeren.
- [ ] Configureer trace `on-first-retry`, screenshot bij falen en een HTML-report.
- [ ] Laat onverwachte console-errors een test falen; documenteer een minimale tijdelijke allowlist.
- [ ] Voeg stabiele selectors toe via rollen/namen; gebruik `data-*` alleen als een betekenisvol testcontract ontbreekt.
- [ ] Acceptatie: een geforceerde fout produceert een bruikbare trace met DOM-, console- en netwerkcontext.
- [ ] Verificatie: de smoke slaagt lokaal in Chromium en WebKit.
- [ ] **Kwaliteitscontrole:** controleer privacy van traces, accessibility van selectors en teststabiliteit tegen `docs/code-quality-and-architecture.md`.

### IMP-A06 — CI-pipeline activeren

- [ ] **IMP-A06 afgerond**

Afhankelijkheden: IMP-A02 tot en met IMP-A05.

Doel: dezelfde kwaliteitscontroles op iedere wijziging laten draaien.

- [ ] Voeg een CI-workflow toe met `npm ci` en gepinde/ondersteunde Node-versie.
- [ ] Draai format, lint, typecheck en unit tests vroeg en waar veilig parallel.
- [ ] Start productiebuild pas nadat statische controles groen zijn.
- [ ] Draai de snelle Chromium-smoke per pull request en WebKit volgens de afgesproken PR- of nightlymatrix.
- [ ] Upload Playwrightreport/traces en coverage als tijdelijk artifact bij falen.
- [ ] Gebruik dependencycache zonder `node_modules` als buildartifact te delen.
- [ ] Beperk workflowpermissions tot wat nodig is.
- [ ] Acceptatie: een bewuste typefout, lintfout en falende test blokkeren ieder afzonderlijk de pipeline.
- [ ] Verificatie: documenteer links of screenshots van één succesvolle en één bewust falende proefrun.
- [ ] **Kwaliteitscontrole:** toets CI, secrets, artifacts en privacy aan `docs/code-quality-and-architecture.md`.

### IMP-A07 — Architectuurregels en dode-codecontrole invoeren

- [ ] **IMP-A07 afgerond**

Afhankelijkheden: IMP-A03 en IMP-A06.

Doel: modulegrenzen automatisch bewaken en de brede ongebruikte dependencyset beheersen.

- [ ] Installeer Dependency Cruiser en Knip.
- [ ] Maak regels voor cycles, game-naar-game, game-naar-app/context/infrastructure, platform-naar-game en domain-naar-React/browser.
- [ ] Definieer huidige transitiepaden expliciet; gebruik tijdelijke uitzonderingen met issue en verwijdercriterium.
- [ ] Configureer Knip voor Vite, tests en entrypoints zodat dynamische registryimports niet als ongebruikt worden gezien.
- [ ] Rapporteer eerst bestaande violations, herstel ze of leg korte aflopende uitzonderingen vast.
- [ ] Verwijder bewezen ongebruikte dependencies zoals MUI/react-dnd alleen na Knip-, import- en buildcontrole.
- [ ] Voeg `test:architecture` en een periodieke `check:dead-code` aan CI toe.
- [ ] Acceptatie: een testimport van game naar `ProfileContext` of andere game laat de architectuurcheck bewust falen.
- [ ] Verificatie: archiveer een kort dependencyrapport en de actuele uitzonderingenlijst.
- [ ] **Kwaliteitscontrole:** toets regels, uitzonderingen en dependencywijzigingen aan `docs/code-quality-and-architecture.md`.

---

## Groep B — Modulecontracten, GameHost en lazy loading

Start deze groep pas wanneer groep A groen is. Het doel is echte afhankelijkheidsisolatie, niet alleen nieuwe mappen.

### IMP-B01 — Branded ids en gedeelde grenscontracten definiëren

- [ ] **IMP-B01 afgerond**

Afhankelijkheden: IMP-A03 en IMP-A07.

Doel: verwisselbare strings en impliciete globale afhankelijkheden vervangen door smalle contracten.

- [ ] Definieer branded types voor minimaal `GameId`, `ThemeId`, `ProfileId`, `SessionId`, `TaskId` en `EventId`.
- [ ] Voeg grensconstructors/parsers toe die ongeldige lege ids weigeren.
- [ ] Definieer `Clock`, `IdGenerator`, `DiagnosticLogger` en basisresultaten voor verwachte fouten.
- [ ] Plaats contracten in een platformmap die geen concrete adapters importeert.
- [ ] Migreer alleen de eerstvolgende consumers; voorkom een repo-brede cosmetische castoperatie.
- [ ] Test constructors en exhaustieve foutpaden.
- [ ] Acceptatie: twee verschillende idtypen kunnen niet zonder expliciete conversie worden verwisseld.
- [ ] Verificatie: typecheck plus gerichte type-/unittests zijn groen.
- [ ] **Kwaliteitscontrole:** controleer types, assertions en modulegrenzen tegen `docs/code-quality-and-architecture.md`.

### IMP-B02 — GameManifest en catalogus als één bron van waarheid invoeren

- [ ] **IMP-B02 afgerond**

Afhankelijkheden: IMP-B01.

Doel: duplicatie tussen `data/games.ts`, `games/registry.ts` en `game.config.ts` verwijderen.

- [ ] Definieer het runtime-gevalideerde `GameManifest` volgens hoofdstuk 5.
- [ ] Maak `strand-bezem-escape/manifest.ts` licht: geen zware component-, content- of assetimports.
- [ ] Laat catalogus en routes dezelfde canonical `gameId` gebruiken.
- [ ] Maak oude alias-id's expliciete redirects/migraties in plaats van meerdere registryentries met dezelfde component.
- [ ] Modelleer `coming-soon` in het manifest zonder een niet-bestaande loader.
- [ ] Voeg tests toe voor unieke ids, geldige theme-id, leeftijd, capabilities en release status.
- [ ] Acceptatie: titel, beschrijving, categorie en capability bestaan op één plek en registry-key is gelijk aan manifest-id.
- [ ] Verificatie: manifestcontracttest en bestaande catalogusflow zijn groen.
- [ ] **Kwaliteitscontrole:** toets runtimevalidatie, contentdata en imports aan `docs/code-quality-and-architecture.md`.

### IMP-B03 — GameRuntime-poorten definiëren

- [ ] **IMP-B03 afgerond**

Afhankelijkheden: IMP-B01 en IMP-B02.

Doel: alle diensten die een game nodig heeft expliciet via de host leveren.

- [ ] Definieer `GameRuntime` met identity, clock, ids, practice writer, media, speech, diagnostics en lifecycle.
- [ ] Houd poorten capabilitygericht; exporteer geen `db`, router, context of leveranciers-SDK.
- [ ] Definieer benoemde resultaten voor permission denied, unavailable, quota en recoverable mediafouten.
- [ ] Bouw testfakes voor clock, ids, practice, media, speech en lifecyclecalls.
- [ ] Documenteer welke runtimevelden stabiel contract zijn en welke alleen intern zijn.
- [ ] Acceptatie: een game kan in een test mounten met uitsluitend een fake runtime en zonder globale providers.
- [ ] Verificatie: contract- en typechecks tonen geen app-/infrastructureimport vanuit het contract.
- [ ] **Kwaliteitscontrole:** toets de contractgrootte, privacyvelden en foutmodellen aan `docs/code-quality-and-architecture.md`.

### IMP-B04 — GameHost met laad-, capability- en foutgrenzen bouwen

- [ ] **IMP-B04 afgerond**

Afhankelijkheden: IMP-B03.

Doel: één eigenaar maken voor resolve, sessiestart, runtimeconstructie, laden, afsluiten en herstel.

- [ ] Bouw `GameHost` dat routeparameters valideert en een registryentry resolveert.
- [ ] Controleer vereiste capabilities vóór mount en bied gelijkwaardige fallback waar mogelijk.
- [ ] Start en sluit een voorlopige sessie via een tijdelijke repository/fake totdat groep C gereed is.
- [ ] Voeg afzonderlijke loading-, load-error- en runtime-errorinterfaces toe.
- [ ] Zorg dat complete, exit en crash maximaal één keer de lifecycle afsluiten.
- [ ] Geef terug naar catalogus, retry en app-update als concrete herstelacties.
- [ ] Voeg route- en game-error boundaries toe met correlation-id.
- [ ] Acceptatie: een renderfout in de game haalt de app-shell niet neer.
- [ ] Verificatie: component-/integratietests dekken success, onbekende id, loader rejection, ontbrekende capability en runtimecrash.
- [ ] **Kwaliteitscontrole:** toets boundaries, accessibility, logging en lifecycle aan `docs/code-quality-and-architecture.md`.

### IMP-B05 — Registry en routes daadwerkelijk lazy maken

- [ ] **IMP-B05 afgerond**

Afhankelijkheden: IMP-B02 en IMP-B04.

Doel: gamecode uit de initiële appchunk halen.

- [ ] Vervang de statische gamecomponentimport door een statisch analyseerbare `import("./strand-bezem-escape")` loader.
- [ ] Gebruik `Suspense` of route-lazy mechanismen met kindvriendelijke loading-UI.
- [ ] Maak globale routes waar zinvol lazy zonder essentiële shellfeedback te verbergen.
- [ ] Handel `vite:preloadError` of equivalente chunk-loadfout af via de load boundary.
- [ ] Genereer een bundlevisualisatie vóór en na de wijziging.
- [ ] Voeg een budgetcheck toe die de shell zonder gamecode bewaakt.
- [ ] Acceptatie: het initiële entrypoint importeert de game-implementatie niet en er bestaat een aparte gamechunk.
- [ ] Verificatie: vergelijk bundlegraph en netwerkrequests bij home versus game-open.
- [ ] **Kwaliteitscontrole:** toets loading/error UX, budgets en imports aan `docs/code-quality-and-architecture.md`.

### IMP-B06 — Strand Bezem Escape losmaken van globale appcontext

- [ ] **IMP-B06 afgerond**

Afhankelijkheden: IMP-B03 tot en met IMP-B05.

Doel: de eerste game uitsluitend via props/runtime met de app laten communiceren.

- [ ] Verwijder imports van `ProfileContext`, router en directe globale appstate uit de gamemodule.
- [ ] Geef profile/session identity door via `GameRuntime`.
- [ ] Routeer exit, complete, practice, media en speech via runtimepoorten.
- [ ] Houd gamespecifieke state lokaal in controller/reducer.
- [ ] Voeg een test toe die de game zonder `ProfileProvider` mount.
- [ ] Laat Dependency Cruiser deze grens blokkeren.
- [ ] Acceptatie: zoeken in de gamemap vindt geen import uit `app/contexts`, `app/routes` of concrete storage-infrastructure.
- [ ] Verificatie: gamecontracttest, smokeflow en architectuurcheck zijn groen.
- [ ] **Kwaliteitscontrole:** toets state-eigenaarschap, hooks, imports en tests aan `docs/code-quality-and-architecture.md`.

### IMP-B07 — Generieke gamecontracttest afdwingen

- [ ] **IMP-B07 afgerond**

Afhankelijkheden: IMP-B02 tot en met IMP-B06.

Doel: iedere huidige en toekomstige game automatisch aan hetzelfde hostcontract toetsen.

- [ ] Maak een herbruikbare contracttestsuite die registryentries als testcases ontvangt.
- [ ] Controleer manifest-schema, idgelijkheid, loaderexport en mount met fake runtime.
- [ ] Controleer dat complete/exit maximaal één keer worden aangeroepen.
- [ ] Controleer gedrag bij ontbrekende optionele en vereiste capabilities.
- [ ] Controleer dat gedeclareerde offlineassets na build bestaan zodra de assetpipeline beschikbaar is; markeer dit deel tot groep E als expliciete pending subtest.
- [ ] Voeg de suite aan CI toe.
- [ ] Acceptatie: een ongeldige tijdelijke registryentry faalt met een duidelijke contractmelding.
- [ ] Verificatie: alle echte registryentries slagen.
- [ ] **Kwaliteitscontrole:** toets contracttests en testfakes aan `docs/code-quality-and-architecture.md`.

---

## Groep C — Opslag, schema's en migraties

Deze groep vervangt verspreide browseropslag zonder bestaande gebruikersdata stil te verliezen.

### IMP-C01 — Alle persistente keys en payloads inventariseren

- [ ] **IMP-C01 afgerond**

Afhankelijkheden: groep A.

Doel: vóór migratie exact weten welke data bestaat en wie eigenaar is.

- [ ] Inventariseer iedere `localStorage`- en `sessionStorage`-key, payloadvorm, reader, writer en deletepad.
- [ ] Neem profielen, current profile, globale mute, settings, wereldselectie, rewards, progressie, voice privacy, zone devtools en reward result op.
- [ ] Classificeer data als duurzaam domeinrecord, sessiestate, ontwikkeltoolconfiguratie of niet-kritieke bootvoorkeur.
- [ ] Leg voorbeeldfixtures vast zonder echte persoonsgegevens.
- [ ] Bepaal per key doelrepository, migratiepad, retentie en verwijdergedrag.
- [ ] Acceptatie: geen directe opslagcall in `src` ontbreekt in de inventaris.
- [ ] Verificatie: vergelijk inventaris met `rg "localStorage|sessionStorage|indexedDB" src`.
- [ ] **Kwaliteitscontrole:** toets dataminimalisatie, privacy en eigenaarschap aan `docs/code-quality-and-architecture.md`.

### IMP-C02 — Runtime-schema's en databaseversie ontwerpen

- [ ] **IMP-C02 afgerond**

Afhankelijkheden: IMP-C01 en IMP-B01.

Doel: valideerbare records en een expliciet evolutiepad definiëren.

- [ ] Definieer Zod-schema's voor profile, settings, session, practice event envelope en progress projection.
- [ ] Modelleer oude payloadschema's alleen voor migratieparsers.
- [ ] Definieer eerste Dexie-databaseversie en indexen op daadwerkelijke querypatronen.
- [ ] Documenteer UTC-tijden, ids, contractversies en onbekende-veldenbeleid.
- [ ] Maak schemafixtures voor geldig, gedeeltelijk oud, corrupt en toekomstig/onbekend materiaal.
- [ ] Schrijf ADR voor IndexedDB/Dexie, migratiebeleid en `localStorage`-uitzonderingen.
- [ ] Acceptatie: alle persistente types komen uit schemas of zijn aantoonbaar daarvan afgeleid.
- [ ] Verificatie: schematests accepteren geldige fixtures en weigeren corrupte data met benoemde fouten.
- [ ] **Kwaliteitscontrole:** toets schemas, dependencykeuze en migratiebeleid aan `docs/code-quality-and-architecture.md`.

### IMP-C03 — Dexie-adapter en repositories implementeren

- [ ] **IMP-C03 afgerond**

Afhankelijkheden: IMP-C02.

Doel: één testbare toegangspoort voor duurzame gestructureerde data bouwen.

- [ ] Implementeer databasebootstrap met expliciete `opening`, `ready`, `migration-failed` en `unavailable` states.
- [ ] Implementeer `ProfileRepository`, `SettingsRepository`, `SessionRepository` en `PracticeRepository` interfaces.
- [ ] Vertaal Dexie/DOMException-fouten naar benoemde application-errors.
- [ ] Voeg transactionele cascade delete toe.
- [ ] Voeg in-memory testrepositories toe die hetzelfde contract implementeren.
- [ ] Exporteer geen Dexie-instance naar UI of games.
- [ ] Acceptatie: repositories werken in integratietests zonder dat consumers Dexie kennen.
- [ ] Verificatie: CRUD-, duplicate-, transaction rollback-, quota-/unavailable- en cascade-tests zijn groen.
- [ ] **Kwaliteitscontrole:** toets transacties, fouten, exports en testisolatie aan `docs/code-quality-and-architecture.md`.

### IMP-C04 — Eenmalige idempotente importmigratie bouwen

- [ ] **IMP-C04 afgerond**

Afhankelijkheden: IMP-C01 tot en met IMP-C03.

Doel: bestaande browserdata veilig naar repositories overzetten.

- [ ] Lees oude keys read-only en parseer ze met hun versie-/legacy-schema.
- [ ] Migreer in een transactie of per duidelijk herstelbare batch.
- [ ] Schrijf migratiestatus en bronfingerprint zodat herhalen geen duplicaten maakt.
- [ ] Behoud oude keys gedurende minimaal één stabiele release als read-only rollbackbron.
- [ ] Overschrijf corrupte data niet met lege defaults; bied diagnose/export/reset.
- [ ] Test iedere fixture uit IMP-C01, inclusief gedeeltelijke migratie en tweede run.
- [ ] Acceptatie: geldige oude data blijft semantisch gelijk en een tweede migratie verandert niets.
- [ ] Verificatie: fixturevergelijking vóór/na plus transaction rollbacktest.
- [ ] **Kwaliteitscontrole:** toets dataveiligheid, fout-UX, privacy en rollback aan `docs/code-quality-and-architecture.md`.

### IMP-C05 — Profielen en settings omschakelen naar repositories

- [ ] **IMP-C05 afgerond**

Afhankelijkheden: IMP-C03 en IMP-C04.

Doel: de monolithische context reduceren tot kleine feature-API's boven repositories.

- [ ] Splits actief profiel-id van profielenlijst en settingsqueries.
- [ ] Gebruik functionele updates of application-use-cases; vermijd closures over verouderde profielarrays.
- [ ] Modelleer boot/loading/error/empty expliciet.
- [ ] Laat create/update/delete via repositories lopen.
- [ ] Behoud een kleine context alleen voor laagfrequente shellidentity indien nodig.
- [ ] Voeg component-/integratietests toe voor create, select, reload, update en delete.
- [ ] Acceptatie: `ProfileContext` schrijft geen volledige arrays meer naar `localStorage` en gameprogressie zit niet in de profielwriter.
- [ ] Verificatie: profiel-E2E plus repositorytests zijn groen.
- [ ] **Kwaliteitscontrole:** toets statelevensduur, effects, foutstates en accessibility aan `docs/code-quality-and-architecture.md`.

### IMP-C06 — Game-instellingen, rewards en wereldselectie migreren

- [ ] **IMP-C06 afgerond**

Afhankelijkheden: IMP-C03 tot en met IMP-C05 en IMP-B06.

Doel: directe gameopslag vervangen zonder game-platformgrenzen te doorbreken.

- [ ] Bepaal welke instellingen platformbreed en welke game-specifiek zijn.
- [ ] Maak capabilitygerichte runtime-/applicationpoorten voor settings, rewards en wereldselectie waar duurzaamheid nodig is.
- [ ] Migreer bestaande keys via IMP-C04-mechanisme.
- [ ] Houd vluchtige rewardresultaten in sessiestate; persisteer alleen wanneer reloadherstel een expliciete requirement is.
- [ ] Houd zone-devtoolsoverdride als development-only data buiten kindprofielanalytics.
- [ ] Verwijder directe `localStorage`/`sessionStorage`-calls uit de game.
- [ ] Acceptatie: de gamemap benadert geen browseropslag rechtstreeks.
- [ ] Verificatie: search, architectuurcheck en reloadtests voor settings/rewards/world zijn groen.
- [ ] **Kwaliteitscontrole:** toets data-eigenaarschap, privacy, storage en imports aan `docs/code-quality-and-architecture.md`.

### IMP-C07 — Opslagfouten en tijdelijke modus productwaardig maken

- [ ] **IMP-C07 afgerond**

Afhankelijkheden: IMP-C03 tot en met IMP-C06.

Doel: quota, private browsing, corruptie en migratiefouten herstelbaar maken.

- [ ] Bouw shell-UI voor storage unavailable, quota exceeded en migration failed.
- [ ] Geef concrete acties: retry, diagnose-export, opslagbeheer of expliciete tijdelijke modus.
- [ ] Toon permanent en begrijpelijk wanneer voortgang in tijdelijke modus niet wordt bewaard.
- [ ] Buffer alleen een begrensd aantal sessie-events in geheugen en meld write failure.
- [ ] Voeg fake storage failures toe aan component- en Playwright-tests.
- [ ] Acceptatie: geen opslagfout resulteert in een blanco scherm of stil dataverlies.
- [ ] Verificatie: geautomatiseerde quota-, denial- en corruptiescenario's zijn groen.
- [ ] **Kwaliteitscontrole:** toets foutmeldingen, toegankelijkheid, privacy en recovery aan `docs/code-quality-and-architecture.md`.

---

## Groep D — Oefenevents, sessies en voortgangsprojecties

Deze groep vereist inhoudelijke afstemming: software mag de pedagogische betekenis niet zelfstandig verzinnen.

### IMP-D01 — Pedagogisch datacontract vaststellen

- [ ] **IMP-D01 afgerond**

Afhankelijkheden: IMP-C02 en een aangewezen inhoudelijk eigenaar.

Doel: eenduidig bepalen welke feiten games rapporteren en hoe voortgang wordt geïnterpreteerd.

- [ ] Definieer `PracticeEventV1` met outcome, attempt, assistance, response time, skill ids en content version.
- [ ] Definieer wat een task, skill, attempt, replay, visual hint en spoken help precies betekent.
- [ ] Leg expliciet vast welke data niet wordt opgeslagen: naam, avatar, ruwe audio en transcript.
- [ ] Definieer projectorvoorbeelden met verwachte status voor representatieve eventreeksen.
- [ ] Laat inhoudelijk/pedagogisch eigenaar de voorbeelden en terminologie goedkeuren.
- [ ] Schrijf ADR voor eventcontract, projectorverantwoordelijkheid en retentie.
- [ ] Acceptatie: twee games kunnen hetzelfde event invullen zonder gamespecifieke masterylabels.
- [ ] Verificatie: schema- en fixturetests zijn groen en goedkeuring is gedocumenteerd.
- [ ] **Kwaliteitscontrole:** toets contract, privacy, versiebeheer en documentatie aan `docs/code-quality-and-architecture.md`.

### IMP-D02 — Sessie- en eventwriter implementeren

- [ ] **IMP-D02 afgerond**

Afhankelijkheden: IMP-D01, IMP-C03 en IMP-B04.

Doel: lifecycle en oefenobservaties betrouwbaar en idempotent opslaan.

- [ ] Laat `GameHost` sessies starten met `startedAt`, game/profile/content version.
- [ ] Implementeer status `started`, `completed`, `abandoned` en `crashed`.
- [ ] Implementeer een runtime eventwriter die ids/tijd injecteert, valideert en idempotent append uitvoert.
- [ ] Sluit open sessies gecontroleerd bij exit en runtimecrash.
- [ ] Definieer herstelbeleid voor een sessie die bij appstart nog `started` is.
- [ ] Log alleen privacyveilige technische context.
- [ ] Acceptatie: duplicate events verhogen geen telling en iedere game-run heeft maximaal één eindstatus.
- [ ] Verificatie: repository-, lifecycle- en crashtests zijn groen.
- [ ] **Kwaliteitscontrole:** toets transactions, ids, errors, logging en privacy aan `docs/code-quality-and-architecture.md`.

### IMP-D03 — Versieerbare voortgangsprojector bouwen

- [ ] **IMP-D03 afgerond**

Afhankelijkheden: IMP-D01 en IMP-D02.

Doel: snelle, uitlegbare dashboardwaarden uit events afleiden.

- [ ] Implementeer een pure projector op basis van de goedgekeurde fixtures.
- [ ] Sla `projectorVersion`, `calculatedAt` en bronselectie op in de projectie.
- [ ] Maak volledige rebuild en gerichte incremental update mogelijk.
- [ ] Markeer projectie dirty of update transactioneel bij nieuwe events.
- [ ] Behandel wijziging van projectorversie zonder events te muteren.
- [ ] Voeg tests toe voor volgorde, duplicates, hulp, incorrect/skipped en tijdsvenster.
- [ ] Acceptatie: alle projecties kunnen na verwijderen volledig identiek worden herbouwd.
- [ ] Verificatie: rebuildvergelijking en minimaal 90% branch coverage voor de kernprojector.
- [ ] **Kwaliteitscontrole:** toets pure logica, coverage, versiebeheer en uitlegbaarheid aan `docs/code-quality-and-architecture.md`.

### IMP-D04 — Scene Builder naar PracticeEventV1 migreren

- [ ] **IMP-D04 afgerond**

Afhankelijkheden: IMP-D02, IMP-D03 en IMP-B06.

Doel: één verticale gameflow volledig via het nieuwe contract laten werken.

- [ ] Map bestaande scene builderresultaten naar neutrale outcomes en assistance.
- [ ] Verwijder directe eventwrites uit UI/hooks; dispatch via application/controller naar runtimewriter.
- [ ] Geef task-, skill- en contentversion stabiel door.
- [ ] Vergelijk nieuwe projectie-uitkomsten met goedgekeurde verwachtingen.
- [ ] Houd tijdelijk dual-readvergelijking toegestaan, maar nooit twee authoritative writers.
- [ ] Voeg unit-, integratie- en E2E-tests toe voor correct, hint, repeat, incorrect en exit.
- [ ] Acceptatie: scene builder schrijft uitsluitend schema-geldige V1-events en dashboardprojectie wordt bijgewerkt.
- [ ] Verificatie: eventfixtures, projector en scene-builder-E2E zijn groen.
- [ ] **Kwaliteitscontrole:** toets controllergrens, events, tests en privacy aan `docs/code-quality-and-architecture.md`.

### IMP-D05 — Word Choice en Voice Side Scroller migreren

- [ ] **IMP-D05 afgerond**

Afhankelijkheden: IMP-D04.

Doel: alle bestaande spelmodi hetzelfde event- en sessiecontract laten gebruiken.

- [ ] Definieer per modus task/skill/outcome/assistance mapping zonder nieuw masterylabel.
- [ ] Migreer Word Choice eerst en vergelijk projecties.
- [ ] Migreer Voice Side Scroller met expliciete privacygrens: geen transcript/audio in events of logs.
- [ ] Test speech unavailable en permission denied als normale fallbackflow.
- [ ] Verwijder oude game-specifieke eventwriters wanneer alle readers zijn omgezet.
- [ ] Acceptatie: alle modi gebruiken dezelfde runtimewriter en oude progressieopslag krijgt geen nieuwe writes.
- [ ] Verificatie: modusgerichte tests plus volledige game-smoke zijn groen.
- [ ] **Kwaliteitscontrole:** toets speechprivacy, fallback, events en cleanup aan `docs/code-quality-and-architecture.md`.

### IMP-D06 — Dashboard op projecties aansluiten

- [ ] **IMP-D06 afgerond**

Afhankelijkheden: IMP-D03 tot en met IMP-D05.

Doel: demo-/gemuteerde profielprogressie vervangen door herleidbare projecties.

- [ ] Maak featurequeryhooks boven de projectierepository.
- [ ] Modelleer loading, geen oefeningen, gedeeltelijke data, projector rebuild en fout.
- [ ] Toon in begrijpelijke taal waarop een status is gebaseerd zonder diagnose over het kind te suggereren.
- [ ] Laat filters/periodes events/projecties consistent selecteren.
- [ ] Verwijder oude statische/demo progressiedata pas na paritycontrole.
- [ ] Voeg component- en E2E-test toe van oefening naar zichtbaar dashboardresultaat.
- [ ] Acceptatie: ieder zichtbaar getal/status is herleidbaar tot events en projectorversie.
- [ ] Verificatie: fixturedashboard en end-to-endflow zijn groen.
- [ ] **Kwaliteitscontrole:** toets query-state, accessibility, pedagogische taal en data-eigenaarschap aan `docs/code-quality-and-architecture.md`.

### IMP-D07 — Export, retentie en complete profielverwijdering implementeren

- [ ] **IMP-D07 afgerond**

Afhankelijkheden: IMP-C07 en IMP-D06.

Doel: beheer van kinddata volledig, uitlegbaar en testbaar maken.

- [ ] Definieer bewaartermijn voor ruwe events en voorwaarden voor compactie/verwijdering.
- [ ] Bouw een begeleidersflow voor privacyveilige data-export.
- [ ] Scheid een technische diagnose-export van een inhoudelijke voortgangsexport.
- [ ] Laat profieldelete alle settings, sessies, events, projecties en gamegebonden records transactioneel verwijderen.
- [ ] Verwijder of anonimiseer lokale diagnosebuffers die aan het profiel gekoppeld zijn.
- [ ] Voeg een E2E-test toe die na delete alle repositories controleert.
- [ ] Acceptatie: er blijven geen aan het profiel herleidbare lokale records achter.
- [ ] Verificatie: cascade-, export-schema- en retentietests zijn groen.
- [ ] **Kwaliteitscontrole:** toets privacy, destructive UX, transacties en accessibility aan `docs/code-quality-and-architecture.md`.

---

## Groep E — PWA, assets, offlinepakketten en performance

Offlinebetrouwbaarheid wordt hier een aantoonbare producttoestand in plaats van alleen een geregistreerde service worker.

### IMP-E01 — Build-gegenereerde Workbox-service worker invoeren

- [ ] **IMP-E01 afgerond**

Afhankelijkheden: groep A en IMP-B05.

Doel: handmatige cacheversies vervangen door buildgebonden revisies en expliciete strategieën.

- [ ] Kies een onderhouden Vite/Workbox-integratie en leg de keuze vast in een ADR.
- [ ] Precache alleen app-shell en essentiële gehashte assets.
- [ ] Configureer navigatiefallback zonder API/externe requests verkeerd te onderscheppen.
- [ ] Definieer runtimecaches afzonderlijk voor chunks, kleine beelden/fonts en media.
- [ ] Beperk cache-origin, entries, leeftijd en foutgedrag.
- [ ] Verwijder de oude handgeschreven worker pas nadat parity- en upgradetests slagen.
- [ ] Acceptatie: een nieuwe build reviseert gewijzigde assets en ruimt oude precacheitems gecontroleerd op.
- [ ] Verificatie: productiebuildtest online, offline en update van versie N naar N+1.
- [ ] **Kwaliteitscontrole:** toets caching, dependencies, security en recovery aan `docs/code-quality-and-architecture.md`.

### IMP-E02 — Gegenereerd assetmanifest bouwen

- [ ] **IMP-E02 afgerond**

Afhankelijkheden: IMP-E01.

Doel: handgeschreven URL-lijsten vervangen door controleerbare assetmetadata.

- [ ] Maak een buildscript dat per game/world URL, hash, MIME-type, bytes, optional/required en bron/licentie vastlegt.
- [ ] Laat build falen op ontbrekende verplichte bestanden en duplicate ids.
- [ ] Rapporteer orphan assets zonder ze direct automatisch te verwijderen.
- [ ] Houd manifesten licht en voorkom dat catalogusimport alle media in de entrychunk trekt.
- [ ] Koppel contentversion aan de gebruikte assetset.
- [ ] Voeg fixture-/snapshottest toe voor de manifeststructuur, niet voor willekeurige gehashte output.
- [ ] Acceptatie: iedere vereiste runtimeasset is vanuit een manifest herleidbaar en bestaat na build.
- [ ] Verificatie: manifestcheck, broken-assetproef en bundlegraph zijn groen.
- [ ] **Kwaliteitscontrole:** toets buildcode, assetlicenties, imports en budgets aan `docs/code-quality-and-architecture.md`.

### IMP-E03 — Offlinepakketmanager per gamewereld implementeren

- [ ] **IMP-E03 afgerond**

Afhankelijkheden: IMP-E01 en IMP-E02.

Doel: alleen volledig geverifieerde werelden als offline beschikbaar tonen.

- [ ] Definieer states `not-downloaded`, `estimating`, `downloading`, `verifying`, `ready`, `partial`, `failed` en `outdated`.
- [ ] Toon totale bytes vóór download en vraag bevestiging boven de productgrens.
- [ ] Gebruik `navigator.storage.estimate()` alleen als schatting en behandel unsupported.
- [ ] Ondersteun voortgang, annuleren, partial cleanup, retry en expliciet pakket verwijderen.
- [ ] Markeer `ready` pas na verificatie van alle required assets.
- [ ] Implementeer begrensde LRU/versiecleanup zonder actief pakket midden in sessie te verwijderen.
- [ ] Acceptatie: een onderbroken of quota-gefaalde download wordt nooit ready.
- [ ] Verificatie: fake cache/quota-tests en offline Playwrightflow zijn groen.
- [ ] **Kwaliteitscontrole:** toets state-machine, storage, fout-UX en accessibility aan `docs/code-quality-and-architecture.md`.

### IMP-E04 — Service-workerupdate veilig maken tijdens gamesessies

- [ ] **IMP-E04 afgerond**

Afhankelijkheden: IMP-E01, IMP-E03 en IMP-D02.

Doel: nieuwe releases activeren zonder actieve sessies of chunks te breken.

- [ ] Detecteer waiting/updated worker en publiceer status via een kleine PWA-adapter.
- [ ] Toon updateprompt buiten actieve sessies.
- [ ] Stel activatie uit wanneer `GameHost` een actieve sessie heeft.
- [ ] Bied na safe exit “nu bijwerken” en herstel bij mislukte chunkimport.
- [ ] Zorg dat oude actieve releaseassets niet voortijdig worden verwijderd.
- [ ] Test N-naar-N+1 met een gesimuleerde actieve game.
- [ ] Acceptatie: update veroorzaakt geen blanco scherm of verloren sessie.
- [ ] Verificatie: productie-E2E voor waiting, postpone, exit en activate.
- [ ] **Kwaliteitscontrole:** toets lifecycle, recovery, logging en accessibility aan `docs/code-quality-and-architecture.md`.

### IMP-E05 — Assets optimaliseren en lazy consumptie invoeren

- [ ] **IMP-E05 afgerond**

Afhankelijkheden: IMP-E02 en baseline IMP-A01.

Doel: start- en offlinepakketgrootte meetbaar reduceren zonder kwaliteit of compatibiliteit te breken.

- [ ] Gebruik bundle-/assetrapport om de grootste werkelijke winst te prioriteren.
- [ ] Maak passende WebP/AVIF- of andere varianten met noodzakelijke fallback.
- [ ] Optimaliseer videoresolutie, bitrate en codec op doeldevices.
- [ ] Laad media per actieve wereld/modus en preload standaard alleen metadata/poster.
- [ ] Verwijder bewezen duplicate/orphan assets na visuele en licentiecontrole.
- [ ] Vergelijk beeld-/audiokwaliteit op referentietablet, niet alleen bytegrootte.
- [ ] Acceptatie: meetrapport toont winst per wijziging en geen kernflow laadt alle gamemedia bij boot.
- [ ] Verificatie: bundle diff, netwerkprofiel, visuele/media QA en bestaande E2E zijn groen.
- [ ] **Kwaliteitscontrole:** toets performance, accessibilityalternatieven, licenties en maintainability aan `docs/code-quality-and-architecture.md`.

### IMP-E06 — Performancebudgetten blokkerend maken

- [ ] **IMP-E06 afgerond**

Afhankelijkheden: IMP-B05 en IMP-E05.

Doel: voorkomen dat shell, gamechunks en offlinepakketten ongemerkt opnieuw groeien.

- [ ] Meet shell-JS/CSS los van lazy gamechunks.
- [ ] Implementeer CI-grenzen uit hoofdstuk 12 van het kwaliteitsdocument.
- [ ] Rapporteer diff ten opzichte van main en absolute grootte.
- [ ] Vereis ADR/expliciete goedkeuring voor gemotiveerde overschrijding.
- [ ] Voeg minimaal één interactiemeting of long-taskcheck toe op referentieprofiel.
- [ ] Archiveer rapporten als CI-artifact of PR-samenvatting.
- [ ] Acceptatie: een bewust te groot testchunk blokkeert CI met een begrijpelijke melding.
- [ ] Verificatie: budgettest groen op actuele build en rood op gecontroleerde overschrijding.
- [ ] **Kwaliteitscontrole:** toets gekozen grenzen, meetmethode en uitzonderingen aan `docs/code-quality-and-architecture.md`.

---

## Groep F — Toegankelijkheid en gedeelde UI

### IMP-F01 — Gedeelde primitives en kernschermen auditen

- [ ] **IMP-F01 afgerond**

Afhankelijkheden: groep A.

Doel: semantiek en interactiegedrag consistent maken zonder een extra designsysteem in te voeren.

- [ ] Inventariseer gebruikte platformprimitives en ongebruikte Radix/MUI/shadcn-componenten.
- [ ] Controleer button semantics, toegankelijke naam, disabled/focus/pressed states en 48×48 touchdoelen.
- [ ] Controleer terug, pauze, audio, hint, voortgang en exit op consistente betekenis.
- [ ] Respecteer `prefers-reduced-motion` in gedeelde animaties.
- [ ] Voeg gedrags- en axe-tests toe aan de meest gebruikte primitives.
- [ ] Verwijder geen component uitsluitend omdat hij nu ongebruikt lijkt zonder Knip/buildcontrole.
- [ ] Acceptatie: kernprimitives hebben gedocumenteerd interactiecontract en tests.
- [ ] Verificatie: Testing Library, axe en handmatige toetsenbordcontrole zijn groen.
- [ ] **Kwaliteitscontrole:** toets UI-librarykeuze, semantics, tests en touchvereisten aan `docs/code-quality-and-architecture.md`.

### IMP-F02 — Niet-spraak- en niet-dragalternatieven voltooien

- [ ] **IMP-F02 afgerond**

Afhankelijkheden: IMP-B06 en IMP-F01.

Doel: kernflows bruikbaar houden zonder microfoon, audio, hover of precieze drag.

- [ ] Inventariseer iedere actie die alleen via speech of drag kan.
- [ ] Bied voor speech een visuele/tapbediening met dezelfde pedagogische uitkomst.
- [ ] Bied voor drag waar nodig selecteer-en-plaats of toetsenbordbediening.
- [ ] Maak permission denied een normale capabilitytoestand, geen technische fout.
- [ ] Zorg dat audio-instructies visueel/tekstueel beschikbaar zijn.
- [ ] Voeg E2E toe met geweigerde microfoon en toetsenbord-only kernflow.
- [ ] Acceptatie: een kind kan de kernopdracht zonder microfoon en zonder precieze drag voltooien.
- [ ] Verificatie: Chromium/WebKit tests en handmatige touch-/toetsenbordtest zijn groen.
- [ ] **Kwaliteitscontrole:** toets gelijkwaardigheid, privacy, focus en feedback aan `docs/code-quality-and-architecture.md`.

### IMP-F03 — Volledige accessibility-releasecontrole opzetten

- [ ] **IMP-F03 afgerond**

Afhankelijkheden: IMP-F01 en IMP-F02.

Doel: geautomatiseerde signalering combineren met menselijke controles.

- [ ] Voeg `@axe-core/playwright` toe aan welcome, profiel, catalogus, gamehost, settings en progressie.
- [ ] Documenteer handmatige checklist voor toetsenbord, screenreader, contrast, zoom, reduced motion, portrait/landscape en touch.
- [ ] Selecteer doel-screenreaders/browsers voor releasecontrole.
- [ ] Registreer bekende false positives zeer specifiek met reden en eigenaar.
- [ ] Laat kritieke automatische overtredingen CI blokkeren.
- [ ] Bewaar releasecheckresultaat bij release-notes of QA-artifact.
- [ ] Acceptatie: zowel automatische als handmatige controle hebben eigenaar en herhaalbare stappen.
- [ ] Verificatie: voer één volledige audit uit en registreer/herstel bevindingen.
- [ ] **Kwaliteitscontrole:** toets dekking, uitzonderingen en documentatie aan `docs/code-quality-and-architecture.md`.

---

## Groep G — Debugging, diagnostiek en observability

### IMP-G01 — Centrale privacyveilige diagnostieklogger bouwen

- [ ] **IMP-G01 afgerond**

Afhankelijkheden: IMP-B01 en groep A.

Doel: lege catches en losse consolelogs vervangen door gestructureerde, testbare events.

- [ ] Definieer `DiagnosticEvent` met allowlisted contextvelden.
- [ ] Implementeer development consoleadapter, begrensde ringbuffer en testcollector.
- [ ] Geef subsystem, eventnaam, severity, release en correlation-id mee.
- [ ] Voeg scrubbing/validatie toe die verboden profiel-, transcript- en contentvelden weigert.
- [ ] Migreer eerst storage-, gamehost-, speech- en service-workerfouten.
- [ ] Verwijder lege catch-blokken of maak herstelgedrag expliciet.
- [ ] Acceptatie: een onverwachte gamefout is via correlation-id in boundary en ringbuffer terug te vinden zonder kinddata.
- [ ] Verificatie: logcontract-, scrubbing- en boundarytests zijn groen.
- [ ] **Kwaliteitscontrole:** toets logs, privacy, foutafhandeling en dependencyrichting aan `docs/code-quality-and-architecture.md`.

### IMP-G02 — Development DiagnosticsPanel implementeren

- [ ] **IMP-G02 afgerond**

Afhankelijkheden: IMP-G01, IMP-C03 en IMP-E01.

Doel: problemen met game, storage, speech, media en PWA lokaal inspecteerbaar maken.

- [ ] Maak panel alleen beschikbaar in development of via een beveiligde begeleidersactie.
- [ ] Toon release/build, route, game/content version, geanonimiseerde sessie, capabilities, storage/db version, quota estimate, SW-status en offlinepakketstatus.
- [ ] Toon maximaal de laatste 100 veilige diagnostiekevents.
- [ ] Voeg gecontroleerde retry, cacheinspectie en gesaniteerde export toe.
- [ ] Toon nooit naam, transcript, raw answercontent of audio.
- [ ] Zorg dat panel toetsenbord- en screenreadertoegankelijk is en gameplay niet beïnvloedt wanneer gesloten.
- [ ] Acceptatie: een storage- en speechfout kan zonder DevTools worden geïdentificeerd.
- [ ] Verificatie: componenttests, privacytest en handmatige diagnoseproef zijn groen.
- [ ] **Kwaliteitscontrole:** toets toegang, privacy, accessibility en production stripping aan `docs/code-quality-and-architecture.md`.

### IMP-G03 — Reproduceerbare capability- en failurefakes voltooien

- [ ] **IMP-G03 afgerond**

Afhankelijkheden: IMP-B03, IMP-C07, IMP-E03 en IMP-G01.

Doel: tabletproblemen deterministisch lokaal en in CI reproduceren.

- [ ] Bouw scenariofakes voor clock, random seed, UUID, speechresultaat/time-out/denial, media completion/error, quota/corruptie, offline en SW-update.
- [ ] Gebruik één declaratief scenarioformaat voor tests en diagnose-replay waar praktisch.
- [ ] Zorg dat productiecode geen test-only imports bevat.
- [ ] Voeg regressiescenario's toe voor iedere eerder gevonden high-impact fout.
- [ ] Documenteer hoe een diagnose-export veilig naar een scenario wordt vertaald zonder kinddata.
- [ ] Acceptatie: kernfouten zijn reproduceerbaar zonder netwerk, microfoon of echte quota-uitputting.
- [ ] Verificatie: scenario-suite draait deterministisch meerdere keren in CI.
- [ ] **Kwaliteitscontrole:** toets testisolatie, privacy en modulegrenzen aan `docs/code-quality-and-architecture.md`.

### IMP-G04 — Besluit over externe foutmonitoring nemen

- [ ] **IMP-G04 afgerond**

Afhankelijkheden: IMP-G01 en IMP-G02.

Doel: bewust besluiten of Sentry/equivalent nodig en toegestaan is; installatie is geen automatisch resultaat.

- [ ] Beschrijf probleem, verwachte foutvolumes, offlinebeperkingen en waarde boven lokale diagnose.
- [ ] Voer privacy-, verwerkers-, bewaartermijn- en kostenbeoordeling uit.
- [ ] Leg toegestane events/tags en verboden velden vast.
- [ ] Houd session replay, DOM/inputcapture, transcript en raw content uit.
- [ ] Beschrijf source-mapupload, release-id, sampling, scrubbing en verwijderbeleid.
- [ ] Schrijf ADR met besluit `invoeren`, `uitstellen` of `afwijzen`.
- [ ] Indien ingevoerd: voeg integratie- en scrubbingtests toe vóór productieactivatie.
- [ ] Acceptatie: er bestaat een expliciet goedgekeurd besluit; geen SDK wordt “alvast” toegevoegd.
- [ ] Verificatie: ADR en eventuele privacy-/integratietests zijn gereviewd.
- [ ] **Kwaliteitscontrole:** toets besluit en eventuele implementatie aan security- en privacyhoofdstukken van `docs/code-quality-and-architecture.md`.

---

## Groep H — Tweede game, hardening en afronding

### IMP-H01 — Kleine tweede echte game via het contract toevoegen

- [ ] **IMP-H01 afgerond**

Afhankelijkheden: groepen B tot en met G voor de relevante capabilities.

Doel: aantonen dat de architectuur werkelijk uitbreidbaar is en geen één-gameabstractie bevat.

- [ ] Kies een klein maar echt leerdoel met inhoudelijk eigenaar.
- [ ] Maak manifest, contentversie, domainregels, UI en dynamische registryentry.
- [ ] Gebruik uitsluitend `GameRuntime` en publieke platform-UI/contracten.
- [ ] Voeg PracticeEventV1 mapping en projectietests toe.
- [ ] Definieer offlinepakket en accessibilityalternatieven.
- [ ] Laat generieke gamecontractsuite en kern-E2E slagen.
- [ ] Noteer waar het contract hielp, waar uitzonderingen nodig waren en welke duplicatie werkelijk gedeeld kan worden.
- [ ] Acceptatie: routes, profielrepository en projectorimplementatie hoeven buiten registry/config niet gamespecifiek te worden aangepast.
- [ ] Verificatie: volledige quality gate, gamecontract, offline- en accessibilityflow zijn groen.
- [ ] **Kwaliteitscontrole:** voer de volledige checklist uit `docs/code-quality-and-architecture.md` uit en voeg bewijs toe.

### IMP-H02 — Architectuur evalueren na de tweede game

- [ ] **IMP-H02 afgerond**

Afhankelijkheden: IMP-H01.

Doel: contracten aanpassen op bewijs in plaats van aannames.

- [ ] Vergelijk implementatietijd, boilerplate, uitzonderingen, bundle-impact en testcomplexiteit van beide games.
- [ ] Verwijder abstracties zonder duidelijke consumer of grenswaarde.
- [ ] Extraheer alleen gedrag dat beide games met dezelfde semantiek delen.
- [ ] Herzie `GameRuntime`, manifest en platform-UI via ADR bij breaking changes.
- [ ] Werk contracttests en migratiepad bij.
- [ ] Controleer of een state-machine- of storelibrary nog steeds niet nodig is; vereist meetbewijs bij wijziging.
- [ ] Acceptatie: de doelarchitectuur weerspiegelt twee echte games en open uitzonderingen zijn expliciet.
- [ ] Verificatie: bijgewerkte ADR's/docs en alle contracttests zijn groen.
- [ ] **Kwaliteitscontrole:** toets iedere behouden/nieuwe abstractie aan de toelatingsregels in `docs/code-quality-and-architecture.md`.

### IMP-H03 — Release- en incidentrunbooks schrijven

- [ ] **IMP-H03 afgerond**

Afhankelijkheden: IMP-E04, IMP-G02 en IMP-G03.

Doel: releases en productieproblemen zonder impliciete kennis kunnen uitvoeren.

- [ ] Schrijf releasecheck voor CI, migrations, bundlebudget, offlinepakket, SW-update, accessibility en browsermatrix.
- [ ] Schrijf runbooks voor storage migration failure, quota, corrupt profiel, ontbrekende media, speechproblemen, lazy chunk failure en foutieve SW-release.
- [ ] Neem diagnose-export, correlation-id, reproduceerscenario en rollbackstappen op.
- [ ] Beschrijf welke acties destructief zijn en welke begeleidersbevestiging vereisen.
- [ ] Test ieder high-impact runbook met een fake failure of tabletop-oefening.
- [ ] Acceptatie: een andere uitvoerder kan een gesimuleerd incident oplossen zonder mondelinge uitleg.
- [ ] Verificatie: noteer oefenresultaten en verbeterpunten.
- [ ] **Kwaliteitscontrole:** toets runbooks op privacy, security, rollback en actuele commando's aan `docs/code-quality-and-architecture.md`.

### IMP-H04 — Legacycode en tegenstrijdige documentatie opruimen

- [ ] **IMP-H04 afgerond**

Afhankelijkheden: alle voorgaande migratietaken voor het betreffende onderdeel.

Doel: tijdelijke readers, adapters, uitzonderingen en oude regels gecontroleerd verwijderen.

- [ ] Verwijder oude `localStorage` writers/readers nadat rollbackperiode en migratiebewijs zijn afgerond.
- [ ] Verwijder oude progressiemodellen en demo/projectiedata nadat dashboards volledig zijn omgezet.
- [ ] Verwijder tijdelijke Dependency Cruiser-/lintuitzonderingen.
- [ ] Verwijder ongebruikte packages, exports, assets en compatibiliteitsaliases met Knip- en buildbewijs.
- [ ] Werk `src/app/ARCHITECTURE.md`, `src/app/games/ARCHITECTURE.md`, README's en installatiehandleidingen bij naar de werkelijk geïmplementeerde architectuur.
- [ ] Archiveer vervangen documenten alleen wanneer historische waarde bestaat; laat geen twee normatieve standaarden bestaan.
- [ ] Acceptatie: searches vinden geen bekende legacykeys, verboden imports of ingetrokken kwaliteitsregels meer.
- [ ] Verificatie: volledige CI, Knip, dependencygraph, migratiefixtures en documentlinkcheck zijn groen.
- [ ] **Kwaliteitscontrole:** voer de volledige `docs/code-quality-and-architecture.md`-reviewchecklist uit en leg resterende schuld expliciet vast.

### IMP-H05 — Eindacceptatie van de architectuur uitvoeren

- [ ] **IMP-H05 afgerond**

Afhankelijkheden: IMP-H01 tot en met IMP-H04.

Doel: aantoonbaar beslissen of de architectuurdoelen zijn bereikt.

- [ ] Controleer ieder succescriterium uit hoofdstuk 1 van het voorstel.
- [ ] Voer volledige browser-, device-, offline-, accessibility- en privacycheck uit.
- [ ] Herbouw progressieprojecties uit events en vergelijk resultaten.
- [ ] Test profiel cascade delete en data-export opnieuw op productiebuild.
- [ ] Vergelijk performance- en assetmetingen met IMP-A01.
- [ ] Controleer dat tweede game zonder ongewenste app-shellwijzigingen is geïntegreerd.
- [ ] Maak lijst van resterende risico's, eigenaar en opvolgissue.
- [ ] Markeer relevante ADR's als accepted/superseded en het architectuurvoorstel als geïmplementeerd of gedeeltelijk geïmplementeerd.
- [ ] Acceptatie: er is onderbouwd bewijs per succescriterium, niet alleen een algemene verklaring.
- [ ] Verificatie: volledige releasepipeline en handmatige releasecheck zijn groen.
- [ ] **Kwaliteitscontrole:** voer de volledige standaard uit `docs/code-quality-and-architecture.md` uit; open afwijkingen verhinderen eindacceptatie tenzij formeel geaccepteerd.

---

# Voortgangsoverzicht

Werk dit overzicht bij wanneer een hoofdtaak wordt afgerond. De detailcheckboxes blijven de bron van waarheid.

| Groep | Onderwerp | Gereed | Totaal |
| --- | --- | ---: | ---: |
| A | Baseline en kwaliteitsstraat | 0 | 7 |
| B | Modulecontracten, GameHost en lazy loading | 0 | 7 |
| C | Opslag, schema's en migraties | 0 | 7 |
| D | Oefenevents, sessies en projecties | 0 | 7 |
| E | PWA, assets en performance | 0 | 6 |
| F | Toegankelijkheid en gedeelde UI | 0 | 3 |
| G | Debugging en observability | 0 | 4 |
| H | Tweede game en hardening | 0 | 5 |
| **Totaal** |  | **0** | **46** |

## Bewijsformat bij een afgeronde taak

Voeg direct onder de afgeronde taak of in het gekoppelde issue/PR minimaal toe:

```md
Bewijs:
- Gewijzigde bestanden: ...
- Uitgevoerde commando's: ...
- Resultaten/meting: ...
- Handmatige controle: ...
- ADR/documentatie: ...
- Kwaliteitscontrole: geslaagd / afwijking met issue en vervaldatum
```
