import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createFakeGameRuntime,
  createEventId,
  defineGameManifest,
  parseGameManifest,
  type GameRegistryEntry,
} from "../src/app/game-platform";
import { GameRuntimeBoundary } from "../src/app/game-host";
import {
  getMissingRequiredCapabilities,
  loadGameModule,
} from "../src/app/game-host/gameHostContracts";
import { gameRegistry, getLoadableGameRegistryEntries } from "../src/app/games/registry";
import { getGameRegistryEntry } from "../src/app/games/registry";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("generiek gamecontract", () => {
  it("heeft unieke schema-geldige manifests waarvan sleutel en id gelijk zijn", () => {
    const ids = Object.keys(gameRegistry);
    expect(new Set(ids).size).toBe(ids.length);

    Object.entries(gameRegistry).forEach(([key, entry]) => {
      expect(parseGameManifest(entry.manifest)).toMatchObject({ ok: true });
      expect(entry.manifest.id).toBe(key);
    });
  });

  it("weigert een ongeldige tijdelijke registryentry duidelijk", () => {
    const parsed = parseGameManifest({
      contractVersion: 1,
      id: "",
      title: "",
    });
    expect(parsed).toMatchObject({
      error: { code: "invalid-game-manifest" },
      ok: false,
    });
  });

  it("weigert ingetrokken compatibiliteitsaliases en onbekende id's", () => {
    expect(getGameRegistryEntry("woordenschat-bezem-escape")).toBeUndefined();
    expect(getGameRegistryEntry("bestaat-niet")).toBeUndefined();
  });

  it.each(getLoadableGameRegistryEntries())(
    "laadt $manifest.title en mount uitsluitend met een fake runtime",
    async (entry) => {
      const getItem = vi.spyOn(Storage.prototype, "getItem");
      const setItem = vi.spyOn(Storage.prototype, "setItem");
      const module = await loadGameModule(entry);
      const runtime = createFakeGameRuntime();

      render(<module.Game runtime={runtime} />);

      expect(await screen.findByTestId("start-screen")).toBeVisible();
      expect(getItem).not.toHaveBeenCalled();
      expect(setItem).not.toHaveBeenCalled();
    },
  );

  it("sluit complete en exit samen maximaal één keer af", () => {
    const runtime = createFakeGameRuntime();
    runtime.lifecycle.complete({ correctActions: 1, score: 100, stars: 1 });
    runtime.lifecycle.complete({ correctActions: 2, score: 200, stars: 2 });
    runtime.lifecycle.exit("back");

    expect(runtime.captured.completions).toHaveLength(1);
    expect(runtime.captured.exits).toHaveLength(0);
  });

  it("schrijft hetzelfde oefenevent-id maximaal één keer", async () => {
    const runtime = createFakeGameRuntime();
    const observation = {
      assistance: [],
      attemptNumber: 1,
      eventId: createEventId("event-1"),
      outcome: "correct" as const,
      skillIds: ["receptive-vocabulary"],
      taskId: "plaats-boot",
    };

    await runtime.practice.append(observation);
    await runtime.practice.append(observation);

    expect(runtime.captured.observations).toHaveLength(1);
  });

  it("onderscheidt ontbrekende vereiste en optionele capabilities", () => {
    const manifest = defineGameManifest({
      ageRange: { max: 8, min: 4 },
      capabilities: ["audio", "microphone"],
      contentVersion: "capability-test-v1",
      contractVersion: 1,
      description: "Capabilitytest",
      icon: "🎮",
      id: "capability-test",
      offlinePackages: [],
      releaseStatus: "beta",
      requiredCapabilities: ["audio"],
      supportedOrientations: ["portrait"],
      themeId: "vocabulary",
      title: "Capabilitytest",
    });

    expect(getMissingRequiredCapabilities(manifest, new Set(["microphone"]))).toEqual(["audio"]);
    expect(getMissingRequiredCapabilities(manifest, new Set(["audio"]))).toEqual([]);
  });

  it("rapporteert loader rejection en een ontbrekende Game-export", async () => {
    const manifest = getLoadableGameRegistryEntries()[0]?.manifest;
    expect(manifest).toBeDefined();
    if (!manifest) return;

    const rejectedEntry: GameRegistryEntry = {
      load: async () => {
        throw new Error("chunk unavailable");
      },
      manifest,
    };
    const invalidModuleEntry: GameRegistryEntry = {
      load: async () => ({ Game: undefined as never }),
      manifest,
    };

    await expect(loadGameModule(rejectedEntry)).rejects.toThrow("chunk unavailable");
    await expect(loadGameModule(invalidModuleEntry)).rejects.toThrow(
      "exporteert geen geldige Game-component",
    );
  });

  it("vangt een runtime-renderfout zonder de testshell neer te halen", () => {
    const preventExpectedWindowError = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener("error", preventExpectedWindowError);
    const onCrash = vi.fn();
    const CrashingGame = () => {
      throw new Error("render crash");
    };

    render(
      <GameRuntimeBoundary
        correlationId="test-correlation"
        onBack={vi.fn()}
        onCrash={onCrash}
        onRetry={vi.fn()}
      >
        <CrashingGame />
      </GameRuntimeBoundary>,
    );

    expect(screen.getByText("De game is gestopt")).toBeVisible();
    expect(screen.getByText("render crash")).toBeVisible();
    expect(onCrash).toHaveBeenCalledTimes(1);
    window.removeEventListener("error", preventExpectedWindowError);
  });

  it("koppelt ieder offlinepakket aan contentversie en gegenereerd manifestpad", () => {
    getLoadableGameRegistryEntries().forEach(({ manifest }) => {
      manifest.offlinePackages.forEach((offlinePackage) => {
        expect(offlinePackage.contentVersion).toBe(manifest.contentVersion);
        expect(offlinePackage.manifestUrl).toMatch(
          new RegExp(`^/offline/${offlinePackage.id}-v${offlinePackage.version}\\.json$`),
        );
      });
    });
  });
});
