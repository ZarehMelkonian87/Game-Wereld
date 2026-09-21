import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";
import { resolveBasePath } from "./scripts/resolve-base-path.mjs";

const devDistAssetsPlugin = (): Plugin => ({
  name: "dev-dist-assets",
  configureServer: (server) => {
    server.middlewares.use((req, res, next) => {
      const url = req.url ? req.url.split("?")[0] : "";
      if (url.startsWith("/assets/")) {
        const fileName = path.basename(url);
        const filePath = path.resolve(__dirname, "dist/assets", fileName);
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          const ext = path.extname(filePath).toLowerCase();
          const mimeTypes: Record<string, string> = {
            ".css": "text/css",
            ".js": "text/javascript",
            ".json": "application/json",
            ".mp3": "audio/mpeg",
            ".mp4": "video/mp4",
            ".png": "image/png",
            ".svg": "image/svg+xml",
            ".webp": "image/webp",
          };
          res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
            "Content-Length": stat.size,
            "Content-Type": mimeTypes[ext] || "application/octet-stream",
          });
          return fs.createReadStream(filePath).pipe(res);
        }
      }
      next();
    });
  },
});

const figmaAssetResolver = (): Plugin => {
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
  base: resolveBasePath(),
  define: {
    // Bouwmoment, zichtbaar in de microfoon-diagnose (T-52) zodat je op een
    // toestel kunt zien of de laatste release al geladen is.
    __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: (id) =>
          id.includes("/src/app/games/magisch-strand-avontuur/") && !id.endsWith("/manifest.ts")
            ? "game-magisch-strand-avontuur"
            : id.includes("/src/app/games/rekenen-strand/") && !id.endsWith("/manifest.ts")
              ? "game-rekenen-strand"
              : undefined,
      },
    },
  },
  plugins: [
    devDistAssetsPlugin(),
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
            handler: "CacheFirst",
            options: {
              cacheName: "game-wereld-media-runtime-v3",
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxAgeSeconds: 2_592_000, maxEntries: 250 },
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
