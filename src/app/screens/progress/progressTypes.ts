export interface SkillProgress {
  change?: number;
  name: string;
  percentage: number;
  previousPercentage?: number;
}

export interface ThemeProgress {
  categoryBreakdown: SkillProgress[];
  evidence: {
    eventCount: number;
    projectorVersion: number;
  };
  periodProgress: {
    challenges: string[];
    strengths: string[];
  };
  skills: SkillProgress[];
  tempo?: {
    averageSeconds: number;
    measuredResponses: number;
  };
  themeId: string;
}

export type TimePeriod = "week" | "month" | "3months" | "alltime";

export interface PeriodDefinition {
  id: TimePeriod;
  label: string;
  shortLabel: string;
}
