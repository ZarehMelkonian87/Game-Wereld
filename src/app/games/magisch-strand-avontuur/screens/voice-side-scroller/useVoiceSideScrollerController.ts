import { useCallback, useEffect, useRef, useState } from "react";
import { createEmptyBezemEscapeProgress } from "../../logic/progress";
import { createVoicePracticeObservation } from "../../logic/practice-observations";
import type { GameRuntime } from "../../../../game-platform/contracts";
import {
  collectVoiceSideScrollerTarget,
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
  recordVoiceSideScrollerWordHeard,
  selectVoiceSideScrollerFocusWords,
} from "./voiceSideScrollerEducation";
import {
  useVoiceSideScrollerWordRecognition,
  type VoiceSideScrollerWordRecognitionState,
} from "./useVoiceSideScrollerWordRecognition";
import { getVisibleVoiceScrollerTargets } from "./voiceSideScrollerSelectors";
import {
  readVoiceScrollerRecord,
  saveVoiceScrollerRecord,
  updateVoiceScrollerRecord,
  type VoiceScrollerRecord,
} from "./voiceSideScrollerRecord";
import type { VoiceSideScrollerTarget } from "./voiceSideScrollerModel";

export interface VoiceScrollerRoundRecordOutcome {
  isNewComboRecord: boolean;
  isNewDistanceRecord: boolean;
}

export interface VoiceSideScrollerController {
  moveDown: () => void;
  moveNeutral: () => void;
  moveUp: () => void;
  record: VoiceScrollerRecord;
  roundRecordOutcome?: VoiceScrollerRoundRecordOutcome;
  setVerticalInput: (value: number) => void;
  startRound: () => void;
  state: VoiceSideScrollerGameState;
  wordRecognition: VoiceSideScrollerWordRecognitionState;
}

const clampVerticalInput = (value: number) => Math.min(1, Math.max(-1, value));

interface UseVoiceSideScrollerControllerOptions {
  profileId: string;
  runtime: GameRuntime;
}

const createFocusedRoundState = (profileId: string) => {
  const progress = createEmptyBezemEscapeProgress(profileId);
  const focusWords = selectVoiceSideScrollerFocusWords({
    availableTargets: VOICE_SCROLLER_DEMO_TARGETS,
    progress,
  });

  return createInitialVoiceScrollerState({ focusWords });
};

const getVoiceSideScrollerInstructionId = (targetId: string) => `zeg-en-vlieg:${targetId}`;

export const useVoiceSideScrollerController = ({
  profileId,
  runtime,
}: UseVoiceSideScrollerControllerOptions): VoiceSideScrollerController => {
  const [state, setState] = useState(() => createFocusedRoundState(profileId));
  const stateRef = useRef(state);
  const verticalInputRef = useRef(0);
  const visibleTargets = getVisibleVoiceScrollerTargets(state.targets);
  const [record, setRecord] = useState<VoiceScrollerRecord>(() =>
    readVoiceScrollerRecord(profileId, runtime.storage),
  );
  const [roundRecordOutcome, setRoundRecordOutcome] = useState<VoiceScrollerRoundRecordOutcome>();

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    setRecord(readVoiceScrollerRecord(profileId, runtime.storage));
  }, [profileId, runtime.storage]);

  // Werk het persoonlijke record bij zodra een ronde vriendelijk eindigt (T-30).
  useEffect(() => {
    if (state.status !== "game-over") {
      setRoundRecordOutcome(undefined);
      return;
    }

    const result = updateVoiceScrollerRecord(readVoiceScrollerRecord(profileId, runtime.storage), {
      comboReached: stateRef.current.bestCombo,
      distanceMeters: Math.floor(stateRef.current.distance),
    });

    saveVoiceScrollerRecord(profileId, result.record, runtime.storage);
    setRecord(result.record);
    setRoundRecordOutcome({
      isNewComboRecord: result.isNewComboRecord,
      isNewDistanceRecord: result.isNewDistanceRecord,
    });
  }, [profileId, runtime.storage, state.status]);

  useEffect(() => {
    if (stateRef.current.status === "ready") {
      const nextState = createFocusedRoundState(profileId);
      stateRef.current = nextState;
      setState(nextState);
    }
  }, [profileId]);

  const recordWordObservation = useCallback(
    (
      nextState: VoiceSideScrollerGameState,
      target: VoiceSideScrollerTarget,
      isRecognized: boolean,
    ) => {
      const observation = getVoiceSideScrollerWordObservation(nextState, target.id);

      if (!observation) {
        return;
      }

      void runtime.practice.append(
        createVoicePracticeObservation({
          instructionReplays: observation.audioRepeats,
          spokenHelp: 0,
          targetId: target.id,
          visualHints: observation.hintsUsed,
          taskId: getVoiceSideScrollerInstructionId(target.id),
          outcome: isRecognized ? "correct" : "incorrect",
          responseTimeMs: Math.round(Math.max(0, nextState.elapsedMs)),
          attemptNumber: Math.max(1, observation.attempts),
        }),
      );
    },
    [runtime.practice],
  );

  const handleWordMatched = useCallback(
    (target: VoiceSideScrollerTarget, transcript: string) => {
      const nextWithHeardWord = recordVoiceSideScrollerWordHeard(stateRef.current, {
        isRecognized: true,
        targetId: target.id,
        transcript,
      });
      const nextState = collectVoiceSideScrollerTarget(nextWithHeardWord, target.id);

      stateRef.current = nextState;
      setState(nextState);
      recordWordObservation(nextState, target, true);
    },
    [recordWordObservation],
  );

  const handleWordMissed = useCallback(
    (target: VoiceSideScrollerTarget | undefined, transcript: string) => {
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
      recordWordObservation(nextState, target, false);
    },
    [recordWordObservation],
  );

  const { wordRecognition } = useVoiceSideScrollerWordRecognition({
    isRunning: state.status === "running",
    onWordMissed: handleWordMissed,
    onWordMatched: handleWordMatched,
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
    const progress = createEmptyBezemEscapeProgress(profileId);
    const focusWords = selectVoiceSideScrollerFocusWords({
      availableTargets: VOICE_SCROLLER_DEMO_TARGETS,
      progress,
    });
    const nextState = startVoiceSideScrollerRound({ focusWords });

    stateRef.current = nextState;
    setState(nextState);
  }, [profileId]);

  const moveUp = useCallback(() => {
    verticalInputRef.current = -1;
  }, []);

  const moveDown = useCallback(() => {
    verticalInputRef.current = 1;
  }, []);

  const moveNeutral = useCallback(() => {
    verticalInputRef.current = 0;
  }, []);

  // Fijne, continue hoogtecontrole voor de duim-rail. De engine clampt zelf
  // ook op [-1, 1]; negatief is omhoog, positief is omlaag.
  const setVerticalInput = useCallback((value: number) => {
    verticalInputRef.current = clampVerticalInput(value);
  }, []);

  return {
    moveDown,
    moveNeutral,
    moveUp,
    record,
    roundRecordOutcome,
    setVerticalInput,
    startRound,
    state,
    wordRecognition,
  };
};
