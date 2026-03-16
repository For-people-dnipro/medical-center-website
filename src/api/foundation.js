const API_URL = (import.meta.env.VITE_STRAPI_URL || "")
    .trim()
    .replace(/\/$/, "");

export const LOCAL_STRAPI_FALLBACK = "http://localhost:1337";

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
        : API_URL
          ? `${API_URL}${normalizedPath}`
          : normalizedPath;

    const url =
        isAbsolutePath || API_URL
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
        !API_URL &&
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
    if (url.startsWith("/")) {
        return API_URL ? `${API_URL}${url}` : `${LOCAL_STRAPI_FALLBACK}${url}`;
    }
    return API_URL ? `${API_URL}/${url}` : `${LOCAL_STRAPI_FALLBACK}/${url}`;
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

    return {
        url,
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

export async function fetchJson(url, { signal } = {}) {
    const response = await fetch(url, { signal });

    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const payload = await response.json();
            message = payload?.error?.message || payload?.message || message;
        } catch {
            // Ignore invalid JSON error payloads.
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
