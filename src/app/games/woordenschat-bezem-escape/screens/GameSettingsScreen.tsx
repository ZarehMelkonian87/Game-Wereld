import {
  ArrowLeft,
  EyeOff,
  Lightbulb,
  Mic,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Volume2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { PanelCard, PrimaryActionButton, RibbonTitle } from "../components/ui";
import { classNames } from "../components/ui/classNames";
import {
  getMicrophonePermissionStatus,
  initialMicrophonePermissionResult,
  requestMicrophonePermission,
  type MicrophonePermissionResult,
} from "../logic/microphone-permission";
import { resetBezemEscapeProgress, BEZEM_ESCAPE_GAME_ID } from "../logic/progress";
import {
  readBezemEscapeSettings,
  saveBezemEscapeSettings,
  type BezemEscapeSettings,
} from "../logic/settings";
import { saveUnlockedRewardIds } from "../logic/rewards";
import {
  getSpeechRecognitionSupport,
  getSpeechRecognitionSupportMessage,
} from "../logic/speech-recognition";
import { voicePrivacyCopy } from "../logic/voice-privacy";
import { useProfile } from "../../../contexts/ProfileContext";

interface GameSettingsScreenProps {
  onBackToMenu?: () => void;
}

const getMicrophonePermissionStatusClassName = ({
  canUse,
  state,
}: MicrophonePermissionResult) =>
  classNames(
    "rounded-2xl border-2 p-2 text-xs font-black leading-tight",
    canUse && "border-emerald-300 bg-emerald-50/90 text-emerald-900",
    state === "denied" && "border-amber-300 bg-amber-50/90 text-amber-950",
    state === "insecure-context" && "border-amber-300 bg-amber-50/90 text-amber-950",
    state === "unsupported" && "border-slate-300 bg-slate-50/90 text-slate-700",
    !canUse &&
      state !== "denied" &&
      state !== "insecure-context" &&
      state !== "unsupported" &&
      "border-sky-200 bg-sky-50/90 text-sky-950",
  );

const getMicrophonePermissionButtonLabel = (
  isCheckingMicrophonePermission: boolean,
  microphonePermission: MicrophonePermissionResult,
) => {
  if (isCheckingMicrophonePermission) {
    return "Controleren...";
  }

  if (microphonePermission.canUse) {
    return "Microfoon klaar";
  }

  if (microphonePermission.state === "denied") {
    return "Controleer opnieuw";
  }

  return "Vraag microfoon";
};

const getMicrophonePermissionAttemptMessage = ({
  message,
  state,
}: MicrophonePermissionResult) => {
  if (state === "granted") {
    return "Microfoon is klaar. Ga terug naar de game en tik op Zeg zelf.";
  }

  if (state === "insecure-context") {
    return "Er komt geen toestemming-popup, omdat deze pagina niet veilig is geopend. Gebruik HTTPS voor een echte mobiele microfoontest.";
  }

  if (state === "denied") {
    return "De browser heeft microfoon geblokkeerd. Zet microfoon aan in de browserinstellingen en probeer opnieuw.";
  }

  return message;
};

const getMicrophoneEnvironmentMessage = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "Microfoonstatus kan hier nog niet worden gecontroleerd.";
  }

  if (!window.isSecureContext) {
    return `Je opent deze web-app via ${window.location.protocol}//${window.location.host}. Op een telefoon opent de microfoon-popup meestal alleen via HTTPS.`;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return "Deze browser geeft geen normale microfoon-toegang aan web-apps. Probeer Chrome op Android of Safari/Chrome met HTTPS.";
  }

  return "Deze pagina mag een browser-popup voor microfoontoestemming tonen.";
};

