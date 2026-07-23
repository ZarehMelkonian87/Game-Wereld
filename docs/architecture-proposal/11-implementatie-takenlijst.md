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
8. Geef na afronding een Conventional Commit-bericht aan de gebruiker dat de werkelijke wijzigingen correct samenvat.
9. Voer zelf geen `git add`, `git commit` of `git push` uit; de gebruiker doet dit altijd zelf.
10. Vink de hoofdtaak pas af wanneer geen verplichte subtaak openstaat en het commitbericht is aangeleverd.

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

De checkbox **Commitbericht voor gebruiker** betekent dat de uitvoerende AI na verificatie een bericht oplevert in deze vorm:

```text
type(scope): korte beschrijving in gebiedende wijs

- belangrijkste inhoudelijke wijziging
- relevante test, migratie of kwaliteitsverbetering
```

Het type is bijvoorbeeld `feat`, `fix`, `refactor`, `test`, `docs`, `build`, `ci`, `perf` of `chore`. Het bericht wordt gebaseerd op de daadwerkelijke diff, niet alleen op de oorspronkelijke taakomschrijving. De AI toont het bericht aan de gebruiker maar voert de commit niet uit.

---

<details open>
<summary><strong>Groep A — Baseline en kwaliteitsstraat</strong></summary>

## Groep A — Baseline en kwaliteitsstraat

Deze groep blokkeert alle brede architectuurwijzigingen. Eerst moet de repository betrouwbaar kunnen aantonen of code correct is.

### IMP-A01 — Technische baseline vastleggen

- [x] **IMP-A01 afgerond**

Afhankelijkheden: geen.

Doel: een reproduceerbaar vertrekpunt vastleggen voor typefouten, bundles, assets, browserflows en ondersteunde omgevingen.

- [x] Leg de gebruikte Node- en npm-versie vast in `package.json` `engines` en/of een versieconfiguratie die CI en lokale ontwikkeling delen.
- [x] Voer `npm ci`, `npm run build` en `npx tsc --noEmit` uit en sla de samenvatting van resultaten op in `docs/architecture/baseline-2026-07.md` of een gelijkwaardige actuele baselinepagina.
- [x] Noteer de initiële JS- en CSS-gzipgrootte, totale `dist`-grootte, aantal media-assets en vijf grootste assets.
- [x] Leg de officieel ondersteunde browser-/devicematrix vast, met minimaal Chromium-tablet en iPad/Safari of WebKit als doel.
- [x] Beschrijf de handmatige happy path: profiel maken, game openen, één opdracht voltooien, voortgang bekijken.
- [x] Controleer dat gegenereerde buildbestanden niet onbedoeld als bronwijziging worden meegenomen.
- [x] Acceptatie: de baseline bevat exacte commando's, datum, omgeving en meetwaarden waarmee latere taken kunnen vergelijken.
- [x] Verificatie: een tweede uitvoerder kan de commando's volgen en dezelfde categorieën resultaten produceren.
- [x] **Kwaliteitscontrole:** toets de taak aan `docs/code-quality-and-architecture.md` en noteer bewijs of gemotiveerde tijdelijke afwijkingen.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

Bewijs: `.nvmrc`, `package.json` en [de baseline](../architecture/baseline-2026-07.md) leggen omgeving, commando's, bundelmetingen, assetinventaris, browsermatrix en handmatige happy path vast. `dist/` en rapportoutput blijven genegeerd.

### IMP-A02 — Kwaliteitsscripts en ontwikkeldependencies invoeren

- [x] **IMP-A02 afgerond**

Afhankelijkheden: IMP-A01.

Doel: de in de kwaliteitsstandaard genoemde lokale controles daadwerkelijk uitvoerbaar maken.

- [x] Voeg scripts toe voor `typecheck`, `lint`, `format:check`, `test`, `test:watch`, `test:architecture` en `check`.
- [x] Installeer compatibele versies van TypeScript-tooling, ESLint flat config, typescript-eslint, React Hooks-linting, jsx-a11y, Prettier en Vitest.
- [x] Configureer linting voor TypeScript/React zonder bestaande typefouten te maskeren.
- [x] Configureer testomgevingen bewust: Node voor pure logica en een DOM-omgeving alleen voor componenttests die dit nodig hebben.
- [x] Sluit gegenereerde output, distributie-assets en externe bronbestanden correct uit zonder `src` breed te negeren.
- [x] Voeg geen automatische formattering toe aan `check`; de check moet alleen rapporteren en een non-zero exitcode geven.
- [x] Acceptatie: ieder script bestaat, eindigt deterministisch en heeft een korte toelichting in README of ontwikkeldocumentatie.
- [x] Verificatie: voer ieder script afzonderlijk uit en noteer bestaande failures als input voor IMP-A03, niet als permanente ignore.
- [x] **Kwaliteitscontrole:** toets configuratie, dependencies en uitzonderingen aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

Bewijs: `package.json`, `eslint.config.mjs`, `.prettierrc.json`, `vitest.config.ts`, `test/setup.ts` en de README definiëren en verklaren de lokale kwaliteitsstraat. De negatieve probes in [het kwaliteitsstraatrapport](../architecture/quality-gate-report-2026-07.md) bewijzen non-zero exitcodes. Op 23 juli 2026 zijn daarnaast 308 bestaande functiedeclaraties naar arrow functions gemigreerd; ESLint blokkeert voortaan function declarations, function expressions, class methods en object-method syntax.

### IMP-A03 — Alle bestaande TypeScript-fouten herstellen

- [x] **IMP-A03 afgerond**

Afhankelijkheden: IMP-A02.

Doel: `tsc --noEmit` groen krijgen zonder asserts of ignores die echte contractfouten verbergen.

- [x] Groepeer de baselinefouten per oorzaak: ontbrekende types/exports, incompatibele refs, onjuiste events, ongebruikte code en verouderde controllercontracten.
- [x] Herstel eerst de brontypes in `strand-bezem-escape/types.ts` en progressiecontracten; vermijd lokale casts in consumers.
- [x] Breng `PracticeResult`-waarden en aangeroepen payloads tijdelijk consistent zonder vooruit te lopen op de nieuwe eventarchitectuur.
- [x] Herstel component-/hookcontracten rond scene builder en zone devtools.
- [x] Verwijder werkelijk ongebruikte imports en parameters; prefix alleen bewust vereiste ongebruikte callbackparameters volgens lintconfig.
- [x] Voeg regressietests toe voor fouten die gedragslogica raken.
- [x] Acceptatie: `npm run typecheck` slaagt zonder nieuwe `any`, `@ts-ignore` of brede uitschakeling van strict-regels.
- [x] Verificatie: `npm run typecheck`, `npm run build` en de relevante tests zijn groen.
- [x] **Kwaliteitscontrole:** controleer iedere reparatie tegen `docs/code-quality-and-architecture.md`, vooral type assertions, foutafhandeling en module-eigenaarschap.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

Bewijs: de 27 baselinefouten in types, refs, events, hooks en devtoolscontracten zijn bij de bron hersteld. `npm run typecheck`, relevante regressietests en `npm run build` zijn groen zonder `@ts-ignore` of nieuwe expliciete `any`.

### IMP-A04 — Eerste unit- en componenttestbasis toevoegen

- [x] **IMP-A04 afgerond**

