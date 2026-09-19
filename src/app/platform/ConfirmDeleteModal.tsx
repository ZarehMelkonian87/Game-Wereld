import { useEffect, useRef } from "react";
import { Trash2, X } from "lucide-react";

export interface ConfirmDeleteModalProps {
  gameTitle: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  requiredBytes?: number;
}

const formatMb = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  return mb < 1 ? "< 1 MB" : `${Math.round(mb)} MB`;
};

export const ConfirmDeleteModal = ({
  gameTitle,
  isOpen,
  onCancel,
  onConfirm,
  requiredBytes,
}: ConfirmDeleteModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const sizeText = formatMb(requiredBytes);

  return (
    <div
      aria-labelledby="confirm-delete-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-5 py-4 sm:px-8 sm:py-6 backdrop-blur-md safe-area-inset"
      data-component="ConfirmDeleteModal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      ref={modalRef}
      role="dialog"
    >
      <div className="relative flex w-full max-w-[340px] sm:max-w-[380px] flex-col overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-rose-400/80 bg-gradient-to-b from-slate-900 via-rose-950/40 to-slate-900 p-4 sm:p-5 text-white shadow-[0_12px_40px_rgba(225,29,72,0.25)]">
        <button
          aria-label="Sluiten"
          className="absolute right-2.5 top-2.5 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-800/80 text-slate-300 transition-all duration-150 hover:bg-slate-700 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          onClick={onCancel}
          type="button"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
            <Trash2 aria-hidden="true" className="h-6 w-6" />
          </div>

          <h2 className="mt-2 text-base sm:text-lg font-black text-white" id="confirm-delete-title">
            Spel verwijderen?
          </h2>

          <p className="mt-1.5 max-w-xs text-xs font-semibold text-slate-200">
            Weet je zeker dat je <strong className="text-white">"{gameTitle}"</strong> wilt
            verwijderen?{" "}
            {sizeText
              ? `De opgeslagen bestanden (${sizeText}) worden gewist.`
              : "De offline bestanden worden gewist."}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Je kunt het spel later altijd opnieuw downloaden om offline te spelen.
          </p>

          <div className="mt-4 flex w-full flex-col gap-2">
            <button
              className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-500 bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2 text-sm font-black text-white shadow-md hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              data-slot="confirm-delete-button"
              onClick={onConfirm}
              type="button"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Verwijder gamebestanden
            </button>
            <button
              className="flex min-h-[40px] w-full cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              data-slot="cancel-delete-button"
              onClick={onCancel}
              type="button"
            >
              Annuleren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmDeleteModal.displayName = "ConfirmDeleteModal";
