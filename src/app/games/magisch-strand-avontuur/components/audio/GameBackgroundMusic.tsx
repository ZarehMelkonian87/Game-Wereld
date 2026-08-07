import { useEffect, useMemo, useRef, useState } from "react";
import { backgroundMusicUrl } from "../../asset-urls";
import {
  MAGISCH_STRAND_AVONTUUR_FOREGROUND_AUDIO_END_EVENT,
  MAGISCH_STRAND_AVONTUUR_FOREGROUND_AUDIO_START_EVENT,
  GAME_BACKGROUND_MUSIC_DUCKED_VOLUME,
  GAME_BACKGROUND_MUSIC_VOLUME,
} from "../../logic/game-audio-events";
import { MAGISCH_STRAND_AVONTUUR_SETTINGS_CHANGED_EVENT, readBezemEscapeSettings } from "../../logic/settings";
import { useGameRuntime } from "../../runtime/GameRuntimeContext";

export const GameBackgroundMusic = () => {
  const foregroundAudioCountRef = useRef(0);
  const hasUserActivatedAudioRef = useRef(false);
  const { identity, media, storage } = useGameRuntime();
  const profileId = identity.profileId;
  const playback = useMemo(() => media.createPlayback(backgroundMusicUrl), [media]);
  const [musicEnabled, setMusicEnabled] = useState(
    () => readBezemEscapeSettings(profileId, storage).musicEnabled,
  );

  useEffect(() => {
    playback.setLoop(true);
    playback.setVolume(GAME_BACKGROUND_MUSIC_VOLUME);
    return () => playback.dispose();
  }, [playback]);

  useEffect(() => {
    setMusicEnabled(readBezemEscapeSettings(profileId, storage).musicEnabled);
  }, [profileId, storage]);

  useEffect(() => {
    const updateFromSettings = () => {
      setMusicEnabled(readBezemEscapeSettings(profileId, storage).musicEnabled);
    };
    window.addEventListener(MAGISCH_STRAND_AVONTUUR_SETTINGS_CHANGED_EVENT, updateFromSettings);
    return () =>
      window.removeEventListener(MAGISCH_STRAND_AVONTUUR_SETTINGS_CHANGED_EVENT, updateFromSettings);
  }, [profileId, storage]);

  useEffect(() => {
    if (!musicEnabled) {
      playback.pause();
      playback.reset();
      return;
    }
    if (hasUserActivatedAudioRef.current) {
      void playback.play();
    }
  }, [musicEnabled, playback]);

  useEffect(() => {
    const activateAudio = () => {
      hasUserActivatedAudioRef.current = true;
      if (musicEnabled) void playback.play();
    };
    window.addEventListener("pointerdown", activateAudio, { once: true });
    window.addEventListener("keydown", activateAudio, { once: true });
    return () => {
      window.removeEventListener("pointerdown", activateAudio);
      window.removeEventListener("keydown", activateAudio);
    };
  }, [musicEnabled, playback]);

  useEffect(() => {
    const setTargetVolume = () => {
      playback.setVolume(
        foregroundAudioCountRef.current > 0
          ? GAME_BACKGROUND_MUSIC_DUCKED_VOLUME
          : GAME_BACKGROUND_MUSIC_VOLUME,
      );
    };
    const handleForegroundAudioStart = () => {
      foregroundAudioCountRef.current += 1;
      setTargetVolume();
    };
    const handleForegroundAudioEnd = () => {
      foregroundAudioCountRef.current = Math.max(0, foregroundAudioCountRef.current - 1);
      setTargetVolume();
    };
    window.addEventListener(MAGISCH_STRAND_AVONTUUR_FOREGROUND_AUDIO_START_EVENT, handleForegroundAudioStart);
    window.addEventListener(MAGISCH_STRAND_AVONTUUR_FOREGROUND_AUDIO_END_EVENT, handleForegroundAudioEnd);
    return () => {
      window.removeEventListener(
        MAGISCH_STRAND_AVONTUUR_FOREGROUND_AUDIO_START_EVENT,
        handleForegroundAudioStart,
      );
      window.removeEventListener(MAGISCH_STRAND_AVONTUUR_FOREGROUND_AUDIO_END_EVENT, handleForegroundAudioEnd);
    };
  }, [playback]);

  return null;
};

GameBackgroundMusic.displayName = "GameBackgroundMusic";
