import { useCallback, useEffect, useRef, useState } from "react";
import {
  collectVoiceSideScrollerTarget,
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
import {
  useVoiceSideScrollerMicrophone,
  type VoiceSideScrollerMicrophoneState,
} from "./useVoiceSideScrollerMicrophone";
import {
  useVoiceSideScrollerWordRecognition,
  type VoiceSideScrollerWordRecognitionState,
} from "./useVoiceSideScrollerWordRecognition";
import { getActiveVoiceScrollerTarget } from "./voiceSideScrollerSelectors";
import type { VoiceSideScrollerTarget } from "./voiceSideScrollerModel";

export interface VoiceSideScrollerController {
  fallbackDown: () => void;
  fallbackNeutral: () => void;
  fallbackUp: () => void;
  pauseRound: () => void;
  resetRound: () => void;
  resumeRound: () => void;
  repeatWordPrompt: () => boolean;
  startRound: () => void;
  activeTarget?: VoiceSideScrollerTarget;
  microphone: VoiceSideScrollerMicrophoneState;
  state: VoiceSideScrollerGameState;
  wordRecognition: VoiceSideScrollerWordRecognitionState;
}

export const useVoiceSideScrollerController = (): VoiceSideScrollerController => {
  const [state, setState] = useState(() => createInitialVoiceScrollerState());
  const verticalInputRef = useRef(0);
  const {
    microphone,
    startMicrophoneControl,
    stopMicrophoneControl,
  } = useVoiceSideScrollerMicrophone();
  const activeTarget = getActiveVoiceScrollerTarget(state.targets);
  const handleWordMatched = useCallback((target: VoiceSideScrollerTarget) => {
    setState((currentState) => collectVoiceSideScrollerTarget(currentState, target.id));
  }, []);
  const {
    repeatWordPrompt,
    stopWordRecognition,
    wordRecognition,
  } = useVoiceSideScrollerWordRecognition({
    activeTarget,
    isRunning: state.status === "running",
    onWordMatched: handleWordMatched,
  });

  useEffect(() => {
    if (state.status !== "running") {
      return;
    }

    verticalInputRef.current = microphone.verticalInput;
  }, [microphone.verticalInput, state.status]);

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
    void startMicrophoneControl();
    window.setTimeout(() => {
      repeatWordPrompt();
    }, 0);
  }, [repeatWordPrompt, startMicrophoneControl]);

  const pauseRound = useCallback(() => {
    verticalInputRef.current = 0;
    stopMicrophoneControl();
    stopWordRecognition();
    setState((currentState) => pauseVoiceSideScrollerRound(currentState));
  }, [stopMicrophoneControl, stopWordRecognition]);

  const resumeRound = useCallback(() => {
    setState((currentState) => resumeVoiceSideScrollerRound(currentState));
    void startMicrophoneControl();
    window.setTimeout(() => {
      repeatWordPrompt();
    }, 0);
  }, [repeatWordPrompt, startMicrophoneControl]);

  const resetRound = useCallback(() => {
    verticalInputRef.current = 0;
    stopMicrophoneControl();
    stopWordRecognition();
    setState(createInitialVoiceScrollerState());
  }, [stopMicrophoneControl, stopWordRecognition]);

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
    activeTarget,
    fallbackDown,
    fallbackNeutral,
    fallbackUp,
    microphone,
    pauseRound,
    repeatWordPrompt,
    resetRound,
    resumeRound,
    startRound,
    state,
    wordRecognition,
  };
};
