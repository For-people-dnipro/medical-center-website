import { useEffect, useMemo, useRef, useState } from "react";
import "./VacancyItem.css";

function toPanelToken(id) {
    const value = String(id ?? "vacancy");
    return value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
}

export default function VacancyItem({ vacancy, isOpen, onToggle, onApply }) {
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
                    <span className="vacancy-item__title">{vacancy.title}</span>

                    <span className="vacancy-item__meta">
                        {vacancy.location ? (
                            <span className="vacancy-item__meta-item">
                                {vacancy.location}
                            </span>
                        ) : null}
                        {collapsedSchedule ? (
                            <span className="vacancy-item__meta-item">
                                {collapsedSchedule}
                            </span>
                        ) : null}
                    </span>
                </span>

                <span className="vacancy-item__chevron" aria-hidden="true">
                    <img src="/icons/arrow-down.svg" alt="" />
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
                    <div className="vacancy-item__facts">
                        {vacancy.location ? (
                            <div className="vacancy-item__fact">
                                <span className="vacancy-item__fact-label">
                                    Локація
                                </span>
                                <span className="vacancy-item__fact-value">
                                    {vacancy.location}
                                </span>
                            </div>
                        ) : null}

                        {vacancy.fullSchedule ? (
                            <div className="vacancy-item__fact">
                                <span className="vacancy-item__fact-label">
                                    Графік
                                </span>
                                <span className="vacancy-item__fact-value">
                                    {vacancy.fullSchedule}
                                </span>
                            </div>
                        ) : null}
                    </div>

                    {vacancy.responsibilities.length > 0 ? (
                        <section className="vacancy-item__section">
                            <h4 className="vacancy-item__section-title">
                                Обов&apos;язки
                            </h4>
                            <ul className="vacancy-item__list">
                                {vacancy.responsibilities.map((item, index) => (
                                    <li
                                        key={`${vacancy.id}-resp-${index}`}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ) : null}

                    {vacancy.requirements.length > 0 ? (
                        <section className="vacancy-item__section">
                            <h4 className="vacancy-item__section-title">
                                Вимоги
                            </h4>
                            <ul className="vacancy-item__list">
                                {vacancy.requirements.map((item, index) => (
                                    <li
                                        key={`${vacancy.id}-req-${index}`}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ) : null}

                    {vacancy.description ? (
                        <section className="vacancy-item__section">
                            <h4 className="vacancy-item__section-title">
                                Додаткова інформація
                            </h4>
                            <p className="vacancy-item__description">
                                {vacancy.description}
                            </p>
                        </section>
                    ) : null}

                    <div className="vacancy-item__actions">
                        <button
                            type="button"
                            className="vacancy-item__apply"
                            onClick={() => onApply?.(vacancy.title)}
                        >
                            Подати заявку
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
