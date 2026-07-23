import { ChevronDown, Mic, ShieldCheck, Smartphone } from "lucide-react";
import { useState } from "react";
import { PanelCard, PrimaryActionButton } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
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
  const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);
  const microphonePermissionButtonLabel = getMicrophonePermissionButtonLabel(
    isCheckingMicrophonePermission,
    microphonePermission,
  );
  const privacyDetailsId = "settings-voice-privacy-details";

  return (
    <div className="contents" data-component="VoicePrivacySettingsCard">
      <PanelCard
        className="grid gap-2 !rounded-2xl !p-2.5"
        data-testid="settings-voice-privacy-card"
        data-speech-secure-context={speechSupport.isSecureContext ? "true" : "false"}
        data-speech-supported={speechSupport.isSupported ? "true" : "false"}
      >
        <div className="flex gap-2.5">
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
              De microfoon wordt alleen gebruikt om korte zinnen naar tekst om te zetten.
            </p>
            <button
              aria-controls={privacyDetailsId}
              aria-expanded={isPrivacyExpanded}
              className="mt-2 inline-flex min-h-8 items-center gap-1.5 rounded-xl border-2 border-sky-200 bg-sky-50/85 px-2.5 text-[0.72rem] font-black leading-none text-sky-900 shadow-sm active:translate-y-0.5"
              data-testid="settings-voice-privacy-toggle"
              onClick={() => setIsPrivacyExpanded((current) => !current)}
              type="button"
            >
              Waarom gebruiken we de microfoon?
              <ChevronDown
                aria-hidden="true"
                className={classNames(
                  "h-4 w-4 transition-transform motion-reduce:transition-none",
                  isPrivacyExpanded && "rotate-180",
                )}
                strokeWidth={3}
              />
            </button>
          </div>
        </div>

        <div
          className={classNames(
            "overflow-hidden transition-[max-height,opacity] duration-200 motion-reduce:transition-none",
            isPrivacyExpanded ? "max-h-32 opacity-100" : "max-h-0 opacity-0",
          )}
          data-expanded={isPrivacyExpanded}
        >
          <div aria-hidden={!isPrivacyExpanded} id={privacyDetailsId}>
            <p className="rounded-2xl border-2 border-white/80 bg-white/86 p-2 text-[0.72rem] font-bold leading-tight text-slate-700">
              {voicePrivacyCopy.body} {voicePrivacyCopy.browserNote}
            </p>
          </div>
        </div>

        <div className="flex gap-2 rounded-2xl border-2 border-sky-200 bg-sky-50/85 p-2">
          <Smartphone
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-sky-700"
            strokeWidth={3}
          />
          <p className="text-[0.72rem] font-black leading-tight text-slate-800">
            {speechSupportMessage} Als spraak niet werkt op telefoon, typ dezelfde zin.
          </p>
        </div>

        <p
          className="rounded-2xl border-2 border-amber-200 bg-amber-50/90 p-2 text-[0.72rem] font-black leading-tight text-amber-950"
          data-testid="settings-microphone-environment-message"
        >
          {microphoneEnvironmentMessage}
        </p>

        <PrimaryActionButton
          className="min-h-14 w-full border-emerald-600 bg-emerald-500 text-sm shadow-[0_4px_0_rgba(4,120,87,0.7)]"
          data-testid="settings-request-microphone-button"
          disabled={isCheckingMicrophonePermission}
          iconLeft={<Mic className="h-5 w-5" strokeWidth={3} />}
          onClick={onRequestMicrophonePermission}
        >
          {microphonePermissionButtonLabel}
        </PrimaryActionButton>

        <p
          aria-live="polite"
          className="rounded-2xl border-2 border-white/80 bg-white/90 p-2 text-[0.72rem] font-black leading-tight text-slate-800"
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
