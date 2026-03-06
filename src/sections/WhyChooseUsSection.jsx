import { useEffect, useMemo, useRef, useState } from "react";
import "./WhyChooseUsSection.css";
import Button from "../components/Button/Button";

const STATS = [
    {
        id: "patients",
        target: 20,
        sample: "20k+",
        format: (value) => `${value}k+`,
        text: "задоволених пацієнтів",
    },
    {
        id: "specialists",
        target: 15,
        sample: "15",
        format: (value) => `${value}`,
        text: "досвідчених спеціалістів",
    },
    {
        id: "reviews",
        target: 98,
        sample: "98%",
        format: (value) => `${value}%`,
        text: "позитивних відгуків",
    },
    {
        id: "availability",
        target: 24,
        sample: "24/7",
        format: (value) => `${value}/7`,
        text: "зручний онлайн-запис",
    },
];

export default function WhyChooseUsSection() {
    const statsRef = useRef(null);
    const hasAnimatedRef = useRef(false);
    const [hasStarted, setHasStarted] = useState(false);
    const initialValues = useMemo(
        () =>
            STATS.reduce((acc, stat) => {
                acc[stat.id] = 0;
                return acc;
            }, {}),
        [],
    );
    const [animatedValues, setAnimatedValues] = useState(initialValues);

    useEffect(() => {
        const target = statsRef.current;
        if (!target || hasAnimatedRef.current) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting || hasAnimatedRef.current) return;
                hasAnimatedRef.current = true;
                setHasStarted(true);
                observer.disconnect();
            },
            { threshold: 0.35 },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!hasStarted) return undefined;

        const durationMs = 900;
        let rafId = 0;
        let startTime = 0;

        const easeOutCubic = (progress) => 1 - (1 - progress) ** 3;

        const tick = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            const easedProgress = easeOutCubic(progress);

            setAnimatedValues(
                STATS.reduce((acc, stat) => {
                    acc[stat.id] = Math.round(stat.target * easedProgress);
                    return acc;
                }, {}),
            );

            if (progress < 1) {
                rafId = window.requestAnimationFrame(tick);
            }
        };

        rafId = window.requestAnimationFrame(tick);

        return () => {
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
        };
    }, [hasStarted]);

    return (
        <section className="why-section">
            <div className="why-container">
                {/* TITLE */}
                <h2 className="why-title why-title-desktop">
                    ЧОМУ ВАРТО ОБРАТИ НАС?
                </h2>
                <h2 className="why-title why-title-mobile">
                    МЦ «Для людей» — сучасна медицина з турботою про кожного
                </h2>

                {/* DESCRIPTION */}
                <p className="why-description why-description-desktop">
                    Наші центри — це місце, де до кожного ставляться з повагою
                    та турботою. Ми зібрали команду лікарів, які слухають,
                    пояснюють і підбирають найкраще рішення саме для вас. Тут
                    усе створено для вашої зручності: сучасна діагностика,
                    власна лабораторія та простір, де про вас справді
                    піклуються.
                </p>
                <div className="why-description why-description-mobile">
                    <p>
                        Наші центри — це місце, де до кожного ставляться з
                        повагою та турботою.
                    </p>
                    <p>
                        Ми зібрали команду лікарів, які слухають, пояснюють і
                        підбирають найкраще рішення саме для вас.
                    </p>
                    <p>
                        Тут усе створено для вашої зручності: сучасна
                        діагностика, власна лабораторія та простір, де про вас
                        справді піклуються.
                    </p>
                </div>

                {/* STATS */}
                <div className="why-stats" ref={statsRef}>
                    {STATS.map((stat, index) => (
                        <div
                            key={stat.id}
                            className={`stat ${index === 0 ? "stat-shift-left" : ""}`.trim()}
                        >
                            <span
                                className={`stat-number ${
                                    index === 0 ? "stat-number-shift" : ""
                                }`.trim()}
                                style={{ "--stat-sample-length": stat.sample.length }}
                            >
                                {stat.format(animatedValues[stat.id] ?? 0)}
                            </span>

                            <div className="stat-text-wrap">
                                <span className="stat-line"></span>
                                <span className="stat-text">{stat.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <h2 className="why-subtitle">Наші Переваги:</h2>
                <div className="why-features-wrapper">
                    <div className="why-features">
                        <ul>
                            <li>Індивідуальний підхід до кожного пацієнта</li>
                            <li>Досвідчені лікарі різних напрямів</li>
                            <li>Повна діагностика та аналізи в одному місці</li>
                        </ul>

                        <ul>
                            <li>Доказове лікування та сучасне обладнання</li>
                            <li>Власна лабораторія для швидких результатів</li>
                            <li>Комфортні та безпечні умови для пацієнтів</li>
                        </ul>
                    </div>
                </div>

                {/* BUTTON */}
                <div className="why-button">
                    <Button href="/about">Дізнатись більше</Button>
                </div>
            </div>
        </section>
    );
}