Afhankelijkheden: IMP-A02 en bij voorkeur IMP-A03.

Doel: de belangrijkste bestaande pure regels en één Reactflow onder een snel testsysteem brengen.

- [x] Voeg testsetup en Testing Library toe voor Reactgedrag.
- [x] Test minimaal instruction randomization met vaste seed, spoken command parsing, rewards/progressieberekening en een geometrische plaatsingsregel.
- [x] Voeg één componenttest toe die gedrag via rol en toegankelijke naam controleert.
- [x] Gebruik geen snapshots als hoofdassertie voor gamegedrag.
- [x] Maak fake clock, idgenerator en storagehelpers alleen wanneer minimaal één test ze direct nodig heeft.
- [x] Configureer coverage-rapportage, maar blokkeer nog niet op een kunstmatig hoge globale grens.
- [x] Acceptatie: tests falen aantoonbaar wanneer de bijbehorende kernregel bewust wordt gebroken.
- [x] Verificatie: `npm run test` is groen en draait zonder afhankelijkheid van netwerk of bestaande browseropslag.
- [x] **Kwaliteitscontrole:** toets testgedrag, testisolatie en fake boundaries aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

Bewijs: vijf testbestanden dekken randomisatie, commandoparsing, rewards/progressie, scenegeometrie en toegankelijk knopgedrag. Vitest draait 11 tests zonder netwerk of bestaande opslag; V8-coveragerapportage is beschikbaar.

### IMP-A05 — Playwright-smoke en fouttraces invoeren

- [x] **IMP-A05 afgerond**

Afhankelijkheden: IMP-A01 en IMP-A02.

Doel: een echte browserflow en reproduceerbare foutinformatie beschikbaar maken.

- [x] Installeer en configureer Playwright met een productieachtige webserver.
- [x] Voeg `chromium-tablet` en `webkit-tablet` projecten toe met afgesproken viewports.
- [x] Automatiseer profiel aanmaken, herladen, game openen en veilig terugkeren.
- [x] Configureer trace `on-first-retry`, screenshot bij falen en een HTML-report.
- [x] Laat onverwachte console-errors een test falen; documenteer een minimale tijdelijke allowlist.
- [x] Voeg stabiele selectors toe via rollen/namen; gebruik `data-*` alleen als een betekenisvol testcontract ontbreekt.
- [x] Acceptatie: een geforceerde fout produceert een bruikbare trace met DOM-, console- en netwerkcontext.
- [x] Verificatie: de smoke slaagt lokaal in Chromium en WebKit.
- [x] **Kwaliteitscontrole:** controleer privacy van traces, accessibility van selectors en teststabiliteit tegen `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

Bewijs: `playwright.config.ts` en `e2e/critical-user-journey.spec.ts` voeren de kritieke route uit in Chromium-tablet en WebKit-tablet. Beide projecten zijn groen, console/page errors zijn blokkerend en axe controleert het welkomstscherm op WCAG 2.2 A/AA.

### IMP-A06 — CI-pipeline activeren

- [x] **IMP-A06 afgerond**

Afhankelijkheden: IMP-A02 tot en met IMP-A05.

Doel: dezelfde kwaliteitscontroles op iedere wijziging laten draaien.

- [x] Voeg een CI-workflow toe met `npm ci` en gepinde/ondersteunde Node-versie.
- [x] Draai format, lint, typecheck en unit tests vroeg en waar veilig parallel.
- [x] Start productiebuild pas nadat statische controles groen zijn.
- [x] Draai de snelle Chromium-smoke per pull request en WebKit volgens de afgesproken PR- of nightlymatrix.
- [x] Upload Playwrightreport/traces en coverage als tijdelijk artifact bij falen.
- [x] Gebruik dependencycache zonder `node_modules` als buildartifact te delen.
- [x] Beperk workflowpermissions tot wat nodig is.
- [x] Acceptatie: een bewuste typefout, lintfout en falende test blokkeren ieder afzonderlijk de pipeline.
- [x] Verificatie: documenteer links of screenshots van één succesvolle en één bewust falende proefrun.
- [x] **Kwaliteitscontrole:** toets CI, secrets, artifacts en privacy aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

Bewijs: `.github/workflows/quality.yml` gebruikt minimale read-permissions, npm-cache, parallelle statische/unitjobs, een afhankelijke build, Chromium op wijzigingen en WebKit op schedule/handmatig. Lokale groene en bewust falende proefruns staan in [het kwaliteitsstraatrapport](../architecture/quality-gate-report-2026-07.md); echte Actions-links volgen noodzakelijkerwijs pas na de commit en push door de gebruiker.

### IMP-A07 — Architectuurregels en dode-codecontrole invoeren

- [x] **IMP-A07 afgerond**

Afhankelijkheden: IMP-A03 en IMP-A06.

Doel: modulegrenzen automatisch bewaken en de brede ongebruikte dependencyset beheersen.

- [x] Installeer Dependency Cruiser en Knip.
- [x] Maak regels voor cycles, game-naar-game, game-naar-app/context/infrastructure, platform-naar-game en domain-naar-React/browser.
- [x] Definieer huidige transitiepaden expliciet; gebruik tijdelijke uitzonderingen met issue en verwijdercriterium.
- [x] Configureer Knip voor Vite, tests en entrypoints zodat dynamische registryimports niet als ongebruikt worden gezien.
- [x] Rapporteer eerst bestaande violations, herstel ze of leg korte aflopende uitzonderingen vast.
- [x] Verwijder bewezen ongebruikte dependencies zoals MUI/react-dnd alleen na Knip-, import- en buildcontrole.
- [x] Voeg `test:architecture` en een periodieke `check:dead-code` aan CI toe.
- [x] Acceptatie: een testimport van game naar `ProfileContext` of andere game laat de architectuurcheck bewust falen.
- [x] Verificatie: archiveer een kort dependencyrapport en de actuele uitzonderingenlijst.
- [x] **Kwaliteitscontrole:** toets regels, uitzonderingen en dependencywijzigingen aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

Bewijs: `dependency-cruiser.config.cjs`, `knip.json`, [de uitzonderingenlijst](../architecture/temporary-exceptions.md) en [het dependencyrapport](../architecture/quality-gate-report-2026-07.md) leggen regels en aflopende uitzonderingen vast. Een tijdelijke `ProfileContext`-import faalde aantoonbaar; elf ongebruikte runtimepackages en één ongebruikt componentbestand zijn verwijderd.

</details>

---

<details>
<summary><strong>Groep B — Modulecontracten, GameHost en lazy loading</strong></summary>

## Groep B — Modulecontracten, GameHost en lazy loading

Start deze groep pas wanneer groep A groen is. Het doel is echte afhankelijkheidsisolatie, niet alleen nieuwe mappen.

### IMP-B01 — Branded ids en gedeelde grenscontracten definiëren

- [x] **IMP-B01 afgerond**

Afhankelijkheden: IMP-A03 en IMP-A07.

Doel: verwisselbare strings en impliciete globale afhankelijkheden vervangen door smalle contracten.

- [x] Definieer branded types voor minimaal `GameId`, `ThemeId`, `ProfileId`, `SessionId`, `TaskId` en `EventId`.
- [x] Voeg grensconstructors/parsers toe die ongeldige lege ids weigeren.
- [x] Definieer `Clock`, `IdGenerator`, `DiagnosticLogger` en basisresultaten voor verwachte fouten.
- [x] Plaats contracten in een platformmap die geen concrete adapters importeert.
- [x] Migreer alleen de eerstvolgende consumers; voorkom een repo-brede cosmetische castoperatie.
- [x] Test constructors en exhaustieve foutpaden.
- [x] Acceptatie: twee verschillende idtypen kunnen niet zonder expliciete conversie worden verwisseld.
- [x] Verificatie: typecheck plus gerichte type-/unittests zijn groen.
- [x] **Kwaliteitscontrole:** controleer types, assertions en modulegrenzen tegen `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-B02 — GameManifest en catalogus als één bron van waarheid invoeren

