import { ShieldCheck } from "lucide-react";
import { voicePrivacyCopy } from "../../logic/voice-privacy";

interface VoicePrivacyNoticeProps {
  onAccept: () => void;
  onClose: () => void;
}

export const VoicePrivacyNotice = ({ onAccept, onClose }: VoicePrivacyNoticeProps) => (
  <div
    className="rounded-2xl border-2 border-emerald-200 bg-white/95 p-3 text-left text-slate-900 shadow-[0_5px_0_rgba(15,23,42,0.12)]"
    data-component="VoicePrivacyNotice"
    data-testid="voice-privacy-notice"
  >
    <div className="flex items-start gap-2">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border-2 border-emerald-300 bg-emerald-100 text-emerald-700"
      >
        <ShieldCheck className="h-5 w-5" strokeWidth={3} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase leading-tight text-emerald-900">
          {voicePrivacyCopy.title}
        </p>
        <p className="mt-1 text-xs font-bold leading-tight text-slate-800">
          {voicePrivacyCopy.body}
        </p>
        <p className="mt-1 text-[0.68rem] font-bold leading-tight text-slate-600">
          {voicePrivacyCopy.browserNote}
        </p>
      </div>
    </div>
    <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
      <button
        className="min-h-10 rounded-2xl border-2 border-emerald-500 bg-emerald-500 px-3 text-xs font-black text-white shadow-[0_3px_0_rgba(21,128,61,0.35)] active:translate-y-0.5"
        data-testid="voice-privacy-accept-button"
        onClick={onAccept}
        type="button"
      >
        {voicePrivacyCopy.acknowledgement}
      </button>
      <button
        className="min-h-10 rounded-2xl border-2 border-slate-300 bg-white px-3 text-xs font-black text-slate-700 shadow-[0_3px_0_rgba(71,85,105,0.16)] active:translate-y-0.5"
        data-testid="voice-privacy-close-button"
        onClick={onClose}
        type="button"
      >
        Sluit
      </button>
    </div>
  </div>
);

VoicePrivacyNotice.displayName = "VoicePrivacyNotice";
