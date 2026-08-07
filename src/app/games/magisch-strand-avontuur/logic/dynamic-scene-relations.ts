import type { SceneZone, SpatialConcept } from "../types";
import type { ScenePoint } from "./scene-zones";

export interface SceneObjectPlacementPoint extends ScenePoint {
  objectId: string;
}

export interface DynamicRelationPlacement {
  anchorObjectIds?: readonly string[];
  relation: SpatialConcept;
  zoneId: string;
}

export interface DynamicRelationEvaluation {
  matches: boolean;
  missingAnchorObjectIds: string[];
}

const dynamicRelations: SpatialConcept[] = ["op", "naast", "dichtbij", "tussen"];

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

const getLatestObjectPlacement = (
  placements: readonly SceneObjectPlacementPoint[],
  objectId: string,
) => [...placements].reverse().find((placement) => placement.objectId === objectId);

const getAnchorPlacements = (
  placements: readonly SceneObjectPlacementPoint[],
  anchorObjectIds: readonly string[],
) =>
  anchorObjectIds.map((objectId) => ({
    objectId,
    placement: getLatestObjectPlacement(placements, objectId),
  }));

const getDistance = (firstPoint: ScenePoint, secondPoint: ScenePoint) =>
  Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);

const getDistanceToSegment = (
  point: ScenePoint,
  firstAnchor: ScenePoint,
  secondAnchor: ScenePoint,
) => {
  const segmentX = secondAnchor.x - firstAnchor.x;
  const segmentY = secondAnchor.y - firstAnchor.y;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;

  if (segmentLengthSquared === 0) {
    return getDistance(point, firstAnchor);
  }

  const projection = Math.min(
    1,
    Math.max(
      0,
      ((point.x - firstAnchor.x) * segmentX + (point.y - firstAnchor.y) * segmentY) /
        segmentLengthSquared,
    ),
  );
  const projectedPoint = {
    x: firstAnchor.x + projection * segmentX,
    y: firstAnchor.y + projection * segmentY,
  };

  return getDistance(point, projectedPoint);
};

const relationNeedsDynamicAnchor = (placement: DynamicRelationPlacement) =>
  dynamicRelations.includes(placement.relation) && (placement.anchorObjectIds?.length ?? 0) > 0;

export const usesDynamicRelationZone = (placement: DynamicRelationPlacement) =>
  relationNeedsDynamicAnchor(placement);

export const getDynamicRelationLabel = ({
  anchorObjectIds = [],
  relation,
}: {
  anchorObjectIds?: readonly string[];
  relation?: SpatialConcept;
}) => {
  if (!relation || anchorObjectIds.length === 0) {
    return "de scene";
  }

  if (relation === "tussen" && anchorObjectIds.length >= 2) {
    return `tussen ${anchorObjectIds[0]} en ${anchorObjectIds[1]}`;
  }

  return `${relation} ${anchorObjectIds[0]}`;
};

export const getSuggestedDynamicRelationPoint = ({
  anchorObjectIds,
  placements,
  relation,
}: {
  anchorObjectIds: readonly string[];
  placements: readonly SceneObjectPlacementPoint[];
  relation?: SpatialConcept;
}): ScenePoint | undefined => {
  const anchors = getAnchorPlacements(placements, anchorObjectIds);
  const missingAnchor = anchors.find((anchor) => !anchor.placement);

  if (!relation || missingAnchor) {
    return undefined;
  }

  const firstAnchor = anchors[0]?.placement;
  const secondAnchor = anchors[1]?.placement;

  if (!firstAnchor) {
    return undefined;
  }

  if (relation === "tussen" && secondAnchor) {
    return {
      x: clampPercent((firstAnchor.x + secondAnchor.x) / 2),
      y: clampPercent((firstAnchor.y + secondAnchor.y) / 2),
    };
  }

  if (relation === "op") {
    return {
      x: clampPercent(firstAnchor.x),
      y: clampPercent(firstAnchor.y),
    };
  }

  if (relation === "naast") {
    const horizontalOffset = firstAnchor.x > 76 ? -14 : 14;

    return {
      x: clampPercent(firstAnchor.x + horizontalOffset),
      y: clampPercent(firstAnchor.y),
    };
  }

  if (relation === "dichtbij") {
    const horizontalOffset = firstAnchor.x > 78 ? -10 : 10;

    return {
      x: clampPercent(firstAnchor.x + horizontalOffset),
      y: clampPercent(firstAnchor.y + 4),
    };
  }

  return undefined;
};

