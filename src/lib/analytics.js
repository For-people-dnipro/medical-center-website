const CONSENT_STORAGE_KEY = "cookie-consent";
const CONSENT_ACCEPTED = "accepted";

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

export function initializeGoogleAnalytics(measurementId) {
    if (typeof window === "undefined" || !measurementId) {
        return false;
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

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };

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
