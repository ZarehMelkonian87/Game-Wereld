import { useEffect, useMemo, useState } from "react";
import { useProfile } from "../../../contexts/ProfileContext";
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

export const useBezemEscapeGameController = () => {
  const { currentProfile } = useProfile();
  const profileId = currentProfile?.id ?? "demo-profile";
  const [screenPreview, setScreenPreview] = useState<GameScreenPreview>(() => getScreenPreview());
  const [roundSeed, setRoundSeed] = useState(() => createRoundSeed());
  const [selectedWorldId, setSelectedWorldId] = useState(() => readSelectedWorldId(profileId));
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
    setSelectedWorldId(readSelectedWorldId(profileId));
  }, [profileId]);

  const setScreen = (screen: GameScreenPreview) => {
    setScreenPreview(screen);
  };

  const resetRound = () => {
    setRoundSeed(createRoundSeed());
    setScreenPreview("scene-builder");
  };

  const openModeSelect = () => {
    saveSelectedWorldId(profileId, selectedWorld.id);
    setScreenPreview("mode-select");
  };

  const openSelectedWorld = () => {
    if (selectedWorld.status !== "open") {
      return;
    }

    const storedWorldId = saveSelectedWorldId(profileId, selectedWorld.id);
    setSelectedWorldId(storedWorldId);
    setScreenPreview("mode-select");
  };

  const selectWorld = (worldId: string) => {
    const world = getWorldDefinition(worldId);

    if (world.status !== "open") {
      return;
    }

    setSelectedWorldId(saveSelectedWorldId(profileId, world.id));
  };

  const startSelectedMode = (modeId: BezemEscapeMode) => {
    if (selectedWorld.status !== "open") {
      return;
    }

    setSelectedWorldId(saveSelectedWorldId(profileId, selectedWorld.id));
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
