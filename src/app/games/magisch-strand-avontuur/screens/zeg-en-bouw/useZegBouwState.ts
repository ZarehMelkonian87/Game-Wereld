import { useMemo, useState } from "react";
import {
  addProfileTotals,
  readUnlockedRewardIds,
  resolveNewRewardUnlocks,
  saveUnlockedRewardIds,
} from "../../logic/rewards";
import { findSmallestZoneAtPoint, getZoneCenter, type ScenePoint } from "../../logic/scene-zones";
import type { CompoundPlacement } from "../../logic/spoken-command-parser";
import {
  getBuildCardProgress,
  isObjectAllowedOnCard,
  shuffleBuildCards,
  zegBouwCards,
  type ZegBouwCard,
} from "../../logic/zeg-en-bouw-cards";
import { createRoundSeed } from "../../logic/instruction-randomization";
import { useGameRuntime } from "../../runtime/GameRuntimeContext";
import type { SceneObject, SceneZone } from "../../types";

export interface ZegBouwPlacedObject {
  key: string;
  objectId: string;
  x: number;
  y: number;
  zoneId: string;
}

export interface ZegBouwFeedback {
  kind: "good" | "tip" | "prompt";
  text: string;
}

const getObjectLabel = (objects: readonly SceneObject[], objectId: string) =>
  objects.find((object) => object.id === objectId)?.label ?? objectId;

