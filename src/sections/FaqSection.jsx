import { useState, useRef, useEffect } from "react";
import "./FaqSection.css";

const DEFAULT_TITLE = "НАЙБІЛЬШ ПОШИРЕНІ ЗАПИТАННЯ";

function FaqAnswerContent({ answer, isActive }) {
    const scrollRef = useRef(null);
    const thumbRef = useRef(null);
    const [hasOverflow, setHasOverflow] = useState(false);

    useEffect(() => {
        if (!isActive || !scrollRef.current) return;

        const el = scrollRef.current;
        let rafId = 0;
        let lastThumbHeight = -1;

        const update = () => {
            rafId = 0;
            const overflow = el.scrollHeight - el.clientHeight > 1;
            setHasOverflow(overflow);

            const thumb = thumbRef.current;
            if (!thumb) return;

            if (!overflow) {
                thumb.style.transform = "translate3d(0,0,0)";
                return;
            }

            const ch = el.clientHeight;
            const sh = el.scrollHeight;
            const st = el.scrollTop;
            const thumbH = Math.max(24, (ch / sh) * ch);
            const maxTop = Math.max(0, ch - thumbH);
            const range = Math.max(1, sh - ch);
            const top = (st / range) * maxTop;

            if (thumbH !== lastThumbHeight) {
                lastThumbHeight = thumbH;
                thumb.style.height = `${thumbH}px`;
            }
            thumb.style.transform = `translate3d(0, ${top}px, 0)`;
        };

        const schedule = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(update);
        };

        update();
        el.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);

        const resizeObserver = new ResizeObserver(schedule);
        resizeObserver.observe(el);
        const parent = el.parentElement;
        if (parent) resizeObserver.observe(parent);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            el.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            resizeObserver.disconnect();
        };
    }, [isActive, answer]);

    return (
        <div className="faq-answer-scroll-wrapper">
            <div
                className={`faq-answer-scroll ${
                    hasOverflow ? "has-scroll" : "no-scroll"
                }`}
                ref={scrollRef}
            >
                <div className="faq-answer-content">
                    {Array.isArray(answer) ? (
                        answer.map((line, i) =>
                            line === "" ? (
                                <div key={i} className="faq-answer-spacer" />
                            ) : (
                                <p key={i}>{line}</p>
                            ),
                        )
                    ) : (
                        <p>{answer}</p>
                    )}
                </div>
            </div>
            {hasOverflow && (
                <div className="faq-answer-scrollbar" aria-hidden="true">
                    <span
                        ref={thumbRef}
                        className="faq-answer-scrollbar-thumb"
                    />
                </div>
            )}
        </div>
    );
}

export default function FAQSection({ title = DEFAULT_TITLE, faqs = [] }) {
    const accordionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const items = Array.isArray(faqs) ? faqs : [];

    useEffect(() => {
        if (activeIndex === null) return;

        const handleOutsideClick = (event) => {
            const root = accordionRef.current;
            if (!root || !(event.target instanceof Node)) return;

            const activeItem = root.querySelector(".faq-row.active");
            if (!activeItem) return;

            if (!activeItem.contains(event.target)) {
                setActiveIndex(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick, {
            passive: true,
        });

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [activeIndex]);

    return (
        <section className="faq-section">
            <div className="faq-container">
                <h2 className="faq-title">
                    <span className="faq-title-desktop">{title}</span>
                    <span className="faq-title-mobile">ПОШИРЕНІ ЗАПИТАННЯ</span>
                </h2>

                <div ref={accordionRef} className="faq-list">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className={`faq-row ${
                                activeIndex === i ? "active" : ""
                            }`}
                        >
                            <button
                                className="faq-question"
                                onClick={() =>
                                    setActiveIndex(activeIndex === i ? null : i)
                                }
                            >
                                <span>{item.question}</span>
                                <span className="faq-arrow" />
                            </button>

                            <div className="faq-answer">
                                <FaqAnswerContent
                                    answer={item.answer}
                                    isActive={activeIndex === i}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
