export const CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_ACCEPTED = "accepted";
export const CONSENT_DECLINED = "declined";

function ensureGtagStub() {
    if (typeof window === "undefined") {
        return false;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };

    return true;
}

export function getGoogleAnalyticsId() {
    const gaId =
        import.meta.env.VITE_GA_ID ||
        import.meta.env.VITE_GA_MEASUREMENT_ID ||
        "";

    return typeof gaId === "string" ? gaId.trim() : "";
}

export function hasAnalyticsConsent() {
    if (typeof window === "undefined") {
        return false;
    }

    try {
        return localStorage.getItem(CONSENT_STORAGE_KEY) === CONSENT_ACCEPTED;
    } catch {
        return false;
    }
}

export function getStoredAnalyticsConsent() {
    if (typeof window === "undefined") {
        return "";
    }

    try {
        const value = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (value === CONSENT_ACCEPTED || value === CONSENT_DECLINED) {
            return value;
        }
    } catch {
        return "";
    }

    return "";
}

export function setStoredAnalyticsConsent(consent) {
    if (typeof window === "undefined") {
        return false;
    }

    try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, consent);
        return true;
    } catch {
        return false;
    }
}

export function applyAnalyticsConsentState(consent) {
    if (!ensureGtagStub()) {
        return false;
    }

    const granted = consent === CONSENT_ACCEPTED;

    window.gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
    });

    return true;
}

export function initializeGoogleAnalytics(measurementId) {
    if (typeof window === "undefined" || !measurementId) {
        return false;
    }

    ensureGtagStub();

    if (!window.__gaConsentDefaultsApplied) {
        window.gtag("consent", "default", {
            analytics_storage: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
        });
        window.__gaConsentDefaultsApplied = true;
    }

    if (window.__gaInitialized === measurementId) {
        return true;
    }

    const scriptSelector = `script[data-ga-id="${measurementId}"]`;
    if (!document.querySelector(scriptSelector)) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        script.dataset.gaId = measurementId;
        document.head.appendChild(script);
    }

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
        anonymize_ip: true,
        send_page_view: false,
    });
    window.__gaInitialized = measurementId;

    return true;
}

export function trackPageView() {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
        return;
    }

    window.gtag("event", "page_view", {
        page_title: document.title,
        page_path: window.location.pathname + window.location.search,
        page_location: window.location.href,
    });
}
