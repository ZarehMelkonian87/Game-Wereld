import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { SpeechRecognitionSession } from "../../game-platform/contracts";
import {
  createBrowserSpeechRecognition,
  getBrowserMicrophonePermission,
  getBrowserSpeechRecognitionSupport,
  requestBrowserMicrophonePermission,
} from "../../game-platform/runtime/browserSpeech";
import { detectPlatform } from "../../platform";
import { BackButton } from "../shared";
import {
  buildDiagnosisReport,
  describeEnvironment,
  detectBrowser,
  detectOs,
  type DiagnosisEnvironment,
  type DiagnosisLogLine,
} from "./microphoneDiagnosis";

/**
 * Microfoon-diagnose (T-52). Doel: op een echt toestel in één scherm zien
 * wáár de spraakherkenning breekt — API aanwezig? toestemming? callbacks? —
 * en dat als tekst kunnen kopiëren. De stappen volgen de hypotheses uit het
 * dossier: (1) toestemming, (2) korte herkenning, (3) doorlopende herkenning
 * zoals in Zeg & Zet, (4) herkenning ná het afspelen van geluid (WebKit-bug
 * 321436: op iOS hangt de herkenning na een <audio>/<video>).
 */

/** Na zoveel ms zonder enige callback beschouwen we een sessie als "hangt". */
const HANG_WATCHDOG_MS = 10_000;

const STEP_LABELS = {
  audio: "Stap 4 · na geluid",
  continuous: "Stap 3 · doorlopend (zoals Zeg & Zet)",
  permission: "Stap 1 · toestemming",
  short: "Stap 2 · korte herkenning",
} as const;

type StepKey = keyof typeof STEP_LABELS;

const readEnvironment = (): DiagnosisEnvironment => {
  const platform = detectPlatform();
  const userAgent = navigator.userAgent;
  const speechWindow = window as Window & {
    SpeechRecognition?: unknown;
    webkitSpeechRecognition?: unknown;
  };
  const speechRecognitionGlobal = speechWindow.SpeechRecognition
    ? "SpeechRecognition"
    : speechWindow.webkitSpeechRecognition
      ? "webkitSpeechRecognition"
      : "geen";
  return {
    browser: detectBrowser(userAgent),
    displayMode: platform.displayMode,
    formFactor: platform.formFactor,
    hasGetUserMedia: Boolean(navigator.mediaDevices?.getUserMedia),
    hasPermissionsApi: Boolean(navigator.permissions?.query),
    hasSpeechRecognition: speechRecognitionGlobal !== "geen",
    hasSpeechSynthesis: "speechSynthesis" in window,
    isOnline: navigator.onLine,
    isSecureContext: window.isSecureContext,
    os: detectOs(userAgent, {
      maxTouchPoints: navigator.maxTouchPoints,
      platform: navigator.platform,
    }),
    speechRecognitionGlobal,
    userAgent,
  };
};

/**
 * Korte toon (0,4 s) als blob-URL: geen extern bestand nodig, wel een echte
 * <audio>. (Een data-URL mag niet van de CSP: `media-src` staat alleen self en
 * blob toe.)
 */
const createBeepObjectUrl = (): string => {
  const sampleRate = 8000;
  const seconds = 0.4;
  const sampleCount = Math.floor(sampleRate * seconds);
  const buffer = new ArrayBuffer(44 + sampleCount);
  const view = new DataView(buffer);
  const writeAscii = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1) {
      view.setUint8(offset + index, text.charCodeAt(index));
    }
  };
  writeAscii(0, "RIFF");
  view.setUint32(4, 36 + sampleCount, true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeAscii(36, "data");
  view.setUint32(40, sampleCount, true);
  for (let index = 0; index < sampleCount; index += 1) {
    const fade = Math.min(1, (sampleCount - index) / 800);
    view.setUint8(
      44 + index,
      128 + Math.round(60 * fade * Math.sin((index / sampleRate) * 2 * Math.PI * 660)),
    );
  }
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
};

const supportReasonLabel = (reason: string | undefined, isSupported: boolean) =>
  isSupported ? "ondersteund" : (reason ?? "niet ondersteund");

