# Technische baseline — 23 juli 2026

Deze baseline hoort bij taak `IMP-A01` uit de [implementatietakenlijst](../architecture-proposal/11-implementatie-takenlijst.md). Zij beschrijft de toestand vóór invoering van de kwaliteitsstraat en vormt het vergelijkingspunt voor latere architectuur- en performancewijzigingen.

## Omgeving

| Onderdeel       | Waarde                                   |
| --------------- | ---------------------------------------- |
| Datum           | 23 juli 2026                             |
| Platform        | macOS Darwin 23.6.0, Apple Silicon arm64 |
| Node.js         | 22.21.1                                  |
| npm             | 10.9.4                                   |
| Package manager | npm met lockfile versie 3                |

De ondersteunde ontwikkelruntime is vastgelegd in `.nvmrc` en `package.json#engines`.

## Reproduceerbare commando's

```sh
npm ci
npm run build
npx tsc --noEmit
npm audit --omit=dev
du -sk dist
find dist -type f | wc -l
```

## Resultaten vóór reparatie

| Controle               | Resultaat                                                                |
| ---------------------- | ------------------------------------------------------------------------ |
| `npm ci`               | geslaagd; 288 packages geïnstalleerd                                     |
| `npm run build`        | geslaagd in circa 2,54 seconden                                          |
| `npx tsc --noEmit`     | gefaald met 27 gerapporteerde TypeScript-errors                          |
| `npm audit --omit=dev` | één high-severity bevinding in `react-router` 7.13.0; update beschikbaar |

De typefouten vallen in vijf groepen:

1. ontbrekende exports voor `PlacedObject` en `SceneCompletionSummary`;
2. incompatibele React ref-types;
3. verouderde properties tussen scene-builderhooks en consumers;
4. niet-overeenkomende practice-resultwaarden en ontbrekende rewardvariabelen;
5. ongebruikte imports/parameters en verouderde command-parserinput.

De volledige ruwe terminaloutput wordt niet als blijvend architectuurdocument opgeslagen; de fouten zijn reproduceerbaar met het typecheckcommando en worden door `IMP-A03` opgelost.

## Productiebundel vóór optimalisatie

| Metriek                     |                                 Baseline |
| --------------------------- | ---------------------------------------: |
| Totale `dist`-grootte       | 182.278.864 bytes (178.364 KiB via `du`) |
| Aantal distributiebestanden |                                      120 |
| JavaScript                  |      2 bestanden, 1.018.593 bytes totaal |
| Initiële JavaScript-entry   |              1.016,01 kB; 299,06 kB gzip |
| CSS                         |                 197,59 kB; 28,31 kB gzip |
| MP4                         |   81 bestanden, 169.572.845 bytes totaal |
| PNG                         |    33 bestanden, 10.286.235 bytes totaal |
| MP3                         |               1 bestand, 1.201.214 bytes |

Vite waarschuwt dat de initiële JavaScriptchunk groter is dan 500 kB ongecomprimeerd. De build bevat nog geen lazy gamechunk.

### Vijf grootste bestanden

| Bestand                                               |     Bytes |
| ----------------------------------------------------- | --------: |
| `lp-003-feedback-bal-ligt-op-het-strand-*.mp4`        | 2.542.892 |
| `lp-002-opdracht-zet-de-dolfijn-in-de-zee-*.mp4`      | 2.415.126 |
| `lp-004-feedback-vuurtoren-staat-op-het-eiland-*.mp4` | 2.374.432 |
| `lp-009-feedback-zandkasteel-naast-schelp-*.mp4`      | 2.372.878 |
| `cw-005-opdracht-waar-is-de-parasol-*.mp4`            | 2.329.878 |

## Doelmatrix voor kwaliteitscontrole

| Project           | Browsermotor | Profiel         | Doel                                                   |
| ----------------- | ------------ | --------------- | ------------------------------------------------------ |
| `chromium-tablet` | Chromium     | 1024×768, touch | snelle PR-smoke en primaire ontwikkelflow              |
| `webkit-tablet`   | WebKit       | 1024×768, touch | Safari/iPad-risico's rond media, storage en interactie |

Firefox en aanvullende portrait-/landscapeprojecten worden toegevoegd wanneer de kernsmoke stabiel is, conform het architectuurvoorstel.

## Handmatige baselineflow

1. Open `/` en kies de startactie.
2. Maak een profiel met naam en avatar.
3. Open het woordenschatthema en start `magisch-strand-avontuur`.
4. Open een beschikbare wereld en start een spelmodus.
5. Voltooi minimaal één opdracht met de visuele bediening.
6. Ga veilig terug naar menu/home.
7. Open voortgang en controleer dat het scherm zonder runtimefout rendert.
8. Herlaad de app en controleer dat het profiel behouden is.

Deze flow is in `IMP-A05` de basis voor browserautomatisering. In deze baseline is zij nog niet geautomatiseerd.

## Bekende uitgangsrisico's

- Typecheck is rood ondanks een groene Vite-build.
- Er zijn nog geen unit-, component- of end-to-endtests.
- Er is nog geen CI-, lint-, format- of architectuurcontrole.
- De game wordt statisch in de initiële appbundle geïmporteerd.
- De handgeschreven service worker cachet grote instructiemedia niet.
- De dependencyset bevat ongebruikte packages en een oplosbare React Router-bevinding.
