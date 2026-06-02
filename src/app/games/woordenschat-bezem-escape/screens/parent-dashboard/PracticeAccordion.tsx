import { ChevronDown } from "lucide-react";
import { PanelCard } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";
import { DashboardRowList } from "./DashboardRowList";
import { CompactStatusBadge } from "./statusDisplay";
import type { DashboardAccordionSection } from "./types";

interface PracticeAccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  section: DashboardAccordionSection;
}

export const PracticeAccordion = ({
  isOpen,
  onToggle,
  section,
}: PracticeAccordionProps) => {
  const contentId = `dashboard-section-${section.id}`;

  return (
    <PanelCard
      className="overflow-hidden !rounded-2xl !p-0"
      data-component="PracticeAccordion"
      data-section-id={section.id}
    >
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        className="grid min-h-[3.5rem] w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-2 px-3 py-2 text-left active:translate-y-0.5"
        data-testid={`dashboard-accordion-${section.id}`}
        onClick={onToggle}
        type="button"
      >
        <span
          aria-hidden="true"
          className="grid h-9 w-9 place-items-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-700"
        >
          {section.icon}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-black leading-tight text-slate-900">
            {section.title}
          </span>
          <span className="mt-0.5 block truncate text-[0.7rem] font-bold leading-tight text-slate-600">
            {section.summary}
          </span>
        </span>
        <CompactStatusBadge status={section.status} />
        <ChevronDown
          aria-hidden="true"
          className={classNames(
            "h-5 w-5 text-slate-700 transition-transform motion-reduce:transition-none",
            isOpen && "rotate-180",
          )}
          strokeWidth={3}
        />
      </button>

      <div
        aria-hidden={!isOpen}
        className={classNames(
          "overflow-hidden transition-[max-height,opacity] duration-200 motion-reduce:transition-none",
          isOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0",
        )}
        data-testid={`dashboard-accordion-content-${section.id}`}
        id={contentId}
      >
        <div className="border-t-2 border-white/70 p-2.5 pt-2">
          <DashboardRowList rows={section.rows} />
        </div>
      </div>
    </PanelCard>
  );
};

PracticeAccordion.displayName = "PracticeAccordion";
