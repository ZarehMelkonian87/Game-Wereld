# App Architectuur Voor Game Wereld

> **Let op:** dit document beschrijft de bestaande/transitie-architectuur. Bij tegenstrijdige regels gelden [Code Quality & Architecture Requirements](../../docs/code-quality-and-architecture.md) en het [nieuwe architectuurvoorstel](../../docs/architecture-proposal/README.md). Met name verplichte arrow functions, universele bestandslimieten, `displayName` en decoratieve `data-component`-attributen zijn niet langer projectbrede eisen.

Dit document beschrijft een nieuw architectuurvoorstel voor de hele app. Het vult `src/app/games/ARCHITECTURE.md` aan: dat bestaande document blijft de standaard voor individuele mini-games, terwijl dit document de bovenliggende app-structuur, gedeelde platformlaag, dataflow en ontwikkelregels vastlegt.

## Doel

Game Wereld moet kunnen groeien van een enkele uitgewerkte game naar veel kleine educatieve games, zonder dat elke nieuwe game opnieuw eigen menu's, knoppen, opslag, voortgang, profielbeheer en mobiele layout hoeft te verzinnen.

De architectuur moet daarom drie dingen tegelijk oplossen:

- De app blijft overzichtelijk voor algemene schermen zoals start, profielen, instellingen en voortgang.
- Alle mini-games volgen dezelfde technische standaard.
- Game-specifieke code blijft binnen de map van die game.

## Hoofdkeuze

Gebruik een gelaagde architectuur:

```txt
App Shell
  algemene routes, profielen, hoofdmenu, globale instellingen, voortgangsoverzicht

Game Platform
  gedeelde game-primitives, layout, invoer, opslag, profieltypes, progress events, speech helpers

Game Packages
  per game alle assets, content, screens, logica, state, docs en game-specifieke UI
```

Deze scheiding is belangrijk. Een menu-scherm van de app mag niet afhankelijk worden van details uit `woordenschat-bezem-escape`. Een mini-game mag wel gedeelde platformcomponenten gebruiken, maar moet zijn eigen gameplay, content en assets lokaal houden.

## Gewenste Topstructuur

```txt
src/
  app/
    App.tsx
    Root.tsx
    routes.tsx
    ARCHITECTURE.md

    screens/
      welcome/
      profile-select/
      avatar-select/
      home/
      games-list/
      game-play/
      settings/
      progress/
      shared/
      index.ts

    contexts/
      ProfileContext.tsx

    data/
      avatars.ts
      games.ts

    components/
      ui/

    game-platform/
      components/
      input/
      profile/
      progress/
      speech/
      storage/
      theme/
      types/
      utils/
      index.ts

    games/
      ARCHITECTURE.md
      README.md
      _template/
      woordenschat-bezem-escape/
      andere-game/

  styles/
    theme.css
    fonts.css
```

Dit sluit aan op de huidige repo. De globale screens zijn al feature-based opgesplitst. `src/app/game-platform` bestaat al als gedeelde laag. `src/app/games/woordenschat-bezem-escape` heeft al een eigen game-package met assets, docs, logic, state en screens.

## Verantwoordelijkheden Per Laag

| Laag                      | Mag Bevatten                                                                                    | Mag Niet Bevatten                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/app/screens`         | Globale app-schermen, profielkeuze, hoofdmenu, game-lijst, voortgang, settings                  | Gameplay-logica, game-assets, game-specifieke UI                             |
| `src/app/game-platform`   | Herbruikbare game UI, input types, storage adapters, progress types, speech types, theme tokens | Concrete opdrachten, concrete werelden, game-specifieke regels               |
| `src/app/games/<game-id>` | Game screens, content, assets, docs, state hooks, pure logic                                    | Globale profielroutering, app-shell navigatie, gedeelde primitive definities |
| `src/app/components/ui`   | Lage UI-bouwstenen uit het algemene componentensysteem                                          | Game-stijlregels of directe gameplay UI                                      |
| `src/app/data`            | App-catalogus zoals thema's, avatars en game metadata                                           | Grote game-content of leveldata                                              |
| `src/styles`              | Globale CSS, fonts, basis design tokens                                                         | Per-game layout of per-game component styling                                |

## App Shell

De App Shell is verantwoordelijk voor alles rondom de app zelf:

- routing;
- startscherm;
- profielkeuze;
- avatarselectie;
- hoofdmenu;
- wereld/thema overzicht;
- instellingen;
- algemeen voortgangsoverzicht;
- toegang tot mini-games.

De App Shell moet klein blijven. Hij start een game, maar bepaalt niet hoe die game werkt.

### Routepatroon

De huidige routes blijven logisch:

```txt
/
/profiles
/avatar
/home
/games/:theme
/games/:theme/:gameId
/settings
/progress
```

Voor de toekomst is het beter dat `GamePlayScreen` geen handmatige `if gameId === ...` lijst wordt. Het moet uiteindelijk werken met een game registry:

```ts
export const gameRegistry = {
  "woordenschat-bezem-escape": {
    config,
    Component: WoordenschatBezemEscapeGame,
  },
};
```

Dan kan een nieuwe game worden toegevoegd zonder `GamePlayScreen` telkens te herschrijven.

## Globale Screens

Elke globale screen gebruikt dezelfde feature-map structuur:

```txt
src/app/screens/<screen-name>/
  ScreenNameScreen.tsx
  ScreenNameHeader.tsx
  ScreenNameCard.tsx
  ScreenNameGrid.tsx
  screenNameHelpers.ts
  index.ts
