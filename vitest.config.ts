import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    __APP_BUILD_TIME__: JSON.stringify("test-build"),
  },
  plugins: [react()],
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
    },
    environment: "jsdom",
    exclude: ["e2e/**", "node_modules/**", "dist/**"],
    setupFiles: ["./test/setup.ts"],
  },
});
