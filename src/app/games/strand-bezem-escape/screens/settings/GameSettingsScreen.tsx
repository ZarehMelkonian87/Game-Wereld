import { useEffect, useState } from "react";
import {
  initialMicrophonePermissionResult,
  type MicrophonePermissionResult,
} from "../../logic/microphone-permission";
import { saveUnlockedRewardIds } from "../../logic/rewards";
import {
  readBezemEscapeSettings,
  saveBezemEscapeSettings,
  type BezemEscapeSettings,
} from "../../logic/settings";
import { getSpeechRecognitionSupportMessage } from "../../logic/speech-recognition";
import {
  getMicrophoneEnvironmentMessage,
  getMicrophonePermissionAttemptMessage,
} from "./microphoneSettings";
import { ConfirmResetDialog } from "./ConfirmResetDialog";
import { ResetProgressCard } from "./ResetProgressCard";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsTogglePanel } from "./SettingsTogglePanel";
import { VoicePrivacySettingsCard } from "./VoicePrivacySettingsCard";
import { useGameRuntime } from "../../runtime/GameRuntimeContext";

interface GameSettingsScreenProps {
  onBackToMenu?: () => void;
}

export const GameSettingsScreen = ({ onBackToMenu }: GameSettingsScreenProps) => {
  const runtime = useGameRuntime();
  const profileId = runtime.identity.profileId;
  const [settings, setSettings] = useState<BezemEscapeSettings>(() =>
    readBezemEscapeSettings(profileId, runtime.storage),
  );
  const speechSupport = runtime.speech.getRecognitionSupport();
  const speechSupportMessage = getSpeechRecognitionSupportMessage(speechSupport);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isCheckingMicrophonePermission, setIsCheckingMicrophonePermission] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState<MicrophonePermissionResult>(
    initialMicrophonePermissionResult,
  );
  const [permissionAttemptMessage, setPermissionAttemptMessage] = useState(
    "Tik op de knop om microfoontoegang te vragen.",
  );
  const [resetMessage, setResetMessage] = useState("");
  const microphoneEnvironmentMessage = getMicrophoneEnvironmentMessage(speechSupport);

  useEffect(() => {
    let isMounted = true;

    runtime.speech.getMicrophonePermission().then((permissionStatus) => {
      if (isMounted) {
        setMicrophonePermission(permissionStatus);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [runtime.speech]);

  const updateSetting = (nextSettings: BezemEscapeSettings) => {
    setSettings(nextSettings);
    saveBezemEscapeSettings(profileId, nextSettings, runtime.storage);
  };

  const handleRequestMicrophonePermission = async () => {
    setIsCheckingMicrophonePermission(true);
    setPermissionAttemptMessage(
      "Ik probeer nu de browser-popup voor microfoontoestemming te openen...",
    );

    try {
      const permissionStatus = await runtime.speech.requestMicrophonePermission();
      setMicrophonePermission(permissionStatus);
      setPermissionAttemptMessage(getMicrophonePermissionAttemptMessage(permissionStatus));
    } finally {
      setIsCheckingMicrophonePermission(false);
    }
  };

  const handleResetProgress = () => {
    void runtime.practice.reset();
    saveUnlockedRewardIds(profileId, [], runtime.storage);
    if (typeof window !== "undefined") {
      runtime.storage.remove("strand-bezem-escape:reward-result", "session");
    }

    setIsResetDialogOpen(false);
    setResetMessage("Voortgang is gewist.");
  };

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-10 overflow-y-auto overflow-x-hidden px-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+0.75rem)]"
      data-audio-enabled={settings.audioEnabled ? "true" : "false"}
      data-hints-enabled={settings.hintsEnabled ? "true" : "false"}
      data-music-enabled={settings.musicEnabled ? "true" : "false"}
      data-reduced-motion={settings.reducedMotion ? "true" : "false"}
      data-testid="game-settings-screen"
    >
      <div className="mx-auto flex min-h-full max-w-md flex-col gap-2.5">
        <SettingsHeader onBackToMenu={onBackToMenu} />
        <SettingsTogglePanel onUpdateSettings={updateSetting} settings={settings} />
        <VoicePrivacySettingsCard
          isCheckingMicrophonePermission={isCheckingMicrophonePermission}
          microphoneEnvironmentMessage={microphoneEnvironmentMessage}
          microphonePermission={microphonePermission}
          onRequestMicrophonePermission={handleRequestMicrophonePermission}
          permissionAttemptMessage={permissionAttemptMessage}
          speechSupport={speechSupport}
          speechSupportMessage={speechSupportMessage}
        />
        <ResetProgressCard
          onOpenResetDialog={() => {
            setResetMessage("");
            setIsResetDialogOpen(true);
          }}
          resetMessage={resetMessage}
        />
      </div>
      {isResetDialogOpen ? (
        <ConfirmResetDialog
          onCancel={() => setIsResetDialogOpen(false)}
          onConfirm={handleResetProgress}
        />
      ) : null}
    </div>
  );
};

GameSettingsScreen.displayName = "GameSettingsScreen";
