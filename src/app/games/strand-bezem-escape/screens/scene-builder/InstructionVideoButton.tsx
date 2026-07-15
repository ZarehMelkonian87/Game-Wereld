import { useEffect, useRef } from "react";
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
  const stopForegroundAudioSessionRef = useRef<(() => void) | undefined>();
  const buttonClassName =
    variant === "feedbackIcon"
      ? "pointer-events-auto h-10 min-h-10 w-10 shrink-0 touch-manipulation overflow-hidden rounded-full bg-transparent p-0"
      : "pointer-events-auto h-14 min-h-14 w-14 shrink-0 touch-manipulation overflow-hidden rounded-full bg-transparent p-0 transition duration-150 active:translate-y-0.5 active:scale-[0.98]";

  const playVideo = async () => {
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
      onPlaybackStart?.();
    } catch {
      onPlaybackError?.();
    }
  };

  const stopForegroundAudioSession = () => {
    stopForegroundAudioSessionRef.current?.();
    stopForegroundAudioSessionRef.current = undefined;
  };

  useEffect(() => {
    if (!autoPlayOnMount) {
      return;
    }

    if (onPlayRequest && !onPlayRequest()) {
      return;
    }

    void playVideo();

    return stopForegroundAudioSession;
  }, [autoPlayOnMount, src]);

  const handleClick = async () => {
    if (onPlayRequest && !onPlayRequest()) {
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
        className="pointer-events-none h-full w-full rounded-full object-cover"
        data-slot="video"
        autoPlay={autoPlayOnMount}
        controls={false}
        disablePictureInPicture
        onEnded={stopForegroundAudioSession}
        onError={stopForegroundAudioSession}
        onPause={stopForegroundAudioSession}
        playsInline
        preload="auto"
        ref={videoRef}
        src={src}
        style={{
          clipPath: "circle(50% at 50% 50%)",
        }}
      />
    </button>
  );
};

InstructionVideoButton.displayName = "InstructionVideoButton";
