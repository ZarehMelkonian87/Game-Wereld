import type { ReactNode } from "react";

export type ObservationStatus = "gaat-goed" | "met-hulp" | "nog-moeilijk" | "oefenen";

export interface DashboardRow {
  detail: string;
  label: string;
  status: ObservationStatus;
}

export interface DashboardStat {
  label: string;
  value: number;
}

export interface DashboardAccordionSection {
  icon: ReactNode;
  id: string;
  rows: DashboardRow[];
  status: ObservationStatus;
  summary: string;
  title: string;
}
