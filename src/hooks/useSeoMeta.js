import { useEffect } from "react";

function upsertMeta(key, value, content) {
    const selector = `meta[${key}="${value}"]`;
    let node = document.head.querySelector(selector);

    if (!node) {
        node = document.createElement("meta");
        node.setAttribute(key, value);
        document.head.appendChild(node);
    }

    if (content) {
        node.setAttribute("content", content);
    } else {
        node.removeAttribute("content");
    }
}

function upsertCanonical(url) {
    if (!url) return;

    let node = document.head.querySelector('link[rel="canonical"]');
    if (!node) {
        node = document.createElement("link");
        node.setAttribute("rel", "canonical");
        document.head.appendChild(node);
    }
    node.setAttribute("href", url);
}

function upsertJsonLd(jsonLd) {
    const scriptId = "seo-jsonld";
    let node = document.head.querySelector(`#${scriptId}`);

    if (!jsonLd) {
        if (node) node.remove();
        return;
    }

    if (!node) {
        node = document.createElement("script");
        node.id = scriptId;
        node.setAttribute("type", "application/ld+json");
        document.head.appendChild(node);
    }

    node.textContent = JSON.stringify(jsonLd);
}

export default function useSeoMeta({
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    type = "website",
    robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    locale = "uk_UA",
    siteName = "Для людей медичний центр",
    twitterCard = "summary_large_image",
    language = "uk",
    articlePublishedTime = "",
    articleModifiedTime = "",
    jsonLd = null,
} = {}) {
    useEffect(() => {
        if (title) {
            document.title = title;
        }

        if (language) {
            document.documentElement.lang = language;
        }

        upsertMeta("name", "description", description || "");
        upsertMeta("name", "robots", robots || "");
        upsertMeta("name", "googlebot", robots || "");
        upsertMeta("property", "og:type", type);
        upsertMeta("property", "og:title", ogTitle || title || "");
        upsertMeta(
            "property",
            "og:description",
            ogDescription || description || "",
        );
        upsertMeta("property", "og:locale", locale || "");
        upsertMeta("property", "og:site_name", siteName || "");
        upsertMeta("property", "og:url", canonicalUrl || "");

        if (ogImage) {
            upsertMeta("property", "og:image", ogImage);
        }

        upsertMeta("name", "twitter:card", twitterCard || "");
        upsertMeta("name", "twitter:title", ogTitle || title || "");
        upsertMeta(
            "name",
            "twitter:description",
            ogDescription || description || "",
        );
        upsertMeta("name", "twitter:image", ogImage || "");

        if (type === "article") {
            upsertMeta(
                "property",
                "article:published_time",
                articlePublishedTime || "",
            );
            upsertMeta(
                "property",
                "article:modified_time",
                articleModifiedTime || "",
            );
        } else {
            upsertMeta("property", "article:published_time", "");
            upsertMeta("property", "article:modified_time", "");
        }

        upsertCanonical(canonicalUrl);
        upsertJsonLd(jsonLd);
    }, [
        articleModifiedTime,
        articlePublishedTime,
        canonicalUrl,
        description,
        jsonLd,
        language,
        locale,
        ogDescription,
        ogImage,
        ogTitle,
        robots,
        siteName,
        title,
        twitterCard,
        type,
    ]);
}
