import ContactForm from "../../components/ContactForm/ContactForm";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import "./AirAlertPage.css";

export default function AirAlertPage() {
    return (
        <div className="air-alert-page">
            <main className="air-alert-page__main">
                <section className="air-alert-page__intro">
                    <div className="air-alert-page__container">
                        <Breadcrumbs
                            className="air-alert-page__crumbs"
                            ariaLabel="Breadcrumb"
                            items={[
                                { label: "Головна", to: "/" },
                                { label: "Правила повітряної тривоги" },
                            ]}
                        />

                        <h1>Правила поведінки під час повітряної тривоги</h1>
                    </div>
                </section>

                <section className="air-alert-page__content">
                    <div className="air-alert-page__container">
                        <p className="air-alert-page__lead">
                            У разі сигналу «Повітряна тривога» в медичних
                            центрах «Для людей» просимо дотримуватися
                            встановлених правил безпеки.
                        </p>

                        <section className="air-alert-page__block">
                            <p>
                                Оповіщення про тривогу здійснюється через
                                сирени, а також дублюється у соціальних мережах
                                і мобільних застосунках.
                            </p>
                        </section>

                        <section className="air-alert-page__block">
                            <p>
                                У разі надходження сигналу «Повітряна тривога»
                                просимо:
                            </p>
                            <ul>
                                <li>
                                    пройти до найближчого тимчасового укриття;
                                </li>
                                <li>
                                    перебувати в укритті до сигналу «Відбій
                                    повітряної тривоги».
                                </li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <p>
                                Адреси укриттів можна переглянути на{" "}
                                <a
                                    href="https://dniprorada.gov.ua/uk/page/ukrittya-nashogo-mista"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    сайті місцевої ради
                                </a>
                                .
                            </p>
                        </section>

                        <section className="air-alert-page__block">
                            <p>
                                На період повітряної тривоги робота медичного
                                центру тимчасово припиняється. Прийом пацієнтів
                                відновлюється після сигналу «Відбій повітряної
                                тривоги».
                            </p>
                        </section>

                        <section className="air-alert-page__block">
                            <p>
                                Адміністрація центру не несе відповідальності за
                                недотримання правил безпеки та можливі наслідки.
                            </p>
                        </section>

                        <p className="air-alert-page__thanks">
                            Дякуємо за розуміння
                        </p>
                        <p className="air-alert-page__sign">
                            Адміністрація МЦ «Для людей».
                        </p>
                    </div>
                </section>

                <section className="air-alert-page__contact">
                    <ContactForm
                        title="МИ ЗАВЖДИ ПОРУЧ, ЩОБ ДОПОМОГТИ"
                        smallTitle="ПОРУЧ, ЩОБ ДОПОМОГТИ"
                        subtitle="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                        formType="Форма: Правила повітряної тривоги"
                    />
                </section>
            </main>
        </div>
    );
}
