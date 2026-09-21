import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PlatformInfo } from "../../../../platform";
import { MicWaveBars } from "./MicWaveBars";

const platformState: { current: PlatformInfo } = {
  current: { displayMode: "browser", formFactor: "desktop", isInstalled: false, isTouch: false },
};

vi.mock("../../../../platform", () => ({
  usePlatform: () => platformState.current,
}));

const installGetUserMedia = () => {
  const getUserMedia = vi.fn(async () => ({ getTracks: () => [] }));
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });
  return getUserMedia;
};

describe("MicWaveBars (T-52/T-53: geen eigen mic-opname op mobiel)", () => {
  afterEach(() => {
    platformState.current = {
      displayMode: "browser",
      formFactor: "desktop",
      isInstalled: false,
      isTouch: false,
    };
  });

  it("opent op desktop een getUserMedia-stream voor de audio-reactieve wave", async () => {
    const getUserMedia = installGetUserMedia();
    const { container } = render(<MicWaveBars />);
    await waitFor(() => expect(getUserMedia).toHaveBeenCalledTimes(1));
    expect(
      container.querySelector('[data-slot="mic-wave-bars"]')?.getAttribute("data-audio-reactive"),
    ).toBe("true");
  });

  it.each(["phone", "tablet"] as const)(
    "laat op %s de microfoon aan de spraakherkenner en toont een luister-animatie",
    async (formFactor) => {
      platformState.current = {
        displayMode: "standalone",
        formFactor,
        isInstalled: true,
        isTouch: true,
      };
      const getUserMedia = installGetUserMedia();
      const { container } = render(<MicWaveBars />);
      const wave = container.querySelector('[data-slot="mic-wave-bars"]');
      expect(wave?.getAttribute("data-audio-reactive")).toBe("false");
      await waitFor(() => {
        const bar = wave?.querySelector("span");
        expect(bar?.style.animation).toContain("micWaveListening");
      });
      expect(getUserMedia).not.toHaveBeenCalled();
    },
  );
});
