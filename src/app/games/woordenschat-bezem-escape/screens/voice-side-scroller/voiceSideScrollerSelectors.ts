import type {
  VoiceSideScrollerGameState,
  VoiceSideScrollerTarget,
} from "./voiceSideScrollerModel";
import { VOICE_SCROLLER_LEVEL_DISTANCE } from "./voiceSideScrollerModel";

const TARGET_RECOGNITION_MIN_X = -0.08;
const TARGET_RECOGNITION_MAX_X = 1.1;

export const getVisibleVoiceScrollerTargets = (
  targets: VoiceSideScrollerTarget[],
) =>
  targets
    .filter((target) =>
      !target.collected &&
      target.x > TARGET_RECOGNITION_MIN_X &&
      target.x < TARGET_RECOGNITION_MAX_X,
    )
    .sort((leftTarget, rightTarget) => leftTarget.x - rightTarget.x);

export const getVoiceScrollerDifficultyProgress = (
  state: VoiceSideScrollerGameState,
) => Math.round(state.distance % VOICE_SCROLLER_LEVEL_DISTANCE);

export const getVoiceScrollerDistanceMeters = (
  state: VoiceSideScrollerGameState,
) => Math.floor(state.distance);
