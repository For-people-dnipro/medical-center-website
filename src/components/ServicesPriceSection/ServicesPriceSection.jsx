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
        let rafId = 0;
        let lastThumbHeight = -1;
        let prevScrollable = null;
        let prevAtBottom = null;

        const applyUpdate = () => {
            rafId = 0;
            const hasOverflow =
                listElement.scrollHeight - listElement.clientHeight > threshold;
            if (prevScrollable !== hasOverflow) {
                prevScrollable = hasOverflow;
                setIsScrollable(hasOverflow);
            }

            const thumbElement = scrollbarThumbRef.current;
            if (thumbElement) {
                const clientHeight = listElement.clientHeight;
                const scrollHeight = listElement.scrollHeight;
                const scrollTop = listElement.scrollTop;

                const thumbHeight = hasOverflow
                    ? Math.max(28, (clientHeight / scrollHeight) * clientHeight)
                    : clientHeight;

                const maxThumbTop = Math.max(0, clientHeight - thumbHeight);
                const scrollRange = Math.max(1, scrollHeight - clientHeight);
                const thumbTop = hasOverflow
                    ? (scrollTop / scrollRange) * maxThumbTop
                    : 0;

                if (thumbHeight !== lastThumbHeight) {
                    lastThumbHeight = thumbHeight;
                    thumbElement.style.height = `${thumbHeight}px`;
                }
                thumbElement.style.transform = `translate3d(0, ${thumbTop}px, 0)`;
            }

            let reachedBottom = true;
            if (hasOverflow) {
                reachedBottom =
                    listElement.scrollTop + listElement.clientHeight >=
                    listElement.scrollHeight - threshold;
            }
            if (prevAtBottom !== reachedBottom) {
                prevAtBottom = reachedBottom;
                setIsAtBottom(reachedBottom);
            }
        };

        const scheduleUpdate = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(applyUpdate);
        };

        applyUpdate();

        const resizeObserver = new ResizeObserver(scheduleUpdate);
        resizeObserver.observe(listElement);

        const mutationObserver = new MutationObserver(scheduleUpdate);
        mutationObserver.observe(listElement, {
            childList: true,
            subtree: true,
        });

        listElement.addEventListener("scroll", scheduleUpdate, {
            passive: true,
        });
        window.addEventListener("resize", scheduleUpdate);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            listElement.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
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

