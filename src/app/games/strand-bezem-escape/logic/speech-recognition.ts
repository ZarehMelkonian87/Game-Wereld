import type {
  SpeechRecognitionSupport,
  VoiceRecognitionErrorCode,
} from "../../../game-platform/contracts";

export type {
  SpeechRecognitionSupport,
  VoiceRecognitionAlternative,
  VoiceRecognitionErrorCode,
  VoiceRecognitionResult,
  VoiceRecognitionStatus,
} from "../../../game-platform/contracts";

export const getSpeechRecognitionSupportMessage = (support: SpeechRecognitionSupport) => {
  if (support.isSupported) {
    return "Spraakherkenning is beschikbaar.";
  }
  if (support.reason === "insecure-context") {
    return "Spraak werkt op mobiel meestal alleen via HTTPS of localhost.";
  }
  if (support.reason === "api-missing") {
    return "Deze browser ondersteunt spraakherkenning niet. Gebruik de fallback of probeer Chrome.";
  }
  return "Spraakherkenning is hier niet beschikbaar.";
};

export const getSpeechRecognitionErrorMessage = (
  errorCode: VoiceRecognitionErrorCode,
  fallbackMessage = "",
) => {
  if (errorCode === "no-speech") {
    return "Ik hoorde nog geen zin. Probeer het nog eens rustig.";
  }
  if (errorCode === "not-allowed" || errorCode === "service-not-allowed") {
    return "De microfoon mag nog niet gebruikt worden. Controleer de toestemming.";
  }
  if (errorCode === "audio-capture") {
    return "Ik kan de microfoon niet vinden. Controleer de microfoon van dit apparaat.";
  }
  if (errorCode === "network") {
    return "Spraakherkenning heeft nu geen verbinding. Probeer het later opnieuw.";
  }
  if (errorCode === "language-not-supported") {
    return "Nederlandse spraakherkenning wordt in deze browser niet ondersteund.";
  }
  if (errorCode === "aborted") {
    return "Luisteren is gestopt.";
  }
  return fallbackMessage || "Ik kon de zin niet goed verwerken. Probeer het nog eens.";
};
