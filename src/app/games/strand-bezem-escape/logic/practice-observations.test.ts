import { describe, expect, it } from "vitest";
import {
  createAssistance,
  createInstructionPracticeObservation,
  createVoicePracticeObservation,
} from "./practice-observations";

describe("modusmappings naar PracticeEventV1", () => {
  it("modelleert hint, herhaling en gesproken hulp als afzonderlijke feiten", () => {
    expect(createAssistance({ instructionReplays: 2, spokenHelp: 1, visualHints: 1 })).toEqual([
      "instruction-replay",
      "visual-hint",
      "spoken-help",
    ]);
  });

  it("maakt scene-builder en word-choice observaties zonder masterylabel", () => {
    const observation = createInstructionPracticeObservation({
      attemptNumber: 2,
      instructionReplays: 1,
      languageDomains: ["receptive-vocabulary", "spatial-language"],
      outcome: "incorrect",
      responseTimeMs: 1200,
      spatialConcepts: ["boven"],
      spokenHelp: 0,
      taskId: "plaats-de-boot",
      visualHints: 1,
      vocabularyId: "boot",
    });
    expect(observation).toEqual({
      assistance: ["instruction-replay", "visual-hint"],
      attemptNumber: 2,
      outcome: "incorrect",
      responseTimeMs: 1200,
      skillIds: ["receptive-vocabulary", "spatial-language", "spatial:boven", "vocabulary:boot"],
      taskId: "plaats-de-boot",
    });
    expect(observation).not.toHaveProperty("mastered");
  });

  it("neemt bij voice alleen neutrale ids en geen transcript of audio op", () => {
    const observation = createVoicePracticeObservation({
      attemptNumber: 1,
      instructionReplays: 0,
      outcome: "correct",
      responseTimeMs: 900,
      spokenHelp: 0,
      targetId: "target-boot",
      taskId: "zeg-en-vlieg:target-boot",
      visualHints: 0,
    });
    expect(observation.skillIds).toEqual(["active-vocabulary", "vocabulary:target-boot"]);
    expect(observation).not.toHaveProperty("transcript");
    expect(observation).not.toHaveProperty("audio");
  });
});
