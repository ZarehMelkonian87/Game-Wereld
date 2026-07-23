import { useEffect, useMemo, useState } from "react";
import { getBeachObjectStickerUrl, getInstructionVideoUrl } from "../../asset-urls";
import {
  readUnlockedRewardIds,
  resolveNewRewardUnlocks,
  saveUnlockedRewardIds,
} from "../../logic/rewards";
import { readBezemEscapeSettings } from "../../logic/settings";
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
export const useWordChoiceState = ({
  instructions,
  objects,
}: {
  instructions: VocabularyChoiceInstruction[];
  objects: SceneObject[];
}) => {
  const runtime = useGameRuntime();
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
  const [audioRepeatsByInstruction, setAudioRepeatsByInstruction] = useState<
    Record<string, number>
  >({});
  const [hintUsedByInstruction, setHintUsedByInstruction] = useState<Record<string, boolean>>({});
  const [recognizedWithoutHelp, setRecognizedWithoutHelp] = useState<string[]>([]);
  const [recognizedWithHint, setRecognizedWithHint] = useState<string[]>([]);
  const [difficultWords, setDifficultWords] = useState<string[]>([]);
  const instruction = instructions[activeInstructionIndex] ?? instructions[0];
  const targetObject = objects.find((object) => object.id === instruction.targetObjectIds[0]);
  const activeAudioRepeats = audioRepeatsByInstruction[instruction.id] ?? 0;
  const usedHint = Boolean(hintUsedByInstruction[instruction.id]);
  const currentInstructionVideoUrl = getInstructionVideoUrl(instruction.id);
  useEffect(() => {
    setUnlockedRewardIds(readUnlockedRewardIds(rewardProfileId, runtime.storage));
  }, [rewardProfileId, runtime.storage]);
  useEffect(() => {
    setActiveInstructionIndex(0);
    setSelectedAnswerId(null);
    setFeedback(null);
    setSpeedValue(0);
    setSpeedBoosting(false);
    setWordStarValue(0);
    setAudioRepeatsByInstruction({});
    setHintUsedByInstruction({});
    setRecognizedWithoutHelp([]);
    setRecognizedWithHint([]);
    setDifficultWords([]);
  }, [instructions]);
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
  const playQuestionAudio = (text = instruction.audioText) => {
    if (!readBezemEscapeSettings(rewardProfileId, runtime.storage).audioEnabled) {
      setFeedback({
        kind: "almost",
        text: "Audio staat uit bij instellingen. Lees de vraag samen hardop.",
      });
      return;
    }
    if (!runtime.speech.speak(text).ok) {
      setFeedback({
        kind: "almost",
        text: "Audio is niet beschikbaar in deze browser. Lees de vraag samen hardop.",
      });
      return;
    }
    setAudioRepeatsByInstruction((currentRepeats) => ({
      ...currentRepeats,
      [instruction.id]: (currentRepeats[instruction.id] ?? 0) + 1,
    }));
  };
  const handleHint = () => {
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
    setSelectedAnswerId(answerId);
    if (answerId === instruction.targetObjectIds[0]) {
      const word = targetObject?.label ?? instruction.targetWord;
      const recognitionSetter = usedHint ? setRecognizedWithHint : setRecognizedWithoutHelp;
      const bonusEarned = !usedHint;
      const earnedSpeed = instruction.reward.speed + (bonusEarned ? 1 : 0);
      const earnedWordStars = instruction.reward.wordStars + (bonusEarned ? 1 : 0);
      const nextSpeedValue = speedValue + earnedSpeed;
      const nextWordStarValue = wordStarValue + earnedWordStars;
      const newRewardUnlocks = resolveNewRewardUnlocks({
        totalSpeed: nextSpeedValue,
        totalWordStars: nextWordStarValue,
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
      void runtime.practice.append({
        assistance: usedHint ? "hint" : "none",
        attempts: 1,
        hintsUsed: usedHint ? 1 : 0,
        isCorrect: true,
        result: usedHint ? "correct-with-help" : "correct-without-help",
        taskId: instruction.id,
        targetWords: [word],
        wordStarsEarned: earnedWordStars,
      });
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
      return;
    }
    setDifficultWords((currentWords) =>
      uniquePush(currentWords, targetObject?.label ?? instruction.targetWord),
    );
    void runtime.practice.append({
      assistance: usedHint ? "hint" : activeAudioRepeats > 0 ? "audio-repeat" : "none",
      attempts: 1,
      hintsUsed: usedHint ? 1 : 0,
      isCorrect: false,
      result: "needs-more-practice",
      taskId: instruction.id,
      targetWords: [targetObject?.label ?? instruction.targetWord],
      wordStarsEarned: 0,
    });
    setFeedback({
      kind: "almost",
      text: instruction.feedbackCopy.almost ?? instruction.hint,
    });
  };
  const advanceInstruction = () => {
    setActiveInstructionIndex((currentIndex) =>
      Math.min(currentIndex + 1, instructions.length - 1),
    );
    setSelectedAnswerId(null);
    setFeedback(null);
  };
  return {
    activeAudioRepeats,
    activeInstructionIndex,
    advanceInstruction,
    answerOptions,
    currentInstructionVideoUrl,
    difficultWords,
    feedback,
    handleAnswerSelect,
    handleHint,
    instruction,
    playQuestionAudio,
    recognizedWithHint,
    recognizedWithoutHelp,
    rewardProfileId,
    selectedAnswerId,
    speedBoosting,
    speedValue,
    unlockedRewardIds,
    usedHint,
    wordStarValue,
  };
};
