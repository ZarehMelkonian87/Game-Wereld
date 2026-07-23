import type { GameRuntime } from "../../game-platform/contracts";
import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, BezemEscapeShell, UiBuildingBlocksPreview } from "./components";
import { beachWorld } from "./content";
import {
  AdventureSelectScreen,
  GameSettingsScreen,
  RewardScreen,
  SceneBuilderScreen,
  StartScreen,
  VoiceSideScrollerScreen,
  WordChoiceScreen,
} from "./screens";
import { useBezemEscapeGameController } from "./state/useBezemEscapeGameController";
import { GameRuntimeProvider } from "./runtime/GameRuntimeContext";

const StrandBezemEscapeExperience = () => {
  const { actions, viewModel } = useBezemEscapeGameController();
  const {
    instructionText,
    instructions,
    screenPreview,
    selectedWorld,
    showTrayLabels,
    showUiPreview,
    showZoneDevTools,
    spokenCommandPreviewText,
    worldDefinitions,
  } = viewModel;

  const isSceneBuilder =
    screenPreview !== "reward" &&
    screenPreview !== "settings" &&
    screenPreview !== "start" &&
    screenPreview !== "world-select" &&
    screenPreview !== "mode-select" &&
    screenPreview !== "voice-side-scroller" &&
    screenPreview !== "word-choice";

  return (
    <BezemEscapeShell world={beachWorld}>
      {!isSceneBuilder && (
        <BeachBackground
          landscapeUrl={beachBackgrounds.landscape}
          landscapeWebpUrl={beachBackgrounds.landscapeWebp}
          portraitUrl={beachBackgrounds.portrait}
          portraitWebpUrl={beachBackgrounds.portraitWebp}
        />
      )}
      {showUiPreview ? (
        <UiBuildingBlocksPreview />
      ) : (
        <>
          {screenPreview === "reward" ? (
            <RewardScreen
              onBackToMenu={actions.openModeSelect}
              onChooseWorld={() => actions.setScreen("world-select")}
              onPlayAgain={actions.resetRound}
            />
          ) : screenPreview === "settings" ? (
            <GameSettingsScreen onBackToMenu={actions.openModeSelect} />
          ) : screenPreview === "start" ? (
            <StartScreen
              onOpenSettings={() => actions.setScreen("settings")}
              onPlay={() => actions.setScreen("world-select")}
            />
          ) : screenPreview === "world-select" || screenPreview === "mode-select" ? (
            <AdventureSelectScreen
              onBackToStart={() => actions.setScreen("start")}
              onOpenRewards={() => actions.setScreen("reward")}
              onOpenSettings={() => actions.setScreen("settings")}
              onSelectWorld={actions.selectWorld}
              onStartMode={actions.startSelectedMode}
              selectedWorldId={selectedWorld.id}
              worlds={worldDefinitions}
            />
          ) : screenPreview === "voice-side-scroller" ? (
            <VoiceSideScrollerScreen onBackToMenu={actions.openModeSelect} />
          ) : screenPreview === "word-choice" ? (
            <WordChoiceScreen
              instructions={instructions.wordChoice}
              objects={beachWorld.objects}
              onBackToMenu={actions.openModeSelect}
            />
          ) : (
            <SceneBuilderScreen
              instructionText={instructionText}
              instructions={instructions.sceneBuilder}
              objects={beachWorld.objects}
              onBackToMenu={actions.openModeSelect}
              showTrayLabels={showTrayLabels}
              showZoneDevTools={showZoneDevTools}
              spokenCommandPreviewText={spokenCommandPreviewText}
              zones={beachWorld.zones}
            />
          )}
        </>
      )}
    </BezemEscapeShell>
  );
};

StrandBezemEscapeExperience.displayName = "StrandBezemEscapeExperience";

export const Game = ({ runtime }: { runtime: GameRuntime }) => (
  <GameRuntimeProvider runtime={runtime}>
    <StrandBezemEscapeExperience />
  </GameRuntimeProvider>
);

Game.displayName = "StrandBezemEscapeGame";
