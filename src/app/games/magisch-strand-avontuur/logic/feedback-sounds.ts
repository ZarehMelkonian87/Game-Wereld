import type { GameRuntime } from "../../../game-platform/contracts";
import { feedbackCorrectSoundUrl, feedbackWrongSoundUrl } from "../asset-urls";
import { readBezemEscapeSettings } from "./settings";

export type FeedbackSoundKind = "correct" | "wrong";

const feedbackSoundUrls: Record<FeedbackSoundKind, string> = {
  correct: feedbackCorrectSoundUrl,
  wrong: feedbackWrongSoundUrl,
};

/**
 * Speelt een kort goed/fout-geluid af (T-51). Respecteert de audio-instelling
 * van het profiel en laat een mislukte afspeelpoging (bijv. autoplay-blokkade)
 * stil passeren: het geluid is een extraatje, nooit een blokkade.
 */
export const playFeedbackSound = (
  runtime: GameRuntime,
  profileId: string,
  kind: FeedbackSoundKind,
): void => {
  if (!readBezemEscapeSettings(profileId, runtime.storage).audioEnabled) {
    return;
  }
  void runtime.media.playAudio(feedbackSoundUrls[kind]).catch(() => undefined);
};
