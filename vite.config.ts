import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";

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
    rollupOptions: {
      output: {
        manualChunks: (id) =>
          id.includes("/src/app/games/strand-bezem-escape/")
            ? "game-strand-bezem-escape"
            : undefined,
      },
    },
  },
  plugins: [
    react(),
    figmaAssetResolver(),
    tailwindcss(),
    VitePWA({
      injectRegister: false,
      manifest: false,
      registerType: "prompt",
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: false,
        globIgnores: [
          "**/game-*.js",
          "assets/**/*.{avif,gif,jpeg,jpg,mp3,mp4,png,svg,webm,webp}",
          "**/.vite/**",
          "**/offline/**",
        ],
        globPatterns: ["**/*.{css,html,ico,js,webmanifest}", "pwa/*.png"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//, /^\/offline\//],
        runtimeCaching: [
          {
            handler: "CacheFirst",
            options: {
              cacheName: "game-wereld-code-v1",
              cacheableResponse: { statuses: [200] },
              expiration: { maxAgeSeconds: 2_592_000, maxEntries: 80 },
            },
            urlPattern: ({ request, url }) =>
              url.origin === self.location.origin &&
              (request.destination === "script" || request.destination === "style"),
          },
          {
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "game-wereld-images-v1",
              cacheableResponse: { statuses: [200] },
              expiration: { maxAgeSeconds: 2_592_000, maxEntries: 80 },
            },
            urlPattern: ({ request, url }) =>
              url.origin === self.location.origin && request.destination === "image",
          },
          {
            handler: "NetworkFirst",
            options: {
              cacheName: "game-wereld-media-runtime-v1",
              cacheableResponse: { statuses: [200, 206] },
              expiration: { maxAgeSeconds: 86_400, maxEntries: 12 },
              networkTimeoutSeconds: 4,
            },
            urlPattern: ({ request, url }) =>
              url.origin === self.location.origin &&
              (request.destination === "audio" || request.destination === "video"),
          },
        ],
        skipWaiting: false,
      },
    }),
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
