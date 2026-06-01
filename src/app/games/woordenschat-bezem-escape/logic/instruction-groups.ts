import type {
  BroomRaceInstruction,
  GameWorld,
  SceneBuilderInstruction,
  VocabularyChoiceInstruction,
} from "../types";

export const getSceneBuilderInstructions = (world: GameWorld) => {
  const instructions = world.instructions.filter(
    (item): item is SceneBuilderInstruction => item.mode === "listen-and-place",
  );

  if (instructions.length === 0) {
    throw new Error("Woordenschat Bezem Escape mist een scene-builder opdracht.");
  }

  return instructions;
};

export const getVocabularyChoiceInstructions = (world: GameWorld) => {
  const instructions = world.instructions.filter(
    (item): item is VocabularyChoiceInstruction => item.mode === "choose-word",
  );

  if (instructions.length === 0) {
    throw new Error("Woordenschat Bezem Escape mist woordkeuze-opdrachten.");
  }

  return instructions;
};

export const getBroomRaceInstructions = (world: GameWorld) => {
  const instructions = world.instructions.filter(
    (item): item is BroomRaceInstruction => item.mode === "broom-escape-run",
  );

  if (instructions.length === 0) {
    throw new Error("Woordenschat Bezem Escape mist race-opdrachten.");
  }

  return instructions;
};

