import { useEffect } from "react";
import "./PageLoader.css";

const EXIT_DURATION_MS = 320;

export default function PageLoader({ isExiting = false, onExited }) {
    useEffect(() => {
        document.body.classList.add("page-loader-active");

        return () => {
            document.body.classList.remove("page-loader-active");
        };
    }, []);

    useEffect(() => {
        if (!isExiting) return undefined;

        const exitTimer = window.setTimeout(() => {
            if (typeof onExited === "function") {
                onExited();
            }
        }, EXIT_DURATION_MS);

        return () => window.clearTimeout(exitTimer);
    }, [isExiting, onExited]);

    return (
        <div
            className={`page-loader ${isExiting ? "page-loader--exit" : ""}`}
            role="status"
            aria-live="polite"
            aria-label="Завантаження сторінки"
        >
            <div className="page-loader__spinner" aria-hidden="true" />
        </div>
    );
}
