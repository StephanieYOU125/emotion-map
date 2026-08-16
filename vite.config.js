import { copyFileSync, mkdirSync } from "node:fs";
import { defineConfig } from "vite";

const pwaFiles = [
  ["manifest.webmanifest", "manifest.webmanifest"],
  ["service-worker.js", "service-worker.js"],
  ["assets/app-icon.svg", "assets/app-icon.svg"],
  ["assets/icon-192.png", "assets/icon-192.png"],
  ["assets/icon-512.png", "assets/icon-512.png"],
  ["assets/icon-maskable-512.png", "assets/icon-maskable-512.png"],
  ["assets/apple-touch-icon.png", "assets/apple-touch-icon.png"]
];

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "app.js",
        assetFileNames: assetInfo => {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? "asset";
          if (name.endsWith(".css")) return "styles.css";
          if (name.endsWith(".webmanifest")) return "[name][extname]";
          return "assets/[name][extname]";
        }
      }
    }
  },
  plugins: [{
    name: "copy-pwa-files",
    closeBundle() {
      mkdirSync("dist/assets", { recursive: true });
      pwaFiles.forEach(([source, destination]) => copyFileSync(source, `dist/${destination}`));
    }
  }]
});
