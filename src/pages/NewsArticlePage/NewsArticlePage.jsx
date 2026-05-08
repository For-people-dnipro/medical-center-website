import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContactForm from "../../components/ContactForm/ContactForm";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import NewsContentRenderer from "../../components/NewsContentRenderer/NewsContentRenderer";
import SeoHead from "../../components/Seo/SeoHead";
import { getResponsiveImageProps } from "../../api/foundation";
import { fetchNewsBySlug, formatNewsDate } from "../../api/newsApi";
import { getStaticSeo, withSiteTitle } from "../../seo/seoConfig";
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

function buildNewsArticleFallbackDescription() {
    return (
        "Актуальна новина медичного центру “Для людей” у Дніпрі: " +
        "важливі події клініки, оновлення послуг, рекомендації лікарів та " +
        "корисна інформація для пацієнтів."
    );
}

const PAGE_SEO = getStaticSeo("newsArticle");

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

    const pageTitle = useMemo(
        () => withSiteTitle(newsItem?.seoTitle || newsItem?.title, PAGE_SEO.title),
        [newsItem],
    );

    const pageDescription =
        newsItem?.seoDescription ||
        newsItem?.shortDescription ||
        buildNewsArticleFallbackDescription();
    const heroImage = newsItem?.coverImageHero || newsItem?.coverImage || null;
    const heroImageProps = getResponsiveImageProps(heroImage, {
        variant: "hero",
        sizes: "(max-width: 768px) 100vw, 960px",
    });

    const canonicalPath = slug ? `/news/${slug}` : "/news";

    const articlePublishedIso = toIsoDate(newsItem?.publishedDate);
    const articleModifiedIso = articlePublishedIso || toIsoDate(Date.now());
    const logoUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/apple-touch-icon.png`
            : "";

    const articleSchema =
        newsItem && canonicalPath
            ? {
                  "@context": "https://schema.org",
                  "@type": "NewsArticle",
                  inLanguage: "uk-UA",
                  headline: newsItem.seoTitle || newsItem.title,
                  description: pageDescription,
                  mainEntityOfPage:
                      typeof window !== "undefined"
                          ? `${window.location.origin}${canonicalPath}`
                          : canonicalPath,
                  datePublished: articlePublishedIso || undefined,
                  dateModified: articleModifiedIso || undefined,
                  image: heroImage?.url ? [heroImage.url] : undefined,
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
    const seoProps = {
        title: pageTitle,
        description: pageDescription,
        fallbackTitle: PAGE_SEO.title,
        fallbackDescription: PAGE_SEO.description,
        ogTitle: newsItem?.seoTitle || newsItem?.title || "Новина",
        ogDescription: pageDescription,
        ogImage: heroImage?.url || "",
        ogType: "article",
        canonicalPath,
        articlePublishedTime: articlePublishedIso,
        articleModifiedTime: articleModifiedIso,
        jsonLd: articleSchema,
        preloadImages: heroImageProps?.src
            ? [
                  {
                      href: heroImageProps.src,
                      imageSrcSet: heroImageProps.srcSet,
                      imageSizes: heroImageProps.sizes,
                  },
              ]
            : [],
    };

    if (loading) {
        return (
            <main className="news-article-page">
                <SeoHead {...seoProps} />
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
                <SeoHead {...seoProps} />
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
                <SeoHead {...seoProps} />
                <div className="news-article-page__container">
                    <div className="news-article-page__state" role="status">
                        Новину не знайдено.
                    </div>
                </div>
            </main>
        );
    }

    const dateLabel = formatNewsDate(newsItem.publishedDate);
    const newsTitleForAlt = String(newsItem.title || "Новина").trim();
    const newsHeroAlt = `${newsTitleForAlt} — медичний центр Для Людей, Дніпро`;

    return (
        <main className="news-article-page">
            <SeoHead {...seoProps} />
            <article className="news-article-page__article">
                <div className="news-article-page__container">
                    <Breadcrumbs
                        className="news-article-page__crumbs"
                        ariaLabel="Breadcrumb"
                        allowLastLink
                        items={[
                            { label: "Головна", to: "/" },
                            { label: "Новини", to: "/news" },
                        ]}
                    />

                    <header className="news-article-page__header">
                        <h1 className="news-article-page__title">
                            {newsItem.title}
                        </h1>
                        {dateLabel ? (
                            <time className="news-article-page__date news-article-page__date--header">
                                {dateLabel}
                            </time>
                        ) : null}
                    </header>

                    <div className="news-article-page__content">
                        {heroImageProps?.src ? (
                            <figure
                                className="news-article-page__cover"
                                style={{
                                    "--cover-max-width": `${heroImageProps.width}px`,
                                }}
                            >
                                <img
                                    src={heroImageProps.src}
                                    srcSet={heroImageProps.srcSet}
                                    sizes={heroImageProps.sizes}
                                    alt={newsHeroAlt}
                                    width={heroImageProps.width}
                                    height={heroImageProps.height}
                                    loading="eager"
                                    fetchpriority="high"
                                    decoding="async"
                                />
                            </figure>
                        ) : null}

                        {dateLabel ? (
                            <time className="news-article-page__date news-article-page__date--after-cover">
                                {dateLabel}
                            </time>
                        ) : null}

                        <NewsContentRenderer content={newsItem.content} />
                    </div>
                </div>
            </article>

            <section className="news-article-page__form">
                <ContactForm
                    smallTitle="ПОРУЧ, ЩОБ ДОПОМОГТИ"
                    subtitle="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                />
            </section>
        </main>
    );
}
