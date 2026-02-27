import { resolveMedia } from "./newsApi";
import { findBranchInCatalog } from "../data/branchesCatalog";

const API_URL = (import.meta.env.VITE_STRAPI_URL || "")
    .trim()
    .replace(/\/$/, "");
const LOCAL_STRAPI_FALLBACK = "http://localhost:1337";

const DOCTORS_ENDPOINTS = ["/api/doctors"];
const BRANCHES_ENDPOINTS = ["/api/branches"];
const SPECIALISATIONS_ENDPOINTS = ["/api/specialisations", "/api/specializations"];
const DOCTORS_PAGE_ENDPOINTS = ["/api/doctors-page"];
const DOCTORS_FETCH_LIMIT = 1000;
const BRANCHES_FETCH_LIMIT = 200;
const SPECIALISATIONS_FETCH_LIMIT = 300;

function normalizePath(path) {
    if (/^https?:\/\//i.test(path)) return path;
    return path.startsWith("/") ? path : `/${path}`;
}

function buildApiUrl(path, params = {}) {
    const isAbsolute = /^https?:\/\//i.test(path);
    const normalizedPath = normalizePath(path);
    const baseUrl = isAbsolute
        ? path
        : API_URL
          ? `${API_URL}${normalizedPath}`
          : normalizedPath;

    const url =
        isAbsolute || API_URL
            ? new URL(baseUrl)
            : new URL(
                  baseUrl,
                  typeof window !== "undefined"
                      ? window.location.origin
                      : "http://localhost:5173",
              );

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        url.searchParams.set(key, String(value));
    });

    return url.toString();
}

function buildCandidateUrls(path, params = {}) {
    const urls = [buildApiUrl(path, params)];

    if (
        !/^https?:\/\//i.test(path) &&
        !API_URL &&
        typeof window !== "undefined"
    ) {
        const fallback = new URL(normalizePath(path), LOCAL_STRAPI_FALLBACK);
        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") return;
            fallback.searchParams.set(key, String(value));
        });
        urls.push(fallback.toString());
    }

    return [...new Set(urls)];
}

function pickSource(entry) {
    return entry?.attributes ?? entry ?? {};
}

function toText(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
}



function toNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

function extractNumericValue(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value !== "string") return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    const direct = Number(trimmed.replace(",", "."));
    if (Number.isFinite(direct)) return direct;

    const match = trimmed.match(/-?\d+(?:[.,]\d+)?/);
    if (!match) return null;

    const parsed = Number(match[0].replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
}

function toYearNumber(value) {
    const year = extractNumericValue(value);
    if (year === null) return null;

    const normalizedYear = Math.trunc(year);
    return normalizedYear > 0 ? normalizedYear : null;
}

function toBoolean(value, fallback = true) {
    if (typeof value === "boolean") return value;
    if (value === 1 || value === "1") return true;
    if (value === 0 || value === "0") return false;
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (normalized === "true") return true;
        if (normalized === "false") return false;
    }
    return fallback;
}

