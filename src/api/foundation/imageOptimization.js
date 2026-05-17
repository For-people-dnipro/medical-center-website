import {
    API_BASE_URL,
    IMAGEKIT_MEDIA_URL_ENDPOINT,
    IMAGEKIT_SITE_URL_ENDPOINT,
    LOCAL_STRAPI_FALLBACK,
} from "./config";
import { normalizePath } from "./urlBuilders";

const IMAGEKIT_DEFAULT_QUALITY = 80;

const IMAGE_WIDTH_PRESETS = Object.freeze({
    hero: [640, 960, 1280, 1600, 1920],
    card: [240, 360, 480, 640, 768, 960],
    default: [320, 480, 640, 960, 1280, 1600],
});

export function toAbsoluteMediaUrl(url) {
    if (!url || typeof url !== "string") return "";
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/images/") || url.startsWith("/icons/")) {
        if (typeof window !== "undefined" && window.location.origin) {
            return `${window.location.origin}${url}`;
        }

        return url;
    }
    if (url.startsWith("/")) {
        return API_BASE_URL
            ? `${API_BASE_URL}${url}`
            : `${LOCAL_STRAPI_FALLBACK}${url}`;
    }
    return API_BASE_URL
        ? `${API_BASE_URL}/${url}`
        : `${LOCAL_STRAPI_FALLBACK}/${url}`;
}

function normalizeImageKitPath(url) {
    const raw = String(url || "").trim();
    if (!raw) return "";

    if (/^https?:\/\//i.test(raw)) {
        try {
            const parsed = new URL(raw);
            return normalizePath(parsed.pathname);
        } catch {
            return "";
        }
    }

    if (raw.startsWith("/")) {
        return normalizePath(raw);
    }

    return normalizePath(`/${raw}`);
}

function getImageKitEndpointForPath(pathname = "") {
    if (pathname.startsWith("/uploads/")) {
        return IMAGEKIT_MEDIA_URL_ENDPOINT;
    }

    if (pathname.startsWith("/images/")) {
        return IMAGEKIT_SITE_URL_ENDPOINT;
    }

    return "";
}

function buildImageKitTransformation({
    width,
    height,
    quality = IMAGEKIT_DEFAULT_QUALITY,
    format = "auto",
} = {}) {
    const transforms = [];

    if (Number.isFinite(width) && width > 0) {
        transforms.push(`w-${Math.round(width)}`);
    }

    if (Number.isFinite(height) && height > 0) {
        transforms.push(`h-${Math.round(height)}`);
    }

    if (format) {
        transforms.push(`f-${format}`);
    }

    if (Number.isFinite(quality) && quality > 0) {
        transforms.push(`q-${Math.round(quality)}`);
    }

    return transforms.join(",");
}

export function getOptimizedImageUrl(url, options = {}) {
    const absoluteUrl = toAbsoluteMediaUrl(url);
    if (!absoluteUrl) return "";

    const pathname = normalizeImageKitPath(absoluteUrl);
    const endpoint = getImageKitEndpointForPath(pathname);
    if (!endpoint) {
        return absoluteUrl;
    }

    const transformation = buildImageKitTransformation(options);
    if (!transformation) {
        return `${endpoint}${pathname}`;
    }

    return `${endpoint}/tr:${transformation}${pathname}`;
}

function getPresetWidths(variant, maxWidth) {
    const preset = IMAGE_WIDTH_PRESETS[variant] || IMAGE_WIDTH_PRESETS.default;
    const safeMaxWidth = Number(maxWidth);

    if (!Number.isFinite(safeMaxWidth) || safeMaxWidth <= 0) {
        return preset;
    }

    const widths = preset.filter((width) => width < safeMaxWidth);
    return [...widths, safeMaxWidth];
}

export function buildOptimizedImageSrcSet(url, options = {}) {
    const pathname = normalizeImageKitPath(url);
    const endpoint = getImageKitEndpointForPath(pathname);
    if (!endpoint) return "";

    const widths = getPresetWidths(options.variant || "default", options.maxWidth);

    return widths
        .map((width) => {
            const href = getOptimizedImageUrl(url, {
                ...options,
                width,
                height: undefined,
            });
            return href ? `${href} ${width}w` : "";
        })
        .filter(Boolean)
        .join(", ");
}

