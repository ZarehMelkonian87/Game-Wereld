import { Check, Sparkles, Volume2, X } from "lucide-react";
import { broomIconUrls } from "../asset-urls";
import { TopHud } from "../components";
import {
  GameplayStatusBar,
  InstructionBubble,
  ObjectStickerButton,
  PanelCard,
  PrimaryActionButton,
} from "../components/ui";
import { classNames } from "../components/ui/classNames";
import { readBezemEscapeSettings } from "../logic/settings";
import { useGameRuntime } from "../runtime/GameRuntimeContext";
import type { SceneObject, VocabularyChoiceInstruction } from "../types";
import { InstructionVideoButton } from "./scene-builder/InstructionVideoButton";
import { useWordChoiceState } from "./word-choice/useWordChoiceState";
interface WordChoiceScreenProps {
  instructions: VocabularyChoiceInstruction[];
  objects: SceneObject[];
  onBackToMenu?: () => void;
}
export const WordChoiceScreen = ({
  instructions,
  objects,
  onBackToMenu,
}: WordChoiceScreenProps) => {
  const runtime = useGameRuntime();
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
                autoPlayOnMount={
                  readBezemEscapeSettings(rewardProfileId, runtime.storage).audioEnabled
                }
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
              className="pointer-events-auto min-h-12 px-3 py-2 text-sm"
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
          {answerOptions.map((option) => {
            const isTarget = option.id === instruction.targetObjectIds[0];
            const isChosen = selectedAnswerId === option.id;
            const status =
              feedback?.kind === "correct" && (isChosen || (usedHint && isTarget))
                ? "correct"
                : feedback?.kind === "almost" && isChosen
                  ? "wrong"
                  : usedHint && isTarget
                    ? "reveal"
                    : "idle";

            return (
              <div className="relative flex" key={option.id}>
                <ObjectStickerButton
                  className={classNames(
                    "pointer-events-auto h-full w-full",
                    status === "correct" &&
                      "border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.28),0_8px_18px_rgba(16,185,129,0.3)] bezem-choice-correct",
                    status === "wrong" &&
                      "border-[#e8663d] shadow-[0_0_0_3px_rgba(232,102,61,0.3)] bezem-choice-wrong",
                    status === "reveal" && "border-emerald-400",
                    status === "idle" && "border-slate-200",
                  )}
                  data-answer-status={status}
                  imageUrl={option.imageUrl}
                  label={option.label}
                  onClick={() => handleAnswerSelect(option.id)}
                  selected={isChosen || (usedHint && isTarget)}
                  showLabel={false}
                  size="choice"
                />
                {status === "correct" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-1.5 -top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
                    >
                      <Check className="h-4 w-4" strokeWidth={3.5} />
                    </span>
                    <span
                      aria-hidden="true"
                      className="bezem-choice-sparkle pointer-events-none absolute left-2 top-1 text-sm"
                    >
                      ✨
                    </span>
                    <span
                      aria-hidden="true"
                      className="bezem-choice-sparkle pointer-events-none absolute right-3 top-2 text-sm"
                      style={{ animationDelay: "0.12s" }}
                    >
                      ⭐
                    </span>
                    <span
                      aria-hidden="true"
                      className="bezem-choice-sparkle pointer-events-none absolute bottom-2 left-4 text-sm"
                      style={{ animationDelay: "0.24s" }}
                    >
                      ✨
                    </span>
                  </>
                ) : status === "wrong" ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1.5 -top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#e8663d] text-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
                  >
                    <X className="h-4 w-4" strokeWidth={3.5} />
                  </span>
                ) : null}
              </div>
            );
          })}
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
};
WordChoiceScreen.displayName = "WordChoiceScreen";
