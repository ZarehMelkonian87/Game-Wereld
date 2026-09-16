import type { SkillProgressSummary } from "../../storage";
import type { SkillProgress } from "./progressTypes";

/**
 * Vertaalt de technische `skillId`'s uit het observatiemodel naar begrijpelijke
 * categorieën voor het voortgangsscherm (T-17). Taaldomeinen en ruimtebegrippen
 * worden elk een eigen categorie; losse woorden (`vocabulary:<woord>`) worden
 * samengevoegd tot één "Woordenschat"-categorie zodat het overzicht niet
 * dichtslibt met één rij per woord. De helper is generiek: onbekende id's
 * krijgen een nette fallback-naam in plaats van te verdwijnen.
 */
const LANGUAGE_DOMAIN_LABELS: Record<string, string> = {
  "active-vocabulary": "Woorden zelf zeggen",
  "concepts-and-directions": "Begrippen & richtingen",
  "following-directions": "Opdrachten opvolgen",
  "receptive-vocabulary": "Woordbegrip (luisteren)",
  "sentence-comprehension": "Zinsbegrip",
  "sentence-repetition": "Zin nazeggen",
  "spatial-language": "Ruimtelijke taal",
  "word-categories": "Woordcategorieën",
  "word-structure": "Woordvorming",
};

const VOCABULARY_WORDS_GROUP = "vocabulary-words";

const prettifyFallback = (skillId: string) => {
  const cleaned = skillId.replace(/[:_-]+/g, " ").trim();
  if (cleaned.length === 0) {
    return skillId;
  }
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

export const describeSkillCategory = (skillId: string): { groupKey: string; label: string } => {
  if (skillId.startsWith("spatial:")) {
    const concept = skillId.slice("spatial:".length);
    return { groupKey: skillId, label: `Ruimtebegrip ‘${concept}’` };
  }

  if (skillId.startsWith("vocabulary:")) {
    return { groupKey: VOCABULARY_WORDS_GROUP, label: "Woordenschat (losse woorden)" };
  }

  const domainLabel = LANGUAGE_DOMAIN_LABELS[skillId];
  if (domainLabel) {
    return { groupKey: skillId, label: domainLabel };
  }

  return { groupKey: skillId, label: prettifyFallback(skillId) };
};

const percentage = (value: number, total: number) =>
  total === 0 ? 0 : Math.round((value / total) * 100);

/**
 * Groepeert de ruwe per-skill-samenvattingen tot categorie-rijen met een
 * "zonder hulp gelukt"-percentage, gesorteerd op meest geoefend eerst.
 */
export const buildCategoryBreakdown = (
  skillSummaries: readonly SkillProgressSummary[],
): SkillProgress[] => {
  const groups = new Map<string, { attempts: number; independentCorrect: number; label: string }>();

  skillSummaries.forEach((summary) => {
    const { groupKey, label } = describeSkillCategory(summary.skillId);
    const current = groups.get(groupKey) ?? { attempts: 0, independentCorrect: 0, label };
    groups.set(groupKey, {
      attempts: current.attempts + summary.attempts,
      independentCorrect: current.independentCorrect + summary.independentCorrect,
      label: current.label,
    });
  });

  return [...groups.values()]
    .sort((left, right) => right.attempts - left.attempts || left.label.localeCompare(right.label))
    .map((group) => ({
      name: group.label,
      percentage: percentage(group.independentCorrect, group.attempts),
    }));
};
