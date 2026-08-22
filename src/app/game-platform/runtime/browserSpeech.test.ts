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

  start = () => {
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
