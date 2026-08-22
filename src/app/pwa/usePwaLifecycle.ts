import { useSyncExternalStore } from "react";
import { getPwaLifecycleSnapshot, subscribeToPwaLifecycle } from "./pwaLifecycle";

export const usePwaLifecycle = () =>
  useSyncExternalStore(subscribeToPwaLifecycle, getPwaLifecycleSnapshot, getPwaLifecycleSnapshot);
