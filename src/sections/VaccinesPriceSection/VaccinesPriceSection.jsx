import { useEffect, useMemo, useState } from "react";
import "./VaccinesPriceSection.css";

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const VISIBLE_VACCINES_COUNT = 5;

function normalizeVaccines(items = []) {
    return items
        .map((item, index) => {
            const attributes = item?.attributes ?? item ?? {};
            const rawPrice = attributes?.price;
            const numericPrice = Number(rawPrice);

            return {
                id: item?.id ?? `${attributes?.title || "vaccine"}-${index}`,
                title: attributes?.title || "Без назви",
                price: Number.isFinite(numericPrice) ? numericPrice : null,
                currency: attributes?.currency || "грн",
                availability:
                    attributes?.availability === "expected"
                        ? "expected"
                        : "in_stock",
                order: Number(attributes?.order ?? Number.MAX_SAFE_INTEGER),
                isActive: Boolean(attributes?.isActive),
            };
        })
        .filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order);
}

function formatPrice(value, currency) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "Ціна уточнюється";
    }

    const formattedValue = new Intl.NumberFormat("uk-UA", {
        maximumFractionDigits: 0,
    }).format(value);

    return `${formattedValue} ${currency || "грн"}`;
}

export default function VaccinesPriceSection() {
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const loadVaccines = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await fetch(
                    `${API_URL}/api/vaccines?sort[0]=order:asc&filters[isActive][$eq]=true&pagination[pageSize]=100`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const payload = await response.json();
                const normalized = normalizeVaccines(payload?.data || []);
                setVaccines(normalized);
            } catch (requestError) {
                if (requestError.name !== "AbortError") {
                    setError(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadVaccines();

        return () => controller.abort();
    }, []);

    const hasVaccines = useMemo(() => vaccines.length > 0, [vaccines]);
    const isScrollableState = useMemo(
        () => !loading && !error && vaccines.length > VISIBLE_VACCINES_COUNT,
        [loading, error, vaccines.length],
    );

    const cardClassName = [
        "vaccines-price-section__card",
        isScrollableState && "vaccines-price-section__card--scrollable",
    ]
        .filter(Boolean)
        .join(" ");

    const listClassName = [
        "vaccines-price-section__list",
        isScrollableState && "vaccines-price-section__list--scrollable",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <section className="vaccines-price-section" aria-labelledby="prices-title">
            <div className="vaccines-price-section__container">
                <div className={cardClassName}>
                    <h2
                        id="prices-title"
                        className="vaccines-price-section__title"
                    >
                        ЦІНИ НА ВАКЦИНАЦІЮ
                    </h2>

                    <div className="vaccines-price-section__list-wrapper">
                        {loading ? (
                            <ul className={listClassName} aria-live="polite">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <li
                                        className="vaccines-price-section__item vaccines-price-section__item--loading"
                                        key={`loading-${index}`}
                                    >
                                        <span className="vaccines-price-section__line" />
                                        <span className="vaccines-price-section__badge vaccines-price-section__badge--loading" />
                                    </li>
                                ))}
                            </ul>
                        ) : null}

                        {!loading && error ? (
                            <div
                                className="vaccines-price-section__state"
                                role="status"
                            >
                                Не вдалося завантажити ціни. Спробуйте пізніше.
                            </div>
                        ) : null}

                        {!loading && !error && !hasVaccines ? (
                            <div
                                className="vaccines-price-section__state"
                                role="status"
                            >
                                Наразі активних вакцин немає.
                            </div>
                        ) : null}

                        {!loading && !error && hasVaccines ? (
                            <ul className={listClassName} aria-live="polite">
                                {vaccines.map((vaccine) => {
                                    const isExpected =
                                        vaccine.availability === "expected";
                                    const itemClassName = [
                                        "vaccines-price-section__item",
                                        isExpected
                                            ? "vaccines-price-section__item--expected"
                                            : "vaccines-price-section__item--in-stock",
                                    ].join(" ");

                                    const badgeClassName = [
                                        "vaccines-price-section__badge",
                                        isExpected
                                            ? "vaccines-price-section__badge--expected"
                                            : "vaccines-price-section__badge--in-stock",
                                    ].join(" ");

                                    return (
                                        <li className={itemClassName} key={vaccine.id}>
                                            <div className="vaccines-price-section__name-wrap">
                                                <p className="vaccines-price-section__name">
                                                    {vaccine.title}
                                                </p>
                                            </div>

                                            <div className="vaccines-price-section__price-wrap">
                                                {isExpected ? (
                                                    <span className="vaccines-price-section__availability">
                                                        (очікуємо)
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="vaccines-price-section__dot"
                                                        aria-hidden="true"
                                                    />
                                                )}

                                                <span className={badgeClassName}>
                                                    {formatPrice(
                                                        vaccine.price,
                                                        vaccine.currency,
                                                    )}
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}
