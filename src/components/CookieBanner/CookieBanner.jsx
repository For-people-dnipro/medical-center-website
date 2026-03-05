import { useEffect, useState } from "react";
import "./CookieBanner.css";
import { initializeGoogleAnalytics, trackPageView } from "../../lib/analytics";

const CONSENT_STORAGE_KEY = "cookie-consent";
const CONSENT_ACCEPTED = "accepted";
const CONSENT_DECLINED = "declined";
const CONSENT_UNSET = "unset";
const CONSENT_LOADING = "loading";

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
        const initialized = initializeGoogleAnalytics(measurementId);
        if (initialized) {
            trackPageView();
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
                    аналітики. Оберіть, чи погоджуєтесь ви на використання
                    аналітичних cookies.
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