export const evaluateDynamicRelationPlacement = ({
  anchorObjectIds = [],
  placementPoint,
  placements,
  relation,
}: {
  anchorObjectIds?: readonly string[];
  placementPoint: ScenePoint;
  placements: readonly SceneObjectPlacementPoint[];
  relation: SpatialConcept;
}): DynamicRelationEvaluation => {
  const anchors = getAnchorPlacements(placements, anchorObjectIds);
  const missingAnchorObjectIds = anchors
    .filter((anchor) => !anchor.placement)
    .map((anchor) => anchor.objectId);

  if (!usesDynamicRelationZone({ anchorObjectIds, relation, zoneId: "" })) {
    return {
      matches: false,
      missingAnchorObjectIds,
    };
  }

  if (missingAnchorObjectIds.length > 0) {
    return {
      matches: false,
      missingAnchorObjectIds,
    };
  }

  const firstAnchor = anchors[0]?.placement;
  const secondAnchor = anchors[1]?.placement;

  if (!firstAnchor) {
    return {
      matches: false,
      missingAnchorObjectIds,
    };
  }

  if (relation === "op") {
    const horizontalDistance = Math.abs(placementPoint.x - firstAnchor.x);
    const verticalDistance = Math.abs(placementPoint.y - firstAnchor.y);

    return {
      matches: horizontalDistance <= 18 && verticalDistance <= 14,
      missingAnchorObjectIds,
    };
  }

  if (relation === "naast") {
    const horizontalDistance = Math.abs(placementPoint.x - firstAnchor.x);
    const verticalDistance = Math.abs(placementPoint.y - firstAnchor.y);

    return {
      matches: horizontalDistance >= 5 && horizontalDistance <= 28 && verticalDistance <= 18,
      missingAnchorObjectIds,
    };
  }

  if (relation === "dichtbij") {
    return {
      matches: getDistance(placementPoint, firstAnchor) <= 24,
      missingAnchorObjectIds,
    };
  }

  if (relation === "tussen" && secondAnchor) {
    const minX = Math.min(firstAnchor.x, secondAnchor.x) - 8;
    const maxX = Math.max(firstAnchor.x, secondAnchor.x) + 8;
    const minY = Math.min(firstAnchor.y, secondAnchor.y) - 8;
    const maxY = Math.max(firstAnchor.y, secondAnchor.y) + 8;
    const isInsideLooseBounds =
      placementPoint.x >= minX &&
      placementPoint.x <= maxX &&
      placementPoint.y >= minY &&
      placementPoint.y <= maxY;

    return {
      matches:
        isInsideLooseBounds &&
        getDistanceToSegment(placementPoint, firstAnchor, secondAnchor) <= 14,
      missingAnchorObjectIds,
    };
  }

  return {
    matches: false,
    missingAnchorObjectIds,
  };
};

const buildRectPath = ({
  height,
  width,
  x,
  y,
}: {
  height: number;
  width: number;
  x: number;
  y: number;
}) => {
  const left = clampPercent(x);
  const top = clampPercent(y);
  const right = clampPercent(x + width);
  const bottom = clampPercent(y + height);

  return `M${left} ${top} L${right} ${top} L${right} ${bottom} L${left} ${bottom} Z`;
};

