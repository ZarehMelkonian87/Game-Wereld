import type { PracticeEventEnvelope } from "./schemas";

export const RAW_PRACTICE_EVENT_RETENTION_MONTHS = 24;

export type RetentionDecision = "retain" | "review-for-compaction";

export const evaluatePracticeEventRetention = (
  event: PracticeEventEnvelope,
  now: Date,
): RetentionDecision => {
  const reviewBefore = new Date(now);
  reviewBefore.setUTCMonth(reviewBefore.getUTCMonth() - RAW_PRACTICE_EVENT_RETENTION_MONTHS);
  return event.occurredAt < reviewBefore.toISOString() ? "review-for-compaction" : "retain";
};
