import {
  createEventId,
  createSessionId,
  failure,
  success,
  type GameId,
  type GameRuntime,
  type ProfileId,
  type RuntimeFailure,
  type SessionId,
} from "../contracts";
import {
  createBrowserSpeechRecognition,
  getBrowserMicrophonePermission,
  getBrowserSpeechRecognitionSupport,
  requestBrowserMicrophonePermission,
} from "./browserSpeech";

interface CreateBrowserGameRuntimeOptions {
  gameId: GameId;
  onComplete: GameRuntime["lifecycle"]["complete"];
  onExit: GameRuntime["lifecycle"]["exit"];
  onUpdateProgress: GameRuntime["profile"]["updateProgress"];
  profileId: ProfileId;
  sessionId?: SessionId;
}

const runtimeFailure = (
  code: RuntimeFailure["code"],
  message: string,
  recoverable = true,
): RuntimeFailure => ({ code, message, recoverable });

const safeStorage = (scope: "local" | "session") =>
  scope === "session" ? window.sessionStorage : window.localStorage;

export const createBrowserGameRuntime = ({
  gameId,
  onComplete,
  onExit,
  onUpdateProgress,
  profileId,
  sessionId = createSessionId(crypto.randomUUID()),
}: CreateBrowserGameRuntimeOptions): GameRuntime => {
  const clock = { now: () => new Date() };
  const ids = {
    eventId: () => createEventId(crypto.randomUUID()),
    sessionId: () => createSessionId(crypto.randomUUID()),
  };
  const practiceStorageKey = `game-runtime:practice:${profileId}:${gameId}`;
  let lifecycleClosed = false;
  const completeOnce: GameRuntime["lifecycle"]["complete"] = (summary) => {
    if (lifecycleClosed) return;
    lifecycleClosed = true;
    onComplete(summary);
  };
  const exitOnce: GameRuntime["lifecycle"]["exit"] = (reason) => {
    if (lifecycleClosed) return;
    lifecycleClosed = true;
    onExit(reason);
  };

  return {
    clock,
    diagnostics: {
      log: (event) => {
        window.dispatchEvent(new CustomEvent("game-runtime:diagnostic", { detail: event }));
      },
    },
    identity: { gameId, profileId, sessionId },
    ids,
    lifecycle: { complete: completeOnce, exit: exitOnce },
    media: {
      createPlayback: (source) => {
        const audio = new Audio(source);
        return {
          dispose: () => {
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
          },
          pause: () => audio.pause(),
          play: async () => {
            try {
              await audio.play();
              return success(undefined);
            } catch {
              return failure(runtimeFailure("unavailable", "Audio kon niet worden afgespeeld."));
            }
          },
          reset: () => {
            audio.currentTime = 0;
          },
          setLoop: (loop) => {
            audio.loop = loop;
          },
          setVolume: (volume) => {
            audio.volume = Math.max(0, Math.min(1, volume));
          },
        };
      },
      pauseAll: () => {
        document.querySelectorAll("audio,video").forEach((element) => {
          if (element instanceof HTMLMediaElement) {
            element.pause();
          }
        });
      },
      playAudio: async (source) => {
        try {
          await new Audio(source).play();
          return success(undefined);
        } catch {
          return failure(runtimeFailure("unavailable", "Audio kon niet worden afgespeeld."));
        }
      },
    },
    practice: {
      append: async (observation) => {
        try {
          const stored = window.localStorage.getItem(practiceStorageKey);
          const existing: unknown = stored ? JSON.parse(stored) : [];
          const events = Array.isArray(existing) ? existing : [];
          if (
            observation.eventId &&
            events.some(
              (event) =>
                typeof event === "object" &&
                event !== null &&
                Reflect.get(event, "eventId") === observation.eventId,
            )
          ) {
            return success(undefined);
          }
          const event = {
            ...observation,
            eventId: observation.eventId ?? ids.eventId(),
            gameId,
            profileId,
            recordedAt: clock.now().toISOString(),
            schemaVersion: 1,
            sessionId,
          };
          window.localStorage.setItem(practiceStorageKey, JSON.stringify([...events, event]));
          onUpdateProgress({
            completed: observation.isCorrect,
            lastPlayed: event.recordedAt,
            score: observation.isCorrect ? observation.wordStarsEarned * 100 : 0,
            stars: observation.wordStarsEarned,
          });
          return success(undefined);
        } catch {
          return failure(
            runtimeFailure("quota-exceeded", "Oefenresultaat kon niet lokaal worden opgeslagen."),
          );
        }
      },
      reset: async () => {
        try {
          window.localStorage.removeItem(practiceStorageKey);
          return success(undefined);
        } catch {
          return failure(runtimeFailure("unexpected", "Voortgang kon niet worden gewist."));
        }
      },
    },
    profile: { updateProgress: onUpdateProgress },
    speech: {
      createRecognition: createBrowserSpeechRecognition,
      getMicrophonePermission: getBrowserMicrophonePermission,
      getRecognitionSupport: getBrowserSpeechRecognitionSupport,
      isRecognitionAvailable: () => getBrowserSpeechRecognitionSupport().isSupported,
      requestMicrophonePermission: requestBrowserMicrophonePermission,
      speak: (text, language = "nl-NL") => {
        if (!("speechSynthesis" in window)) {
          return failure(runtimeFailure("unavailable", "Spraakuitvoer is niet beschikbaar."));
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        window.speechSynthesis.speak(utterance);
        return success(undefined);
      },
    },
    storage: {
      get: (key, scope = "local") => safeStorage(scope).getItem(key),
      remove: (key, scope = "local") => safeStorage(scope).removeItem(key),
      set: (key, value, scope = "local") => {
        try {
          safeStorage(scope).setItem(key, value);
          return success(undefined);
        } catch {
          return failure(runtimeFailure("quota-exceeded", "Lokale opslag is vol."));
        }
      },
    },
  };
};