const makeDynamicZone = ({
  description,
  height,
  id,
  label,
  relation,
  visualHintPath,
  width,
  x,
  y,
}: {
  description: string;
  height: number;
  id: string;
  label: string;
  relation: SpatialConcept;
  visualHintPath?: string;
  width: number;
  x: number;
  y: number;
}): SceneZone => ({
  description,
  height,
  id,
  kind: "relative",
  label,
  supportedConcepts: [relation],
  visualHintPath,
  width,
  x,
  y,
});

export const getDynamicRelationHintZone = ({
  anchorObjectIds = [],
  placements,
  relation,
  zoneId,
}: {
  anchorObjectIds?: readonly string[];
  placements: readonly SceneObjectPlacementPoint[];
  relation: SpatialConcept;
  zoneId: string;
}): SceneZone | undefined => {
  const anchors = getAnchorPlacements(placements, anchorObjectIds);
  const missingAnchor = anchors.find((anchor) => !anchor.placement);
  const firstAnchor = anchors[0]?.placement;
  const secondAnchor = anchors[1]?.placement;

  if (
    !usesDynamicRelationZone({ anchorObjectIds, relation, zoneId }) ||
    missingAnchor ||
    !firstAnchor
  ) {
    return undefined;
  }

  if (relation === "op") {
    const width = 34;
    const height = 24;

    return makeDynamicZone({
      description: `Dynamische plek op ${firstAnchor.objectId}.`,
      height,
      id: zoneId,
      label: getDynamicRelationLabel({ anchorObjectIds, relation }),
      relation,
      visualHintPath: buildRectPath({
        height,
        width,
        x: firstAnchor.x - width / 2,
        y: firstAnchor.y - height / 2,
      }),
      width,
      x: clampPercent(firstAnchor.x - width / 2),
      y: clampPercent(firstAnchor.y - height / 2),
    });
  }

  if (relation === "naast") {
    const y = firstAnchor.y - 11;
    const leftPath = buildRectPath({
      height: 22,
      width: 18,
      x: firstAnchor.x - 28,
      y,
    });
    const rightPath = buildRectPath({
      height: 22,
      width: 18,
      x: firstAnchor.x + 10,
      y,
    });

    return makeDynamicZone({
      description: `Dynamische plek naast ${firstAnchor.objectId}.`,
      height: 22,
      id: zoneId,
      label: getDynamicRelationLabel({ anchorObjectIds, relation }),
      relation,
      visualHintPath: `${leftPath} ${rightPath}`,
      width: 56,
      x: clampPercent(firstAnchor.x - 28),
      y: clampPercent(y),
    });
  }

  if (relation === "dichtbij") {
    return makeDynamicZone({
      description: `Dynamische plek dichtbij ${firstAnchor.objectId}.`,
      height: 28,
      id: zoneId,
      label: getDynamicRelationLabel({ anchorObjectIds, relation }),
      relation,
      width: 36,
      x: clampPercent(firstAnchor.x - 18),
      y: clampPercent(firstAnchor.y - 14),
    });
  }

  if (relation === "tussen" && secondAnchor) {
    const minX = Math.min(firstAnchor.x, secondAnchor.x);
    const minY = Math.min(firstAnchor.y, secondAnchor.y);
    const maxX = Math.max(firstAnchor.x, secondAnchor.x);
    const maxY = Math.max(firstAnchor.y, secondAnchor.y);
    const x = clampPercent(minX - 8);
    const y = clampPercent(minY - 8);

    return makeDynamicZone({
      description: `Dynamische plek tussen ${firstAnchor.objectId} en ${secondAnchor.objectId}.`,
      height: Math.max(18, Math.min(34, maxY - minY + 16)),
      id: zoneId,
      label: getDynamicRelationLabel({ anchorObjectIds, relation }),
      relation,
      width: Math.max(18, Math.min(48, maxX - minX + 16)),
      x,
      y,
    });
  }

  return undefined;
};
