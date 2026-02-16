import "./PackagesCardsGrid.css";

const cards = [
    {
        id: "pregnancy",
        icon: "/icons/baby.svg",
        title: "Ведення вагітності",
        text: "Від першого візиту до пологів: консультації акушера-гінеколога, необхідні аналізи, УЗД та підтримка протягом усіх триместрів.",
    },
    {
        id: "therapist",
        icon: "/icons/heart.svg",
        title: "Річний супровід терапевта",
        text: "Регулярні консультації, базові аналізи, контроль артеріального тиску та персональні рекомендації з профілактики.",
    },
    {
        id: "endocrinologist",
        icon: "/icons/thyroid.svg",
        title: "Супровід ендокринолога",
        text: "Спостереження при цукровому діабеті, захворюваннях щитоподібної залози чи порушеннях обміну речовин.",
    },
];

export default function PackagesCardsGrid() {
    return (
        <section className="packages-cards-grid">
            <div className="packages-cards-grid__container">
                <h2 className="packages-cards-grid__title">ДОСТУПНІ ПАКЕТИ</h2>

                <div className="packages-cards-grid__list">
                    {cards.map(({ id, icon, title, text }) => (
                        <article className="packages-cards-grid__card" key={id}>
                            <div className="packages-cards-grid__icon-wrap">
                                <img
                                    src={icon}
                                    alt=""
                                    className="packages-cards-grid__icon"
                                    aria-hidden="true"
                                />
                            </div>

                            <h3 className="packages-cards-grid__card-title">
                                {title}
                            </h3>

                            <p className="packages-cards-grid__card-text">
                                {text}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
