import { describe, expect, it } from "vitest";
import {
  createDiagnosticCollector,
  createDiagnosticLogger,
  createDiagnosticRingBuffer,
} from "./diagnosticLogger";

const createLogger = () => {
  const collector = createDiagnosticCollector();
  const logger = createDiagnosticLogger({
    clock: { now: () => new Date("2026-07-23T10:00:00.000Z") },
    createCorrelationId: () => "00000000-0000-4000-8000-000000000001",
    release: "test-release",
    sinks: [collector],
  });
  return { collector, logger };
};

describe("privacyveilige diagnostieklogger", () => {
  it("vult release, tijd en correlation-id centraal in", () => {
    const { collector, logger } = createLogger();

    logger.record({
      context: { operation: "open-database", recovery: "retry" },
      event: "storage-open-failed",
      severity: "error",
      subsystem: "storage",
    });

    expect(collector.events).toEqual([
      {
        context: { operation: "open-database", recovery: "retry" },
        correlationId: "00000000-0000-4000-8000-000000000001",
        event: "storage-open-failed",
        release: "test-release",
        severity: "error",
        subsystem: "storage",
        timestamp: "2026-07-23T10:00:00.000Z",
      },
    ]);
  });

  it.each(["profileName", "transcript", "rawAnswer", "audio"])(
    "weigert verboden contextveld %s",
    (field) => {
      const { logger } = createLogger();

      expect(() =>
        logger.record({
          context: { [field]: "kinddata" },
          event: "privacy-test",
          severity: "warn",
          subsystem: "test",
        }),
      ).toThrow();
    },
  );

  it("begrensd de ringbuffer op de nieuwste 100 veilige events", () => {
    const ringBuffer = createDiagnosticRingBuffer(100);
    const logger = createDiagnosticLogger({
      clock: { now: () => new Date("2026-07-23T10:00:00.000Z") },
      createCorrelationId: () => "00000000-0000-4000-8000-000000000001",
      release: "test",
      sinks: [ringBuffer],
    });

    for (let index = 0; index < 105; index += 1) {
      logger.record({
        context: { state: String(index) },
        event: "bounded-event",
        severity: "info",
        subsystem: "test",
      });
    }

    expect(ringBuffer.getSnapshot()).toHaveLength(100);
    expect(ringBuffer.getSnapshot()[0]?.context.state).toBe("5");
  });
});
