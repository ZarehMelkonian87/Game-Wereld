import assert from "node:assert/strict";
import test from "node:test";
import { evaluatePerformanceBudgets } from "./check-bundle-budget.mjs";

const config = {
  gameJavaScriptGzip: { limitBytes: 250, mainBaselineBytes: 100 },
  longTask: { limitMilliseconds: 100 },
  offlinePackage: {
    approvalReference: "ADR-test",
    approvalThresholdBytes: 500,
    approvedAboveThreshold: true,
    limitBytes: 1_000,
  },
  shellCssGzip: { limitBytes: 40, mainBaselineBytes: 20 },
  shellJavaScriptGzip: { limitBytes: 200, mainBaselineBytes: 100 },
};

test("accepteert metingen binnen absolute budgetten", () => {
  const result = evaluatePerformanceBudgets(
    {
      gameJavaScriptGzip: 200,
      offlinePackage: 900,
      shellCssGzip: 30,
      shellJavaScriptGzip: 150,
    },
    config,
  );
  assert.equal(result.passed, true);
});

test("blokkeert een bewust te grote chunk met een benoemd resultaat", () => {
  const result = evaluatePerformanceBudgets(
    {
      gameJavaScriptGzip: 251,
      offlinePackage: 400,
      shellCssGzip: 30,
      shellJavaScriptGzip: 150,
    },
    config,
  );
  assert.equal(result.passed, false);
  assert.deepEqual(
    result.results.find(({ label }) => label.includes("gamechunk")),
    {
      actual: 251,
      baseline: 100,
      label: "gamechunk JavaScript gzip",
      limit: 250,
      passed: false,
    },
  );
});
