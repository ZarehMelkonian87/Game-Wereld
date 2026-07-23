import type { SceneZone } from "../types";
import type { RuntimeStorage } from "../../../game-platform/contracts";

export type SceneZoneVisualHintOverrides = Record<string, string>;

export const zoneVisualHintOverridesChangedEvent =
  "strand-bezem-escape:zone-visual-hint-overrides-changed";

const zoneVisualHintOverridesStorageKey = "strand-bezem-escape:zone-visual-hint-overrides";

const isBrowser = () => typeof window !== "undefined";

const parseOverrides = (value: string | null): SceneZoneVisualHintOverrides => {
  if (!value) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(value);

    if (!parsedValue || typeof parsedValue !== "object" || Array.isArray(parsedValue)) {
      return {};
    }

    return Object.entries(parsedValue).reduce<SceneZoneVisualHintOverrides>(
      (overrides, [zoneId, visualHintPath]) => {
        if (typeof zoneId === "string" && typeof visualHintPath === "string") {
          overrides[zoneId] = visualHintPath;
        }

        return overrides;
      },
      {},
    );
  } catch {
    return {};
  }
};

const notifyOverridesChanged = () => {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(zoneVisualHintOverridesChangedEvent));
};

export const readSceneZoneVisualHintOverrides = (storage: RuntimeStorage) =>
  parseOverrides(storage.get(zoneVisualHintOverridesStorageKey));

export const saveSceneZoneVisualHintOverride = (
  zoneId: string,
  visualHintPath: string,
  storage: RuntimeStorage,
) => {
  if (!isBrowser()) {
    return;
  }

  const currentOverrides = readSceneZoneVisualHintOverrides(storage);
  const nextOverrides = {
    ...currentOverrides,
    [zoneId]: visualHintPath,
  };

  storage.set(zoneVisualHintOverridesStorageKey, JSON.stringify(nextOverrides));
  notifyOverridesChanged();
};

export const clearSceneZoneVisualHintOverride = (zoneId: string, storage: RuntimeStorage) => {
  if (!isBrowser()) {
    return;
  }

  const currentOverrides = readSceneZoneVisualHintOverrides(storage);
  const { [zoneId]: _removedOverride, ...nextOverrides } = currentOverrides;

  storage.set(zoneVisualHintOverridesStorageKey, JSON.stringify(nextOverrides));
  notifyOverridesChanged();
};

export const applySceneZoneVisualHintOverrides = (zones: SceneZone[], storage: RuntimeStorage) => {
  const overrides = readSceneZoneVisualHintOverrides(storage);

  return zones.map((zone) => {
    const visualHintPath = overrides[zone.id];

    if (!visualHintPath) {
      return zone;
    }

    return {
      ...zone,
      visualHintPath,
    };
  });
};
