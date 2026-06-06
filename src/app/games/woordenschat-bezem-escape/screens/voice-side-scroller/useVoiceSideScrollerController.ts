import { useCallback, useEffect, useRef, useState } from "react";
import {
  pauseVoiceSideScrollerRound,
  resumeVoiceSideScrollerRound,
  startVoiceSideScrollerRound,
  tickVoiceSideScrollerState,
} from "./voiceSideScrollerEngine";
import {
  createInitialVoiceScrollerState,
  type VoiceSideScrollerGameState,
} from "./voiceSideScrollerModel";
import {
  cancelVoiceSideScrollerFrame,
  getVoiceSideScrollerTimestamp,
  requestVoiceSideScrollerFrame,
} from "./voiceSideScrollerFrame";

export interface VoiceSideScrollerController {
  fallbackDown: () => void;
  fallbackNeutral: () => void;
  fallbackUp: () => void;
  pauseRound: () => void;
  resetRound: () => void;
  resumeRound: () => void;
  startRound: () => void;
  state: VoiceSideScrollerGameState;
}

export const useVoiceSideScrollerController = (): VoiceSideScrollerController => {
  const [state, setState] = useState(() => createInitialVoiceScrollerState());
  const verticalInputRef = useRef(0);

  useEffect(() => {
    if (state.status !== "running") {
      return undefined;
    }

    let animationFrameId = 0;
    let previousTimestamp = getVoiceSideScrollerTimestamp();

    const tick = (timestamp: number) => {
      const deltaMs = timestamp - previousTimestamp;
      previousTimestamp = timestamp;

      setState((currentState) =>
        tickVoiceSideScrollerState({
          deltaMs,
          state: currentState,
          verticalInput: verticalInputRef.current,
        }),
      );

      animationFrameId = requestVoiceSideScrollerFrame(tick);
    };

    animationFrameId = requestVoiceSideScrollerFrame(tick);

    return () => {
      cancelVoiceSideScrollerFrame(animationFrameId);
    };
  }, [state.status]);

  const startRound = useCallback(() => {
    verticalInputRef.current = 0;
    setState(startVoiceSideScrollerRound());
  }, []);

  const pauseRound = useCallback(() => {
    verticalInputRef.current = 0;
    setState((currentState) => pauseVoiceSideScrollerRound(currentState));
  }, []);

  const resumeRound = useCallback(() => {
    setState((currentState) => resumeVoiceSideScrollerRound(currentState));
  }, []);

  const resetRound = useCallback(() => {
    verticalInputRef.current = 0;
    setState(createInitialVoiceScrollerState());
  }, []);

  const fallbackUp = useCallback(() => {
    verticalInputRef.current = -1;
  }, []);

  const fallbackDown = useCallback(() => {
    verticalInputRef.current = 1;
  }, []);

  const fallbackNeutral = useCallback(() => {
    verticalInputRef.current = 0;
  }, []);

  return {
    fallbackDown,
    fallbackNeutral,
    fallbackUp,
    pauseRound,
    resetRound,
    resumeRound,
    startRound,
    state,
  };
};
