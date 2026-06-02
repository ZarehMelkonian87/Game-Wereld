import { Check, LockKeyhole } from "lucide-react";
import type { DevtoolsComponent } from "./devtools";

export const SelectedBadge: DevtoolsComponent = () => (
  <span
    className="absolute right-2 top-2 z-20 grid h-8 w-8 place-items-center rounded-full border-[3px] border-white bg-emerald-400 text-white shadow-[0_3px_0_rgba(21,48,74,0.16)]"
    data-component="SelectedBadge"
  >
    <Check className="h-5 w-5" strokeWidth={4} />
  </span>
);

SelectedBadge.displayName = "SelectedBadge";

export const LockedBadge: DevtoolsComponent = () => (
  <span
    className="absolute right-2 top-2 z-20 grid h-8 w-8 place-items-center rounded-full border-[3px] border-white bg-amber-100 text-slate-700 shadow-[0_3px_0_rgba(21,48,74,0.16)]"
    data-component="LockedBadge"
  >
    <LockKeyhole className="h-4 w-4" strokeWidth={3} />
  </span>
);

LockedBadge.displayName = "LockedBadge";
