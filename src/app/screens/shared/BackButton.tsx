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
    className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 ${variantClasses[variant]}`}
    data-component="BackButton"
    onClick={onClick}
    type="button"
  >
    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
  </button>
);

BackButton.displayName = "BackButton";
