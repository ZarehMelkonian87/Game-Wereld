# 2. Kritische audit van de huidige app

## 2.1 Onderzochte basis

Deze audit is gebaseerd op de repositorytoestand van 22 juli 2026. Bekeken zijn onder andere `package.json`, TypeScript- en Vite-configuratie, routes, profielcontext, gameregistry, de volledige `strand-bezem-escape`-module, browseropslag, service worker en productiebuild.

Uitgevoerde controles:

```sh
npm run build
npx tsc --noEmit
rg "localStorage|sessionStorage|PracticeEvent|gameRegistry" src
```

`npm run build` slaagt, maar `npx tsc --noEmit` rapporteert meerdere type- en contractfouten. De productie-output is ongeveer 174 MB, met één JavaScript-entry van circa 1.016 kB ongecomprimeerd / 299 kB gzip en veel losse video's van 1,4–2,5 MB.

## 2.2 Wat al goed is

- Globale schermen zijn per feature gegroepeerd.
- `game-platform` bevat al bruikbare primitives, layouts en basistypes.
- Game-inhoud, assets, logica, state en schermen zijn grotendeels bij de game geplaatst.
- Veel geometrie-, parsing- en progressiefuncties staan buiten React-components.
- De PWA registreert de service worker alleen in productie en behandelt ontwikkeling apart.
- Speech en microfoontoestemming hebben al expliciete fallbackpaden.
- TypeScript `strict` staat aan.

Deze onderdelen worden niet weggegooid; ze zijn het migratiepunt.

## 2.3 Bevindingen, op prioriteit

| Prioriteit | Bevinding | Bewijs in de huidige code | Gevolg |
| --- | --- | --- | --- |
| P0 | Build valideert TypeScript niet | `build` is alleen `vite build`; `tsc --noEmit` faalt | Een release kan compileerbare JavaScript bevatten met kapotte TypeScript-contracten |
| P0 | Geen geautomatiseerde tests of CI | Geen test-, lint- of workflowconfiguratie gevonden | Kernlogica, opslagmigraties en kindflows kunnen ongemerkt breken |
| P1 | Catalogus en registry zijn verschillende waarheden | `data/games.ts`, `games/registry.ts` en `game.config.ts` bevatten overlappende ids en titels | Route-, titel- en voortgangsmismatches |
| P1 | Game is niet geïsoleerd of lazy | Registry importeert `StrandBezemEscapeGame` statisch; gamecontroller importeert `ProfileContext` | De app-shell kent gamecode; code splitting en zelfstandig testen ontbreken |
| P1 | Opslag is verspreid en onveilig | Directe `localStorage`/`sessionStorage`-calls in profiel, welcome, settings, progress, rewards, privacy en werelden | Geen uniforme foutafhandeling, migratie, validatie of cascade delete |
| P1 | Progressiemodellen lopen uiteen | Platform `PracticeResult` verschilt van gamewaarden zoals `mastered`/`supported` | Typefouten en semantisch onbetrouwbare dashboards |
| P1 | Offlinebeleid dekt media niet | Service worker sluit `.mp4`, `.mp3`, `.webm`, `.mov` uit | De shell kan offline openen terwijl de belangrijkste instructies niet werken |
| P2 | Geen foutgrenzen of herstelmodel | Geen route- of game-specifieke error boundary | Eén renderfout kan de volledige spelervaring beëindigen |
| P2 | Dependencyset is breder dan gebruik | Onder andere MUI en `react-dnd` staan in dependencies zonder imports in `src` | Groter onderhouds- en securityoppervlak; onduidelijk UI-beleid |
| P2 | Grote bestanden zijn symptoom, niet hoofdoorzaak | `content.ts` 765 regels, `progress.ts` 469, `asset-urls.ts` 425 | Moeilijk navigeren, maar een universele limiet lost samenhang en correctheid niet op |
| P2 | Diagnostiek is ad hoc | Lege catch-blokken en losse `console.warn`; geen correlatie-id of export | Problemen op tablets zijn moeilijk reproduceerbaar |

## 2.4 Concrete architectuurproblemen

### Build en typeveiligheid

