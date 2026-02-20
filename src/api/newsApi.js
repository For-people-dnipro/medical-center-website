const API_URL = (import.meta.env.VITE_STRAPI_URL || "")
    .trim()
    .replace(/\/$/, "");
const NEWS_ENDPOINTS = ["/api/news", "/api/news-items"];
const LOCAL_STRAPI_FALLBACK = "http://localhost:1337";

function normalizePath(path) {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return path.startsWith("/") ? path : `/${path}`;
}

function buildApiUrl(path, params = {}) {
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

function buildCandidateUrls(path, params = {}) {
    const normalizedPath = normalizePath(path);
    const urls = [buildApiUrl(path, params)];

    if (
        !/^https?:\/\//i.test(path) &&
        !API_URL &&
        typeof window !== "undefined"
    ) {
        const fallbackUrl = new URL(normalizedPath, LOCAL_STRAPI_FALLBACK);
        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") return;
            fallbackUrl.searchParams.set(key, String(value));
        });
        urls.push(fallbackUrl.toString());
    }

    return [...new Set(urls)];
}

function pickSource(entry) {
    return entry?.attributes ?? entry ?? {};
}

function toText(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toAbsoluteMediaUrl(url) {
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

export function resolveMedia(media) {
    const source = pickMediaSource(media);
    if (!source || typeof source !== "object") {
        return null;
    }

    const formats =
        source.formats && typeof source.formats === "object"
            ? source.formats
            : {};
    const selectedFormat =
        formats.medium ||
        formats.small ||
        formats.thumbnail ||
        formats.large ||
        formats.xlarge ||
        source;

    const url = toAbsoluteMediaUrl(selectedFormat.url || source.url);
    if (!url) {
        return null;
    }

    const width = Number(selectedFormat.width || source.width);
    const height = Number(selectedFormat.height || source.height);

    return {
        url,
        width: Number.isFinite(width) && width > 0 ? width : 1200,
        height: Number.isFinite(height) && height > 0 ? height : 680,
        alt: toText(
            source.alternativeText || source.alt || source.caption,
            toText(source.name, "Зображення новини"),
        ),
        caption: toText(source.caption),
    };
}

function normalizeTheme(entry) {
    const source = pickSource(entry?.data ?? entry);
    const slug = toText(source.slug);
    const name = toText(source.name);

    if (!slug && !name) {
        return null;
    }

    return {
        id: source.id ?? source.documentId ?? slug,
        name: name || "Тема",
        slug,
        description: toText(source.description),
    };
}

function normalizeNewsItem(entry, index = 0) {
    const source = pickSource(entry);
    const title = toText(source.title, "Новина");
    const slug = toText(source.slug, `news-${entry?.id ?? source.id ?? index}`);

    return {
        id: entry?.id ?? source.id ?? source.documentId ?? `news-${index}`,
        documentId: source.documentId ?? entry?.documentId ?? "",
        title,
        slug,
        shortDescription: toText(source.short_description),
        content: source.content ?? source.body ?? "",
        coverImage: resolveMedia(source.cover_image),
        theme: normalizeTheme(source.theme),
        publishedDate:
            toText(source.published_date) ||
            toText(source.publishedAt) ||
            toText(source.createdAt),
        seoTitle: toText(source.seo_title),
        seoDescription: toText(source.seo_description),
    };
}

function normalizeCollection(payload) {
    const rows = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : payload?.data
            ? [payload.data]
            : [];

    return rows.map(normalizeNewsItem);
}

async function fetchJson(url, { signal } = {}) {
    const response = await fetch(url, { signal });

    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const payload = await response.json();
            message = payload?.error?.message || payload?.message || message;
        } catch {
            // ignore parse errors
        }
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }

    return response.json();
}