```

Regels:

- Screen components verbinden route, context en layout.
- Kleine onderdelen worden losse componenten.
- Herbruikbare app-screen helpers gaan naar `src/app/screens/shared`.
- Geen gameplay-code in globale screens.
- Alle components zijn arrow functions.
- Components krijgen `displayName`.
- Root nodes krijgen waar nuttig `data-component`.

## Game Platform

`src/app/game-platform` is de gedeelde technische basis voor alle games. Alles wat twee of meer games nodig hebben, hoort hier.

### Platform Onderdelen

```txt
src/app/game-platform/
  components/
    primitives/
      GameButton.tsx
      GameIconButton.tsx
      GamePanel.tsx
      GameProgressBar.tsx
      GameBadge.tsx
      GameStarCounter.tsx
      GameScrollArea.tsx

    layout/
      GameShell.tsx
      GameSafeArea.tsx
      GameStage.tsx
      GameTopHud.tsx

    gameplay/
      InstructionBubble.tsx
      AudioButton.tsx
      HintButton.tsx
      ObjectTray.tsx
      StickerObject.tsx
      RewardSummary.tsx

  input/
  profile/
  progress/
  speech/
  storage/
  theme/
  types/
  utils/
```

### Waarom Deze Laag Nodig Is

Zonder platformlaag gaat elke mini-game eigen knoppen, eigen HUD, eigen opslag en eigen progress data maken. Dan wordt de app moeilijk te onderhouden en voelt elke game anders. Met een platformlaag krijgt elke game dezelfde basiservaring, terwijl de inhoud en gameplay per game verschillend blijven.

## Componentregels

Voor de hele app gelden deze regels:

- Gebruik alleen arrow functions.
- Houd components klein.
- Components tonen UI en ontvangen kant-en-klare props.
- Business logic staat in `logic/`, controller hooks of helper files.
- Geen grote screen-bestanden met honderden regels JSX.
- Geef elk belangrijk component `displayName`.
- Gebruik `data-component` voor DevTools.
- Gebruik `data-slot` voor belangrijke sub-elementen.
- Gebruik gedeelde primitives in plaats van per scherm random styling.

Voorbeeld:

```tsx
type ActionButtonProps = {
  label: string;
  onClick: () => void;
};

export const ActionButton = ({ label, onClick }: ActionButtonProps) => (
  <button data-component="ActionButton" onClick={onClick}>
    <span data-slot="label">{label}</span>
  </button>
);

ActionButton.displayName = "ActionButton";
```

## Screen En Controller Pattern

Voor grotere schermen gebruiken we een vast patroon:

```txt
screens/scene-builder/
  SceneBuilderScreen.tsx
  SceneBuilderLayout.tsx
  SceneBoard.tsx
  SceneHud.tsx
  ObjectLayer.tsx

state/
  useSceneBuilderController.ts

logic/
  scenePlacement.ts
  scoring.ts
  commandParser.ts
