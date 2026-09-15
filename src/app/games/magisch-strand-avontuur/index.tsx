import { useEffect, useState } from "react";
import type { GameRuntime } from "../../game-platform/contracts";
import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, MagischStrandAvontuurShell, UiBuildingBlocksPreview } from "./components";
import { beachWorld } from "./content";
import { readProfileTotals } from "./logic/rewards";
import {
  AdventureSelectScreen,
  GameSettingsScreen,
  RewardScreen,
  SceneBuilderScreen,
  StartScreen,
  VoiceSideScrollerScreen,
  WordChoiceScreen,
  ZegBouwScreen,
} from "./screens";
import { useBezemEscapeGameController } from "./state/useBezemEscapeGameController";
import { GameRuntimeProvider, useGameRuntime } from "./runtime/GameRuntimeContext";

const MagischStrandAvontuurExperience = () => {
  const { actions, viewModel } = useBezemEscapeGameController();
  const runtime = useGameRuntime();
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

  // Cumulatief sterrentotaal van het actieve profiel; ververst bij elke
  // schermwissel zodat de teller na een ronde meteen klopt (T-01/T-21).
  const [starCount, setStarCount] = useState(0);
  useEffect(() => {
    setStarCount(readProfileTotals(runtime.identity.profileId, runtime.storage).wordStars);
  }, [screenPreview, runtime.identity.profileId, runtime.storage]);

  const isSceneBuilder =
    screenPreview !== "reward" &&
    screenPreview !== "settings" &&
    screenPreview !== "start" &&
    screenPreview !== "world-select" &&
    screenPreview !== "mode-select" &&
    screenPreview !== "voice-side-scroller" &&
    screenPreview !== "word-choice";

  return (
    <MagischStrandAvontuurShell world={beachWorld}>
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
              onChooseWorld={() => actions.setScreen("world-select")}
              onPlayAgain={actions.resetRound}
            />
          ) : screenPreview === "settings" ? (
            <GameSettingsScreen onBackToMenu={actions.backFromSettings} />
          ) : screenPreview === "start" ? (
            <StartScreen
              onExit={actions.exitGame}
              onOpenSettings={() => actions.setScreen("settings")}
              onPlay={() => actions.setScreen("world-select")}
              starCount={starCount}
            />
          ) : screenPreview === "world-select" || screenPreview === "mode-select" ? (
            <AdventureSelectScreen
              onBackToStart={() => actions.setScreen("start")}
              onOpenRewards={() => actions.setScreen("reward")}
              onOpenSettings={() => actions.setScreen("settings")}
              onSelectWorld={actions.selectWorld}
              onStartMode={actions.startSelectedMode}
              selectedWorldId={selectedWorld.id}
              starCount={starCount}
              worlds={worldDefinitions}
            />
          ) : screenPreview === "voice-side-scroller" ? (
            <VoiceSideScrollerScreen onBackToMenu={actions.openModeSelect} />
          ) : screenPreview === "zeg-en-bouw" ? (
            <ZegBouwScreen
              objects={beachWorld.objects}
              onBackToMenu={actions.openModeSelect}
              zones={beachWorld.zones}
            />
          ) : screenPreview === "word-choice" ? (
            <WordChoiceScreen
              instructions={instructions.wordChoice}
              objects={beachWorld.objects}
              onBackToMenu={actions.openModeSelect}
              onPlayAgain={() => actions.startSelectedMode("choose-word")}
            />
          ) : (
            <SceneBuilderScreen
              instructionText={instructionText}
              instructions={instructions.sceneBuilder}
              objects={beachWorld.objects}
              onBackToMenu={actions.openModeSelect}
              onPlayAgain={() => actions.startSelectedMode("listen-and-place")}
              showTrayLabels={showTrayLabels}
              showZoneDevTools={showZoneDevTools}
              spokenCommandPreviewText={spokenCommandPreviewText}
              zones={beachWorld.zones}
            />
          )}
        </>
      )}
    </MagischStrandAvontuurShell>
  );
};

MagischStrandAvontuurExperience.displayName = "MagischStrandAvontuurExperience";

export const Game = ({ runtime }: { runtime: GameRuntime }) => (
  <GameRuntimeProvider runtime={runtime}>
    <MagischStrandAvontuurExperience />
  </GameRuntimeProvider>
);

Game.displayName = "MagischStrandAvontuurGame";
