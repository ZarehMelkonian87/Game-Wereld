import type { SceneObject, SceneZone, SpatialConcept } from "../types";

export type SpokenCommandConfidence = "high" | "needs-choice" | "needs-help";

export type SpokenCommandMissingPart = "object" | "spatial-concept" | "zone";

export interface SpokenCommandMatch {
  alias: string;
  endIndex: number;
  id: string;
  index: number;
  label: string;
}

export interface SpokenCommandParseResult {
  anchorObjectIds: string[];
  confidence: SpokenCommandConfidence;
  missing: SpokenCommandMissingPart[];
  normalizedTranscript: string;
  objectId?: string;
  objectMatches: SpokenCommandMatch[];
  relation?: SpatialConcept;
  spatialConceptMatches: Array<SpokenCommandMatch & { id: SpatialConcept }>;
  transcript: string;
  zoneId?: string;
  zoneMatches: SpokenCommandMatch[];
}

const customObjectAliases: Record<string, readonly string[]> = {
  aap: ["apen", "aapje", "chimpansee"],
  acrobaat: ["acrobaten", "acrobatje", "turner", "koorddanser"],
  bal: ["ballen", "balletje", "jongleerbal"],
  ballon: ["ballonnen", "ballonnetje", "luchtballon"],
  beer: ["beren", "beertje", "teddybeer", "bruine beer"],
  big: ["biggen", "biggetje", "varken", "varkens"],
  clown: ["clowns", "clowntje", "pias", "nar"],
  eenwieler: ["eenwielers", "wieler", "fiets", "eenwielertje"],
  hoepel: ["hoepels", "hoepeltje", "ring", "hoela"],
  hond: ["honden", "hondje", "puppy", "poedel"],
  kanon: ["kanonnen", "kanonnetje", "circuskanon"],
  kip: ["kippen", "kipje", "kuiken", "hen", "haan"],
  leeuw: ["leeuwen", "leeuwtje", "welp"],
  muis: ["muizen", "muisje", "muisjes"],
  olifant: ["olifanten", "olifantje", "slurf"],
  poes: ["poezen", "poesje", "kat", "katten", "katje", "kitten"],
  trommel: ["trommels", "trommeltje", "drum"],
  vlag: ["vlaggen", "vlaggetje", "vlaggetjes"],
  zeehond: ["zeehonden", "zeehondje", "rob", "zeeleeuw"],
};

const spatialConceptAliases: Record<SpatialConcept, readonly string[]> = {
  boven: ["boven", "omhoog", "hoog"],
  dichtbij: ["dichtbij", "dicht bij", "vlakbij", "bij"],
  in: ["in", "erin", "binnen"],
  links: ["links", "linkerkant", "aan de linkerkant"],
  midden: ["midden", "in het midden", "in de midden"],
  naast: ["naast", "ernaast", "aan de zijkant"],
  onder: ["onder", "beneden", "laag"],
  op: ["op", "bovenop"],
  rechts: ["rechts", "rechterkant", "aan de rechterkant"],
  tussen: ["tussen", "ertussen"],
  "ver weg": ["ver weg", "verweg", "verre"],
};

const spatialConceptPriority: SpatialConcept[] = [
  "tussen",
  "naast",
  "onder",
  "boven",
  "links",
  "rechts",
  "midden",
  "dichtbij",
  "ver weg",
  "in",
  "op",
];

