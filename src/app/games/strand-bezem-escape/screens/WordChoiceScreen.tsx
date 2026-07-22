import { Sparkles, Volume2 } from "lucide-react";
import { broomIconUrls } from "../asset-urls";
import { TopHud } from "../components";
import {
  GameplayStatusBar,
  InstructionBubble,
  ObjectStickerButton,
  PanelCard,
  PrimaryActionButton,
} from "../components/ui";
import { readBezemEscapeSettings } from "../logic/settings";
import type { SceneObject, VocabularyChoiceInstruction } from "../types";
import { InstructionVideoButton } from "./scene-builder/InstructionVideoButton";
import { useWordChoiceState } from "./word-choice/useWordChoiceState";

interface WordChoiceScreenProps {
  instructions: VocabularyChoiceInstruction[];
  objects: SceneObject[];
  onBackToMenu?: () => void;
}

export function WordChoiceScreen({ instructions, objects, onBackToMenu }: WordChoiceScreenProps) {
  const {
    activeAudioRepeats,
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
  } = useWordChoiceState({ instructions, objects });

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
      data-active-audio-repeats={activeAudioRepeats}
      data-active-instruction-id={instruction.id}
      data-choice-count={instruction.choiceCount}
      data-difficult-words={difficultWords.join(",")}
      data-recognized-with-help={recognizedWithHint.join(",")}
      data-recognized-without-help={recognizedWithoutHelp.join(",")}
      data-testid="word-choice-screen"
      data-unlocked-rewards={unlockedRewardIds.join(",")}
    >
      <TopHud
        onAudioClick={() => playQuestionAudio()}
        onBackToMenu={onBackToMenu}
        onHintClick={handleHint}
        showParentBack
        starCount={wordStarValue}
      />

      <div className="grid h-full min-h-0 grid-rows-[4rem_5.5rem_minmax(0,1fr)_3.75rem] gap-2 landscape:grid-cols-[minmax(13rem,18rem)_minmax(0,1fr)] landscape:grid-rows-[4rem_minmax(0,1fr)_3.75rem]">
        <InstructionBubble
          aria-label="Vraagpaneel"
          className="landscape:col-start-1 landscape:row-start-1"
          data-testid="word-choice-question-panel"
          leadingControl={
            currentInstructionVideoUrl ? (
              <InstructionVideoButton
                autoPlayOnMount={readBezemEscapeSettings(rewardProfileId).audioEnabled}
                label="Speel video-opdracht"
                src={currentInstructionVideoUrl}
              />
            ) : undefined
          }
          onAudioClick={() => playQuestionAudio()}
          text={instruction.prompt}
        />

        <PanelCard
          aria-label="Luisterkaart"
          className="flex min-h-0 items-center gap-3 !p-2 landscape:col-start-1 landscape:row-start-2 landscape:flex-col landscape:items-stretch landscape:justify-center"
          data-testid="word-choice-target-card"
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
          className="grid min-h-0 grid-cols-2 items-stretch justify-center gap-3 !p-3 landscape:col-start-2 landscape:row-span-3 landscape:row-start-1 landscape:gap-4 landscape:!p-4"
          data-testid="word-choice-answer-area"
        >
          {answerOptions.map((option) => (
            <ObjectStickerButton
              className="pointer-events-auto h-full w-full"
              imageUrl={option.imageUrl}
              key={option.id}
              label={option.label}
              onClick={() => handleAnswerSelect(option.id)}
              selected={
                selectedAnswerId === option.id ||
                (usedHint && option.id === instruction.targetObjectIds[0])
              }
              showLabel={false}
            />
          ))}
        </PanelCard>

        <PanelCard
          aria-label="Woordkeuze status"
          className="flex min-h-0 items-center !p-2 landscape:col-start-1 landscape:row-start-3"
          data-testid="word-choice-status-area"
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

WordChoiceScreen.displayName = "WordChoiceScreen";
