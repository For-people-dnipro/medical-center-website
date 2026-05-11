import { useEffect, useState } from "react";
import "./CookieBanner.css";
import {
    applyAnalyticsConsentState,
    getGoogleAnalyticsId,
    getStoredAnalyticsConsent,
    initializeGoogleAnalytics,
    trackPageView,
} from "../../lib/analytics";

const CONSENT_ACCEPTED = "accepted";
const CONSENT_DECLINED = "declined";
const CONSENT_UNSET = "unset";
const CONSENT_LOADING = "loading";

export default function CookieBanner({
    measurementId = getGoogleAnalyticsId(),
}) {
    const [consent, setConsent] = useState(CONSENT_LOADING);

    useEffect(() => {
        initializeGoogleAnalytics(measurementId);

        const storedConsent = getStoredAnalyticsConsent();
        if (storedConsent) {
            applyAnalyticsConsentState(storedConsent);
            setConsent(storedConsent);
            return;
        }

        applyAnalyticsConsentState(CONSENT_DECLINED);
        setConsent(CONSENT_UNSET);
    }, []);

    useEffect(() => {
        if (consent === CONSENT_ACCEPTED) {
            initializeGoogleAnalytics(measurementId);
            applyAnalyticsConsentState(CONSENT_ACCEPTED);
        }

        if (consent === CONSENT_DECLINED) {
            initializeGoogleAnalytics(measurementId);
            applyAnalyticsConsentState(CONSENT_DECLINED);
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
            applyAnalyticsConsentState(CONSENT_ACCEPTED);
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
        initializeGoogleAnalytics(measurementId);
        applyAnalyticsConsentState(CONSENT_DECLINED);
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
