import { X } from "lucide-react";

interface ParentObservationSheetProps {
  notice?: string | null;
  onClose: () => void;
  onRecordActiveVocabulary: (rating: "good" | "help" | "partial") => void;
  onRecordSentenceRepeat: (rating: "good" | "help" | "partial") => void;
  open: boolean;
}

export const ParentObservationSheet = ({
  notice,
  onClose,
  onRecordActiveVocabulary,
  onRecordSentenceRepeat,
  open,
}: ParentObservationSheetProps) => {
  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="pointer-events-auto absolute inset-0 z-40 flex items-end bg-slate-950/18 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
      data-component="ParentObservationSheet"
      data-testid="active-language-panel"
      role="dialog"
    >
      <div className="w-full rounded-[1.5rem] border-2 border-white bg-white/96 p-3 text-[0.72rem] font-black leading-tight text-slate-900 shadow-[0_6px_0_rgba(15,23,42,0.16)] backdrop-blur-sm">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-950">Ouder-observatie</p>
            <p className="mt-0.5 text-[0.68rem] font-bold text-slate-600">
              Optioneel: bewaar hoe het praten ging.
            </p>
          </div>
          <button
            aria-label="Ouder-observatie sluiten"
            className="flex min-h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-300 bg-white text-slate-800 shadow-[0_3px_0_rgba(71,85,105,0.16)] active:translate-y-0.5 active:shadow-none"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>

        {notice ? (
          <p
            className="mb-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[0.68rem] text-emerald-800"
            data-testid="observation-notice"
          >
            {notice}
          </p>
        ) : null}

        <div className="grid gap-2 landscape:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-sky-100 bg-sky-50/75 p-2">
            <p className="mb-1 truncate text-slate-900">Heeft het kind het woord gezegd?</p>
            <div className="grid grid-cols-3 gap-1">
              <button
                className="min-h-10 rounded-xl border-2 border-emerald-300 bg-emerald-100 px-1"
                data-testid="active-vocabulary-good"
                onClick={() => onRecordActiveVocabulary("good")}
                type="button"
              >
                Zelf
              </button>
              <button
                className="min-h-10 rounded-xl border-2 border-amber-300 bg-amber-100 px-1"
                data-testid="active-vocabulary-partial"
                onClick={() => onRecordActiveVocabulary("partial")}
                type="button"
              >
                Bijna
              </button>
              <button
                className="min-h-10 rounded-xl border-2 border-sky-300 bg-sky-100 px-1"
                data-testid="active-vocabulary-help"
                onClick={() => onRecordActiveVocabulary("help")}
                type="button"
              >
                Hulp
              </button>
            </div>
          </div>
          <div className="min-w-0 rounded-2xl border border-sky-100 bg-sky-50/75 p-2">
            <p className="mb-1 truncate text-slate-900">Heeft het kind de zin nagezegd?</p>
            <div className="grid grid-cols-3 gap-1">
              <button
                className="min-h-10 rounded-xl border-2 border-emerald-300 bg-emerald-100 px-1"
                data-testid="sentence-repeat-good"
                onClick={() => onRecordSentenceRepeat("good")}
                type="button"
              >
                Goed
              </button>
              <button
                className="min-h-10 rounded-xl border-2 border-amber-300 bg-amber-100 px-1"
                data-testid="sentence-repeat-partial"
                onClick={() => onRecordSentenceRepeat("partial")}
                type="button"
              >
                Deels
              </button>
              <button
                className="min-h-10 rounded-xl border-2 border-sky-300 bg-sky-100 px-1"
                data-testid="sentence-repeat-help"
                onClick={() => onRecordSentenceRepeat("help")}
                type="button"
              >
                Hulp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ParentObservationSheet.displayName = "ParentObservationSheet";
