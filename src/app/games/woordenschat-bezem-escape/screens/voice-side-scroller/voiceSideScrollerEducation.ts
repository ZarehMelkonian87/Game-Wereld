import type { BezemEscapeProgress } from "../../types";
import type {
  VoiceSideScrollerGameState,
  VoiceSideScrollerTarget,
  VoiceSideScrollerWordEducationState,
} from "./voiceSideScrollerModel";
import { VOICE_SCROLLER_FOCUS_WORD_COUNT } from "./voiceSideScrollerModel";

interface SelectVoiceSideScrollerFocusWordsParams {
  availableTargets: VoiceSideScrollerTarget[];
  progress: BezemEscapeProgress;
}

interface RecordVoiceSideScrollerWordHeardParams {
  isRecognized: boolean;
  targetId: string;
  transcript: string;
}

const getVoiceSideScrollerAttemptsForWord = (
  progress: BezemEscapeProgress,
  word: string,
) =>
  progress.attempts.filter((attempt) =>
    attempt.mode === "zeg-en-vlieg" && attempt.targetWords.includes(word),
  );

const getWordPriorityScore = (
  progress: BezemEscapeProgress,
  word: string,
) => {
  const attempts = getVoiceSideScrollerAttemptsForWord(progress, word);
  const needsPractice = attempts.filter((attempt) => attempt.result === "needs-more-practice").length;
  const correct = attempts.filter((attempt) => attempt.isCorrect).length;
  const practiced = attempts.length;
  const difficultBonus = needsPractice > correct ? 100 : 0;

  return {
    correct,
    difficultBonus,
    needsPractice,
    practiced,
  };
};

export const selectVoiceSideScrollerFocusWords = ({
  availableTargets,
  progress,
}: SelectVoiceSideScrollerFocusWordsParams) =>
  availableTargets
    .map((target, index) => ({
      index,
      score: getWordPriorityScore(progress, target.word),
      word: target.word,
    }))
    .sort((left, right) => {
      if (left.score.difficultBonus !== right.score.difficultBonus) {
        return right.score.difficultBonus - left.score.difficultBonus;
      }

      if (left.score.needsPractice !== right.score.needsPractice) {
        return right.score.needsPractice - left.score.needsPractice;
      }

      if (left.score.practiced !== right.score.practiced) {
        return left.score.practiced - right.score.practiced;
      }

      if (left.score.correct !== right.score.correct) {
        return left.score.correct - right.score.correct;
      }

      return left.index - right.index;
    })
    .slice(0, VOICE_SCROLLER_FOCUS_WORD_COUNT)
    .map((item) => item.word);

const getExistingWordObservation = (
  state: VoiceSideScrollerGameState,
  targetId: string,
): VoiceSideScrollerWordEducationState | undefined =>
  state.education.wordObservations[targetId];

const updateWordObservation = (
  state: VoiceSideScrollerGameState,
  targetId: string,
  updater: (observation: VoiceSideScrollerWordEducationState) => VoiceSideScrollerWordEducationState,
) => {
  const observation = getExistingWordObservation(state, targetId);

  if (!observation) {
    return state;
  }

  return {
    ...state,
    education: {
      ...state.education,
      wordObservations: {
        ...state.education.wordObservations,
        [targetId]: updater(observation),
      },
    },
  };
};

export const recordVoiceSideScrollerPromptRepeat = (
  state: VoiceSideScrollerGameState,
  targetId: string,
) =>
  updateWordObservation(state, targetId, (observation) => ({
    ...observation,
    audioRepeats: observation.audioRepeats + 1,
  }));

export const recordVoiceSideScrollerWordHeard = (
  state: VoiceSideScrollerGameState,
  { isRecognized, targetId, transcript }: RecordVoiceSideScrollerWordHeardParams,
) =>
  updateWordObservation(state, targetId, (observation) => ({
    ...observation,
    attempts: observation.attempts + 1,
    heardTranscripts: [...observation.heardTranscripts, transcript],
    hintsUsed: isRecognized ? observation.hintsUsed : observation.hintsUsed + 1,
    needsPractice: isRecognized ? observation.needsPractice : true,
    recognized: isRecognized ? true : observation.recognized,
  }));

export const getVoiceSideScrollerWordObservation = (
  state: VoiceSideScrollerGameState,
  targetId: string,
) => getExistingWordObservation(state, targetId);
