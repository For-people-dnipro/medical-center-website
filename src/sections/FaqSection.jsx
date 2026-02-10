import { useState, useRef, useEffect } from "react";
import "./FAQSection.css";

const DEFAULT_TITLE = "НАЙБІЛЬШ ПОШИРЕНІ ЗАПИТАННЯ";

function FaqAnswerContent({ answer, isActive }) {
    const scrollRef = useRef(null);
    const [hasOverflow, setHasOverflow] = useState(false);

    useEffect(() => {
        if (!isActive || !scrollRef.current) return;

        const el = scrollRef.current;

        const checkOverflow = () => {
            setHasOverflow(el.scrollHeight > el.clientHeight);
        };

        checkOverflow();
        window.addEventListener("resize", checkOverflow);

        return () => window.removeEventListener("resize", checkOverflow);
    }, [isActive, answer]);

    return (
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
    );
}

export default function FAQSection({ title = DEFAULT_TITLE, faqs = [] }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const items = Array.isArray(faqs) ? faqs : [];

    return (
        <section className="faq-section">
            <div className="faq-container">
                <h1 className="faq-title">{title}</h1>

                <div className="faq-list">
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
