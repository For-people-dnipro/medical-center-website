import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { beasties } from "vite-plugin-beasties";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const isProductionBuild = mode === "production";
    const configuredApiUrl =
        env.VITE_API_URL || env.VITE_STRAPI_URL || "";

    if (isProductionBuild && !configuredApiUrl.trim()) {
        throw new Error(
            "Production build requires VITE_API_URL or VITE_STRAPI_URL.",
        );
    }

    const apiProxyTarget =
        env.VITE_API_PROXY_TARGET ||
        configuredApiUrl ||
        "http://localhost:1337";

    return {
        plugins: [
            react(),
            beasties({
                options: {
                    preload: "swap",
                    pruneSource: false,
                    inlineFonts: false,
                    compress: true,
                    logLevel: "info",
                },
            }),
        ],
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        "vendor-react": ["react", "react-dom", "react-router-dom"],
                        "vendor-swiper": ["swiper"],
                        "vendor-ui": ["lucide-react", "react-helmet-async"],
                    },
                },
            },
            minify: "esbuild",
        },
        esbuild: {
            drop: mode === "production" ? ["console", "debugger"] : [],
        },
        server: {
            host: "localhost",
            port: 5173,
            strictPort: true,
            proxy: {
                "/api": {
                    target: apiProxyTarget,
                    changeOrigin: true,
                },
                "/uploads": {
                    target: apiProxyTarget,
                    changeOrigin: true,
                },
            },
        },
    };
});
