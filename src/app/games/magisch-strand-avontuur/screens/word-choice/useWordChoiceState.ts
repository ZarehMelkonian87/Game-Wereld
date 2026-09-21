import { useEffect, useMemo, useRef, useState } from "react";
import { getBeachObjectStickerUrl, getInstructionVideoUrl } from "../../asset-urls";
import {
  addProfileTotals,
  readUnlockedRewardIds,
  resolveNewRewardUnlocks,
  saveUnlockedRewardIds,
} from "../../logic/rewards";
import { playFeedbackSound } from "../../logic/feedback-sounds";
import { readBezemEscapeSettings } from "../../logic/settings";
import { createInstructionPracticeObservation } from "../../logic/practice-observations";
import type { SceneObject, VocabularyChoiceInstruction } from "../../types";
import { useGameRuntime } from "../../runtime/GameRuntimeContext";
export interface FeedbackState {
  kind: "almost" | "correct" | "ready";
  repeatText?: string;
  rewardLabels?: string[];
  text: string;
}
const toDisplayLabel = (label: string) => {
  return label.charAt(0).toUpperCase() + label.slice(1);
};
const uniquePush = (values: string[], value: string) => {
  return values.includes(value) ? values : [...values, value];
};
/**
 * Na een goed antwoord gaat de quiz vanzelf door (T-51): kort genoeg om het
 * tempo erin te houden, lang genoeg om het geluid en "Zeg na: ..." mee te
 * krijgen. Bij een nieuwe beloning krijgt het kind wat extra tijd om die te zien.
 */
