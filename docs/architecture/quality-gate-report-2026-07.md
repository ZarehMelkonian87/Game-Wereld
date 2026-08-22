# Kwaliteitsstraatrapport — juli 2026

Datum: 23 juli 2026  
Omgeving: macOS arm64, Node 22.21.1, npm 10.9.4

Dit rapport vormt het lokale uitvoerbewijs voor Groep A. Een GitHub Actions-run kan pas na de door de gebruiker uitgevoerde commit en push ontstaan; de workflow zelf staat in `.github/workflows/quality.yml`.

## Positieve verificatie

| Controle                       | Resultaat                                                       |
| ------------------------------ | --------------------------------------------------------------- |
| `npm ci`                       | geslaagd                                                        |
| `npm audit --audit-level=high` | 0 kwetsbaarheden                                                |
| `npm run format:check`         | geslaagd na eenmalige repositoryformattering                    |
| `npm run lint`                 | geslaagd, 0 warnings toegestaan                                 |
| `npm run typecheck`            | geslaagd voor app- en Nodeconfiguratie                          |
| `npm run test`                 | 5 testbestanden, 11 tests geslaagd                              |
| `npm run test:coverage`        | V8-rapport gegenereerd; nog geen kunstmatige globale drempel    |
| `npm run test:architecture`    | 310 modules en 753 dependencies, 0 violations                   |
| `npm run check:dead-code`      | geen ongebruikte files of dependencies binnen de bewaakte scope |
| `npm run build`                | geslaagd met Vite 6.4.3                                         |
| `npm run test:e2e`             | kritieke flow geslaagd in Chromium-tablet en WebKit-tablet      |

De browsertest maakt een profiel, herlaadt de app, controleert profielherstel, opent de hoofdgame, keert veilig terug en faalt op page errors of console-errors. Het welkomstscherm wordt daarnaast automatisch met axe tegen WCAG 2.2 A/AA gecontroleerd. Traces gebruiken `on-first-retry`, screenshots `only-on-failure`; rapporten blijven zeven dagen bewaard in CI en worden niet gecommit.

## Negatieve poortproeven

Alle probes bestonden alleen tijdens de test en zijn daarna verwijderd.

| Probe                                   | Verwachte blokkade | Waargenomen resultaat                           |
| --------------------------------------- | ------------------ | ----------------------------------------------- |
| `number` toewijzen aan `string`         | TypeScript         | exitcode 2, `TS2322`                            |
| ongebruikte lokale variabele            | ESLint             | exitcode 1, `@typescript-eslint/no-unused-vars` |
| `expect(true).toBe(false)`              | Vitest             | exitcode 1, assertion failure                   |
| nieuwe game-import van `ProfileContext` | Dependency Cruiser | exitcode 1, `no-game-to-app-context`            |
| gewone `function`-declaratie            | ESLint             | exitcode 1, verplichte arrow-functionmelding    |

Daarmee is lokaal aangetoond dat de afzonderlijke poorten fouten blokkeren. Dezelfde commando's worden met `npm ci` in CI gestart; build volgt pas na statische en unittests. Chromium draait op pull requests, WebKit wekelijks en handmatig.

## Aanvullende arrow-functionmigratie

Na aanscherping van de normatieve kwaliteitsregel zijn 308 bestaande functiedeclaraties in 73 bestanden naar arrow functions omgezet. Ook de object-method syntax in de Vite-plugin is vervangen door een arrow-function property.

ESLint blokkeert nu:

- function declarations;
- function expressions;
- class methods;
- object-method syntax.

Een tijdelijke overtredingsprobe is correct met exitcode 1 geweigerd en daarna verwijderd. Na de migratie slaagden formatting, lint, typecheck, 11 unit-/componenttests, de architectuurcontrole, Knip, de productiebuild en de Chromium-/WebKit-smoke-test.

## Architectuur- en dependencyrapport

- Dependency Cruiser bewaakt cycles, game-naar-game, game-naar-app-context/infrastructure, platform-naar-game en domain-naar-React.
- Zeven bestaande `ProfileContext`-imports zijn begrensd in plaats van stil geaccepteerd; verwijderpad en deadline staan in `temporary-exceptions.md`.
- Knip bewaakt ongebruikte files, dependencies en onopgeloste imports. De gegenereerde UI-catalogus en het assetmanifest zijn tijdelijk expliciet afgebakend.
- Elf aantoonbaar ongebruikte runtimepackages en het ongebruikte `ImageWithFallback`-component zijn verwijderd.
- React Router is bijgewerkt naar 7.18.1 en Vite naar 6.4.3; `npm audit` rapporteert nul kwetsbaarheden.

## Bekende baselineafwijkingen

- De initiële JavaScriptbundle was circa 300 kB gzip en overschreed het doelbudget van 200 kB. Groep B heeft dit opgelost met route- en game-lazy-loading; de shell meet nu 101,56 kB gzip. Zie `group-b-report-2026-07.md`.
- Grote videoassets domineren de distributiegrootte. Assetpackaging, caching en budgets volgen in de latere PWA-/assetgroep.
- CI-uitvoerlinks zijn pas beschikbaar nadat de gebruiker commit en pusht. De eerste echte groene en bewust falende workflowrun moeten dan aan dit rapport worden toegevoegd.
