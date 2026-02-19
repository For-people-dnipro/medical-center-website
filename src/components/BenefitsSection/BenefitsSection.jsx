import "./BenefitsSection.css";

const BENEFITS = [
    "Працюємо на основі доказової медицини",
    "Приймаємо пацієнтів за договором з НСЗУ",
    "Віримо у важливість діалогу між лікарем і пацієнтом",
    "Створюємо середовище без токсичної конкуренції",
    "Ми зростаємо, бо віримо в людей та майбутнє України",
    "Створюємо медицину з довірою та турботою",
];

export default function BenefitsSection() {
    return (
        <section className="benefits-section" aria-labelledby="benefits-title">
            <div className="benefits-section__container">
                <div className="benefits-section__surface">
                    <h3 id="benefits-title" className="benefits-section__title">
                        <span className="benefits-section__title-desktop">
                            Переваги роботи в команді “Для людей”
                        </span>
                        <span className="benefits-section__title-mobile">
                            Переваги роботи з нами
                        </span>
                    </h3>

                    <p className="benefits-section__subtitle">
                        Ми — мережа сімейних поліклінік, де кожен пацієнт
                        отримує якісну, безперервну та доступну медичну
                        допомогу, а кожен лікар — підтримку, повагу та
                        можливості для розвитку.
                    </p>

                    <div className="benefits-section__grid">
                        {BENEFITS.map((benefit, index) => (
                            <article
                                key={index}
                                className="benefits-section__card"
                            >
                                <p className="benefits-section__card-text">
                                    {benefit}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