function stripHtml(text) {
    if (!text || typeof text !== "string") return "";
    return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function firstNonEmpty(...values) {
    for (const value of values) {
        if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
}

function firstDefined(...values) {
    for (const value of values) {
        if (value !== undefined && value !== null) return value;
    }
    return null;
}

function normalizeInternalLink(value) {
    const href = toText(value);
    if (!href) return "";
    if (/^(https?:\/\/|mailto:|tel:|#)/i.test(href)) return href;
    return href.startsWith("/") ? href : `/${href}`;
}

function areCoordsClose(firstLat, firstLng, secondLat, secondLng) {
    if (
        firstLat === null ||
        firstLng === null ||
        secondLat === null ||
        secondLng === null
    ) {
        return false;
    }

    return (
        Math.abs(firstLat - secondLat) <= 0.2 &&
        Math.abs(firstLng - secondLng) <= 0.2
    );
}

function toPhoneHref(value) {
    const text = toText(value);
    if (!text) return "";
    const digits = text.replace(/[^\d+]/g, "");
    if (!digits) return "";
    return digits.startsWith("+") ? digits : `+${digits}`;
}

function toEntityArray(value) {
    if (!value) return [];
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value)) return value;
    if (value?.data && typeof value.data === "object") return [value.data];
    if (typeof value === "object") return [value];
    return [];
}

function toEntityOne(value) {
    if (!value) return null;
    if (Array.isArray(value?.data)) return value.data[0] ?? null;
    if (value?.data && typeof value.data === "object") return value.data;
    if (Array.isArray(value)) return value[0] ?? null;
    if (typeof value === "object") return value;
    return null;
}

function getRichContent(source, keys) {
    for (const key of keys) {
        if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
            return source[key];
        }
    }
    return "";
}

function normalizeSpecialisation(entry, index = 0) {
    if (typeof entry === "string") {
        const name = toText(entry);
        if (!name) return null;
        return {
            id: `spec-${index}-${name.toLowerCase()}`,
            slug: "",
            name,
            order: Number.MAX_SAFE_INTEGER,
            isActive: true,
        };
    }

    const source = pickSource(entry);
    const name = firstNonEmpty(
        source.name,
        source.title,
        source.label,
        source.specialisation,
        source.specialization,
    );
    const slug = toText(source.slug);
    const id = firstDefined(source.id, entry?.id, source.documentId, slug, name);

    if (!name && !slug && !id) return null;

    return {
        id: id ?? `spec-${index}`,
        slug,
        name: name || slug || `Спеціалізація ${index + 1}`,
        order:
            toNumber(firstDefined(source.order, source.sort_order)) ??
            Number.MAX_SAFE_INTEGER,
        isActive: toBoolean(source.isActive ?? source.is_active, true),
    };
}

function dedupeSpecialisations(items) {
    const seen = new Map();

    items.forEach((item, index) => {
        if (!item) return;
        const key =
            item.slug?.toLowerCase() ||
            item.name?.toLowerCase() ||
            String(item.id ?? index);
        if (!seen.has(key)) {
            seen.set(key, item);
        }
    });

    return Array.from(seen.values());
}

function extractDoctorSpecialisations(source) {
    const relationMany = [
        ...toEntityArray(source.specialisations),
        ...toEntityArray(source.specializations),
        ...toEntityArray(source.specialities),
        ...toEntityArray(source.specialties),
    ];

    const relationOne = [
        toEntityOne(source.specialisation),
        toEntityOne(source.specialization),
        toEntityOne(source.speciality),
        toEntityOne(source.specialty),
    ].filter(Boolean);

    const stringCandidates = [
        source.specialisation_name,
        source.specialization_name,
        source.specialisation,
        source.specialization,
        source.speciality,
        source.specialty,
    ]
        .filter((value) => typeof value === "string")
        .flatMap((value) =>
            value.includes(",")
                ? value
                      .split(",")
                      .map((part) => part.trim())
                      .filter(Boolean)
                : [value.trim()],
        );

    const listCandidates = Array.isArray(source.specialisations_list)
        ? source.specialisations_list
        : Array.isArray(source.specializations_list)
          ? source.specializations_list
          : [];

    return dedupeSpecialisations(
        [
            ...relationMany.map((item, index) => normalizeSpecialisation(item, index)),
            ...relationOne.map((item, index) =>
                normalizeSpecialisation(item, relationMany.length + index),
            ),
            ...stringCandidates.map((item, index) =>
                normalizeSpecialisation(item, relationMany.length + relationOne.length + index),
            ),
            ...listCandidates.map((item, index) =>
                normalizeSpecialisation(
                    item,
                    relationMany.length +
                        relationOne.length +
                        stringCandidates.length +
                        index,
                ),
            ),
        ].filter(Boolean),
    );
}

function normalizeBranch(entry, index = 0) {
    if (!entry) return null;

    const source = pickSource(entry);
    const id = firstDefined(entry?.id, source.id, source.documentId, `branch-${index}`);
    const slug = toText(source.slug);
    const name = firstNonEmpty(source.name, source.title);
    const address = firstNonEmpty(
        source.address,
        source.full_address,
        source.address_full,
        source.location_address,
        name,
    );
    const shortAddress = firstNonEmpty(source.short_address, source.address_short);
    const description = firstNonEmpty(
        source.description,
        source.short_description,
        source.branch_description,
    );

    const hours = firstNonEmpty(
        source.hours,
        source.working_hours,
        source.work_hours,
        source.schedule,
        source.opening_hours,
    );

    const phoneDisplay = firstNonEmpty(
        source.phone_display,
        source.phone,
        source.contact_phone,
        source.phone_number,
    );
    const phoneHref = toPhoneHref(
        firstNonEmpty(source.phone_href, source.phone, source.contact_phone),
    );

    const rawLat = toNumber(
        firstDefined(source.lat, source.latitude, source.map_lat, source.mapLatitude),
    );
    const rawLng = toNumber(
        firstDefined(source.lng, source.longitude, source.map_lng, source.mapLongitude),
    );
    const lat =
        rawLat === 0 && rawLng === 0
            ? null
            : rawLat;
    const lng =
        rawLat === 0 && rawLng === 0
            ? null
            : rawLng;
    const mapLink = normalizeInternalLink(
        firstNonEmpty(source.map_link, source.mapLink, source.google_maps_link),
    );
    const catalogBranch = findBranchInCatalog({
        id,
        slug,
        address,
        name,
    });

    const finalAddress = firstNonEmpty(address, catalogBranch?.address, name);
    const finalDescription = firstNonEmpty(description, catalogBranch?.description);
    const finalHours = firstNonEmpty(hours, catalogBranch?.hours);
    const finalPhoneDisplay = firstNonEmpty(phoneDisplay, catalogBranch?.phoneDisplay);
    const finalPhoneHref = toPhoneHref(
        firstNonEmpty(phoneHref, catalogBranch?.phoneHref, finalPhoneDisplay),
    );
    const finalMapLink = normalizeInternalLink(
        firstNonEmpty(mapLink, catalogBranch?.mapLink),
    );

    const catalogLat = toNumber(catalogBranch?.lat);
    const catalogLng = toNumber(catalogBranch?.lng);
    const hasCatalogCoords = catalogLat !== null && catalogLng !== null;
    const shouldUseCatalogCoords =
        hasCatalogCoords &&
        (lat === null || lng === null || !areCoordsClose(lat, lng, catalogLat, catalogLng));

    const finalLat = shouldUseCatalogCoords ? catalogLat : lat;
    const finalLng = shouldUseCatalogCoords ? catalogLng : lng;
    const hasCoords = finalLat !== null && finalLng !== null;
    const mapCenter = hasCoords
        ? shouldUseCatalogCoords && catalogBranch?.mapCenter
            ? catalogBranch.mapCenter
            : { lat: finalLat, lng: finalLng }
        : catalogBranch?.mapCenter || null;
    const mapMarkers = shouldUseCatalogCoords &&
        Array.isArray(catalogBranch?.mapMarkers) &&
        catalogBranch.mapMarkers.length > 0
        ? catalogBranch.mapMarkers
        : hasCoords
        ? [
              {
                  id: String(id),
                  lat: finalLat,
                  lng: finalLng,
                  link: finalMapLink || undefined,
              },
          ]
        : Array.isArray(catalogBranch?.mapMarkers)
          ? catalogBranch.mapMarkers
          : [];

    const isActive = toBoolean(source.isActive ?? source.is_active, true);
    const order = toNumber(firstDefined(source.order, source.sort_order));

    if (!address && !name && !slug && !id) {
        return null;
    }

    return {
        id,
        documentId: toText(source.documentId || entry?.documentId),
        slug,
        name: name || finalAddress || "",
        address: finalAddress || name || "",
        shortAddress,
        description: finalDescription,
        hours: finalHours,
        phoneDisplay: finalPhoneDisplay,
        phoneHref: finalPhoneHref,
        mapLink: finalMapLink,
        mapCenter,
        mapMarkers,
        lat: finalLat,
        lng: finalLng,
        order: order ?? Number.MAX_SAFE_INTEGER,
        isActive,
        raw: source,
    };
}

function getDoctorStartYear(source) {
    return toYearNumber(source.startYear);
}

export function formatExperienceYearsLabel(years) {
    const abs = Math.abs(Number(years) || 0);
    const rem10 = abs % 10;
    const rem100 = abs % 100;

    if (rem10 === 1 && rem100 !== 11) return "рік";
    if (rem10 >= 2 && rem10 <= 4 && !(rem100 >= 12 && rem100 <= 14)) {
        return "роки";
    }
    return "років";
}

function getDoctorFullName(source) {
    const direct = firstNonEmpty(
        source.full_name,
        source.fullName,
        source.name_full,
        source.display_name,
        source.displayName,
    );
    if (direct) return direct;

    const surname = firstNonEmpty(source.surname, source.lastName, source.last_name);
    const firstName = firstNonEmpty(source.name, source.firstName, source.first_name);
    const middleName = firstNonEmpty(
        source.middleName,
        source.middle_name,
        source.patronymic,
    );

    return [surname, firstName, middleName].filter(Boolean).join(" ").trim();
}

function normalizeDoctorButtons(source) {
    const list = toEntityArray(source.buttons)
        .map((item, index) => {
            const button = pickSource(item);
            const text = firstNonEmpty(button.text, button.label, button.title);
            const href = normalizeInternalLink(
                firstNonEmpty(button.link, button.url, button.href),
            );
            if (!href) return null;
            return {
                id: button.id ?? item?.id ?? `btn-${index}`,
                text,
                href,
            };
        })
        .filter(Boolean);

    if (list.length > 0) return list.slice(0, 2);

    const button1Link = normalizeInternalLink(
        firstNonEmpty(source.button1_link, source.button1Link),
    );
    const button2Link = normalizeInternalLink(
        firstNonEmpty(source.button2_link, source.button2Link),
    );

    return [
        button1Link
            ? { id: "button-1", href: button1Link }
            : null,
        button2Link
            ? { id: "button-2", href: button2Link }
            : null,
    ].filter(Boolean);
}

function normalizeDoctor(entry, index = 0) {
    const source = pickSource(entry);

    const slug = toText(source.slug, `doctor-${entry?.id ?? source.id ?? index}`);
    const fullName = getDoctorFullName(source) || "Лікар";
    const specialisations = extractDoctorSpecialisations(source);
    const primarySpecialisation =
        specialisations[0]?.name ||
        firstNonEmpty(source.specialization, source.specialisation);
    const branch = normalizeBranch(
        toEntityOne(source.branch) || toEntityOne(source.filial) || toEntityOne(source.location),
    );
    const photo =
        resolveMedia(
            source.photo ||
                source.image ||
                source.avatar ||
                source.doctor_photo ||
                source.cover_image,
            { variant: "card" },
        ) || null;

    const seoSource = pickSource(source.seo);
    const shortDescription =
        firstNonEmpty(
            source.short_description,
            source.shortDescription,
            source.excerpt,
            stripHtml(toText(source.description)),
        ) || "";
    const fullDescription = getRichContent(source, [
        "full_description",
        "fullDescription",
        "description",
        "bio",
    ]);

    const education = getRichContent(source, [
        "education",
        "education_section",
        "educationSection",
    ]);
    const experienceSection = getRichContent(source, [
        "experience_section",
        "experienceSection",
        "experience_content",
    ]);
    const services = getRichContent(source, [
        "services",
        "medical_services",
        "medicalServices",
        "services_section",
    ]);

    const quote = firstNonEmpty(source.quote, source.doctor_quote, source.tagline);
    const order = toNumber(firstDefined(source.order, source.sort_order, source.position_order));
    const isActive = toBoolean(source.isActive ?? source.is_active, true);
    const startYear = getDoctorStartYear(source);
    const position = firstNonEmpty(
        source.positionLong,
        source.position_long,
        source.position,
        source.job_title,
        source.role,
        source.specialisation_summary,
    );
    const positionShort = firstNonEmpty(
        source.positionShort,
        source.position_short,
        source.shortPosition,
        source.short_position,
        source.card_position,
        source.cardPosition,
    );
    const experienceBadgeText = firstNonEmpty(
        source.experienceBadgeText,
        source.experience_badge_text,
    );

    return {
        id: firstDefined(entry?.id, source.id, source.documentId, `doctor-${index}`),
        documentId: toText(firstDefined(source.documentId, entry?.documentId)),
        slug,
        fullName,
        displayName: fullName,
        firstName: firstNonEmpty(source.name, source.firstName, source.first_name),
        lastName: firstNonEmpty(source.surname, source.lastName, source.last_name),
        middleName: firstNonEmpty(source.middleName, source.middle_name, source.patronymic),
        specialisations,
        primarySpecialisation,
        position,
        positionShort,
        branch,
        address: firstNonEmpty(branch?.address, source.address, source.place),
        startYear,
        experienceBadgeText,
        shortDescription,
        fullDescription,
        education,
        experienceSection,
        services,
        quote,
        photo,
        buttons: normalizeDoctorButtons(source),
        seoTitle: firstNonEmpty(
            source.seo_title,
            source.seoTitle,
            source.meta_title,
            source.metaTitle,
            seoSource.metaTitle,
            seoSource.title,
        ),
        seoDescription: firstNonEmpty(
            source.seo_description,
            source.seoDescription,
            source.meta_description,
            source.metaDescription,
            seoSource.metaDescription,
            seoSource.description,
        ),
        order: order ?? Number.MAX_SAFE_INTEGER,
        isActive,
        raw: source,
    };
}

// Helps search when users type visually identical Latin letters (e.g. "cap")
// for Ukrainian names like "сар".
const SEARCH_CONFUSABLE_LATIN_TO_CYRILLIC = {
    A: "А",
    B: "В",
    C: "С",
    E: "Е",
    H: "Н",
    I: "І",
    K: "К",
    M: "М",
    O: "О",
    P: "Р",
    T: "Т",
    X: "Х",
    Y: "У",
    a: "а",
    b: "в",
    c: "с",
    e: "е",
    h: "н",
    i: "і",
    k: "к",
    m: "м",
    o: "о",
    p: "р",
    t: "т",
    x: "х",
    y: "у",
};

function toComparableDoctorSearchText(value) {
    return toText(value)
        .replace(/[ABCEHIKMOPTXYabcehikmoptxy]/g, (char) =>
            SEARCH_CONFUSABLE_LATIN_TO_CYRILLIC[char] || char,
        )
        .toLocaleLowerCase("uk-UA");
}

function matchesDoctorSearch(doctor, rawNeedle) {
    const needle = toComparableDoctorSearchText(rawNeedle);
    if (!needle) return true;

    const candidates = [
        doctor?.fullName,
        doctor?.displayName,
        doctor?.firstName,
        doctor?.lastName,
        doctor?.middleName,
        [doctor?.lastName, doctor?.firstName, doctor?.middleName]
            .filter(Boolean)
            .join(" "),
        [doctor?.firstName, doctor?.middleName, doctor?.lastName]
            .filter(Boolean)
            .join(" "),
    ]
        .map((value) => toText(value))
        .filter(Boolean)
        .map((value) => toComparableDoctorSearchText(value));

    return candidates.some((value) => value.includes(needle));
}

function normalizeDoctorsPageSettings(entry) {
    const source = pickSource(entry);
    const seoSource = pickSource(source.seo);

    return {
        pageTitle: toText(source.pageTitle),
        pageDescription: source.pageDescription ?? "",
        breadcrumbsLabel: toText(source.breadcrumbsLabel),
        searchPlaceholder: toText(source.searchPlaceholder),
        branchFilterLabel: toText(source.branchFilterLabel),
        specialisationFilterLabel: toText(source.specialisationFilterLabel),
        resetFiltersLabel: toText(source.resetFiltersLabel),
        loadMoreLabel: toText(source.loadMoreLabel),
        initialVisibleCount:
            toNumber(source.initialVisibleCount) ?? null,
        loadMoreStep: toNumber(source.loadMoreStep) ?? null,
        emptyStateTitle: toText(source.emptyStateTitle),
        emptyStateText: toText(source.emptyStateText),
        showContactForm: toBoolean(source.showContactForm, true),
        contactFormTitle: toText(source.contactFormTitle),
        contactFormSubtitle: toText(source.contactFormSubtitle),
        contactFormAnchorId: toText(source.contactFormAnchorId),
        seoMetaTitle: firstNonEmpty(
            source.metaTitle,
            source.seo_title,
            source.seoTitle,
            seoSource.metaTitle,
            seoSource.title,
        ),
        seoMetaDescription: firstNonEmpty(
            source.metaDescription,
            source.seo_description,
            source.seoDescription,
            seoSource.metaDescription,
            seoSource.description,
        ),
    };
}

function sortDoctors(items) {
    return [...items].sort((a, b) => {
        const orderA = Number.isFinite(a?.order) ? a.order : Number.MAX_SAFE_INTEGER;
        const orderB = Number.isFinite(b?.order) ? b.order : Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        return (a?.fullName || "").localeCompare(b?.fullName || "", "uk-UA", {
            sensitivity: "base",
        });
    });
}

function extractCollectionRows(payload) {
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    if (payload?.data && typeof payload.data === "object") return [payload.data];
    return [];
}

function extractSingleRow(payload) {
    if (payload?.data && !Array.isArray(payload.data)) {
        return payload.data;
    }
    if (Array.isArray(payload?.data)) {
        return payload.data[0] ?? null;
    }
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        return payload;
    }
    return null;
}

