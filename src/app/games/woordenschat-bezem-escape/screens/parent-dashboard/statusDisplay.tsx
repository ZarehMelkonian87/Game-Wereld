import { AlertTriangle, Check, Dumbbell, HandHelping } from "lucide-react";
import { classNames } from "../../components/ui/classNames";
import type { ObservationStatus } from "./types";

export const statusLabels: Record<ObservationStatus, string> = {
  "gaat-goed": "Gaat goed",
  "met-hulp": "Met hulp",
  "nog-moeilijk": "Nog moeilijk",
  oefenen: "Oefenen",
};

export const compactStatusLabels: Record<ObservationStatus, string> = {
  "gaat-goed": "Goed",
  "met-hulp": "Hulp",
  "nog-moeilijk": "Moeilijk",
  oefenen: "Oefen",
};

const statusIconClasses: Record<ObservationStatus, string> = {
  "gaat-goed": "border-emerald-300 bg-emerald-100 text-emerald-800",
  "met-hulp": "border-sky-300 bg-sky-100 text-sky-800",
  "nog-moeilijk": "border-amber-300 bg-amber-100 text-amber-800",
  oefenen: "border-violet-300 bg-violet-100 text-violet-800",
};

const getStatusIcon = (status: ObservationStatus) => {
  if (status === "gaat-goed") {
    return <Check className="h-3.5 w-3.5" strokeWidth={4} />;
  }

  if (status === "met-hulp") {
    return <HandHelping className="h-3.5 w-3.5" strokeWidth={3.2} />;
  }

  if (status === "nog-moeilijk") {
    return <AlertTriangle className="h-3.5 w-3.5" strokeWidth={3.2} />;
  }

  return <Dumbbell className="h-3.5 w-3.5" strokeWidth={3.2} />;
};

interface StatusProps {
  status: ObservationStatus;
}

export const CompactStatusBadge = ({ status }: StatusProps) => (
  <span
    aria-label={statusLabels[status]}
    className={classNames(
      "inline-flex min-h-7 shrink-0 items-center gap-1 rounded-full border-2 px-2 text-[0.65rem] font-black leading-none",
      statusIconClasses[status],
    )}
    data-component="CompactStatusBadge"
    data-status={status}
    title={statusLabels[status]}
  >
    {getStatusIcon(status)}
    <span>{compactStatusLabels[status]}</span>
  </span>
);

CompactStatusBadge.displayName = "CompactStatusBadge";

export const StatusIcon = ({ status }: StatusProps) => (
  <span
    aria-label={statusLabels[status]}
    className={classNames(
      "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2",
      statusIconClasses[status],
    )}
    data-component="StatusIcon"
    data-status={status}
    title={statusLabels[status]}
  >
    {getStatusIcon(status)}
  </span>
);

StatusIcon.displayName = "StatusIcon";
