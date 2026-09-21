import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createBrowserSpeechRecognition,
  getBrowserSpeechRecognitionSupport,
} from "./browserSpeech";
import type { VoiceRecognitionResult } from "../contracts";

interface MockSpeechAlternative {
  confidence: number;
  transcript: string;
}

interface MockSpeechResult {
  0: MockSpeechAlternative;
  isFinal: boolean;
  length: number;
}

interface MockSpeechRecognitionEvent {
  resultIndex: number;
  results: MockSpeechResult[];
}

let emitResult: ((event: MockSpeechRecognitionEvent) => void) | null = null;

class MockSpeechRecognition {
  readonly continuous = false;
  readonly interimResults = false;
  readonly lang = "nl-NL";
  readonly maxAlternatives = 3;
  onend: (() => void) | null = null;
  onerror: ((event: { error?: string; message?: string }) => void) | null = null;
  onnomatch: (() => void) | null = null;
  onresult: ((event: MockSpeechRecognitionEvent) => void) | null = null;
  onspeechend: (() => void) | null = null;
  onstart: (() => void) | null = null;

  abort = () => {
    this.onend?.();
  };

  static latest: MockSpeechRecognition | null = null;

  start = () => {
    MockSpeechRecognition.latest = this;
    emitResult = (event) => {
      this.onresult?.(event);
    };
    this.onstart?.();
  };

  stop = () => {
    this.onend?.();
  };
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: unknown;
  webkitSpeechRecognition?: unknown;
}

