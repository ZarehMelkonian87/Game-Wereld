import { Keyboard } from "lucide-react";
import type { FormEvent } from "react";
import { BtnKeyboardClose, BtnKeyboardSubmit, InputSentenceField } from "../../components/ui";

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
          <p className="text-xs font-black uppercase leading-tight text-sky-900">Typ de zin na</p>
          <p className="mt-0.5 text-[0.68rem] font-bold leading-tight text-slate-600">
            De grijze letters worden groen als je ze goed typt.
          </p>
        </div>
      </div>
      {/* Overtyp-veld (T-54): de zin blijft als spookletters staan en wordt
          letter voor letter ingevuld; geen aparte voorbeeldregel meer. */}
      <InputSentenceField
        className="mt-2"
        data-testid="typed-command-input"
        onChange={onValueChange}
        onSubmit={() => {
          if (value.trim()) {
            onSubmit(value.trim());
          }
        }}
        targetText={exampleText}
        value={value}
      />
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
