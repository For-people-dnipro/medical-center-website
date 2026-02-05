import ContactForm from "../components/ContactForm/ContactForm";
import Footer from "../components/Footer/Footer";
import "./DeclarationPage.css";
import ServicesCardHero from "../components/ServicesCardHero/ServicesCardHero";
import Ticket from "../components/Ticket/Ticket";

const benefits = [
    "Щоб мати свого лікаря, який знає історію вашого здоров'я.",
    "Щоб отримувати консультації, направлення до спеціалістів і рецепти.",
    "Щоб користуватися безоплатними медичними послугами, які гарантує держава.",
    "Щоб знати, що у будь-якій ситуації поруч є людина, якій можна довіряти.",
    "Щоб забезпечити безперервність лікування та якісний контроль вашого стану.",
    "Щоб швидше отримувати необхідну допомогу, не витрачаючи час на пошук лікарів щоразу.",
];

const steps = [
    {
        text: "Оберіть свого лікаря.",
    },
    {
        text: "Підписати декларацію можна у зручний для вас спосіб:",
        substeps: [
            "У філії — зверніться до адміністратора без попереднього запису. Візьміть паспорт і код. Якщо оформлюєте декларацію для дитини — також свідоцтво про народження.",
            "Онлайн — заповніть форму, після чого адміністратор зв’яжеться з вами, щоб підписати декларацію без відвідування клініки.",
        ],
    },
    {
        text: "Після підписання декларації ви одразу стаєте нашим пацієнтом і можете звертатися по допомогу у будь-який час.",
    },
];

const freeServices = [
    {
        title: "Консультації та огляди",
        items: [
            "огляди та профілактика для дорослих і дітей",
            "контроль здоров'я і хронічних хвороб",
            "діагностика і лікування найпоширеніших хвороб",
        ],
    },
    {
        title: "Аналізи",
        items: [
            "загальний аналіз крові (з лейкоцитарною формулою)",
            "загальний аналіз сечі",
            "визначення рівня глюкози та холестерину",
        ],
    },
    {
        title: "Діагностика",
        items: [
            "електрокардіограма (ЕКГ)",
            "вимірювання артеріального тиску",
            "антропометрія: вага, зріст, окружність талії",
        ],
    },
    {
        title: "Швидкі тести",
        items: [
            "тестування на ВІЛ",
            "тестування на гепатит B",
            "тестування на гепатит C",
        ],
    },
    {
        title: "Вакцинація",
        items: [
            "проведення щеплень згідно з національним календарем",
            "оцінка стану здоров'я перед вакцинацією",
            "рекомендації щодо подальших щеплень",
        ],
    },
    {
        title: "Направлення",
        items: [
            "направлення до профільних лікарів за потреби",
            "скерування на лабораторні та інструментальні обстеження",
            "узгодження подальшої діагностики та лікування",
        ],
    },
];

export default function DeclarationPage() {
    return (
        <div className="declaration-page">
            <main className="declaration-page__main">
                <ServicesCardHero />

                <section className="declaration-page__intro">
                    <div className="declaration-page__container">
                        <p>
                            Декларація — це перший крок до вашого сімейного
                            лікаря, який турбується про ваше здоров’я
                            безкоштовно. Це не формальність, а домовленість про
                            турботу — між вами та вашим лікарем.
                        </p>
                    </div>
                </section>

                <section className="declaration-page__info">
                    <div className="declaration-page__container">
                        <div className="declaration-page__info-grid">
                            <article className="declaration-page__info-card">
                                <h2>НАВІЩО ПОТРІБНА ДЕКЛАРАЦІЯ?</h2>
                                <ul className="declaration-page__list">
                                    {benefits.map((item, index) => (
                                        <li key={index}>
                                            <img
                                                src="/icons/check.svg"
                                                alt=""
                                            />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>

                            <article className="declaration-page__info-card">
                                <h2>ЯК УКЛАСТИ ДЕКЛАРАЦІЮ?</h2>
                                <ol className="declaration-page__steps">
                                    {steps.map((step, index) => (
                                        <li
                                            key={index}
                                            className="declaration-page__step"
                                        >
                                            <p>{step.text}</p>

                                            {step.substeps && (
                                                <ul className="declaration-page__substeps">
                                                    {step.substeps.map(
                                                        (substep) => (
                                                            <li key={substep}>
                                                                {substep}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            )}

                                            {/* УВАГА після другого пункту */}
                                            {index === 1 && (
                                                <div className="declaration-page__notice">
                                                    <p>
                                                        <span className="notice-label">
                                                            УВАГА!
                                                        </span>{" "}
                                                        Для оформлення
                                                        декларації на дитину
                                                        довірена особа (мати чи
                                                        батько) повинна бути
                                                        зареєстрована в ЕСОЗ.
                                                    </p>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="declaration-page__cta">
                    <Ticket text="Підпишіть декларацію онлайн або завітайте до клініки і дозвольте нам дбати про вас." />
                </section>

                <section className="declaration-page__services">
                    <div className="declaration-page__container">
                        <h2>ЯКІ ПОСЛУГИ ВИ ОТРИМУЄТЕ БЕЗКОШТОВНО?</h2>

                        <div className="declaration-page__services-grid">
                            {freeServices.map((service) => (
                                <article
                                    className="declaration-page__service-card"
                                    key={service.title}
                                >
                                    <h3>{service.title}</h3>
                                    <ul>
                                        {service.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    className="declaration-page__contact"
                    id="declaration-form"
                >
                    <ContactForm />
                </section>
            </main>
            <Footer />
        </div>
    );
}
