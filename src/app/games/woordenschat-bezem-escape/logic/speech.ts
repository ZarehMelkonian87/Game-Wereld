export function speakDutch(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "nl-NL";
  utterance.rate = 0.9;
  utterance.pitch = 1.05;

  const dutchVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith("nl"));

  if (dutchVoice) {
    utterance.voice = dutchVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);

  return true;
}
