import {
  createEventId,
  createSessionId,
  failure,
  success,
  type RuntimeFailure,
  type VoiceRecognitionErrorCode,
} from "../contracts";
import { createFakeGameRuntime, type FakeGameRuntime } from "./createFakeGameRuntime";

export interface RuntimeFailureScenario {
  clock?: { now: string };
  media?: { outcome: "complete" | "error" };
  network?: { online: boolean };
  random?: { seed: number };
  serviceWorker?: { updateAvailable: boolean };
  speech?:
    | { outcome: "denied" | "timeout" }
    | { confidence?: number; outcome: "result"; transcript: string };
  storage?: { outcome: "corrupt" | "quota-exceeded" };
  uuids?: string[];
}

export interface ScenarioRuntime {
  environment: {
    nextUuid: () => string;
    online: boolean;
    random: () => number;
    serviceWorkerUpdateAvailable: boolean;
  };
  runtime: FakeGameRuntime;
}

const runtimeFailure = (code: RuntimeFailure["code"], message: string): RuntimeFailure => ({
  code,
  message,
  recoverable: true,
});

const createSeededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
};

export const createScenarioGameRuntime = (scenario: RuntimeFailureScenario): ScenarioRuntime => {
  const runtime = createFakeGameRuntime();
  const uuids = scenario.uuids ?? [
    "00000000-0000-4000-8000-000000000001",
    "00000000-0000-4000-8000-000000000002",
  ];
  let uuidIndex = 0;
  const nextUuid = () => uuids[Math.min(uuidIndex++, uuids.length - 1)]!;
  const random = createSeededRandom(scenario.random?.seed ?? 1);

  runtime.clock = {
    now: () => new Date(scenario.clock?.now ?? "2026-07-23T10:00:00.000Z"),
  };
  runtime.ids = {
    eventId: () => createEventId(nextUuid()),
    sessionId: () => createSessionId(nextUuid()),
  };

  if (scenario.speech) {
    const speechScenario = scenario.speech;
    runtime.speech.createRecognition = (options) => ({
      abort: () => undefined,
      destroy: () => undefined,
      start: () => {
        if (speechScenario.outcome === "result") {
          const confidence = speechScenario.confidence ?? 0.9;
          options?.onResult?.({
            alternatives: [{ confidence, transcript: speechScenario.transcript }],
            confidence,
            confidenceLabel: confidence >= 0.75 ? "high" : confidence >= 0.45 ? "medium" : "low",
            isFinal: true,
            transcript: speechScenario.transcript,
          });
          options?.onEnd?.();
          return true;
        }
        const code: VoiceRecognitionErrorCode =
          speechScenario.outcome === "denied" ? "not-allowed" : "no-speech";
        options?.onError?.(code, "");
        options?.onEnd?.();
        return true;
      },
      stop: () => options?.onEnd?.(),
    });
  }

  if (scenario.media?.outcome === "error") {
    const mediaError = () => failure(runtimeFailure("unavailable", "Gesimuleerde mediafout."));
    runtime.media.playAudio = async () => mediaError();
    runtime.media.createPlayback = () => ({
      dispose: () => undefined,
      pause: () => undefined,
      play: async () => mediaError(),
      reset: () => undefined,
      setLoop: () => undefined,
      setVolume: () => undefined,
    });
  } else {
    runtime.media.playAudio = async () => success(undefined);
  }

  if (scenario.storage?.outcome === "quota-exceeded") {
    runtime.storage.set = () =>
      failure(runtimeFailure("quota-exceeded", "Gesimuleerde quota-uitputting."));
  }
  if (scenario.storage?.outcome === "corrupt") {
    runtime.storage.get = () => {
      throw new Error("Gesimuleerde corrupte opslag.");
    };
  }

  return {
    environment: {
      nextUuid,
      online: scenario.network?.online ?? true,
      random,
      serviceWorkerUpdateAvailable: scenario.serviceWorker?.updateAvailable ?? false,
    },
    runtime,
  };
};