- [x] **IMP-B02 afgerond**

Afhankelijkheden: IMP-B01.

Doel: duplicatie tussen `data/games.ts`, `games/registry.ts` en `game.config.ts` verwijderen.

- [x] Definieer het runtime-gevalideerde `GameManifest` volgens hoofdstuk 5.
- [x] Maak `strand-bezem-escape/manifest.ts` licht: geen zware component-, content- of assetimports.
- [x] Laat catalogus en routes dezelfde canonical `gameId` gebruiken.
- [x] Maak oude alias-id's expliciete redirects/migraties in plaats van meerdere registryentries met dezelfde component.
- [x] Modelleer `coming-soon` in het manifest zonder een niet-bestaande loader.
- [x] Voeg tests toe voor unieke ids, geldige theme-id, leeftijd, capabilities en release status.
- [x] Acceptatie: titel, beschrijving, categorie en capability bestaan op één plek en registry-key is gelijk aan manifest-id.
- [x] Verificatie: manifestcontracttest en bestaande catalogusflow zijn groen.
- [x] **Kwaliteitscontrole:** toets runtimevalidatie, contentdata en imports aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-B03 — GameRuntime-poorten definiëren

- [x] **IMP-B03 afgerond**

Afhankelijkheden: IMP-B01 en IMP-B02.

Doel: alle diensten die een game nodig heeft expliciet via de host leveren.

- [x] Definieer `GameRuntime` met identity, clock, ids, practice writer, media, speech, diagnostics en lifecycle.
- [x] Houd poorten capabilitygericht; exporteer geen `db`, router, context of leveranciers-SDK.
- [x] Definieer benoemde resultaten voor permission denied, unavailable, quota en recoverable mediafouten.
- [x] Bouw testfakes voor clock, ids, practice, media, speech en lifecyclecalls.
- [x] Documenteer welke runtimevelden stabiel contract zijn en welke alleen intern zijn.
- [x] Acceptatie: een game kan in een test mounten met uitsluitend een fake runtime en zonder globale providers.
- [x] Verificatie: contract- en typechecks tonen geen app-/infrastructureimport vanuit het contract.
- [x] **Kwaliteitscontrole:** toets de contractgrootte, privacyvelden en foutmodellen aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-B04 — GameHost met laad-, capability- en foutgrenzen bouwen

- [x] **IMP-B04 afgerond**

Afhankelijkheden: IMP-B03.

Doel: één eigenaar maken voor resolve, sessiestart, runtimeconstructie, laden, afsluiten en herstel.

- [x] Bouw `GameHost` dat routeparameters valideert en een registryentry resolveert.
- [x] Controleer vereiste capabilities vóór mount en bied gelijkwaardige fallback waar mogelijk.
- [x] Start en sluit een voorlopige sessie via een tijdelijke repository/fake totdat groep C gereed is.
- [x] Voeg afzonderlijke loading-, load-error- en runtime-errorinterfaces toe.
- [x] Zorg dat complete, exit en crash maximaal één keer de lifecycle afsluiten.
- [x] Geef terug naar catalogus, retry en app-update als concrete herstelacties.
- [x] Voeg route- en game-error boundaries toe met correlation-id.
- [x] Acceptatie: een renderfout in de game haalt de app-shell niet neer.
- [x] Verificatie: component-/integratietests dekken success, onbekende id, loader rejection, ontbrekende capability en runtimecrash.
- [x] **Kwaliteitscontrole:** toets boundaries, accessibility, logging en lifecycle aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-B05 — Registry en routes daadwerkelijk lazy maken

- [x] **IMP-B05 afgerond**

Afhankelijkheden: IMP-B02 en IMP-B04.

Doel: gamecode uit de initiële appchunk halen.

- [x] Vervang de statische gamecomponentimport door een statisch analyseerbare `import("./strand-bezem-escape")` loader.
- [x] Gebruik `Suspense` of route-lazy mechanismen met kindvriendelijke loading-UI.
- [x] Maak globale routes waar zinvol lazy zonder essentiële shellfeedback te verbergen.
- [x] Handel `vite:preloadError` of equivalente chunk-loadfout af via de load boundary.
- [x] Genereer een bundlevisualisatie vóór en na de wijziging.
- [x] Voeg een budgetcheck toe die de shell zonder gamecode bewaakt.
- [x] Acceptatie: het initiële entrypoint importeert de game-implementatie niet en er bestaat een aparte gamechunk.
- [x] Verificatie: vergelijk bundlegraph en netwerkrequests bij home versus game-open.
- [x] **Kwaliteitscontrole:** toets loading/error UX, budgets en imports aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-B06 — Strand Bezem Escape losmaken van globale appcontext

- [x] **IMP-B06 afgerond**

Afhankelijkheden: IMP-B03 tot en met IMP-B05.

Doel: de eerste game uitsluitend via props/runtime met de app laten communiceren.

- [x] Verwijder imports van `ProfileContext`, router en directe globale appstate uit de gamemodule.
- [x] Geef profile/session identity door via `GameRuntime`.
- [x] Routeer exit, complete, practice, media en speech via runtimepoorten.
- [x] Houd gamespecifieke state lokaal in controller/reducer.
- [x] Voeg een test toe die de game zonder `ProfileProvider` mount.
- [x] Laat Dependency Cruiser deze grens blokkeren.
- [x] Acceptatie: zoeken in de gamemap vindt geen import uit `app/contexts`, `app/routes` of concrete storage-infrastructure.
- [x] Verificatie: gamecontracttest, smokeflow en architectuurcheck zijn groen.
- [x] **Kwaliteitscontrole:** toets state-eigenaarschap, hooks, imports en tests aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-B07 — Generieke gamecontracttest afdwingen

- [x] **IMP-B07 afgerond**

Afhankelijkheden: IMP-B02 tot en met IMP-B06.

Doel: iedere huidige en toekomstige game automatisch aan hetzelfde hostcontract toetsen.

- [x] Maak een herbruikbare contracttestsuite die registryentries als testcases ontvangt.
- [x] Controleer manifest-schema, idgelijkheid, loaderexport en mount met fake runtime.
- [x] Controleer dat complete/exit maximaal één keer worden aangeroepen.
- [x] Controleer gedrag bij ontbrekende optionele en vereiste capabilities.
- [x] Controleer dat gedeclareerde offlineassets na build bestaan zodra de assetpipeline beschikbaar is; markeer dit deel tot groep E als expliciete pending subtest.
- [x] Voeg de suite aan CI toe.
- [x] Acceptatie: een ongeldige tijdelijke registryentry faalt met een duidelijke contractmelding.
- [x] Verificatie: alle echte registryentries slagen.
- [x] **Kwaliteitscontrole:** toets contracttests en testfakes aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### Uitvoerbewijs Groep B