async function fetchJson(url, { signal } = {}) {
    const response = await fetch(url, { signal });

    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const payload = await response.json();
            message = payload?.error?.message || payload?.message || message;
        } catch {
            // ignore
        }
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }

    return response.json();
}

async function fetchWithEndpointFallback({ endpoints, paramsVariants, signal }) {
    let lastError = null;
    let unauthorizedError = null;

    for (const endpoint of endpoints) {
        for (const params of paramsVariants) {
            const urls = buildCandidateUrls(endpoint, params);

            for (const url of urls) {
                try {
                    return await fetchJson(url, { signal });
                } catch (error) {
                    if (error?.name === "AbortError") throw error;

                    const status = Number(error?.status);
                    if (status === 401 || status === 403) {
                        unauthorizedError =
                            unauthorizedError ||
                            new Error(
                                "UNAUTHORIZED: У Strapi увімкніть find/findOne permission для Public role (Doctor/Branch).",
                            );
                        continue;
                    }

                    if (status === 400 || status === 404) {
                        lastError = error;
                        continue;
                    }

                    lastError = error;
                }
            }
        }
    }

    if (unauthorizedError) throw unauthorizedError;
    throw lastError || new Error("NO_VALID_ENDPOINT");
}

export const DEFAULT_DOCTORS_PAGE_SETTINGS = {
    pageTitle: "НАША КОМАНДА",
    pageDescription:
        "Знайомтесь із нашими лікарями — досвідченими фахівцями, які дбають про ваше здоров'я щодня. Оберіть свого лікаря за спеціалізацією або місцем прийому.",
    breadcrumbsLabel: "Лікарі",
    searchPlaceholder: "Ім'я лікаря",
    branchFilterLabel: "Локація",
    specialisationFilterLabel: "Спеціалізація",
    resetFiltersLabel: "Скинути",
    loadMoreLabel: "Показати більше",
    initialVisibleCount: 12,
    loadMoreStep: 8,
    emptyStateTitle: "Нічого не знайдено",
    emptyStateText: "Спробуйте змінити фільтри або пошук.",
    showContactForm: true,
    contactFormTitle: "ВАША ДУМКА ВАЖЛИВА",
    contactFormSubtitle: "ЗАЛИШТЕ СВІЙ ВІДГУК ЩОДО ЯКОСТІ НАШИХ ПОСЛУГ",
    contactFormAnchorId: "",
    seoMetaTitle: "Лікарі | Для людей",
    seoMetaDescription:
        "Наша команда лікарів: оберіть фахівця за спеціалізацією або локацією та запишіться на прийом.",
};

