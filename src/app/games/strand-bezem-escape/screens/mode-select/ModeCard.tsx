import type { ReactNode } from "react";
import { classNames } from "../../components/ui/classNames";
import type { DevtoolsComponent } from "./devtools";
import { modeCardToneClasses, type ModeCardTone } from "./modeSelectStyles";

interface ModeCardProps {
  description: string;
  disabled?: boolean;
  icon: ReactNode;
  id: string;
  lockedLabel?: string;
  onSelect: () => void;
  title: string;
  tone: ModeCardTone;
}

export const ModeCard: DevtoolsComponent<ModeCardProps> = ({
  description,
  disabled = false,
  icon,
  id,
  lockedLabel,
  onSelect,
  title,
  tone,
}) => {
  const toneClasses = modeCardToneClasses[tone];

  return (
    <button
      aria-label={title}
      className={classNames(
        "relative grid min-h-0 grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-3 overflow-hidden rounded-[1.55rem] border-[5px] border-white bg-gradient-to-br p-3 text-left text-slate-900 transition active:translate-y-0.5 active:shadow-none landscape:grid-cols-1 landscape:grid-rows-[4.5rem_minmax(0,1fr)] landscape:content-center landscape:text-center",
        toneClasses.root,
        toneClasses.shadow,
        disabled && "opacity-80 grayscale-[0.15]",
      )}
      data-component="ModeCard"
      data-disabled={disabled}
      data-mode-id={id}
      data-testid={`mode-card-${id}`}
      disabled={disabled}
      onClick={onSelect}
      type="button"
    >
      <span
        className={classNames(
          "grid h-16 w-16 place-items-center rounded-[1.25rem] border-[3px] border-white shadow-[0_4px_0_rgba(21,48,74,0.12)] landscape:mx-auto",
          toneClasses.icon,
        )}
        data-slot="icon"
      >
        {icon}
      </span>

      <span className="min-w-0" data-slot="content">
        <span
          className="block truncate text-[1.15rem] font-black leading-none text-slate-900 landscape:whitespace-normal landscape:text-[1.2rem]"
          data-slot="title"
        >
          {title}
        </span>
        <span
          className="mt-1 block text-[0.78rem] font-black leading-tight text-slate-700"
          data-slot="description"
        >
          {description}
        </span>
        {lockedLabel ? (
          <span
            className="mt-2 inline-flex min-h-7 items-center rounded-full bg-white/90 px-2 text-[0.7rem] font-black leading-none text-slate-700 shadow-sm"
            data-slot="locked-label"
          >
            {lockedLabel}
          </span>
        ) : null}
      </span>
    </button>
  );
};

ModeCard.displayName = "ModeCard";
