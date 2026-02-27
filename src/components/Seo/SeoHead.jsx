import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import {
    SEO_DEFAULT_DESCRIPTION,
    SEO_DEFAULT_LANGUAGE,
    SEO_DEFAULT_LOCALE,
    SEO_DEFAULT_ROBOTS,
    SEO_DEFAULT_TITLE,
    SEO_SITE_NAME,
    firstSeoText,
} from "../../seo/seoConfig";

function getCurrentOrigin() {
    if (typeof window === "undefined") return "";
    return window.location.origin || "";
}

function toAbsoluteUrl(value) {
    const text = firstSeoText(value);
    if (!text) return "";
    if (/^https?:\/\//i.test(text)) return text;
    if (text.startsWith("//")) return `https:${text}`;

    const origin = getCurrentOrigin();
    if (!origin) return text;
    return text.startsWith("/") ? `${origin}${text}` : `${origin}/${text}`;
}

function buildCanonicalUrl({ canonicalUrl, canonicalPath, pathname, search }) {
    const explicitUrl = firstSeoText(canonicalUrl);
    if (explicitUrl) return toAbsoluteUrl(explicitUrl);

    const origin = getCurrentOrigin();
    if (!origin) return "";

    const explicitPath = firstSeoText(canonicalPath);
    const routePath = firstSeoText(pathname, "/");
    const routeSearch = firstSeoText(search);
    const raw = explicitPath || `${routePath}${routeSearch}`;
    const normalized = raw.startsWith("/") ? raw : `/${raw}`;
    return `${origin}${normalized}`;
}

export default function SeoHead({
    title = "",
    description = "",
    fallbackTitle = SEO_DEFAULT_TITLE,
    fallbackDescription = SEO_DEFAULT_DESCRIPTION,
    ogTitle = "",
    ogDescription = "",
    ogType = "website",
    ogImage = "",
    canonicalPath = "",
    canonicalUrl = "",
    robots = SEO_DEFAULT_ROBOTS,
    locale = SEO_DEFAULT_LOCALE,
    siteName = SEO_SITE_NAME,
    language = SEO_DEFAULT_LANGUAGE,
    articlePublishedTime = "",
    articleModifiedTime = "",
    jsonLd = null,
}) {
    const location = useLocation();

    const resolvedTitle = firstSeoText(title, fallbackTitle, SEO_DEFAULT_TITLE);
    const resolvedDescription = firstSeoText(
        description,
        fallbackDescription,
        SEO_DEFAULT_DESCRIPTION,
    );
    const resolvedOgTitle = firstSeoText(ogTitle, resolvedTitle);
    const resolvedOgDescription = firstSeoText(
        ogDescription,
        resolvedDescription,
    );
    const resolvedCanonicalUrl = buildCanonicalUrl({
        canonicalUrl,
        canonicalPath,
        pathname: location.pathname,
        search: location.search,
    });
    const resolvedOgImage = toAbsoluteUrl(ogImage);
    const resolvedRobots = firstSeoText(robots, SEO_DEFAULT_ROBOTS);
    const safeType = firstSeoText(ogType, "website");

    return (
        <Helmet prioritizeSeoTags>
            <html lang={language} />
            <title>{resolvedTitle}</title>

            <meta name="description" content={resolvedDescription} />
            <meta name="robots" content={resolvedRobots} />
            <meta name="googlebot" content={resolvedRobots} />

            <meta property="og:title" content={resolvedOgTitle} />
            <meta property="og:description" content={resolvedOgDescription} />
            <meta property="og:type" content={safeType} />
            <meta property="og:locale" content={locale} />
            <meta property="og:site_name" content={siteName} />

            {resolvedCanonicalUrl ? (
                <>
                    <meta property="og:url" content={resolvedCanonicalUrl} />
                    <link rel="canonical" href={resolvedCanonicalUrl} />
                </>
            ) : null}

            {resolvedOgImage ? (
                <meta property="og:image" content={resolvedOgImage} />
            ) : null}

            <meta
                name="twitter:card"
                content={resolvedOgImage ? "summary_large_image" : "summary"}
            />
            <meta name="twitter:title" content={resolvedOgTitle} />
            <meta
                name="twitter:description"
                content={resolvedOgDescription}
            />
            {resolvedOgImage ? (
                <meta name="twitter:image" content={resolvedOgImage} />
            ) : null}

            {safeType === "article" && articlePublishedTime ? (
                <meta
                    property="article:published_time"
                    content={articlePublishedTime}
                />
            ) : null}
            {safeType === "article" && articleModifiedTime ? (
                <meta
                    property="article:modified_time"
                    content={articleModifiedTime}
                />
            ) : null}

            {jsonLd ? (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            ) : null}
        </Helmet>
    );
}