const customZoneAliases: Record<string, readonly string[]> = {
  "boven-piste": ["boven de piste", "boven piste", "boven de ring", "lucht boven de piste"],
  "links-piste": [
    "links",
    "aan de linkerkant",
    "linkerkant",
    "links in de piste",
    "links in piste",
    "links piste",
    "linkerkant van de piste",
  ],
  "midden-vloer": [
    "midden",
    "in het midden",
    "midden op de vloer",
    "midden vloer",
    "in het midden van de vloer",
  ],
  nok: ["nok", "in de nok", "bovenin de tent", "boven in de tent", "tentdak", "hoog in de tent"],
  piste: ["piste", "ring", "manege", "in de piste", "in de ring", "in de manege"],
  "rechts-vloer": [
    "rechts",
    "aan de rechterkant",
    "rechterkant",
    "rechts op de vloer",
    "rechts vloer",
    "rechterkant van de vloer",
  ],
  tribune: ["tribune", "op de tribune", "op tribune", "publiek", "bij het publiek"],
  "ver-weg-piste": [
    "ver weg boven de piste",
    "ver weg boven piste",
    "ver weg in de tent",
    "ver weg bij de piste",
  ],
  vloer: ["vloer", "grond", "op de vloer", "op vloer", "op de grond"],
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const normalizeSpokenCommand = (transcript: string) =>
  transcript
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const uniqueAliases = (aliases: readonly string[]) => [
  ...new Set(aliases.map(normalizeSpokenCommand).filter(Boolean)),
];

const getAliasWordCount = (alias: string) => alias.split(" ").length;

const findAliasMatches = (
  normalizedTranscript: string,
  id: string,
  label: string,
  aliases: readonly string[],
): SpokenCommandMatch[] =>
  aliases.flatMap((alias) => {
    const normalizedAlias = normalizeSpokenCommand(alias);

    if (!normalizedAlias) {
      return [];
    }

    const expression = new RegExp(`(?:^| )(${escapeRegExp(normalizedAlias)})(?= |$)`, "g");
    const matches: SpokenCommandMatch[] = [];
    let match = expression.exec(normalizedTranscript);

    while (match) {
      const matchedAlias = match[1];
      const index = match.index + match[0].indexOf(matchedAlias);

      matches.push({
        alias: matchedAlias,
        endIndex: index + matchedAlias.length,
        id,
        index,
        label,
      });

      match = expression.exec(normalizedTranscript);
    }

    return matches;
  });

const sortMatches = <TMatch extends SpokenCommandMatch>(matches: TMatch[]) =>
  [...matches].sort((first, second) => {
    if (first.index !== second.index) {
      return first.index - second.index;
    }

    return second.alias.length - first.alias.length;
  });

const sortZoneMatches = (matches: SpokenCommandMatch[]) =>
  [...matches].sort((first, second) => {
    const wordCountDifference = getAliasWordCount(second.alias) - getAliasWordCount(first.alias);

    if (wordCountDifference !== 0) {
      return wordCountDifference;
    }

    if (first.index !== second.index) {
      return first.index - second.index;
    }

    return second.alias.length - first.alias.length;
  });

const dedupeMatchesById = <TMatch extends SpokenCommandMatch>(matches: TMatch[]) => {
  const seenIds = new Set<string>();
  const dedupedMatches: TMatch[] = [];

  sortMatches(matches).forEach((match) => {
    if (seenIds.has(match.id)) {
      return;
    }

    seenIds.add(match.id);
    dedupedMatches.push(match);
  });

  return dedupedMatches;
};

const getObjectAliases = (object: SceneObject) =>
  uniqueAliases([
    object.label,
    object.pluralLabel ?? "",
    object.id,
    object.assetId,
    ...(customObjectAliases[object.id] ?? []),
  ]);

const getZoneAliases = (zone: SceneZone) =>
  uniqueAliases([zone.label, zone.id, ...(customZoneAliases[zone.id] ?? [])]);

const getObjectMatches = (normalizedTranscript: string, objects: readonly SceneObject[]) =>
  dedupeMatchesById(
    objects.flatMap((object) =>
      findAliasMatches(normalizedTranscript, object.id, object.label, getObjectAliases(object)),
    ),
  );

const getSpatialConceptMatches = (normalizedTranscript: string) =>
  dedupeMatchesById(
    Object.entries(spatialConceptAliases).flatMap(([concept, aliases]) =>
      findAliasMatches(normalizedTranscript, concept, concept, aliases).map((match) => ({
        ...match,
        id: concept as SpatialConcept,
      })),
    ),
  );

const getZoneMatches = (normalizedTranscript: string, zones: readonly SceneZone[]) =>
  sortZoneMatches(
    dedupeMatchesById(
      zones.flatMap((zone) =>
        findAliasMatches(normalizedTranscript, zone.id, zone.label, getZoneAliases(zone)),
      ),
    ),
  );

const chooseSpatialConcept = (
  spatialConceptMatches: Array<SpokenCommandMatch & { id: SpatialConcept }>,
) => {
  const highestWordCount = Math.max(
    0,
    ...spatialConceptMatches.map((match) => getAliasWordCount(match.alias)),
  );
  const matchedConcepts = new Set(
    spatialConceptMatches
      .filter((match) => getAliasWordCount(match.alias) === highestWordCount)
      .map((match) => match.id),
  );

  return spatialConceptPriority.find((concept) => matchedConcepts.has(concept));
};

const getMissingParts = (
  objectId: string | undefined,
  relation: SpatialConcept | undefined,
  zoneId: string | undefined,
  anchorObjectIds: readonly string[],
): SpokenCommandMissingPart[] => {
  const missingParts: SpokenCommandMissingPart[] = [];

  if (!objectId) {
    missingParts.push("object");
  }

  if (!relation) {
    missingParts.push("spatial-concept");
  }

  if (!zoneId && anchorObjectIds.length === 0) {
    missingParts.push("zone");
  }

  return missingParts;
};

const getCommandConfidence = (
  objectId: string | undefined,
  relation: SpatialConcept | undefined,
  zoneId: string | undefined,
  anchorObjectIds: readonly string[],
) => {
  if (objectId && relation && (zoneId || anchorObjectIds.length > 0)) {
    return "high";
  }

  if (objectId && (relation || zoneId || anchorObjectIds.length > 0)) {
    return "needs-choice";
  }

  return "needs-help";
};

export const parseSpokenPlacementCommand = ({
  objects,
  transcript,
  zones,
}: {
  objects: readonly SceneObject[];
  transcript: string;
  zones: readonly SceneZone[];
}): SpokenCommandParseResult => {
  const normalizedTranscript = normalizeSpokenCommand(transcript);
  const objectMatches = getObjectMatches(normalizedTranscript, objects);
  const spatialConceptMatches = getSpatialConceptMatches(normalizedTranscript);
  const zoneMatches = getZoneMatches(normalizedTranscript, zones);
  const targetObject = objectMatches[0];
  const anchorObjectIds = objectMatches.slice(1).map((match) => match.id);
  const relation = chooseSpatialConcept(spatialConceptMatches);
  const zoneId = zoneMatches[0]?.id;
  const missing = getMissingParts(targetObject?.id, relation, zoneId, anchorObjectIds);

  return {
    anchorObjectIds,
    confidence: getCommandConfidence(targetObject?.id, relation, zoneId, anchorObjectIds),
    missing,
    normalizedTranscript,
    objectId: targetObject?.id,
    objectMatches,
    relation,
    spatialConceptMatches,
    transcript,
    zoneId,
    zoneMatches,
  };
};
