import { useCallback, useEffect, useRef, useState } from "react";
import {
  readBezemEscapeProgress,
  recordVoiceSideScrollerWordObservation,
} from "../../logic/progress";
import {
  collectVoiceSideScrollerTarget,
  pauseVoiceSideScrollerRound,
  resumeVoiceSideScrollerRound,
  startVoiceSideScrollerRound,
  tickVoiceSideScrollerState,
} from "./voiceSideScrollerEngine";
import {
  createInitialVoiceScrollerState,
  VOICE_SCROLLER_DEMO_TARGETS,
  type VoiceSideScrollerGameState,
} from "./voiceSideScrollerModel";
import {
  cancelVoiceSideScrollerFrame,
  getVoiceSideScrollerTimestamp,
  requestVoiceSideScrollerFrame,
} from "./voiceSideScrollerFrame";
import {
  getVoiceSideScrollerWordObservation,
  recordVoiceSideScrollerPromptRepeat,
  recordVoiceSideScrollerWordHeard,
  selectVoiceSideScrollerFocusWords,
} from "./voiceSideScrollerEducation";
import {
  useVoiceSideScrollerWordRecognition,
  type VoiceSideScrollerWordRecognitionState,
} from "./useVoiceSideScrollerWordRecognition";
import { getVisibleVoiceScrollerTargets } from "./voiceSideScrollerSelectors";
import type { VoiceSideScrollerTarget } from "./voiceSideScrollerModel";

export interface VoiceSideScrollerController {
  moveDown: () => void;
  moveNeutral: () => void;
  moveUp: () => void;
  pauseRound: () => void;
  resetRound: () => void;
  resumeRound: () => void;
  repeatWordPrompt: () => boolean;
  startRound: () => void;
  state: VoiceSideScrollerGameState;
  wordRecognition: VoiceSideScrollerWordRecognitionState;
}

interface UseVoiceSideScrollerControllerOptions {
  profileId: string;
}

const createFocusedRoundState = (profileId: string) => {
  const progress = readBezemEscapeProgress(profileId);
  const focusWords = selectVoiceSideScrollerFocusWords({
    availableTargets: VOICE_SCROLLER_DEMO_TARGETS,
    progress,
  });

  return createInitialVoiceScrollerState({ focusWords });
};

const getVoiceSideScrollerInstructionId = (targetId: string) =>
  `zeg-en-vlieg:${targetId}`;

