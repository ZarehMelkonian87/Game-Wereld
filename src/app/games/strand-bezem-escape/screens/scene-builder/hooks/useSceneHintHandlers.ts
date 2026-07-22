import { useRef } from "react";
import {
  getConceptHintVideoUrl,
  getHighlightedObjectHintVideoUrl,
  getSeekObjectHintVideoUrl,
  sharedPlaceHintVideoUrl,
} from "../../../asset-urls";
import { readBezemEscapeSettings } from "../../../logic/settings";
import { speakDutch } from "../../../logic/speech";
import type { useSceneBuilderState } from "./useSceneBuilderState";

const getHintVideoUrlForLevel = (instructionId: string, hintLevel: number, relation: string) => {
  if (hintLevel === 1) {
    return getSeekObjectHintVideoUrl(instructionId);
  }

  if (hintLevel === 2) {
    return getHighlightedObjectHintVideoUrl(instructionId);
  }

  if (hintLevel === 3) {
    return sharedPlaceHintVideoUrl;
  }

  if (hintLevel === 4) {
    return getConceptHintVideoUrl(relation);
  }

  return undefined;
};

const conceptExplanation: Record<string, string> = {
  boven: "Boven betekent hoog, aan de bovenkant.",
  dichtbij: "Dichtbij betekent niet ver weg.",
  in: "In betekent binnenin, zoals in het water.",
  links: "Links is de kant van je linkerhand.",
  midden: "Midden is tussen links en rechts.",
  naast: "Naast betekent dichtbij aan de zijkant.",
  onder: "Onder betekent lager dan iets anders.",
  op: "Op betekent erop, aan de bovenkant.",
  rechts: "Rechts is de kant van je rechterhand.",
  tussen: "Tussen betekent in het midden van twee dingen.",
  "ver weg": "Ver weg betekent verder naar achteren in de scene.",
};

export const useSceneHintHandlers = ({
  state,
}: {
  state: ReturnType<typeof useSceneBuilderState>;
}) => {
  const hintVideoPressStartedRef = useRef(false);

  const {
    activeHintsUsed,
    instruction,
    rewardProfileId,
    setAudioRepeatsByInstruction,
    setFeedback,
    setHighlightedObjectId,
    setHintEvents,
    setHintsByInstruction,
    setShowTargetZoneHint,
    setSpokenHintZoneId,
    spokenCommandResult,
    targetObject,
  } = state;

  function playInstructionAudio(text = instruction.audioText) {
    if (!readBezemEscapeSettings(rewardProfileId).audioEnabled) {
      setFeedback({
        kind: "almost",
        mascot: "hint",
        text: "Audio staat uit bij instellingen. Lees de opdracht samen hardop.",
      });
      return;
    }

    if (!speakDutch(text)) {
      setFeedback({
        kind: "almost",
        mascot: "hint",
        text: "Audio is niet beschikbaar in deze browser. Lees de opdracht samen hardop.",
      });
      return;
    }

    setAudioRepeatsByInstruction((currentRepeats) => ({
      ...currentRepeats,
      [instruction.id]: (currentRepeats[instruction.id] ?? 0) + 1,
    }));
  }

  const handleInstructionVideoRequest = () => {
    if (!readBezemEscapeSettings(rewardProfileId).audioEnabled) {
      setFeedback({
        kind: "almost",
        mascot: "hint",
        text: "Audio staat uit bij instellingen. Zet audio aan om de video-opdracht te horen.",
      });
      return false;
    }

    return true;
  };

  const handleInstructionVideoPlaybackStart = () => {
    setAudioRepeatsByInstruction((currentRepeats) => ({
      ...currentRepeats,
      [instruction.id]: (currentRepeats[instruction.id] ?? 0) + 1,
    }));
  };

  const handleInstructionVideoPlaybackError = () => {
    setFeedback({
      kind: "almost",
      mascot: "hint",
      text: "De video-opdracht kan niet worden afgespeeld. Probeer de audio opnieuw of lees de opdracht samen.",
    });
  };

  const applyHint = ({ playAudioForFirstHint }: { playAudioForFirstHint: boolean }) => {
    if (!readBezemEscapeSettings(rewardProfileId).hintsEnabled) {
      setFeedback({
        kind: "ready",
        mascot: "hint",
        text: "Hints staan uit bij instellingen.",
      });
      return false;
    }

    const nextHintCount = activeHintsUsed + 1;
    const nextHintLevel = ((nextHintCount - 1) % 4) + 1;

    setHintsByInstruction((currentHints) => ({
      ...currentHints,
      [instruction.id]: nextHintCount,
    }));

    setHintEvents((currentEvents) => [
      ...currentEvents,
      {
        hintLevel: nextHintLevel,
        instructionId: instruction.id,
        usedAt: new Date().toISOString(),
      },
    ]);

    if (spokenCommandResult && spokenCommandResult.status !== "ready") {
      setHighlightedObjectId(spokenCommandResult.visualHint.objectId ?? null);
      setSpokenHintZoneId(spokenCommandResult.visualHint.zoneId ?? null);
      setShowTargetZoneHint(Boolean(spokenCommandResult.visualHint.zoneId));
    } else if (nextHintLevel === 3) {
      setHighlightedObjectId(instruction.placement.objectId);
      setShowTargetZoneHint(true);
    } else if (nextHintLevel === 2) {
      setHighlightedObjectId(instruction.placement.objectId);
      setShowTargetZoneHint(false);
    } else {
      setHighlightedObjectId(null);
      setShowTargetZoneHint(false);
    }

    const targetWord = `${targetObject?.article ?? "het"} ${targetObject?.label ?? "plaatje"}`;
    const voiceExampleHint = `Zeg bijvoorbeeld: ${instruction.prompt}`;
    const hintText =
      spokenCommandResult && spokenCommandResult.status !== "ready"
        ? voiceExampleHint
        : nextHintLevel === 1
          ? `Zoek ${targetWord}.`
          : nextHintLevel === 2
            ? `Kijk naar het plaatje dat oplicht: ${targetObject?.label ?? "plaatje"}.`
            : nextHintLevel === 3
              ? `Kijk naar de plek die oplicht.`
              : conceptExplanation[instruction.placement.relation] ?? instruction.hint;

    setFeedback({
      hintVideoUrl:
        spokenCommandResult && spokenCommandResult.status !== "ready"
          ? undefined
          : getHintVideoUrlForLevel(
              instruction.id,
              nextHintLevel,
              instruction.placement.relation,
            ),
      kind: "ready",
      mascot: "hint",
      text: hintText,
    });

    if (nextHintLevel === 1 && playAudioForFirstHint) {
      playInstructionAudio(instruction.audioText);
    }

    return true;
  };

  const handleHint = () => {
    applyHint({ playAudioForFirstHint: true });
  };

  const playPreparedHintVideo = () => {
    if (!readBezemEscapeSettings(rewardProfileId).hintsEnabled) {
      return;
    }

    hintVideoPressStartedRef.current = true;
    applyHint({ playAudioForFirstHint: false });
  };

  const handleHintFeedbackVideoClick = () => {
    applyHint({ playAudioForFirstHint: false });
  };

  return {
    applyHint,
    handleHint,
    handleHintFeedbackVideoClick,
    handleInstructionVideoPlaybackError,
    handleInstructionVideoPlaybackStart,
    handleInstructionVideoRequest,
    playInstructionAudio,
    playPreparedHintVideo,
  };
};