export function getBranchIdentity(branch) {
    if (!branch) return "";
    return (
        toText(branch.documentId) ||
        toText(branch.slug) ||
        toText(branch.id) ||
        toText(branch.address).toLowerCase()
    );
}

export function getDoctorDisplayName(doctor) {
    return toText(doctor?.displayName || doctor?.fullName, "Лікар");
}

export function getDoctorPrimarySpecialisation(doctor) {
    return (
        toText(doctor?.primarySpecialisation) ||
        doctor?.specialisations?.[0]?.name ||
        ""
    );
}

export function getDoctorCardSummary(doctor) {
    return (
        toText(doctor?.positionShort) ||
        toText(doctor?.position) ||
        ""
    );
}

export function collectUniqueSpecialisations(doctors = []) {
    const list = doctors.flatMap((doctor) => doctor?.specialisations || []);
    return dedupeSpecialisations(list)
        .filter((item) => Boolean(item?.name))
        .filter((item) => item.isActive !== false)
        .sort((a, b) =>
            (Number.isFinite(a.order) ? a.order : Number.MAX_SAFE_INTEGER) -
                (Number.isFinite(b.order) ? b.order : Number.MAX_SAFE_INTEGER) ||
            (a.name || "").localeCompare(b.name || "", "uk-UA", {
                sensitivity: "base",
            }),
        );
}

