import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL, LOCAL_STRAPI_FALLBACK } from "../../api/foundation";
import { toUiServiceTitle } from "../../lib/serviceTitle";
import "./ServicesPriceSection.css";

const API_URL = API_BASE_URL || LOCAL_STRAPI_FALLBACK;

const DEFAULT_TITLE = "ЦІНИ НА КОНСУЛЬТАЦІЇ";
const DEFAULT_ENDPOINT = "/api/service-prices";
const DEFAULT_NOTE_TEXT =
    "Не знайшли потрібну консультацію? Напишіть нам — ми обов’язково допоможемо.";
const SKELETON_ROWS = 6;
const SERVICE_PRICES_CACHE = new Map();
const SERVICE_PRICES_STORAGE_KEY = "services-price-section-cache.v1";

function readStorageCacheMap() {
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

function readCachedItems(cacheKey) {
    const inMemory = SERVICE_PRICES_CACHE.get(cacheKey);
    if (Array.isArray(inMemory) && inMemory.length > 0) {
        return inMemory;
    }

    const storageMap = readStorageCacheMap();
    const storedItems = storageMap?.[cacheKey];
    return Array.isArray(storedItems) ? storedItems : [];
}

function writeCachedItems(cacheKey, items) {
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
    }
}

function toAbsoluteUrl(endpoint) {
    if (/^https?:\/\//i.test(endpoint)) {
        return endpoint;
    }

    const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${API_URL}${normalizedPath}`;
}

function buildRequestUrl(endpoint, { filterField, filterValue }) {
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

function normalizeServicePriceItems(payload) {
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

function formatPrice(value) {
    return `${new Intl.NumberFormat("uk-UA").format(value)} грн`;
}

function SkeletonRows() {
    return Array.from({ length: SKELETON_ROWS }).map((_, index) => (
        <article
            key={`skeleton-${index}`}
            className="services-price-section__item services-price-section__item--skeleton"
            aria-hidden="true"
        >
            <div className="services-price-section__skeleton-name" />
            <div className="services-price-section__col">
                <div className="services-price-section__skeleton-badge" />
            </div>
            <div className="services-price-section__col">
                <div className="services-price-section__skeleton-badge" />
            </div>
        </article>
    ));
}

export default function ServicesPriceSection({
    title = DEFAULT_TITLE,
    endpoint = DEFAULT_ENDPOINT,
    page = "",
    visitType = "",
    noteText = DEFAULT_NOTE_TEXT,
}) {
    const filterField = page ? "page" : visitType ? "visitType" : "";
    const filterValue = page || visitType;
    const cacheKey = `${endpoint}::${filterField}::${filterValue}`;
    const initialCachedItems = readCachedItems(cacheKey);

    const listRef = useRef(null);
    const scrollbarThumbRef = useRef(null);
    const requestIdRef = useRef(0);
    const lastStableItemsRef = useRef(initialCachedItems);
    const itemsRef = useRef(initialCachedItems);
    const [items, setItems] = useState(initialCachedItems);
    const [loading, setLoading] = useState(initialCachedItems.length === 0);
    const [error, setError] = useState("");
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const cachedItems = readCachedItems(cacheKey);
        lastStableItemsRef.current = cachedItems;
        itemsRef.current = cachedItems;
        setItems(cachedItems);
        setError("");
        setLoading(cachedItems.length === 0);
    }, [cacheKey]);

    useEffect(() => {
        const controller = new AbortController();
        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;

        async function fetchItems() {
            const requestUrl = buildRequestUrl(endpoint, {
                filterField,
                filterValue,
            });

            console.info("[ServicesPriceSection] fetch:start", {
                endpoint,
                page,
                visitType,
                requestId,
                requestUrl,
            });

            setLoading(true);
            setError("");

            try {
                const response = await fetch(requestUrl, {
                    signal: controller.signal,
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const payload = await response.json();
                const normalizedItems = normalizeServicePriceItems(payload);

                if (requestId !== requestIdRef.current) {
                    console.warn(
                        "[ServicesPriceSection] fetch:stale-response:ignored",
                        { requestId, latestRequestId: requestIdRef.current },
                    );
                    return;
                }

                console.info("[ServicesPriceSection] fetch:success", {
                    requestId,
                    itemsCount: normalizedItems.length,
                });

                if (normalizedItems.length > 0) {
                    writeCachedItems(cacheKey, normalizedItems);
                    lastStableItemsRef.current = normalizedItems;
                    itemsRef.current = normalizedItems;
                    setItems(normalizedItems);
                    return;
                }

                const fallbackItems =
                    lastStableItemsRef.current.length > 0
                        ? lastStableItemsRef.current
                        : itemsRef.current.length > 0
                          ? itemsRef.current
                          : readCachedItems(cacheKey);

                if (fallbackItems.length > 0) {
                    console.warn(
                        "[ServicesPriceSection] fetch:empty-response:keeping-existing-items",
                        {
                            requestId,
                            keptItemsCount: fallbackItems.length,
                        },
                    );
                    setItems(fallbackItems);
                    return;
                }

                console.warn("[ServicesPriceSection] fetch:empty-response", {
                    requestId,
                });
                setItems([]);
            } catch (err) {
                if (err?.name === "AbortError") {
                    console.info("[ServicesPriceSection] fetch:aborted", {
                        requestId,
                    });
                    return;
                }

                console.error("Failed to load service prices:", err);

                if (requestId !== requestIdRef.current) {
                    return;
                }

                const fallbackItems =
                    lastStableItemsRef.current.length > 0
                        ? lastStableItemsRef.current
                        : itemsRef.current.length > 0
                          ? itemsRef.current
                          : readCachedItems(cacheKey);

                if (fallbackItems.length > 0) {
                    console.warn(
                        "[ServicesPriceSection] fetch:error:keeping-existing-items",
                        {
                            requestId,
                            keptItemsCount: fallbackItems.length,
                        },
                    );
                    setItems(fallbackItems);
                    setError("");
                    return;
                }

                setItems([]);
                setError("Не вдалося завантажити ціни. Спробуйте пізніше.");
            } finally {
                if (
                    requestId === requestIdRef.current &&
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }
            }
        }

        fetchItems();

        return () => controller.abort();
    }, [cacheKey, endpoint, filterField, filterValue, page, visitType]);

    useEffect(() => {
        itemsRef.current = items;

        if (items.length > 0) {
            writeCachedItems(cacheKey, items);
            lastStableItemsRef.current = items;
        }

        console.info("[ServicesPriceSection] items:changed", {
            endpoint,
            page,
            visitType,
            itemsCount: items.length,
        });

        if (items.length === 0) {
            console.warn("[ServicesPriceSection] items:empty", {
                endpoint,
                page,
                visitType,
            });
        }
    }, [cacheKey, items, endpoint, page, visitType]);

    useEffect(() => {
        const listElement = listRef.current;
        if (!listElement) return;

        const threshold = 2;

        const updateScrollState = () => {
            const hasOverflow =
                listElement.scrollHeight - listElement.clientHeight > threshold;
            setIsScrollable(hasOverflow);

            const thumbElement = scrollbarThumbRef.current;
            if (thumbElement) {
                const clientHeight = listElement.clientHeight;
                const scrollHeight = listElement.scrollHeight;
                const scrollTop = listElement.scrollTop;

                const thumbHeight = hasOverflow
                    ? Math.max(
                          28,
                          Math.round(
                              (clientHeight / scrollHeight) * clientHeight,
                          ),
                      )
                    : clientHeight;

                const maxThumbTop = Math.max(0, clientHeight - thumbHeight);
                const scrollRange = Math.max(1, scrollHeight - clientHeight);
                const thumbTop = hasOverflow
                    ? Math.round((scrollTop / scrollRange) * maxThumbTop)
                    : 0;

                thumbElement.style.height = `${thumbHeight}px`;
                thumbElement.style.transform = `translateY(${thumbTop}px)`;
            }

            if (!hasOverflow) {
                setIsAtBottom(true);
                return;
            }

            const reachedBottom =
                listElement.scrollTop + listElement.clientHeight >=
                listElement.scrollHeight - threshold;

            setIsAtBottom(reachedBottom);
        };

        updateScrollState();

        const resizeObserver = new ResizeObserver(updateScrollState);
        resizeObserver.observe(listElement);

        const mutationObserver = new MutationObserver(updateScrollState);
        mutationObserver.observe(listElement, {
            childList: true,
            subtree: true,
        });

        listElement.addEventListener("scroll", updateScrollState, {
            passive: true,
        });
        window.addEventListener("resize", updateScrollState);

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            listElement.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, []);

    const content = useMemo(() => {
        if (loading && items.length === 0) {
            return <SkeletonRows />;
        }

        if (error) {
            return (
                <div
                    className="services-price-section__status services-price-section__status--error"
                    role="alert"
                >
                    {error}
                </div>
            );
        }

        if (items.length === 0) {
            return (
                <div className="services-price-section__status" role="status">
                    Наразі немає активних позицій.
                </div>
            );
        }

        return (
            <>
                {items.map((item) => (
                    <article
                        key={item.id}
                        className="services-price-section__item"
                    >
                        <h3 className="services-price-section__name">
                            {item.title}
                        </h3>
                        <div className="services-price-section__col">
                            <span className="services-price-section__mobile-label">
                                за декларацією
                            </span>
                            <span
                                className={`services-price-section__badge ${
                                    item.isFreeForDeclarant
                                        ? "is-free"
                                        : "is-paid"
                                }`}
                            >
                                {item.isFreeForDeclarant
                                    ? "безкоштовно"
                                    : formatPrice(item.priceForDeclarant)}
                            </span>
                        </div>

                        <div className="services-price-section__col">
                            <span className="services-price-section__mobile-label">
                                без декларації
                            </span>
                            <span className="services-price-section__badge is-paid">
                                {formatPrice(item.priceForNonDeclarant)}
                            </span>
                        </div>
                    </article>
                ))}

                <div className="services-price-section__note-row">
                    <p className="services-price-section__note">
                        {noteText}
                    </p>
                </div>
            </>
        );
    }, [error, items, loading, noteText]);

    const showFadeOverlay = isScrollable && !isAtBottom;

    return (
        <section className="services-price-section">
            <div className="services-price-section__container">
                <div className="services-price-section__card">
                    <div className="services-price-section__header">
                        <h2 className="services-price-section__title">
                            {title}
                        </h2>
                        <span className="services-price-section__head-col">
                            за декларацією
                        </span>
                        <span className="services-price-section__head-col">
                            без декларації
                        </span>
                    </div>

                    <div className="services-price-section__list-wrapper">
                        <div ref={listRef} className="services-price-section__list">
                            {content}
                        </div>

                        <div
                            className="services-price-section__scrollbar"
                            aria-hidden="true"
                        >
                            <span
                                ref={scrollbarThumbRef}
                                className="services-price-section__scrollbar-thumb"
                            />
                        </div>

                        {showFadeOverlay ? (
                            <div
                                className="services-price-section__fade"
                                aria-hidden="true"
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}