export const useVoiceSideScrollerController = ({
  profileId,
}: UseVoiceSideScrollerControllerOptions): VoiceSideScrollerController => {
  const [state, setState] = useState(() => createFocusedRoundState(profileId));
  const stateRef = useRef(state);
  const verticalInputRef = useRef(0);
  const visibleTargets = getVisibleVoiceScrollerTargets(state.targets);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (stateRef.current.status === "ready") {
      const nextState = createFocusedRoundState(profileId);
      stateRef.current = nextState;
      setState(nextState);
    }
  }, [profileId]);

  const recordWordObservation = useCallback((
    nextState: VoiceSideScrollerGameState,
    target: VoiceSideScrollerTarget,
    transcript: string,
    isRecognized: boolean,
  ) => {
    const observation = getVoiceSideScrollerWordObservation(nextState, target.id);

    if (!observation) {
      return;
    }

    recordVoiceSideScrollerWordObservation(profileId, {
      audioRepeats: observation.audioRepeats,
      hintsUsed: observation.hintsUsed,
      id: `${target.id}:${isRecognized ? "recognized" : "practice"}:${observation.attempts}:${Date.now()}`,
      instructionId: getVoiceSideScrollerInstructionId(target.id),
      isRecognized,
      spokenTranscript: transcript,
      targetWord: target.word,
      wordAttempts: observation.attempts,
      wordStarsEarned: isRecognized ? 1 : 0,
    });
  }, [profileId]);

  const handleWordMatched = useCallback((
    target: VoiceSideScrollerTarget,
    transcript: string,
  ) => {
    const nextWithHeardWord = recordVoiceSideScrollerWordHeard(stateRef.current, {
      isRecognized: true,
      targetId: target.id,
      transcript,
    });
    const nextState = collectVoiceSideScrollerTarget(nextWithHeardWord, target.id);

    stateRef.current = nextState;
    setState(nextState);
    recordWordObservation(nextState, target, transcript, true);
  }, [recordWordObservation]);

  const handleWordMissed = useCallback((
    target: VoiceSideScrollerTarget | undefined,
    transcript: string,
  ) => {
    if (!target) {
      return;
    }

    const nextState = recordVoiceSideScrollerWordHeard(stateRef.current, {
      isRecognized: false,
      targetId: target.id,
      transcript,
    });

    stateRef.current = nextState;
    setState(nextState);
    recordWordObservation(nextState, target, transcript, false);
  }, [recordWordObservation]);

  const handleWordPromptRepeated = useCallback((target: VoiceSideScrollerTarget | undefined) => {
    if (!target) {
      return;
    }

    const nextState = recordVoiceSideScrollerPromptRepeat(stateRef.current, target.id);

    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const {
    repeatWordPrompt,
    stopWordRecognition,
    wordRecognition,
  } = useVoiceSideScrollerWordRecognition({
    isRunning: state.status === "running",
    onWordMissed: handleWordMissed,
    onWordMatched: handleWordMatched,
    onWordPromptRepeated: handleWordPromptRepeated,
    visibleTargets,
  });

  useEffect(() => {
    if (state.status !== "running") {
      return undefined;
    }

    let animationFrameId = 0;
    let previousTimestamp = getVoiceSideScrollerTimestamp();

    const tick = (timestamp: number) => {
      const deltaMs = timestamp - previousTimestamp;
      previousTimestamp = timestamp;

      setState((currentState) => {
        const nextState = tickVoiceSideScrollerState({
          deltaMs,
          state: currentState,
          verticalInput: verticalInputRef.current,
        });

        stateRef.current = nextState;
        return nextState;
      });

      animationFrameId = requestVoiceSideScrollerFrame(tick);
    };

    animationFrameId = requestVoiceSideScrollerFrame(tick);

    return () => {
      cancelVoiceSideScrollerFrame(animationFrameId);
    };
  }, [state.status]);

  const startRound = useCallback(() => {
    verticalInputRef.current = 0;
    const progress = readBezemEscapeProgress(profileId);
    const focusWords = selectVoiceSideScrollerFocusWords({
      availableTargets: VOICE_SCROLLER_DEMO_TARGETS,
      progress,
    });
    const nextState = startVoiceSideScrollerRound({ focusWords });

    stateRef.current = nextState;
    setState(nextState);
  }, [profileId]);

  const pauseRound = useCallback(() => {
    verticalInputRef.current = 0;
    stopWordRecognition();
    setState((currentState) => {
      const nextState = pauseVoiceSideScrollerRound(currentState);

      stateRef.current = nextState;
      return nextState;
    });
  }, [stopWordRecognition]);

  const resumeRound = useCallback(() => {
    setState((currentState) => {
      const nextState = resumeVoiceSideScrollerRound(currentState);

      stateRef.current = nextState;
      return nextState;
    });
  }, []);

  const resetRound = useCallback(() => {
    verticalInputRef.current = 0;
    stopWordRecognition();
    const nextState = createFocusedRoundState(profileId);

    stateRef.current = nextState;
    setState(nextState);
  }, [profileId, stopWordRecognition]);

  const moveUp = useCallback(() => {
    verticalInputRef.current = -1;
  }, []);

  const moveDown = useCallback(() => {
    verticalInputRef.current = 1;
  }, []);

  const moveNeutral = useCallback(() => {
    verticalInputRef.current = 0;
  }, []);

  return {
    moveDown,
    moveNeutral,
    moveUp,
    pauseRound,
    repeatWordPrompt,
    resetRound,
    resumeRound,
    startRound,
    state,
    wordRecognition,
  };
};
