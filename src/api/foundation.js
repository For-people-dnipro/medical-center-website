export const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_STRAPI_URL ||
    ""
)
    .trim()
    .replace(/\/$/, "");
const IMAGEKIT_MEDIA_URL_ENDPOINT = (
    import.meta.env.VITE_IMAGEKIT_MEDIA_URL_ENDPOINT || ""
)
    .trim()
    .replace(/\/$/, "");
const IMAGEKIT_SITE_URL_ENDPOINT = (
    import.meta.env.VITE_IMAGEKIT_SITE_URL_ENDPOINT || ""
)
    .trim()
    .replace(/\/$/, "");

export const LOCAL_STRAPI_FALLBACK = import.meta.env.DEV
    ? "http://localhost:1337"
    : "";

const MEDIA_FORMAT_PRIORITY = {
    hero: ["large", "xlarge"],
    card: ["medium", "large", "xlarge", "small", "thumbnail"],
    default: ["medium", "large", "xlarge", "small", "thumbnail"],
};

const MEDIA_MIN_WIDTH = {
    hero: 1080,
    card: 640,
    default: 0,
};

const RESPONSIVE_FORMAT_ORDER = [
    "thumbnail",
    "small",
    "medium",
    "large",
    "xlarge",
];

const IMAGEKIT_DEFAULT_QUALITY = 80;

const IMAGE_WIDTH_PRESETS = Object.freeze({
    hero: [640, 960, 1280, 1600, 1920],
    card: [240, 360, 480, 640, 768, 960],
    default: [320, 480, 640, 960, 1280, 1600],
});

export function normalizePath(path) {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return path.startsWith("/") ? path : `/${path}`;
}

export function buildApiUrl(path, params = {}) {
    const isAbsolutePath = /^https?:\/\//i.test(path);
    const normalizedPath = normalizePath(path);
    const baseUrl = isAbsolutePath
        ? path
        : API_BASE_URL
          ? `${API_BASE_URL}${normalizedPath}`
          : normalizedPath;

    const url =
        isAbsolutePath || API_BASE_URL
            ? new URL(baseUrl)
            : new URL(
                  baseUrl,
                  typeof window !== "undefined"
                      ? window.location.origin
                      : "http://localhost:5173",
              );

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
            return;
        }

        url.searchParams.set(key, String(value));
    });

    return url.toString();
}

export function buildCandidateUrls(path, params = {}) {
    const normalizedPath = normalizePath(path);
    const urls = [buildApiUrl(path, params)];

    if (
        !/^https?:\/\//i.test(path) &&
        !API_BASE_URL &&
        typeof window !== "undefined"
    ) {
        const fallbackUrl = new URL(normalizedPath, LOCAL_STRAPI_FALLBACK);
        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                return;
            }

            fallbackUrl.searchParams.set(key, String(value));
        });
        urls.push(fallbackUrl.toString());
    }

    return [...new Set(urls)];
}

export function pickSource(entry) {
    return entry?.attributes ?? entry ?? {};
}

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

function pickMediaSource(media) {
    if (!media) return null;

    if (Array.isArray(media?.data)) {
        return pickSource(media.data[0]);
    }

    return pickSource(media?.data ?? media);
}

function isUsableFormat(format) {
    return Boolean(format && typeof format === "object" && format.url);
}

function getOrderedFormats(source) {
    const formats =
        source?.formats && typeof source.formats === "object" ? source.formats : {};
    const namedFormats = RESPONSIVE_FORMAT_ORDER.map((name) => formats[name]).filter(
        (format) => isUsableFormat(format),
    );

    return [...namedFormats, source].filter((format, index, items) => {
        if (!isUsableFormat(format)) return false;
        const url = toAbsoluteMediaUrl(format.url);
        return url && items.findIndex((item) => item?.url === format.url) === index;
    });
}

function pickBestFormat(formats, variant = "default") {
    const priority =
        MEDIA_FORMAT_PRIORITY[variant] || MEDIA_FORMAT_PRIORITY.default;
    const minWidth = MEDIA_MIN_WIDTH[variant] ?? MEDIA_MIN_WIDTH.default;

    const orderedFormats = priority
        .map((name) => formats[name])
        .filter((format) => isUsableFormat(format));

    if (orderedFormats.length === 0) {
        return null;
    }

    if (minWidth <= 0) {
        return orderedFormats[0];
    }

    const sizedFormat = orderedFormats.find((format) => {
        const width = Number(format.width);
        return Number.isFinite(width) && width >= minWidth;
    });

    return sizedFormat || orderedFormats[0];
}

