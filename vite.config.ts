import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
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
  plugins: [react(), figmaAssetResolver(), tailwindcss()],
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
