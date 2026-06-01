import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, BezemEscapeShell, UiBuildingBlocksPreview } from "./components";
import { beachWorld } from "./content";
import {
  GameSettingsScreen,
  ModeSelectScreen,
  ParentDashboardScreen,
  RaceScreen,
  RewardScreen,
  SceneBuilderScreen,
  StartScreen,
  WordChoiceScreen,
  WorldSelectScreen,
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
          ) : screenPreview === "world-select" ? (
            <WorldSelectScreen
              onBackToStart={() => actions.setScreen("start")}
              onSelectWorld={actions.selectWorld}
              onStartWorld={actions.openSelectedWorld}
              selectedWorldId={selectedWorld.id}
              worlds={worldDefinitions}
            />
          ) : screenPreview === "mode-select" ? (
            <ModeSelectScreen
              onChooseWorld={() => actions.setScreen("world-select")}
              onOpenDashboard={() => actions.setScreen("dashboard")}
              onOpenRewards={() => actions.setScreen("reward")}
              onOpenSettings={() => actions.setScreen("settings")}
              onStartRace={actions.startUnlockedRace}
              onStartSceneBuilder={() => actions.setScreen("scene-builder")}
              onStartWordChoice={() => actions.setScreen("word-choice")}
              raceUnlocked={raceUnlocked}
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

