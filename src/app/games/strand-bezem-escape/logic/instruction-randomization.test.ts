// @vitest-environment node

import { describe, expect, it } from "vitest";
import type { SceneBuilderInstruction, VocabularyChoiceInstruction } from "../types";
import {
  shuffleSceneBuilderInstructions,
  shuffleVocabularyChoiceInstructions,
} from "./instruction-randomization";

const createSceneInstruction = (
  id: string,
  objectId: string,
  anchorObjectIds?: string[],
): SceneBuilderInstruction => ({
  audioText: id,
  feedback: "Goed gedaan",
  feedbackCopy: { correct: "Goed gedaan" },
  hint: "Probeer nog eens",
  id,
  languageDomains: ["spatial-language"],
  level: 1,
  mode: "listen-and-place",
  placement: {
    anchorObjectIds,
    objectId,
    relation: anchorObjectIds ? "naast" : "in",
    zoneId: "sea",
  },
  prompt: id,
  reward: { speed: 1, wordStars: 1 },
  spatialConcepts: [anchorObjectIds ? "naast" : "in"],
  tags: [],
  targetObjectIds: [objectId],
  targetZoneIds: ["sea"],
});

const createChoiceInstruction = (id: string): VocabularyChoiceInstruction => ({
  answerOptions: [`${id}-correct`, `${id}-wrong-a`, `${id}-wrong-b`],
  audioText: id,
  choiceCount: 3,
  distractorStrategy: "same-theme",
  feedback: "Goed gedaan",
  feedbackCopy: { correct: "Goed gedaan" },
  hint: "Kijk goed",
  id,
  languageDomains: ["receptive-vocabulary"],
  level: 1,
  mode: "choose-word",
  prompt: id,
  reward: { speed: 1, wordStars: 1 },
  spatialConcepts: [],
  tags: [],
  targetObjectIds: [],
  targetWord: `${id}-correct`,
  targetZoneIds: [],
});

describe("instruction randomization", () => {
  it("is deterministic for the same seed without mutating the input", () => {
    const instructions = [
      createChoiceInstruction("one"),
      createChoiceInstruction("two"),
      createChoiceInstruction("three"),
    ];
    const original = structuredClone(instructions);

    const firstShuffle = shuffleVocabularyChoiceInstructions(instructions, 42);
    const secondShuffle = shuffleVocabularyChoiceInstructions(instructions, 42);

    expect(firstShuffle).toEqual(secondShuffle);
    expect(instructions).toEqual(original);
  });

  it("places anchor instructions before instructions that depend on them", () => {
    const anchor = createSceneInstruction("anchor", "boat");
    const dependent = createSceneInstruction("dependent", "ball", ["boat"]);
    const instructions = [dependent, anchor];

    const shuffled = shuffleSceneBuilderInstructions(instructions, 7);

    expect(shuffled.map((instruction) => instruction.id)).toEqual(["anchor", "dependent"]);
  });
});
