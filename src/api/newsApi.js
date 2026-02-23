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

function makeResolvedMedia(source, preferred = null) {
    const mediaSource = preferred && typeof preferred === "object" ? preferred : source;
    const url = toAbsoluteMediaUrl(mediaSource?.url);
    if (!url) {
        return null;
    }

    const width = Number(mediaSource.width || source?.width);
    const height = Number(mediaSource.height || source?.height);

    return {
        url,
        width: Number.isFinite(width) && width > 0 ? width : 1200,
        height: Number.isFinite(height) && height > 0 ? height : 680,
        alt: toText(
            source?.alternativeText || source?.alt || source?.caption,
            toText(source?.name, "Зображення новини"),
        ),
        caption: toText(source?.caption),
    };
}

export function resolveMedia(media, options = {}) {
    const variant = toText(options.variant, "default");
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
        return makeResolvedMedia(source);
    }

    if (selectedFormat) {
        return makeResolvedMedia(source, selectedFormat);
    }

    return makeResolvedMedia(source);
}

function normalizeTheme(entry) {
    if (typeof entry === "number" || typeof entry === "string") {
        return {
            id: entry,
            name: "",
            slug: "",
            description: "",
        };
    }

    const source = pickSource(entry?.data ?? entry);
    const sourceId = source?.id ?? source?.documentId;
    const slug = toText(source.slug);
    const name = toText(source.name);

    if (!slug && !name && !sourceId) {
        return null;
    }

    return {
        id: sourceId ?? slug,
        name,
        slug,
        description: toText(source.description),
    };
}

