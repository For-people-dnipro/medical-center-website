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
            <div className="mobile-cta-buttons">
                <button
                    type="button"
                    className="mobile-btn"
                    onClick={() => openInNewTab("/declaration")}
                >
                    <div className="mobile-btn-content">
                        <span className="mobile-btn-icon">
                            <img src="/icons/document.svg" alt="" />
                        </span>
                        <span className="mobile-btn-text">
                            Підписати декларацію
                        </span>
                    </div>
                </button>

                <button
                    type="button"
                    className="mobile-btn"
                    onClick={() =>
                        openInNewTab("https://vitalab.com.ua/qr-code")
                    }
                >
                    <div className="mobile-btn-content">
                        <span className="mobile-btn-icon">
                            <img src="/icons/lab.svg" alt="" />
                        </span>
                        <span className="mobile-btn-text">
                            Результати аналізів
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );
}
