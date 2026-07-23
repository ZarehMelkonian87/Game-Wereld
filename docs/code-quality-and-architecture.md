# Code Quality & Architecture Requirements

Status: **normatieve doelstandaard**

Laatste herziening: **23 juli 2026**

Dit document vertaalt het [architectuurvoorstel](architecture-proposal/README.md) naar dagelijkse ontwikkel-, review- en CI-regels voor Game Wereld. Het geldt voor mensen, AI-assistenten en gegenereerde code.

De huidige codebase voldoet nog niet overal aan deze standaard. De invoervolgorde staat in het [migratieplan](architecture-proposal/10-migratieplan-beslismomenten-en-risicos.md). Een regel die nog niet technisch wordt afgedwongen, blijft wel de norm voor nieuwe en gewijzigde code.

## 1. Normatieve taal en prioriteit

- **MOET / MAG NIET**: harde eis. Een overtreding blokkeert merge zodra de bijbehorende controle beschikbaar is.
- **HOORT**: standaardkeuze. Afwijken mag met een concrete motivatie in de pull request.
- **KAN**: toegestane optie, geen verplichting.

Bij tegenstrijdigheid geldt deze volgorde:

1. geaccepteerde Architecture Decision Records (ADR's);
2. dit document en hoofdstuk [Code Quality & Architecture Requirements](architecture-proposal/08-code-quality-and-architecture-requirements.md);
3. overige architectuur- en gamedocumentatie;
4. voorbeelden in bestaande code.

Bestaande code is geen precedent wanneer zij strijdig is met deze standaard.

## 2. Definitie van klaar

Een wijziging is pas klaar wanneer de relevante controles slagen:

```sh
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:architecture
npm run build
```

`npm run check` MOET de eerste vijf controles uitvoeren. CI voert daarna de productiebuild, budgetcontroles en relevante end-to-endtests uit.

Belangrijk: `vite build` transpileert TypeScript, maar vervangt `tsc --noEmit` niet. Een geslaagde Vite-build is daarom nooit bewijs van typeveiligheid.

Totdat alle scripts zijn ingevoerd, MOET minimaal `npx tsc --noEmit` afzonderlijk van `npm run build` worden uitgevoerd. Bekende bestaande fouten worden eerst volgens migratiefase 0 opgelost; nieuwe fouten mogen niet worden toegevoegd of genegeerd.

## 3. Architectuurgrenzen

Game Wereld is een modulaire monoliet met één deployment. De hoofdrollen zijn:

```txt
bootstrap       appstart, globale foutafhandeling, service-workerregistratie
app             routes, shell, features en GameHost
games           zelfstandige gamemodules
platform        contracten en browser-/leveranciersadapters
shared          kleine, werkelijk domein-neutrale code
```

Tijdens de migratie kan `src/app/game-platform` de rol van `platform` vervullen. Een map wordt niet alleen voor naamconsistentie verplaatst.

### 3.1 Harde importregels

- `platform` MAG GEEN concrete game of app-feature importeren.
- Een game MAG GEEN andere game importeren.
- Een game MAG GEEN route, app-shell, globale context, Dexie-database of externe observability-SDK importeren.
- Domeinlogica MAG GEEN React-, DOM-, storage- of browser-API importeren.
- Een feature MAG alleen de publieke entrypoint van een andere feature importeren.
- Direct gebruik van `localStorage`, `sessionStorage`, IndexedDB, Cache Storage, speech, audio en service workers is alleen toegestaan in aangewezen adapters of bootstrapcode.
- Circulaire dependencies zijn verboden.
- Deep imports door een modulegrens zijn verboden.

Deze grenzen MOETEN met Dependency Cruiser en waar nuttig ESLint `no-restricted-imports` worden afgedwongen.

### 3.2 Publieke module-API

Iedere feature en game exporteert een kleine publieke API via een expliciete entrypoint. Interne components, repositories, databaseobjecten en leveranciersimplementaties worden niet opnieuw geëxporteerd “voor het gemak”.

Barrelbestanden mogen geen zware assets of ongebruikte implementaties eager importeren. Een game-entry voor de catalogus bevat alleen een licht manifest; de implementatie wordt dynamisch geladen.

### 3.3 Wanneer code gedeeld mag worden

Code verhuist pas naar `platform` of `shared` wanneer:

- zij een externe grens beschermt; of
- minimaal twee bestaande consumers hetzelfde gedrag met dezelfde semantiek nodig hebben; of
- zij een productbreed contract vastlegt; of
- zij een kritieke flow onafhankelijk testbaar maakt.

Toekomstige herbruikbaarheid alleen is onvoldoende.

## 4. TypeScript en grensvalidatie

- `strict` MOET aan blijven.
- Expliciete `any` is verboden, behalve in een klein geïsoleerde compatibiliteitsadapter met motivatie en test.
- Externe en persistente data begint als `unknown` en wordt bij binnenkomst runtime gevalideerd, bijvoorbeeld met Zod.
- Publieke module-API's en persistente contracten hebben expliciete types.
- Gebruik branded ids voor `ProfileId`, `GameId`, `SessionId`, `TaskId` en vergelijkbare ids die niet verwisselbaar mogen zijn.
- Modelleer elkaar uitsluitende toestanden met discriminated unions.
- Exhaustieve switches eindigen in een `never`-controle.
- `@ts-ignore` is verboden.
- `@ts-expect-error` vereist een uitleg en een test die de verwachting bewaakt.
- Type assertions mogen geen contract- of validatiefout verbergen.
- `noUncheckedIndexedAccess` wordt aangezet nadat de bestaande typefouten zijn hersteld.

Optional chaining en nullish coalescing zijn geen vervanging voor een goed datamodel. Gebruik ze alleen wanneer afwezigheid werkelijk onderdeel van het contract is.

## 5. Components, hooks en bestanden

### 5.1 Geen arbitraire bestandslimiet

Er is geen universele limiet van 250 regels. Regelaantal is een reviewsignaal, geen architectuurregel. Een coherente contenttabel van 400 regels kan beter zijn dan vijf kunstmatig gekoppelde bestanden.

Een bestand HOORT te worden opgesplitst wanneer:

- het meerdere onafhankelijke veranderredenen heeft;
- pure logica niet zonder React kan worden getest;
- een deel een eigen lifecycle of foutbeleid heeft;
- afhankelijkheden of review aantoonbaar onoverzichtelijk worden.

Reviewers onderzoeken bestanden boven ongeveer 300 regels en functies boven ongeveer 50 regels extra kritisch, zonder automatisch splitsen te eisen.

### 5.2 React-components

- Components tonen UI of orchestreren expliciet als route, container of `GameHost`.
- Zware transformaties, parsing, geometrie, scoring en projecties horen niet in rendercode.
- Afleidbare waarden worden berekend; ze worden niet via een effect naar tweede state gekopieerd.
- Semantische HTML heeft voorkeur boven generieke elementen met ARIA-reparaties.
- Props zijn taakgericht en zo klein als praktisch.
- Alle functies MOETEN als arrow function worden geschreven. Dit geldt voor React-components, hooks, helpers, callbacks, factories en testfuncties.
- Function declarations met het `function`-keyword zijn niet toegestaan.
- Als een arrow function technisch niet mogelijk is, bijvoorbeeld voor een generator of een API-contract dat een dynamische `this` vereist, is een expliciete tijdelijke uitzondering volgens hoofdstuk 16 verplicht.
- `displayName` is alleen verplicht voor wrappers waarbij React DevTools anders geen bruikbare naam toont.
- `data-component` en `data-slot` worden alleen gebruikt als stabiel test- of diagnosecontract.

### 5.3 Hooks en effects

- Een hook heeft een naam die state, abonnement of side effect duidelijk maakt.
- Hooks retourneren data en acties, geen JSX.
- Effects synchroniseren React met een extern systeem; ze zijn niet de standaardplek voor businesslogica.
- Iedere effectdependency is correct en wordt door de React Hooks-linter gecontroleerd.
- Duurzame writes worden niet verborgen achter een vaag genoemde presentatiehook.
- Timers, listeners, media en speech worden altijd opgeruimd.

### 5.4 Pure domeinlogica

- Score-, parsing-, plaatsings-, randomisatie- en projectieregels zijn waar mogelijk pure TypeScript-functies.
- Functies muteren inputs niet, tenzij het contract dit expliciet en lokaal aangeeft.
- Klok, ids en randomisatie zijn injecteerbaar wanneer reproduceerbaarheid nodig is.
- Content gebruikt stabiele ids en nooit arrayposities als duurzame identiteit.

## 6. State en datastromen

Iedere state heeft één eigenaar en een benoemde levensduur:

| State           | Eigenaar                     | Voorbeeld                       |
| --------------- | ---------------------------- | ------------------------------- |
| Renderstate     | component                    | geopende dialoog                |
| Gamesessiestate | gamecontroller/reducer       | huidige opdracht en plaatsingen |
| Shellstate      | kleine featureprovider       | actief profiel-id               |
| Duurzame data   | repository                   | profiel en oefenevent           |
| HTTP-assets     | service worker/Cache Storage | chunks, audio en video          |

- Gamesessiestate blijft lokaal en gebruikt een reducer wanneer de toestanden en transities niet triviaal zijn.
- Duurzame events horen niet in een globale React-store.
- Een game ontvangt profiel-id, sessie-id, klok, eventwriter, media en speech via `GameRuntime`.
- Een game haalt geen globale `ProfileContext` of storage-implementatie op.
- Duplicatie is alleen toegestaan als één kopie expliciet een herbouwbare projectie/cache is.
- Een nieuwe globale state-library vereist profilerbewijs of aantoonbare complexiteitsreductie en een ADR.

## 7. Opslag en data-integriteit

- Gestructureerde duurzame data gebruikt repositories boven IndexedDB/Dexie.
- `localStorage` is alleen toegestaan voor kleine, niet-kritieke pre-bootvoorkeuren.
- Media en buildassets horen in Cache Storage, niet als algemene IndexedDB-blobs.
- Iedere persistente payload heeft een schema- en contractversie waar migratie nodig is.
- Migraties zijn expliciet, oplopend en getest met fixtures van oude versies.
- Writes zijn transactioneel waar meerdere records samen consistent moeten blijven.
- Oefenevents zijn idempotent op event-id.
- Profiel verwijderen voert een geteste cascade delete uit.
- Bij migratie- of corruptiefouten wordt bestaande data niet stil door lege defaults overschreven.
- Een in-memory fallback mag alleen als de UI duidelijk meldt dat voortgang niet wordt opgeslagen.
- Ids komen via een injecteerbare `crypto.randomUUID()`-adapter, niet via `Date.now()`.

## 8. Oefenevents en analytics

- Games rapporteren observeerbare feiten: uitkomst, poging, responstijd en gebruikte hulp.
- Games slaan geen definitieve labels zoals `mastered` of `supported` op.
- Pedagogische status wordt door een centrale, versieerbare projector afgeleid.
- Projecties zijn volledig herbouwbaar uit events.
- Events bevatten geen kindnaam, avatar, ruwe audio of speechtranscript.
- Projectorwijzigingen hebben pedagogisch goedgekeurde fixturetests.
- Dashboardwaarden zijn herleidbaar tot eventselectie en projectorversie.

## 9. Foutafhandeling en diagnostiek

- Lege catch-blokken zijn verboden.
- Een catch herstelt aantoonbaar, voegt veilige context toe of geeft de fout door.
- Verwachte fouten gebruiken benoemde resultaten/application-errors.
- Onverwachte fouten eindigen in een route- of game-error boundary.
- Lazy-load-, storage-, media-, speech- en service-workerfouten hebben minimaal één getest herstelpad.
- Een gebruikersmelding biedt een actie: retry, alternatief, opslagbeheer of veilig teruggaan.
- Logs zijn gestructureerd met tijd, severity, subsystem, eventnaam en correlation-id.
- Logs bevatten geen kindnaam, transcript, ruwe oefeninhoud of andere persoonsgegevens.
- `console.log` is geen productie-observability. Gebruik de centrale diagnostiekadapter.
- Session replay en input/DOM-capture zijn standaard verboden voor deze kindapp.

## 10. Testvereisten

### 10.1 Unit- en componenttests

- Pure domainregels hebben unit tests voor happy paths, randgevallen en invarianten.
- Kritieke domainmodules mikken op minimaal 90% branch coverage; afwijkingen worden gemotiveerd.
- Componenttests controleren gedrag via rollen, toegankelijke namen en zichtbare feedback.
- Tests leggen geen Tailwindclasses of interne hookaanroepen vast.
- Migraties hebben fixtures voor iedere ondersteunde oude dataversie en een foutpad.
- Tests gebruiken fake clocks, ids, repositories, speech, media en quota waar relevant.

### 10.2 End-to-endtests

Minimaal blokkerende kernflows:

1. profiel aanmaken, herladen en terugvinden;
2. game starten, opdracht voltooien en voortgang zien;
3. microfoon weigeren en handmatig verdergaan;
4. offlinewereld downloaden en offline spelen;
5. storage- of mediafout herstellen zonder blanco scherm;
6. profiel verwijderen en cascade delete verifiëren;
7. service-workerupdate uitstellen tot veilige game-exit.

Playwright bewaart bij falen een trace en screenshot. Console-errors laten de test falen, behalve een korte expliciete allowlist. Flaky tests worden gerepareerd; retries mogen het probleem niet verbergen.

## 11. Toegankelijkheid en kindvriendelijkheid

- WCAG 2.2 AA is de technische releaseondergrens.
- Kindgerichte interactieve doelen zijn minimaal 48×48 CSS-pixels met voldoende tussenruimte.
- Interacties mogen niet uitsluitend afhangen van drag, hover, kleur, geluid of spraak.
- Alle kernacties werken met toetsenbord en een logische focusvolgorde.
- Icon-only controls hebben een toegankelijke naam.
- Audio/video-instructies hebben een passend visueel of tekstueel alternatief.
- Animaties respecteren `prefers-reduced-motion`.
- Tijdslimieten zijn vermijdbaar of aanpasbaar.
- Portrait, landscape, zoom en safe areas worden getest.
- Automatische axe-tests zijn verplicht voor kernschermen.
- Iedere release bevat daarnaast een handmatige toetsenbord-, screenreader-, contrast- en touchcontrole.

## 12. PWA, performance en assets

- De app-shell importeert geen game-implementatie; games worden via een dynamische registryloader geladen.
- Route-, game- en medialoading hebben loading-, error- en retry-UI.
- De service worker gebruikt build-gegenereerde revisies; handmatige cacheversies zijn niet de bron van waarheid.
- “Offline beschikbaar” wordt alleen getoond wanneer alle verplichte assets van het wereldpakket zijn geverifieerd.
- Grote media wordt niet automatisch volledig geprecachet.
- Een afgebroken download mag nooit package-status `ready` krijgen.
- Bundle- en offlinepakketgroei is zichtbaar in iedere relevante pull request.
- Startbudgetten zijn: shell-JavaScript maximaal 200 kB gzip, shell-CSS maximaal 40 kB gzip en één gamechunk maximaal 250 kB gzip, tenzij een ADR de afwijking motiveert.
- Assets hebben bron, licentie, MIME-type, hash, bytegrootte en bekende consumer.
- Ontbrekende en orphan assets worden in CI gedetecteerd.
- Optimalisaties die leesbaarheid verminderen vereisen een gemeten winst op het referentiedevice.

## 13. Dependencies, security en privacy

- Een package wordt alleen toegevoegd voor een concreet probleem dat bestaande code of webplatform-API's niet redelijk oplossen.
- Een nieuwe dependency krijgt een license-, onderhouds-, security- en bundle-impactcheck.
- Gebruik één primaire UI-basis; parallelle designsystemen vereisen expliciete goedkeuring.
- Knip controleert periodiek ongebruikte files, exports en dependencies.
- Dependencyupdates worden geautomatiseerd voorgesteld en door dezelfde CI gecontroleerd.
- Frontendcode en client environment variables bevatten geen secrets.
- `eval`, onbeheerde HTML en ongesanitized externe content zijn verboden.
- Securityheaders en Content Security Policy worden op hostingniveau getest.
- Telemetrie is privacyarm en standaard uit voor inhoudelijke kinddata.
- Een externe foutmonitor vereist een afzonderlijke privacybeslissing, allowlisted context, scrubbing en uitgeschakelde session replay.

## 14. Naamgeving en codevorm

- Components, types en classes: `PascalCase`.
- Hooks: `camelCase` met prefix `use`.
- Functies en variabelen: `camelCase`.
- Werkelijk globale compile-timeconstanten: `UPPER_SNAKE_CASE`.
- Bestandsnamen volgen het bestaande patroon van de eigenaarmodule; vermijd uitsluitend cosmetische bulkrenames.
- Namen beschrijven productbetekenis, niet alleen techniek: `appendPracticeEvent` is duidelijker dan `saveData`.
- Comments leggen reden, invariant of beperking uit; ze herhalen niet de code.

## 15. Reviewchecklist

### Correctheid

- [ ] Slagen typecheck, lint, tests, architectuurcheck en build?
- [ ] Zijn externe/persistente inputs runtime gevalideerd?
- [ ] Zijn fout-, lege, loading- en retrytoestanden behandeld?
- [ ] Zijn tijd, ids en randomisatie reproduceerbaar waar nodig?

### Architectuur

- [ ] Blijft de wijziging binnen de eigenaarmodule en toegestane importgrenzen?
- [ ] Gebruikt een game uitsluitend `GameRuntime` en publieke platformcontracten?
- [ ] Beschermt een nieuwe abstractie een echte grens of minstens twee bestaande consumers?
- [ ] Is durable state in een repository in plaats van React-state of directe browseropslag?

### Productkwaliteit

- [ ] Werkt de flow met touch, toetsenbord en zonder microfoon?
- [ ] Zijn 48×48-doelen, focus, contrast en reduced motion gecontroleerd?
- [ ] Blijft offline-status eerlijk en herstelbaar?
- [ ] Blijven bundle- en assetbudgetten binnen de grens?

### Data en privacy

- [ ] Heeft een schemawijziging een migratie en rollbackpad?
- [ ] Is profielverwijdering compleet?
- [ ] Bevatten events/logs alleen noodzakelijke, privacyveilige velden?
- [ ] Is een dashboardconclusie centraal en versieerbaar afgeleid?

### Onderhoud

- [ ] Heeft iedere nieuwe dependency aantoonbare waarde?
- [ ] Is code gesplitst op verantwoordelijkheid in plaats van regelaantal?
- [ ] Zijn documentatie, tests en ADR's bijgewerkt wanneer contracten wijzigen?

## 16. Uitzonderingen en technische schuld

Een tijdelijke uitzondering bevat:

- de exacte overtreden regel;
- waarom naleving nu riskanter of onmogelijk is;
- afgebakende scope;
- eigenaar en issue;
- vervaldatum of verwijdercriterium;
- test of guard die verdere verspreiding voorkomt.

“Bestaande code doet het ook” en “later misschien oplossen” zijn geen geldige uitzonderingen. Nieuwe code mag bestaande schuld niet vergroten.

## 17. Verplichte tooling

De beoogde kwaliteitsstraat gebruikt:

- TypeScript `tsc --noEmit`;
- ESLint flat config met typescript-eslint, React Hooks en jsx-a11y;
- Prettier;
- Vitest en Testing Library;
- Playwright en `@axe-core/playwright`;
- Dependency Cruiser;
- Knip;
- Workbox voor build-gekoppelde PWA-caching;
- Dexie en runtime-schema's voor persistente data.

De motivatie en invoervolgorde staan in [Tooling, testen, debugging en observability](architecture-proposal/09-tooling-testen-debugging-en-observability.md).
