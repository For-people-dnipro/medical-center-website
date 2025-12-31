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
        question:
            "У мене вже підписана декларація в іншому закладі, як перепідписати у вас?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Що таке річна програма медичного супроводу?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Хто такий сімейний лікар?",
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
        question: "Чи можна отримати онлайн консультацію сімейного лікаря?",
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
