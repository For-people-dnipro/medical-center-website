import { useState, useRef, useEffect } from "react";
import "./FAQSection.css";
const faqs = [
    {
        question: "Хто такий сімейний лікар?",
        answer: [""],
    },
    {
        question: "Як записатися на прийом?",
        answer: [
            "Наш медичний центр має 3 філії. Оберіть необхідну вам. Записатися можна через helsi.me. Це достатньо швидко, без очікувань, і ви можете зробити це самостійно на комп’ютері або через мобільний додаток. Також ви можете записатися на прийом зателефонувавши на рецепцію відповідної філії.",
            "",
            "Філія №1 «Західна»",
            "м. Дніпро, вул. Данила Галицького, 3",
            "050-067-13-88",
            <>
                Сторінка для запису за{" "}
                <a
                    href="https://helsi.me/clinic/9eeb07ee-f563-4f3c-a969-0c08b0988635
"
                    target="_blank"
                    rel="noreferrer"
                >
                    посиланням
                </a>
            </>,
            "",
            "",
            "Філія №2 «Б. Хмельницького»",
            "м. Дніпро, пр-т Богдана Хмельницького, 127",
            "050-067-22-35",
            <>
                Сторінка для запису за{" "}
                <a
                    href="https://helsi.me/clinic/8e66e36b-2fde-4c62-be14-11279c08349f"
                    target="_blank"
                    rel="noreferrer"
                >
                    посиланням
                </a>
            </>,
            "",
            "",
            "Філія №3 «Перемога»",
            "м. Дніпро, бульвар Слави, 8",
            "066-067-00-37",
            <>
                Сторінка для запису за{" "}
                <a
                    href="https://helsi.me/clinic/ae8e3900-38f7-43c7-bc37-44350d072819
"
                    target="_blank"
                    rel="noreferrer"
                >
                    посиланням
                </a>
            </>,
        ],
    },
    {
        question: "Чи можна укласти декларацію онлайн?",
        answer: [""],
    },
    {
        question: "Де можна переглянути результати аналізів?",
        answer: [""],
    },

    {
        question: "Чи можу звернутись до терапевта разово, без декларації?",
        answer: (
            <>
                Так, ви можете звернутися на разову консультацію до лікаря без
                декларації. Прийом здійснюється на платній основі відповідно до
                нашого прайс-листа. Актуальні ціни ви можете переглянути на
                сайті клініки або за телефоном у адміністратора клініки Для
                запису оберіть зручне для вас відділення. Записатися можна через{" "}
                <a href="https://helsi.me/" target="_blank" rel="noreferrer">
                    helsi.mi
                </a>{" "}
                або за номером телефона відповідної філії.
            </>
        ),
    },
    {
        question: "Чи можу я отримати термінову консультацію?",
        answer: [
            "Так, ми робимо все можливе, щоб допомогти вам у термінових випадках. Зателефонуйте за номером телефону вашої філії, і наш адміністратор перевірить наявність вільних вікон у графіку спеціаліста. Якщо вільного часу немає, ми запропонуємо найближчу доступну дату.",
            "",
            "Філія №1 «Західна» — 050-067-13-88",
            "",
            "Філія №2 «Б. Хмельницького» — 050-067-22-35",
            "",
            "Філія №3 «Перемога» — 066-067-00-37",
        ],
    },
    {
        question: "Чи проводите вакцинацію пацієнтам без декларації?",
        answer: "Так, ми проводимо вакцинацію без декларації. Для цього достатньо записатися на прийом у найбільш зручне для вас відділення — за телефонами, вказаними на сайті. Наші адміністратори допоможуть обрати зручний час і дадуть відповіді на всі запитання.",
    },
    {
        question:
            "Як перепідписати декларацію, якщо вона вже укладена в іншому закладі?",
        answer: "Ви можете укласти декларацію з нашим сімейним лікарем, навіть якщо раніше вона була оформлена в іншій клініці. Вам не потрібно нічого робити з попередньою декларацією — під час укладання нової декларації попередня автоматично припиняється. Оформити декларацію можна в будь-якій з наших філій.",
    },
];

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

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="faq-section">
            <div className="faq-container">
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