export const DiagnoseMicrofoonScreen = () => {
  const navigate = useNavigate();
  const startedAtRef = useRef(Date.now());
  const sessionRef = useRef<SpeechRecognitionSession | null>(null);
  const watchdogRef = useRef<number | undefined>(undefined);
  const [environment] = useState<DiagnosisEnvironment>(() => readEnvironment());
  const [support] = useState(() => getBrowserSpeechRecognitionSupport());
  const [permissionState, setPermissionState] = useState("nog niet opgevraagd");
  const [lines, setLines] = useState<DiagnosisLogLine[]>([]);
  const [activeStep, setActiveStep] = useState<StepKey | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const log = useCallback((step: StepKey, text: string) => {
    setLines((current) => [
      ...current,
      { at: Date.now() - startedAtRef.current, step: STEP_LABELS[step], text },
    ]);
  }, []);

  const clearWatchdog = () => {
    if (watchdogRef.current !== undefined) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = undefined;
    }
  };

  const finishStep = useCallback(() => {
    clearWatchdog();
    sessionRef.current = null;
    setActiveStep(null);
  }, []);

  useEffect(() => {
    void getBrowserMicrophonePermission().then((result) => {
      setPermissionState(`${result.state} — ${result.message}`);
    });
    return () => {
      clearWatchdog();
      sessionRef.current?.destroy();
    };
  }, []);

  const runPermissionStep = async () => {
    setActiveStep("permission");
    log(
      "permission",
      "getUserMedia({ audio: true }) aangevraagd — let op of er een toestemmingsvraag verschijnt",
    );
    const result = await requestBrowserMicrophonePermission();
    setPermissionState(`${result.state} — ${result.message}`);
    log("permission", `resultaat: ${result.state} (${result.message})`);
    setActiveStep(null);
  };

  const runRecognitionStep = (step: StepKey, options: { continuous: boolean }) => {
    sessionRef.current?.destroy();
    clearWatchdog();
    setActiveStep(step);
    let sawCallback = false;
    let sawStart = false;
    const markCallback = () => {
      sawCallback = true;
      clearWatchdog();
    };
    const session = createBrowserSpeechRecognition({
      autoStopMs: options.continuous ? 25_000 : 15_000,
      continuous: options.continuous,
      interimResults: true,
      language: "nl-NL",
      latestSegmentOnly: options.continuous,
      onEnd: () => {
        markCallback();
        log(step, "onend — sessie gestopt");
        finishStep();
      },
      onError: (code, message) => {
        markCallback();
        log(step, `onerror: ${code}${message ? ` (${message})` : ""}`);
      },
      onNoMatch: () => {
        markCallback();
        log(step, "onnomatch — geluid gehoord, geen woorden herkend");
      },
      onResult: (result) => {
        markCallback();
        log(
          step,
          `onresult: "${result.transcript}" (${result.isFinal ? "definitief" : "tussentijds"}, zekerheid ${result.confidence.toFixed(2)})`,
        );
      },
      onStatusChange: (status) => {
        // "listening" komt ook na elk tussentijds resultaat terug; alleen de
        // eerste keer is het echte onstart.
        if (status === "listening" && !sawStart) {
          sawStart = true;
          markCallback();
          log(step, "onstart — luistert; zeg nu duidelijk: “zet de bal op het strand”");
        }
      },
      silenceStopMs: options.continuous ? 4_000 : undefined,
    });
    if (!session) {
      log(step, "createRecognition gaf null — SpeechRecognition ontbreekt in deze browser");
      finishStep();
      return;
    }
    sessionRef.current = session;
    log(
      step,
      `start() aangeroepen (continuous=${options.continuous}, interimResults=true, lang=nl-NL)`,
    );
    const started = session.start();
    if (!started) {
      finishStep();
      return;
    }
    watchdogRef.current = window.setTimeout(() => {
      if (!sawCallback) {
        log(
          step,
          `HANGT: ${HANG_WATCHDOG_MS / 1000}s zonder onstart/onresult/onerror/onend (past bij WebKit-bug 321436 of geblokkeerde mic)`,
        );
        session.destroy();
        finishStep();
      }
    }, HANG_WATCHDOG_MS);
  };

  const runAudioThenRecognitionStep = async () => {
    setActiveStep("audio");
    log("audio", "korte toon afspelen via <audio> (blob-URL)…");
    const beepUrl = createBeepObjectUrl();
    try {
      const audio = new Audio(beepUrl);
      await audio.play();
      await new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        window.setTimeout(resolve, 1_500);
      });
      log("audio", "toon afgespeeld; nu direct een korte herkenning starten");
    } catch (error) {
      log("audio", `afspelen mislukt: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      URL.revokeObjectURL(beepUrl);
    }
    runRecognitionStep("audio", { continuous: false });
  };

  const stopActiveSession = () => {
    log(activeStep ?? "short", "handmatig gestopt");
    sessionRef.current?.stop();
  };

  const report = useMemo(
    () =>
      buildDiagnosisReport({
        appVersion: __APP_BUILD_TIME__,
        environment,
        lines,
        permissionState,
        supportReason: supportReasonLabel(support.reason, support.isSupported),
      }),
    [environment, lines, permissionState, support],
  );

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 2_500);
  };

  const isBusy = activeStep !== null;
  const stepButtonClass =
    "min-h-12 w-full rounded-xl border-2 border-cyan-400 bg-cyan-600 px-4 py-3 text-left text-base font-black text-white shadow-md transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white safe-area-inset"
      data-component="DiagnoseMicrofoonScreen"
      data-testid="diagnose-microfoon-screen"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4 sm:px-6">
        <header className="flex items-center gap-3">
          <BackButton onClick={() => navigate(-1)} />
          <div>
            <h1 className="text-xl font-black sm:text-2xl">Microfoon-diagnose</h1>
            <p className="text-sm text-white/80">
              Doorloop de stappen en kopieer het rapport (T-52).
            </p>
          </div>
        </header>

        <section
          className="rounded-2xl border-2 border-white/15 bg-white/10 p-4"
          data-testid="diagnose-environment"
        >
          <h2 className="mb-2 text-base font-black">Omgeving</h2>
          <p className="text-sm font-bold" data-testid="diagnose-environment-summary">
            {describeEnvironment(environment)}
          </p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-white/70">SpeechRecognition</dt>
            <dd data-testid="diagnose-speech-api">
              {environment.hasSpeechRecognition
                ? `aanwezig (${environment.speechRecognitionGlobal})`
                : "ontbreekt"}{" "}
              · {supportReasonLabel(support.reason, support.isSupported)}
            </dd>
            <dt className="text-white/70">getUserMedia</dt>
            <dd>{environment.hasGetUserMedia ? "aanwezig" : "ontbreekt"}</dd>
            <dt className="text-white/70">Mic-toestemming</dt>
            <dd data-testid="diagnose-permission">{permissionState}</dd>
            <dt className="text-white/70">HTTPS / online</dt>
            <dd>
              {environment.isSecureContext ? "beveiligd" : "NIET beveiligd"} ·{" "}
              {environment.isOnline ? "online" : "offline"}
            </dd>
            <dt className="text-white/70">Build</dt>
            <dd>{__APP_BUILD_TIME__}</dd>
          </dl>
        </section>

        <section className="grid gap-2" data-testid="diagnose-steps">
          <button
            className={stepButtonClass}
            data-testid="diagnose-step-permission"
            disabled={isBusy}
            onClick={() => void runPermissionStep()}
            type="button"
          >
            1 · Toestemming vragen
            <span className="block text-xs font-semibold text-white/80">
              Verschijnt de vraag “mag deze site de microfoon gebruiken?”
            </span>
          </button>
          <button
            className={stepButtonClass}
            data-testid="diagnose-step-short"
            disabled={isBusy}
            onClick={() => runRecognitionStep("short", { continuous: false })}
            type="button"
          >
            2 · Korte herkenning (één zin)
            <span className="block text-xs font-semibold text-white/80">
              Zeg: “zet de bal op het strand”
            </span>
          </button>
          <button
            className={stepButtonClass}
            data-testid="diagnose-step-continuous"
            disabled={isBusy}
            onClick={() => runRecognitionStep("continuous", { continuous: true })}
            type="button"
          >
            3 · Doorlopend luisteren (zoals Zeg &amp; Zet)
            <span className="block text-xs font-semibold text-white/80">
              Zeg twee zinnen na elkaar; stopt na 4 s stilte
            </span>
          </button>
          <button
            className={stepButtonClass}
            data-testid="diagnose-step-audio"
            disabled={isBusy}
            onClick={() => void runAudioThenRecognitionStep()}
            type="button"
          >
            4 · Eerst geluid, dan herkenning
            <span className="block text-xs font-semibold text-white/80">
              Test of de mic na een geluidje nog werkt (iOS-bug)
            </span>
          </button>
          {isBusy && activeStep !== "permission" ? (
            <button
              className="min-h-12 rounded-xl border-2 border-amber-300 bg-amber-500 px-4 font-black text-slate-900"
              data-testid="diagnose-stop"
              onClick={stopActiveSession}
              type="button"
            >
              Stop luisteren
            </button>
          ) : null}
        </section>

        <section className="rounded-2xl border-2 border-white/15 bg-black/40 p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-black">Rapport</h2>
            <div className="flex gap-2">
              <button
                className="min-h-10 rounded-lg border-2 border-white/30 bg-white/10 px-3 text-sm font-bold"
                data-testid="diagnose-clear"
                onClick={() => setLines([])}
                type="button"
              >
                Wissen
              </button>
              <button
                className="min-h-10 rounded-lg border-2 border-emerald-300 bg-emerald-600 px-3 text-sm font-black"
                data-testid="diagnose-copy"
                onClick={() => void copyReport()}
                type="button"
              >
                {copyState === "copied"
                  ? "Gekopieerd ✓"
                  : copyState === "failed"
                    ? "Kopiëren mislukt — selecteer de tekst"
                    : "Kopieer rapport"}
              </button>
            </div>
          </div>
          <textarea
            aria-label="Diagnoserapport"
            className="h-64 w-full resize-y rounded-lg bg-black/60 p-3 font-mono text-xs leading-relaxed text-emerald-100"
            data-testid="diagnose-report"
            readOnly
            value={report}
          />
        </section>
      </div>
    </div>
  );
};

DiagnoseMicrofoonScreen.displayName = "DiagnoseMicrofoonScreen";