export async function fetchDoctorsPageSettings({ signal } = {}) {
    const paramsVariants = [
        { populate: "*" },
        {
            "populate[0]": "seo",
        },
        {},
    ];

    try {
        const payload = await fetchWithEndpointFallback({
            endpoints: DOCTORS_PAGE_ENDPOINTS,
            paramsVariants,
            signal,
        });
        const row = extractSingleRow(payload);
        if (!row) {
            return { ...DEFAULT_DOCTORS_PAGE_SETTINGS };
        }

        return {
            ...DEFAULT_DOCTORS_PAGE_SETTINGS,
            ...normalizeDoctorsPageSettings(row),
        };
    } catch (error) {
        if (error?.name === "AbortError") throw error;
        console.error("Failed to load doctors-page settings:", error);
        return { ...DEFAULT_DOCTORS_PAGE_SETTINGS };
    }
}

export async function fetchDoctorSpecialisations({ signal } = {}) {
    const paramsVariants = [
        {
            "sort[0]": "order:asc",
            "sort[1]": "name:asc",
            "filters[isActive][$eq]": "true",
            "pagination[pageSize]": SPECIALISATIONS_FETCH_LIMIT,
        },
        {
            sort: "order:asc",
            "filters[isActive][$eq]": "true",
            "pagination[pageSize]": SPECIALISATIONS_FETCH_LIMIT,
        },
        {
            "sort[0]": "order:asc",
            "sort[1]": "name:asc",
            "filters[is_active][$eq]": "true",
            "pagination[pageSize]": SPECIALISATIONS_FETCH_LIMIT,
        },
        {
            "pagination[pageSize]": SPECIALISATIONS_FETCH_LIMIT,
        },
    ];

    try {
        const payload = await fetchWithEndpointFallback({
            endpoints: SPECIALISATIONS_ENDPOINTS,
            paramsVariants,
            signal,
        });

        const list = extractCollectionRows(payload)
            .map(normalizeSpecialisation)
            .filter(Boolean)
            .filter((item) => item.isActive !== false)
            .sort((a, b) =>
                (Number.isFinite(a.order) ? a.order : Number.MAX_SAFE_INTEGER) -
                    (Number.isFinite(b.order)
                        ? b.order
                        : Number.MAX_SAFE_INTEGER) ||
                (a.name || "").localeCompare(b.name || "", "uk-UA", {
                    sensitivity: "base",
                }),
            );

        return list;
    } catch (error) {
        if (error?.name === "AbortError") throw error;
        console.error("Failed to load specialisations:", error);
        return [];
    }
}