function makeResolvedMedia(source, preferred = null, fallbackAlt = "Зображення") {
    const mediaSource =
        preferred && typeof preferred === "object" ? preferred : source;
    const url = toAbsoluteMediaUrl(mediaSource?.url);
    if (!url) {
        return null;
    }

    const width = Number(mediaSource.width || source?.width);
    const height = Number(mediaSource.height || source?.height);
    const fallbackText =
        typeof fallbackAlt === "string" && fallbackAlt.trim()
            ? fallbackAlt.trim()
            : "Зображення";

    const variant = source?.__resolvedVariant || "default";
    const optimizedUrl = getOptimizedImageUrl(mediaSource?.url, {
        width,
        height,
        variant,
    });
    const optimizedSrcSet = buildOptimizedImageSrcSet(source?.url || mediaSource?.url, {
        maxWidth: Number(source?.width || mediaSource?.width),
        variant,
    });

    return {
        url: optimizedUrl || url,
        width: Number.isFinite(width) && width > 0 ? width : 1200,
        height: Number.isFinite(height) && height > 0 ? height : 680,
        alt:
            source?.alternativeText?.trim?.() ||
            source?.alt?.trim?.() ||
            source?.caption?.trim?.() ||
            source?.name?.trim?.() ||
            fallbackText,
        caption:
            typeof source?.caption === "string" && source.caption.trim()
                ? source.caption.trim()
                : "",
        srcSet:
            optimizedSrcSet ||
            getOrderedFormats(source)
                .map((format) => {
                    const absoluteUrl = getOptimizedImageUrl(format.url, {
                        width: Number(format.width),
                        variant,
                    });
                    const formatWidth = Number(format.width);
                    if (
                        !absoluteUrl ||
                        !Number.isFinite(formatWidth) ||
                        formatWidth <= 0
                    ) {
                        return "";
                    }

                    return `${absoluteUrl} ${formatWidth}w`;
                })
                .filter(Boolean)
                .join(", "),
    };
}

export function resolveMedia(media, options = {}) {
    const variant =
        typeof options.variant === "string" && options.variant.trim()
            ? options.variant.trim()
            : "default";
    const fallbackAlt =
        typeof options.fallbackAlt === "string" ? options.fallbackAlt : "";
    const source = pickMediaSource(media);
    if (!source || typeof source !== "object") {
        return null;
    }
    source.__resolvedVariant = variant;

    const formats =
        source.formats && typeof source.formats === "object"
            ? source.formats
            : {};
    const selectedFormat = pickBestFormat(formats, variant);
    const minWidth = MEDIA_MIN_WIDTH[variant] ?? MEDIA_MIN_WIDTH.default;
    const selectedWidth = Number(selectedFormat?.width);
    const originalWidth = Number(source.width);
    const shouldUseOriginalForHero =
        variant === "hero" &&
        (!selectedFormat ||
            (!Number.isNaN(selectedWidth) &&
                !Number.isNaN(originalWidth) &&
                selectedWidth < minWidth &&
                originalWidth > selectedWidth));

    if (shouldUseOriginalForHero) {
        return makeResolvedMedia(source, null, fallbackAlt);
    }

    if (selectedFormat) {
        return makeResolvedMedia(source, selectedFormat, fallbackAlt);
    }

    return makeResolvedMedia(source, null, fallbackAlt);
}

export function getResponsiveImageProps(media, options = {}) {
    const resolved = resolveMedia(media, options);
    if (!resolved) return null;

    const defaultSizesByVariant = {
        hero: "100vw",
        card: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        default: "100vw",
    };
    const variant =
        typeof options.variant === "string" && options.variant.trim()
            ? options.variant.trim()
            : "default";
    const sizes =
        typeof options.sizes === "string" && options.sizes.trim()
            ? options.sizes.trim()
            : defaultSizesByVariant[variant] || defaultSizesByVariant.default;

    return {
        src: resolved.url,
        srcSet: resolved.srcSet || undefined,
        sizes,
        width: resolved.width,
        height: resolved.height,
        alt: resolved.alt,
        caption: resolved.caption,
    };
}

export async function fetchJson(url, { signal } = {}) {
    const response = await fetch(url, { signal });

    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const payload = await response.json();
            message = payload?.error?.message || payload?.message || message;
        } catch {
        }

        const error = new Error(message);
        error.status = response.status;
        error.url = url;
        throw error;
    }

    return response.json();
}

export async function fetchWithEndpointFallback({
    endpoints,
    paramsVariants = [{}],
    signal,
    unauthorizedMessage = "UNAUTHORIZED",
    retryStatusCodes = [400, 404],
}) {
    let lastError = null;
    let unauthorizedError = null;

    for (const endpoint of endpoints) {
        for (const params of paramsVariants) {
            const requestUrls = buildCandidateUrls(endpoint, params);

            for (const requestUrl of requestUrls) {
                try {
                    return await fetchJson(requestUrl, { signal });
                } catch (requestError) {
                    if (requestError?.name === "AbortError") {
                        throw requestError;
                    }

                    const status = Number(requestError?.status);
                    if (status === 401 || status === 403) {
                        unauthorizedError =
                            unauthorizedError ||
                            new Error(unauthorizedMessage);
                        continue;
                    }

                    if (retryStatusCodes.includes(status)) {
                        lastError = requestError;
                        continue;
                    }

                    lastError = requestError;
                }
            }
        }
    }

    if (unauthorizedError) {
        throw unauthorizedError;
    }

    throw lastError || new Error("NO_VALID_ENDPOINT");
}
