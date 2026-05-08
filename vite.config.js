import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const apiProxyTarget =
        env.VITE_API_PROXY_TARGET ||
        env.VITE_API_URL ||
        env.VITE_STRAPI_URL ||
        "http://localhost:1337";

    return {
        plugins: [react()],
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        "vendor-react": ["react", "react-dom", "react-router-dom"],
                        "vendor-maps": ["@react-google-maps/api"],
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
