import type {
  VoiceSideScrollerGameState,
  VoiceSideScrollerTarget,
} from "./voiceSideScrollerModel";
import { VOICE_SCROLLER_ROUND_DURATION_MS } from "./voiceSideScrollerModel";

export const getVisibleVoiceScrollerTargets = (
  targets: VoiceSideScrollerTarget[],
) =>
  targets
    .filter((target) => !target.collected && target.x > 0.02 && target.x < 0.98)
    .sort((leftTarget, rightTarget) => leftTarget.x - rightTarget.x);

export const getVoiceScrollerProgressPercent = (
  state: VoiceSideScrollerGameState,
) => Math.round((state.elapsedMs / VOICE_SCROLLER_ROUND_DURATION_MS) * 100);

export const getVoiceScrollerTimeLeftSeconds = (
  state: VoiceSideScrollerGameState,
) => Math.ceil(state.timeLeftMs / 1000);
