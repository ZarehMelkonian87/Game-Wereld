import type {
  AssistanceLevel,
  PracticeResult,
  SceneBuilderInstruction,
  SceneObject,
} from "../../../types";

export const getObjectLabelById = (
  objects: readonly SceneObject[],
  objectId: string | undefined,
) => {
  if (!objectId) {
    return undefined;
  }

  return objects.find((object) => object.id === objectId)?.label ?? objectId;
};

export const getSpeakAndPlaceReward = ({
  activeAudioRepeats,
  activeHintsUsed,
  instruction,
  objects,
  spokenCommandResult,
  spokenHelpCount,
}: {
  activeAudioRepeats: number;
  activeHintsUsed: number;
  instruction: SceneBuilderInstruction;
  objects: readonly SceneObject[];
  spokenCommandResult: unknown;
  spokenHelpCount: number;
}) => {
  const isSpoken = Boolean(spokenCommandResult);
  const earnedSpeed = instruction.reward.speed + (isSpoken ? 1 : 0);
  const earnedWordStars = instruction.reward.wordStars + (isSpoken ? 1 : 0);
  const assistance: AssistanceLevel =
    activeHintsUsed > 0 || spokenHelpCount > 0
      ? "hint"
      : activeAudioRepeats > 0
        ? "audio-repeat"
        : "none";
  const result: PracticeResult =
    assistance === "none" ? "correct-without-help" : "correct-with-help";

  return {
    activeSpatialConcept: instruction.placement.relation,
    assistance,
    autoExecuted: isSpoken,
    earnedSpeed,
    earnedWordStars,
    independentSentence: isSpoken && assistance === "none",
    result,
    selfMadeSentence: isSpoken,
    targetWord: getObjectLabelById(objects, instruction.placement.objectId),
  };
};
