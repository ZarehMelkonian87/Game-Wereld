import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

const figmaAssetResolver = () => {
  return {
    name: "figma-asset-resolver",
    resolveId: (id) => {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
};
export default defineConfig({
  build: {
    manifest: true,
  },
  plugins: [
    react(),
    figmaAssetResolver(),
    tailwindcss(),
    process.env.ANALYZE === "true"
      ? visualizer({
          brotliSize: true,
          filename: "reports/bundle.html",
          gzipSize: true,
          open: false,
          template: "treemap",
        })
      : undefined,
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: false,
    open: false,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: false,
    allowedHosts: true,
  },
});