function normalizeNewsItem(entry, index = 0) {
    const source = pickSource(entry);
    const title = toText(source.title, "Новина");
    const slug = toText(source.slug, `news-${entry?.id ?? source.id ?? index}`);

    const coverImageCard = resolveMedia(source.cover_image, {
        variant: "card",
    });
    const coverImageHero =
        resolveMedia(source.cover_image, { variant: "hero" }) || coverImageCard;

    return {
        id: entry?.id ?? source.id ?? source.documentId ?? `news-${index}`,
        documentId: source.documentId ?? entry?.documentId ?? "",
        title,
        slug,
        shortDescription: toText(source.short_description),
        content: source.content ?? source.body ?? "",
        coverImage: coverImageHero || coverImageCard,
        coverImageCard,
        coverImageHero,
        theme: normalizeTheme(source.theme),
        publishedAt: toText(source.publishedAt),
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

function getNewsIdentity(item, index = 0) {
    const documentId = toText(item?.documentId);
    if (documentId) return `doc:${documentId}`;

    const slug = toText(item?.slug);
    if (slug) return `slug:${slug.toLocaleLowerCase("uk-UA")}`;

    const id = toText(item?.id);
    if (id) return `id:${id}`;

    return `idx:${index}`;
}

function getNewsPriority(item) {
    let score = 0;
    if (item?.publishedAt) score += 10;
    if (item?.coverImage?.url || item?.coverImageCard?.url) score += 2;
    if (item?.shortDescription) score += 1;
    return score;
}

function dedupeNewsItems(items) {
    const unique = new Map();

    items.forEach((item, index) => {
        const key = getNewsIdentity(item, index);
        const existing = unique.get(key);

        if (!existing) {
            unique.set(key, item);
            return;
        }

        if (getNewsPriority(item) > getNewsPriority(existing)) {
            unique.set(key, item);
        }
    });

    return Array.from(unique.values());
}

function filterPublishedNews(items) {
    // In Strapi with draft/publish enabled, `publishedAt` is the source of truth.
    // Fallback to `publishedDate` only when `publishedAt` is absent for all items.
    const hasPublishedAtField = items.some((item) => Boolean(item?.publishedAt));
    if (hasPublishedAtField) {
        return items.filter((item) => Boolean(item?.publishedAt));
    }

    return items.filter((item) => Boolean(item?.publishedDate));
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
    themeName = "",
    themeId = "",
    page = 1,
    pageSize = 9,
    signal,
} = {}) {
    const normalizeValue = (value) =>
        String(value || "")
            .trim()
            .toLocaleLowerCase("uk-UA");
    const normalizeId = (value) => String(value ?? "").trim();
    const normalizedThemeSlug = String(themeSlug || "")
        .trim()
        .toLocaleLowerCase("uk-UA");
    const normalizedThemeName = normalizeValue(themeName);
    const normalizedThemeId = normalizeId(themeId);
    const populateParams = {
        "pagination[pageSize]": 100,
    };

    const loadPopulatedNews = () =>
        fetchWithEndpointFallback({
            endpoints: NEWS_ENDPOINTS,
            paramsVariants: [
                {
                    ...populateParams,
                    populate: "*",
                },
                {
                    ...populateParams,
                    "populate[0]": "cover_image",
                    "populate[1]": "theme",
                },
                {
                    ...populateParams,
                    "populate[cover_image]": "*",
                    "populate[theme]": "*",
                },
            ],
            signal,
        });
    const matchesSelectedTheme = (item) => {
        const itemThemeSlug = normalizeValue(item.theme?.slug);
        const itemThemeName = normalizeValue(item.theme?.name);
        const itemThemeId = normalizeId(item.theme?.id);

        return (
            (normalizedThemeId && itemThemeId === normalizedThemeId) ||
            itemThemeSlug === normalizedThemeSlug ||
            (normalizedThemeName && itemThemeName === normalizedThemeName)
        );
    };

    let themeFiltered = [];

    if (normalizedThemeSlug) {
        // Preferred path: dedicated backend endpoint with stable relation filtering.
        try {
            const byThemePayload = await fetchWithEndpointFallback({
                endpoints: [
                    `/api/news/by-theme/${encodeURIComponent(
                        normalizedThemeSlug,
                    )}`,
                ],
                paramsVariants: [{}],
                signal,
            });
            const byThemeItems = dedupeNewsItems(
                filterPublishedNews(normalizeCollection(byThemePayload)),
            );
            const strictlyMatchedItems = byThemeItems.filter(matchesSelectedTheme);
            if (strictlyMatchedItems.length > 0) {
                themeFiltered = strictlyMatchedItems;
            }
        } catch {
            // ignore and continue to generic fallback path
        }
    }

    if (normalizedThemeSlug && themeFiltered.length === 0) {
        // First: ask backend to filter by relation directly.
        try {
            const filteredPayload = await fetchWithEndpointFallback({
                endpoints: NEWS_ENDPOINTS,
                paramsVariants: [
                    {
                        ...populateParams,
                        populate: "*",
                        "filters[theme][slug][$eq]": normalizedThemeSlug,
                    },
                    {
                        ...populateParams,
                        populate: "*",
                        "filters[theme][slug][$eqi]": normalizedThemeSlug,
                    },
                    ...(normalizedThemeId
                        ? [
                              {
                                  ...populateParams,
                                  populate: "*",
                                  "filters[theme][id][$eq]": normalizedThemeId,
                              },
                          ]
                        : []),
                    ...(normalizedThemeName
                        ? [
                              {
                                  ...populateParams,
                                  populate: "*",
                                  "filters[theme][name][$eqi]":
                                      normalizedThemeName,
                              },
                          ]
                        : []),
                ],
                signal,
            });
            const backendItems = dedupeNewsItems(
                filterPublishedNews(normalizeCollection(filteredPayload)),
            );
            const strictlyMatchedItems = backendItems.filter(matchesSelectedTheme);

            // If backend returns filtered rows, use them as source of truth.
            // This works even when theme relation is not exposed in Public response.
            if (strictlyMatchedItems.length > 0) {
                themeFiltered = strictlyMatchedItems;
            }
        } catch {
            // ignore and fallback below
        }
    }

    // Fallback: load populated list and filter locally.
    if (themeFiltered.length === 0) {
        const payload = await loadPopulatedNews();
        const publishedItems = dedupeNewsItems(
            filterPublishedNews(normalizeCollection(payload)),
        );

        if (normalizedThemeSlug) {
            themeFiltered = publishedItems.filter(matchesSelectedTheme);
        } else {
            themeFiltered = publishedItems;
        }
    }

    const sorted = dedupeNewsItems(themeFiltered).sort((a, b) => {
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

    const normalized = dedupeNewsItems(
        filterPublishedNews(normalizeCollection(payload)),
    );
    const loweredSlug = String(slug || "")
        .trim()
        .toLocaleLowerCase("uk-UA");

    const item =
        normalized.find(
            (entry) =>
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
