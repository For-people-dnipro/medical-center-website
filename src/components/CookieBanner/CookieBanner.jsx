import { useEffect, useState } from "react";
import "./CookieBanner.css";

const CONSENT_STORAGE_KEY = "cookie-consent";
const CONSENT_ACCEPTED = "accepted";
const CONSENT_DECLINED = "declined";
const CONSENT_UNSET = "unset";
const CONSENT_LOADING = "loading";

function initializeGoogleAnalytics(measurementId) {
    if (typeof window === "undefined" || !measurementId) {
        return;
    }

    if (window.__gaInitialized === measurementId) {
        return;
    }

    const scriptSelector = `script[data-ga-id="${measurementId}"]`;
    if (!document.querySelector(scriptSelector)) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        script.dataset.gaId = measurementId;
        document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", measurementId, { anonymize_ip: true });
    window.__gaInitialized = measurementId;
}

export default function CookieBanner({
    measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "",
}) {
    const [consent, setConsent] = useState(CONSENT_LOADING);

    useEffect(() => {
        try {
            const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
            if (
                storedConsent === CONSENT_ACCEPTED ||
                storedConsent === CONSENT_DECLINED
            ) {
                setConsent(storedConsent);
                return;
            }
        } catch {
            // no-op: if storage is unavailable, show banner
        }

        setConsent(CONSENT_UNSET);
    }, []);

    useEffect(() => {
        if (consent === CONSENT_ACCEPTED) {
            initializeGoogleAnalytics(measurementId);
        }
    }, [consent, measurementId]);

    const handleAccept = () => {
        try {
            localStorage.setItem(CONSENT_STORAGE_KEY, CONSENT_ACCEPTED);
        } catch {
            // no-op
        }
        setConsent(CONSENT_ACCEPTED);
    };

    const handleReject = () => {
        try {
            localStorage.setItem(CONSENT_STORAGE_KEY, CONSENT_DECLINED);
        } catch {
            // no-op
        }
        setConsent(CONSENT_DECLINED);
    };

    if (consent !== CONSENT_UNSET) {
        return null;
    }

    return (
        <div className="cookie-banner" role="dialog" aria-live="polite">
            <div className="cookie-banner__content">
                <p className="cookie-banner__text">
                    Ми використовуємо cookies для покращення роботи сайту та
                    аналітики. Оберіть, чи дозволяєте ви аналітичні cookies.
                </p>

                <div className="cookie-banner__actions">
                    <button
                        type="button"
                        className="cookie-banner__button cookie-banner__button--reject"
                        onClick={handleReject}
                    >
                        Reject
                    </button>
                    <button
                        type="button"
                        className="cookie-banner__button cookie-banner__button--accept"
                        onClick={handleAccept}
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