Vite transpileert TypeScript maar voert geen volledige typecheck uit. De huidige documentatie noemt `npm run build` een typecheck, wat feitelijk onjuist is. De gevonden fouten omvatten ontbrekende exports, incompatibele refs, ongebruikte parameters, verkeerde eventwaarden en properties die niet bestaan. Dit is het eerste migratieblokkerende probleem.

### Schijnbare pluginisolatie

De registry is nu een object met statisch geïmporteerde componenten. Dat is nuttige dispatching, maar geen plugin- of lazy-loadgrens. Bovendien accepteert `ComponentType` geen runtimeprops, waardoor games hun afhankelijkheden zelf ophalen. `useBezemEscapeGameController` importeert direct de globale `ProfileContext`; daarmee is de afhankelijkheidsrichting omgekeerd.

### Data-integriteit

`ProfileContext` schrijft complete profielarrays terug naar `localStorage`. JSON wordt wel defensief geparsed, maar niet op schema gevalideerd. Quota-, security- en write-errors worden niet centraal afgehandeld. Andere gamegegevens gebruiken eigen keys en eigen catch-beleid. Verwijderen van een profiel ruimt daardoor niet automatisch alle gamegegevens op.

De context gebruikt bovendien closures over `profiles` en `currentProfile`. Functionele updates of een reducer zijn veiliger wanneer meerdere updates kort na elkaar plaatsvinden.

### Analytics

Er bestaan minimaal twee oefeneventmodellen: een platformtype en een rijker game-specifiek model. De game schrijft direct events naar lokale opslag, terwijl het algemene profiel ook een gemuteerde `GameProgress`-samenvatting bevat. Zonder formele projector en idempotentie is niet duidelijk welk model leidend is.

### PWA en assets

De service worker is handgeschreven en gebruikt een handmatig versienummer. De shell-URLs worden gecachet, maar grote media bewust niet. De build bevat circa 174 MB aan assets. “Offline-first” is daarom nog geen eind-tot-eindgarantie: beschikbaarheid moet per game/world expliciet worden beheerd en getest.

### UI en toegankelijkheid

Gedeelde gameprimitives zijn een sterke start, maar er is geen geautomatiseerde toegankelijkheidscontrole en geen aantoonbare toetsenbord-, screenreader-, reduced-motion- of contrasttest. Voor een kindproduct is 48×48 px een passende producteis, maar die moet semantische HTML, focusgedrag en alternatieven voor audio/speech aanvullen.

## 2.5 Kritiek op het vorige voorstel

Het vorige voorstel wordt niet gevolgd om de volgende redenen:

- **“Enterprise-grade” is geen requirement.** Het leidt de aandacht weg van aantoonbare productrisico's.
- **De 250-regelregel is arbitrair.** Een coherente datatabel van 300 regels kan beter zijn dan vijf kunstmatig gekoppelde bestanden. Complexiteit, verantwoordelijkheden en afhankelijkheden zijn betere signalen.
- **Drie stores lossen eigenaarschap niet vanzelf op.** Een `AnalyticsStore` in React maakt duurzame data juist te veel UI-state.
- **Een in-memory fallback mag niet stil zijn.** Het kind zou anders voortgang verliezen zonder dit te weten.
- **Assets horen niet in IndexedDB als algemene cache.** Cache Storage en een service-workerstrategie passen beter bij HTTP-resources; IndexedDB is voor gestructureerde data.
- **Lazy loading is geen foutisolatie.** Daarvoor zijn error boundaries, time-outs en herstel-UI nodig.
- **“Zero bundle bloat” en “start in milliseconden” zijn onbewezen claims.** Alleen meetbare budgetten en device-tests maken zulke doelen betekenisvol.
- **Games bepalen niet zelf mastery.** Ze rapporteren observeerbare pogingen en hulp; pedagogische projectors bepalen de interpretatie centraal en versieerbaar.

## 2.6 Conclusie

De huidige mappenstructuur hoeft niet radicaal te worden vervangen. De juiste ingreep is: eerst de kwaliteitsstraat sluitend maken, daarna afhankelijkheden omkeren, datacontracten normaliseren en pas vervolgens lazy loading en duurzame analytics invoeren. Dat levert sneller betrouwbaarheid op dan een brede herschikking naar abstracte lagen.
