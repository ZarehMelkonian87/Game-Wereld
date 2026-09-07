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
import { createLocalSpeechRecognition } from "./localSpeechEngine";

interface CreateBrowserGameRuntimeOptions {
  clock?: GameRuntime["clock"];
  diagnostics: GameRuntime["diagnostics"];
  gameId: GameId;
  ids?: GameRuntime["ids"];
  onComplete: GameRuntime["lifecycle"]["complete"];
  onExit: GameRuntime["lifecycle"]["exit"];
  practice: GameRuntime["practice"];
  profileId: ProfileId;
  sessionId?: SessionId;
  storage: GameRuntime["storage"];
}

const runtimeFailure = (
  code: RuntimeFailure["code"],
  message: string,
  recoverable = true,
): RuntimeFailure => ({ code, message, recoverable });

export const createBrowserGameRuntime = ({
  clock = { now: () => new Date() },
  diagnostics,
  gameId,
  ids = {
    eventId: () => createEventId(crypto.randomUUID()),
    sessionId: () => createSessionId(crypto.randomUUID()),
  },
  onComplete,
  onExit,
  practice,
  profileId,
  sessionId = createSessionId(crypto.randomUUID()),
  storage,
}: CreateBrowserGameRuntimeOptions): GameRuntime => {
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
    diagnostics,
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
    practice,
    speech: {
      createRecognition: (options = {}) => {
        if (
          typeof navigator !== "undefined" &&
          "mediaDevices" in navigator &&
          typeof navigator.mediaDevices?.getUserMedia === "function" &&
          (typeof AudioContext !== "undefined" || "webkitAudioContext" in window)
        ) {
          return createLocalSpeechRecognition(options);
        }
        return createBrowserSpeechRecognition(options);
      },
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
    storage,
  };
};
