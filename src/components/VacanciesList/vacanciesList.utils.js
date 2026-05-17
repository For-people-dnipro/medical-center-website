import { API_BASE_URL, LOCAL_STRAPI_FALLBACK } from "../../api/foundation";

const API_URL = API_BASE_URL || LOCAL_STRAPI_FALLBACK;

export const DEFAULT_ENDPOINT = "/api/vacancies";
const IGNORED_KEYS = new Set([
    "id",
    "__component",
    "createdAt",
    "updatedAt",
    "publishedAt",
    "documentId",
    "locale",
    "localizations",
]);

export function toAbsoluteUrl(endpoint) {
    if (/^https?:\/\//i.test(endpoint)) {
        return endpoint;
    }

    const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${API_URL}${normalizedPath}`;
}

export function getEndpointCandidates(endpoint) {
    const normalized = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const candidates = [normalized];

    if (normalized.endsWith("/vacancies")) {
        candidates.push(normalized.replace(/\/vacancies$/, "/vacancy"));
    } else if (normalized.endsWith("/vacancy")) {
        candidates.push(normalized.replace(/\/vacancy$/, "/vacancies"));
    }

    return [...new Set(candidates)];
}

export function buildRequestUrl(endpoint, { includePopulate = true } = {}) {
    const url = new URL(toAbsoluteUrl(endpoint));

    if (!url.searchParams.has("filters[isActive][$eq]")) {
        url.searchParams.set("filters[isActive][$eq]", "true");
    }

    if (!url.searchParams.has("sort[0]")) {
        url.searchParams.set("sort[0]", "order:asc");
    }

    if (includePopulate && !url.searchParams.has("populate")) {
        url.searchParams.set("populate", "*");
    }

    if (!url.searchParams.has("pagination[pageSize]")) {
        url.searchParams.set("pagination[pageSize]", "100");
    }

    return url.toString();
}

function decodeEntities(value) {
    return value
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">");
}

function sanitizeRichText(value) {
    return decodeEntities(
        value
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<li>/gi, "• ")
            .replace(/<\/li>/gi, "\n")
            .replace(/<[^>]+>/g, " "),
    );
}

function normalizeLine(value) {
    return sanitizeRichText(value)
        .replace(/\s+/g, " ")
        .replace(/^[•\-*]\s*/, "")
        .trim();
}

function splitToLines(value) {
    return sanitizeRichText(value)
        .split(/\r?\n+/)
        .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
        .filter(Boolean);
}

function collectTextFragments(value, fragments) {
    if (typeof value === "string") {
        const cleaned = value.trim();
        if (cleaned) {
            fragments.push(cleaned);
        }
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((entry) => collectTextFragments(entry, fragments));
        return;
    }

    if (!value || typeof value !== "object") {
        return;
    }

    const source = value.attributes ?? value;
    const scalarKeys = [
        "text",
        "value",
        "title",
        "content",
        "description",
        "label",
        "name",
    ];
    const nestedKeys = [
        "children",
        "items",
        "list",
        "blocks",
        "paragraphs",
        "body",
        "data",
    ];

    let hasKnownStructure = false;

    scalarKeys.forEach((key) => {
        if (typeof source[key] === "string") {
            hasKnownStructure = true;
            fragments.push(source[key]);
        }
    });

    nestedKeys.forEach((key) => {
        if (source[key] !== undefined) {
            hasKnownStructure = true;
            collectTextFragments(source[key], fragments);
        }
    });

    if (hasKnownStructure) {
        return;
    }

    Object.entries(source).forEach(([key, nestedValue]) => {
        if (IGNORED_KEYS.has(key)) {
            return;
        }
        collectTextFragments(nestedValue, fragments);
    });
}

function unique(items) {
    const seen = new Set();

    return items.filter((item) => {
        const key = item.toLocaleLowerCase("uk-UA");
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function firstText(values, fallback = "") {
    for (const value of values) {
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
    }
    return fallback;
}

function normalizeListField(value) {
    const fragments = [];
    collectTextFragments(value, fragments);

    const lines = fragments.flatMap(splitToLines).map(normalizeLine);
    return unique(lines.filter(Boolean));
}

function normalizeTextField(value) {
    const fragments = [];
    collectTextFragments(value, fragments);

    const lines = fragments.map(normalizeLine).filter(Boolean);
    return unique(lines).join("\n");
}

function normalizeVacancy(entry, index) {
    const source = entry?.attributes ?? entry ?? {};
    const order = Number(source.order);

    return {
        id: entry?.id ?? source.id ?? source.slug ?? `vacancy-${index}`,
        slug: typeof source.slug === "string" ? source.slug.trim() : "",
        title: firstText([source.title], "Вакансія"),
        location: firstText([source.location, source.city, source.address]),
        shortSchedule: firstText([
            source.shortSchedule,
            source.scheduleShort,
            source.schedule,
        ]),
        fullSchedule: firstText([
            source.fullSchedule,
            source.scheduleFull,
            source.schedule,
        ]),
        importantForUs: normalizeListField(
            source.importantForUs ?? source.responsibilities,
        ),
        weProvide: normalizeListField(source.weProvide ?? source.requirements),
        description: normalizeTextField(source.description),
        isActive: typeof source.isActive === "boolean" ? source.isActive : true,
        order: Number.isFinite(order) ? order : index,
    };
}

export function normalizeVacancies(payload) {
    const entries = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

    return entries
        .map(normalizeVacancy)
        .filter((vacancy) => vacancy.isActive && vacancy.title)
        .sort((a, b) => a.order - b.order);
}