```

De screen doet alleen dit:

- controller hook aanroepen;
- props doorgeven aan kleine components;
- navigatie afhandelen.

De controller levert een view model en acties:

```ts
{
  viewModel: {
    currentTask,
    placedObjects,
    speed,
    stars,
    feedback,
  },
  actions: {
    placeObject,
    requestHint,
    replayInstruction,
    finishRound,
  },
}
```

De pure spelregels blijven testbaar in `logic/`.

## Game Package Standaard

Elke game krijgt dezelfde basis:

```txt
src/app/games/<game-id>/
  game.config.ts
  index.tsx
  types.ts

  assets/
    backgrounds/
    objects/
    icons/
    audio/
    instructions/
    logos/
    asset-manifest.ts

  content/
    worlds.data.ts
    levels.data.ts
    tasks.data.ts
    rewards.data.ts

  screens/
    start/
    world-select/
    mode-select/
    gameplay/
    reward/
    dashboard/
    settings/
    index.ts

  components/
    ui/
    layout/
    gameplay/
    index.ts

  logic/
    scoring.ts
    progress.ts
    rewards.ts
    commandParser.ts

  state/
    useGameController.ts

  doc/
    game-design-document.md
    tasks.md
    mvp-scope.md
```

Niet elke game hoeft alle folders direct vol te hebben, maar de structuur moet hetzelfde blijven. Dat maakt nieuwe games voorspelbaar.

## Game Config En Registry

Elke game krijgt een vaste config:

```ts
export const gameConfig = {
  id: "woordenschat-bezem-escape",
  title: "+1 Woordenschat Bezem Escape",
  category: "language",
  ageRange: "4-8",
  defaultWorldId: "beach",
  supportedOrientations: ["portrait", "landscape"],
  hasSpeechInput: true,
  hasProgressDashboard: true,
};
```

De App Shell gebruikt deze config voor:

- game-lijst;
- filters per thema;
- badges zoals speech input of voortgang;
- bepalen of een dashboard beschikbaar is;
- later lazy loading per game.

Verdediging: metadata hoort niet verspreid te staan in `data/games.ts`, `README.md`, routes en losse components. Een vaste config voorkomt dubbele waarheid.

## Data En Content

Er zijn drie soorten data:

### 1. App Catalogus

Staat in `src/app/data`.

Voorbeelden:

- thema's;
- game metadata voor menu's;
- avatar metadata.

### 2. Game Content

Staat in `src/app/games/<game-id>/content`.

Voorbeelden:

- opdrachten;
- levels;
- werelden;
- objecten;
- beloningen;
- categorieen.

### 3. Voortgang En Sessiedata

Staat niet hardcoded in content files. Games rapporteren oefenmomenten aan het platform.

Aanbevolen eventvorm:

```ts
export type PracticeEventV1 = {
  schemaVersion: 1;
  id: EventId;
  occurredAt: string;
  profileId: ProfileId;
  gameId: GameId;
  sessionId: SessionId;
  contentVersion: string;
  taskId: TaskId;
  skillIds: string[];
  outcome: "correct" | "incorrect" | "skipped";
  attemptNumber: number;
  responseTimeMs?: number;
  assistance: Array<"instruction-replay" | "visual-hint" | "spoken-help">;
};
```

Dashboard data wordt daarna afgeleid uit events. Dat is beter dan losse percentages direct opslaan, omdat we later altijd opnieuw kunnen berekenen.

## Profielen En Opslag

Voor nu is lokale opslag goed, omdat de app prive en lokaal bedoeld is. De architectuur moet wel duidelijk maken waar opslag hoort:

```txt
storage/
  contracts.ts
  progressProjector.ts
  runtimeAdapters.ts

game-platform/progress/
  progress.types.ts
```

`ProfileContext` mag voorlopig blijven als React-integratie, maar de types en opslagregels moeten stap voor stap naar `game-platform` verhuizen. Dan kunnen screens en games dezelfde profieldefinities gebruiken.

Verdediging: als profieldata alleen in een React context file leeft, wordt het moeilijker om progress, export, dashboards en game sessions netjes te delen.

## Assets

Per game geldt:

- productie-assets staan in `assets/`;
- concept en bronmateriaal staan in `concept-art/` of `doc/`;
- assets worden via een manifest geimporteerd;
- components importeren niet overal willekeurige image paths;
- ongebruikte assets worden verwijderd of duidelijk als concept gemarkeerd.

Voorbeeld:

```txt
assets/
  asset-manifest.ts
  backgrounds/
  objects/
  icons/
  instructions/
