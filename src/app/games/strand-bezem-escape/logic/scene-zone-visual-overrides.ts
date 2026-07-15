import type { SceneZone } from "../types";

export type SceneZoneVisualHintOverrides = Record<string, string>;

export const zoneVisualHintOverridesChangedEvent =
  "strand-bezem-escape:zone-visual-hint-overrides-changed";

const zoneVisualHintOverridesStorageKey =
  "strand-bezem-escape:zone-visual-hint-overrides";

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

export const readSceneZoneVisualHintOverrides = (): SceneZoneVisualHintOverrides => {
  if (!isBrowser()) {
    return {};
  }

  return parseOverrides(window.localStorage.getItem(zoneVisualHintOverridesStorageKey));
};

export const saveSceneZoneVisualHintOverride = (zoneId: string, visualHintPath: string) => {
  if (!isBrowser()) {
    return;
  }

  const currentOverrides = readSceneZoneVisualHintOverrides();
  const nextOverrides = {
    ...currentOverrides,
    [zoneId]: visualHintPath,
  };

  window.localStorage.setItem(
    zoneVisualHintOverridesStorageKey,
    JSON.stringify(nextOverrides),
  );
  notifyOverridesChanged();
};

export const clearSceneZoneVisualHintOverride = (zoneId: string) => {
  if (!isBrowser()) {
    return;
  }

  const currentOverrides = readSceneZoneVisualHintOverrides();
  const { [zoneId]: _removedOverride, ...nextOverrides } = currentOverrides;

  window.localStorage.setItem(
    zoneVisualHintOverridesStorageKey,
    JSON.stringify(nextOverrides),
  );
  notifyOverridesChanged();
};

export const applySceneZoneVisualHintOverrides = (zones: SceneZone[]) => {
  const overrides = readSceneZoneVisualHintOverrides();

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
