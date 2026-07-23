import { useEffect, useRef, useState } from "react";
import { useProfile } from "../../../../contexts/ProfileContext";
import { backgroundMusicUrl } from "../../asset-urls";
import {
  BEZEM_ESCAPE_FOREGROUND_AUDIO_END_EVENT,
  BEZEM_ESCAPE_FOREGROUND_AUDIO_START_EVENT,
  GAME_BACKGROUND_MUSIC_DUCKED_VOLUME,
  GAME_BACKGROUND_MUSIC_VOLUME,
} from "../../logic/game-audio-events";
import { BEZEM_ESCAPE_SETTINGS_CHANGED_EVENT, readBezemEscapeSettings } from "../../logic/settings";

export const GameBackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const foregroundAudioCountRef = useRef(0);
  const hasUserActivatedAudioRef = useRef(false);
  const { currentProfile } = useProfile();
  const profileId = currentProfile?.id ?? "demo-profile";
  const [musicEnabled, setMusicEnabled] = useState(
    () => readBezemEscapeSettings(profileId).musicEnabled,
  );

  useEffect(() => {
    setMusicEnabled(readBezemEscapeSettings(profileId).musicEnabled);
  }, [profileId]);

  useEffect(() => {
    const updateFromSettings = () => {
      setMusicEnabled(readBezemEscapeSettings(profileId).musicEnabled);
    };

    window.addEventListener(BEZEM_ESCAPE_SETTINGS_CHANGED_EVENT, updateFromSettings);

    return () => {
      window.removeEventListener(BEZEM_ESCAPE_SETTINGS_CHANGED_EVENT, updateFromSettings);
    };
  }, [profileId]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = GAME_BACKGROUND_MUSIC_VOLUME;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const playMusic = async () => {
      if (!musicEnabled || !hasUserActivatedAudioRef.current) {
        return;
      }

      audio.volume =
        foregroundAudioCountRef.current > 0
          ? GAME_BACKGROUND_MUSIC_DUCKED_VOLUME
          : GAME_BACKGROUND_MUSIC_VOLUME;

      try {
        await audio.play();
      } catch {
        // Mobile browsers can still block playback until the next trusted tap.
      }
    };

    if (!musicEnabled) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    void playMusic();
  }, [musicEnabled]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const activateAudio = () => {
      hasUserActivatedAudioRef.current = true;

      if (musicEnabled) {
        void audio.play().catch(() => undefined);
      }
    };

    window.addEventListener("pointerdown", activateAudio, { once: true });
    window.addEventListener("keydown", activateAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", activateAudio);
      window.removeEventListener("keydown", activateAudio);
    };
  }, [musicEnabled]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const setTargetVolume = () => {
      audio.volume =
        foregroundAudioCountRef.current > 0
          ? GAME_BACKGROUND_MUSIC_DUCKED_VOLUME
          : GAME_BACKGROUND_MUSIC_VOLUME;
    };

    const handleForegroundAudioStart = () => {
      foregroundAudioCountRef.current += 1;
      setTargetVolume();
    };

    const handleForegroundAudioEnd = () => {
      foregroundAudioCountRef.current = Math.max(0, foregroundAudioCountRef.current - 1);
      setTargetVolume();
    };

    window.addEventListener(BEZEM_ESCAPE_FOREGROUND_AUDIO_START_EVENT, handleForegroundAudioStart);
    window.addEventListener(BEZEM_ESCAPE_FOREGROUND_AUDIO_END_EVENT, handleForegroundAudioEnd);

    return () => {
      window.removeEventListener(
        BEZEM_ESCAPE_FOREGROUND_AUDIO_START_EVENT,
        handleForegroundAudioStart,
      );
      window.removeEventListener(BEZEM_ESCAPE_FOREGROUND_AUDIO_END_EVENT, handleForegroundAudioEnd);
    };
  }, []);

  return (
    <audio
      aria-hidden="true"
      data-component="GameBackgroundMusic"
      data-music-enabled={musicEnabled ? "true" : "false"}
      loop
      preload="auto"
      ref={audioRef}
      src={backgroundMusicUrl}
    />
  );
};

GameBackgroundMusic.displayName = "GameBackgroundMusic";