- Contracten, runtimepoorten en de scheiding tussen stabiele API en interne adapters staan onder `src/app/game-platform`.
- De catalogus gebruikt één runtime-gevalideerd manifest per game, canonical ids en expliciete legacy-aliases.
- `GameHost` bezit resolutie, capabilitycontrole, sessielifecycle, lazy loading en herstelbare foutgrenzen.
- Strand Bezem Escape mount met alleen een fake runtime en gebruikt geen appcontext, router of rechtstreekse browseropslag-, media- of speechimplementatie.
- De productiebuild bevat een afzonderlijke gamechunk. De budgetcontrole meet 101,56 kB gzip voor de shell en 53,28 kB gzip voor de game-entry.
- De generieke contracttest heeft één expliciete `todo` voor offlineassetcontrole; deze wordt pas in Groep E activeerbaar.
- Formatting, lint, typecheck, 22 tests, architectuurcontrole, Knip, audit, productiebuild, bundelbudget en Chromium-/WebKit-E2E zijn groen.
- Gedetailleerd bewijs en ontwerpafwegingen: `docs/architecture/group-b-report-2026-07.md`.
- Commitbericht voor de volledige groep: `feat(architecture): introduce game runtime contracts and lazy GameHost`

</details>

---

<details>
<summary><strong>Groep C — Opslag, schema's en migraties</strong></summary>

## Groep C — Opslag, schema's en migraties

Deze groep vervangt verspreide browseropslag zonder bestaande gebruikersdata stil te verliezen.

### IMP-C01 — Alle persistente keys en payloads inventariseren

- [x] **IMP-C01 afgerond**

Afhankelijkheden: groep A.

Doel: vóór migratie exact weten welke data bestaat en wie eigenaar is.

- [x] Inventariseer iedere `localStorage`- en `sessionStorage`-key, payloadvorm, reader, writer en deletepad.
- [x] Neem profielen, current profile, globale mute, settings, wereldselectie, rewards, progressie, voice privacy, zone devtools en reward result op.
- [x] Classificeer data als duurzaam domeinrecord, sessiestate, ontwikkeltoolconfiguratie of niet-kritieke bootvoorkeur.
- [x] Leg voorbeeldfixtures vast zonder echte persoonsgegevens.
- [x] Bepaal per key doelrepository, migratiepad, retentie en verwijdergedrag.
- [x] Acceptatie: geen directe opslagcall in `src` ontbreekt in de inventaris.
- [x] Verificatie: vergelijk inventaris met `rg "localStorage|sessionStorage|indexedDB" src`.
- [x] **Kwaliteitscontrole:** toets dataminimalisatie, privacy en eigenaarschap aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-C02 — Runtime-schema's en databaseversie ontwerpen

- [x] **IMP-C02 afgerond**

Afhankelijkheden: IMP-C01 en IMP-B01.

Doel: valideerbare records en een expliciet evolutiepad definiëren.

- [x] Definieer Zod-schema's voor profile, settings, session, practice event envelope en progress projection.
- [x] Modelleer oude payloadschema's alleen voor migratieparsers.
- [x] Definieer eerste Dexie-databaseversie en indexen op daadwerkelijke querypatronen.
- [x] Documenteer UTC-tijden, ids, contractversies en onbekende-veldenbeleid.
- [x] Maak schemafixtures voor geldig, gedeeltelijk oud, corrupt en toekomstig/onbekend materiaal.
- [x] Schrijf ADR voor IndexedDB/Dexie, migratiebeleid en `localStorage`-uitzonderingen.
- [x] Acceptatie: alle persistente types komen uit schemas of zijn aantoonbaar daarvan afgeleid.
- [x] Verificatie: schematests accepteren geldige fixtures en weigeren corrupte data met benoemde fouten.
- [x] **Kwaliteitscontrole:** toets schemas, dependencykeuze en migratiebeleid aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-C03 — Dexie-adapter en repositories implementeren

- [x] **IMP-C03 afgerond**

Afhankelijkheden: IMP-C02.

Doel: één testbare toegangspoort voor duurzame gestructureerde data bouwen.

- [x] Implementeer databasebootstrap met expliciete `opening`, `ready`, `migration-failed` en `unavailable` states.
- [x] Implementeer `ProfileRepository`, `SettingsRepository`, `SessionRepository` en `PracticeRepository` interfaces.
- [x] Vertaal Dexie/DOMException-fouten naar benoemde application-errors.
- [x] Voeg transactionele cascade delete toe.
- [x] Voeg in-memory testrepositories toe die hetzelfde contract implementeren.
- [x] Exporteer geen Dexie-instance naar UI of games.
- [x] Acceptatie: repositories werken in integratietests zonder dat consumers Dexie kennen.
- [x] Verificatie: CRUD-, duplicate-, transaction rollback-, quota-/unavailable- en cascade-tests zijn groen.
- [x] **Kwaliteitscontrole:** toets transacties, fouten, exports en testisolatie aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-C04 — Eenmalige idempotente importmigratie bouwen

- [x] **IMP-C04 afgerond**

Afhankelijkheden: IMP-C01 tot en met IMP-C03.

Doel: bestaande browserdata veilig naar repositories overzetten.

- [x] Lees oude keys read-only en parseer ze met hun versie-/legacy-schema.
- [x] Migreer in een transactie of per duidelijk herstelbare batch.
- [x] Schrijf migratiestatus en bronfingerprint zodat herhalen geen duplicaten maakt.
- [x] Behoud oude keys gedurende minimaal één stabiele release als read-only rollbackbron.
- [x] Overschrijf corrupte data niet met lege defaults; bied diagnose/export/reset.
- [x] Test iedere fixture uit IMP-C01, inclusief gedeeltelijke migratie en tweede run.
- [x] Acceptatie: geldige oude data blijft semantisch gelijk en een tweede migratie verandert niets.
- [x] Verificatie: fixturevergelijking vóór/na plus transaction rollbacktest.
- [x] **Kwaliteitscontrole:** toets dataveiligheid, fout-UX, privacy en rollback aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-C05 — Profielen en settings omschakelen naar repositories

- [x] **IMP-C05 afgerond**

Afhankelijkheden: IMP-C03 en IMP-C04.

Doel: de monolithische context reduceren tot kleine feature-API's boven repositories.

- [x] Splits actief profiel-id van profielenlijst en settingsqueries.
- [x] Gebruik functionele updates of application-use-cases; vermijd closures over verouderde profielarrays.
- [x] Modelleer boot/loading/error/empty expliciet.
- [x] Laat create/update/delete via repositories lopen.
- [x] Behoud een kleine context alleen voor laagfrequente shellidentity indien nodig.
- [x] Voeg component-/integratietests toe voor create, select, reload, update en delete.
- [x] Acceptatie: `ProfileContext` schrijft geen volledige arrays meer naar `localStorage` en gameprogressie zit niet in de profielwriter.
- [x] Verificatie: profiel-E2E plus repositorytests zijn groen.
- [x] **Kwaliteitscontrole:** toets statelevensduur, effects, foutstates en accessibility aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-C06 — Game-instellingen, rewards en wereldselectie migreren

