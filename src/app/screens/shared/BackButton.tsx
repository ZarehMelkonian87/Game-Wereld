import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  onClick: () => void;
  variant?: "dark" | "light";
}

const variantClasses = {
  dark: "bg-slate-700/80 active:bg-slate-600 border-slate-500 text-cyan-300",
  light: "bg-black/20 active:bg-black/30 border-white/20 text-white",
};

export const BackButton = ({ label = "Terug", onClick, variant = "dark" }: BackButtonProps) => (
  <button
    aria-label={label}
    className={`inline-flex min-h-12 min-w-12 touch-manipulation items-center justify-center rounded-lg border-2 p-2.5 outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:rounded-xl sm:p-3 ${variantClasses[variant]}`}
    data-component="BackButton"
    onClick={onClick}
    type="button"
  >
    <ArrowLeft aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
  </button>
);

BackButton.displayName = "BackButton";
