export const VOICE_PRIVACY_NOTICE_VERSION = "2026-06-01";

export const voicePrivacyCopy = {
  acknowledgement: "Vraag toestemming",
  body:
    "De app bewaart geen geluidsopnames. De microfoon wordt alleen gebruikt om een korte zin naar tekst om te zetten. Die tekstzin kan als oefenobservatie bij de voortgang staan.",
  browserNote:
    "Spraakherkenning loopt via de spraakfunctie van de browser of het apparaat.",
  fallback:
    "Werkt spraak niet op dit apparaat? Typ dezelfde zin. De game oefent dan dezelfde taalopdracht.",
  permissionNote:
    "Na deze knop vraagt de browser om microfoontoestemming. Kies Sta toe als je spraak wilt gebruiken.",
  title: "Microfoon en privacy",
};

const getVoicePrivacyStorageKey = (profileId: string) =>
  `woordenschat-bezem-escape:${profileId}:voice-privacy:${VOICE_PRIVACY_NOTICE_VERSION}`;

export const readVoicePrivacyAccepted = (profileId: string) => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(getVoicePrivacyStorageKey(profileId)) === "accepted";
  } catch {
    return false;
  }
};

export const saveVoicePrivacyAccepted = (profileId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(getVoicePrivacyStorageKey(profileId), "accepted");
  } catch {
    // Privacy notice acceptance is a convenience flag. If storage is blocked, show it again.
  }
};