- [x] **IMP-C06 afgerond**

Afhankelijkheden: IMP-C03 tot en met IMP-C05 en IMP-B06.

Doel: directe gameopslag vervangen zonder game-platformgrenzen te doorbreken.

- [x] Bepaal welke instellingen platformbreed en welke game-specifiek zijn.
- [x] Maak capabilitygerichte runtime-/applicationpoorten voor settings, rewards en wereldselectie waar duurzaamheid nodig is.
- [x] Migreer bestaande keys via IMP-C04-mechanisme.
- [x] Houd vluchtige rewardresultaten in sessiestate; persisteer alleen wanneer reloadherstel een expliciete requirement is.
- [x] Houd zone-devtoolsoverdride als development-only data buiten kindprofielanalytics.
- [x] Verwijder directe `localStorage`/`sessionStorage`-calls uit de game.
- [x] Acceptatie: de gamemap benadert geen browseropslag rechtstreeks.
- [x] Verificatie: search, architectuurcheck en reloadtests voor settings/rewards/world zijn groen.
- [x] **Kwaliteitscontrole:** toets data-eigenaarschap, privacy, storage en imports aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-C07 — Opslagfouten en tijdelijke modus productwaardig maken

- [x] **IMP-C07 afgerond**

Afhankelijkheden: IMP-C03 tot en met IMP-C06.

Doel: quota, private browsing, corruptie en migratiefouten herstelbaar maken.

- [x] Bouw shell-UI voor storage unavailable, quota exceeded en migration failed.
- [x] Geef concrete acties: retry, diagnose-export, opslagbeheer of expliciete tijdelijke modus.
- [x] Toon permanent en begrijpelijk wanneer voortgang in tijdelijke modus niet wordt bewaard.
- [x] Buffer alleen een begrensd aantal sessie-events in geheugen en meld write failure.
- [x] Voeg fake storage failures toe aan component- en Playwright-tests.
- [x] Acceptatie: geen opslagfout resulteert in een blanco scherm of stil dataverlies.
- [x] Verificatie: geautomatiseerde quota-, denial- en corruptiescenario's zijn groen.
- [x] **Kwaliteitscontrole:** toets foutmeldingen, toegankelijkheid, privacy en recovery aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### Uitvoerbewijs Groep C

- Alle oude browseropslagkeys, payloads, eigenaren, retentie- en verwijderpaden zijn geïnventariseerd.
- Dexie blijft intern achter Zod-gevalideerde repositorycontracten; UI en games kennen geen database-instance.
- De legacy-import is transactioneel, read-only aan de bron, idempotent door een fingerprint en getest met geldige, gedeeltelijke, corrupte en toekomstige fixtures.
- Profielen, settings, sessies, oefenevents en voortgangsprojecties gebruiken repositories; profielverwijdering voert een geteste cascade uit.
- Game-instellingen, rewards en wereldselectie zijn duurzaam via runtimepoorten; rewardresultaten en zone-devtoolsdata blijven bewust vluchtig.
- Storage-, quota- en migratiefouten hebben zichtbare recovery; tijdelijke modus gebruikt een begrensde buffer en een permanente waarschuwing.
- Formatting, lint, typecheck, 36 tests, architectuurcontrole, Knip, audit, productiebuild, bundelbudget en Chromium-/WebKit-E2E zijn groen.
- Gedetailleerd bewijs en ontwerpafwegingen: `docs/architecture/group-c-report-2026-07.md`.
- Commitbericht voor de volledige groep: `feat(storage): migrate profiles and game data to repository-backed IndexedDB`

</details>

---

<details>
<summary><strong>Groep D — Oefenevents, sessies en voortgangsprojecties</strong></summary>

## Groep D — Oefenevents, sessies en voortgangsprojecties

Deze groep vereist inhoudelijke afstemming: software mag de pedagogische betekenis niet zelfstandig verzinnen.

### IMP-D01 — Pedagogisch datacontract vaststellen

- [x] **IMP-D01 afgerond**

Afhankelijkheden: IMP-C02 en een aangewezen inhoudelijk eigenaar.

Doel: eenduidig bepalen welke feiten games rapporteren en hoe voortgang wordt geïnterpreteerd.

- [x] Definieer `PracticeEventV1` met outcome, attempt, assistance, response time, skill ids en content version.
- [x] Definieer wat een task, skill, attempt, replay, visual hint en spoken help precies betekent.
- [x] Leg expliciet vast welke data niet wordt opgeslagen: naam, avatar, ruwe audio en transcript.
- [x] Definieer projectorvoorbeelden met verwachte status voor representatieve eventreeksen.
- [x] Laat inhoudelijk/pedagogisch eigenaar de voorbeelden en terminologie goedkeuren.
- [x] Schrijf ADR voor eventcontract, projectorverantwoordelijkheid en retentie.
- [x] Acceptatie: twee games kunnen hetzelfde event invullen zonder gamespecifieke masterylabels.
- [x] Verificatie: schema- en fixturetests zijn groen en goedkeuring is gedocumenteerd.
- [x] **Kwaliteitscontrole:** toets contract, privacy, versiebeheer en documentatie aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-D02 — Sessie- en eventwriter implementeren

- [x] **IMP-D02 afgerond**

Afhankelijkheden: IMP-D01, IMP-C03 en IMP-B04.

Doel: lifecycle en oefenobservaties betrouwbaar en idempotent opslaan.

- [x] Laat `GameHost` sessies starten met `startedAt`, game/profile/content version.
- [x] Implementeer status `started`, `completed`, `abandoned` en `crashed`.
- [x] Implementeer een runtime eventwriter die ids/tijd injecteert, valideert en idempotent append uitvoert.
- [x] Sluit open sessies gecontroleerd bij exit en runtimecrash.
- [x] Definieer herstelbeleid voor een sessie die bij appstart nog `started` is.
- [x] Log alleen privacyveilige technische context.
- [x] Acceptatie: duplicate events verhogen geen telling en iedere game-run heeft maximaal één eindstatus.
- [x] Verificatie: repository-, lifecycle- en crashtests zijn groen.
- [x] **Kwaliteitscontrole:** toets transactions, ids, errors, logging en privacy aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-D03 — Versieerbare voortgangsprojector bouwen

- [x] **IMP-D03 afgerond**

Afhankelijkheden: IMP-D01 en IMP-D02.

Doel: snelle, uitlegbare dashboardwaarden uit events afleiden.

- [x] Implementeer een pure projector op basis van de goedgekeurde fixtures.
- [x] Sla `projectorVersion`, `calculatedAt` en bronselectie op in de projectie.
- [x] Maak volledige rebuild en gerichte incremental update mogelijk.
- [x] Markeer projectie dirty of update transactioneel bij nieuwe events.
- [x] Behandel wijziging van projectorversie zonder events te muteren.
- [x] Voeg tests toe voor volgorde, duplicates, hulp, incorrect/skipped en tijdsvenster.
- [x] Acceptatie: alle projecties kunnen na verwijderen volledig identiek worden herbouwd.
- [x] Verificatie: rebuildvergelijking en minimaal 90% branch coverage voor de kernprojector.
- [x] **Kwaliteitscontrole:** toets pure logica, coverage, versiebeheer en uitlegbaarheid aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-D04 — Scene Builder naar PracticeEventV1 migreren

