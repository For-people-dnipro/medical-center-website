import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NewsFilter from "../../components/NewsFilter/NewsFilter";
import NewsGrid from "../../components/NewsGrid/NewsGrid";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import { fetchNewsList, fetchThemes } from "../../api/newsApi";
import SeoHead from "../../components/Seo/SeoHead";
import { getStaticSeo } from "../../seo/seoConfig";
import { scrollToElementWithOffset } from "../../lib/smoothScroll";
import "./NewsPage.css";

const MOBILE_BREAKPOINT = 768;
const MOBILE_PAGINATION_THRESHOLD = 18;
const SMALL_NEWS_INITIAL_COUNT = 4;
const SMALL_NEWS_STEP = 4;
const MOBILE_PAGE_SIZE = 18;
const DESKTOP_PAGE_SIZE = 9;
const PAGE_SEO = getStaticSeo("news");

function getIsMobileViewport() {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

function parsePageParam(value) {
    const parsed = Number.parseInt(String(value || ""), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parsePositiveIntOrNull(value) {
    const parsed = Number.parseInt(String(value || "").trim(), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function mergeNewsItems(currentItems, nextItems) {
    const getItemKey = (item) =>
        String(item.documentId || item.slug || item.id || "").trim();
    const keys = new Set(currentItems.map((item) => getItemKey(item)));
    const merged = [...currentItems];

    nextItems.forEach((item) => {
        const key = getItemKey(item);
        if (keys.has(key)) return;
        keys.add(key);
        merged.push(item);
    });

    return merged;
}

function getInitialVisibleCount({
    isMobileViewport,
    totalCount,
    pageItemsCount,
}) {
    const safeTotal = Math.max(0, Number(totalCount) || 0);
    const safePageItemsCount = Math.max(0, Number(pageItemsCount) || 0);

    if (!isMobileViewport) {
        return Math.min(SMALL_NEWS_INITIAL_COUNT, safePageItemsCount || safeTotal);
    }

    return Math.min(SMALL_NEWS_INITIAL_COUNT, safePageItemsCount || safeTotal);
}

function buildPaginationItems(currentPage, pageCount) {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    const pages = new Set([1, pageCount, currentPage]);
    pages.add(Math.max(1, currentPage - 1));
    pages.add(Math.min(pageCount, currentPage + 1));

    if (currentPage <= 3) {
        pages.add(2);
        pages.add(3);
        pages.add(4);
    }

    if (currentPage >= pageCount - 2) {
        pages.add(pageCount - 1);
        pages.add(pageCount - 2);
        pages.add(pageCount - 3);
    }

    const sortedPages = Array.from(pages)
        .filter((page) => page >= 1 && page <= pageCount)
        .sort((a, b) => a - b);

    const items = [];
    sortedPages.forEach((page, index) => {
        const previous = sortedPages[index - 1];
        if (index > 0 && page - previous > 1) {
            items.push(`ellipsis-${previous}-${page}`);
        }
        items.push(page);
    });

    return items;
}

export default function NewsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const themeSlug = (searchParams.get("theme") || "").trim();
    const pageParam = (searchParams.get("page") || "").trim();
    const mobilePreviewLimitParam = (
        searchParams.get("preview_mobile_limit") || ""
    ).trim();
    const requestedPage = parsePageParam(pageParam);
    const newsListSectionRef = useRef(null);

    const [themes, setThemes] = useState([]);
    const [newsItems, setNewsItems] = useState([]);
    const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport);
    const [visibleCount, setVisibleCount] = useState(SMALL_NEWS_INITIAL_COUNT);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: DESKTOP_PAGE_SIZE,
        pageCount: 1,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");
    const activeTheme =
        themes.find((theme) => String(theme.slug || "").trim() === themeSlug) ||
        null;
    const activeThemeId = activeTheme?.id || "";
    const activeThemeName = activeTheme?.name || "";
    const previewMobileLimit =
        import.meta.env.DEV && isMobileViewport
            ? parsePositiveIntOrNull(mobilePreviewLimitParam)
            : null;
    const effectiveMobileLimit = previewMobileLimit
        ? Math.max(SMALL_NEWS_INITIAL_COUNT, previewMobileLimit)
        : MOBILE_PAGINATION_THRESHOLD;
    const currentPageSize = isMobileViewport
        ? effectiveMobileLimit
        : DESKTOP_PAGE_SIZE;
    const requestPageForFetch = isMobileViewport ? requestedPage : 1;
    const totalNewsCount = Number(pagination?.total) || 0;
    const isPaginationMode =
        isMobileViewport && totalNewsCount > effectiveMobileLimit;
    const currentPage = Number(pagination?.page) || requestedPage || 1;
    const pageCount = Math.max(1, Number(pagination?.pageCount) || 1);
    const visibleNewsItems = isMobileViewport
        ? newsItems.slice(0, visibleCount)
        : newsItems;
    const canonicalUrl =
        typeof window !== "undefined"
            ? (() => {
                  const params = new URLSearchParams();
                  if (themeSlug) {
                      params.set("theme", themeSlug);
                  }
                  if (isMobileViewport && requestedPage > 1) {
                      params.set("page", String(requestedPage));
                  }
                  const query = params.toString();

                  return `${window.location.origin}/news${query ? `?${query}` : ""}`;
              })()
            : "";

    const listSchema = canonicalUrl
        ? {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              inLanguage: "uk-UA",
              name: "Новини | Для людей",
              description:
                  "Актуальні новини медичного центру “Для людей” у Дніпрі: події, поради, оновлення та акції.",
              url: canonicalUrl,
          }
        : null;

    useEffect(() => {
        const controller = new AbortController();

        async function loadThemes() {
            try {
                const data = await fetchThemes({ signal: controller.signal });
                setThemes(data);
            } catch (requestError) {
                if (requestError?.name === "AbortError") return;
                console.error("Failed to load themes:", requestError);
            }
        }

        loadThemes();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const mediaQuery = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT}px)`,
        );
        const handleChange = (event) => {
            setIsMobileViewport(event.matches);
        };

        setIsMobileViewport(mediaQuery.matches);

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        async function loadFirstPage() {
            setLoading(true);
            setLoadingMore(false);
            setError("");
            setNewsItems([]);
            setVisibleCount(
                getInitialVisibleCount({
                    isMobileViewport,
                    totalCount: 0,
                    pageItemsCount: currentPageSize,
                }),
            );
            setPagination((current) => ({
                ...current,
                page: requestPageForFetch,
                pageSize: currentPageSize,
                pageCount: 1,
                total: 0,
            }));

            try {
                const response = await fetchNewsList({
                    themeSlug,
                    themeName: activeThemeName,
                    themeId: activeThemeId,
                    page: requestPageForFetch,
                    pageSize: currentPageSize,
                    preferServerPagination: isMobileViewport,
                    signal: controller.signal,
                });

                if (controller.signal.aborted) return;

                setNewsItems(response.items);
                const nextPagination = {
                    page: Number(response.pagination?.page) || 1,
                    pageSize: Number(response.pagination?.pageSize) || currentPageSize,
                    pageCount: Math.max(
                        1,
                        Number(response.pagination?.pageCount) || 1,
                    ),
                    total: Math.max(0, Number(response.pagination?.total) || 0),
                };
                setPagination(nextPagination);
                setVisibleCount(
                    getInitialVisibleCount({
                        isMobileViewport,
                        totalCount: nextPagination.total,
                        pageItemsCount: response.items.length,
                    }),
                );

                const fetchedPage = nextPagination.page;
                const fetchedTotal = nextPagination.total;

                if (!isMobileViewport) {
                    if (pageParam) {
                        setSearchParams((previous) => {
                            const params = new URLSearchParams(previous);
                            params.delete("page");
                            return params;
                        }, { replace: true });
                    }
                } else if (fetchedTotal <= effectiveMobileLimit) {
                    if (pageParam) {
                        setSearchParams((previous) => {
                            const params = new URLSearchParams(previous);
                            params.delete("page");
                            return params;
                        }, { replace: true });
                    }
                } else if (fetchedPage !== requestedPage) {
                    setSearchParams((previous) => {
                        const params = new URLSearchParams(previous);
                        if (fetchedPage <= 1) {
                            params.delete("page");
                        } else {
                            params.set("page", String(fetchedPage));
                        }
                        return params;
                    }, { replace: true });
                }
            } catch (requestError) {
                if (requestError?.name === "AbortError") return;
                console.error("Failed to load news list:", requestError);
                const rawMessage = String(requestError?.message || "");
                const friendlyMessage = rawMessage.includes("UNAUTHORIZED")
                    ? "Немає доступу до News API. У Strapi увімкніть `find` для Public role (News і Theme)."
                    : "Не вдалося завантажити новини. Перевірте Strapi API та спробуйте пізніше.";
                const debugSuffix =
                    import.meta.env.DEV && rawMessage ? ` [${rawMessage}]` : "";
                setError(`${friendlyMessage}${debugSuffix}`);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadFirstPage();

        return () => controller.abort();
    }, [
        themeSlug,
        activeThemeName,
        activeThemeId,
        isMobileViewport,
        mobilePreviewLimitParam,
        effectiveMobileLimit,
        currentPageSize,
        requestPageForFetch,
        requestedPage,
        pageParam,
        setSearchParams,
    ]);

    const handleThemeChange = (nextTheme) => {
        setSearchParams((previous) => {
            const params = new URLSearchParams(previous);

            if (nextTheme) {
                params.set("theme", nextTheme);
            } else {
                params.delete("theme");
            }
            params.delete("page");

            return params;
        });
    };

    const scrollToNewsList = () => {
        const section = newsListSectionRef.current;
        if (!section) return;
        scrollToElementWithOffset(section);
    };

    const handleLoadMore = () => {
        if (isMobileViewport) {
            setVisibleCount((current) =>
                Math.min(current + SMALL_NEWS_STEP, newsItems.length),
            );
            return;
        }

        const canLoadMoreDesktop = newsItems.length < totalNewsCount;
        if (loading || loadingMore || !canLoadMoreDesktop) return;

        const nextPage = (Number(pagination?.page) || 1) + 1;
        setLoadingMore(true);
        setError("");

        fetchNewsList({
            themeSlug,
            themeName: activeThemeName,
            themeId: activeThemeId,
            page: nextPage,
            pageSize: DESKTOP_PAGE_SIZE,
            preferServerPagination: false,
        })
            .then((response) => {
                setNewsItems((currentItems) =>
                    mergeNewsItems(currentItems, response.items),
                );
                setPagination((current) => ({
                    ...current,
                    page: Number(response.pagination?.page) || nextPage,
                    pageSize:
                        Number(response.pagination?.pageSize) ||
                        DESKTOP_PAGE_SIZE,
                    pageCount: Math.max(
                        1,
                        Number(response.pagination?.pageCount) || 1,
                    ),
                    total: Math.max(
                        0,
                        Number(response.pagination?.total) ||
                            current.total ||
                            0,
                    ),
                }));
            })
            .catch((requestError) => {
                console.error("Failed to load more news:", requestError);
                const rawMessage = String(requestError?.message || "");
                const friendlyMessage = rawMessage.includes("UNAUTHORIZED")
                    ? "Немає доступу до News API. У Strapi увімкніть `find` для Public role."
                    : "Не вдалося завантажити додаткові новини.";
                const debugSuffix =
                    import.meta.env.DEV && rawMessage ? ` [${rawMessage}]` : "";
                setError(`${friendlyMessage}${debugSuffix}`);
            })
            .finally(() => {
                setLoadingMore(false);
            });
    };

    const handlePageChange = (nextPage) => {
        const safeNextPage = Math.min(Math.max(1, nextPage), pageCount);
        if (safeNextPage === currentPage) return;

        setSearchParams((previous) => {
            const params = new URLSearchParams(previous);

            if (safeNextPage <= 1) {
                params.delete("page");
            } else {
                params.set("page", String(safeNextPage));
            }

            return params;
        });

        scrollToNewsList();
    };

    const paginationItems = buildPaginationItems(currentPage, pageCount);
    const canRevealMoreOnCurrentPage =
        isMobileViewport && visibleNewsItems.length < newsItems.length;
    const canLoadMoreDesktop =
        !isMobileViewport && newsItems.length > 0 && newsItems.length < totalNewsCount;
    const shouldShowLoadMore =
        !loading && !error && (canRevealMoreOnCurrentPage || canLoadMoreDesktop);
    const shouldShowPagination =
        !loading &&
        !error &&
        isPaginationMode &&
        pageCount > 1 &&
        !canRevealMoreOnCurrentPage;
    const isEmptyState = !loading && !error && newsItems.length === 0;
    const prevButtonLabel = isMobileViewport ? "←" : "Попередня";
    const nextButtonLabel = isMobileViewport ? "→" : "Наступна";
    const emptyNewsMessage = themeSlug
        ? "Наразі новин за цією темою немає."
        : "Наразі новин немає.";

    return (
        <main className={`news-page ${isEmptyState ? "news-page--empty" : ""}`.trim()}>
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                ogTitle={PAGE_SEO.title}
                ogDescription={PAGE_SEO.description}
                canonicalUrl={canonicalUrl}
                ogType="website"
                jsonLd={listSchema}
            />
            <section className="news-page__hero">
                <div className="news-page__container">
                    <Breadcrumbs
                        className="news-page__crumbs"
                        ariaLabel="Breadcrumb"
                        items={[
                            { label: "Головна", to: "/" },
                            { label: "Новини" },
                        ]}
                    />
                    <h1 className="news-page__title">НОВИНИ</h1>
                    <h3 className="news-page__subtitle">
                        Будьте в курсі найважливішого: нові послуги, акції,
                        корисні поради та життя нашої клініки.
                    </h3>
                    <div className="news-page__filter">
                        <NewsFilter
                            themes={themes}
                            selectedTheme={themeSlug}
                            onChange={handleThemeChange}
                        />
                    </div>
                </div>
            </section>

            <section className="news-page__list" ref={newsListSectionRef}>
                <div className="news-page__container">
                    {!loading && error ? (
                        <div
                            className="news-page__state news-page__state--error"
                            role="alert"
                        >
                            {error}
                        </div>
                    ) : null}

                    {isEmptyState ? (
                        <p className="news-page__empty-text" role="status">
                            {emptyNewsMessage}
                        </p>
                    ) : null}

                    {!loading && !error && newsItems.length > 0 ? (
                        <NewsGrid items={visibleNewsItems} />
                    ) : null}

                    {shouldShowLoadMore ? (
                        <div className="news-page__load-more-wrap">
                            <LoadMoreButton
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                isLoading={loadingMore}
                                label="Показати більше"
                                loadingLabel="Завантаження..."
                            />
                        </div>
                    ) : null}

                    {shouldShowPagination ? (
                        <nav
                            className="news-page__pagination"
                            aria-label="Пагінація новин"
                        >
                            <button
                                type="button"
                                className="news-page__pagination-nav"
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage <= 1}
                                aria-label="Попередня сторінка"
                            >
                                {prevButtonLabel}
                            </button>

                            <div className="news-page__pagination-pages">
                                {paginationItems.map((item) =>
                                    typeof item === "number" ? (
                                        <button
                                            key={item}
                                            type="button"
                                            className={`news-page__pagination-page ${
                                                item === currentPage
                                                    ? "is-active"
                                                    : ""
                                            }`.trim()}
                                            onClick={() =>
                                                handlePageChange(item)
                                            }
                                            aria-current={
                                                item === currentPage
                                                    ? "page"
                                                    : undefined
                                            }
                                        >
                                            {item}
                                        </button>
                                    ) : (
                                        <span
                                            key={item}
                                            className="news-page__pagination-ellipsis"
                                            aria-hidden="true"
                                        >
                                            …
                                        </span>
                                    ),
                                )}
                            </div>

                            <button
                                type="button"
                                className="news-page__pagination-nav"
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage >= pageCount}
                                aria-label="Наступна сторінка"
                            >
                                {nextButtonLabel}
                            </button>
                        </nav>
                    ) : null}
                </div>
            </section>
        </main>
    );
}
