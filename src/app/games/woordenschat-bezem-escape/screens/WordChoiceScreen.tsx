import { Sparkles, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { broomIconUrls, getBeachObjectStickerUrl, getInstructionVideoUrl } from "../asset-urls";
import { TopHud } from "../components";
import {
  GameplayStatusBar,
  InstructionBubble,
  ObjectStickerButton,
  PanelCard,
  PrimaryActionButton,
} from "../components/ui";
import { InstructionVideoButton } from "./scene-builder/InstructionVideoButton";
import { speakDutch } from "../logic/speech";
import {
  readUnlockedRewardIds,
  resolveNewRewardUnlocks,
  saveUnlockedRewardIds,
} from "../logic/rewards";
import { appendPracticeEvent } from "../logic/progress";
import { readBezemEscapeSettings } from "../logic/settings";
import type { SceneObject, VocabularyChoiceInstruction } from "../types";
import { useProfile } from "../../../contexts/ProfileContext";

interface WordChoiceScreenProps {
  instructions: VocabularyChoiceInstruction[];
  objects: SceneObject[];
}

interface FeedbackState {
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

export function WordChoiceScreen({ instructions, objects }: WordChoiceScreenProps) {
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
        rewardLabels: newRewardUnlocks.map((reward) => reward.label),
        repeatText: instruction.feedbackCopy.repeatAfterSuccess,
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

  const currentInstructionVideoUrl = getInstructionVideoUrl(instruction.id);

  return (
    <div
      data-testid="word-choice-screen"
      data-active-audio-repeats={activeAudioRepeats}
      data-active-instruction-id={instruction.id}
      data-choice-count={instruction.choiceCount}
      data-difficult-words={difficultWords.join(",")}
      data-recognized-with-help={recognizedWithHint.join(",")}
      data-recognized-without-help={recognizedWithoutHelp.join(",")}
      data-unlocked-rewards={unlockedRewardIds.join(",")}
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <TopHud
        onAudioClick={() => playQuestionAudio()}
        onHintClick={handleHint}
        showParentBack
        starCount={wordStarValue}
      />

      <div className="grid h-full min-h-0 grid-rows-[4rem_5.5rem_minmax(0,1fr)_3.75rem] gap-2 landscape:grid-cols-[minmax(13rem,18rem)_minmax(0,1fr)] landscape:grid-rows-[4rem_minmax(0,1fr)_3.75rem]">
        <InstructionBubble
          aria-label="Vraagpaneel"
          data-testid="word-choice-question-panel"
          leadingControl={
            currentInstructionVideoUrl ? (
              <InstructionVideoButton
                label="Speel video-opdracht"
                src={currentInstructionVideoUrl}
              />
            ) : undefined
          }
          onAudioClick={() => playQuestionAudio()}
          text={instruction.prompt}
          className="landscape:col-start-1 landscape:row-start-1"
        />

        <PanelCard
          aria-label="Luisterkaart"
          data-testid="word-choice-target-card"
          className="flex min-h-0 items-center gap-3 !p-2 landscape:col-start-1 landscape:row-start-2 landscape:flex-col landscape:items-stretch landscape:justify-center"
        >
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] border-2 border-sky-300 bg-sky-100 text-sky-700 shadow-[0_4px_0_rgba(14,116,144,0.18)] landscape:mx-auto landscape:h-16 landscape:w-16"
          >
            <Volume2 className="h-8 w-8" strokeWidth={3} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black leading-tight text-slate-900">
              {feedback?.text ?? "Luister en kies het plaatje."}
            </p>
            {feedback?.repeatText ? (
              <p className="mt-1 text-[0.7rem] font-black leading-tight text-sky-900">
                Zeg na: {feedback.repeatText}
              </p>
            ) : null}
            {feedback?.rewardLabels && feedback.rewardLabels.length > 0 ? (
              <p
                className="mt-1 text-[0.7rem] font-black leading-tight text-amber-900"
                data-testid="word-choice-reward-unlock-message"
              >
                Nieuwe beloning: {feedback.rewardLabels.join(", ")}
              </p>
            ) : null}
          </div>
          {feedback?.kind === "correct" ? (
            <PrimaryActionButton
              className="pointer-events-auto min-h-10 px-3 py-2 text-sm"
              data-testid="word-choice-next-button"
              iconLeft={<Sparkles className="h-5 w-5" strokeWidth={3} />}
              onClick={advanceInstruction}
            >
              Volgende
            </PrimaryActionButton>
          ) : null}
        </PanelCard>

        <PanelCard
          aria-label="Antwoordkaarten"
          data-testid="word-choice-answer-area"
          className="grid min-h-0 grid-cols-2 items-stretch justify-center gap-3 !p-3 landscape:col-start-2 landscape:row-span-3 landscape:row-start-1 landscape:gap-4 landscape:!p-4"
        >
          {answerOptions.map((option) => (
            <ObjectStickerButton
              className="pointer-events-auto h-full w-full"
              imageUrl={option.imageUrl}
              key={option.id}
              label={option.label}
              onClick={() => handleAnswerSelect(option.id)}
              selected={selectedAnswerId === option.id || (usedHint && option.id === instruction.targetObjectIds[0])}
              showLabel={false}
            />
          ))}
        </PanelCard>

        <PanelCard
          aria-label="Woordkeuze status"
          data-testid="word-choice-status-area"
          className="flex min-h-0 items-center !p-2 landscape:col-start-1 landscape:row-start-3"
        >
          <GameplayStatusBar
            boosting={speedBoosting}
            energyIconUrl={broomIconUrls.basic}
            speedMax={10}
            speedValue={speedValue}
            starMax={30}
            starValue={wordStarValue}
          />
        </PanelCard>
      </div>
    </div>
  );
}
