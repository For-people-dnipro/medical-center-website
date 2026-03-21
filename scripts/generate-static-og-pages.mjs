import fs from "node:fs/promises";
import path from "node:path";
import {
    SEO_DEFAULT_OG_IMAGE,
    SEO_SITE_NAME,
    getStaticSeo,
} from "../src/seo/seoConfig.js";

const DIST_DIR = path.resolve(process.cwd(), "dist");
const DIST_INDEX_PATH = path.join(DIST_DIR, "index.html");
const DEFAULT_OG_TYPE = "website";
const IMAGE_ALT = 'Медичний центр "Для людей" у Дніпрі';
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

function applySeo(html, { title, description, route }) {
    const routeUrl = buildPublicUrl(route);
    const ogImageUrl = buildPublicUrl(SEO_DEFAULT_OG_IMAGE);
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
    nextHtml = upsertMeta(nextHtml, "property", "og:type", DEFAULT_OG_TYPE);
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

    for (const { route, seoKey } of STATIC_ROUTES) {
        const seo = getStaticSeo(seoKey);
        const pageHtml = applySeo(baseHtml, {
            route,
            title: seo.title,
            description: seo.description,
        });
        const outputPath = getOutputPath(route);

        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, pageHtml, "utf8");
    }
}

main().catch((error) => {
    console.error("Failed to generate static OG pages:", error);
    process.exitCode = 1;
});
