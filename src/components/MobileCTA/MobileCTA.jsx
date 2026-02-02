import { useLocation } from "react-router-dom";
import "./MobileCTA.css";

export default function MobileCTA() {
    const { pathname } = useLocation();

    if (pathname !== "/") return null;

    return (
        <div className="mobile-cta">
            <div className="mobile-cta-buttons">
                <button className="mobile-btn">
                    <div className="mobile-btn-content">
                        <span className="mobile-btn-icon">
                            <img src="/icons/document.svg" alt="" />
                        </span>
                        <span className="mobile-btn-text">
                            Підписати декларацію
                        </span>
                    </div>
                </button>

                <button className="mobile-btn">
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
