import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import "./styles/global.css";
import "./styles/typography.css";

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
