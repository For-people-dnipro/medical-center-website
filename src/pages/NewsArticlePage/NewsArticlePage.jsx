import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContactForm from "../../components/ContactForm/ContactForm";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import NewsContentRenderer from "../../components/NewsContentRenderer/NewsContentRenderer";
import { fetchNewsBySlug, formatNewsDate } from "../../api/newsApi";
import useSeoMeta from "../../hooks/useSeoMeta";
import "./NewsArticlePage.css";

function toIsoDate(value) {
    if (!value) return "";

    if (typeof value === "string" && /^\d+$/.test(value.trim())) {
        const parsed = new Date(Number(value.trim()));
        return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}

export default function NewsArticlePage() {
    const { slug = "" } = useParams();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function loadNewsBySlug() {
            if (!slug) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");
            setNotFound(false);

            try {
                const data = await fetchNewsBySlug(slug, {
                    signal: controller.signal,
                });

                if (!data) {
                    setNotFound(true);
                    setNewsItem(null);
                    return;
                }

                setNewsItem(data);
            } catch (requestError) {
                if (requestError?.name === "AbortError") return;
                console.error("Failed to load news by slug:", requestError);
                const rawMessage = String(requestError?.message || "");
                setError(
                    rawMessage.includes("UNAUTHORIZED")
                        ? "Немає доступу до News API. У Strapi увімкніть `find` для Public role."
                        : "Не вдалося завантажити новину. Спробуйте пізніше.",
                );
                setNewsItem(null);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadNewsBySlug();

        return () => controller.abort();
    }, [slug]);

    const pageTitle = useMemo(() => {
        if (!newsItem) return "Новина | Для людей";
        return `${newsItem.seoTitle || newsItem.title} | Для людей`;
    }, [newsItem]);

    const pageDescription =
        newsItem?.seoDescription ||
        newsItem?.shortDescription ||
        "Новини медичного центру “Для людей”.";

    const canonicalUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/news/${slug}`
            : "";

    const articlePublishedIso = toIsoDate(newsItem?.publishedDate);
    const articleModifiedIso = articlePublishedIso || toIsoDate(Date.now());
    const logoUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/apple-touch-icon.png`
            : "";

    const articleSchema =
        newsItem && canonicalUrl
            ? {
                  "@context": "https://schema.org",
                  "@type": "NewsArticle",
                  inLanguage: "uk-UA",
                  headline: newsItem.seoTitle || newsItem.title,
                  description: pageDescription,
                  mainEntityOfPage: canonicalUrl,
                  datePublished: articlePublishedIso || undefined,
                  dateModified: articleModifiedIso || undefined,
                  image: newsItem.coverImage?.url
                      ? [newsItem.coverImage.url]
                      : undefined,
                  publisher: {
                      "@type": "Organization",
                      name: "Для людей медичний центр",
                      logo: logoUrl
                          ? {
                                "@type": "ImageObject",
                                url: logoUrl,
                            }
                          : undefined,
                  },
              }
            : null;

    useSeoMeta({
        title: pageTitle,
        description: pageDescription,
        ogTitle: newsItem?.seoTitle || newsItem?.title || "Новина",
        ogDescription: pageDescription,
        ogImage: newsItem?.coverImage?.url || "",
        canonicalUrl,
        type: "article",
        robots: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
        articlePublishedTime: articlePublishedIso,
        articleModifiedTime: articleModifiedIso,
        jsonLd: articleSchema,
    });

    if (loading) {
        return (
            <main className="news-article-page">
                <div className="news-article-page__container">
                    <div className="news-article-page__state" role="status">
                        Завантажуємо новину...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="news-article-page">
                <div className="news-article-page__container">
                    <div
                        className="news-article-page__state news-article-page__state--error"
                        role="alert"
                    >
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (notFound || !newsItem) {
        return (
            <main className="news-article-page">
                <div className="news-article-page__container">
                    <div className="news-article-page__state" role="status">
                        Новину не знайдено.
                    </div>

                    <div className="news-article-page__actions">
                        <Link to="/news" className="news-article-page__back-button">
                            Повернутися до списку новин
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const dateLabel = formatNewsDate(newsItem.publishedDate);

    return (
        <main className="news-article-page">
            <article className="news-article-page__article">
                <div className="news-article-page__container">
                    <Breadcrumbs
                        className="news-article-page__crumbs"
                        ariaLabel="Breadcrumb"
                        items={[
                            { label: "Головна", to: "/" },
                            { label: "Новини", to: "/news" },
                            { label: newsItem.title },
                        ]}
                    />

                    <header className="news-article-page__header">
                        <h1 className="news-article-page__title">{newsItem.title}</h1>
                        {dateLabel ? (
                            <time className="news-article-page__date">
                                {dateLabel}
                            </time>
                        ) : null}
                    </header>

                    {newsItem.coverImage?.url ? (
                        <figure className="news-article-page__cover">
                            <img
                                src={newsItem.coverImage.url}
                                alt={newsItem.coverImage.alt || newsItem.title}
                                width={newsItem.coverImage.width}
                                height={newsItem.coverImage.height}
                                loading="lazy"
                                decoding="async"
                            />
                        </figure>
                    ) : null}

                    <NewsContentRenderer content={newsItem.content} />

                    <div className="news-article-page__actions">
                        <Link to="/news" className="news-article-page__back-button">
                            Повернутися до списку новин
                        </Link>
                    </div>
                </div>
            </article>

            <section className="news-article-page__form">
                <ContactForm
                    smallTitle="МИ ЗАВЖДИ ПОРУЧ, ЩОБ ДОПОМОГТИ"
                    subtitle="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                />
            </section>
        </main>
    );
}
