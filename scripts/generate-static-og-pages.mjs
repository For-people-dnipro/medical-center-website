import fs from "node:fs/promises";
import path from "node:path";
import {
    SEO_DEFAULT_OG_IMAGE,
    SEO_SITE_NAME,
    buildDoctorFallbackDescription,
    buildDoctorFallbackTitle,
    getStaticSeo,
    withSiteTitle,
} from "../src/seo/seoConfig.js";

const DIST_DIR = path.resolve(process.cwd(), "dist");
const DIST_INDEX_PATH = path.join(DIST_DIR, "index.html");
const DIST_SITEMAP_PATH = path.join(DIST_DIR, "sitemap.xml");
const DEFAULT_OG_TYPE = "website";
const IMAGE_ALT = 'Медичний центр "Для людей" у Дніпрі';
const API_BASE_URL = String(
    process.env.VITE_API_URL ||
        process.env.VITE_STRAPI_URL ||
        process.env.VITE_API_PROXY_TARGET ||
        "http://localhost:1337",
)
    .trim()
    .replace(/\/+$/, "");
const STATIC_ROUTES = [
    { route: "/", seoKey: "home" },
    { route: "/about", seoKey: "about" },
    { route: "/services", seoKey: "services" },
    { route: "/declaration", seoKey: "declaration" },
    { route: "/consultation", seoKey: "consultation" },
    { route: "/diagnostics", seoKey: "diagnostics" },
    { route: "/manipulation", seoKey: "manipulation" },
    { route: "/vaccination", seoKey: "vaccination" },
    { route: "/packages", seoKey: "packages" },
    { route: "/checkup", seoKey: "checkup" },
    { route: "/check-up", seoKey: "checkup" },
    { route: "/screening-40-plus", seoKey: "screening40" },
    { route: "/air-alert", seoKey: "airAlert" },
    { route: "/offer", seoKey: "offer" },
    { route: "/privacy", seoKey: "privacy" },
    { route: "/data-protection", seoKey: "dataProtection" },
    { route: "/free-services", seoKey: "freeServices" },
    { route: "/doctors", seoKey: "doctors" },
    { route: "/branches", seoKey: "branches" },
    { route: "/analyses", seoKey: "analyses" },
    { route: "/vacancies", seoKey: "vacancies" },
    { route: "/news", seoKey: "news" },
    { route: "/contacts", seoKey: "contacts" },
];

