import type { PeriodDefinition, ThemeProgress, TimePeriod } from "./progressTypes";
import { readBezemEscapeProgress } from "../../games/strand-bezem-escape/logic/progress";

export const periods: PeriodDefinition[] = [
  { id: "week", label: "Deze Week", shortLabel: "Week" },
  { id: "month", label: "Deze Maand", shortLabel: "Maand" },
  { id: "3months", label: "3 Maanden", shortLabel: "3M" },
  { id: "alltime", label: "Sinds Begin", shortLabel: "Alles" },
];

export const getProgressData = (period: TimePeriod, profileId?: string): ThemeProgress[] => {
  const defaultProfileId = profileId ?? "demo-profile";
  const progressStrand = readBezemEscapeProgress(defaultProfileId);

  const events = [...(progressStrand.attempts ?? [])];

  // Filter events by period
  const now = new Date();
  const periodEvents = events.filter((event) => {
    if (period === "alltime") return true;
    const playedAt = event.playedAt ? new Date(event.playedAt) : new Date();
    const daysLimit = period === "week" ? 7 : period === "month" ? 30 : 90;
    const limitTime = now.getTime() - daysLimit * 24 * 60 * 60 * 1000;
    return playedAt.getTime() >= limitTime;
  });

  const total = periodEvents.length;

  let inEenKeerGoedPct = 0;
  let noHintsPct = 0;
  let spokenPct = 0;

  if (total > 0) {
    const inEenKeerGoedCount = periodEvents.filter(
      (e) => e.attempts === 1 && e.hintsUsed === 0 && e.isCorrect,
    ).length;
    inEenKeerGoedPct = Math.round((inEenKeerGoedCount / total) * 100);

    const noHintsCount = periodEvents.filter((e) => e.hintsUsed === 0).length;
    noHintsPct = Math.round((noHintsCount / total) * 100);

    const spokenEvents = periodEvents.filter((e) => e.mode === "zeg-en-bouw");
    const spokenSuccessCount = spokenEvents.filter((e) => e.isCorrect).length;
    spokenPct =
      spokenEvents.length > 0 ? Math.round((spokenSuccessCount / spokenEvents.length) * 100) : 0;
  }

  // Generate dynamic strengths and challenges
  const strengths: string[] = [];
  const challenges: string[] = [];

  if (total > 0) {
    if (inEenKeerGoedPct > 70) {
      strengths.push("Uitstekende precisie! De meeste stickers stonden direct goed.");
    } else if (inEenKeerGoedPct > 40) {
      strengths.push("Goede nauwkeurigheid bij het plaatsen.");
    } else {
      challenges.push("Probeer rustig naar de opdrachten te luisteren voor het plaatsen.");
    }

    if (noHintsPct > 75) {
      strengths.push("Heel zelfstandig gewerkt zonder hints.");
    } else {
      challenges.push("Gebruik minder hints om je geheugen extra te trainen.");
    }

    if (spokenPct > 50) {
      strengths.push("Sterke prestatie met de spraakgestuurde modus!");
    } else if (spokenPct === 0) {
      challenges.push("Probeer vaker de spreek-modus 'Zeg & Vlieg' te gebruiken.");
    }
  }

  if (strengths.length === 0) {
    strengths.push("Lekker aan het oefenen!");
  }
  if (challenges.length === 0) {
    challenges.push("Blijf zo doorgaan!");
  }

  return [
    {
      themeId: "vocabulary",
      skills: [
        {
          name: "In één keer goed (Foutloosheid)",
          percentage: inEenKeerGoedPct,
          previousPercentage: Math.max(0, inEenKeerGoedPct - 5),
          change: 5,
        },
        {
          name: "Zelfstandig opgelost (Zonder hints)",
          percentage: noHintsPct,
          previousPercentage: Math.max(0, noHintsPct - 3),
          change: 3,
        },
        {
          name: "Goed uitgesproken (Spraak-modus)",
          percentage: spokenPct,
          previousPercentage: Math.max(0, spokenPct - 2),
          change: 2,
        },
      ],
      periodProgress: {
        challenges,
        strengths,
      },
    },
  ];
};
