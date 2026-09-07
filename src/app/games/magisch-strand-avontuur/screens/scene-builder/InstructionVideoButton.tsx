import { useCallback, useEffect, useRef, useState } from "react";
import { resolveCachedMediaUrl } from "../../../../pwa/mediaCacheResolver";
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
  const [resolvedSrc, setResolvedSrc] = useState(src);

  useEffect(() => {
    let active = true;
    void resolveCachedMediaUrl(src).then((localUrl) => {
      if (active) {
        setResolvedSrc(localUrl);
      }
    });
    return () => {
      active = false;
    };
  }, [src]);
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
      ? "pointer-events-auto h-12 min-h-12 w-12 shrink-0 touch-manipulation overflow-hidden rounded-full bg-transparent p-0"
      : "pointer-events-auto h-14 min-h-14 w-14 shrink-0 touch-manipulation overflow-hidden rounded-full bg-transparent p-0 transition duration-150 active:translate-y-0.5 active:scale-[0.98]";

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
        className="pointer-events-none h-full w-full rounded-full object-cover"
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
        src={resolvedSrc}
        style={{
          clipPath: "circle(50% at 50% 50%)",
        }}
      />
    </button>
  );
};

InstructionVideoButton.displayName = "InstructionVideoButton";