function toText(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function pickSource(entry) {
    return entry?.attributes ?? entry ?? {};
}

function normalizePath(value = "/") {
    return value.startsWith("/") ? value : `/${value}`;
}

function toAbsoluteMediaUrl(url) {
    const text = toText(url);
    if (!text) return "";
    if (/^https?:\/\//i.test(text)) return text;
    if (text.startsWith("//")) return `https:${text}`;
    return `${API_BASE_URL}${normalizePath(text)}`;
}

function getDoctorFullName(source) {
    const fullName = toText(source.fullName);
    if (fullName) return fullName;

    return [toText(source.surname), toText(source.name), toText(source.middleName)]
        .filter(Boolean)
        .join(" ")
        .trim();
}

function extractCollectionRows(payload) {
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
}

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`);
    }

    return response.json();
}

async function fetchDynamicEntries() {
    const [newsPayload, doctorsPayload] = await Promise.all([
        fetchJson(
            `${API_BASE_URL}/api/news?populate=*&pagination[pageSize]=1000`,
        ).catch(() => ({ data: [] })),
        fetchJson(
            `${API_BASE_URL}/api/doctors?populate=*&filters[isActive][$eq]=true&pagination[pageSize]=1000`,
        ).catch(() => ({ data: [] })),
    ]);

    const newsEntries = extractCollectionRows(newsPayload)
        .map((entry) => {
            const source = pickSource(entry);
            const slug = toText(source.slug);
            const title = toText(source.seo_title || source.seoTitle || source.title);
            const description = toText(
                source.seo_description ||
                    source.seoDescription ||
                    source.short_description,
            );
            const imageUrl = toAbsoluteMediaUrl(
                source.cover_image?.url || source.cover_image?.data?.attributes?.url,
            );

            if (!slug || !title) return null;

            return {
                route: `/news/${slug}`,
                title: withSiteTitle(title, getStaticSeo("newsArticle").title),
                description: description || getStaticSeo("newsArticle").description,
                ogType: "article",
                ogImage: imageUrl || buildPublicUrl(SEO_DEFAULT_OG_IMAGE),
            };
        })
        .filter(Boolean);

    const doctorEntries = extractCollectionRows(doctorsPayload)
        .map((entry) => {
            const source = pickSource(entry);
            const slug = toText(source.slug);
            const fullName = getDoctorFullName(source);
            const title = withSiteTitle(
                toText(source.seo_title || source.seoTitle),
                buildDoctorFallbackTitle(fullName),
            );
            const description =
                toText(source.seo_description || source.seoDescription) ||
                buildDoctorFallbackDescription({ fullName });
            const imageUrl = toAbsoluteMediaUrl(
                source.photo?.url || source.photo?.data?.attributes?.url,
            );

            if (!slug || !fullName) return null;

            return {
                route: `/doctors/${slug}`,
                title,
                description,
                ogType: "website",
                ogImage: imageUrl || buildPublicUrl(SEO_DEFAULT_OG_IMAGE),
            };
        })
        .filter(Boolean);

    return [...newsEntries, ...doctorEntries];
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPublicUrl(rawPath = "/") {
    const siteUrl = String(process.env.VITE_SITE_URL || "").trim().replace(
        /\/+$/,
        "",
    );
    const normalizedPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

    if (!siteUrl) {
        return normalizedPath;
    }

    return `${siteUrl}${normalizedPath}`;
}

function upsertTitle(html, title) {
    const tag = `<title>${escapeHtml(title)}</title>`;

    if (/<title>[\s\S]*?<\/title>/i.test(html)) {
        return html.replace(/<title>[\s\S]*?<\/title>/i, tag);
    }

    return html.replace("</head>", `    ${tag}\n</head>`);
}

function upsertMeta(html, attributeName, attributeValue, content) {
    const safeContent = escapeHtml(content);
    const tag = `<meta ${attributeName}="${attributeValue}" content="${safeContent}" />`;
    const matcher = new RegExp(
        `<meta\\b[^>]*${attributeName}=["']${escapeRegex(attributeValue)}["'][^>]*>`,
        "i",
    );

    if (matcher.test(html)) {
        return html.replace(matcher, tag);
    }

    return html.replace("</head>", `    ${tag}\n</head>`);
}

function removeMeta(html, attributeName, attributeValue) {
    const matcher = new RegExp(
        `\\s*<meta\\b[^>]*${attributeName}=["']${escapeRegex(attributeValue)}["'][^>]*>\\s*`,
        "i",
    );

    return html.replace(matcher, "\n");
}

function upsertLink(html, rel, href) {
    const safeHref = escapeHtml(href);
    const tag = `<link rel="${rel}" href="${safeHref}" />`;
    const matcher = new RegExp(
        `<link\\b[^>]*rel=["']${escapeRegex(rel)}["'][^>]*>`,
        "i",
    );

    if (matcher.test(html)) {
        return html.replace(matcher, tag);
    }

    return html.replace("</head>", `    ${tag}\n</head>`);
}

function removeLink(html, rel) {
    const matcher = new RegExp(
        `\\s*<link\\b[^>]*rel=["']${escapeRegex(rel)}["'][^>]*>\\s*`,
        "i",
    );

    return html.replace(matcher, "\n");
}

function applySeo(html, { title, description, route, ogType = DEFAULT_OG_TYPE, ogImage }) {
    const routeUrl = buildPublicUrl(route);
    const ogImageUrl = ogImage || buildPublicUrl(SEO_DEFAULT_OG_IMAGE);
    const hasAbsoluteSiteUrl = /^https?:\/\//i.test(routeUrl);
    let nextHtml = html;

    nextHtml = upsertTitle(nextHtml, title);
    nextHtml = upsertMeta(nextHtml, "name", "description", description);
    nextHtml = upsertMeta(nextHtml, "property", "og:site_name", SEO_SITE_NAME);
    nextHtml = upsertMeta(nextHtml, "property", "og:title", title);
    nextHtml = upsertMeta(nextHtml, "property", "og:description", description);
    nextHtml = upsertMeta(nextHtml, "property", "og:image", ogImageUrl);
    nextHtml = upsertMeta(nextHtml, "property", "og:image:width", "1200");
    nextHtml = upsertMeta(nextHtml, "property", "og:image:height", "630");
    nextHtml = upsertMeta(nextHtml, "property", "og:image:alt", IMAGE_ALT);
    nextHtml = upsertMeta(nextHtml, "property", "og:type", ogType);
    nextHtml = upsertMeta(
        nextHtml,
        "name",
        "twitter:card",
        "summary_large_image",
    );
    nextHtml = upsertMeta(nextHtml, "name", "twitter:title", title);
    nextHtml = upsertMeta(
        nextHtml,
        "name",
        "twitter:description",
        description,
    );
    nextHtml = upsertMeta(nextHtml, "name", "twitter:image", ogImageUrl);

    if (hasAbsoluteSiteUrl) {
        nextHtml = upsertMeta(nextHtml, "property", "og:url", routeUrl);
        nextHtml = upsertLink(nextHtml, "canonical", routeUrl);
    } else {
        nextHtml = removeMeta(nextHtml, "property", "og:url");
        nextHtml = removeLink(nextHtml, "canonical");
    }

    return nextHtml;
}

function getOutputPath(route) {
    if (route === "/") {
        return DIST_INDEX_PATH;
    }

    const directoryPath = path.join(DIST_DIR, route.replace(/^\/+/, ""));
    return path.join(directoryPath, "index.html");
}

async function main() {
    const baseHtml = await fs.readFile(DIST_INDEX_PATH, "utf8");
    const dynamicEntries = await fetchDynamicEntries();

    if (dynamicEntries.length === 0) {
        console.warn(
            "[generate-static-og-pages] No dynamic news/doctor routes were generated. " +
                "Ensure Strapi is running and VITE_API_URL points to it during build.",
        );
    }

    const allEntries = [
        ...STATIC_ROUTES.map(({ route, seoKey }) => ({
            route,
            ...getStaticSeo(seoKey),
        })),
        ...dynamicEntries,
    ];

    for (const seo of allEntries) {
        const { route } = seo;
        const pageHtml = applySeo(baseHtml, {
            route,
            title: seo.title,
            description: seo.description,
            ogType: seo.ogType,
            ogImage: seo.ogImage,
        });
        const outputPath = getOutputPath(route);

        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, pageHtml, "utf8");
    }

    const sitemapEntries = allEntries
        .map(({ route }) => buildPublicUrl(route))
        .filter((url) => /^https?:\/\//i.test(url));

    if (sitemapEntries.length > 0) {
        const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries
            .map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`)
            .join("\n")}\n</urlset>\n`;
        await fs.writeFile(DIST_SITEMAP_PATH, sitemapXml, "utf8");
    }
}

main().catch((error) => {
    console.error("Failed to generate static OG pages:", error);
    process.exitCode = 1;
});
