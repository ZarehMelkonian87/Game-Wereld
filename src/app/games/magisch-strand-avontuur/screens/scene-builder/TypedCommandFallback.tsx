import { Keyboard } from "lucide-react";
import type { FormEvent } from "react";
import { BtnKeyboardClose, BtnKeyboardSubmit } from "../../components/ui";

interface TypedCommandFallbackProps {
  exampleText: string;
  onClose?: () => void;
  onSubmit: (transcript: string) => void;
  value: string;
  onValueChange: (value: string) => void;
}

export const TypedCommandFallback = ({
  exampleText,
  onClose,
  onSubmit,
  onValueChange,
  value,
}: TypedCommandFallbackProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextTranscript = value.trim();

    if (!nextTranscript) {
      return;
    }

    onSubmit(nextTranscript);
  };

  return (
    <form
      className="rounded-2xl border-2 border-sky-200 bg-white/95 p-3 text-left text-slate-900 shadow-[0_5px_0_rgba(15,23,42,0.12)]"
      data-component="TypedCommandFallback"
      data-testid="typed-command-fallback"
      onSubmit={handleSubmit}
    >
      <div className="flex items-start gap-2">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-700"
        >
          <Keyboard className="h-5 w-5" strokeWidth={3} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase leading-tight text-sky-900">Typ de zin</p>
          <p className="mt-1 text-[0.68rem] font-bold leading-tight text-slate-600">
            Bijvoorbeeld: {exampleText}
          </p>
        </div>
      </div>
      <label className="mt-2 block">
        <span className="sr-only">Typ een opdrachtzin</span>
        <input
          className="min-h-12 w-full rounded-2xl border-2 border-sky-200 bg-white px-3 text-sm font-black text-slate-900 outline-none focus:border-sky-500 focus-visible:ring-4 focus-visible:ring-sky-200"
          data-testid="typed-command-input"
          inputMode="text"
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={exampleText}
          type="text"
          value={value}
        />
      </label>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <BtnKeyboardSubmit data-testid="typed-command-submit-button" type="submit" />
        {onClose ? (
          <BtnKeyboardClose data-testid="typed-command-close-button" onClick={onClose} />
        ) : null}
      </div>
    </form>
  );
};

TypedCommandFallback.displayName = "TypedCommandFallback";
