import type { SceneBuilderInstruction, VocabularyChoiceInstruction } from "../types";

export const createRoundSeed = () =>
  Math.floor(Date.now() + Math.random() * 1_000_000);

const createSeededRandom = (seed: number) => {
  let state = seed % 2_147_483_647;

  if (state <= 0) {
    state += 2_147_483_646;
  }

  return () => {
    state = (state * 16_807) % 2_147_483_647;

    return (state - 1) / 2_147_483_646;
  };
};

const shuffleItems = <TItem>(items: readonly TItem[], seed: number) => {
  const random = createSeededRandom(seed);
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1));
    const currentItem = shuffledItems[index];

    shuffledItems[index] = shuffledItems[targetIndex];
    shuffledItems[targetIndex] = currentItem;
  }

  return shuffledItems;
};

export const shuffleSceneBuilderInstructions = (
  instructions: readonly SceneBuilderInstruction[],
  seed: number,
) => {
  const random = createSeededRandom(seed);
  const remainingInstructions = [...instructions];
  const placedObjectIds = new Set<string>();
  const shuffledInstructions: SceneBuilderInstruction[] = [];

  while (remainingInstructions.length > 0) {
    const eligibleInstructions = remainingInstructions.filter((instruction) =>
      (instruction.placement.anchorObjectIds ?? []).every((objectId) =>
        placedObjectIds.has(objectId),
      ),
    );
    const candidateInstructions =
      eligibleInstructions.length > 0 ? eligibleInstructions : remainingInstructions;
    const nextInstruction =
      candidateInstructions[Math.floor(random() * candidateInstructions.length)];
    const nextInstructionIndex = remainingInstructions.findIndex(
      (instruction) => instruction.id === nextInstruction.id,
    );

    remainingInstructions.splice(nextInstructionIndex, 1);
    shuffledInstructions.push(nextInstruction);
    placedObjectIds.add(nextInstruction.placement.objectId);
  }

  return shuffledInstructions;
};

export const shuffleVocabularyChoiceInstructions = (
  instructions: readonly VocabularyChoiceInstruction[],
  seed: number,
) =>
  shuffleItems(instructions, seed).map((instruction, index) => ({
    ...instruction,
    answerOptions: shuffleItems(instruction.answerOptions, seed + index + 1),
  }));