describe("browserSpeech runtime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    emitResult = null;
    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: true,
      writable: true,
    });
    const speechWindow = window as WindowWithSpeech;
    speechWindow.SpeechRecognition = MockSpeechRecognition;
    delete speechWindow.webkitSpeechRecognition;
  });

  afterEach(() => {
    vi.useRealTimers();
    const speechWindow = window as WindowWithSpeech;
    delete speechWindow.SpeechRecognition;
  });

  it("detecteert correcte browser support in een veilige context", () => {
    const support = getBrowserSpeechRecognitionSupport();
    expect(support.isSupported).toBe(true);
    expect(support.isSecureContext).toBe(true);
  });

  it("voegt meerdere continue resultaatsegmenten samen tot een complete zin", () => {
    const results: VoiceRecognitionResult[] = [];
    const session = createBrowserSpeechRecognition({
      continuous: true,
      interimResults: true,
      onResult: (res) => results.push(res),
    });

    session?.start();
    expect(emitResult).not.toBeNull();

    const seg1: MockSpeechResult = {
      0: { confidence: 0.9, transcript: "Zet de gele zeester" },
      isFinal: true,
      length: 1,
    };

    emitResult?.({
      resultIndex: 0,
      results: [seg1],
    });

    expect(results).toHaveLength(1);
    expect(results[0].transcript).toBe("Zet de gele zeester");

    const seg2: MockSpeechResult = {
      0: { confidence: 0.85, transcript: "onder de parasol" },
      isFinal: true,
      length: 1,
    };

    emitResult?.({
      resultIndex: 1,
      results: [seg1, seg2],
    });

    expect(results).toHaveLength(2);
    expect(results[1].transcript).toBe("Zet de gele zeester onder de parasol");
    expect(results[1].isFinal).toBe(true);
  });

  it("negeert lege resultaat-events en meldt alleen een echt nomatch-event (T-52, Android)", () => {
    const results: VoiceRecognitionResult[] = [];
    let noMatchCount = 0;
    const session = createBrowserSpeechRecognition({
      continuous: true,
      interimResults: true,
      latestSegmentOnly: true,
      onNoMatch: () => {
        noMatchCount += 1;
      },
      onResult: (res) => results.push(res),
    });
    session?.start();

    // Android stuurt bij het begin van spreken een reeks resultaten zonder tekst.
    const emptySegment: MockSpeechResult = {
      0: { confidence: 0, transcript: "" },
      isFinal: false,
      length: 1,
    };
    emitResult?.({ resultIndex: 0, results: [emptySegment] });
    emitResult?.({ resultIndex: 0, results: [emptySegment] });
    expect(results).toHaveLength(0);
    expect(noMatchCount).toBe(0);

    // Het echte nomatch-event telt wél.
    const recognition = MockSpeechRecognition.latest;
    recognition?.onnomatch?.();
    expect(noMatchCount).toBe(1);
  });

  it("behandelt een 'definitief' segment zonder zekerheid als tussentijds (T-52, Android)", () => {
    const results: VoiceRecognitionResult[] = [];
    const session = createBrowserSpeechRecognition({
      continuous: true,
      interimResults: true,
      latestSegmentOnly: true,
      onResult: (res) => results.push(res),
    });
    session?.start();

    // Android Chrome: groeiend tussenresultaat, isFinal=true maar confidence 0.
    emitResult?.({
      resultIndex: 0,
      results: [{ 0: { confidence: 0, transcript: "zet de" }, isFinal: true, length: 1 }],
    });
    emitResult?.({
      resultIndex: 0,
      results: [{ 0: { confidence: 0, transcript: "zet de bal op" }, isFinal: true, length: 1 }],
    });
    // Het echte eindresultaat heeft een zekerheid > 0.
    emitResult?.({
      resultIndex: 0,
      results: [
        {
          0: { confidence: 0.91, transcript: "zet de bal op het strand" },
          isFinal: true,
          length: 1,
        },
      ],
    });

    expect(results.map((res) => res.isFinal)).toEqual([false, false, true]);
    expect(results[2].transcript).toBe("zet de bal op het strand");
  });

  it("slaat verouderde tussenstanden over die Android als extra segmenten toevoegt (T-52)", () => {
    const results: VoiceRecognitionResult[] = [];
    const session = createBrowserSpeechRecognition({
      continuous: true,
      interimResults: true,
      onResult: (res) => results.push(res),
    });
    session?.start();

    // Android: elk tussenresultaat komt als nieuw "definitief" segment (zekerheid 0)
    // erbij; het echte eindresultaat (zekerheid > 0) volgt als laatste.
    const stale = (transcript: string): MockSpeechResult => ({
      0: { confidence: 0, transcript },
      isFinal: true,
      length: 1,
    });
    emitResult?.({ resultIndex: 0, results: [stale("zet")] });
    emitResult?.({ resultIndex: 1, results: [stale("zet"), stale("zet de")] });
    emitResult?.({
      resultIndex: 2,
      results: [stale("zet"), stale("zet de"), stale("zet de zon boven")],
    });
    emitResult?.({
      resultIndex: 3,
      results: [
        stale("zet"),
        stale("zet de"),
        stale("zet de zon boven"),
        { 0: { confidence: 0.9, transcript: "zet de zon boven de zee" }, isFinal: true, length: 1 },
      ],
    });

    expect(results.map((res) => res.transcript)).toEqual([
      "zet",
      "zet de",
      "zet de zon boven",
      "zet de zon boven de zee",
    ]);
    expect(results.map((res) => res.isFinal)).toEqual([false, false, false, true]);
  });

  it("reset en activeert de adaptieve stiltetimer na spraak", () => {
    const statusChanges: string[] = [];
    const session = createBrowserSpeechRecognition({
      autoStopMs: 15000,
      continuous: true,
      onStatusChange: (status) => statusChanges.push(status),
      silenceStopMs: 2500,
    });

    session?.start();
    expect(statusChanges).toContain("listening");

    vi.advanceTimersByTime(2000);
    const seg: MockSpeechResult = {
      0: { confidence: 0.9, transcript: "Zet de rode krab" },
      isFinal: false,
      length: 1,
    };

    emitResult?.({
      resultIndex: 0,
      results: [seg],
    });

    vi.advanceTimersByTime(2000);
    expect(statusChanges).not.toContain("processing");

    vi.advanceTimersByTime(600);
    expect(statusChanges).toContain("processing");
  });

  it("stopt automatisch na de 15 seconden maximumduur bij stilte", () => {
    const statusChanges: string[] = [];
    const session = createBrowserSpeechRecognition({
      autoStopMs: 15000,
      onStatusChange: (status) => statusChanges.push(status),
      silenceStopMs: 2500,
    });

    session?.start();
    expect(statusChanges).toContain("listening");

    vi.advanceTimersByTime(15000);
    expect(statusChanges).toContain("processing");
  });
});
