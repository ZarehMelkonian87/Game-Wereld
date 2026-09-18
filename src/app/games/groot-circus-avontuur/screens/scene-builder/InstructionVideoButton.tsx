import { useCallback, useEffect, useRef } from "react";
import {
  createForegroundAudioSession,
  GAME_FOREGROUND_AUDIO_VOLUME,
} from "../../logic/game-audio-events";

interface InstructionVideoButtonProps {
  autoPlayOnMount?: boolean;
  label: string;
  onPlaybackError?: () => void;
  onPlaybackStart?: () => void;
  onPlayRequest?: () => boolean;
  src: string;
  variant?: "control" | "feedbackIcon";
}

export const InstructionVideoButton = ({
  autoPlayOnMount = false,
  label,
  onPlaybackError,
  onPlaybackStart,
  onPlayRequest,
  src,
  variant = "control",
}: InstructionVideoButtonProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onPlaybackErrorRef = useRef(onPlaybackError);
  const onPlaybackStartRef = useRef(onPlaybackStart);
  const onPlayRequestRef = useRef(onPlayRequest);
  const stopForegroundAudioSessionRef = useRef<(() => void) | undefined>();
  onPlaybackErrorRef.current = onPlaybackError;
  onPlaybackStartRef.current = onPlaybackStart;
  onPlayRequestRef.current = onPlayRequest;
  const buttonClassName =
    variant === "feedbackIcon"
      ? "pointer-events-auto relative h-12 min-h-12 aspect-video shrink-0 touch-manipulation overflow-hidden rounded-xl border border-white/80 bg-white p-0 shadow-sm transition duration-150 active:scale-[0.98]"
      : "pointer-events-auto relative h-14 min-h-14 aspect-video shrink-0 touch-manipulation overflow-hidden rounded-xl border-2 border-white/90 bg-white p-0 shadow-md transition duration-150 hover:brightness-105 active:translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400";

  const playVideo = useCallback(async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    try {
      video.pause();
      if (video.readyState === 0) {
        video.load();
      }
      video.currentTime = 0;
      video.muted = false;
      video.volume = GAME_FOREGROUND_AUDIO_VOLUME;
      await video.play();
      stopForegroundAudioSessionRef.current?.();
      stopForegroundAudioSessionRef.current = createForegroundAudioSession();
      onPlaybackStartRef.current?.();
    } catch {
      onPlaybackErrorRef.current?.();
    }
  }, []);

  const stopForegroundAudioSession = useCallback(() => {
    stopForegroundAudioSessionRef.current?.();
    stopForegroundAudioSessionRef.current = undefined;
  }, []);

  useEffect(() => {
    if (!autoPlayOnMount) {
      return;
    }

    if (onPlayRequestRef.current && !onPlayRequestRef.current()) {
      return;
    }

    void playVideo();

    return stopForegroundAudioSession;
  }, [autoPlayOnMount, playVideo, src, stopForegroundAudioSession]);

  const handleClick = async () => {
    if (onPlayRequestRef.current && !onPlayRequestRef.current()) {
      return;
    }

    await playVideo();
  };

  return (
    <button
      aria-label={label}
      className={buttonClassName}
      data-component="InstructionVideoButton"
      onClick={handleClick}
      title={label}
      type="button"
    >
      <video
        aria-hidden="true"
        className="pointer-events-none h-full w-full object-cover bg-white"
        data-slot="video"
        autoPlay={autoPlayOnMount}
        controls={false}
        disablePictureInPicture
        onEnded={stopForegroundAudioSession}
        onError={stopForegroundAudioSession}
        onPause={stopForegroundAudioSession}
        playsInline
        preload="metadata"
        ref={videoRef}
        src={src}
      />
      {/* Witte afdeklagen aan de zijkanten om zwarte videoranden te verbergen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[5px] bg-white"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[5px] bg-white"
      />
    </button>
  );
};

InstructionVideoButton.displayName = "InstructionVideoButton";
