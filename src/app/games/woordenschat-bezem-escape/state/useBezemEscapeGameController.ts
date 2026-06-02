import { useEffect, useMemo, useState } from "react";
import { useProfile } from "../../../contexts/ProfileContext";
import { beachWorld } from "../content";
import {
  getBroomRaceInstructions,
  getSceneBuilderInstructions,
  getVocabularyChoiceInstructions,
} from "../logic/instruction-groups";
import {
  getInstructionPreviewText,
  getScreenPreview,
  getSpokenCommandPreviewText,
  shouldShowTrayLabels,
  shouldShowUiPreview,
  shouldShowZoneDevTools,
} from "../logic/game-screen-preview";
import type { GameScreenPreview } from "../logic/game-screen-preview";
import { clearStoredRaceResult, hasSavedRaceState } from "../logic/race-session-storage";
import { readSelectedWorldId, saveSelectedWorldId } from "../logic/world-selection";
import type { BezemEscapeMode } from "../types";
import { getWorldDefinition, worldDefinitions } from "../worlds";

export const useBezemEscapeGameController = () => {
  const { currentProfile } = useProfile();
  const profileId = currentProfile?.id ?? "demo-profile";
  const [screenPreview, setScreenPreview] = useState<GameScreenPreview>(() => getScreenPreview());
  const [raceUnlocked, setRaceUnlocked] = useState(() => hasSavedRaceState());
  const [selectedWorldId, setSelectedWorldId] = useState(() => readSelectedWorldId(profileId));
  const selectedWorld = getWorldDefinition(selectedWorldId);

  const instructions = useMemo(
    () => ({
      race: getBroomRaceInstructions(beachWorld),
      sceneBuilder: getSceneBuilderInstructions(beachWorld),
      wordChoice: getVocabularyChoiceInstructions(beachWorld),
    }),
    [],
  );

  useEffect(() => {
    setSelectedWorldId(readSelectedWorldId(profileId));
  }, [profileId]);

  const setScreen = (screen: GameScreenPreview) => {
    setScreenPreview(screen);
  };

  const resetRound = () => {
    clearStoredRaceResult();
    setScreenPreview("scene-builder");
  };

  const openModeSelect = () => {
    saveSelectedWorldId(profileId, selectedWorld.id);
    setRaceUnlocked(hasSavedRaceState());
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

  const startRaceFromSceneBuilder = () => {
    setRaceUnlocked(true);
    setScreenPreview("race");
  };

  const startUnlockedRace = () => {
    if (!raceUnlocked) {
      return;
    }

    setScreenPreview("race");
  };

  const startSelectedMode = (modeId: BezemEscapeMode) => {
    if (selectedWorld.status !== "open") {
      return;
    }

    setSelectedWorldId(saveSelectedWorldId(profileId, selectedWorld.id));

    if (modeId === "choose-word") {
      setScreenPreview("word-choice");
      return;
    }

    if (modeId === "broom-escape-run") {
      if (!raceUnlocked) {
        return;
      }

      setScreenPreview("race");
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
      startRaceFromSceneBuilder,
      startSelectedMode,
      startUnlockedRace,
    },
    viewModel: {
      instructionText: getInstructionPreviewText(),
      instructions,
      raceUnlocked,
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
