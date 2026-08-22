import {
  createEventId,
  createGameId,
  createProfileId,
  createSessionId,
  success,
  type GameRuntime,
  type PracticeObservation,
} from "../contracts";

export interface FakeGameRuntime extends GameRuntime {
  captured: {
    completions: Parameters<GameRuntime["lifecycle"]["complete"]>[0][];
    diagnostics: Parameters<GameRuntime["diagnostics"]["log"]>[0][];
    exits: Parameters<GameRuntime["lifecycle"]["exit"]>[0][];
    observations: PracticeObservation[];
    storage: Map<string, string>;
  };
}

export const createFakeGameRuntime = (): FakeGameRuntime => {
  const captured: FakeGameRuntime["captured"] = {
    completions: [],
    diagnostics: [],
    exits: [],
    observations: [],
    storage: new Map(),
  };
  let lifecycleClosed = false;

  return {
    captured,
    clock: { now: () => new Date("2026-07-23T10:00:00.000Z") },
    diagnostics: { log: (event) => captured.diagnostics.push(event) },
    identity: {
      gameId: createGameId("magisch-strand-avontuur"),
      profileId: createProfileId("test-profile"),
      sessionId: createSessionId("test-session"),
    },
    ids: {
      eventId: () => createEventId("test-event"),
      sessionId: () => createSessionId("test-session"),
    },
    lifecycle: {
      complete: (summary) => {
        if (lifecycleClosed) return;
        lifecycleClosed = true;
        captured.completions.push(summary);
      },
      exit: (reason) => {
        if (lifecycleClosed) return;
        lifecycleClosed = true;
        captured.exits.push(reason);
      },
    },
    media: {
      createPlayback: () => ({
        dispose: () => undefined,
        pause: () => undefined,
        play: async () => success(undefined),
        reset: () => undefined,
        setLoop: () => undefined,
        setVolume: () => undefined,
      }),
      pauseAll: () => undefined,
      playAudio: async () => success(undefined),
    },
    practice: {
      append: async (observation) => {
        if (
          observation.eventId &&
          captured.observations.some((event) => event.eventId === observation.eventId)
        ) {
          return success(undefined);
        }
        captured.observations.push(observation);
        return success(undefined);
      },
      reset: async () => {
        captured.observations.length = 0;
        return success(undefined);
      },
    },
    speech: {
      createRecognition: () => null,
      getMicrophonePermission: async () => ({
        canAsk: false,
        canUse: true,
        message: "Microfoon is beschikbaar in de testfake.",
        state: "granted",
      }),
      getRecognitionSupport: () => ({
        isSecureContext: true,
        isSupported: true,
        needsSecureContext: false,
      }),
      isRecognitionAvailable: () => true,
      requestMicrophonePermission: async () => ({
        canAsk: false,
        canUse: true,
        message: "Microfoon is beschikbaar in de testfake.",
        state: "granted",
      }),
      speak: () => success(undefined),
    },
    storage: {
      get: (key) => captured.storage.get(key) ?? null,
      remove: (key) => {
        captured.storage.delete(key);
      },
      set: (key, value) => {
        captured.storage.set(key, value);
        return success(undefined);
      },
    },
  };
};
