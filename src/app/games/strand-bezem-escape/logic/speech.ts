import { createForegroundAudioSession, GAME_FOREGROUND_AUDIO_VOLUME } from "./game-audio-events";

export const speakDutch = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "nl-NL";
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  utterance.volume = GAME_FOREGROUND_AUDIO_VOLUME;
  const endForegroundAudioSession = createForegroundAudioSession();
  utterance.onend = endForegroundAudioSession;
  utterance.onerror = endForegroundAudioSession;

  const dutchVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith("nl"));

  if (dutchVoice) {
    utterance.voice = dutchVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);

  return true;
};
