import { API_BASE_URL, LOCAL_STRAPI_FALLBACK } from "../../api/foundation";
import { toUiServiceTitle } from "../../lib/serviceTitle";

const API_URL = API_BASE_URL || LOCAL_STRAPI_FALLBACK;

export const DEFAULT_TITLE = "ЦІНИ НА КОНСУЛЬТАЦІЇ";
export const DEFAULT_ENDPOINT = "/api/service-prices";
export const DEFAULT_NOTE_TEXT =
    "Не знайшли потрібну консультацію? Напишіть нам — ми обов’язково допоможемо.";
export const SKELETON_ROWS = 6;
export const SERVICE_PRICES_STORAGE_KEY = "services-price-section-cache.v1";
export const SERVICE_PRICES_CACHE = new Map();

export function readStorageCacheMap() {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        const raw = window.localStorage.getItem(SERVICE_PRICES_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

export function readCachedItems(cacheKey) {
    const inMemory = SERVICE_PRICES_CACHE.get(cacheKey);
    if (Array.isArray(inMemory) && inMemory.length > 0) {
        return inMemory;
    }

    const storageMap = readStorageCacheMap();
    const storedItems = storageMap?.[cacheKey];
    return Array.isArray(storedItems) ? storedItems : [];
}

export function writeCachedItems(cacheKey, items) {
    SERVICE_PRICES_CACHE.set(cacheKey, items);

    if (typeof window === "undefined") {
        return;
    }

    try {
        const storageMap = readStorageCacheMap();
        storageMap[cacheKey] = items;
        window.localStorage.setItem(
            SERVICE_PRICES_STORAGE_KEY,
            JSON.stringify(storageMap),
        );
    } catch {
        // Ignore localStorage quota issues and keep in-memory cache only.
    }
}

export function toAbsoluteUrl(endpoint) {
    if (/^https?:\/\//i.test(endpoint)) {
        return endpoint;
    }

    const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${API_URL}${normalizedPath}`;
}

export function buildRequestUrl(endpoint, { filterField, filterValue }) {
    const url = new URL(toAbsoluteUrl(endpoint));

    if (!url.searchParams.has("sort[0]")) {
        url.searchParams.set("sort[0]", "order:asc");
    }

    if (!url.searchParams.has("filters[isActive][$eq]")) {
        url.searchParams.set("filters[isActive][$eq]", "true");
    }

    if (
        filterField &&
        filterValue &&
        !url.searchParams.has(`filters[${filterField}][$eq]`)
    ) {
        url.searchParams.set(`filters[${filterField}][$eq]`, filterValue);
    }

    return url.toString();
}

function toNumber(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function normalizeServicePriceItem(item, index) {
    const source = item?.attributes ?? item ?? {};

    return {
        id: item?.id ?? source.id ?? `service-price-${index}`,
        title: toUiServiceTitle(source.title),
        priceForDeclarant: toNumber(source.priceForDeclarant),
        priceForNonDeclarant: toNumber(source.priceForNonDeclarant),
        isFreeForDeclarant: Boolean(source.isFreeForDeclarant),
        page: typeof source.page === "string" ? source.page.trim() : "",
        order: toNumber(source.order) ?? index,
        isActive: typeof source.isActive === "boolean" ? source.isActive : true,
    };
}

export function normalizeServicePriceItems(payload) {
    const rawItems = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

    return rawItems
        .map(normalizeServicePriceItem)
        .filter((item) => item.title && item.isActive)
        .sort((a, b) => a.order - b.order);
}

export function formatPrice(value) {
    return `${new Intl.NumberFormat("uk-UA").format(value)} грн`;
}

