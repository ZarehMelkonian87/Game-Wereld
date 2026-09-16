import { Keyboard, Mic, RefreshCw } from "lucide-react";

interface SpeechRetryPanelProps {
  message?: string;
  onRetry: () => void;
  onUseKeyboard?: () => void;
}

/**
 * Vriendelijk herkansings-paneel dat verschijnt wanneer de spraakherkenning niets
 * bruikbaars oplevert (onverstaanbaar, andere taal, geen match of een fout). Het
 * staat op dezelfde plek als de luister-wave, zodat de mic-feedback niet zomaar
 * "verdwijnt", en biedt altijd een duidelijke manier om opnieuw te proberen of
 * te typen (T-34).
 */
export const SpeechRetryPanel = ({ message, onRetry, onUseKeyboard }: SpeechRetryPanelProps) => (
  <div
    className="pointer-events-auto fixed top-[calc(clamp(8.5rem,19dvh,10.5rem)+env(safe-area-inset-top,0px))] landscape:top-[calc(clamp(5.5rem,14dvh,6.75rem)+env(safe-area-inset-top,0px))] left-1/2 z-50 flex w-[92vw] max-w-md -translate-x-1/2 items-center gap-3 rounded-3xl border-2 border-white/80 bg-gradient-to-r from-amber-500/95 via-orange-500/95 to-amber-600/95 px-4 py-3 shadow-2xl backdrop-blur-md"
    data-slot="speech-retry-panel"
    data-testid="speech-retry-panel"
  >
    <div className="flex shrink-0 items-center justify-center rounded-2xl bg-white/25 p-2 text-white shadow-inner">
      <Mic className="h-6 w-6" strokeWidth={2.5} />
    </div>

    <p className="min-w-0 flex-1 text-sm font-black leading-tight text-white drop-shadow-sm">
      {message ?? "Ik verstond je niet goed. Probeer het nog eens rustig."}
    </p>

    <div className="flex shrink-0 items-center gap-1.5">
      {onUseKeyboard ? (
        <button
          aria-label="Typ de zin"
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-white/90 bg-white/20 text-white transition hover:scale-105 active:scale-95"
          data-testid="speech-retry-keyboard-button"
          onClick={onUseKeyboard}
          type="button"
        >
          <Keyboard className="h-5 w-5" strokeWidth={2.5} />
        </button>
      ) : null}
      <button
        aria-label="Opnieuw proberen"
        className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-2xl border-2 border-white bg-emerald-500 px-3.5 py-2 text-xs font-black text-white shadow-md transition hover:scale-105 active:scale-95 active:bg-emerald-600"
        data-testid="speech-retry-button"
        onClick={onRetry}
        type="button"
      >
        <RefreshCw className="h-4 w-4" strokeWidth={3} />
        <span>Opnieuw</span>
      </button>
    </div>
  </div>
);

SpeechRetryPanel.displayName = "SpeechRetryPanel";
