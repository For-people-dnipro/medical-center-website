import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const helmetPackagePath = fileURLToPath(
    new URL("./node_modules/react-helmet-async/package.json", import.meta.url),
);
const helmetFallbackPath = fileURLToPath(
    new URL("./src/shims/reactHelmetAsync.js", import.meta.url),
);
const helmetAlias = fs.existsSync(helmetPackagePath)
    ? {}
    : {
          "react-helmet-async": helmetFallbackPath,
      };

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: helmetAlias,
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:1337",
                changeOrigin: true,
            },
            "/uploads": {
                target: "http://localhost:1337",
                changeOrigin: true,
            },
        },
    },
});