```

Verdediging: assets groeien snel. Een manifest voorkomt zoekwerk, foutieve imports en onduidelijke bestandsnamen.

## UI Standaard

Er zijn drie UI-niveaus:

### 1. Algemene UI

`src/app/components/ui`

Dit zijn basiscomponenten uit het algemene UI-systeem. Gebruik ze alleen als lage bouwstenen.

### 2. Game Platform UI

`src/app/game-platform/components`

Dit zijn de standaard gameknoppen, panels, HUD-elementen, progress bars, trays en gameplay helpers.

### 3. Game-Specifieke UI

`src/app/games/<game-id>/components`

Alleen voor onderdelen die echt bij die game horen, zoals een bezem-speedmeter, strand-objectkaart of specifieke mascotte-layout.

Verdediging: dit voorkomt dat elk scherm zijn eigen knopstijl krijgt. We kunnen visuele kwaliteit centraal verbeteren zonder alle games aan te raken.

## Mobiele Layout

Alle schermen moeten mobile-first blijven:

- Gebruik safe-area containers.
- Ondersteun portrait en landscape.
- Geen horizontale overflow op telefoon.
- Touch targets zijn groot genoeg voor kinderen.
- Scrollbare trays moeten echt scrollbaar zijn op mobiel en desktop.
- HUD, opdrachtbubble en actieknoppen mogen gameplay niet blokkeren.

Voor alle game screens moet `GameShell`, `GameSafeArea` en `GameStage` de standaard basis zijn.

## Spraak, Audio En Video

Spraakherkenning en microfoonrechten horen niet direct in een screen component.

Structuur:

```txt
game-platform/speech/
  speech.types.ts

games/<game-id>/logic/
  speech-recognition.ts
  spoken-command-parser.ts
  voice-privacy.ts