async function fetchWithEndpointFallback({
    endpoints,
    paramsVariants,
    signal,
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
                            new Error(
                                "UNAUTHORIZED: У Strapi увімкніть permission find для Public role (News/Theme).",
                            );
                        continue;
                    }

                    // Try next endpoint/variant on invalid query or missing route.
                    if (status === 400 || status === 404) {
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

export async function fetchThemes({ signal } = {}) {
    try {
        const payload = await fetchWithEndpointFallback({
            endpoints: ["/api/news/topics", "/api/themes"],
            paramsVariants: [
                {
                    "sort[0]": "name:asc",
                    "pagination[pageSize]": 100,
                },
                {
                    sort: "name:asc",
                    "pagination[pageSize]": 100,
                },
            ],
            signal,
        });
        const entries = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
              ? payload
              : [];

        return entries
            .map((entry) => normalizeTheme(entry))
            .filter((theme) => theme && theme.slug);
    } catch (primaryError) {
        // Fallback: derive topics from news relation payload when topics endpoint
        // is not available yet or Theme public permissions are missing.
        try {
            const newsPayload = await fetchWithEndpointFallback({
                endpoints: NEWS_ENDPOINTS,
                paramsVariants: [
                    {
                        "populate[theme]": "*",
                        "pagination[pageSize]": 100,
                    },
                    {
                        populate: "*",
                        "pagination[pageSize]": 100,
                    },
                    {},
                ],
                signal,
            });

            const fromNews = normalizeCollection(newsPayload)
                .map((item) => item.theme)
                .filter((theme) => theme && theme.slug);

            const uniqueBySlug = new Map();
            fromNews.forEach((theme) => {
                if (!uniqueBySlug.has(theme.slug)) {
                    uniqueBySlug.set(theme.slug, theme);
                }
            });

            return Array.from(uniqueBySlug.values()).sort((a, b) =>
                a.name.localeCompare(b.name, "uk-UA"),
            );
        } catch {
            throw primaryError;
        }
    }
}

export async function fetchNewsList({
    themeSlug = "",
    page = 1,
    pageSize = 9,
    signal,
} = {}) {
    const baseParams = {
        "filters[theme][slug][$eq]": themeSlug || undefined,
        "pagination[pageSize]": 100,
    };

    const payload = await fetchWithEndpointFallback({
        endpoints: NEWS_ENDPOINTS,
        paramsVariants: [
            {
                ...baseParams,
                populate: "*",
            },
            {
                ...baseParams,
                "populate[cover_image]": "*",
                "populate[theme]": "*",
            },
            {
                ...baseParams,
                "populate[cover_image]": "*",
            },
            {},
        ],
        signal,
    });

    const normalized = normalizeCollection(payload);
    const publishedItems = normalized.filter((item) => item.publishedDate);

    const canFilterByRelation = publishedItems.some((item) => item.theme?.slug);
    const themeFiltered =
        themeSlug && canFilterByRelation
            ? publishedItems.filter((item) => item.theme?.slug === themeSlug)
            : publishedItems;

    const sorted = [...themeFiltered].sort((a, b) => {
        const aTime = new Date(a.publishedDate || 0).getTime() || 0;
        const bTime = new Date(b.publishedDate || 0).getTime() || 0;
        return bTime - aTime;
    });

    const safePage = Math.max(1, Number(page) || 1);
    const safePageSize = Math.max(1, Number(pageSize) || 9);
    const start = (safePage - 1) * safePageSize;
    const end = start + safePageSize;
    const items = sorted.slice(start, end);
    const pageCount = Math.max(1, Math.ceil(sorted.length / safePageSize));
    const hasMore = safePage < pageCount;
    const pagination = {
        page: safePage,
        pageSize: safePageSize,
        pageCount,
        total: sorted.length,
    };

    return {
        items,
        pagination,
        hasMore,
    };
}

export async function fetchNewsBySlug(slug, { signal } = {}) {
    const payload = await fetchWithEndpointFallback({
        endpoints: NEWS_ENDPOINTS,
        paramsVariants: [
            {
                populate: "*",
                "pagination[pageSize]": 100,
            },
            {
                "populate[cover_image]": "*",
                "populate[content][populate]": "*",
                "pagination[pageSize]": 100,
            },
            {},
        ],
        signal,
    });

    const normalized = normalizeCollection(payload);
    const loweredSlug = String(slug || "")
        .trim()
        .toLocaleLowerCase("uk-UA");

    const item =
        normalized.find(
            (entry) =>
                entry.publishedDate &&
                String(entry.slug || "")
                    .trim()
                    .toLocaleLowerCase("uk-UA") === loweredSlug,
        ) || null;

    return item;
}

export function formatNewsDate(value) {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}
