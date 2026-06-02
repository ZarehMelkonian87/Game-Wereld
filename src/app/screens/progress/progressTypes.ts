export interface SkillProgress {
  change?: number;
  name: string;
  percentage: number;
  previousPercentage?: number;
}

export interface ThemeProgress {
  periodProgress: {
    challenges: string[];
    strengths: string[];
  };
  skills: SkillProgress[];
  themeId: string;
}

export type TimePeriod = "week" | "month" | "3months" | "alltime";

export interface PeriodDefinition {
  id: TimePeriod;
  label: string;
  shortLabel: string;
}
