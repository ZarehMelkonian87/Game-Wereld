import { useEffect, useRef, useState, type MouseEvent } from "react";
import { mascotIconUrls } from "../../asset-urls";
import { PanelCard } from "../../components/ui";
import type { SceneCommandChoice, SceneCommandExecutionResult } from "../../logic/scene-command-executor";
import { classNames } from "../../components/ui/classNames";
import {
  createForegroundAudioSession,
  GAME_FOREGROUND_AUDIO_VOLUME,
} from "../../logic/game-audio-events";

interface FeedbackToastState {
  hintVideoUrl?: string;
  kind: "almost" | "correct" | "ready";
  mascot?: "celebration" | "hint";
  repeatText?: string;
  rewardLabels?: string[];
  text: string;
}

interface FloatingSuccessToastProps {
  autoPlayFeedbackVideo?: boolean;
  feedback: FeedbackToastState | null;
  hintVideoUrl?: string;
  onHintVideoClick: (event: MouseEvent<HTMLVideoElement>) => void;
  onHintVideoPlaybackStateChange?: (isPlaying: boolean) => void;
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
  autoPlayFeedbackVideo = false,
  feedback,
  hintVideoUrl,
  onHintVideoClick,
  onHintVideoPlaybackStateChange,
  onRepeatSpokenCommand,
  onSpokenCommandChoice,
  spokenCommandResult,
}: FloatingSuccessToastProps) => {
  const stopHintAudioSessionRef = useRef<(() => void) | undefined>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);
  const activeHintVideoUrl = feedback?.hintVideoUrl ?? hintVideoUrl;
  const shouldRender = Boolean(feedback && (feedback.text || activeHintVideoUrl));
  const isCorrectFeedback = feedback?.kind === "correct";
  const videoLabel = isCorrectFeedback ? "Speel feedbackvideo" : "Speel hintvideo";

  const startHintAudioSession = () => {
    stopHintAudioSessionRef.current?.();
    stopHintAudioSessionRef.current = createForegroundAudioSession();
    setIsVideoPlaying(true);
    setHasVideoEnded(false);
    onHintVideoPlaybackStateChange?.(true);
  };

  const stopHintAudioSession = () => {
    stopHintAudioSessionRef.current?.();
    stopHintAudioSessionRef.current = undefined;
    setIsVideoPlaying(false);
    onHintVideoPlaybackStateChange?.(false);
  };

  const handleVideoEnded = () => {
    stopHintAudioSession();
    setHasVideoEnded(true);
  };

  useEffect(() => stopHintAudioSession, []);

  useEffect(() => {
    setIsVideoPlaying(false);
    setHasVideoEnded(false);
  }, [activeHintVideoUrl]);

  useEffect(() => {
    if (!autoPlayFeedbackVideo || !activeHintVideoUrl || !videoRef.current || !feedback) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      video.pause();
      if (video.readyState === 0) {
        video.load();
      }
      video.currentTime = 0;
      video.muted = false;
      video.volume = GAME_FOREGROUND_AUDIO_VOLUME;
      void video.play().catch(stopHintAudioSession);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [autoPlayFeedbackVideo, activeHintVideoUrl, feedback]);

  useEffect(() => {
    if (!activeHintVideoUrl || isVideoPlaying || hasVideoEnded || !feedback) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setHasVideoEnded(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeHintVideoUrl, feedback, hasVideoEnded, isVideoPlaying]);

  if (!shouldRender || !feedback) {
    return null;
  }

  const animationClass = isCorrectFeedback
    ? hintVideoUrl
      ? hasVideoEnded
        ? "bezem-feedback-toast-after-ended"
        : ""
      : "bezem-feedback-toast"
    : "";

  return (
    <PanelCard
      aria-hidden={feedback ? undefined : true}
      aria-live="polite"
      className={classNames(
        "absolute bottom-[calc(clamp(4.75rem,11dvh,6rem)+env(safe-area-inset-bottom,0px)+1.125rem)] left-3 right-3 mx-auto max-w-[28rem] z-20 !rounded-[1.25rem] !border-white/85 !bg-white/92 !p-2 shadow-[0_4px_0_rgba(15,23,42,0.1)]",
        feedback ? "opacity-100" : "pointer-events-none opacity-0",
        isCorrectFeedback && !hintVideoUrl ? "pointer-events-none" : "pointer-events-auto",
        animationClass,
      )}
      data-kind={feedback?.kind ?? "prepared"}
      data-testid="scene-builder-feedback"
    >
      <div className="flex items-center gap-2">
        {hintVideoUrl ? (
          <video
            aria-label={videoLabel}
            autoPlay={autoPlayFeedbackVideo}
            className="h-10 w-10 shrink-0 rounded-full bg-transparent object-cover"
            data-auto-play-feedback-video={autoPlayFeedbackVideo ? "true" : "false"}
            data-component="HintFeedbackVideo"
            draggable={false}
            onClick={onHintVideoClick}
            onEnded={handleVideoEnded}
            onError={stopHintAudioSession}
            onPause={stopHintAudioSession}
            onPlay={startHintAudioSession}
            playsInline
            preload="auto"
            ref={videoRef}
            src={hintVideoUrl}
            style={{
              clipPath: "circle(50% at 50% 50%)",
            }}
            title={videoLabel}
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
