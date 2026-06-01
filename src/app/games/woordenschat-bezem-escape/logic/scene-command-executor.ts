import type { SceneObject, SceneZone, SpatialConcept } from "../types";
import { getZoneCenter, type ScenePoint } from "./scene-zones";
import {
  parseSpokenPlacementCommand,
  type SpokenCommandConfidence,
  type SpokenCommandMissingPart,
  type SpokenCommandParseResult,
} from "./spoken-command-parser";

export type SceneCommandExecutionStatus =
  | "ready"
  | "needs-choice"
  | "needs-help";

export interface SceneCommandChoice {
  id: string;
  label: string;
  type: "object" | "zone";
}

export interface SceneCommandPlacement {
  anchorObjectIds: string[];
  confidence: SpokenCommandConfidence;
  objectId: string;
  point: ScenePoint;
  relation?: SpatialConcept;
  transcript: string;
  zoneId: string;
}

export interface SceneCommandExecutionResult {
  choices: SceneCommandChoice[];
  message: string;
  missing: SpokenCommandMissingPart[];
  normalizedTranscript: string;
  parseResult: SpokenCommandParseResult;
  placement?: SceneCommandPlacement;
  status: SceneCommandExecutionStatus;
  transcript: string;
  visualHint: {
    objectId?: string;
    zoneId?: string;
  };
}

const getObjectChoiceLabel = (objects: readonly SceneObject[], objectId: string) =>
  objects.find((object) => object.id === objectId)?.label ?? objectId;

const getZoneChoiceLabel = (zones: readonly SceneZone[], zoneId: string) =>
  zones.find((zone) => zone.id === zoneId)?.label ?? zoneId;

const getChoices = ({
  objects,
  parseResult,
  zones,
}: {
  objects: readonly SceneObject[];
  parseResult: SpokenCommandParseResult;
  zones: readonly SceneZone[];
}): SceneCommandChoice[] => {
  const objectChoices = parseResult.objectMatches.slice(0, 3).map((match) => ({
    id: match.id,
    label: getObjectChoiceLabel(objects, match.id),
    type: "object" as const,
  }));
  const zoneChoices = parseResult.zoneMatches.slice(0, 3).map((match) => ({
    id: match.id,
    label: getZoneChoiceLabel(zones, match.id),
    type: "zone" as const,
  }));

  return [...objectChoices, ...zoneChoices];
};

const getObjectPhrase = (objects: readonly SceneObject[], objectId: string | undefined) => {
  if (!objectId) {
    return "het plaatje";
  }

  const object = objects.find((sceneObject) => sceneObject.id === objectId);

  if (!object) {
    return objectId;
  }

  return `${object.article} ${object.label}`;
};

const getHelpMessage = ({
  objects,
  parseResult,
  zones,
}: {
  objects: readonly SceneObject[];
  parseResult: SpokenCommandParseResult;
  zones: readonly SceneZone[];
}) => {
  const { missing, normalizedTranscript } = parseResult;
  const objectPhrase = getObjectPhrase(objects, parseResult.objectId);
  const objectLabel = parseResult.objectId
    ? getObjectChoiceLabel(objects, parseResult.objectId)
    : undefined;
  const zoneLabel = parseResult.zoneId
    ? getZoneChoiceLabel(zones, parseResult.zoneId)
    : undefined;

  if (!normalizedTranscript) {
    return "Ik kon het niet goed horen. Probeer het nog eens rustig.";
  }

  if (missing.includes("object") && missing.includes("zone")) {
    return "Goed geprobeerd. Ik ken dat woord nog niet in deze strandwereld. Zeg bijvoorbeeld: Zet de boot in de zee.";
  }

  if (missing.includes("object")) {
    return zoneLabel
      ? `Ik hoorde ${zoneLabel}. Welk plaatje moet daar komen?`
      : "Ik hoorde de plek. Welk plaatje moet daar komen?";
  }

  if (missing.includes("zone")) {
    return `Ik hoorde ${objectPhrase}. Waar moet ${objectPhrase} komen?`;
  }

  if (missing.includes("spatial-concept")) {
    return objectLabel && zoneLabel
      ? `Bijna! Ik hoorde ${objectLabel} en ${zoneLabel}. Zeg ook een plaatswoord, zoals in of op.`
      : "Bijna! Zeg ook een plaatswoord, zoals in of op.";
  }

  return "Ik twijfel nog. Probeer de zin nog eens rustig.";
};

const getTranscriptDisplayText = (transcript: string) =>
  transcript.trim().replace(/[.!?]+$/g, "");

const getReadyMessage = (
  parseResult: SpokenCommandParseResult,
  objects: readonly SceneObject[],
  zones: readonly SceneZone[],
) => {
  const zoneLabel = parseResult.zoneId ? getZoneChoiceLabel(zones, parseResult.zoneId) : "de scene";
  const transcriptText = getTranscriptDisplayText(parseResult.transcript);
  const objectPhrase = getObjectPhrase(objects, parseResult.objectId);

  return `Mooi gezegd! Ik hoorde: ${transcriptText}. Ik zet ${objectPhrase} op de plek: ${zoneLabel}. Je kunt de plek nog aanpassen.`;
};

const getVisualHint = (parseResult: SpokenCommandParseResult) => ({
  objectId: parseResult.objectId,
  zoneId: parseResult.zoneId,
});

const resolvePlacement = ({
  parseResult,
  zones,
}: {
  parseResult: SpokenCommandParseResult;
  zones: readonly SceneZone[];
}): SceneCommandPlacement | undefined => {
  if (!parseResult.objectId || !parseResult.zoneId) {
    return undefined;
  }

  const zone = zones.find((sceneZone) => sceneZone.id === parseResult.zoneId);

  if (!zone) {
    return undefined;
  }

  return {
    anchorObjectIds: parseResult.anchorObjectIds,
    confidence: parseResult.confidence,
    objectId: parseResult.objectId,
    point: getZoneCenter(zone),
    relation: parseResult.relation,
    transcript: parseResult.transcript,
    zoneId: zone.id,
  };
};

export const executeSpokenSceneCommand = ({
  objects,
  transcript,
  zones,
}: {
  objects: readonly SceneObject[];
  transcript: string;
  zones: readonly SceneZone[];
}): SceneCommandExecutionResult => {
  const parseResult = parseSpokenPlacementCommand({ objects, transcript, zones });
  const choices = getChoices({ objects, parseResult, zones });
  const placement = parseResult.confidence === "high"
    ? resolvePlacement({ parseResult, zones })
    : undefined;
  const status: SceneCommandExecutionStatus = placement
    ? "ready"
    : parseResult.confidence === "needs-choice"
      ? "needs-choice"
      : "needs-help";

  return {
    choices,
    message: placement
      ? getReadyMessage(parseResult, objects, zones)
      : getHelpMessage({ objects, parseResult, zones }),
    missing: parseResult.missing,
    normalizedTranscript: parseResult.normalizedTranscript,
    parseResult,
    placement,
    status,
    transcript,
    visualHint: getVisualHint(parseResult),
  };
};
