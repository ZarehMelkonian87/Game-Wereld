export const MAGISCH_STRAND_AVONTUUR_FOREGROUND_AUDIO_START_EVENT =
  "magisch-strand-avontuur:foreground-audio-start";
export const MAGISCH_STRAND_AVONTUUR_FOREGROUND_AUDIO_END_EVENT = "magisch-strand-avontuur:foreground-audio-end";

export const GAME_FOREGROUND_AUDIO_VOLUME = 1;
export const GAME_BACKGROUND_MUSIC_VOLUME = 0.26;
export const GAME_BACKGROUND_MUSIC_DUCKED_VOLUME = 0.1;

const dispatchAudioEvent = (eventName: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(eventName));
};

export const dispatchForegroundAudioStart = () => {
  dispatchAudioEvent(MAGISCH_STRAND_AVONTUUR_FOREGROUND_AUDIO_START_EVENT);
};

export const dispatchForegroundAudioEnd = () => {
  dispatchAudioEvent(MAGISCH_STRAND_AVONTUUR_FOREGROUND_AUDIO_END_EVENT);
};

export const createForegroundAudioSession = () => {
  let isActive = true;

  dispatchForegroundAudioStart();

  return () => {
    if (!isActive) {
      return;
    }

    isActive = false;
    dispatchForegroundAudioEnd();
  };
};