```

Voor game-specifieke Nederlandse zinnen blijft de parser lokaal in de game. Voor algemene toestemming, privacytekst en technische support kan het platform helpers leveren.

Video-instructies horen in `assets/instructions/` en worden gekoppeld aan content via task id. Een opdracht kan dan deze data hebben:

```ts
{
  id: "lp-001",
  prompt: "Zet de boot in de zee.",
  instructionVideoId: "zet-de-boot-in-de-zee",
  hintVideoIds: ["zoek-de-boot", "kijk-naar-het-plaatje-dat-oplicht-boot"],
}
```

Verdediging: tekst, audio en video horen bij de opdrachtdata, niet verspreid in UI-components.

## Voortgang En Dashboard

Het dashboard moet observaties tonen, geen diagnose.

Standaard voortgangsniveaus:

- `gaat-goed`;
- `oefenen`;
- `met-hulp`;
- `nog-moeilijk`.

Alle games rapporteren dezelfde basisvelden:

- profiel id;
- game id;
- sessie id;
- opdracht id;
- leergebied;
- moeilijkheid;
- resultaat;
- hints;
- audioherhalingen;
- pogingen;
- geoefende items;
- datum/tijd.

Game-specifieke velden mogen in een `metadata` object, maar dashboards moeten zoveel mogelijk op de standaardvelden draaien.

Verdediging: zo kan het algemene voortgangsscherm later alle games tonen zonder per game aparte dashboardlogica.

## Imports En Exports

Elke folder krijgt een `index.ts` wanneer meerdere onderdelen publiek gebruikt worden.

Regels:

- Binnen een feature mag direct lokaal geimporteerd worden.
- Buiten een feature importeer je via `index.ts`.
- Game-specifieke internals worden niet vanuit globale app screens geimporteerd.
- Het platform exporteert publieke API via `src/app/game-platform/index.ts`.

Goed:

```ts
import { GameButton, GameShell } from "../../game-platform";
```

Niet goed:

```ts
import { GameButton } from "../../game-platform/components/primitives/GameButton";
```

Uitzondering: binnen dezelfde folder of tijdens lokale refactor mag direct importeren tijdelijk.

## Test En QA Standaard

Elke structurele wijziging moet minimaal draaien:

```bash
npx tsc --noEmit
npm run build
```

Voor visuele of mobiele wijzigingen:

- open de relevante route in de browser;
- check portrait;
- check landscape;
- check dat er geen horizontale scroll is;
- check dat touch controls bruikbaar blijven;
- check protected routes zonder actief profiel.

Voor pure logic:

- parser tests;
- scoring tests;
- progress mapping tests;
- content validatie.

## Migratieplan

### Stap 1: Document Vastleggen

Maak dit document leidend voor nieuwe code.

### Stap 2: Game Registry Toevoegen

Vervang de handmatige game switch in `GamePlayScreen` door een registry.

### Stap 3: Profile Types Naar Platform

Verplaats profieltypes en progress types uit `ProfileContext` naar `game-platform/profile` en `game-platform/progress`.

### Stap 4: Storage Adapter Centraal Maken

Laat `ProfileContext` gebruikmaken van `browserGameStorage`.

### Stap 5: App Catalogus Normaliseren

Laat `src/app/data/games.ts` zoveel mogelijk lezen uit game configs of een centrale catalogus die config-velden hergebruikt.

### Stap 6: Nieuwe Games Alleen Via Template

Elke nieuwe game start vanuit `src/app/games/_template`.

### Stap 7: Bestaande Games Geleidelijk Migreren

Niet alles hoeft tegelijk. Elke keer dat een game wordt aangeraakt, wordt hij dichter naar de standaard gebracht.

## Implementatiestatus

Status op 23 juli 2026:

| Onderdeel                            | Status      | Opmerking                                                                                               |
| ------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------- |
| Globale screen feature-mappen        | Gedaan      | `src/app/screens` is opgesplitst per scherm met gedeelde helpers in `shared/`.                          |
| Game platform basis                  | Gedaan      | `src/app/game-platform` bevat contracten, primitives, layout, media/speech-poorten en runtime-adapters. |
| Game registry                        | Gedaan      | De lazy registry valideert manifesten en canonical game-id's.                                           |
| Game launcher                        | Gedaan      | `GameHost` bezit loading, capabilities, sessies en foutgrenzen.                                         |
| Profile types naar platform          | Gedaan      | `Avatar`, `Profile`, `ProfileSettings` en `GameProgress` komen uit `game-platform`.                     |
| Profile repositories                 | Gedaan      | Profielen, settings, sessies, events en projecties lopen via repositorycontracten boven IndexedDB.      |
| Practice event basis                 | Gedaan      | Alle modi schrijven privacyveilige `PracticeEventV1`-events via `GameRuntime.practice`.                 |
| App catalogus uit configs            | Nog te doen | `src/app/data/games.ts` bevat nog handmatige metadata voor veel games.                                  |
| Alle placeholder games naar template | Nog te doen | Veel kleine games hebben nog alleen een eenvoudige `index.tsx` en `README.md`.                          |
| Dashboard op practice events         | Gedaan      | Periodecijfers, activiteit, mijlpalen en uitleg komen uit events en projectorversie.                    |

## Verdediging Van Deze Architectuur

### Schaalbaarheid

De app kan veel games krijgen zonder dat `routes.tsx`, algemene screens of globale data steeds groter worden. Games worden packages met een vaste publieke ingang.

### Onderhoudbaarheid

Kleine components, controller hooks en pure logic files maken code sneller leesbaar. Een bug in scoring of parserlogica zit dan niet verstopt in JSX.

### UX Consistentie

Shared primitives zorgen dat buttons, panels, HUD, badges en progress bars dezelfde kwaliteit houden. Per game mag stijl aangepast worden via props of theme, niet door elke keer nieuwe random UI te maken.

### Veiligheid En Privacy

Profielen en voortgang blijven lokaal en per kind gescheiden. Spraak en microfoon worden expliciet behandeld als technische/privacy-laag, niet als losse knop in een screen.

### Testbaarheid

Pure functies in `logic/` zijn makkelijk te testen. React components blijven vooral presentatie. Content kan apart gevalideerd worden.

### Toekomstbestendigheid

Als later sync, export, ouderdashboard, lazy loading of meer games nodig zijn, hoeft de basis niet opnieuw bedacht te worden. De lagen bestaan dan al.

## Belangrijkste Regel

Nieuwe code moet altijd eerst kiezen waar het hoort:

- Is het algemeen appgedrag? Dan hoort het in `src/app/screens`, `src/app/data` of `src/app/contexts`.
- Is het herbruikbaar voor meerdere games? Dan hoort het in `src/app/game-platform`.
- Is het specifiek voor een game? Dan hoort het in `src/app/games/<game-id>`.
- Is het alleen documentatie of concept? Dan hoort het in `doc/` of `concept-art/`.

Deze regel houdt de app schoon terwijl we stap voor stap meer games toevoegen.
