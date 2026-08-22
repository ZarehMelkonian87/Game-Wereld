import { createGameId, createProfileId } from "../../game-platform";
import {
  projectPracticeEvents,
  type PracticeEventEnvelope,
  type ProgressProjection,
} from "../../storage";
import { getGameRegistryEntry } from "../../games";
import type { PeriodDefinition, ThemeProgress, TimePeriod } from "./progressTypes";

export const periods: PeriodDefinition[] = [
  { id: "week", label: "Deze Week", shortLabel: "Week" },
  { id: "month", label: "Deze Maand", shortLabel: "Maand" },
  { id: "3months", label: "3 Maanden", shortLabel: "3M" },
  { id: "alltime", label: "Sinds Begin", shortLabel: "Alles" },
];

export const getPeriodStart = (period: TimePeriod, now: Date): string | undefined => {
  if (period === "alltime") return undefined;
  const days = period === "week" ? 7 : period === "month" ? 30 : 90;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
};

export const filterEventsForPeriod = (
  period: TimePeriod,
  events: PracticeEventEnvelope[],
  now = new Date(),
) => {
  const from = getPeriodStart(period, now);
  return from ? events.filter((event) => event.occurredAt >= from) : events;
};

const percentage = (value: number, total: number) =>
  total === 0 ? 0 : Math.round((value / total) * 100);

const toThemeProgress = (projection: ProgressProjection, themeId: string): ThemeProgress => {
  const correct = projection.independentCorrect + projection.supportedCorrect;
  const strengths: string[] = [];
  const nextSteps: string[] = [];

  if (projection.independentCorrect > 0) {
    strengths.push(
      `${projection.independentCorrect} van ${projection.attempts} pogingen lukten zonder geregistreerde hulp.`,
    );
  }
  if (projection.supportedCorrect > 0) {
    strengths.push(
      `${projection.supportedCorrect} pogingen lukten met een herhaling, visuele hint of gesproken hulp.`,
    );
  }
  if (projection.incorrect > 0 || projection.skipped > 0) {
    nextSteps.push(
      `${projection.incorrect + projection.skipped} pogingen kunnen opnieuw worden geoefend.`,
    );
  }
  if (strengths.length === 0) strengths.push("Er zijn oefenpogingen geregistreerd.");
  if (nextSteps.length === 0) nextSteps.push("Blijf gevarieerd oefenen.");

  return {
    evidence: {
      eventCount: projection.sourceSelection.eventCount,
      projectorVersion: projection.projectorVersion,
    },
    periodProgress: { challenges: nextSteps, strengths },
    skills: [
      {
        name: "Zonder geregistreerde hulp gelukt",
        percentage: percentage(projection.independentCorrect, projection.attempts),
      },
      {
        name: "Totaal gelukt",
        percentage: percentage(correct, projection.attempts),
      },
      {
        name: "Zonder visuele hint geoefend",
        percentage: percentage(
          Math.max(0, projection.attempts - projection.hintsUsed),
          projection.attempts,
        ),
      },
    ],
    themeId,
  };
};

export const getProgressData = (
  period: TimePeriod,
  events: PracticeEventEnvelope[],
  now = new Date(),
): ThemeProgress[] => {
  const periodEvents = filterEventsForPeriod(period, events, now);
  const eventsByGame = new Map<string, PracticeEventEnvelope[]>();
  periodEvents.forEach((event) => {
    eventsByGame.set(event.gameId, [...(eventsByGame.get(event.gameId) ?? []), event]);
  });
  return [...eventsByGame.entries()].flatMap(([gameId, gameEvents]) => {
    const first = gameEvents[0];
    const entry = getGameRegistryEntry(gameId);
    if (!first || !entry) return [];
    const projection = projectPracticeEvents({
      calculatedAt: now.toISOString(),
      events: gameEvents,
      gameId: createGameId(gameId),
      profileId: createProfileId(first.profileId),
      selection: {
        fromOccurredAt: getPeriodStart(period, now),
        throughOccurredAt: now.toISOString(),
      },
    });
    return [toThemeProgress(projection, entry.manifest.themeId)];
  });
};
