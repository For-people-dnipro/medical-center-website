import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import "./styles/fonts.css";
import "./styles/global.css";
import "./styles/typography.css";

const CHUNK_ERROR_RE =
    /Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i;
const CHUNK_RELOAD_KEY = "__chunk_reload_at";

function reloadOnce() {
    try {
        const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
        if (Date.now() - last < 10000) return;
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
    } catch {}
    window.location.reload();
}

window.addEventListener("vite:preloadError", reloadOnce);
window.addEventListener("error", (event) => {
    if (event?.message && CHUNK_ERROR_RE.test(event.message)) reloadOnce();
});
window.addEventListener("unhandledrejection", (event) => {
    const message = event?.reason?.message || String(event?.reason || "");
    if (CHUNK_ERROR_RE.test(message)) reloadOnce();
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <ScrollToTop />
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </StrictMode>,
);