export async function fetchDoctorsList({
    signal,
    includeInactive = false,
    pageSize = DOCTORS_FETCH_LIMIT,
    search = "",
    branchId = "",
    specialisationId = "",
} = {}) {
    const safePageSize = Math.max(1, Number(pageSize) || DOCTORS_FETCH_LIMIT);
    const safeSearch = toText(search);
    const safeBranchId = toText(branchId);
    const safeSpecialisationId = toText(specialisationId);

    const baseFilters = {
        ...(includeInactive ? {} : { "filters[isActive][$eq]": "true" }),
        ...(safeBranchId
            ? { "filters[branch][id][$eq]": safeBranchId }
            : {}),
        ...(safeSpecialisationId
            ? { "filters[specialisations][id][$eq]": safeSpecialisationId }
            : {}),
    };

    const paramsVariants = [
        {
            "populate[0]": "photo",
            "populate[1]": "branch",
            "populate[2]": "specialisations",
            "sort[0]": "order:asc",
            "sort[1]": "fullName:asc",
            ...baseFilters,
            "pagination[pageSize]": safePageSize,
        },
        {
            populate: "*",
            sort: "order:asc,fullName:asc",
            ...baseFilters,
            "pagination[pageSize]": safePageSize,
        },
        {
            populate: "*",
            "sort[0]": "order:asc",
            "sort[1]": "full_name:asc",
            ...(includeInactive ? {} : { "filters[isActive][$eq]": "true" }),
            ...(safeBranchId
                ? { "filters[branch][id][$eq]": safeBranchId }
                : {}),
            ...(safeSpecialisationId
                ? { "filters[specialisations][id][$eq]": safeSpecialisationId }
                : {}),
            "pagination[pageSize]": safePageSize,
        },
        {
            populate: "*",
            sort: "order:asc,name:asc",
            ...(includeInactive ? {} : { "filters[isActive][$eq]": "true" }),
            ...(safeBranchId ? { "filters[branch][id][$eq]": safeBranchId } : {}),
            ...(safeSpecialisationId
                ? { "filters[specialisations][id][$eq]": safeSpecialisationId }
                : {}),
            "pagination[pageSize]": safePageSize,
        },
        {
            populate: "*",
            ...(includeInactive ? {} : { "filters[is_active][$eq]": "true" }),
            ...(safeBranchId ? { "filters[branch][id][$eq]": safeBranchId } : {}),
            ...(safeSpecialisationId
                ? { "filters[specialisations][id][$eq]": safeSpecialisationId }
                : {}),
            "pagination[pageSize]": safePageSize,
        },
    ];

    const payload = await fetchWithEndpointFallback({
        endpoints: DOCTORS_ENDPOINTS,
        paramsVariants,
        signal,
    });

    let items = extractCollectionRows(payload)
        .map(normalizeDoctor)
        .filter(Boolean);

    if (!includeInactive) {
        items = items.filter((doctor) => doctor.isActive !== false);
    }

    // Safety fallback if backend ignored one of the filters.
    if (safeSearch) {
        items = items.filter((doctor) => matchesDoctorSearch(doctor, safeSearch));
    }
    if (safeBranchId) {
        items = items.filter((doctor) => String(doctor.branch?.id || "") === safeBranchId);
    }
    if (safeSpecialisationId) {
        items = items.filter((doctor) =>
            (doctor.specialisations || []).some(
                (spec) => String(spec.id || "") === safeSpecialisationId,
            ),
        );
    }

    const sorted = sortDoctors(items);

    return {
        items: sorted,
        total:
            Number(payload?.meta?.pagination?.total) ||
            Number(payload?.meta?.total) ||
            sorted.length,
    };
}

