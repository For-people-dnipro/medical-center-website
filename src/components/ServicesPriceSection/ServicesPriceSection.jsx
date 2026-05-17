import { useEffect, useMemo, useRef, useState } from "react";
import ServicesPriceSectionContent from "./ServicesPriceSectionContent";
import {
    DEFAULT_ENDPOINT,
    DEFAULT_NOTE_TEXT,
    DEFAULT_TITLE,
    readCachedItems,
} from "./servicePriceSection.utils";
import { useServicePriceItems } from "./useServicePriceItems";
import "./ServicesPriceSection.css";

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

    const listRef = useRef(null);
    const scrollbarThumbRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const { error, items, loading } = useServicePriceItems({
        cacheKey,
        endpoint,
        filterField,
        filterValue,
        page,
        visitType,
    });

    useEffect(() => {
        const cachedItems = readCachedItems(cacheKey);
        setIsAtBottom(cachedItems.length === 0);
    }, [cacheKey]);

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
                          Math.round((clientHeight / scrollHeight) * clientHeight),
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

    const content = useMemo(
        () => (
            <ServicesPriceSectionContent
                error={error}
                items={items}
                loading={loading}
                noteText={noteText}
            />
        ),
        [error, items, loading, noteText],
    );

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