export const useZegBouwState = ({
  objects,
  zones,
}: {
  objects: readonly SceneObject[];
  zones: readonly SceneZone[];
}) => {
  const runtime = useGameRuntime();
  const rewardProfileId = runtime.identity.profileId;

  const [roundSeed, setRoundSeed] = useState(() => createRoundSeed());
  const cards = useMemo(() => shuffleBuildCards(zegBouwCards, roundSeed), [roundSeed]);
  const [cardIndex, setCardIndex] = useState(0);
  const card: ZegBouwCard = cards[cardIndex] ?? cards[0];

  const [placedObjects, setPlacedObjects] = useState<ZegBouwPlacedObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ZegBouwFeedback | null>(null);
  const [wordStarValue, setWordStarValue] = useState(0);
  const [unlockedRewardIds, setUnlockedRewardIds] = useState<string[]>(() =>
    readUnlockedRewardIds(rewardProfileId, runtime.storage),
  );

  const placedObjectIds = placedObjects.map((placedObject) => placedObject.objectId);
  const progress = getBuildCardProgress(card, placedObjectIds);
  const isCardComplete = progress.complete;

  const awardStars = (earnedWordStars: number) => {
    const totals = addProfileTotals(rewardProfileId, runtime.storage, {
      speed: earnedWordStars,
      wordStars: earnedWordStars,
    });
    const newUnlocks = resolveNewRewardUnlocks({
      totalWordStars: totals.wordStars,
      unlockedRewardIds,
    });

    if (newUnlocks.length > 0) {
      const nextUnlocked = [...unlockedRewardIds, ...newUnlocks.map((reward) => reward.id)];
      setUnlockedRewardIds(nextUnlocked);
      saveUnlockedRewardIds(rewardProfileId, nextUnlocked, runtime.storage);
    }

    setWordStarValue((current) => current + earnedWordStars);
    return newUnlocks;
  };

  const selectObject = (objectId: string) => {
    setSelectedObjectId(objectId);
    setFeedback({
      kind: "prompt",
      text: `Waar wil je de ${getObjectLabel(objects, objectId)} neerzetten? Tik op het strand of in de zee.`,
    });
  };

  /**
   * Plaatst één object op een geldige plek. Past het object bij het thema, dan
   * telt het mee; past het niet, dan volgt een vriendelijke tip (geen straf).
   * Geeft terug of er daadwerkelijk geplaatst is.
   */
  const placeObject = (objectId: string, point: ScenePoint, zoneId: string) => {
    const label = getObjectLabel(objects, objectId);

    if (!isObjectAllowedOnCard(card, objectId)) {
      setFeedback({
        kind: "tip",
        text: `Een ${label} past niet zo goed op het ${card.theme}. Kies iets dat er wél bij hoort!`,
      });
      return false;
    }

    const alreadyPlaced = placedObjects.some((placedObject) => placedObject.objectId === objectId);

    setPlacedObjects((current) => [
      ...current.filter((placedObject) => placedObject.objectId !== objectId),
      { key: `${objectId}-${Math.round(point.x)}-${Math.round(point.y)}`, objectId, x: point.x, y: point.y, zoneId },
    ]);
    setSelectedObjectId(null);

    // Sterren alleen voor een nieuw, passend object (niet voor verplaatsen).
    if (!alreadyPlaced) {
      awardStars(2);
    }

    const nextCount = getBuildCardProgress(card, [
      ...placedObjectIds.filter((id) => id !== objectId),
      objectId,
    ]).count;

    setFeedback(
      nextCount >= card.goalCount
        ? { kind: "good", text: `Knap gedaan! Je ${card.theme} is helemaal af! 🎉` }
        : { kind: "good", text: `Mooi! De ${label} staat op zijn plek.` },
    );

    return true;
  };

  const placeSelectedAtPoint = (point: ScenePoint) => {
    if (!selectedObjectId) {
      setFeedback({ kind: "prompt", text: "Kies eerst een plaatje onderaan." });
      return;
    }

    const zone = findSmallestZoneAtPoint([...zones], point);
    if (!zone) {
      setFeedback({
        kind: "prompt",
        text: "Tik op het strand of in de zee om het plaatje neer te zetten.",
      });
      return;
    }

    placeObject(selectedObjectId, point, zone.id);
  };

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const defaultZone =
    zones.find((zone) => zone.id === "strand") ?? zones.find((zone) => zone.id === "zee") ?? zones[0];

  const listLabels = (labels: string[]) =>
    labels.length > 1
      ? `${labels.slice(0, -1).join(", ")} en ${labels[labels.length - 1]}`
      : (labels[0] ?? "");

  /**
   * Verwerkt een samengestelde zin in één keer (T-04c C2b): plaatst alle
   * passende objecten (spreiding zodat ze niet stapelen), telt de sterren in één
   * keer met een **compound-bonus** voor een zin met meerdere objecten, en toont
   * een vriendelijke tip als niets paste.
   */
  const placeCompound = (placements: readonly CompoundPlacement[]) => {
    const allowed = placements.filter((placement) =>
      isObjectAllowedOnCard(card, placement.objectId),
    );

    if (allowed.length === 0) {
      const firstObjectId = placements[0]?.objectId;
      setFeedback(
        firstObjectId
          ? {
              kind: "tip",
              text: `Een ${getObjectLabel(objects, firstObjectId)} past niet zo goed op het ${card.theme}. Zeg iets dat er wél bij hoort!`,
            }
          : {
              kind: "prompt",
              text: "Ik verstond geen strandwoord. Zeg bijvoorbeeld: de bal en de zon.",
            },
      );
      return;
    }

    // Dedupe op objectId (laatste vermelding wint) en bepaal per object een plek.
    const resolved = new Map<string, { point: ScenePoint; zoneId: string }>();
    allowed.forEach((placement, index) => {
      const zone =
        (placement.zoneId ? zones.find((candidate) => candidate.id === placement.zoneId) : undefined) ??
        defaultZone;
      if (!zone) {
        return;
      }
      const center = getZoneCenter(zone);
      const horizontalOffset = ((index % 3) - 1) * 9;
      const verticalOffset = (Math.floor(index / 3) % 2 === 0 ? -1 : 1) * 6;
      resolved.set(placement.objectId, {
        point: {
          x: clamp(center.x + horizontalOffset, 6, 94),
          y: clamp(center.y + verticalOffset, 12, 88),
        },
        zoneId: zone.id,
      });
    });

    if (resolved.size === 0) {
      return;
    }

    const newlyPlacedIds = [...resolved.keys()].filter(
      (objectId) => !placedObjects.some((placedObject) => placedObject.objectId === objectId),
    );

    setPlacedObjects((current) => {
      const kept = current.filter((placedObject) => !resolved.has(placedObject.objectId));
      const added = [...resolved.entries()].map(([objectId, { point, zoneId }]) => ({
        key: `${objectId}-${Math.round(point.x)}-${Math.round(point.y)}`,
        objectId,
        x: point.x,
        y: point.y,
        zoneId,
      }));
      return [...kept, ...added];
    });
    setSelectedObjectId(null);

    const compoundBonus = allowed.length >= 2 ? 1 : 0;
    const earnedStars = newlyPlacedIds.length * 2 + compoundBonus;
    if (earnedStars > 0) {
      awardStars(earnedStars);
    }

    const nextIds = [
      ...placedObjectIds.filter((id) => !resolved.has(id)),
      ...resolved.keys(),
    ];
    const nextCount = getBuildCardProgress(card, nextIds).count;
    const placedText = listLabels([...resolved.keys()].map((id) => getObjectLabel(objects, id)));

    setFeedback(
      nextCount >= card.goalCount
        ? { kind: "good", text: `Knap gedaan! Je ${card.theme} is helemaal af! 🎉` }
        : allowed.length >= 2
          ? { kind: "good", text: `Goed gezegd! Je zette de ${placedText} neer.` }
          : { kind: "good", text: `Mooi! De ${placedText} staat op zijn plek.` },
    );
  };

  const showNudge = (text: string) => {
    setFeedback({ kind: "tip", text });
  };

  const startNextCard = () => {
    setPlacedObjects([]);
    setSelectedObjectId(null);
    setFeedback(null);
    setCardIndex((current) => (current + 1) % cards.length);
  };

  const restartRound = () => {
    const nextSeed = createRoundSeed();
    setRoundSeed(nextSeed);
    setCardIndex(0);
    setPlacedObjects([]);
    setSelectedObjectId(null);
    setFeedback(null);
  };

  return {
    card,
    feedback,
    isCardComplete,
    placeCompound,
    placeSelectedAtPoint,
    placedObjects,
    progress,
    restartRound,
    rewardProfileId,
    selectObject,
    selectedObjectId,
    showNudge,
    startNextCard,
    unlockedRewardIds,
    wordStarValue,
  };
};
