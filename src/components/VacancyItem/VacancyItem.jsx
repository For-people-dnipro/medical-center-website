import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../Button/Button";
import "./VacancyItem.css";

const DEFAULT_VACANCY_APPLY_URL =
    "https://forms.gle/BUbVWtqUddkSsebn8";

function toPanelToken(id) {
    const value = String(id ?? "vacancy");
    return value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
}

function splitDescription(value) {
    if (!value) return [];

    return String(value)
        .split(/\r?\n+/)
        .map((line) => line.trim())
        .filter(Boolean);
}

export default function VacancyItem({ vacancy, isOpen, onToggle }) {
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        const contentElement = contentRef.current;
        if (!contentElement) return;

        const updateHeight = () => {
            setContentHeight(contentElement.scrollHeight);
        };

        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(contentElement);

        return () => resizeObserver.disconnect();
    }, [vacancy]);

    useEffect(() => {
        const contentElement = contentRef.current;
        if (!contentElement || !isOpen) return;

        setContentHeight(contentElement.scrollHeight);
    }, [isOpen, vacancy]);

    const panelToken = useMemo(() => toPanelToken(vacancy.id), [vacancy.id]);
    const panelId = `vacancy-panel-${panelToken}`;
    const triggerId = `vacancy-trigger-${panelToken}`;
    const collapsedSchedule = vacancy.shortSchedule || vacancy.fullSchedule;
    const descriptionLines = useMemo(
        () => splitDescription(vacancy.description),
        [vacancy.description],
    );

    return (
        <article className={`vacancy-item ${isOpen ? "is-open" : ""}`}>
            <button
                id={triggerId}
                type="button"
                className="vacancy-item__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={onToggle}
            >
                <span className="vacancy-item__head">
                    <h2 className="vacancy-item__title">{vacancy.title}</h2>

                    <span className="vacancy-item__meta">
                        {vacancy.location ? (
                            <span className="vacancy-item__meta-item">
                                <span className="vacancy-item__meta-icon">
                                    <img
                                        src="/icons/map-point-green.svg"
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </span>
                                <span>{vacancy.location}</span>
                            </span>
                        ) : null}
                        {collapsedSchedule ? (
                            <span className="vacancy-item__meta-item">
                                <span className="vacancy-item__meta-icon">
                                    <img
                                        src="/icons/clock-green.svg"
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </span>
                                <span>{collapsedSchedule}</span>
                            </span>
                        ) : null}
                    </span>
                </span>

                <span className="vacancy-item__chevron" aria-hidden="true">
                    <img
                        src="/icons/arrow-down.svg"
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                </span>
            </button>

            <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!isOpen}
                className="vacancy-item__content-shell"
                style={{ maxHeight: isOpen ? `${contentHeight}px` : "0px" }}
            >
                <div ref={contentRef} className="vacancy-item__content">
                    {vacancy.importantForUs.length > 0 ? (
                        <section className="vacancy-item__section">
                            <p className="vacancy-item__section-title">
                                Для нас важливо:
                            </p>
                            <ul className="vacancy-item__list">
                                {vacancy.importantForUs.map((item, index) => (
                                    <li key={`${vacancy.id}-resp-${index}`}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ) : null}

                    {vacancy.weProvide.length > 0 ? (
                        <section className="vacancy-item__section">
                            <p className="vacancy-item__section-title">
                                Ми забезпечуємо:
                            </p>
                            <ul className="vacancy-item__list">
                                {vacancy.weProvide.map((item, index) => (
                                    <li key={`${vacancy.id}-req-${index}`}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ) : null}

                    {descriptionLines.length > 0 ? (
                        <section className="vacancy-item__section">
                            <div className="vacancy-item__description">
                                {descriptionLines.map((line, index) => (
                                    <p key={`${vacancy.id}-desc-${index}`}>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {vacancy.fullSchedule || vacancy.location ? (
                        <div className="vacancy-item__summary">
                            {vacancy.fullSchedule ? (
                                <p className="vacancy-item__summary-line">
                                    <span>Графік роботи: </span>
                                    {vacancy.fullSchedule}
                                </p>
                            ) : null}

                            {vacancy.location ? (
                                <p className="vacancy-item__summary-line">
                                    <span>Локація: </span>
                                    {vacancy.location}
                                </p>
                            ) : null}
                        </div>
                    ) : null}

                    <div className="vacancy-item__actions">
                        <Button
                            href={DEFAULT_VACANCY_APPLY_URL}
                            className="vacancy-item__apply"
                            withArrow
                        >
                            Подати заявку
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
}
