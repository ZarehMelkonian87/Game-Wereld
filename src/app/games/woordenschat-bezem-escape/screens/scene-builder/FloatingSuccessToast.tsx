import { useEffect, useRef, type MouseEvent } from "react";
import { mascotIconUrls } from "../../asset-urls";
import { PanelCard } from "../../components/ui";
import type { SceneCommandChoice, SceneCommandExecutionResult } from "../../logic/scene-command-executor";
import { classNames } from "../../components/ui/classNames";
import { createForegroundAudioSession } from "../../logic/game-audio-events";

interface FeedbackToastState {
  hintVideoUrl?: string;
  kind: "almost" | "correct" | "ready";
  mascot?: "celebration" | "hint";
  repeatText?: string;
  rewardLabels?: string[];
  text: string;
}

interface FloatingSuccessToastProps {
  feedback: FeedbackToastState | null;
  hintVideoUrl?: string;
  onHintVideoClick: (event: MouseEvent<HTMLVideoElement>) => void;
  onRepeatSpokenCommand: () => void;
  onSpokenCommandChoice: (choice: SceneCommandChoice) => void;
  spokenCommandResult: SceneCommandExecutionResult | null;
}

const compactFeedbackText = (feedback: FeedbackToastState) => {
  if (feedback.kind !== "correct") {
    return feedback.text;
  }

  const speedFeedback = feedback.text.match(/^.*?\+\d+\s*Speed!/i);

  if (speedFeedback) {
    return speedFeedback[0].replace(/\s+/g, " ");
  }

  return feedback.text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => {
      const normalizedSentence = sentence.toLowerCase();

      return (
        !normalizedSentence.includes("bonus zonder hint") &&
        !normalizedSentence.includes("druk op") &&
        !normalizedSentence.includes("extra bonus")
      );
    })
    .slice(0, 1)
    .join(" ");
};

export const FloatingSuccessToast = ({
  feedback,
  hintVideoUrl,
  onHintVideoClick,
  onRepeatSpokenCommand,
  onSpokenCommandChoice,
  spokenCommandResult,
}: FloatingSuccessToastProps) => {
  const stopHintAudioSessionRef = useRef<(() => void) | undefined>();
  const shouldRender = Boolean(feedback || hintVideoUrl);
  const isCorrectFeedback = feedback?.kind === "correct";

  const startHintAudioSession = () => {
    stopHintAudioSessionRef.current?.();
    stopHintAudioSessionRef.current = createForegroundAudioSession();
  };

  const stopHintAudioSession = () => {
    stopHintAudioSessionRef.current?.();
    stopHintAudioSessionRef.current = undefined;
  };

  useEffect(() => stopHintAudioSession, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <PanelCard
      aria-hidden={feedback ? undefined : true}
      aria-live="polite"
      className={classNames(
        "absolute bottom-3 left-3 right-3 mx-auto max-w-[28rem] !rounded-[1.25rem] !border-white/85 !bg-white/92 !p-2 shadow-[0_4px_0_rgba(15,23,42,0.1)]",
        feedback ? "opacity-100" : "pointer-events-none opacity-0",
        isCorrectFeedback ? "pointer-events-none bezem-feedback-toast" : "pointer-events-auto",
      )}
      data-kind={feedback?.kind ?? "prepared"}
      data-testid="scene-builder-feedback"
    >
      <div className="flex items-center gap-2">
        {hintVideoUrl ? (
          <video
            aria-label="Speel hintvideo"
            className="h-10 w-10 shrink-0 rounded-full bg-transparent object-cover"
            data-component="HintFeedbackVideo"
            draggable={false}
            onClick={onHintVideoClick}
            onEnded={stopHintAudioSession}
            onError={stopHintAudioSession}
            onPause={stopHintAudioSession}
            onPlay={startHintAudioSession}
            playsInline
            preload="auto"
            src={hintVideoUrl}
            style={{
              clipPath: "circle(50% at 50% 50%)",
            }}
            title="Speel hintvideo"
          />
        ) : feedback?.mascot ? (
          <img
            alt=""
            className="h-10 w-10 shrink-0 object-contain"
            draggable={false}
            src={
              feedback.mascot === "hint"
                ? mascotIconUrls.hint
                : mascotIconUrls.celebration
            }
          />
        ) : null}
        <div className="min-w-0 flex-1">
          {feedback ? (
            <p className="text-xs font-black leading-tight text-slate-950">
              {compactFeedbackText(feedback)}
            </p>
          ) : null}
          {feedback?.rewardLabels && feedback.rewardLabels.length > 0 ? (
            <p
              className="mt-1 text-[0.68rem] font-black leading-tight text-amber-900"
              data-testid="reward-unlock-message"
            >
              Nieuwe beloning: {feedback.rewardLabels.join(", ")}
            </p>
          ) : null}
          {spokenCommandResult && feedback && feedback.kind !== "correct" ? (
            <div
              className="mt-2 flex flex-wrap items-center gap-1.5"
              data-testid="spoken-command-actions"
            >
              {spokenCommandResult.status !== "ready"
                ? spokenCommandResult.choices.slice(0, 4).map((choice) => (
                    <button
                      className="min-h-8 rounded-xl border-2 border-sky-300 bg-sky-100 px-2 text-[0.65rem] font-black text-sky-950"
                      data-choice-id={choice.id}
                      data-choice-type={choice.type}
                      key={`${choice.type}-${choice.id}`}
                      onClick={() => onSpokenCommandChoice(choice)}
                      type="button"
                    >
                      Bedoel je {choice.label}?
                    </button>
                  ))
                : null}
              <button
                className="min-h-8 rounded-xl border-2 border-amber-300 bg-amber-100 px-2 text-[0.65rem] font-black text-amber-950"
                data-testid="repeat-spoken-command"
                onClick={onRepeatSpokenCommand}
                type="button"
              >
                Opnieuw zeggen
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </PanelCard>
  );
};

FloatingSuccessToast.displayName = "FloatingSuccessToast";
