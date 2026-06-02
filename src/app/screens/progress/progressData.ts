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
      language: {
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
      math: {
        skills: [
          { name: "Getallen herkennen", percentage: 82, previousPercentage: 79, change: 3 },
          { name: "Optellen tot 10", percentage: 71, previousPercentage: 68, change: 3 },
          { name: "Aftrekken tot 10", percentage: 58, previousPercentage: 56, change: 2 },
          { name: "Tellen tot 20", percentage: 88, previousPercentage: 86, change: 2 },
          { name: "Getallen vergelijken", percentage: 65, previousPercentage: 64, change: 1 },
        ],
        periodProgress: {
          challenges: ["Aftrekken kan sneller"],
          strengths: ["+3% in optellen", "Goed bezig met tellen"],
        },
      },
      memory: {
        skills: [
          { name: "Korte termijn geheugen", percentage: 76, previousPercentage: 74, change: 2 },
          { name: "Patronen herkennen", percentage: 69, previousPercentage: 67, change: 2 },
          { name: "Volgorde onthouden", percentage: 55, previousPercentage: 54, change: 1 },
          { name: "Plaatjes onthouden", percentage: 81, previousPercentage: 78, change: 3 },
        ],
        periodProgress: {
          challenges: ["Volgorde blijft uitdagend"],
          strengths: ["+3% beter in plaatjes", "Geheugen groeit constant"],
        },
      },
    },
    month: {
      language: {
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
      math: {
        skills: [
          { name: "Getallen herkennen", percentage: 82, previousPercentage: 67, change: 15 },
          { name: "Optellen tot 10", percentage: 71, previousPercentage: 56, change: 15 },
          { name: "Aftrekken tot 10", percentage: 58, previousPercentage: 48, change: 10 },
          { name: "Tellen tot 20", percentage: 88, previousPercentage: 75, change: 13 },
          { name: "Getallen vergelijken", percentage: 65, previousPercentage: 60, change: 5 },
        ],
        periodProgress: {
          challenges: ["Aftrekken vraagt meer oefening"],
          strengths: ["+15% beter in optellen", "Tellen tot 20 bijna perfect!"],
        },
      },
      memory: {
        skills: [
          { name: "Korte termijn geheugen", percentage: 76, previousPercentage: 65, change: 11 },
          { name: "Patronen herkennen", percentage: 69, previousPercentage: 58, change: 11 },
          { name: "Volgorde onthouden", percentage: 55, previousPercentage: 48, change: 7 },
          { name: "Plaatjes onthouden", percentage: 81, previousPercentage: 70, change: 11 },
        ],
        periodProgress: {
          challenges: ["Volgorde onthouden kan nog groeien"],
          strengths: ["+11% beter in plaatjes onthouden", "Patronen gaan steeds beter"],
        },
      },
    },
    "3months": {
      language: {
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
      math: {
        skills: [
          { name: "Getallen herkennen", percentage: 82, previousPercentage: 52, change: 30 },
          { name: "Optellen tot 10", percentage: 71, previousPercentage: 41, change: 30 },
          { name: "Aftrekken tot 10", percentage: 58, previousPercentage: 33, change: 25 },
          { name: "Tellen tot 20", percentage: 88, previousPercentage: 60, change: 28 },
          { name: "Getallen vergelijken", percentage: 65, previousPercentage: 45, change: 20 },
        ],
        periodProgress: {
          challenges: ["Blijf oefenen met aftrekken"],
          strengths: ["+30% in getallen herkennen", "+30% in optellen", "Fantastische groei!"],
        },
      },
      memory: {
        skills: [
          { name: "Korte termijn geheugen", percentage: 76, previousPercentage: 50, change: 26 },
          { name: "Patronen herkennen", percentage: 69, previousPercentage: 43, change: 26 },
          { name: "Volgorde onthouden", percentage: 55, previousPercentage: 35, change: 20 },
          { name: "Plaatjes onthouden", percentage: 81, previousPercentage: 55, change: 26 },
        ],
        periodProgress: {
          challenges: ["Volgorde onthouden kan nog beter"],
          strengths: ["+26% groei in meerdere skills", "Geweldige ontwikkeling"],
        },
      },
    },
    alltime: {
      language: {
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
      math: {
        skills: [
          { name: "Getallen herkennen", percentage: 82, previousPercentage: 25, change: 57 },
          { name: "Optellen tot 10", percentage: 71, previousPercentage: 15, change: 56 },
          { name: "Aftrekken tot 10", percentage: 58, previousPercentage: 10, change: 48 },
          { name: "Tellen tot 20", percentage: 88, previousPercentage: 30, change: 58 },
          { name: "Getallen vergelijken", percentage: 65, previousPercentage: 20, change: 45 },
        ],
        periodProgress: {
          challenges: ["Blijf rekenen oefenen"],
          strengths: ["+58% in tellen!", "+57% in getallen", "Van start naar ster!"],
        },
      },
      memory: {
        skills: [
          { name: "Korte termijn geheugen", percentage: 76, previousPercentage: 25, change: 51 },
          { name: "Patronen herkennen", percentage: 69, previousPercentage: 20, change: 49 },
          { name: "Volgorde onthouden", percentage: 55, previousPercentage: 15, change: 40 },
          { name: "Plaatjes onthouden", percentage: 81, previousPercentage: 30, change: 51 },
        ],
        periodProgress: {
          challenges: ["Blijf je geheugen trainen"],
          strengths: ["+51% geheugen groei!", "Geweldige ontwikkeling", "Super trots!"],
        },
      },
    },
  };

  return [
    { themeId: "language", ...baseData[period].language },
    { themeId: "math", ...baseData[period].math },
    { themeId: "memory", ...baseData[period].memory },
  ];
};