- [x] **IMP-D04 afgerond**

Afhankelijkheden: IMP-D02, IMP-D03 en IMP-B06.

Doel: één verticale gameflow volledig via het nieuwe contract laten werken.

- [x] Map bestaande scene builderresultaten naar neutrale outcomes en assistance.
- [x] Verwijder directe eventwrites uit UI/hooks; dispatch via application/controller naar runtimewriter.
- [x] Geef task-, skill- en contentversion stabiel door.
- [x] Vergelijk nieuwe projectie-uitkomsten met goedgekeurde verwachtingen.
- [x] Houd tijdelijk dual-readvergelijking toegestaan, maar nooit twee authoritative writers.
- [x] Voeg unit-, integratie- en E2E-tests toe voor correct, hint, repeat, incorrect en exit.
- [x] Acceptatie: scene builder schrijft uitsluitend schema-geldige V1-events en dashboardprojectie wordt bijgewerkt.
- [x] Verificatie: eventfixtures, projector en scene-builder-E2E zijn groen.
- [x] **Kwaliteitscontrole:** toets controllergrens, events, tests en privacy aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-D05 — Word Choice en Voice Side Scroller migreren

- [x] **IMP-D05 afgerond**

Afhankelijkheden: IMP-D04.

Doel: alle bestaande spelmodi hetzelfde event- en sessiecontract laten gebruiken.

- [x] Definieer per modus task/skill/outcome/assistance mapping zonder nieuw masterylabel.
- [x] Migreer Word Choice eerst en vergelijk projecties.
- [x] Migreer Voice Side Scroller met expliciete privacygrens: geen transcript/audio in events of logs.
- [x] Test speech unavailable en permission denied als normale fallbackflow.
- [x] Verwijder oude game-specifieke eventwriters wanneer alle readers zijn omgezet.
- [x] Acceptatie: alle modi gebruiken dezelfde runtimewriter en oude progressieopslag krijgt geen nieuwe writes.
- [x] Verificatie: modusgerichte tests plus volledige game-smoke zijn groen.
- [x] **Kwaliteitscontrole:** toets speechprivacy, fallback, events en cleanup aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-D06 — Dashboard op projecties aansluiten

- [x] **IMP-D06 afgerond**

Afhankelijkheden: IMP-D03 tot en met IMP-D05.

Doel: demo-/gemuteerde profielprogressie vervangen door herleidbare projecties.

- [x] Maak featurequeryhooks boven de projectierepository.
- [x] Modelleer loading, geen oefeningen, gedeeltelijke data, projector rebuild en fout.
- [x] Toon in begrijpelijke taal waarop een status is gebaseerd zonder diagnose over het kind te suggereren.
- [x] Laat filters/periodes events/projecties consistent selecteren.
- [x] Verwijder oude statische/demo progressiedata pas na paritycontrole.
- [x] Voeg component- en E2E-test toe van oefening naar zichtbaar dashboardresultaat.
- [x] Acceptatie: ieder zichtbaar getal/status is herleidbaar tot events en projectorversie.
- [x] Verificatie: fixturedashboard en end-to-endflow zijn groen.
- [x] **Kwaliteitscontrole:** toets query-state, accessibility, pedagogische taal en data-eigenaarschap aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-D07 — Export, retentie en complete profielverwijdering implementeren

- [x] **IMP-D07 afgerond**

Afhankelijkheden: IMP-C07 en IMP-D06.

Doel: beheer van kinddata volledig, uitlegbaar en testbaar maken.

- [x] Definieer bewaartermijn voor ruwe events en voorwaarden voor compactie/verwijdering.
- [x] Bouw een begeleidersflow voor privacyveilige data-export.
- [x] Scheid een technische diagnose-export van een inhoudelijke voortgangsexport.
- [x] Laat profieldelete alle settings, sessies, events, projecties en gamegebonden records transactioneel verwijderen.
- [x] Verwijder of anonimiseer lokale diagnosebuffers die aan het profiel gekoppeld zijn.
- [x] Voeg een E2E-test toe die na delete alle repositories controleert.
- [x] Acceptatie: er blijven geen aan het profiel herleidbare lokale records achter.
- [x] Verificatie: cascade-, export-schema- en retentietests zijn groen.
- [x] **Kwaliteitscontrole:** toets privacy, destructive UX, transacties en accessibility aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### Uitvoerbewijs Groep D

- `PracticeEventV1`, neutrale terminologie, privacygrenzen, projectorregels en retentie zijn vastgelegd in ADR-002 en inhoudelijk geaccepteerd.
- `GameHost` beheert versiegebonden sessies; de runtimewriter injecteert ids en tijd, valideert met Zod en schrijft events idempotent.
- De pure, versieerbare projector ondersteunt incrementele updates, volledige rebuild en tijdsselecties; rebuilds zijn aantoonbaar identiek.
- Scene Builder, Word Choice en Voice Side Scroller gebruiken één feitencontract zonder gamespecifieke masterylabels of transcriptopslag.
- Het dashboard leest echte events/projecties en toont expliciete loading-, empty-, partial-, rebuild- en fouttoestanden.
- Voortgangsexport, retentiebeleid en volledige profielcascade zijn privacyveilig en getest.
- Formatting, lint, typecheck, 52 tests, architectuurcontrole, Knip, audit, productiebuild, bundelbudget en 4 Chromium-/WebKit-E2E-tests zijn groen.
- De kernprojector behaalt 91,13% branch coverage.
- Gedetailleerd bewijs en ontwerpafwegingen: `docs/architecture/group-d-report-2026-07.md`.
- Commitbericht voor de volledige groep: `feat(progress): centralize practice events, sessions and projections`

</details>

---

<details>
<summary><strong>Groep E — PWA, assets, offlinepakketten en performance</strong></summary>

## Groep E — PWA, assets, offlinepakketten en performance

Offlinebetrouwbaarheid wordt hier een aantoonbare producttoestand in plaats van alleen een geregistreerde service worker.

### IMP-E01 — Build-gegenereerde Workbox-service worker invoeren

- [x] **IMP-E01 afgerond**

Afhankelijkheden: groep A en IMP-B05.

Doel: handmatige cacheversies vervangen door buildgebonden revisies en expliciete strategieën.

- [x] Kies een onderhouden Vite/Workbox-integratie en leg de keuze vast in een ADR.
- [x] Precache alleen app-shell en essentiële gehashte assets.
- [x] Configureer navigatiefallback zonder API/externe requests verkeerd te onderscheppen.
- [x] Definieer runtimecaches afzonderlijk voor chunks, kleine beelden/fonts en media.
- [x] Beperk cache-origin, entries, leeftijd en foutgedrag.
- [x] Verwijder de oude handgeschreven worker pas nadat parity- en upgradetests slagen.
- [x] Acceptatie: een nieuwe build reviseert gewijzigde assets en ruimt oude precacheitems gecontroleerd op.
- [x] Verificatie: productiebuildtest online, offline en update van versie N naar N+1.
- [x] **Kwaliteitscontrole:** toets caching, dependencies, security en recovery aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-E02 — Gegenereerd assetmanifest bouwen

- [x] **IMP-E02 afgerond**

Afhankelijkheden: IMP-E01.

