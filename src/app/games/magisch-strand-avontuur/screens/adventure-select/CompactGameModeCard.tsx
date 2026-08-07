import { Check, ChevronRight } from "lucide-react";
import { classNames } from "../../components/ui/classNames";
import type { BezemEscapeMode } from "../../types";
import type { AdventureModeOption } from "./adventureModeOptions";
import { adventureModeToneClasses } from "./adventureSelectStyles";
import type { DevtoolsComponent } from "./devtools";

interface CompactGameModeCardProps {
  mode: AdventureModeOption;
  onSelectMode: (modeId: BezemEscapeMode) => void;
  selected: boolean;
}

export const CompactGameModeCard: DevtoolsComponent<CompactGameModeCardProps> = ({
  mode,
  onSelectMode,
  selected,
}: CompactGameModeCardProps) => {
  const toneClasses = adventureModeToneClasses[mode.tone];
  const disabled = mode.disabled === true;

  return (
    <button
      type="button"
      aria-label={mode.title}
      aria-pressed={selected || undefined}
      className={classNames(
        "relative grid min-h-[5.25rem] touch-manipulation grid-cols-[3.25rem_minmax(0,1fr)_2rem] items-center gap-2 overflow-hidden rounded-[1.25rem] border-[4px] border-white bg-gradient-to-br p-2.5 text-left text-slate-900 shadow-[0_4px_0_rgba(21,48,74,0.13)] transition active:translate-y-0.5 active:shadow-none",
        toneClasses.root,
        selected && `border-emerald-300 ${toneClasses.selected}`,
        disabled && "opacity-72 grayscale-[0.12]",
      )}
      data-component="CompactGameModeCard"
      data-disabled={disabled}
      data-mode-id={mode.id}
      data-selected={selected}
      data-testid={`compact-mode-card-${mode.id}`}
      disabled={disabled}
      onClick={() => onSelectMode(mode.id)}
    >
      <span
        className={classNames(
          "grid h-12 w-12 place-items-center rounded-[1rem] border-[3px] border-white shadow-[0_3px_0_rgba(21,48,74,0.1)]",
          toneClasses.icon,
        )}
        data-slot="icon"
      >
        {mode.icon}
      </span>

      <span className="min-w-0" data-slot="content">
        <span
          className="block truncate text-[1rem] font-black leading-none text-slate-900"
          data-slot="title"
        >
          {mode.title}
        </span>
        <span
          className="mt-1 block text-[0.7rem] font-black leading-tight text-slate-700"
          data-slot="description"
        >
          {mode.description}
        </span>
        {mode.lockedLabel ? (
          <span
            className="mt-1.5 inline-flex min-h-5 items-center rounded-full bg-white/90 px-2 text-[0.62rem] font-black leading-none text-slate-700 shadow-sm"
            data-slot="locked-label"
          >
            {mode.lockedLabel}
          </span>
        ) : null}
      </span>

      <span
        className={classNames(
          "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 shadow-sm transition-colors",
          selected
            ? "border-emerald-400 bg-emerald-500 text-white"
            : "border-white bg-white/85 text-slate-700",
        )}
        data-slot="selection"
      >
        {selected ? (
          <Check className="h-5 w-5 shrink-0 text-white" strokeWidth={3} />
        ) : (
          <ChevronRight className="h-5 w-5 shrink-0 text-slate-700" strokeWidth={3} />
        )}
      </span>
    </button>
  );
};

CompactGameModeCard.displayName = "CompactGameModeCard";
