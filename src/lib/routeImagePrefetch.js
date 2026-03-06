const ROUTE_CRITICAL_IMAGES = Object.freeze({
    "/services": [
        "/icons/service-declaration.svg",
        "/icons/service-consult.svg",
        "/icons/service-tests.svg",
        "/icons/service-vaccine.svg",
        "/icons/service-diagnostics.svg",
        "/icons/service-manipulation.svg",
        "/icons/service-declaration-mobile.svg",
        "/icons/service-consult-mobile.svg",
        "/icons/service-tests-mobile.svg",
        "/icons/service-vaccine-mobile.svg",
        "/icons/service-diagnostics-mobile.svg",
        "/icons/service-manipulation-mobile.svg",
        "/icons/arrow-right.svg",
        "/icons/arrow-down.svg",
        "/icons/check.svg",
    ],
    "/declaration": ["/images/declaration-hero.jpg"],
    "/consultation": ["/images/consult-hero.jpg"],
    "/diagnostics": ["/images/diagnostics-hero.jpg"],
    "/manipulation": ["/images/manipulation-hero.jpg"],
    "/vaccination": ["/images/vaccination-hero.jpg"],
    "/packages": ["/images/packages-hero-nurse.jpg"],
    "/checkup": ["/images/consultation.jpg"],
    "/analyses": ["/images/analyses-hero.jpg"],
    "/vacancies": ["/images/vacancy-hero.jpg"],
});

const prefetchedImageUrls = new Set();
let hasWarmedRouteCache = false;

function canPrefetchImages() {
    if (typeof window === "undefined") return false;

    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
    if (!connection) return true;

    if (connection.saveData) return false;

    const effectiveType = String(connection.effectiveType || "").toLowerCase();
    if (effectiveType.includes("2g")) return false;

    return true;
}

function normalizePathname(pathname = "/") {
    const raw = String(pathname || "/").trim();
    const normalized = raw.startsWith("/") ? raw : `/${raw}`;
    const withoutTrailing = normalized.replace(/\/+$/, "");
    return withoutTrailing || "/";
}

function toAbsoluteImageUrl(url) {
    const raw = String(url || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith("//")) return `https:${raw}`;
    if (!raw.startsWith("/")) return "";

    if (typeof window === "undefined") {
        return raw;
    }

    return `${window.location.origin}${raw}`;
}

function preloadImage(url, { highPriority = false } = {}) {
    const absoluteUrl = toAbsoluteImageUrl(url);
    if (!absoluteUrl || prefetchedImageUrls.has(absoluteUrl)) {
        return Promise.resolve();
    }

    prefetchedImageUrls.add(absoluteUrl);

    return new Promise((resolve) => {
        const image = new Image();
        image.decoding = "async";
        image.fetchPriority = highPriority ? "high" : "auto";
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = absoluteUrl;

        if (image.complete) {
            resolve();
        }
    });
}

function getCriticalImagesForPath(pathname = "/") {
    const normalizedPath = normalizePathname(pathname);

    if (ROUTE_CRITICAL_IMAGES[normalizedPath]) {
        return ROUTE_CRITICAL_IMAGES[normalizedPath];
    }

    if (normalizedPath.startsWith("/doctors/")) {
        return [];
    }

    if (normalizedPath.startsWith("/news/")) {
        return [];
    }

    return [];
}

export function prefetchRouteImages(pathname, options = {}) {
    if (!canPrefetchImages()) {
        return Promise.resolve();
    }

    const urls = getCriticalImagesForPath(pathname);
    if (!urls.length) {
        return Promise.resolve();
    }

    const { highPriority = false } = options;
    return Promise.allSettled(
        urls.map((url) => preloadImage(url, { highPriority })),
    );
}

export function prefetchRouteImagesFromHref(href, options = {}) {
    if (typeof window === "undefined") return;
    const rawHref = String(href || "").trim();
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("javascript:")) {
        return;
    }

    let parsed;
    try {
        parsed = new URL(rawHref, window.location.origin);
    } catch {
        return;
    }

    if (parsed.origin !== window.location.origin) return;
    prefetchRouteImages(parsed.pathname, options);
}

export function warmCriticalRouteImageCache() {
    if (hasWarmedRouteCache || !canPrefetchImages()) return;
    hasWarmedRouteCache = true;

    const urls = Array.from(
        new Set(
            Object.values(ROUTE_CRITICAL_IMAGES).flatMap((items) => items || []),
        ),
    );

    urls.forEach((url) => {
        preloadImage(url);
    });
}
