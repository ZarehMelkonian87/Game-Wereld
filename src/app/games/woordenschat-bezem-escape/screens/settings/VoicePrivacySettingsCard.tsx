import { Mic, ShieldCheck, Smartphone } from "lucide-react";
import { PanelCard, PrimaryActionButton } from "../../components/ui";
import type { MicrophonePermissionResult } from "../../logic/microphone-permission";
import { voicePrivacyCopy } from "../../logic/voice-privacy";
import {
  getMicrophonePermissionButtonLabel,
  getMicrophonePermissionStatusClassName,
} from "./microphoneSettings";

interface SpeechSupportSummary {
  isSecureContext: boolean;
  isSupported: boolean;
}

interface VoicePrivacySettingsCardProps {
  isCheckingMicrophonePermission: boolean;
  microphoneEnvironmentMessage: string;
  microphonePermission: MicrophonePermissionResult;
  onRequestMicrophonePermission: () => void;
  permissionAttemptMessage: string;
  speechSupport: SpeechSupportSummary;
  speechSupportMessage: string;
}

export const VoicePrivacySettingsCard = ({
  isCheckingMicrophonePermission,
  microphoneEnvironmentMessage,
  microphonePermission,
  onRequestMicrophonePermission,
  permissionAttemptMessage,
  speechSupport,
  speechSupportMessage,
}: VoicePrivacySettingsCardProps) => {
  const microphonePermissionButtonLabel = getMicrophonePermissionButtonLabel(
    isCheckingMicrophonePermission,
    microphonePermission,
  );

  return (
    <div className="contents" data-component="VoicePrivacySettingsCard">
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
          onClick={onRequestMicrophonePermission}
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
    </div>
  );
};

VoicePrivacySettingsCard.displayName = "VoicePrivacySettingsCard";
