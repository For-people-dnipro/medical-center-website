import "./WhyChooseUsSection.css";
import Button from "../components/Button/Button";

export default function WhyChooseUsSection() {
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
                <div className="why-stats">
                    <div className="stat stat-shift-left">
                        <span className="stat-number stat-number-shift">
                            20k+
                        </span>

                        <div className="stat-text-wrap">
                            <span className="stat-line"></span>
                            <span className="stat-text">
                                задоволених пацієнтів
                            </span>
                        </div>
                    </div>

                    <div className="stat">
                        <span className="stat-number">15</span>
                        <div className="stat-text-wrap">
                            <span className="stat-line"></span>
                            <span className="stat-text">
                                досвідчених спеціалістів
                            </span>
                        </div>
                    </div>

                    <div className="stat">
                        <span className="stat-number">98%</span>
                        <div className="stat-text-wrap">
                            <span className="stat-line"></span>
                            <span className="stat-text">
                                позитивних відгуків
                            </span>
                        </div>
                    </div>

                    <div className="stat">
                        <span className="stat-number">24/7</span>
                        <div className="stat-text-wrap">
                            <span className="stat-line"></span>

                            <span className="stat-text">
                                зручний онлайн-запис
                            </span>
                        </div>
                    </div>
                </div>
                <h3 className="why-subtitle">Наші Переваги:</h3>
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
