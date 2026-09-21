import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { DiagnoseMicrofoonScreen } from "./DiagnoseMicrofoonScreen";

class MockSpeechRecognition {
  static instances: MockSpeechRecognition[] = [];
  continuous = false;
  interimResults = false;
  lang = "";
  maxAlternatives = 1;
  onend: (() => void) | null = null;
  onerror: ((event: { error?: string; message?: string }) => void) | null = null;
  onnomatch: (() => void) | null = null;
  onresult: ((event: unknown) => void) | null = null;
  onspeechend: (() => void) | null = null;
  onstart: (() => void) | null = null;
  abort = vi.fn(() => this.onend?.());
  start = vi.fn(() => {
    MockSpeechRecognition.instances.push(this);
    this.onstart?.();
  });
  stop = vi.fn(() => this.onend?.());
}

const reportText = () => (screen.getByTestId("diagnose-report") as HTMLTextAreaElement).value;

const renderScreen = () =>
  render(
    <MemoryRouter>
      <DiagnoseMicrofoonScreen />
    </MemoryRouter>,
  );

describe("DiagnoseMicrofoonScreen (T-52)", () => {
  beforeEach(() => {
    MockSpeechRecognition.instances = [];
    vi.stubGlobal("SpeechRecognition", MockSpeechRecognition);
    // jsdom is geen beveiligde context; de diagnose vereist https zoals de echte app.
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn(async () => ({ getTracks: () => [] })) },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("toont de omgeving en meldt dat SpeechRecognition aanwezig is", async () => {
    renderScreen();
    expect(screen.getByTestId("diagnose-environment-summary").textContent).toContain("browsertab");
    expect(screen.getByTestId("diagnose-speech-api").textContent).toContain(
      "aanwezig (SpeechRecognition)",
    );
    await waitFor(() =>
      expect(screen.getByTestId("diagnose-permission").textContent).not.toContain(
        "nog niet opgevraagd",
      ),
    );
  });

  it("logt toestemming, start, resultaat-callbacks en fouten in het rapport", async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByTestId("diagnose-step-permission"));
    await waitFor(() => expect(reportText()).toContain("resultaat: granted"));

    await user.click(screen.getByTestId("diagnose-step-short"));
    const recognition = MockSpeechRecognition.instances[MockSpeechRecognition.instances.length - 1];
    expect(recognition?.lang).toBe("nl-NL");
    expect(recognition?.continuous).toBe(false);
    expect(reportText()).toContain("onstart — luistert");

    recognition?.onerror?.({ error: "not-allowed", message: "" });
    recognition?.onend?.();
    await waitFor(() => expect(reportText()).toContain("onerror: not-allowed"));
    expect(reportText()).toContain("onend — sessie gestopt");
    // Na onend zijn de stappen weer beschikbaar.
    expect(screen.getByTestId("diagnose-step-continuous")).toBeEnabled();
  });

  it("start de doorlopende variant met dezelfde instellingen als Zeg & Zet", async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByTestId("diagnose-step-continuous"));
    const recognition = MockSpeechRecognition.instances[MockSpeechRecognition.instances.length - 1];
    expect(recognition?.continuous).toBe(true);
    expect(recognition?.interimResults).toBe(true);
    expect(screen.getByTestId("diagnose-stop")).toBeVisible();
    await user.click(screen.getByTestId("diagnose-stop"));
    expect(recognition?.stop).toHaveBeenCalled();
  });

  it("meldt een ontbrekende API zonder te crashen", () => {
    vi.unstubAllGlobals();
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    renderScreen();
    expect(screen.getByTestId("diagnose-speech-api").textContent).toContain("ontbreekt");
    expect(screen.getByTestId("diagnose-speech-api").textContent).toContain("api-missing");
  });
});
