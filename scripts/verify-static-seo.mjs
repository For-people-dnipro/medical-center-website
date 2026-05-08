import fs from "node:fs/promises";
import path from "node:path";
import { getStaticSeo } from "../src/seo/seoConfig.js";

const DIST_DIR = path.resolve(process.cwd(), "dist");
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

function getOutputPath(route) {
    if (route === "/") {
        return path.join(DIST_DIR, "index.html");
    }

    return path.join(DIST_DIR, route.replace(/^\/+/, ""), "index.html");
}

function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasExpectedTag(html, tagName, expectedValue) {
    const matcher =
        tagName === "title"
            ? new RegExp(`<title>${escapeRegex(expectedValue)}</title>`, "i")
            : new RegExp(
                  `<meta\\s+name=["']description["']\\s+content=["']${escapeRegex(expectedValue)}["']\\s*/?>`,
                  "i",
              );

    return matcher.test(html);
}

async function main() {
    const failures = [];

    for (const { route, seoKey } of STATIC_ROUTES) {
        const outputPath = getOutputPath(route);
        const { title, description } = getStaticSeo(seoKey);

        let html = "";
        try {
            html = await fs.readFile(outputPath, "utf8");
        } catch (error) {
            failures.push(`${route}: missing file ${outputPath}`);
            continue;
        }

        if (!hasExpectedTag(html, "title", title)) {
            failures.push(`${route}: missing or incorrect <title>`);
        }

        if (!hasExpectedTag(html, "description", description)) {
            failures.push(
                `${route}: missing or incorrect <meta name="description">`,
            );
        }
    }

    if (failures.length > 0) {
        console.error("Static SEO verification failed:");
        failures.forEach((failure) => console.error(`- ${failure}`));
        process.exitCode = 1;
        return;
    }

    console.log("Static SEO verification passed.");
}

main().catch((error) => {
    console.error("Failed to verify static SEO:", error);
    process.exitCode = 1;
});
