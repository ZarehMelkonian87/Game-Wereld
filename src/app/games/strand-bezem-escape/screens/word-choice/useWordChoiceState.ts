import { useEffect, useMemo, useState } from "react";
import { useProfile } from "../../../../contexts/ProfileContext";
import { getBeachObjectStickerUrl, getInstructionVideoUrl } from "../../asset-urls";
import { appendPracticeEvent } from "../../logic/progress";
import { readUnlockedRewardIds, resolveNewRewardUnlocks, saveUnlockedRewardIds } from "../../logic/rewards";
import { readBezemEscapeSettings } from "../../logic/settings";
import { speakDutch } from "../../logic/speech";
import type { SceneObject, VocabularyChoiceInstruction } from "../../types";

export interface FeedbackState {
  kind: "almost" | "correct" | "ready";
  repeatText?: string;
  rewardLabels?: string[];
  text: string;
}

function toDisplayLabel(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function uniquePush(values: string[], value: string) {
  return values.includes(value) ? values : [...values, value];
}

export const useWordChoiceState = ({
  instructions,
  objects,
}: {
  instructions: VocabularyChoiceInstruction[];
  objects: SceneObject[];
}) => {
  const { currentProfile } = useProfile();
  const rewardProfileId = currentProfile?.id ?? "demo-profile";

  const [activeInstructionIndex, setActiveInstructionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [speedValue, setSpeedValue] = useState(0);
  const [speedBoosting, setSpeedBoosting] = useState(false);
  const [wordStarValue, setWordStarValue] = useState(0);
  const [unlockedRewardIds, setUnlockedRewardIds] = useState<string[]>(() =>
    readUnlockedRewardIds(rewardProfileId),
  );
  const [audioRepeatsByInstruction, setAudioRepeatsByInstruction] = useState<Record<string, number>>({});
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
    setUnlockedRewardIds(readUnlockedRewardIds(rewardProfileId));
  }, [rewardProfileId]);

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
        .filter((option): option is { id: string; imageUrl: string; label: string } => Boolean(option)),
    [instruction.answerOptions, objects],
  );

  function playQuestionAudio(text = instruction.audioText) {
    if (!readBezemEscapeSettings(rewardProfileId).audioEnabled) {
      setFeedback({
        kind: "almost",
        text: "Audio staat uit bij instellingen. Lees de vraag samen hardop.",
      });
      return;
    }

    if (!speakDutch(text)) {
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
  }

  function handleHint() {
    if (!readBezemEscapeSettings(rewardProfileId).hintsEnabled) {
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
  }

  function handleAnswerSelect(answerId: string) {
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
      appendPracticeEvent(rewardProfileId, {
        assistance: usedHint ? "hint" : "none",
        attempts: 1,
        audioRepeats: activeAudioRepeats,
        hintsUsed: usedHint ? 1 : 0,
        instructionId: instruction.id,
        isCorrect: true,
        languageDomains: instruction.languageDomains,
        mode: "choose-word",
        result: usedHint ? "correct-with-help" : "correct-without-help",
        spatialConcepts: instruction.spatialConcepts,
        speedEarned: earnedSpeed,
        targetWords: [word],
        wordStarsEarned: earnedWordStars,
      });

      if (newRewardUnlocks.length > 0) {
        setUnlockedRewardIds(nextUnlockedRewardIds);
        saveUnlockedRewardIds(rewardProfileId, nextUnlockedRewardIds);
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
    appendPracticeEvent(rewardProfileId, {
      assistance: usedHint ? "hint" : activeAudioRepeats > 0 ? "audio-repeat" : "none",
      attempts: 1,
      audioRepeats: activeAudioRepeats,
      hintsUsed: usedHint ? 1 : 0,
      instructionId: `${instruction.id}:wrong-choice:${Date.now()}`,
      isCorrect: false,
      languageDomains: instruction.languageDomains,
      mode: "choose-word",
      result: "needs-more-practice",
      spatialConcepts: instruction.spatialConcepts,
      speedEarned: 0,
      targetWords: [targetObject?.label ?? instruction.targetWord],
      wordStarsEarned: 0,
    });
    setFeedback({
      kind: "almost",
      text: instruction.feedbackCopy.almost ?? instruction.hint,
    });
  }

  function advanceInstruction() {
    setActiveInstructionIndex((currentIndex) =>
      Math.min(currentIndex + 1, instructions.length - 1),
    );
    setSelectedAnswerId(null);
    setFeedback(null);
  }

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
