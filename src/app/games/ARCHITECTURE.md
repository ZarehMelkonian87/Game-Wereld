# Game Architectuur Voor Alle Mini-Games

Dit document beschrijft de standaard architectuur voor `+1 Woordenschat Bezem Escape` en alle toekomstige mini-games in de app.

Het doel is dat elke game dezelfde technische structuur volgt, zodat nieuwe games later sneller, schoner en beter onderhoudbaar gebouwd kunnen worden.

## Hoofddoel

Elke mini-game moet worden gebouwd als onderdeel van een gedeeld game-platform.

Dat betekent:

- Herbruikbare UI-bouwstenen staan centraal op een gedeelde plek.
- Elke game heeft dezelfde mapstructuur.
- Spel-logica staat niet in React-components.
- Components blijven klein en goed leesbaar in DevTools.
- Alle functies worden geschreven als arrow functions.
- Elke game gebruikt data, assets, logica en screens op dezelfde manier.

## Globale Structuur

```txt
src/app/
  game-platform/
    components/
      primitives/
      layout/
      gameplay/
    theme/
    storage/
    speech/
    input/
    profile/
    progress/
    types/

  games/
    ARCHITECTURE.md
    _template/
    woordenschat-bezem-escape/
    andere-game/
```

## Gedeeld Game Platform

Alles wat meerdere games kunnen gebruiken, hoort in `src/app/game-platform`.

### Components

```txt
src/app/game-platform/components/
  primitives/
    GameButton.tsx
    GameIconButton.tsx
    GamePanel.tsx
    GameProgressBar.tsx
    GameBadge.tsx
    GameModal.tsx
    GameScrollArea.tsx

  layout/
    GameShell.tsx
    GameStage.tsx
    GameSafeArea.tsx
    GameTopHud.tsx
    GameScreenFrame.tsx

  gameplay/
    InstructionBubble.tsx
    AudioButton.tsx
    HintButton.tsx
    ObjectTray.tsx
    StickerObject.tsx
    RewardSummary.tsx
```

Deze components zijn visueel en generiek. Een game mag kleuren, iconen, labels en assets meegeven via props of theme, maar mag niet steeds opnieuw eigen random buttons, panels of HUD-elementen bouwen.

## Standaard Game Structuur

Elke mini-game krijgt dezelfde basisstructuur:

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
    logos/

  content/
    worlds.data.ts
    levels.data.ts
    tasks.data.ts
    objects.data.ts
    rewards.data.ts

  screens/
    start/
    world-select/
    scene-builder/
    word-choice/
    race/
    reward/
    dashboard/
    settings/

  components/
    game-specific-component/

  logic/
    commandParser.ts
    scenePlacement.ts
    scoring.ts
    rewards.ts
    progressMapper.ts

  state/
    useSceneBuilderController.ts
    useRaceController.ts
    useDashboardController.ts

  docs/
```

## Game Config

Elke game krijgt een `game.config.ts`.

Deze file beschrijft de game op een vaste manier:

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

Het hoofdmenu en toekomstige game-lijsten moeten zoveel mogelijk uit deze config kunnen lezen.

## Component Regels

Voor alle nieuwe components gelden deze regels:

- Gebruik alleen arrow functions.
- Houd components klein.
- Een component heeft een duidelijke taak.
- Components bevatten geen business logic.
- Components ontvangen kant-en-klare props.
- Elk component krijgt `displayName`.
- De root DOM-node krijgt `data-component`.
- Belangrijke onderdelen krijgen `data-slot`.
- DevTools moet makkelijk leesbaar blijven.

Voorbeeld:

```tsx
type GameButtonProps = {
  label: string;
  tone?: "green" | "blue" | "yellow";
  icon?: React.ReactNode;
  onClick: () => void;
};

export const GameButton = ({ icon, label, tone = "green", onClick }: GameButtonProps) => (
  <button data-component="GameButton" data-tone={tone} onClick={onClick}>
    <span data-slot="icon">{icon}</span>
    <span data-slot="label">{label}</span>
  </button>
);

GameButton.displayName = "GameButton";
```

## Scherm Regels

Een screen component mag alleen layout en verbinding doen.

Goed patroon:

```txt
SceneBuilderScreen.tsx
  gebruikt useSceneBuilderController()
  toont SceneBuilderLayout
  toont InstructionBubble
  toont ObjectTray
  toont SceneBoard
```

Niet doen:

```txt
SceneBuilderScreen.tsx
  bevat parser-logica
  bevat localStorage-logica
  bevat scoreberekening
  bevat 1000 regels JSX
