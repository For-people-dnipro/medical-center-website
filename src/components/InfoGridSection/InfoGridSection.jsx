import "./InfoGridSection.css";

export default function InfoGridSection({
    leftTitle,
    leftItems = [],
    rightTitle,
    rightItems = [],
    imageSrc = "",
    imageAlt = "",
    type = "declaration",
    className = "",
}) {
    const rootClassName = [
        "info-grid-section",
        `info-grid-section--${type}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    if (type === "analyses") {
        return (
            <section className={rootClassName}>
                <div className="info-grid-section__container services-text-under-card__container">
                    <div className="info-grid-section__grid info-grid-section__grid--analyses">
                        <article className="info-grid-section__card info-grid-section__card--analyses-media">
                            {imageSrc ? (
                                <img
                                    src={imageSrc}
                                    alt={imageAlt}
                                    loading="lazy"
                                    decoding="async"
                                />
                            ) : null}
                        </article>

                        <article className="info-grid-section__card info-grid-section__card--analyses-text">
                            <h3 className="info-grid-section__title">
                                {rightTitle}
                            </h3>
                            <ul className="info-grid-section__list info-grid-section__list--analyses">
                                {rightItems.map((item, index) => (
                                    <li key={`${item}-${index}`}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    </div>
                </div>
            </section>
        );
    }

    if (type === "declaration") {
        return (
            <section className={rootClassName}>
                <div className="info-grid-section__container services-text-under-card__container">
                    <div className="info-grid-section__grid declaration-page__info-grid">
                        <article className="info-grid-section__card declaration-page__info-card">
                            <h3 className="info-grid-section__title">
                                {leftTitle}
                            </h3>

                            <ul className="info-grid-section__list declaration-page__list">
                                {leftItems.map((item, index) => (
                                    <li key={`${item}-${index}`}>
                                        <img src="/icons/check.svg" alt="" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="info-grid-section__card declaration-page__info-card">
                            <h3 className="info-grid-section__title">
                                {rightTitle}
                            </h3>

                            <ol className="info-grid-section__steps declaration-page__steps">
                                {rightItems.map((item, index) => {
                                    const step =
                                        typeof item === "string"
                                            ? { text: item }
                                            : item;

                                    return (
                                        <li
                                            key={`${step.text}-${index}`}
                                            className="declaration-page__step"
                                        >
                                            <p>{step.text}</p>

                                            {Array.isArray(step.substeps) &&
                                            step.substeps.length ? (
                                                <ul className="declaration-page__substeps">
                                                    {step.substeps.map(
                                                        (substep) => (
                                                            <li
                                                                key={`${substep}-${index}`}
                                                            >
                                                                {substep}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            ) : null}

                                            {step.notice ? (
                                                <div className="declaration-page__notice">
                                                    <p>
                                                        <span className="notice-label">
                                                            УВАГА!
                                                        </span>{" "}
                                                        {step.notice}
                                                    </p>
                                                </div>
                                            ) : null}
                                        </li>
                                    );
                                })}
                            </ol>
                        </article>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={rootClassName}>
            <div className="info-grid-section__container services-text-under-card__container">
                <div className="info-grid-section__grid">
                    <article className="info-grid-section__card">
                        <h2 className="info-grid-section__title">
                            {leftTitle}
                        </h2>
                        <ul className="info-grid-section__list info-grid-section__list--check">
                            {leftItems.map((item, index) => (
                                <li key={`${item}-${index}`}>{item}</li>
                            ))}
                        </ul>
                    </article>

                    <article className="info-grid-section__card">
                        <h2 className="info-grid-section__title">
                            {rightTitle}
                        </h2>
                        <ul className="info-grid-section__list info-grid-section__list--check">
                            {rightItems.map((item, index) => (
                                <li key={`${item}-${index}`}>{item}</li>
                            ))}
                        </ul>
                    </article>
                </div>
            </div>
        </section>
    );
}
