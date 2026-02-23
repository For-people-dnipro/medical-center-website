import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NewsFilter from "../../components/NewsFilter/NewsFilter";
import NewsGrid from "../../components/NewsGrid/NewsGrid";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import { fetchNewsList, fetchThemes } from "../../api/newsApi";
import useSeoMeta from "../../hooks/useSeoMeta";
import "./NewsPage.css";

const CARDS_PER_ROW = 3;
const ROWS_PER_BATCH = 3;
const PAGE_SIZE = CARDS_PER_ROW * ROWS_PER_BATCH;
const LOAD_MORE_THRESHOLD = PAGE_SIZE;

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

export default function NewsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const themeSlug = (searchParams.get("theme") || "").trim();

    const [themes, setThemes] = useState([]);
    const [newsItems, setNewsItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalNewsCount, setTotalNewsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");
    const activeTheme =
        themes.find((theme) => String(theme.slug || "").trim() === themeSlug) ||
        null;
    const activeThemeId = activeTheme?.id || "";
    const activeThemeName = activeTheme?.name || "";
    const canonicalUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/news${
                  themeSlug ? `?theme=${encodeURIComponent(themeSlug)}` : ""
              }`
            : "";

    const listSchema = canonicalUrl
        ? {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              inLanguage: "uk-UA",
              name: "Новини | Для людей",
              description:
                  "Актуальні новини медичного центру “Для людей”: події, поради, оновлення та акції.",
              url: canonicalUrl,
          }
        : null;

    useSeoMeta({
        title: "Новини | Для людей",
        description:
            "Читайте актуальні новини медичного центру “Для людей”: події, корисні матеріали, акції та оновлення.",
        ogTitle: "Новини | Для людей",
        ogDescription:
            "Актуальні новини медичного центру “Для людей”. Обирайте тему та переглядайте останні публікації.",
        canonicalUrl,
        type: "website",
        robots: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
        jsonLd: listSchema,
    });

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
        const controller = new AbortController();

        async function loadFirstPage() {
            setLoading(true);
            setError("");
            setPage(1);
            setNewsItems([]);
            setTotalNewsCount(0);

            try {
                const response = await fetchNewsList({
                    themeSlug,
                    themeName: activeThemeName,
                    themeId: activeThemeId,
                    page: 1,
                    pageSize: PAGE_SIZE,
                    signal: controller.signal,
                });

                setNewsItems(response.items);
                setTotalNewsCount(response.pagination?.total || 0);
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
    }, [themeSlug, activeThemeName, activeThemeId]);

    const handleThemeChange = (nextTheme) => {
        setSearchParams((previous) => {
            const params = new URLSearchParams(previous);

            if (nextTheme) {
                params.set("theme", nextTheme);
            } else {
                params.delete("theme");
            }

            return params;
        });
    };

    const handleLoadMore = async () => {
        const canLoadMore = newsItems.length < totalNewsCount;
        if (loadingMore || !canLoadMore) return;

        const nextPage = page + 1;
        setLoadingMore(true);
        setError("");

        try {
            const response = await fetchNewsList({
                themeSlug,
                themeName: activeThemeName,
                themeId: activeThemeId,
                page: nextPage,
                pageSize: PAGE_SIZE,
            });

            setNewsItems((currentItems) =>
                mergeNewsItems(currentItems, response.items),
            );
            setPage(nextPage);
            setTotalNewsCount(response.pagination?.total || 0);
        } catch (requestError) {
            console.error("Failed to load more news:", requestError);
            const rawMessage = String(requestError?.message || "");
            const friendlyMessage = rawMessage.includes("UNAUTHORIZED")
                ? "Немає доступу до News API. У Strapi увімкніть `find` для Public role."
                : "Не вдалося завантажити додаткові новини.";
            const debugSuffix =
                import.meta.env.DEV && rawMessage ? ` [${rawMessage}]` : "";
            setError(`${friendlyMessage}${debugSuffix}`);
        } finally {
            setLoadingMore(false);
        }
    };

    const shouldShowLoadMore =
        !loading &&
        !error &&
        totalNewsCount > LOAD_MORE_THRESHOLD &&
        newsItems.length < totalNewsCount;

    return (
        <main className="news-page">
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

            <section className="news-page__list">
                <div className="news-page__container">
                    {loading ? (
                        <div className="news-page__state" role="status">
                            Завантажуємо новини...
                        </div>
                    ) : null}

                    {!loading && error ? (
                        <div
                            className="news-page__state news-page__state--error"
                            role="alert"
                        >
                            {error}
                        </div>
                    ) : null}

                    {!loading && !error && newsItems.length === 0 ? (
                        <div className="news-page__state" role="status">
                            Новин за вибраною темою поки немає.
                        </div>
                    ) : null}

                    {!loading && !error && newsItems.length > 0 ? (
                        <NewsGrid items={newsItems} />
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
                </div>
            </section>
        </main>
    );
}