```

## Controller Pattern

Elke grotere screen krijgt een controller hook.

Voorbeeld:

```txt
screens/scene-builder/
  SceneBuilderScreen.tsx
  SceneBuilderLayout.tsx
  SceneBoard.tsx
  SceneObjectLayer.tsx
  SceneBuilderHud.tsx

state/
  useSceneBuilderController.ts
```

De controller levert:

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
    handleObjectSelect,
    handleObjectDrop,
    handleSpokenCommand,
    handleHint,
    handleNextTask,
  },
}
```

De screen toont alleen de UI en roept actions aan.

## Logic Files

Alle echte game-logica hoort in `logic/`.

Voorbeelden:

```txt
logic/
  commandParser.ts
  scenePlacement.ts
  scoring.ts
  rewards.ts
  progressMapper.ts
```

Regels:

- Logic files importeren geen React.
- Logic functions zijn pure functies waar mogelijk.
- Logic is testbaar zonder browser.
- Scoring, parsing en progress mapping staan niet in components.

Voorbeeld:

```ts
export const parseDutchPlacementCommand = (text: string) => {
  return {
    objectId: "boat",
    spatialConcept: "in",
    targetZoneId: "sea",
  };
};
```

## Data Files

Alle opdrachten, werelden, objecten en beloningen staan in `content/`.

```txt
content/
  worlds.data.ts
  levels.data.ts
  tasks.data.ts
  objects.data.ts
  rewards.data.ts
```

Voordelen:

- Nieuwe content toevoegen kan zonder UI-code aan te raken.
- Logopedische taken blijven overzichtelijk.
- Later kunnen we content eventueel uit JSON of CMS laden.

## Assets

Elke game bewaart eigen assets in de game-map.

```txt
assets/
  backgrounds/
  objects/
  icons/
  audio/
  logos/
```

Regels:

- Object-assets krijgen duidelijke namen.
- Productie-assets staan gescheiden van concept-art.
- Transparante sticker-assets staan in een vaste map.
- Source sheets blijven bewaard, maar de UI gebruikt losse uitgesneden productie-assets.

## Shared Theme

Kleuren, button-stijlen en HUD-stijlen horen niet los in elk scherm te staan.

Gebruik:

```txt
game-platform/theme/
  gameTheme.types.ts
  defaultGameTheme.ts
  buttonStyles.ts
```

Een game mag een eigen theme meegeven:

```ts
export const bezemEscapeTheme = {
  primary: "green",
  secondary: "blue",
  reward: "yellow",
  danger: "coral",
  panel: "white",
};
```

Maar components blijven hetzelfde:

```tsx
<GameButton tone="primary" icon={<PlayIcon />} label="Spelen" />
```

## Voortgang En Opslag

Opslag moet centraal en consistent worden geregeld.

```txt
game-platform/storage/
  profileStorage.ts
  progressStorage.ts

game-platform/profile/
  profile.types.ts

game-platform/progress/
  progress.types.ts
```

Een component mag niet direct `localStorage` gebruiken.

Goed:

```ts
saveGameProgress(profileId, gameId, progress);
```

Niet:

```ts
localStorage.setItem("iets", JSON.stringify(data));
```

## Spraak En Audio

Spraakherkenning en audio moeten gedeeld worden, omdat toekomstige taal-games dit ook nodig hebben.

```txt
game-platform/speech/
  speechRecognition.ts
  speechSynthesis.ts
  microphonePermission.ts
```

Game-specifieke zinsparser blijft wel in de game zelf:

```txt
games/woordenschat-bezem-escape/logic/commandParser.ts
```

## Input En Drag-And-Drop

Mobiele input moet centraal worden opgelost.

```txt
game-platform/input/
  pointerInput.ts
  dragDrop.ts
  swipeControls.ts
```

Hiermee voorkomen we dat elke game eigen touch/mouse-bugs krijgt.

## Naamgeving

Gebruik vaste naamgeving:

```txt
PascalCase.tsx     React components
camelCase.ts       helpers en logic
*.data.ts          content data
*.types.ts         types
*.controller.ts    controller helpers
useXController.ts  screen controller hooks
```

Voorbeelden:

```txt
SceneBuilderScreen.tsx
SceneBuilderHud.tsx
useSceneBuilderController.ts
scenePlacement.ts
tasks.data.ts
```

## Maximale Bestandsgrootte

Richtlijnen:

