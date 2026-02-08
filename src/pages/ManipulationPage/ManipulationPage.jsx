import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import Footer from "../../components/Footer/Footer";
import "./ManipulationPage.css";

export default function ManipulationPage() {
    return (
        <>
            <main className="manipulation-page">
                {/* HERO */}
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
                />

                {/* TEXT */}
                <section className="manipulation-intro">
                    <div className="manipulation-container">
                        <p>
                            Уколи, перев’язки, крапельниці та інші маніпуляційні
                            процедури — це важлива частина лікування та
                            профілактики захворювань. Деякі з них можна
                            виконувати вдома, але без медичної підготовки та
                            стерильних умов це може бути небезпечно.
                        </p>
                        <p>
                            Ми рекомендуємо проводити всі маніпуляції в умовах
                            клініки — де є досвідчені медсестри, стерильне
                            обладнання й контроль лікаря.
                        </p>
                    </div>
                </section>

                {/* LIST */}
                <section className="manipulation-list">
                    <div className="manipulation-container card">
                        <h2>МИ ВИКОНУЄМО</h2>

                        <ul>
                            <li>
                                <strong>Інʼєкції</strong>
                                <span>
                                    (внутрішньомʼязові, підшкірні,
                                    внутрішньовенні)
                                </span>
                            </li>
                            <li>
                                <strong>Вакцинацію</strong>
                                <span>(планові щеплення, грип, ВПЛ)</span>
                            </li>
                            <li>
                                <strong>
                                    Лікувальні та профілактичні процедури
                                </strong>
                                <span>(за призначенням лікаря)</span>
                            </li>
                            <li>
                                <strong>Постановку крапельниць</strong>
                                <span>(внутрішньовенні інфузії)</span>
                            </li>
                            <li>
                                <strong>Обробку ран</strong>
                                <span>(опіки, пролежні, інфіковані рани)</span>
                            </li>
                            <li>
                                <strong>Зняття швів та перевʼязки</strong>
                                <span>(післяопераційний догляд)</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* SAFETY */}
                <section className="manipulation-safety">
                    <div className="manipulation-container">
                        <h2>ГАРАНТІЯ БЕЗПЕКИ</h2>

                        <div className="safety-grid">
                            <article className="safety-card">
                                <img src="/icons/safety-sterile.svg" alt="" />
                                <h3>Безпека та стерильність</h3>
                                <p>
                                    Використовуємо стерильні одноразові системи
                                </p>
                            </article>

                            <article className="safety-card">
                                <img src="/icons/safety-staff.svg" alt="" />
                                <h3>Кваліфікований персонал</h3>
                                <p>
                                    Процедури виконують досвідчені медичні
                                    сестри
                                </p>
                            </article>

                            <article className="safety-card">
                                <img src="/icons/safety-control.svg" alt="" />
                                <h3>Контроль стану</h3>
                                <p>
                                    Під час і після маніпуляції фіксуються
                                    основні показники
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                {/* CONTACTS */}
                <section
                    id="manipulation-contacts"
                    className="manipulation-contacts"
                >
                    <div className="manipulation-container">
                        <h2>ЗАПИС НА ПРОЦЕДУРУ</h2>
                        <p>
                            зателефонуйте у зручну для вас філію, наш
                            адміністратор підбере час і оформить запис
                        </p>

                        <div className="contacts-grid">
                            <div>
                                <p>
                                    <strong>бульвар Слави, 8</strong>
                                </p>
                                <p>+380997654321</p>
                                <p>ПН–ПТ: 9:00 – 17:00</p>
                            </div>
                            <div>
                                <p>
                                    <strong>
                                        просп. Б. Хмельницького, 127
                                    </strong>
                                </p>
                                <p>+380997654321</p>
                                <p>ПН–ПТ: 9:00 – 17:00</p>
                            </div>
                            <div>
                                <p>
                                    <strong>вул. Д. Галицького, 34</strong>
                                </p>
                                <p>+380997654321</p>
                                <p>ПН–ПТ: 9:00 – 17:00</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
