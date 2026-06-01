import { classNames } from "../../components/ui/classNames";
import type { WorldDefinition } from "../../types";
import type { DevtoolsComponent } from "./devtools";

interface StatusChipProps {
  selected: boolean;
  status: WorldDefinition["status"];
}

const getStatusLabel = (status: WorldDefinition["status"]) => {
  if (status === "open") {
    return "Open";
  }

  if (status === "komt_later") {
    return "Komt later";
  }

  return "Gesloten";
};

export const StatusChip: DevtoolsComponent<StatusChipProps> = ({ selected, status }) => (
  <span
    className={classNames(
      "inline-flex min-h-[1.45rem] items-center justify-center rounded-full bg-white/95 px-2.5 text-[0.68rem] font-black leading-none shadow-sm",
      selected ? "text-emerald-700" : "text-slate-700",
    )}
    data-component="StatusChip"
    data-selected={selected}
    data-status={status}
  >
    {getStatusLabel(status)}
  </span>
);

StatusChip.displayName = "StatusChip";
