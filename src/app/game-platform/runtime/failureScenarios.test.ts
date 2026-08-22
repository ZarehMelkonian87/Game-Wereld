import { describe, expect, it } from "vitest";
import { createScenarioGameRuntime, type RuntimeFailureScenario } from "./failureScenarios";

const scenario: RuntimeFailureScenario = {
  clock: { now: "2026-07-23T12:34:56.000Z" },
  media: { outcome: "error" },
  network: { online: false },
  random: { seed: 42 },
  serviceWorker: { updateAvailable: true },
  speech: { outcome: "denied" },
  storage: { outcome: "quota-exceeded" },
  uuids: ["00000000-0000-4000-8000-000000000010", "00000000-0000-4000-8000-000000000011"],
};

describe("declaratieve failure-scenario's", () => {
  it("levert bij herhaling exact dezelfde capability-uitkomsten", async () => {
    const run = async () => {
      const { environment, runtime } = createScenarioGameRuntime(scenario);
      const speechErrors: string[] = [];
      runtime.speech.createRecognition({ onError: (code) => speechErrors.push(code) })?.start();
      return {
        eventId: runtime.ids.eventId(),
        media: await runtime.media.playAudio("/test.mp3"),
        now: runtime.clock.now().toISOString(),
        online: environment.online,
        random: [environment.random(), environment.random()],
        speechErrors,
        storage: runtime.storage.set("key", "value"),
        update: environment.serviceWorkerUpdateAvailable,
      };
    };

    expect(await run()).toEqual(await run());
  });

  it("simuleert resultaat, time-out, corruptie en media completion zonder browser-API", async () => {
    const resultRuntime = createScenarioGameRuntime({
      media: { outcome: "complete" },
      speech: { outcome: "result", transcript: "veilige testzin" },
    }).runtime;
    const timeoutRuntime = createScenarioGameRuntime({
      speech: { outcome: "timeout" },
      storage: { outcome: "corrupt" },
    }).runtime;
    const results: string[] = [];
    const errors: string[] = [];

    resultRuntime.speech
      .createRecognition({ onResult: (result) => results.push(result.transcript) })
      ?.start();
    timeoutRuntime.speech.createRecognition({ onError: (code) => errors.push(code) })?.start();

    expect(results).toEqual(["veilige testzin"]);
    expect(errors).toEqual(["no-speech"]);
    expect(await resultRuntime.media.playAudio("/test.mp3")).toEqual({
      ok: true,
      value: undefined,
    });
    expect(() => timeoutRuntime.storage.get("key")).toThrow("Gesimuleerde corrupte opslag.");
  });
});
