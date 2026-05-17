import { formatPrice, SKELETON_ROWS } from "./servicePriceSection.utils";

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

export default function ServicesPriceSectionContent({
    error,
    items,
    loading,
    noteText,
}) {
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
                                item.isFreeForDeclarant ? "is-free" : "is-paid"
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
                <p className="services-price-section__note">{noteText}</p>
            </div>
        </>
    );
}

