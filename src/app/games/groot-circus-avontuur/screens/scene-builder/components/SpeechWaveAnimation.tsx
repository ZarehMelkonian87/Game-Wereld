import { Check, Mic } from "lucide-react";

interface SpeechWaveAnimationProps {
  onStop?: () => void;
  transcript?: string;
}

export const SpeechWaveAnimation = ({ onStop, transcript }: SpeechWaveAnimationProps) => {
  const hasSpokenWords = Boolean(transcript && transcript.trim().length > 0);

  return (
    <>
      <style>{`
        @keyframes speechWave {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1.3); }
        }
        .speech-bar {
          animation: speechWave 0.75s infinite ease-in-out;
          transform-origin: center;
        }
      `}</style>
      <div
        className="pointer-events-auto fixed top-[calc(clamp(8.5rem,19dvh,10.5rem)+env(safe-area-inset-top,0px))] landscape:top-[calc(clamp(5.5rem,14dvh,6.75rem)+env(safe-area-inset-top,0px))] left-1/2 z-50 flex w-[92vw] max-w-md -translate-x-1/2 items-center gap-3 rounded-3xl border-2 border-white/80 bg-gradient-to-r from-sky-600/95 via-sky-500/95 to-indigo-600/95 px-4 py-3 shadow-2xl backdrop-blur-md transition-all duration-200"
        data-slot="speech-wave-animation"
      >
        <div className="flex shrink-0 items-center justify-center rounded-2xl bg-white/20 p-2 text-white shadow-inner">
          <Mic className="h-6 w-6 animate-pulse" strokeWidth={2.5} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="truncate text-xs font-black tracking-wide text-white uppercase drop-shadow-sm">
              {hasSpokenWords ? "Ik hoor je:" : "Ik luister..."}
            </span>
            <div className="flex h-5 w-10 items-center gap-0.5">
              <div
                className="speech-bar h-3.5 w-1 rounded-full bg-cyan-200"
                style={{ animationDelay: "0.05s" }}
              />
              <div
                className="speech-bar h-5 w-1 rounded-full bg-white"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="speech-bar h-4 w-1 rounded-full bg-cyan-100"
                style={{ animationDelay: "0.35s" }}
              />
              <div
                className="speech-bar h-5 w-1 rounded-full bg-white"
                style={{ animationDelay: "0.15s" }}
              />
              <div
                className="speech-bar h-3 w-1 rounded-full bg-cyan-300"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>

          <p className="line-clamp-2 text-sm font-black text-amber-200 drop-shadow-sm">
            {hasSpokenWords ? `"${transcript}"` : "Neem rustig de tijd om je zin te zeggen."}
          </p>
        </div>

        {onStop ? (
          <button
            aria-label="Klaar met spreken"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border-2 border-white bg-emerald-500 px-3.5 py-2 text-xs font-black text-white shadow-md transition hover:scale-105 active:scale-95 active:bg-emerald-600"
            data-testid="speech-stop-button"
            onClick={onStop}
            type="button"
          >
            <Check className="h-4 w-4" strokeWidth={3} />
            <span>Klaar</span>
          </button>
        ) : null}
      </div>
    </>
  );
};

SpeechWaveAnimation.displayName = "SpeechWaveAnimation";
