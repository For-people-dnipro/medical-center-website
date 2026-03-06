import { useEffect, useMemo, useRef, useState } from "react";
import { toUiServiceTitle } from "../../lib/serviceTitle";
import "./ServicesPriceSection.css";

const API_URL = (import.meta.env.VITE_STRAPI_URL || "http://localhost:1337")
    .trim()
    .replace(/\/$/, "");

const DEFAULT_TITLE = "ЦІНИ НА КОНСУЛЬТАЦІЇ";
const DEFAULT_ENDPOINT = "/api/service-prices";
const DEFAULT_NOTE_TEXT =
    "Не знайшли потрібну консультацію? Напишіть нам — ми обов’язково допоможемо.";
const SKELETON_ROWS = 6;

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
    const listRef = useRef(null);
    const scrollbarThumbRef = useRef(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const filterField = page ? "page" : visitType ? "visitType" : "";
        const filterValue = page || visitType;

        async function fetchItems() {
            setLoading(true);
            setError("");

            try {
                const requestUrl = buildRequestUrl(endpoint, {
                    filterField,
                    filterValue,
                });
                const response = await fetch(requestUrl, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const payload = await response.json();
                setItems(normalizeServicePriceItems(payload));
            } catch (err) {
                if (err?.name === "AbortError") {
                    return;
                }

                console.error("Failed to load service prices:", err);
                setItems([]);
                setError("Не вдалося завантажити ціни. Спробуйте пізніше.");
            } finally {
                setLoading(false);
            }
        }

        fetchItems();

        return () => controller.abort();
    }, [endpoint, page, visitType]);

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
        if (loading) {
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
