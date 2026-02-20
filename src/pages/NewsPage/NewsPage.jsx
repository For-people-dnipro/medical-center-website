import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NewsFilter from "../../components/NewsFilter/NewsFilter";
import NewsGrid from "../../components/NewsGrid/NewsGrid";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { fetchNewsList, fetchThemes } from "../../api/newsApi";
import useSeoMeta from "../../hooks/useSeoMeta";
import "./NewsPage.css";

const PAGE_SIZE = 9;

function mergeNewsItems(currentItems, nextItems) {
    const keys = new Set(
        currentItems.map((item) => String(item.id || item.slug || "")),
    );
    const merged = [...currentItems];

    nextItems.forEach((item) => {
        const key = String(item.id || item.slug || "");
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
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");
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
            setHasMore(false);

            try {
                const response = await fetchNewsList({
                    themeSlug,
                    page: 1,
                    pageSize: PAGE_SIZE,
                    signal: controller.signal,
                });

                setNewsItems(response.items);
                setHasMore(response.hasMore);
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
    }, [themeSlug]);

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
        if (loadingMore || !hasMore) return;

        const nextPage = page + 1;
        setLoadingMore(true);
        setError("");

        try {
            const response = await fetchNewsList({
                themeSlug,
                page: nextPage,
                pageSize: PAGE_SIZE,
            });

            setNewsItems((currentItems) =>
                mergeNewsItems(currentItems, response.items),
            );
            setPage(nextPage);
            setHasMore(response.hasMore);
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

                    {!loading && !error && hasMore ? (
                        <div className="news-page__load-more-wrap">
                            <button
                                type="button"
                                className="news-page__load-more"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                <span>
                                    {loadingMore
                                        ? "Завантаження..."
                                        : "Показати більше"}
                                </span>
                                <img src="/icons/arrow-down.svg" alt="" />
                            </button>
                        </div>
                    ) : null}
                </div>
            </section>
        </main>
    );
}
