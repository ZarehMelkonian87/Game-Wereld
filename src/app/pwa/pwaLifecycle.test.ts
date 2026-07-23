import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const serviceWorkerMock = vi.hoisted(() => ({
  callbacks: {} as { onNeedRefresh?: () => void },
  update: vi.fn(async () => undefined),
}));

import {
  acquireActiveGameSession,
  activateWaitingPwaUpdate,
  getPwaLifecycleSnapshot,
  registerPwaWorker,
  resetPwaLifecycleForTests,
} from "./pwaLifecycle";

beforeEach(() => {
  resetPwaLifecycleForTests();
  serviceWorkerMock.update.mockClear();
  Object.defineProperty(navigator, "serviceWorker", { configurable: true, value: {} });
});

afterEach(() => {
  Reflect.deleteProperty(navigator, "serviceWorker");
});

describe("PWA-updatelifecycle", () => {
  it("stelt activatie uit tijdens een game en staat haar na veilige exit toe", async () => {
    await registerPwaWorker((callbacks) => {
      serviceWorkerMock.callbacks = callbacks;
      return serviceWorkerMock.update;
    });
    const release = acquireActiveGameSession();
    serviceWorkerMock.callbacks.onNeedRefresh?.();

    expect(getPwaLifecycleSnapshot().status).toBe("update-postponed");
    await activateWaitingPwaUpdate();
    expect(serviceWorkerMock.update).not.toHaveBeenCalled();

    release();
    expect(getPwaLifecycleSnapshot().status).toBe("update-waiting");
    await activateWaitingPwaUpdate();
    expect(serviceWorkerMock.update).toHaveBeenCalledWith(true);
  });
});
