import type {
  VoiceSideScrollerGameState,
  VoiceSideScrollerTarget,
} from "./voiceSideScrollerModel";
import { VOICE_SCROLLER_LEVEL_DISTANCE } from "./voiceSideScrollerModel";

export const getVisibleVoiceScrollerTargets = (
  targets: VoiceSideScrollerTarget[],
) =>
  targets
    .filter((target) => !target.collected && target.x > 0.02 && target.x < 0.98)
    .sort((leftTarget, rightTarget) => leftTarget.x - rightTarget.x);

export const getVoiceScrollerDifficultyProgress = (
  state: VoiceSideScrollerGameState,
) => Math.round(state.distance % VOICE_SCROLLER_LEVEL_DISTANCE);

export const getVoiceScrollerDistanceMeters = (
  state: VoiceSideScrollerGameState,
) => Math.floor(state.distance);
