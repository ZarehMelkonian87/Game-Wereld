import React from "react";

/**
 * @uxId INPUT_SENTENCE_FIELD
 * @screens SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Tekstinvoerveld waarin zinnen handmatig getypt kunnen worden.
 */
export interface InputSentenceFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const InputSentenceField: React.FC<InputSentenceFieldProps> = ({
  value,
  onChange,
  placeholder = "Typ de zin hier...",
  className = "",
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-2xl bg-white border-2 border-sky-400 focus:border-sky-600 focus:outline-none text-slate-800 font-semibold shadow-inner transition-colors ${className}`}
    />
  );
};
