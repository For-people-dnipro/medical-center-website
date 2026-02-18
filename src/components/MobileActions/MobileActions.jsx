import "./MobileActions.css";

export default function MobileActions() {
    const openInNewTab = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="mobile-actions">
            <button
                type="button"
                className="mobile-btn purple"
                onClick={() => openInNewTab("/declaration")}
            >
                Підписати декларацію
            </button>
            <button
                type="button"
                className="mobile-btn teal"
                onClick={() => openInNewTab("https://vitalab.com.ua/qr-code")}
            >
                Результати аналізів
            </button>
        </div>
    );
}
