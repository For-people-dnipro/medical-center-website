import { useState, useRef, useEffect } from "react";
import "./FAQSection.css";

const faqs = [
    {
        question: "Хто такий сімейний лікар?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Які саме послуги я отримаю безкоштовно?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Як записатися на прийом?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question:
            "Як перепідписати декларацію, якщо вона вже укладена в іншому закладі?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Чи можу звернутись до терапевта разово, без декларації?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Чи проводите вакцинацію пацієнтам без декларації?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Як записатися на консультацію до лікаря?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Чи можна укласти декларацію онлайн?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Чи потрібно готуватися до консультації у спеціаліста?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Чи можна отримати термінову консультацію в день звернення?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
];

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState(null);
    const containerRef = useRef(null);

    const toggleFAQ = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    // ✅ клік поза FAQ → закрити
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setActiveIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <section className="faq-section">
            <div className="faq-container" ref={containerRef}>
                <h2 className="faq-title">НАЙБІЛЬШ ПОШИРЕНІ ЗАПИТАННЯ</h2>
                <h2 className="faq-title-mobile"> ПОШИРЕНІ ЗАПИТАННЯ</h2>

                <div className="faq-list">
                    {faqs.map((item, i) => (
                        <div
                            key={i}
                            className={`faq-row ${
                                activeIndex === i ? "active" : ""
                            }`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(i)}
                            >
                                <span>{item.question}</span>
                                <span className="faq-arrow" />
                            </button>

                            <div className="faq-answer">
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