export const WORD_CHOICE_AUTO_ADVANCE_MS = 1800;
export const WORD_CHOICE_AUTO_ADVANCE_WITH_REWARD_MS = 2600;
export const useWordChoiceState = ({
  autoAdvanceDelayMs = WORD_CHOICE_AUTO_ADVANCE_MS,
  autoAdvanceWithRewardDelayMs = WORD_CHOICE_AUTO_ADVANCE_WITH_REWARD_MS,
  instructions,
  objects,
}: {
  autoAdvanceDelayMs?: number;
  autoAdvanceWithRewardDelayMs?: number;
  instructions: VocabularyChoiceInstruction[];
  objects: SceneObject[];
}) => {
  const runtime = useGameRuntime();
  const attemptNumbersRef = useRef<Record<string, number>>({});
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const instructionStartedAtRef = useRef(runtime.clock.now().getTime());
  const rewardProfileId = runtime.identity.profileId;
  const [activeInstructionIndex, setActiveInstructionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [speedValue, setSpeedValue] = useState(0);
  const [speedBoosting, setSpeedBoosting] = useState(false);
  const [wordStarValue, setWordStarValue] = useState(0);
  const [unlockedRewardIds, setUnlockedRewardIds] = useState<string[]>(() =>
    readUnlockedRewardIds(rewardProfileId, runtime.storage),
  );
  const [hintUsedByInstruction, setHintUsedByInstruction] = useState<Record<string, boolean>>({});
  const [recognizedWithoutHelp, setRecognizedWithoutHelp] = useState<string[]>([]);
  const [recognizedWithHint, setRecognizedWithHint] = useState<string[]>([]);
  const [difficultWords, setDifficultWords] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const instruction = instructions[activeInstructionIndex] ?? instructions[0];
  const targetObject = objects.find((object) => object.id === instruction.targetObjectIds[0]);
  const usedHint = Boolean(hintUsedByInstruction[instruction.id]);
  const currentInstructionVideoUrl = getInstructionVideoUrl(instruction.id);
  useEffect(() => {
    setUnlockedRewardIds(readUnlockedRewardIds(rewardProfileId, runtime.storage));
  }, [rewardProfileId, runtime.storage]);
  useEffect(() => {
    // Voorlaad alle objectstickers zodat de keuzekaarten niet leeg flitsen bij
    // het doorschakelen naar de volgende vraag (T-33). De browser cachet ze
    // zodat een volgende vraag ze meteen kan tonen.
    if (typeof window === "undefined") {
      return;
    }
    objects.forEach((object) => {
      const stickerUrl = getBeachObjectStickerUrl(object.assetId);
      if (stickerUrl) {
        const image = new window.Image();
        image.src = stickerUrl;
      }
    });
  }, [objects]);
  // Zolang de timer loopt is de vraag "afgerond": tikken op kaarten of de hint
  // doen dan niets meer (geen dubbele sterren of observaties).
  const isAutoAdvancing = () => autoAdvanceTimerRef.current !== null;
  const clearAutoAdvanceTimer = () => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };
  useEffect(() => {
    clearAutoAdvanceTimer();
    setActiveInstructionIndex(0);
    setSelectedAnswerId(null);
    setFeedback(null);
    setSpeedValue(0);
    setSpeedBoosting(false);
    setWordStarValue(0);
    setHintUsedByInstruction({});
    setRecognizedWithoutHelp([]);
    setRecognizedWithHint([]);
    setDifficultWords([]);
    setIsCompleted(false);
    attemptNumbersRef.current = {};
  }, [instructions]);
  useEffect(() => clearAutoAdvanceTimer, []);
  useEffect(() => {
    instructionStartedAtRef.current = runtime.clock.now().getTime();
  }, [instruction.id, runtime.clock]);
  const answerOptions = useMemo(
    () =>
      instruction.answerOptions
        .map((objectId) => {
          const object = objects.find((sceneObject) => sceneObject.id === objectId);
          const imageUrl = object ? getBeachObjectStickerUrl(object.assetId) : undefined;
          if (!object || !imageUrl) {
            return undefined;
          }
          return {
            id: object.id,
            imageUrl,
            label: toDisplayLabel(object.label),
          };
        })
        .filter(
          (
            option,
          ): option is {
            id: string;
            imageUrl: string;
            label: string;
          } => Boolean(option),
        ),
    [instruction.answerOptions, objects],
  );
  const handleHint = () => {
    if (isAutoAdvancing()) {
      return;
    }
    if (!readBezemEscapeSettings(rewardProfileId, runtime.storage).hintsEnabled) {
      setFeedback({
        kind: "ready",
        text: "Hints staan uit bij instellingen.",
      });
      return;
    }
    setHintUsedByInstruction((currentHints) => ({
      ...currentHints,
      [instruction.id]: true,
    }));
    setFeedback({
      kind: "ready",
      text: instruction.hint,
    });
  };
  const handleAnswerSelect = (answerId: string) => {
    if (isAutoAdvancing()) {
      return;
    }
    const attemptNumber = (attemptNumbersRef.current[instruction.id] ?? 0) + 1;
    attemptNumbersRef.current[instruction.id] = attemptNumber;
    const responseTimeMs = Math.max(
      0,
      runtime.clock.now().getTime() - instructionStartedAtRef.current,
    );
    setSelectedAnswerId(answerId);
    if (answerId === instruction.targetObjectIds[0]) {
      const word = targetObject?.label ?? instruction.targetWord;
      const recognitionSetter = usedHint ? setRecognizedWithHint : setRecognizedWithoutHelp;
      const bonusEarned = !usedHint;
      const earnedSpeed = instruction.reward.speed + (bonusEarned ? 1 : 0);
      const earnedWordStars = instruction.reward.wordStars + (bonusEarned ? 1 : 0);
      const nextSpeedValue = speedValue + earnedSpeed;
      const nextWordStarValue = wordStarValue + earnedWordStars;
      // Tel de verdiende sterren/tempo op bij het CUMULATIEVE profieltotaal en
      // bepaal daarop de unlocks (niet op de ronde-lokale teller).
      const profileTotals = addProfileTotals(rewardProfileId, runtime.storage, {
        speed: earnedSpeed,
        wordStars: earnedWordStars,
      });
      const newRewardUnlocks = resolveNewRewardUnlocks({
        totalWordStars: profileTotals.wordStars,
        unlockedRewardIds,
      });
      const nextUnlockedRewardIds = [
        ...unlockedRewardIds,
        ...newRewardUnlocks.map((reward) => reward.id),
      ];
      recognitionSetter((currentWords) => uniquePush(currentWords, word));
      setSpeedValue(nextSpeedValue);
      setWordStarValue(nextWordStarValue);
      setSpeedBoosting(true);
      window.setTimeout(() => setSpeedBoosting(false), 450);
      void runtime.practice.append(
        createInstructionPracticeObservation({
          instructionReplays: 0,
          languageDomains: instruction.languageDomains,
          spatialConcepts: instruction.spatialConcepts,
          spokenHelp: 0,
          visualHints: usedHint ? 1 : 0,
          vocabularyId: instruction.targetObjectIds[0],
          taskId: instruction.id,
          outcome: "correct",
          responseTimeMs,
          attemptNumber,
        }),
      );
      if (newRewardUnlocks.length > 0) {
        setUnlockedRewardIds(nextUnlockedRewardIds);
        saveUnlockedRewardIds(rewardProfileId, nextUnlockedRewardIds, runtime.storage);
      }
      setFeedback({
        kind: "correct",
        repeatText: instruction.feedbackCopy.repeatAfterSuccess,
        rewardLabels: newRewardUnlocks.map((reward) => reward.label),
        text: bonusEarned
          ? `${instruction.feedbackCopy.correct} Bonus zonder hint!`
          : instruction.feedbackCopy.correct,
      });
      playFeedbackSound(runtime, rewardProfileId, "correct");
      // Geen "Volgende"-knop meer: de quiz gaat vanzelf door (T-51).
      clearAutoAdvanceTimer();
      autoAdvanceTimerRef.current = window.setTimeout(
        () => {
          autoAdvanceTimerRef.current = null;
          advanceInstruction();
        },
        newRewardUnlocks.length > 0 ? autoAdvanceWithRewardDelayMs : autoAdvanceDelayMs,
      );
      return;
    }
    setDifficultWords((currentWords) =>
      uniquePush(currentWords, targetObject?.label ?? instruction.targetWord),
    );
    void runtime.practice.append(
      createInstructionPracticeObservation({
        instructionReplays: 0,
        languageDomains: instruction.languageDomains,
        spatialConcepts: instruction.spatialConcepts,
        spokenHelp: 0,
        visualHints: usedHint ? 1 : 0,
        vocabularyId: instruction.targetObjectIds[0],
        taskId: instruction.id,
        outcome: "incorrect",
        responseTimeMs,
        attemptNumber,
      }),
    );
    setFeedback({
      kind: "almost",
      text: instruction.feedbackCopy.almost ?? instruction.hint,
    });
    playFeedbackSound(runtime, rewardProfileId, "wrong");
  };
  const advanceInstruction = () => {
    clearAutoAdvanceTimer();
    if (activeInstructionIndex < instructions.length - 1) {
      setActiveInstructionIndex((currentIndex) => currentIndex + 1);
      setSelectedAnswerId(null);
      setFeedback(null);
    } else {
      setIsCompleted(true);
      setSelectedAnswerId(null);
      setFeedback(null);
    }
  };
  const restartRound = () => {
    clearAutoAdvanceTimer();
    setActiveInstructionIndex(0);
    setSelectedAnswerId(null);
    setFeedback(null);
    setSpeedValue(0);
    setSpeedBoosting(false);
    setWordStarValue(0);
    setHintUsedByInstruction({});
    setRecognizedWithoutHelp([]);
    setRecognizedWithHint([]);
    setDifficultWords([]);
    setIsCompleted(false);
    attemptNumbersRef.current = {};
    instructionStartedAtRef.current = runtime.clock.now().getTime();
  };
  return {
    activeInstructionIndex,
    advanceInstruction,
    answerOptions,
    currentInstructionVideoUrl,
    difficultWords,
    feedback,
    handleAnswerSelect,
    handleHint,
    instruction,
    isCompleted,
    recognizedWithHint,
    recognizedWithoutHelp,
    restartRound,
    rewardProfileId,
    selectedAnswerId,
    speedBoosting,
    speedValue,
    unlockedRewardIds,
    usedHint,
    wordStarValue,
  };
};
