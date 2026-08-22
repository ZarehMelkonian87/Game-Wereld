import { X } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent } from "react";

interface ConfirmResetDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const ConfirmResetDialog = ({ onCancel, onConfirm }: ConfirmResetDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    ).filter((element) => !element.hasAttribute("disabled"));

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/38 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-[2px] sm:items-center"
      data-component="ConfirmResetDialog"
      data-testid="settings-confirm-reset-dialog"
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        aria-labelledby="settings-reset-dialog-title"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-[1.6rem] border-[4px] border-white bg-white/96 p-4 text-slate-900 shadow-[0_8px_0_rgba(15,23,42,0.18)]"
        ref={dialogRef}
        role="dialog"
      >
        <button
          aria-label="Sluiten"
          className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-2xl border-2 border-slate-200 bg-white text-slate-700 shadow-[0_2px_0_rgba(15,23,42,0.14)] outline-none active:translate-y-0.5 focus-visible:ring-4 focus-visible:ring-sky-200 motion-reduce:transform-none"
          onClick={onCancel}
          type="button"
        >
          <X className="h-5 w-5" strokeWidth={3} />
        </button>

        <h2
          className="pr-12 text-xl font-black leading-tight text-slate-900"
          id="settings-reset-dialog-title"
        >
          Voortgang resetten?
        </h2>
        <p className="mt-2 text-sm font-bold leading-snug text-slate-700">
          Weet je zeker dat je alle voortgang wilt wissen? Dit kan niet ongedaan worden gemaakt.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            className="min-h-12 rounded-2xl border-2 border-emerald-600 bg-emerald-500 px-3 text-sm font-black leading-none text-white shadow-[0_4px_0_rgba(4,120,87,0.65)] active:translate-y-0.5 active:shadow-none"
            data-testid="settings-cancel-reset-button"
            onClick={onCancel}
            ref={cancelButtonRef}
            type="button"
          >
            Annuleren
          </button>
          <button
            className="min-h-12 rounded-2xl border-2 border-rose-600 bg-rose-500 px-3 text-sm font-black leading-none text-white shadow-[0_4px_0_rgba(190,18,60,0.55)] active:translate-y-0.5 active:shadow-none"
            data-testid="settings-confirm-reset-button"
            onClick={onConfirm}
            type="button"
          >
            Resetten
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmResetDialog.displayName = "ConfirmResetDialog";
