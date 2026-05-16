import {
    fetchWithEndpointFallback,
    pickSource,
    resolveMedia,
} from "./foundation";
import { getCachedValue, setCachedValue } from "../lib/requestCache";

export { resolveMedia } from "./foundation";

const NEWS_ENDPOINTS = ["/api/news"];
const THEMES_FETCH_LIMIT = 100;
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
            endpoints: ["/api/themes"],
            paramsVariants: [
                {
                    "sort[0]": "name:asc",
                    "pagination[pageSize]": THEMES_FETCH_LIMIT,
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
                        "pagination[pageSize]": THEMES_FETCH_LIMIT,
                    },
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
    preferServerPagination = true,
    signal,
    queryMode = "default",
} = {}) {
    const cacheKey = [
        "news-list",
        themeSlug,
        themeName,
        themeId,
        page,
        pageSize,
        preferServerPagination ? "server" : "client",
        queryMode,
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
    const isLightweightMode = queryMode === "home" || queryMode === "card";

    const populateFields = isLightweightMode
        ? {
              "fields[0]": "title",
              "fields[1]": "slug",
              "fields[2]": "short_description",
              "fields[3]": "published_date",
              "fields[4]": "publishedAt",
              "populate[cover_image][fields][0]": "url",
              "populate[cover_image][fields][1]": "alternativeText",
              "populate[cover_image][fields][2]": "width",
              "populate[cover_image][fields][3]": "height",
              "populate[cover_image][fields][4]": "formats",
              "populate[theme][fields][0]": "name",
              "populate[theme][fields][1]": "slug",
          }
        : {
              "fields[0]": "title",
              "fields[1]": "slug",
              "fields[2]": "short_description",
              "fields[3]": "published_date",
              "fields[4]": "publishedAt",
              "fields[5]": "seo_title",
              "fields[6]": "seo_description",
              "populate[cover_image][fields][0]": "url",
              "populate[cover_image][fields][1]": "alternativeText",
              "populate[cover_image][fields][2]": "width",
              "populate[cover_image][fields][3]": "height",
              "populate[cover_image][fields][4]": "formats",
              "populate[theme][fields][0]": "name",
              "populate[theme][fields][1]": "slug",
              "populate[content][populate]": "*",
          };

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
                            "filters[theme][name][$eqi]": normalizedThemeName,
                        },
                    ]
                  : []),
          ]
        : [{}];

    const paramsVariants = filterVariants.flatMap((filterParams) => [
        {
            ...populateFields,
            ...filterParams,
            "pagination[page]": requestedPage,
            "pagination[pageSize]": safePageSize,
            "sort[0]": "published_date:desc",
            "sort[1]": "publishedAt:desc",
        },
        {
            ...populateFields,
            ...filterParams,
            "pagination[page]": requestedPage,
            "pagination[pageSize]": safePageSize,
            "sort[0]": "publishedAt:desc",
        },
    ]);

    const payload = await fetchWithEndpointFallback({
        endpoints: NEWS_ENDPOINTS,
        paramsVariants,
        signal,
        unauthorizedMessage:
            "UNAUTHORIZED: У Strapi увімкніть permission find для Public role (News/Theme).",
    });

    const pagination = extractStrapiPagination(payload);
    const items = dedupeNewsItems(filterPublishedNews(normalizeCollection(payload)));

    const result = {
        items,
        pagination:
            pagination || {
                page: requestedPage,
                pageSize: safePageSize,
                pageCount: Math.max(1, items.length ? 1 : 0),
                total: items.length,
            },
        hasMore:
            pagination?.page < pagination?.pageCount ||
            false,
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
                "fields[0]": "title",
                "fields[1]": "slug",
                "fields[2]": "short_description",
                "fields[3]": "published_date",
                "fields[4]": "publishedAt",
                "fields[5]": "seo_title",
                "fields[6]": "seo_description",
                "populate[cover_image][fields][0]": "url",
                "populate[cover_image][fields][1]": "alternativeText",
                "populate[cover_image][fields][2]": "width",
                "populate[cover_image][fields][3]": "height",
                "populate[cover_image][fields][4]": "formats",
                "populate[theme][fields][0]": "name",
                "populate[theme][fields][1]": "slug",
                "populate[content][populate]": "*",
                "filters[slug][$eq]": String(slug || "").trim(),
                "pagination[pageSize]": 1,
            },
            {
                "fields[0]": "title",
                "fields[1]": "slug",
                "fields[2]": "short_description",
                "fields[3]": "published_date",
                "fields[4]": "publishedAt",
                "fields[5]": "seo_title",
                "fields[6]": "seo_description",
                "populate[cover_image][fields][0]": "url",
                "populate[cover_image][fields][1]": "alternativeText",
                "populate[cover_image][fields][2]": "width",
                "populate[cover_image][fields][3]": "height",
                "populate[cover_image][fields][4]": "formats",
                "populate[theme][fields][0]": "name",
                "populate[theme][fields][1]": "slug",
                "populate[content][populate]": "*",
                "filters[slug][$eqi]": String(slug || "").trim(),
                "pagination[pageSize]": 1,
            },
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
