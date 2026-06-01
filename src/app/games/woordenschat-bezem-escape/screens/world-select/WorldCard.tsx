import { classNames } from "../../components/ui/classNames";
import type { WorldDefinition } from "../../types";
import type { DevtoolsComponent } from "./devtools";
import { StatusChip } from "./StatusChip";
import { LockedBadge, SelectedBadge } from "./WorldBadges";
import { WorldIcon } from "./WorldIcon";
import { cardToneClasses } from "./worldSelectStyles";

interface WorldCardProps {
  onSelect: (world: WorldDefinition) => void;
  selected: boolean;
  world: WorldDefinition;
}

export const WorldCard: DevtoolsComponent<WorldCardProps> = ({ onSelect, selected, world }) => {
  const isOpen = world.status === "open";
  const toneClass = cardToneClasses[world.theme.cardTone] ?? cardToneClasses.beach;

  return (
    <button
      type="button"
      aria-pressed={selected || undefined}
      aria-label={`${world.title}, ${isOpen ? "open" : "komt later"}`}
      className={classNames(
        "relative min-h-[9.75rem] min-w-0 overflow-hidden rounded-[1.35rem] border-[4px] border-white bg-gradient-to-br p-3 text-left text-slate-800 shadow-[0_6px_0_rgba(21,48,74,0.15)] transition active:translate-y-0.5 active:shadow-none landscape:min-h-0",
        toneClass,
        selected &&
          "border-[5px] shadow-[0_7px_0_rgba(21,48,74,0.18),0_0_0_4px_rgba(52,211,153,0.38)]",
        !isOpen && "opacity-85",
      )}
      data-component="WorldCard"
      data-selected={selected}
      data-testid={`world-card-${world.id}`}
      data-world-id={world.id}
      data-world-status={world.status}
      onClick={() => onSelect(world)}
    >
      {selected ? <SelectedBadge /> : null}
      {!isOpen ? <LockedBadge /> : null}

      <WorldIcon icon={world.icon} />

      <div className="absolute bottom-3 left-3 right-2" data-slot="content">
        <h2 className="truncate text-lg font-black leading-none text-slate-800" data-slot="title">
          {world.title}
        </h2>
        <div className="mt-2" data-slot="status">
          <StatusChip selected={selected} status={world.status} />
        </div>
      </div>
    </button>
  );
};

WorldCard.displayName = "WorldCard";
