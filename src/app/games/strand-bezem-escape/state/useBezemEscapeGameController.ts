import { useEffect, useMemo, useState } from "react";
import { beachWorld } from "../content";
import {
  getSceneBuilderInstructions,
  getVocabularyChoiceInstructions,
} from "../logic/instruction-groups";
import {
  createRoundSeed,
  shuffleSceneBuilderInstructions,
  shuffleVocabularyChoiceInstructions,
} from "../logic/instruction-randomization";
import {
  getInstructionPreviewText,
  getScreenPreview,
  getSpokenCommandPreviewText,
  shouldShowTrayLabels,
  shouldShowUiPreview,
  shouldShowZoneDevTools,
} from "../logic/game-screen-preview";
import type { GameScreenPreview } from "../logic/game-screen-preview";
import { readSelectedWorldId, saveSelectedWorldId } from "../logic/world-selection";
import type { BezemEscapeMode } from "../types";
import { getWorldDefinition, worldDefinitions } from "../worlds";
import { useGameRuntime } from "../runtime/GameRuntimeContext";

export const useBezemEscapeGameController = () => {
  const { identity, lifecycle, storage } = useGameRuntime();
  const profileId = identity.profileId;
  const [screenPreview, setScreenPreview] = useState<GameScreenPreview>(() => getScreenPreview());
  const [roundSeed, setRoundSeed] = useState(() => createRoundSeed());
  const [selectedWorldId, setSelectedWorldId] = useState(() =>
    readSelectedWorldId(profileId, storage),
  );
  const selectedWorld = getWorldDefinition(selectedWorldId);

  const baseInstructions = useMemo(
    () => ({
      sceneBuilder: getSceneBuilderInstructions(beachWorld),
      wordChoice: getVocabularyChoiceInstructions(beachWorld),
    }),
    [],
  );
  const instructions = useMemo(
    () => ({
      sceneBuilder: shuffleSceneBuilderInstructions(baseInstructions.sceneBuilder, roundSeed),
      wordChoice: shuffleVocabularyChoiceInstructions(baseInstructions.wordChoice, roundSeed + 101),
    }),
    [baseInstructions, roundSeed],
  );

  useEffect(() => {
    setSelectedWorldId(readSelectedWorldId(profileId, storage));
  }, [profileId, storage]);

  const setScreen = (screen: GameScreenPreview) => {
    setScreenPreview(screen);
  };

  const exitGame = () => {
    lifecycle.exit("back");
  };

  const resetRound = () => {
    setRoundSeed(createRoundSeed());
    setScreenPreview("scene-builder");
  };

  const openModeSelect = () => {
    saveSelectedWorldId(profileId, selectedWorld.id, storage);
    setScreenPreview("mode-select");
  };

  const openSelectedWorld = () => {
    if (selectedWorld.status !== "open") {
      return;
    }

    const storedWorldId = saveSelectedWorldId(profileId, selectedWorld.id, storage);
    setSelectedWorldId(storedWorldId);
    setScreenPreview("mode-select");
  };

  const selectWorld = (worldId: string) => {
    const world = getWorldDefinition(worldId);

    if (world.status !== "open") {
      return;
    }

    setSelectedWorldId(saveSelectedWorldId(profileId, world.id, storage));
  };

  const startSelectedMode = (modeId: BezemEscapeMode) => {
    if (selectedWorld.status !== "open") {
      return;
    }

    setSelectedWorldId(saveSelectedWorldId(profileId, selectedWorld.id, storage));
    setRoundSeed(createRoundSeed());

    if (modeId === "choose-word") {
      setScreenPreview("word-choice");
      return;
    }

    if (modeId === "zeg-en-vlieg") {
      setScreenPreview("voice-side-scroller");
      return;
    }

    setScreenPreview("scene-builder");
  };

  return {
    actions: {
      exitGame,
      openModeSelect,
      openSelectedWorld,
      resetRound,
      selectWorld,
      setScreen,
      startSelectedMode,
    },
    viewModel: {
      instructionText: getInstructionPreviewText(),
      instructions,
      screenPreview,
      selectedWorld,
      showTrayLabels: shouldShowTrayLabels(),
      showUiPreview: shouldShowUiPreview(),
      showZoneDevTools: shouldShowZoneDevTools(),
      spokenCommandPreviewText: getSpokenCommandPreviewText(),
      worldDefinitions,
    },
  };
};
