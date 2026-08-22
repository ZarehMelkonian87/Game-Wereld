import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("publiceert een restrictief headerbeleid zonder script-eval", () => {
  const headers = fs.readFileSync("public/_headers", "utf8");
  for (const requiredHeader of [
    "Content-Security-Policy:",
    "Permissions-Policy:",
    "Referrer-Policy:",
    "X-Content-Type-Options:",
    "X-Frame-Options:",
  ]) {
    assert.match(headers, new RegExp(requiredHeader));
  }
  assert.doesNotMatch(headers, /script-src[^;\n]*'unsafe-inline'/);
  assert.doesNotMatch(headers, /'unsafe-eval'/);
});

test("index bevat geen inline uitvoerbaar script", () => {
  const html = fs.readFileSync("index.html", "utf8");
  assert.doesNotMatch(html, /<script(?![^>]*type="module"[^>]*src=)[^>]*>/);
});
