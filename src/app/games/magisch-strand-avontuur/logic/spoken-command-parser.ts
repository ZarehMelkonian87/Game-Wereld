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
  bal: ["strandbal", "beachbal"],
  boot: ["bootje", "zeilboot", "schip"],
  dolfijn: ["dolfin", "dolfijnen"],
  handdoek: ["stranddoek", "doek"],
  krab: ["krabben"],
  parasol: ["strandparasol"],
  schelp: ["schelpen", "schelpjes"],
  vliegtuig: ["vliegmachine"],
  vlieger: ["kite"],
  vuurtoren: ["toren", "lichttoren"],
  zandkasteel: ["kasteel", "zand kasteel"],
  zon: ["zonnetje"],
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
  "boven-zee": ["boven de zee", "boven zee", "lucht boven zee"],
  "dichtbij-parasol": ["dichtbij de parasol", "dicht bij de parasol", "vlakbij de parasol"],
  eiland: ["eiland", "op het eiland", "op eiland"],
  "links-zee": [
    "links",
    "aan de linkerkant",
    "linkerkant",
    "links in de zee",
    "links in zee",
    "links zee",
    "linkerkant van de zee",
  ],
  lucht: ["lucht", "hemel", "in de lucht", "boven het strand", "boven strand"],
  "midden-strand": [
    "midden",
    "in het midden",
    "midden op het strand",
    "midden strand",
    "in het midden van het strand",
  ],
  "naast-parasol": ["naast de parasol", "naast parasol", "bij de parasol"],
  "naast-schelp": ["naast de schelp", "naast schelp", "naast de schelpen"],
  "rechts-strand": [
    "rechts",
    "aan de rechterkant",
    "rechterkant",
    "rechts op het strand",
    "rechts strand",
    "rechterkant van het strand",
  ],
  strand: ["strand", "zand", "op het strand", "op strand"],
  "tussen-bal-zandkasteel": [
    "tussen de bal en het zandkasteel",
    "tussen bal en zandkasteel",
    "tussen de bal en de zandkasteel",
  ],
  "ver-weg-zee": [
    "ver weg boven de zee",
    "ver weg boven zee",
    "ver weg in de lucht",
    "ver weg bij de zee",
  ],
  zee: ["zee", "water", "in de zee", "in zee", "in het water", "op het water"],
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

/**
 * Eén plaatsing uit een samengestelde ("compound") zin: welk object, en waar
 * (relatie/zone als die genoemd zijn). Voor Zeg & Bouw (T-04b) mag één zin
 * meerdere objecten bevatten, bv. "de boot in de zee en de vuurtoren op het
 * eiland".
 */
export interface CompoundPlacement {
  objectId: string;
  objectLabel: string;
  relation?: SpatialConcept;
  zoneId?: string;
}

export interface CompoundPlacementParseResult {
  normalizedTranscript: string;
  placements: CompoundPlacement[];
  transcript: string;
}

type CompoundTokenType = "object" | "concept" | "zone";

interface CompoundToken extends SpokenCommandMatch {
  type: CompoundTokenType;
}

/**
 * Verzamelt alle object-, begrip- en zone-treffers in de zin en kiest een
 * niet-overlappende reeks van links naar rechts (langste match wint bij
 * overlap, bv. "strandbal" boven "bal"). Anders dan `parseSpokenPlacementCommand`
 * dedupliceren we hier NIET op id: hetzelfde begrip/zone mag meerdere keren
 * voorkomen ("... in de zee en ... in de zee").
 */
const buildCompoundTokens = (
  normalizedTranscript: string,
  objects: readonly SceneObject[],
  zones: readonly SceneZone[],
): CompoundToken[] => {
  const rawTokens: CompoundToken[] = [
    ...objects.flatMap((object) =>
      findAliasMatches(
        normalizedTranscript,
        object.id,
        object.label,
        getObjectAliases(object),
      ).map((match) => ({ ...match, type: "object" as const })),
    ),
    ...Object.entries(spatialConceptAliases).flatMap(([concept, aliases]) =>
      findAliasMatches(normalizedTranscript, concept, concept, aliases).map((match) => ({
        ...match,
        id: concept,
        type: "concept" as const,
      })),
    ),
    ...zones.flatMap((zone) =>
      findAliasMatches(normalizedTranscript, zone.id, zone.label, getZoneAliases(zone)).map(
        (match) => ({ ...match, type: "zone" as const }),
      ),
    ),
  ];

  const ordered = [...rawTokens].sort((first, second) => {
    if (first.index !== second.index) {
      return first.index - second.index;
    }
    // Bij gelijke start: langste treffer eerst, zodat die de overlap wint.
    return second.endIndex - second.index - (first.endIndex - first.index);
  });

  const selected: CompoundToken[] = [];
  let lastEndIndex = -1;

  ordered.forEach((token) => {
    if (token.index >= lastEndIndex) {
      selected.push(token);
      lastEndIndex = token.endIndex;
    }
  });

  return selected;
};

/**
 * Haalt **meerdere** plaatsingen uit één zin (T-04b, Zeg & Bouw). Objecten
 * stapelen op tot er een zone genoemd wordt; die zone (met de laatst genoemde
 * relatie) wordt dan aan alle wachtende objecten toegekend. Objecten zonder
 * genoemde zone komen als "losse" plaatsing terug (soepel doel: het kind noemde
 * het object, het spel kiest een geldige plek).
 */
export const parseCompoundPlacements = ({
  objects,
  transcript,
  zones,
}: {
  objects: readonly SceneObject[];
  transcript: string;
  zones: readonly SceneZone[];
}): CompoundPlacementParseResult => {
  const normalizedTranscript = normalizeSpokenCommand(transcript);
  const tokens = buildCompoundTokens(normalizedTranscript, objects, zones);

  const placements: CompoundPlacement[] = [];
  const seenPlacementKeys = new Set<string>();
  let pendingObjects: CompoundToken[] = [];
  let currentRelation: SpatialConcept | undefined;

  const emit = (
    object: CompoundToken,
    relation: SpatialConcept | undefined,
    zoneId: string | undefined,
  ) => {
    const key = `${object.index}:${object.id}@${zoneId ?? ""}`;
    if (seenPlacementKeys.has(key)) {
      return;
    }

    seenPlacementKeys.add(key);
    placements.push({ objectId: object.id, objectLabel: object.label, relation, zoneId });
  };

  tokens.forEach((token) => {
    if (token.type === "object") {
      pendingObjects.push(token);
      return;
    }

    if (token.type === "concept") {
      currentRelation = token.id as SpatialConcept;
      return;
    }

    // zone: ken de lopende relatie + deze zone toe aan alle wachtende objecten.
    pendingObjects.forEach((object) => emit(object, currentRelation, token.id));
    pendingObjects = [];
    currentRelation = undefined;
  });

  // Overgebleven objecten zonder genoemde zone → losse plaatsing (soepel doel).
  pendingObjects.forEach((object) => emit(object, currentRelation, undefined));

  return { normalizedTranscript, placements, transcript };
};
