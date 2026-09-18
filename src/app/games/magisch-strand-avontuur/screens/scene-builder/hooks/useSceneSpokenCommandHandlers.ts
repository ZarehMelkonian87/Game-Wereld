import { useCallback } from "react";
import {
  executeSpokenSceneCommand,
  type SceneCommandChoice,
} from "../../../logic/scene-command-executor";
import { containsUnwantedWord, UNWANTED_WORD_NUDGE } from "../../../logic/word-safety";
import type { SceneObject } from "../../../types";
import type { useSceneBuilderState } from "./useSceneBuilderState";

export const useSceneSpokenCommandHandlers = ({
  objects,
  state,
}: {
  objects: readonly SceneObject[];
  state: ReturnType<typeof useSceneBuilderState>;
}) => {
  const {
    effectiveZones,
    instruction,
    placedObjectPoints,
    selectedObjectId,
    setFeedback,
    setHighlightedObjectId,
    setPendingPlacement,
    setSelectedObjectId,
    setSelectedZoneId,
    setShowTargetZoneHint,
    setSpokenCommandResult,
    setSpokenHelpByInstruction,
    setSpokenHintZoneId,
    spokenCommandResult,
    startVoiceRecognitionRef,
    stopVoiceRecognitionRef,
  } = state;

  const applySpokenCommandTranscript = useCallback(
    (transcript: string) => {
      // Vriendelijke bescherming: bij een ongewenst woord verwerken we het
      // commando niet en tonen we een zachte nudge (geen straf). We blijven
      // luisteren zodat het kind meteen het juiste woord kan zeggen (T-28).
      if (containsUnwantedWord(transcript)) {
        setSpokenCommandResult(null);
        setPendingPlacement(null);
        setFeedback({
          kind: "almost",
          mascot: "hint",
          text: UNWANTED_WORD_NUDGE,
        });
        startVoiceRecognitionRef.current?.();
        return undefined;
      }

      const executionResult = executeSpokenSceneCommand({
        objects,
        placements: placedObjectPoints,
        transcript,
        zones: effectiveZones,
      });

      setSpokenCommandResult(executionResult);

      if (executionResult.status !== "ready" || !executionResult.placement) {
        setSpokenHelpByInstruction((currentHelp) => ({
          ...currentHelp,
          [instruction.id]: (currentHelp[instruction.id] ?? 0) + 1,
        }));
        setPendingPlacement(null);

        if (executionResult.visualHint.objectId) {
          setSelectedObjectId(executionResult.visualHint.objectId);
          setHighlightedObjectId(executionResult.visualHint.objectId);
        }

        if (executionResult.visualHint.zoneId) {
          setSelectedZoneId(executionResult.visualHint.zoneId);
          setSpokenHintZoneId(executionResult.visualHint.zoneId);
          setShowTargetZoneHint(true);
        }

        setFeedback({
          kind: "almost",
          mascot: "hint",
          text: executionResult.message,
        });

        return executionResult;
      }

      const { placement } = executionResult;

      setSelectedObjectId(placement.objectId);
      setSelectedZoneId(placement.zoneId);
      setPendingPlacement({
        objectId: placement.objectId,
        source: "spoken",
        transcript: placement.transcript,
        x: placement.point.x,
        y: placement.point.y,
        zoneId: placement.zoneId,
      });
      setShowTargetZoneHint(false);
      setSpokenHintZoneId(null);
      setHighlightedObjectId(null);
      setFeedback({
        kind: "ready",
        mascot: "hint",
        text: `${executionResult.message} Wil je dit zo plaatsen? Druk daarna op Klaar.`,
      });

      // Plaatsing is duidelijk: stop het luisteren meteen, zodat het kind niet
      // op de stiltetimer wacht en de transcript niet verder "opstapelt" (T-26).
      stopVoiceRecognitionRef.current?.();

      return executionResult;
    },
    [
      effectiveZones,
      instruction,
      objects,
      placedObjectPoints,
      setFeedback,
      setHighlightedObjectId,
      setPendingPlacement,
      setSelectedObjectId,
      setSelectedZoneId,
      setShowTargetZoneHint,
      setSpokenCommandResult,
      setSpokenHelpByInstruction,
      setSpokenHintZoneId,
      startVoiceRecognitionRef,
      stopVoiceRecognitionRef,
    ],
  );

  const handleSpokenCommandChoice = (choice: SceneCommandChoice) => {
    if (choice.type === "object") {
      setSelectedObjectId(choice.id);
      setPendingPlacement(null);
      setHighlightedObjectId(choice.id);
      setFeedback({
        kind: "ready",
        text: `Goed, ${choice.label}. Kies nu de plek in de scene.`,
      });
      return;
    }

    const chosenZone = effectiveZones.find((zone) => zone.id === choice.id);
    const objectId = spokenCommandResult?.parseResult.objectId ?? selectedObjectId;

    if (!chosenZone || !objectId) {
      setSelectedZoneId(choice.id);
      setSpokenHintZoneId(choice.id);
      setShowTargetZoneHint(true);
      setFeedback({
        kind: "ready",
        text: `Plek gekozen: ${choice.label}. Kies nu welk plaatje daar moet komen.`,
      });
      return;
    }

    const point = {
      x: chosenZone.x + chosenZone.width / 2,
      y: chosenZone.y + chosenZone.height / 2,
    };

    setSelectedObjectId(objectId);
    setSelectedZoneId(chosenZone.id);
    setSpokenHintZoneId(null);
    setShowTargetZoneHint(false);
    setPendingPlacement({
      objectId,
      source: "spoken",
      transcript: spokenCommandResult?.transcript,
      x: point.x,
      y: point.y,
      zoneId: chosenZone.id,
    });
    setFeedback({
      kind: "ready",
      text: `Ik zet het plaatje op ${choice.label}. Je kunt de plek nog aanpassen. Druk daarna op Klaar.`,
    });
  };

  const handleRepeatSpokenCommand = () => {
    setSpokenCommandResult(null);
    setPendingPlacement(null);
    setSelectedObjectId(null);
    setSelectedZoneId(null);
    setShowTargetZoneHint(false);
    setSpokenHintZoneId(null);
    setHighlightedObjectId(null);
    setFeedback({
      kind: "ready",
      mascot: "hint",
      text: "Ik luister… zeg de zin nog een keer rustig.",
    });
    // Herstart de microfoon meteen, zodat "Opnieuw zeggen" direct weer luistert
    // (voorheen gebeurde er niets en moest het kind zelf de mic-knop opnieuw
    // aantikken).
    startVoiceRecognitionRef.current?.();
  };

  return {
    applySpokenCommandTranscript,
    handleRepeatSpokenCommand,
    handleSpokenCommandChoice,
  };
};
