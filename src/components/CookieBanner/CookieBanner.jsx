import { useEffect, useState } from "react";
import "./CookieBanner.css";
import {
    applyAnalyticsConsentState,
    CONSENT_ACCEPTED as STORED_CONSENT_ACCEPTED,
    CONSENT_DECLINED as STORED_CONSENT_DECLINED,
    getGoogleAnalyticsId,
    getStoredAnalyticsConsent,
    initializeGoogleAnalytics,
    setStoredAnalyticsConsent,
    trackPageView,
} from "../../lib/analytics";

const CONSENT_ACCEPTED = STORED_CONSENT_ACCEPTED;
const CONSENT_DECLINED = STORED_CONSENT_DECLINED;
const CONSENT_UNSET = "unset";

export default function CookieBanner({
    measurementId = getGoogleAnalyticsId(),
}) {
    const [consent, setConsent] = useState(() => {
        const storedConsent = getStoredAnalyticsConsent();
        return storedConsent || CONSENT_UNSET;
    });

    useEffect(() => {
        if (consent === CONSENT_ACCEPTED) {
            initializeGoogleAnalytics(measurementId);
        }

        applyAnalyticsConsentState(
            consent === CONSENT_UNSET ? CONSENT_DECLINED : consent,
        );
    }, [consent, measurementId]);

    const handleAccept = () => {
        setStoredAnalyticsConsent(CONSENT_ACCEPTED);
        const initialized = initializeGoogleAnalytics(measurementId);
        if (initialized) {
            applyAnalyticsConsentState(CONSENT_ACCEPTED);
            trackPageView();
        }
        setConsent(CONSENT_ACCEPTED);
    };

    const handleReject = () => {
        setStoredAnalyticsConsent(CONSENT_DECLINED);
        applyAnalyticsConsentState(CONSENT_DECLINED);
        setConsent(CONSENT_DECLINED);
    };

    if (consent !== CONSENT_UNSET) {
        return null;
    }

    return (
        <div
            className="cookie-banner"
            role="dialog"
            aria-modal="false"
            aria-label="Налаштування файлів cookie"
            aria-live="polite"
        >
            <div className="cookie-banner__content">
                <p className="cookie-banner__text">
                    Ми використовуємо{" "}
                    <a
                        className="cookie-banner__link"
                        href="/privacy#cookies"
                    >
                        cookies
                    </a>{" "}
                    для покращення роботи сайту та аналітики. Оберіть, чи
                    погоджуєтесь ви на використання аналітичних cookies.
                </p>

                <div className="cookie-banner__actions">
                    <button
                        type="button"
                        className="cookie-banner__button cookie-banner__button--reject"
                        onClick={handleReject}
                    >
                        Відхилити
                    </button>
                    <button
                        type="button"
                        className="cookie-banner__button cookie-banner__button--accept"
                        onClick={handleAccept}
                    >
                        Прийняти
                    </button>
                </div>
            </div>
        </div>
    );
}
