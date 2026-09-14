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
  /**
   * Onderbreekt de video: geen autoplay en pauzeert een spelende video.
   * Gebruikt om de video stil te leggen terwijl de microfoon actief is, zodat
   * video-decodering niet met de spraakherkenning concurreert (T-33c).
   */
  suspended?: boolean;
  variant?: "control" | "feedbackIcon";
}

export const InstructionVideoButton = ({
  autoPlayOnMount = false,
  label,
  onPlaybackError,
  onPlaybackStart,
  onPlayRequest,
  src,
  suspended = false,
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
  const suspendedRef = useRef(suspended);
  const stopForegroundAudioSessionRef = useRef<(() => void) | undefined>();
  onPlaybackErrorRef.current = onPlaybackError;
  onPlaybackStartRef.current = onPlaybackStart;
  onPlayRequestRef.current = onPlayRequest;
  suspendedRef.current = suspended;
  const buttonClassName =
    variant === "feedbackIcon"
      ? "pointer-events-auto h-12 min-h-12 w-12 shrink-0 touch-manipulation overflow-hidden rounded-full bg-transparent p-0"
      : "pointer-events-auto h-14 min-h-14 w-14 shrink-0 touch-manipulation overflow-hidden rounded-full bg-transparent p-0 transition duration-150 active:translate-y-0.5 active:scale-[0.98]";

  const playVideo = useCallback(async (options?: { userInitiated?: boolean }) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const userInitiated = options?.userInitiated ?? false;

    const startPlayback = async (muted: boolean) => {
      video.pause();
      if (video.readyState === 0) {
        video.load();
      }
      video.currentTime = 0;
      video.muted = muted;
      video.volume = GAME_FOREGROUND_AUDIO_VOLUME;
      await video.play();
    };

    try {
      // Probeer mét geluid. Na de vele tikken in het spel (onboarding, "Start
      // Spel") staat de browser autoplay-met-geluid meestal toe.
      await startPlayback(false);
      stopForegroundAudioSessionRef.current?.();
      stopForegroundAudioSessionRef.current = createForegroundAudioSession();
      onPlaybackStartRef.current?.();
    } catch (error) {
      const errorName = error instanceof DOMException ? error.name : "";
      const isAutoplayBlocked = errorName === "NotAllowedError";
      // Een onderbroken play() (AbortError) is geen echte fout: dat gebeurt bij
      // een snelle her-render/pauze of de dubbele effect-run in dev-modus.
      const isInterrupted = errorName === "AbortError";

      // Autoplay-met-geluid geblokkeerd (geen echte fout): speel gedempt door,
      // zodat de video tóch loopt. Het kind kan tikken om het geluid te horen.
      if (!userInitiated && isAutoplayBlocked) {
        try {
          await startPlayback(true);
          onPlaybackStartRef.current?.();
        } catch {
          // Ook gedempt geblokkeerd: stil laten, geen foutmelding tonen.
        }
        return;
      }

      if (isInterrupted) {
        return;
      }

      onPlaybackErrorRef.current?.();
    }
  }, []);

  const stopForegroundAudioSession = useCallback(() => {
    stopForegroundAudioSessionRef.current?.();
    stopForegroundAudioSessionRef.current = undefined;
  }, []);

  useEffect(() => {
    // Alleen autoplayen bij mount/nieuwe video, en niet als de mic op dat moment
    // actief is. We gebruiken een ref zodat het loslaten van `suspended` (mic
    // stopt) de video NIET automatisch opnieuw start.
    if (!autoPlayOnMount || suspendedRef.current) {
      return;
    }

    if (onPlayRequestRef.current && !onPlayRequestRef.current()) {
      return;
    }

    void playVideo();

    return stopForegroundAudioSession;
  }, [autoPlayOnMount, playVideo, src, stopForegroundAudioSession]);

  useEffect(() => {
    // Zodra de microfoon actief is (suspended), leggen we een spelende video
    // stil zodat video-decodering niet met de spraakherkenning concurreert.
    if (suspended) {
      videoRef.current?.pause();
      stopForegroundAudioSession();
    }
  }, [stopForegroundAudioSession, suspended]);

  const handleClick = async () => {
    if (onPlayRequestRef.current && !onPlayRequestRef.current()) {
      return;
    }

    await playVideo({ userInitiated: true });
  };

  return (
    <button
      aria-label={label}
      className={buttonClassName}
      data-component="InstructionVideoButton"
      data-suspended={suspended ? "true" : "false"}
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
