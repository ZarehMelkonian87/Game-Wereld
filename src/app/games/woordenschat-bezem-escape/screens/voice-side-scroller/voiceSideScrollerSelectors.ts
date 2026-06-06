import type {
  VoiceSideScrollerGameState,
  VoiceSideScrollerTarget,
} from "./voiceSideScrollerModel";
import { VOICE_SCROLLER_ROUND_DURATION_MS } from "./voiceSideScrollerModel";

export const getActiveVoiceScrollerTarget = (
  targets: VoiceSideScrollerTarget[],
) =>
  targets
    .filter((target) => !target.collected && target.x > 0.12 && target.x < 1.15)
    .sort((leftTarget, rightTarget) => leftTarget.x - rightTarget.x)[0] ??
  targets.find((target) => !target.collected) ??
  targets[0];

export const getVoiceScrollerProgressPercent = (
  state: VoiceSideScrollerGameState,
) => Math.round((state.elapsedMs / VOICE_SCROLLER_ROUND_DURATION_MS) * 100);

export const getVoiceScrollerTimeLeftSeconds = (
  state: VoiceSideScrollerGameState,
) => Math.ceil(state.timeLeftMs / 1000);