const ToggleRow = ({
  checked,
  description,
  icon,
  label,
  onToggle,
  testId,
}: {
  checked: boolean;
  description: string;
  icon: ReactNode;
  label: string;
  onToggle: () => void;
  testId: string;
}) => (
  <button
    className="grid min-h-16 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border-2 border-white/80 bg-white/82 p-3 text-left shadow-[0_3px_0_rgba(15,23,42,0.12)] active:translate-y-0.5"
    data-testid={testId}
    onClick={onToggle}
    type="button"
  >
    <span
      aria-hidden="true"
      className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-700"
    >
      {icon}
    </span>
    <span className="min-w-0">
      <span className="block truncate text-sm font-black leading-tight text-slate-900">
        {label}
      </span>
      <span className="mt-1 block text-xs font-bold leading-tight text-slate-600">
        {description}
      </span>
    </span>
    <span
      aria-hidden="true"
      className={`flex h-9 w-16 items-center rounded-full border-2 p-1 transition ${
        checked ? "border-emerald-400 bg-emerald-200" : "border-slate-300 bg-slate-200"
      }`}
    >
      <span
        className={`block h-6 w-6 rounded-full bg-white shadow transition ${
          checked ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </span>
  </button>
);

ToggleRow.displayName = "ToggleRow";

export const GameSettingsScreen = ({ onBackToMenu }: GameSettingsScreenProps) => {
  const { currentProfile, updateProgress } = useProfile();
  const profileId = currentProfile?.id ?? "demo-profile";
  const [settings, setSettings] = useState<BezemEscapeSettings>(() =>
    readBezemEscapeSettings(profileId),
  );
  const speechSupport = getSpeechRecognitionSupport();
  const speechSupportMessage = getSpeechRecognitionSupportMessage(speechSupport);
  const [confirmReset, setConfirmReset] = useState(false);
  const [isCheckingMicrophonePermission, setIsCheckingMicrophonePermission] =
    useState(false);
  const [microphonePermission, setMicrophonePermission] =
    useState<MicrophonePermissionResult>(initialMicrophonePermissionResult);
  const [permissionAttemptMessage, setPermissionAttemptMessage] = useState(
    "Tik op de knop om de telefoon om microfoontoegang te laten vragen.",
  );
  const [resetMessage, setResetMessage] = useState("");
  const microphonePermissionButtonLabel = getMicrophonePermissionButtonLabel(
    isCheckingMicrophonePermission,
    microphonePermission,
  );
  const microphoneEnvironmentMessage = getMicrophoneEnvironmentMessage();

  useEffect(() => {
    let isMounted = true;

    getMicrophonePermissionStatus().then((permissionStatus) => {
      if (isMounted) {
        setMicrophonePermission(permissionStatus);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateSetting = (nextSettings: BezemEscapeSettings) => {
    setSettings(nextSettings);
    saveBezemEscapeSettings(profileId, nextSettings);
  };

  const handleRequestMicrophonePermission = async () => {
    setIsCheckingMicrophonePermission(true);
    setPermissionAttemptMessage(
      "Ik probeer nu de browser-popup voor microfoontoestemming te openen...",
    );

    try {
      const permissionStatus = await requestMicrophonePermission();
      setMicrophonePermission(permissionStatus);
      setPermissionAttemptMessage(getMicrophonePermissionAttemptMessage(permissionStatus));
    } finally {
      setIsCheckingMicrophonePermission(false);
    }
  };

  const handleResetProgress = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setResetMessage("Druk nog een keer om voortgang te wissen.");
      return;
    }

    resetBezemEscapeProgress(profileId);
    saveUnlockedRewardIds(profileId, []);
    updateProgress(BEZEM_ESCAPE_GAME_ID, {
      completed: false,
      lastPlayed: new Date().toISOString(),
      score: 0,
      stars: 0,
    });

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("woordenschat-bezem-escape:race-state");
      window.sessionStorage.removeItem("woordenschat-bezem-escape:race-result");
    }

    setConfirmReset(false);
    setResetMessage("Voortgang is gewist.");
  };

  return (
    <div
      data-testid="game-settings-screen"
      data-audio-enabled={settings.audioEnabled ? "true" : "false"}
      data-hints-enabled={settings.hintsEnabled ? "true" : "false"}
      data-reduced-motion={settings.reducedMotion ? "true" : "false"}
      className="pointer-events-auto absolute inset-0 z-10 overflow-y-auto px-3 pb-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]"
    >
      <div className="mx-auto flex min-h-full max-w-md flex-col gap-3">
        <div>
          <button
            aria-label="Terug naar game menu"
            className="mb-2 inline-flex min-h-11 items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white/88 px-3 text-sm font-black text-slate-900 shadow-[0_3px_0_rgba(71,85,105,0.22)] active:translate-y-0.5"
            data-testid="settings-back-button"
            onClick={onBackToMenu}
            type="button"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={3} />
            Menu
          </button>
          <div className="text-center">
            <RibbonTitle data-testid="settings-title">Instellingen</RibbonTitle>
          </div>
        </div>

        <PanelCard className="grid gap-2 !rounded-2xl !p-3">
          <ToggleRow
            checked={settings.audioEnabled}
            description="Spreek de opdrachten hardop uit."
            icon={<Volume2 className="h-6 w-6" strokeWidth={3} />}
            label="Audio"
            onToggle={() =>
              updateSetting({ ...settings, audioEnabled: !settings.audioEnabled })
            }
            testId="settings-audio-toggle"
          />
          <ToggleRow
            checked={settings.hintsEnabled}
            description="Laat de mascotte helpen wanneer nodig."
            icon={<Lightbulb className="h-6 w-6" strokeWidth={3} />}
            label="Hints"
            onToggle={() =>
              updateSetting({ ...settings, hintsEnabled: !settings.hintsEnabled })
            }
            testId="settings-hints-toggle"
          />
          <ToggleRow
            checked={settings.reducedMotion}
            description="Minder beweging en minder pulse-effecten."
            icon={<EyeOff className="h-6 w-6" strokeWidth={3} />}
            label="Rustige beweging"
            onToggle={() =>
              updateSetting({ ...settings, reducedMotion: !settings.reducedMotion })
            }
            testId="settings-reduced-motion-toggle"
          />
        </PanelCard>

        <PanelCard
          className="grid gap-2 !rounded-2xl !p-3"
          data-testid="settings-voice-privacy-card"
          data-speech-secure-context={speechSupport.isSecureContext ? "true" : "false"}
          data-speech-supported={speechSupport.isSupported ? "true" : "false"}
        >
          <div className="flex gap-2">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-emerald-300 bg-emerald-100 text-emerald-700"
            >
              <ShieldCheck className="h-5 w-5" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-black leading-tight text-slate-900">
                {voicePrivacyCopy.title}
              </p>
              <p className="mt-1 text-xs font-bold leading-tight text-slate-700">
                {voicePrivacyCopy.body}
              </p>
              <p className="mt-1 text-[0.68rem] font-bold leading-tight text-slate-600">
                {voicePrivacyCopy.browserNote}
              </p>
            </div>
          </div>
          <div className="flex gap-2 rounded-2xl border-2 border-sky-200 bg-sky-50/85 p-2">
            <Smartphone
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-sky-700"
              strokeWidth={3}
            />
            <p className="text-xs font-black leading-tight text-slate-800">
              {speechSupportMessage} Als spraak niet werkt op telefoon, typ dezelfde zin.
            </p>
          </div>
          <p
            className="rounded-2xl border-2 border-amber-200 bg-amber-50/90 p-2 text-xs font-black leading-tight text-amber-950"
            data-testid="settings-microphone-environment-message"
          >
            {microphoneEnvironmentMessage}
          </p>
          <PrimaryActionButton
            className="w-full border-emerald-600 bg-emerald-500 text-sm shadow-[0_4px_0_rgba(4,120,87,0.7)]"
            data-testid="settings-request-microphone-button"
            disabled={isCheckingMicrophonePermission}
            iconLeft={<Mic className="h-5 w-5" strokeWidth={3} />}
            onClick={handleRequestMicrophonePermission}
          >
            {microphonePermissionButtonLabel}
          </PrimaryActionButton>
          <p
            aria-live="polite"
            className="rounded-2xl border-2 border-white/80 bg-white/90 p-2 text-xs font-black leading-tight text-slate-800"
            data-testid="settings-microphone-attempt-message"
          >
            {permissionAttemptMessage}
          </p>
          <p
            aria-live="polite"
            className={getMicrophonePermissionStatusClassName(microphonePermission)}
            data-testid="settings-microphone-permission-message"
            data-microphone-permission={microphonePermission.state}
          >
            {microphonePermission.message}
          </p>
        </PanelCard>

        <PanelCard className="!rounded-2xl !p-3">
          <p className="text-xs font-black leading-tight text-slate-800">
            Data in deze game is oefenobservatie. Het is geen diagnose, geen officiele testscore en
            geen vergelijking met normgroepen.
          </p>
          <PrimaryActionButton
            className="mt-3 w-full border-rose-600 bg-rose-500 text-sm shadow-[0_4px_0_rgba(190,18,60,0.75)] hover:bg-rose-400"
            data-testid="settings-reset-progress-button"
            iconLeft={<RotateCcw className="h-5 w-5" strokeWidth={3} />}
            onClick={handleResetProgress}
          >
            {confirmReset ? "Bevestig wissen" : "Reset voortgang"}
          </PrimaryActionButton>
          <p
            className="mt-2 min-h-5 text-xs font-black leading-tight text-slate-700"
            data-testid="settings-reset-message"
          >
            {resetMessage}
          </p>
        </PanelCard>
      </div>
    </div>
  );
};

GameSettingsScreen.displayName = "GameSettingsScreen";
