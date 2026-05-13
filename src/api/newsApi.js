import {
    fetchWithEndpointFallback,
    pickSource,
    resolveMedia,
} from "./foundation";
import { getCachedValue, setCachedValue } from "../lib/requestCache";

export { resolveMedia } from "./foundation";

const NEWS_ENDPOINTS = ["/api/news", "/api/news-items"];
const LOCAL_COLLECTION_FETCH_LIMIT = 1000;
const NEWS_CACHE_TTL_MS = 60 * 1000;
const THEMES_CACHE_TTL_MS = 3 * 60 * 1000;

function toText(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
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
    const seoSource = pickSource(source.seo);
    const title = toText(source.title, "Новина");
    const slug = toText(source.slug, `news-${entry?.id ?? source.id ?? index}`);

    const coverImageCard = resolveMedia(source.cover_image, {
        variant: "card",
        fallbackAlt: "Зображення новини",
    });
    const coverImageHero =
        resolveMedia(source.cover_image, {
            variant: "hero",
            fallbackAlt: "Зображення новини",
        }) || coverImageCard;

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
        seoTitle:
            toText(source.seo_title) ||
            toText(source.seoTitle) ||
            toText(source.metaTitle) ||
            toText(seoSource.metaTitle) ||
            toText(seoSource.title),
        seoDescription:
            toText(source.seo_description) ||
            toText(source.seoDescription) ||
            toText(source.metaDescription) ||
            toText(seoSource.metaDescription) ||
            toText(seoSource.description),
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

function extractStrapiPagination(payload) {
    const pagination = payload?.meta?.pagination;
    if (!pagination || typeof pagination !== "object") {
        return null;
    }

    const page = Number(pagination.page);
    const pageSize = Number(pagination.pageSize);
    const pageCount = Number(pagination.pageCount);
    const total = Number(pagination.total);

    if (
        !Number.isFinite(page) ||
        !Number.isFinite(pageSize) ||
        !Number.isFinite(pageCount) ||
        !Number.isFinite(total)
    ) {
        return null;
    }

    return {
        page: Math.max(1, page),
        pageSize: Math.max(1, pageSize),
        pageCount: Math.max(1, pageCount),
        total: Math.max(0, total),
    };
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
    const hasPublishedAtField = items.some((item) => Boolean(item?.publishedAt));
    if (hasPublishedAtField) {
        return items.filter((item) => Boolean(item?.publishedAt));
    }

    return items.filter((item) => Boolean(item?.publishedDate));
}

export async function fetchThemes({ signal } = {}) {
    const cacheKey = "news-themes";
    const cached = getCachedValue(cacheKey, THEMES_CACHE_TTL_MS);
    if (cached) return cached;

    try {
        const payload = await fetchWithEndpointFallback({
            endpoints: ["/api/news/topics", "/api/themes"],
            paramsVariants: [
                {
                    "sort[0]": "name:asc",
                    "pagination[pageSize]": LOCAL_COLLECTION_FETCH_LIMIT,
                },
                {
                    sort: "name:asc",
                    "pagination[pageSize]": LOCAL_COLLECTION_FETCH_LIMIT,
                },
            ],
            signal,
            unauthorizedMessage:
                "UNAUTHORIZED: У Strapi увімкніть permission find для Public role (News/Theme).",
        });
        const entries = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
              ? payload
              : [];

        const themes = entries
            .map((entry) => normalizeTheme(entry))
            .filter((theme) => theme && theme.slug);
        return setCachedValue(cacheKey, themes, THEMES_CACHE_TTL_MS);
    } catch (primaryError) {
        try {
            const newsPayload = await fetchWithEndpointFallback({
                endpoints: NEWS_ENDPOINTS,
                paramsVariants: [
                    {
                        "populate[theme]": "*",
                        "pagination[pageSize]": LOCAL_COLLECTION_FETCH_LIMIT,
                    },
                    {
                        populate: "*",
                        "pagination[pageSize]": LOCAL_COLLECTION_FETCH_LIMIT,
                    },
                    {},
                ],
                signal,
                unauthorizedMessage:
                    "UNAUTHORIZED: У Strapi увімкніть permission find для Public role (News/Theme).",
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

            const themes = Array.from(uniqueBySlug.values()).sort((a, b) =>
                a.name.localeCompare(b.name, "uk-UA"),
            );
            return setCachedValue(cacheKey, themes, THEMES_CACHE_TTL_MS);
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
    preferServerPagination = false,
    signal,
} = {}) {
    const cacheKey = [
        "news-list",
        themeSlug,
        themeName,
        themeId,
        page,
        pageSize,
        preferServerPagination ? "server" : "client",
    ].join(":");

    const cached = getCachedValue(cacheKey, NEWS_CACHE_TTL_MS);
    if (cached) return cached;

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
    const requestedPage = Math.max(1, Number(page) || 1);
    const safePageSize = Math.max(1, Number(pageSize) || 9);
    const populateParams = {
        "pagination[pageSize]": LOCAL_COLLECTION_FETCH_LIMIT,
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
    const hasServerMismatchedTheme = (items) =>
        items.some((item) => {
            const hasThemeInfo =
                normalizeId(item.theme?.id) ||
                normalizeValue(item.theme?.slug) ||
                normalizeValue(item.theme?.name);

            return hasThemeInfo && !matchesSelectedTheme(item);
        });
    const buildServerPaginatedParams = (extraParams = {}) => ({
        "pagination[page]": requestedPage,
        "pagination[pageSize]": safePageSize,
        ...extraParams,
    });
    const buildServerPaginatedVariants = (filterVariants = [{}]) =>
        filterVariants.flatMap((filterParams) => [
            buildServerPaginatedParams({
                ...filterParams,
                populate: "*",
                "sort[0]": "published_date:desc",
                "sort[1]": "publishedAt:desc",
            }),
            buildServerPaginatedParams({
                ...filterParams,
                populate: "*",
                "sort[0]": "publishedAt:desc",
            }),
            buildServerPaginatedParams({
                ...filterParams,
                "populate[0]": "cover_image",
                "populate[1]": "theme",
                "sort[0]": "publishedAt:desc",
            }),
            buildServerPaginatedParams({
                ...filterParams,
                "populate[cover_image]": "*",
                "populate[theme]": "*",
                "sort[0]": "publishedAt:desc",
            }),
        ]);
    const mapServerPaginatedResponse = (payload) => {
        const paginationMeta = extractStrapiPagination(payload);
        if (!paginationMeta) return null;

        const items = dedupeNewsItems(
            filterPublishedNews(normalizeCollection(payload)),
        );

        const serverAppliedRequestedPageSize =
            paginationMeta.pageSize === safePageSize && items.length <= safePageSize;

        if (!serverAppliedRequestedPageSize) {
            return null;
        }

        return {
            items,
            pagination: paginationMeta,
            hasMore: paginationMeta.page < paginationMeta.pageCount,
        };
    };
    const tryServerPaginatedFetch = async () => {
        try {
            const filterVariants = normalizedThemeSlug
                ? [
                      {
                          "filters[theme][slug][$eq]": normalizedThemeSlug,
                      },
                      {
                          "filters[theme][slug][$eqi]": normalizedThemeSlug,
                      },
                      ...(normalizedThemeId
                          ? [
                                {
                                    "filters[theme][id][$eq]": normalizedThemeId,
                                },
                            ]
                          : []),
                      ...(normalizedThemeName
                          ? [
                                {
                                    "filters[theme][name][$eqi]":
                                        normalizedThemeName,
                                },
                            ]
                          : []),
                  ]
                : [{}];

            const payload = await fetchWithEndpointFallback({
                endpoints: NEWS_ENDPOINTS,
                paramsVariants: buildServerPaginatedVariants(filterVariants),
                signal,
                unauthorizedMessage:
                    "UNAUTHORIZED: У Strapi увімкніть permission find для Public role (News/Theme).",
            });
            const mapped = mapServerPaginatedResponse(payload);
            if (!mapped) return null;

            if (
                normalizedThemeSlug &&
                mapped.items.length > 0 &&
                hasServerMismatchedTheme(mapped.items)
            ) {
                return null;
            }

            return mapped;
        } catch {
            return null;
        }
    };

    if (preferServerPagination) {
        const serverPaginatedResult = await tryServerPaginatedFetch();
        if (serverPaginatedResult) {
            return setCachedValue(cacheKey, serverPaginatedResult, NEWS_CACHE_TTL_MS);
        }
    }

    let themeFiltered = [];

    if (normalizedThemeSlug) {
        try {
            const byThemePayload = await fetchWithEndpointFallback({
                endpoints: [
                    `/api/news/by-theme/${encodeURIComponent(
                        normalizedThemeSlug,
                    )}`,
                ],
                paramsVariants: [{}],
                signal,
                unauthorizedMessage:
                    "UNAUTHORIZED: У Strapi увімкніть permission find для Public role (News/Theme).",
            });
            const byThemeItems = dedupeNewsItems(
                filterPublishedNews(normalizeCollection(byThemePayload)),
            );
            const strictlyMatchedItems = byThemeItems.filter(matchesSelectedTheme);
            if (strictlyMatchedItems.length > 0) {
                themeFiltered = strictlyMatchedItems;
            }
        } catch {
        }
    }

    if (normalizedThemeSlug && themeFiltered.length === 0) {
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
                unauthorizedMessage:
                    "UNAUTHORIZED: У Strapi увімкніть permission find для Public role (News/Theme).",
            });
            const backendItems = dedupeNewsItems(
                filterPublishedNews(normalizeCollection(filteredPayload)),
            );
            const strictlyMatchedItems = backendItems.filter(matchesSelectedTheme);

            if (strictlyMatchedItems.length > 0) {
                themeFiltered = strictlyMatchedItems;
            }
        } catch {
        }
    }

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

    const pageCount = Math.max(1, Math.ceil(sorted.length / safePageSize));
    const safePage = Math.min(requestedPage, pageCount);
    const start = (safePage - 1) * safePageSize;
    const end = start + safePageSize;
    const items = sorted.slice(start, end);
    const hasMore = safePage < pageCount;
    const pagination = {
        page: safePage,
        pageSize: safePageSize,
        pageCount,
        total: sorted.length,
    };

    const result = {
        items,
        pagination,
        hasMore,
    };

    return setCachedValue(cacheKey, result, NEWS_CACHE_TTL_MS);
}

export async function fetchNewsBySlug(slug, { signal } = {}) {
    const cacheKey = `news-by-slug:${String(slug || "").trim().toLowerCase()}`;
    const cached = getCachedValue(cacheKey, NEWS_CACHE_TTL_MS);
    if (cached) return cached;

    const payload = await fetchWithEndpointFallback({
        endpoints: NEWS_ENDPOINTS,
        paramsVariants: [
            {
                populate: "*",
                "pagination[pageSize]": LOCAL_COLLECTION_FETCH_LIMIT,
            },
            {
                "populate[cover_image]": "*",
                "populate[content][populate]": "*",
                "pagination[pageSize]": LOCAL_COLLECTION_FETCH_LIMIT,
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

    return item ? setCachedValue(cacheKey, item, NEWS_CACHE_TTL_MS) : item;
}

export function prefetchNewsBySlug(slug) {
    const safeSlug = String(slug || "").trim();
    if (!safeSlug) return Promise.resolve(null);
    return fetchNewsBySlug(safeSlug);
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
