import React, { useState } from "react";

/**
 * @uxId DROPDOWN_PRIVACY_FAQ
 * @screens SCR_SETTINGS_PRIVACY
 * @description Uitklapbare FAQ knop over het gebruik van de microfoon.
 */
export interface DropdownPrivacyFaqProps {
  question?: string;
  answer?: string;
  className?: string;
}

export const DropdownPrivacyFaq: React.FC<DropdownPrivacyFaqProps> = ({
  question = "Waarom gebruiken we de microfoon?",
  answer = "De microfoon wordt uitsluitend in realtime gebruikt om gesproken strandwoorden te herkennen voor het vliegen en plaatsen van objecten. Er worden geen audio-opnames opgeslagen op een server.",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-sky-100 text-sky-900 font-bold rounded-full border border-sky-300 flex items-center justify-between shadow-sm hover:bg-sky-200 transition-colors"
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-white text-slate-700 text-sm font-medium border border-sky-200 rounded-2xl shadow-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};