Doel: handgeschreven URL-lijsten vervangen door controleerbare assetmetadata.

- [x] Maak een buildscript dat per game/world URL, hash, MIME-type, bytes, optional/required en bron/licentie vastlegt.
- [x] Laat build falen op ontbrekende verplichte bestanden en duplicate ids.
- [x] Rapporteer orphan assets zonder ze direct automatisch te verwijderen.
- [x] Houd manifesten licht en voorkom dat catalogusimport alle media in de entrychunk trekt.
- [x] Koppel contentversion aan de gebruikte assetset.
- [x] Voeg fixture-/snapshottest toe voor de manifeststructuur, niet voor willekeurige gehashte output.
- [x] Acceptatie: iedere vereiste runtimeasset is vanuit een manifest herleidbaar en bestaat na build.
- [x] Verificatie: manifestcheck, broken-assetproef en bundlegraph zijn groen.
- [x] **Kwaliteitscontrole:** toets buildcode, assetlicenties, imports en budgets aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-E03 — Offlinepakketmanager per gamewereld implementeren

- [x] **IMP-E03 afgerond**

Afhankelijkheden: IMP-E01 en IMP-E02.

Doel: alleen volledig geverifieerde werelden als offline beschikbaar tonen.

- [x] Definieer states `not-downloaded`, `estimating`, `downloading`, `verifying`, `ready`, `partial`, `failed` en `outdated`.
- [x] Toon totale bytes vóór download en vraag bevestiging boven de productgrens.
- [x] Gebruik `navigator.storage.estimate()` alleen als schatting en behandel unsupported.
- [x] Ondersteun voortgang, annuleren, partial cleanup, retry en expliciet pakket verwijderen.
- [x] Markeer `ready` pas na verificatie van alle required assets.
- [x] Implementeer begrensde LRU/versiecleanup zonder actief pakket midden in sessie te verwijderen.
- [x] Acceptatie: een onderbroken of quota-gefaalde download wordt nooit ready.
- [x] Verificatie: fake cache/quota-tests en offline Playwrightflow zijn groen.
- [x] **Kwaliteitscontrole:** toets state-machine, storage, fout-UX en accessibility aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-E04 — Service-workerupdate veilig maken tijdens gamesessies

- [x] **IMP-E04 afgerond**

Afhankelijkheden: IMP-E01, IMP-E03 en IMP-D02.

Doel: nieuwe releases activeren zonder actieve sessies of chunks te breken.

- [x] Detecteer waiting/updated worker en publiceer status via een kleine PWA-adapter.
- [x] Toon updateprompt buiten actieve sessies.
- [x] Stel activatie uit wanneer `GameHost` een actieve sessie heeft.
- [x] Bied na safe exit “nu bijwerken” en herstel bij mislukte chunkimport.
- [x] Zorg dat oude actieve releaseassets niet voortijdig worden verwijderd.
- [x] Test N-naar-N+1 met een gesimuleerde actieve game.
- [x] Acceptatie: update veroorzaakt geen blanco scherm of verloren sessie.
- [x] Verificatie: productie-E2E voor waiting, postpone, exit en activate.
- [x] **Kwaliteitscontrole:** toets lifecycle, recovery, logging en accessibility aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-E05 — Assets optimaliseren en lazy consumptie invoeren

- [x] **IMP-E05 afgerond**

Afhankelijkheden: IMP-E02 en baseline IMP-A01.

Doel: start- en offlinepakketgrootte meetbaar reduceren zonder kwaliteit of compatibiliteit te breken.

- [x] Gebruik bundle-/assetrapport om de grootste werkelijke winst te prioriteren.
- [x] Maak passende WebP/AVIF- of andere varianten met noodzakelijke fallback.
- [x] Optimaliseer videoresolutie, bitrate en codec op doeldevices.
- [x] Laad media per actieve wereld/modus en preload standaard alleen metadata/poster.
- [x] Verwijder bewezen duplicate/orphan assets na visuele en licentiecontrole.
- [x] Vergelijk beeld-/audiokwaliteit op referentietablet, niet alleen bytegrootte.
- [x] Acceptatie: meetrapport toont winst per wijziging en geen kernflow laadt alle gamemedia bij boot.
- [x] Verificatie: bundle diff, netwerkprofiel, visuele/media QA en bestaande E2E zijn groen.
- [x] **Kwaliteitscontrole:** toets performance, accessibilityalternatieven, licenties en maintainability aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### IMP-E06 — Performancebudgetten blokkerend maken

- [x] **IMP-E06 afgerond**

Afhankelijkheden: IMP-B05 en IMP-E05.

Doel: voorkomen dat shell, gamechunks en offlinepakketten ongemerkt opnieuw groeien.

- [x] Meet shell-JS/CSS los van lazy gamechunks.
- [x] Implementeer CI-grenzen uit hoofdstuk 12 van het kwaliteitsdocument.
- [x] Rapporteer diff ten opzichte van main en absolute grootte.
- [x] Vereis ADR/expliciete goedkeuring voor gemotiveerde overschrijding.
- [x] Voeg minimaal één interactiemeting of long-taskcheck toe op referentieprofiel.
- [x] Archiveer rapporten als CI-artifact of PR-samenvatting.
- [x] Acceptatie: een bewust te groot testchunk blokkeert CI met een begrijpelijke melding.
- [x] Verificatie: budgettest groen op actuele build en rood op gecontroleerde overschrijding.
- [x] **Kwaliteitscontrole:** toets gekozen grenzen, meetmethode en uitzonderingen aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

### Uitvoerbewijs Groep E

- Workbox genereert buildrevisies voor de app-shell; de oude handgeschreven worker is verwijderd.
- Een postbuildscript genereert voor 113 vereiste assets URL, SHA-256, MIME-type, bytes, required-status, bron, licentie en contentversie.
- De offlinepakket-state-machine dekt grootte-inschatting, bevestiging, voortgang, annuleren, verificatie, retry, verwijderen, quota en versiecleanup.
- Updates blijven tijdens een actieve `GameHost`-sessie waiting en worden pas na veilige exit geactiveerd.
- PNG's zijn lossless geoptimaliseerd, drie WebP-achtergronden hebben PNG-fallback en videopreload is teruggebracht naar metadata.
- CI rapporteert absolute en main-diffbudgetten en archiveert de gegenereerde rapporten.
- Formatting, lint, TypeScript, 59 tests, 4 buildscripttests, architectuurcontrole, Knip, audit, productiebuild, budgetten en 5 E2E-tests zijn groen.
- Gedetailleerd bewijs en ontwerpafwegingen: `docs/architecture/group-e-report-2026-07.md`.
- Commitbericht voor de volledige groep: `feat(pwa): add verified offline packages and performance budgets`

</details>

---

<details>
<summary><strong>Groep F — Toegankelijkheid en gedeelde UI</strong></summary>

## Groep F — Toegankelijkheid en gedeelde UI

### IMP-F01 — Gedeelde primitives en kernschermen auditen

- [x] **IMP-F01 afgerond**

Afhankelijkheden: groep A.

Doel: semantiek en interactiegedrag consistent maken zonder een extra designsysteem in te voeren.

