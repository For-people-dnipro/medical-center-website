import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import Footer from "../../components/Footer/Footer";
import ServicesPriceSection from "../../components/ServicesPriceSection/ServicesPriceSection";
import "./ManipulationPage.css";

export default function ManipulationPage() {
    return (
        <>
            <main className="manipulation-page">
                <ServicesCardHero
                    title="МАНІПУЛЯЦІЇ"
                    subtitle="Дбайливо. Безпечно. Професійно."
                    icon="/icons/service-manipulation.svg"
                    image="/images/manipulation-hero.jpg"
                    crumbs={[
                        { label: "Головна", to: "/" },
                        { label: "Послуги", to: "/services" },
                        { label: "Маніпуляції" },
                    ]}
                    buttonText="Записатися"
                    buttonHref="#manipulation-contacts"
                    buttonClassName="arrow-down"
                />

                <section className="services-text-under-card__intro">
                    <div className="services-text-under-card__container">
                        <p>
                            Уколи, перев’язки, крапельниці та інші маніпуляції є
                            важливою частиною лікування й профілактики. Деякі
                            процедури можна виконувати вдома, однак без медичної
                            підготовки та стерильних умов це може бути
                            небезпечно. У клініці всі маніпуляції проводять
                            досвідчені медсестри з використанням стерильного
                            обладнання та під контролем лікаря — для вашої
                            безпеки, спокою й максимальної ефективності
                            лікування.
                        </p>
                    </div>
                </section>

                <section className="manipulation-list">
                    <div className="manipulation-container card">
                        <h2 className="text-heading-lg-sm">МИ ВИКОНУЄМО:</h2>
                        <ul className="manipulation-list__grid">
                            <li className="manipulation-list__item">
                                <strong className="text-list-title">
                                    Інʼєкції
                                </strong>
                                <span className="text-body-sm">
                                    (внутрішньомʼязові, підшкірні,
                                    внутрішньовенні)
                                </span>
                            </li>
                            <li className="manipulation-list__item">
                                <strong className="text-list-title">
                                    Постановку крапельниць
                                </strong>
                                <span className="text-body-sm">
                                    (внутрішньовенні інфузії)
                                </span>
                            </li>
                            <li className="manipulation-list__item">
                                <strong className="text-list-title">
                                    Вакцинацію
                                </strong>
                                <span className="text-body-sm">
                                    (планові щеплення, грип, ВПЛ)
                                </span>
                            </li>
                            <li className="manipulation-list__item">
                                <strong className="text-list-title">
                                    Обробку ран
                                </strong>
                                <span className="text-body-sm">
                                    (опіки, пролежні, інфіковані рани)
                                </span>
                            </li>
                            <li className="manipulation-list__item">
                                <strong className="text-list-title">
                                    Лікувальні та профілактичні процедури
                                </strong>
                                <span className="text-body-sm">
                                    (за призначенням лікаря)
                                </span>
                            </li>
                            <li className="manipulation-list__item">
                                <strong className="text-list-title">
                                    Зняття швів та перевʼязки
                                </strong>
                                <span className="text-body-sm">
                                    (післяопераційний догляд)
                                </span>
                            </li>
                        </ul>
                    </div>
                </section>

                <ServicesPriceSection
                    title="ЦІНИ НА МАНІПУЛЯЦІЇ"
                    endpoint="/api/service-prices"
                    page="manipulation"
                    noteText="Не знайшли потрібну маніпуляцію? Напишіть нам — ми обов’язково допоможемо."
                />

                <section className="manipulation-safety">
                    <div className="manipulation-container">
                        <h2>ГАРАНТІЯ БЕЗПЕКИ</h2>

                        <div className="safety-grid">
                            <article className="safety-card">
                                <img src="/icons/safety-sterile.svg" alt="" />
                                <h3 className="text-heading-xxs text-medium">
                                    Безпека та стерильність
                                </h3>
                                <p>
                                    Використовуємо стерильні одноразові системи
                                </p>
                            </article>

                            <article className="safety-card">
                                <img src="/icons/service-consult.svg" alt="" />
                                <h3 className="text-heading-xxs text-medium">
                                    Кваліфікований персонал
                                </h3>
                                <p>
                                    Процедури виконують досвідчені медичні
                                    сестри
                                </p>
                            </article>

                            <article className="safety-card">
                                <img src="/icons/safety-control.svg" alt="" />
                                <h3 className="text-heading-xxs text-medium">
                                    Контроль стану
                                </h3>
                                <p>
                                    Під час і після маніпуляції фіксуються
                                    основні показники
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                <section
                    id="manipulation-contacts"
                    className="manipulation-contacts"
                >
                    <div className="manipulation-container">
                        <h2>ЗАПИС НА ПРОЦЕДУРУ</h2>
                        <h3>
                            зателефонуйте у зручну для вас філію, наш
                            адміністратор підбере час і оформить запис
                        </h3>

                        <div className="contacts-grid">
                            {" "}
                            <div className="contacts-card">
                                <div className="contact-row">
                                    <img
                                        src="/icons/icon-location.svg"
                                        alt=""
                                        className="contact-icon"
                                    />
                                    <p className="contact-text text-body-lg text-medium">
                                        м. Дніпро, вул. Д. Галицького, 34
                                    </p>
                                </div>
                                <div className="contact-row">
                                    <img
                                        src="/icons/icon-clock.svg"
                                        alt=""
                                        className="contact-icon"
                                    />
                                    <p className="contact-text text-body-lg">
                                        ПН-ПТ з 9:00 до 18:00
                                    </p>
                                </div>{" "}
                                <div className="contact-row">
                                    <img
                                        src="/icons/icon-phone.svg"
                                        alt=""
                                        className="contact-icon"
                                    />
                                    <a
                                        href="tel:+380997654321"
                                        className="contact-link text-body-lg"
                                    >
                                        050-067-13-88
                                    </a>
                                </div>
                            </div>{" "}
                            <div className="contacts-card">
                                <div className="contact-row">
                                    <img
                                        src="/icons/icon-location.svg"
                                        alt=""
                                        className="contact-icon"
                                    />
                                    <p className="contact-text text-body-lg text-medium">
                                        м. Дніпро, просп. Б. Хмельницького, 127
                                    </p>
                                </div>
                                <div className="contact-row">
                                    <img
                                        src="/icons/icon-clock.svg"
                                        alt=""
                                        className="contact-icon"
                                    />
                                    <p className="contact-text text-body-lg">
                                        ПН-ПТ з 9:00 до 18:00
                                    </p>
                                </div>{" "}
                                <div className="contact-row">
                                    <img
                                        src="/icons/icon-phone.svg"
                                        alt=""
                                        className="contact-icon"
                                    />
                                    <a
                                        href="tel:+380997654321"
                                        className="contact-link text-body-lg"
                                    >
                                        050-067-22-35
                                    </a>
                                </div>
                            </div>
                            <div className="contacts-card">
                                <div className="contact-row">
                                    <img
                                        src="/icons/icon-location.svg"
                                        alt=""
                                        className="contact-icon"
                                    />
                                    <p className="contact-text text-body-lg text-medium">
                                        м. Дніпро, бульвар Слави, 8
                                    </p>
                                </div>
                                <div className="contact-row">
                                    <img
                                        src="/icons/icon-clock.svg"
                                        alt=""
                                        className="contact-icon"
                                    />
                                    <p className="contact-text text-body-lg">
                                        ПН-ПТ з 9:00 до 18:00
                                    </p>
                                </div>{" "}
                                <div className="contact-row">
                                    <img
                                        src="/icons/icon-phone.svg"
                                        alt=""
                                        className="contact-icon"
                                    />
                                    <a
                                        href="tel:+380997654321"
                                        className="contact-link text-body-lg"
                                    >
                                        066-067-00-37
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
