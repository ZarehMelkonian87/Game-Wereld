import { z } from "zod";
import type {
  DiagnosticEvent,
  DiagnosticInput,
  DiagnosticLogger,
} from "../game-platform/contracts";

const diagnosticContextSchema = z
  .object({
    capability: z.string().min(1).max(80).optional(),
    contentVersion: z.string().min(1).max(80).optional(),
    errorCode: z.string().min(1).max(80).optional(),
    gameId: z.string().min(1).max(80).optional(),
    operation: z.string().min(1).max(80).optional(),
    recovery: z.string().min(1).max(120).optional(),
    route: z.string().min(1).max(160).optional(),
    state: z.string().min(1).max(80).optional(),
  })
  .strict();

export const diagnosticEventSchema = z
  .object({
    context: diagnosticContextSchema,
    correlationId: z.string().uuid(),
    event: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    release: z.string().min(1).max(80),
    severity: z.enum(["debug", "error", "info", "warn"]),
    subsystem: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    timestamp: z.iso.datetime(),
  })
  .strict();

export interface DiagnosticSink {
  write: (event: DiagnosticEvent) => void;
}

export interface DiagnosticRingBuffer extends DiagnosticSink {
  clear: () => void;
  getSnapshot: () => readonly DiagnosticEvent[];
  subscribe: (listener: () => void) => () => void;
}

export interface CentralDiagnosticLogger extends DiagnosticLogger {
  record: (input: DiagnosticInput) => DiagnosticEvent;
}

export const createDiagnosticRingBuffer = (capacity = 100): DiagnosticRingBuffer => {
  let events: DiagnosticEvent[] = [];
  const listeners = new Set<() => void>();
  const publish = () => listeners.forEach((listener) => listener());

  return {
    clear: () => {
      events = [];
      publish();
    },
    getSnapshot: () => events,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    write: (event) => {
      events = [...events.slice(-(capacity - 1)), event];
      publish();
    },
  };
};

export const createDiagnosticCollector = (): DiagnosticSink & {
  events: DiagnosticEvent[];
} => {
  const events: DiagnosticEvent[] = [];
  return { events, write: (event) => events.push(event) };
};

export const createDevelopmentConsoleSink = (): DiagnosticSink => ({
  write: (event) => {
    const write = event.severity === "debug" ? console.debug : console[event.severity];
    write(`[${event.correlationId}] ${event.subsystem}:${event.event}`, event);
  },
});

export const createDiagnosticLogger = ({
  clock = { now: () => new Date() },
  createCorrelationId = () => crypto.randomUUID(),
  release,
  sinks,
}: {
  clock?: { now: () => Date };
  createCorrelationId?: () => string;
  release: string;
  sinks: DiagnosticSink[];
}): CentralDiagnosticLogger => {
  const record = (input: DiagnosticInput) => {
    const event = diagnosticEventSchema.parse({
      context: input.context ?? {},
      correlationId: input.correlationId ?? createCorrelationId(),
      event: input.event,
      release,
      severity: input.severity,
      subsystem: input.subsystem,
      timestamp: clock.now().toISOString(),
    });
    sinks.forEach((sink) => sink.write(event));
    return event;
  };

  return { log: record, record };
};