- [x] Inventariseer gebruikte platformprimitives en ongebruikte Radix/MUI/shadcn-componenten.
- [x] Controleer button semantics, toegankelijke naam, disabled/focus/pressed states en 48×48 touchdoelen.
- [x] Controleer terug, pauze, audio, hint, voortgang en exit op consistente betekenis.
- [x] Respecteer `prefers-reduced-motion` in gedeelde animaties.
- [x] Voeg gedrags- en axe-tests toe aan de meest gebruikte primitives.
- [x] Verwijder geen component uitsluitend omdat hij nu ongebruikt lijkt zonder Knip/buildcontrole.
- [x] Acceptatie: kernprimitives hebben gedocumenteerd interactiecontract en tests.
- [x] Verificatie: Testing Library, axe en handmatige toetsenbordcontrole zijn groen.
- [x] **Kwaliteitscontrole:** toets UI-librarykeuze, semantics, tests en touchvereisten aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

Bewijs:

- Gewijzigde bestanden: `src/app/game-platform/components`, `src/app/components/ui/button.tsx`, `src/app/screens/shared/BackButton.tsx`, `src/app/App.tsx`, `src/styles/theme.css`.
- Uitgevoerde commando's: `npm run test`, `npm run test:e2e:a11y`, handmatige productiebrowsercontrole.
- Resultaten/meting: 66 component-/unit-tests en 4 accessibility-E2E-tests groen; kerncontrols minimaal 48 px.
- Handmatige controle: focus/semantiek, portrait, landscape, 200%-zoomequivalent en touchdoel gecontroleerd.
- ADR/documentatie: `docs/accessibility/gedeeld-interactiecontract.md`.
- Kwaliteitscontrole: geslaagd; JSDOM-contrastexceptie is specifiek gedocumenteerd en in echte browsers gedekt.
- Voorgesteld commitbericht: `feat(a11y): standardize inclusive controls and game alternatives`.

### IMP-F02 — Niet-spraak- en niet-dragalternatieven voltooien

- [x] **IMP-F02 afgerond**

Afhankelijkheden: IMP-B06 en IMP-F01.

Doel: kernflows bruikbaar houden zonder microfoon, audio, hover of precieze drag.

- [x] Inventariseer iedere actie die alleen via speech of drag kan.
- [x] Bied voor speech een visuele/tapbediening met dezelfde pedagogische uitkomst.
- [x] Bied voor drag waar nodig selecteer-en-plaats of toetsenbordbediening.
- [x] Maak permission denied een normale capabilitytoestand, geen technische fout.
- [x] Zorg dat audio-instructies visueel/tekstueel beschikbaar zijn.
- [x] Voeg E2E toe met geweigerde microfoon en toetsenbord-only kernflow.
- [x] Acceptatie: een kind kan de kernopdracht zonder microfoon en zonder precieze drag voltooien.
- [x] Verificatie: Chromium/WebKit tests en handmatige touch-/toetsenbordtest zijn groen.
- [x] **Kwaliteitscontrole:** toets gelijkwaardigheid, privacy, focus en feedback aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

Bewijs:

- Gewijzigde bestanden: scene-builder toetsenbordlogica, vliegbediening, typfallback en `e2e/accessibility.spec.ts`.
- Uitgevoerde commando's: `npm run test`, `npm run test:e2e:a11y`.
- Resultaten/meting: microfoon-denied, typen, pijltoetsen en Enter slagen in Chromium en WebKit.
- Handmatige controle: zichtbare instructie en selecteer-en-plaatsroute op productiebuild gecontroleerd.
- ADR/documentatie: alternatiefbedieningscontract in `docs/accessibility/gedeeld-interactiecontract.md`.
- Kwaliteitscontrole: geslaagd; dezelfde parser/oefenregistratie, geen transcriptlogging en geen tweede voortgangspad.
- Voorgesteld commitbericht: `feat(a11y): standardize inclusive controls and game alternatives`.

### IMP-F03 — Volledige accessibility-releasecontrole opzetten

- [x] **IMP-F03 afgerond**

Afhankelijkheden: IMP-F01 en IMP-F02.

Doel: geautomatiseerde signalering combineren met menselijke controles.

- [x] Voeg `@axe-core/playwright` toe aan welcome, profiel, catalogus, gamehost, settings en progressie.
- [x] Documenteer handmatige checklist voor toetsenbord, screenreader, contrast, zoom, reduced motion, portrait/landscape en touch.
- [x] Selecteer doel-screenreaders/browsers voor releasecontrole.
- [x] Registreer bekende false positives zeer specifiek met reden en eigenaar.
- [x] Laat kritieke automatische overtredingen CI blokkeren.
- [x] Bewaar releasecheckresultaat bij release-notes of QA-artifact.
- [x] Acceptatie: zowel automatische als handmatige controle hebben eigenaar en herhaalbare stappen.
- [x] Verificatie: voer één volledige audit uit en registreer/herstel bevindingen.
- [x] **Kwaliteitscontrole:** toets dekking, uitzonderingen en documentatie aan `docs/code-quality-and-architecture.md`.
- [x] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

Bewijs:

- Gewijzigde bestanden: `e2e/accessibility.spec.ts`, `.github/workflows/quality.yml`, `docs/accessibility/release-checklist.md`.
- Uitgevoerde commando's: `npm run test:e2e:a11y` en handmatige productiebrowseraudit.
- Resultaten/meting: zes kernschermen zonder axe WCAG 2.2 A/AA-overtredingen in Chromium en WebKit.
- Handmatige controle: viewport-, zoom-, focus-, semantiek- en touchcontrole geregistreerd.
- ADR/documentatie: `docs/architecture/group-f-report-2026-07.md`.
- Kwaliteitscontrole: geslaagd; geen productfalse-positives, QA-artifact veertien dagen bewaard.
- Voorgesteld commitbericht: `feat(a11y): standardize inclusive controls and game alternatives`.

</details>

---

<details>
<summary><strong>Groep G — Debugging, diagnostiek en observability</strong></summary>

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
- [ ] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

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
- [ ] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

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
- [ ] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

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
- [ ] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

</details>

---

<details>
<summary><strong>Groep H — Tweede game, hardening en afronding</strong></summary>

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
- [ ] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

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
- [ ] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

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
- [ ] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

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
- [ ] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

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
- [ ] **Commitbericht voor gebruiker:** geef na alle verificaties een Conventional Commit-bericht op basis van de werkelijke diff; voer zelf geen commit uit.

</details>

---

# Voortgangsoverzicht

Werk dit overzicht bij wanneer een hoofdtaak wordt afgerond. De detailcheckboxes blijven de bron van waarheid.

| Groep      | Onderwerp                                  | Gereed | Totaal |
| ---------- | ------------------------------------------ | -----: | -----: |
| A          | Baseline en kwaliteitsstraat               |      7 |      7 |
| B          | Modulecontracten, GameHost en lazy loading |      7 |      7 |
| C          | Opslag, schema's en migraties              |      7 |      7 |
| D          | Oefenevents, sessies en projecties         |      7 |      7 |
| E          | PWA, assets en performance                 |      6 |      6 |
| F          | Toegankelijkheid en gedeelde UI            |      3 |      3 |
| G          | Debugging en observability                 |      0 |      4 |
| H          | Tweede game en hardening                   |      0 |      5 |
| **Totaal** |                                            | **37** | **46** |

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
- Voorgesteld commitbericht: ...
```
