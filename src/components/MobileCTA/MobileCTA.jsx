import { useLocation } from "react-router-dom";
import "./MobileCTA.css";

export default function MobileCTA() {
    const { pathname } = useLocation();
    const openInNewTab = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    if (pathname !== "/") return null;

    return (
        <div className="mobile-cta">
            <button
                type="button"
                className="mobile-cta-button"
                onClick={() =>
                    openInNewTab("https://vitalab.com.ua/qr-code")
                }
            >
                <span className="mobile-cta-button__icon" aria-hidden="true">
                    <img src="/icons/lab.svg" alt="" />
                </span>
                <span className="mobile-cta-button__title">
                    Результати аналізів
                </span>
            </button>
        </div>
    );
}
