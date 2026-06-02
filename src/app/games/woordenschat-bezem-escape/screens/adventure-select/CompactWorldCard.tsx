import { classNames } from "../../components/ui/classNames";
import type { WorldDefinition } from "../../types";
import { LockedBadge, SelectedBadge } from "../world-select/WorldBadges";
import { WorldIcon } from "../world-select/WorldIcon";
import { cardToneClasses } from "../world-select/worldSelectStyles";
import type { DevtoolsComponent } from "./devtools";

interface CompactWorldCardProps {
  onSelect: (world: WorldDefinition) => void;
  selected: boolean;
  world: WorldDefinition;
}

export const CompactWorldCard: DevtoolsComponent<CompactWorldCardProps> = ({
  onSelect,
  selected,
  world,
}: CompactWorldCardProps) => {
  const isOpen = world.status === "open";
  const toneClass = cardToneClasses[world.theme.cardTone] ?? cardToneClasses.beach;

  return (
    <button
      type="button"
      aria-pressed={selected || undefined}
      aria-label={`${world.title}, ${isOpen ? "open" : "gesloten"}`}
      className={classNames(
        "isolate relative flex min-h-[4.8rem] min-w-0 touch-manipulation flex-col justify-between overflow-hidden rounded-[1.15rem] border-[3px] border-white bg-gradient-to-br p-2 text-left text-slate-800 shadow-[0_4px_0_rgba(21,48,74,0.13)] transition active:translate-y-0.5 active:shadow-none",
        toneClass,
        selected &&
          "border-[4px] shadow-[0_5px_0_rgba(21,48,74,0.16),0_0_0_3px_rgba(52,211,153,0.38)]",
      )}
      data-component="CompactWorldCard"
      data-selected={selected}
      data-testid={`compact-world-card-${world.id}`}
      data-world-id={world.id}
      data-world-status={world.status}
      onClick={() => onSelect(world)}
    >
      {!isOpen ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-white/42"
          data-slot="locked-background-softener"
        />
      ) : null}
      {selected ? <SelectedBadge /> : null}
      {!isOpen ? <LockedBadge /> : null}
      <span className="relative z-10" data-slot="world-icon-wrap">
        <WorldIcon icon={world.icon} />
      </span>
      <span
        className="relative z-10 block max-w-full truncate text-[0.82rem] font-black leading-none text-slate-900"
        data-slot="title"
      >
        {world.title}
      </span>
      {isOpen ? (
        <span
          className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2 py-1 text-[0.58rem] font-black leading-none text-emerald-700 shadow-sm"
          data-slot="open-chip"
        >
          Open
        </span>
      ) : null}
    </button>
  );
};

CompactWorldCard.displayName = "CompactWorldCard";