- Component: maximaal 100-120 regels.
- Screen: maximaal 200-250 regels.
- Controller hook: maximaal 250-300 regels.
- Logic file: splitsen zodra meerdere verantwoordelijkheden ontstaan.

Als een bestand groter wordt, splitsen we het op.

## Migratieplan Voor De Huidige Game

### Fase A: Shared Platform Aanmaken

- [ ] Maak `src/app/game-platform/`.
- [ ] Maak `components/primitives/`.
- [ ] Maak `components/layout/`.
- [ ] Maak `components/gameplay/`.
- [ ] Maak `theme/`, `storage/`, `speech/`, `input/`.

### Fase B: UI Primitives Verplaatsen

- [ ] Zet `PanelCard` om naar `GamePanel`.
- [ ] Zet `PrimaryActionButton` om naar `GameButton`.
- [ ] Zet `HudIconButton` om naar `GameIconButton`.
- [ ] Zet `ProgressBar` om naar `GameProgressBar`.
- [ ] Zet `InstructionBubble` om naar gedeelde gameplay component.
- [ ] Zet `ObjectTrayContainer` om naar gedeelde `ObjectTray`.

### Fase C: Grote Screens Opsplitsen

- [ ] Splits `SceneBuilderScreen.tsx`.
- [ ] Bouw en splits de nieuwe `VoiceSideScrollerScreen`.
- [ ] Splits `ParentDashboardScreen.tsx`.
- [ ] Splits `RewardScreen.tsx`.
- [ ] Splits `WordChoiceScreen.tsx`.
- [ ] Splits `GameSettingsScreen.tsx`.

### Fase D: Logica Uit UI Halen

- [ ] Verplaats scene-builder state naar `useSceneBuilderController`.
- [ ] Verplaats voice side-scroller state naar `useVoiceSideScrollerController`.
- [ ] Verplaats dashboard berekeningen naar `useDashboardController`.
- [ ] Verplaats scoreberekening naar `logic/scoring.ts`.
- [ ] Verplaats progress mapping naar `logic/progressMapper.ts`.

### Fase E: Content Structuur Opschonen

- [ ] Maak `content/objects.data.ts`.
- [ ] Maak `content/tasks.data.ts`.
- [ ] Maak `content/worlds.data.ts`.
- [ ] Maak `content/rewards.data.ts`.
- [ ] Laat screens alleen data consumeren, niet zelf content bouwen.

### Fase F: Template Voor Nieuwe Games

- [ ] Update `games/_template/`.
- [ ] Voeg standaard `game.config.ts` toe.
- [ ] Voeg standaard `content/`, `logic/`, `state/`, `screens/` toe.
- [ ] Voeg voorbeeldcomponenten toe volgens arrow-function regels.

### Fase G: Kwaliteitscontrole

- [ ] Voeg check toe voor `function` declarations in game-code.
- [ ] Voeg check toe voor te grote screen files.
- [ ] Test TypeScript met `npx tsc --noEmit`.
- [ ] Test build met `npm run build`.
- [ ] Test mobile portrait.
- [ ] Test mobile landscape.

## Acceptatiecriteria

Een game voldoet aan de architectuur als:

- [ ] De game heeft een `game.config.ts`.
- [ ] De game gebruikt shared primitives uit `game-platform`.
- [ ] Components zijn klein en visueel gericht.
- [ ] Screen files bevatten geen zware business logic.
- [ ] Logic files importeren geen React.
- [ ] Content staat in `content/*.data.ts`.
- [ ] Assets staan netjes in `assets/`.
- [ ] Alle nieuwe functions zijn arrow functions.
- [ ] Components hebben `displayName`.
- [ ] Belangrijke components hebben `data-component`.
- [ ] Directe opslag gebeurt niet in UI-components.
- [ ] De game werkt in portrait en landscape.

## Prioriteit Voor Nu

Voor `+1 Woordenschat Bezem Escape` is de beste volgorde:

1. Eerst `game-platform` aanmaken.
2. Daarna shared primitives maken.
3. Daarna `SceneBuilderScreen.tsx` opsplitsen.
4. Daarna de nieuwe `VoiceSideScrollerScreen` bouwen volgens het nieuwe concept.
5. Daarna `ParentDashboardScreen.tsx` opsplitsen.
6. Daarna content en state verder structureren.
7. Daarna `_template` aanpassen voor toekomstige games.

Hiermee wordt de huidige game beter onderhoudbaar en krijgen alle volgende games direct dezelfde sterke basis.
