import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, BezemEscapeShell, UiBuildingBlocksPreview } from "./components";
import { beachWorld } from "./content";
import {
  AdventureSelectScreen,
  GameSettingsScreen,
  ParentDashboardScreen,
  RewardScreen,
  SceneBuilderScreen,
  StartScreen,
  VoiceSideScrollerScreen,
  WordChoiceScreen,
} from "./screens";
import { useBezemEscapeGameController } from "./state/useBezemEscapeGameController";

export const WoordenschatBezemEscapeGame = () => {
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
    screenPreview !== "dashboard" &&
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
          portraitUrl={beachBackgrounds.portrait}
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
          ) : screenPreview === "dashboard" ? (
            <ParentDashboardScreen onBackToMenu={actions.openModeSelect} />
          ) : screenPreview === "settings" ? (
            <GameSettingsScreen onBackToMenu={actions.openModeSelect} />
          ) : screenPreview === "start" ? (
            <StartScreen
              onOpenDashboard={() => actions.setScreen("dashboard")}
              onOpenSettings={() => actions.setScreen("settings")}
              onPlay={() => actions.setScreen("world-select")}
            />
          ) : screenPreview === "world-select" || screenPreview === "mode-select" ? (
            <AdventureSelectScreen
              onBackToStart={() => actions.setScreen("start")}
              onOpenDashboard={() => actions.setScreen("dashboard")}
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
            <WordChoiceScreen instructions={instructions.wordChoice} objects={beachWorld.objects} />
          ) : (
            <SceneBuilderScreen
              instructionText={instructionText}
              instructions={instructions.sceneBuilder}
              objects={beachWorld.objects}
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

WoordenschatBezemEscapeGame.displayName = "WoordenschatBezemEscapeGame";
