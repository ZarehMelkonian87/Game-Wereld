import React, { useId, useMemo } from "react";

/**
 * @uxId INPUT_SENTENCE_FIELD
 * @screens SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Overtyp-veld (T-54): de doelzin blijft als spookletters staan en
 * wordt letter voor letter ingevuld terwijl het kind typt — goed = groen, fout =
 * zacht rood, volgende letter = cursorblokje. Zo ziet een kind precies wat het
 * moet overtypen. Vrij typen (een eigen, langere zin) blijft mogelijk.
 */
export interface InputSentenceFieldProps {
  className?: string;
  "data-testid"?: string;
  onChange: (value: string) => void;
  /** Enter bevestigt de zin (Shift+Enter doet niets: één regel). */
  onSubmit?: () => void;
  /** De zin die het kind na moet typen; staat als spookletters in het veld. */
  targetText: string;
  value: string;
}

export type SentenceLetterState = "extra" | "ghost" | "next" | "typed-ok" | "typed-wrong";

export interface SentenceLetter {
  char: string;
  state: SentenceLetterState;
}

// Accenten tellen niet mee (é = e) en hoofdletters ook niet: een kind dat
// "zet" typt voor "Zet" heeft de letter gewoon goed.
const normalizeLetter = (char: string) =>
  char.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/**
 * Bepaalt per positie welke letter getoond wordt en in welke staat. Getypte
 * letters worden altijd getoond zoals ze getypt zijn (zodat de laag exact over
 * de echte invoer valt); daarna volgen de nog te typen spookletters.
 */
export const resolveSentenceLetters = (targetText: string, value: string): SentenceLetter[] => {
  const letters: SentenceLetter[] = [];
  const length = Math.max(targetText.length, value.length);
  for (let index = 0; index < length; index += 1) {
    const typed = value[index];
    const expected = targetText[index];
    if (typed !== undefined) {
      if (expected === undefined) {
        letters.push({ char: typed, state: "extra" });
      } else {
        letters.push({
          char: typed,
          state: normalizeLetter(typed) === normalizeLetter(expected) ? "typed-ok" : "typed-wrong",
        });
      }
    } else if (expected !== undefined) {
      letters.push({ char: expected, state: index === value.length ? "next" : "ghost" });
    }
  }
  return letters;
};

const letterClassNames: Record<SentenceLetterState, string> = {
  extra: "text-slate-700",
  ghost: "text-slate-400",
  next: "rounded-sm bg-sky-200/90 text-sky-950 underline decoration-2 underline-offset-4",
  "typed-ok": "text-emerald-600",
  "typed-wrong": "rounded-sm bg-rose-100 text-rose-500",
};

// Dezelfde typografie voor de letterlaag én de (onzichtbare) textarea, anders
// vallen de letters niet exact over elkaar.
const sharedTextClassName =
  "whitespace-pre-wrap break-words px-3 py-2.5 text-[1.15rem] font-black leading-[1.7] tracking-[0.03em]";

export const InputSentenceField: React.FC<InputSentenceFieldProps> = ({
  className = "",
  "data-testid": testId,
  onChange,
  onSubmit,
  targetText,
  value,
}) => {
  const hintId = useId();
  const letters = useMemo(() => resolveSentenceLetters(targetText, value), [targetText, value]);
  const correctCount = letters.filter((letter) => letter.state === "typed-ok").length;

  return (
    <div
      className={`relative min-h-14 w-full rounded-2xl border-2 border-sky-300 bg-white shadow-inner transition-colors focus-within:border-sky-600 focus-within:ring-4 focus-within:ring-sky-200 ${className}`}
      data-component="InputSentenceField"
      data-correct-count={correctCount}
      data-target-length={targetText.length}
      data-typed-count={value.length}
    >
      <div aria-hidden="true" className={sharedTextClassName} data-slot="sentence-letters">
        {letters.map((letter, index) => (
          <span
            className={letterClassNames[letter.state]}
            data-letter-state={letter.state}
            key={`${index}-${letter.char}`}
          >
            {letter.char}
          </span>
        ))}
        {/* Onzichtbare cursor houdt de hoogte gelijk aan een lege textarea. */}
        {letters.length === 0 ? "\u00a0" : null}
      </div>
      <span className="sr-only" id={hintId}>
        Typ deze zin na: {targetText}
      </span>
      <textarea
        aria-describedby={hintId}
        aria-label="Typ de zin na"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className={`absolute inset-0 h-full w-full resize-none overflow-hidden rounded-2xl border-0 bg-transparent text-transparent caret-sky-600 outline-none ${sharedTextClassName}`}
        data-testid={testId}
        onChange={(event) => onChange(event.target.value.replace(/[\r\n]+/g, " "))}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            if (!event.shiftKey) {
              onSubmit?.();
            }
          }
        }}
        rows={1}
        spellCheck={false}
        value={value}
      />
    </div>
  );
};

InputSentenceField.displayName = "InputSentenceField";
