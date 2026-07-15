import type { PeriodDefinition, ThemeProgress, TimePeriod } from "./progressTypes";

export const periods: PeriodDefinition[] = [
  { id: "week", label: "Deze Week", shortLabel: "Week" },
  { id: "month", label: "Deze Maand", shortLabel: "Maand" },
  { id: "3months", label: "3 Maanden", shortLabel: "3M" },
  { id: "alltime", label: "Sinds Begin", shortLabel: "Alles" },
];

export const getProgressData = (period: TimePeriod): ThemeProgress[] => {
  const baseData = {
    week: {
      vocabulary: {
        skills: [
          { name: "Woordenschat begrijpen", percentage: 68, previousPercentage: 65, change: 3 },
          { name: "Actieve woordenschat", percentage: 52, previousPercentage: 50, change: 2 },
          { name: "Zinnen begrijpen", percentage: 61, previousPercentage: 59, change: 2 },
          { name: "Zinnen herhalen", percentage: 44, previousPercentage: 44, change: 0 },
          { name: "Aanwijzingen volgen", percentage: 73, previousPercentage: 70, change: 3 },
          { name: "Woordcategorieën", percentage: 58, previousPercentage: 56, change: 2 },
        ],
        periodProgress: {
          challenges: ["Zinnen herhalen blijft stabiel"],
          strengths: ["+3 nieuwe woorden deze week", "Aanwijzingen volgen beter"],
        },
      },
    },
    month: {
      vocabulary: {
        skills: [
          { name: "Woordenschat begrijpen", percentage: 68, previousPercentage: 56, change: 12 },
          { name: "Actieve woordenschat", percentage: 52, previousPercentage: 44, change: 8 },
          { name: "Zinnen begrijpen", percentage: 61, previousPercentage: 53, change: 8 },
          { name: "Zinnen herhalen", percentage: 44, previousPercentage: 43, change: 1 },
          { name: "Aanwijzingen volgen", percentage: 73, previousPercentage: 61, change: 12 },
          { name: "Woordcategorieën", percentage: 58, previousPercentage: 50, change: 8 },
        ],
        periodProgress: {
          challenges: ["Zinnen herhalen blijft moeilijk"],
          strengths: ["+12 nieuwe woorden sterk", "+8% beter in plaatswoorden"],
        },
      },
    },
    "3months": {
      vocabulary: {
        skills: [
          { name: "Woordenschat begrijpen", percentage: 68, previousPercentage: 42, change: 26 },
          { name: "Actieve woordenschat", percentage: 52, previousPercentage: 30, change: 22 },
          { name: "Zinnen begrijpen", percentage: 61, previousPercentage: 38, change: 23 },
          { name: "Zinnen herhalen", percentage: 44, previousPercentage: 35, change: 9 },
          { name: "Aanwijzingen volgen", percentage: 73, previousPercentage: 45, change: 28 },
          { name: "Woordcategorieën", percentage: 58, previousPercentage: 35, change: 23 },
        ],
        periodProgress: {
          challenges: ["Zinnen herhalen groeit langzamer"],
          strengths: ["+28% groei in aanwijzingen volgen", "+26% woordenschat groei", "Enorme vooruitgang!"],
        },
      },
    },
    alltime: {
      vocabulary: {
        skills: [
          { name: "Woordenschat begrijpen", percentage: 68, previousPercentage: 15, change: 53 },
          { name: "Actieve woordenschat", percentage: 52, previousPercentage: 10, change: 42 },
          { name: "Zinnen begrijpen", percentage: 61, previousPercentage: 12, change: 49 },
          { name: "Zinnen herhalen", percentage: 44, previousPercentage: 18, change: 26 },
          { name: "Aanwijzingen volgen", percentage: 73, previousPercentage: 20, change: 53 },
          { name: "Woordcategorieën", percentage: 58, previousPercentage: 15, change: 43 },
        ],
        periodProgress: {
          challenges: ["Blijf oefenen met zinnen"],
          strengths: ["+53% totale groei!", "Van beginner naar gevorderd", "Ongelooflijke reis!"],
        },
      },
    },
  };

  return [
    { themeId: "vocabulary", ...baseData[period].vocabulary },
  ];
};
