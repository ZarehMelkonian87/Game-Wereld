import {
  createDevelopmentConsoleSink,
  createDiagnosticLogger,
  createDiagnosticRingBuffer,
} from "./diagnosticLogger";

export const APP_RELEASE = import.meta.env.VITE_APP_RELEASE ?? "1.0.0";
export const diagnosticRingBuffer = createDiagnosticRingBuffer(100);

export const appDiagnostics = createDiagnosticLogger({
  release: APP_RELEASE,
  sinks: [diagnosticRingBuffer, ...(import.meta.env.DEV ? [createDevelopmentConsoleSink()] : [])],
});
