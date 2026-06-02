import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, BezemEscapeShell, UiBuildingBlocksPreview } from "./components";
import { beachWorld } from "./content";
import {
  AdventureSelectScreen,
  GameSettingsScreen,
  ParentDashboardScreen,
  RaceScreen,
  RewardScreen,
  SceneBuilderScreen,
  StartScreen,
  WordChoiceScreen,
} from "./screens";
import { useBezemEscapeGameController } from "./state/useBezemEscapeGameController";

export const WoordenschatBezemEscapeGame = () => {
  const { actions, viewModel } = useBezemEscapeGameController();
  const {
    instructionText,
    instructions,
    raceUnlocked,
    screenPreview,
    selectedWorld,
    showTrayLabels,
    showUiPreview,
    showZoneDevTools,
    spokenCommandPreviewText,
    worldDefinitions,
  } = viewModel;

  return (
    <BezemEscapeShell world={beachWorld}>
      <BeachBackground
        landscapeUrl={beachBackgrounds.landscape}
        portraitUrl={beachBackgrounds.portrait}
      />
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
              raceUnlocked={raceUnlocked}
              selectedWorldId={selectedWorld.id}
              worlds={worldDefinitions}
            />
          ) : screenPreview === "race" ? (
            <RaceScreen
              instructions={instructions.race}
              objects={beachWorld.objects}
              onShowReward={() => actions.setScreen("reward")}
            />
          ) : screenPreview === "word-choice" ? (
            <WordChoiceScreen instructions={instructions.wordChoice} objects={beachWorld.objects} />
          ) : (
            <SceneBuilderScreen
              instructionText={instructionText}
              instructions={instructions.sceneBuilder}
              objects={beachWorld.objects}
              onStartRace={actions.startRaceFromSceneBuilder}
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