export async function fetchDoctorBySlug(slug, { signal } = {}) {
    const safeSlug = toText(slug);
    if (!safeSlug) return null;

    const slugParamsVariants = [
        {
            populate: "*",
            "filters[slug][$eq]": safeSlug,
            "pagination[pageSize]": 1,
        },
        {
            populate: "*",
            "filters[slug][$eqi]": safeSlug,
            "pagination[pageSize]": 1,
        },
    ];

    try {
        const payload = await fetchWithEndpointFallback({
            endpoints: DOCTORS_ENDPOINTS,
            paramsVariants: slugParamsVariants,
            signal,
        });

        const item = extractCollectionRows(payload).map(normalizeDoctor).find(Boolean);
        if (item) return item;
    } catch (error) {
        if (error?.name === "AbortError") throw error;
        // Fall through to full list fallback
    }

    const { items } = await fetchDoctorsList({
        signal,
        includeInactive: true,
        pageSize: DOCTORS_FETCH_LIMIT,
    });

    return (
        items.find(
            (doctor) =>
                toText(doctor.slug).toLowerCase() === safeSlug.toLowerCase(),
        ) || null
    );
}

export async function fetchDoctorBranches({ signal } = {}) {
    const normalizeAndSortBranches = (payload) =>
        extractCollectionRows(payload)
            .map(normalizeBranch)
            .filter(Boolean)
            .filter((branch) => branch.isActive !== false)
            .sort((a, b) =>
                (Number.isFinite(a.order) ? a.order : Number.MAX_SAFE_INTEGER) -
                    (Number.isFinite(b.order)
                        ? b.order
                        : Number.MAX_SAFE_INTEGER) ||
                (a.name || a.address || "").localeCompare(
                    b.name || b.address || "",
                    "uk-UA",
                    { sensitivity: "base" },
                ),
            );

    const filteredParamsVariants = [
        {
            populate: "*",
            "sort[0]": "order:asc",
            "sort[1]": "name:asc",
            "filters[isActive][$eq]": "true",
            "pagination[pageSize]": BRANCHES_FETCH_LIMIT,
        },
        {
            populate: "*",
            sort: "order:asc,name:asc",
            "filters[isActive][$eq]": "true",
            "pagination[pageSize]": BRANCHES_FETCH_LIMIT,
        },
        {
            populate: "*",
            "sort[0]": "order:asc",
            "sort[1]": "name:asc",
            "filters[is_active][$eq]": "true",
            "pagination[pageSize]": BRANCHES_FETCH_LIMIT,
        },
    ];

    const unfilteredParamsVariants = [
        {
            populate: "*",
            "pagination[pageSize]": BRANCHES_FETCH_LIMIT,
        },
    ];

    try {
        const payload = await fetchWithEndpointFallback({
            endpoints: BRANCHES_ENDPOINTS,
            paramsVariants: filteredParamsVariants,
            signal,
        });

        const branches = normalizeAndSortBranches(payload);

        if (branches.length > 0) {
            return branches;
        }
    } catch (error) {
        if (error?.name === "AbortError") throw error;
    }

    try {
        const payload = await fetchWithEndpointFallback({
            endpoints: BRANCHES_ENDPOINTS,
            paramsVariants: unfilteredParamsVariants,
            signal,
        });

        const branches = normalizeAndSortBranches(payload);

        if (branches.length > 0) {
            return branches;
        }
    } catch (error) {
        if (error?.name === "AbortError") throw error;
    }

    const { items } = await fetchDoctorsList({ signal, pageSize: DOCTORS_FETCH_LIMIT });
    const deduped = new Map();

    items.forEach((doctor) => {
        const branch = doctor.branch;
        const key = getBranchIdentity(branch);
        if (!branch || !key || deduped.has(key)) return;
        deduped.set(key, branch);
    });

    return Array.from(deduped.values()).sort((a, b) =>
        (a.name || a.address || "").localeCompare(b.name || b.address || "", "uk-UA", {
            sensitivity: "base",
        }),
    );
}

export function getDoctorTabItems(doctor) {
    return [
        {
            key: "experience",
            label: "Досвід",
            content: doctor?.experienceSection || "",
            emptyText: "Інформацію про досвід буде додано незабаром.",
        },
        {
            key: "education",
            label: "Освіта",
            content: doctor?.education || "",
            emptyText: "Інформацію про освіту буде додано незабаром.",
        },
        {
            key: "services",
            label: "Медичні послуги",
            content: doctor?.services || "",
            emptyText: "Перелік медичних послуг буде додано незабаром.",
        },
    ];
}
