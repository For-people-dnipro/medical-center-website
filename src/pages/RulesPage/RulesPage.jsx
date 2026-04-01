import ContactForm from "../../components/ContactForm/ContactForm";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import SeoHead from "../../components/Seo/SeoHead";
import { getStaticSeo } from "../../seo/seoConfig";
import "../AirAlertPage/AirAlertPage.css";

const PAGE_SEO = getStaticSeo("rules");

export default function RulesPage() {
    return (
        <div className="air-alert-page">
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/rules"
            />
            <main className="air-alert-page__main">
                <section className="air-alert-page__intro">
                    <div className="air-alert-page__container">
                        <Breadcrumbs
                            className="air-alert-page__crumbs"
                            ariaLabel="Breadcrumb"
                            items={[
                                { label: "Головна", to: "/" },
                                { label: "Правила внутрішнього розпорядку" },
                            ]}
                        />

                        <h1>Правила внутрішнього розпорядку</h1>
                    </div>
                </section>

                <section className="air-alert-page__content">
                    <div className="air-alert-page__container">
                        <p className="air-alert-page__lead">
                            Просимо пацієнтів ознайомитися з правилами
                            внутрішнього розпорядку медичного центру «Для
                            людей» для комфортного та безпечного перебування в
                            закладі.
                        </p>

                        <section className="air-alert-page__block">
                            <h3>1. Загальні положення</h3>
                            <p>
                                Ці правила визначають порядок перебування
                                пацієнтів у медичному центрі «Для людей» та
                                спрямовані на забезпечення якісного і
                                безпечного надання медичних послуг.
                            </p>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>2. Запис на прийом</h3>
                            <ul>
                                <li>
                                    Прийом здійснюється за попереднім записом
                                    (онлайн, телефоном або на рецепції).
                                </li>
                                <li>
                                    Просимо приходити за 10–15 хвилин до
                                    прийому.
                                </li>
                                <li>
                                    У разі запізнення прийом може бути
                                    скорочений або перенесений.
                                </li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>3. Поведінка в медичному центрі</h3>
                            <ul>
                                <li>
                                    Дотримуйтесь тиші та поважайте інших
                                    пацієнтів.
                                </li>
                                <li>
                                    Виконуйте рекомендації медичного персоналу.
                                </li>
                                <li>
                                    Заборонено перебувати у стані алкогольного
                                    або наркотичного сп&apos;яніння.
                                </li>
                                <li>
                                    Заборонено паління на території закладу.
                                </li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>4. Документи та оплата</h3>
                            <ul>
                                <li>
                                    Пацієнт повинен мати документ, що посвідчує
                                    особу.
                                </li>
                                <li>
                                    Оплата послуг здійснюється згідно з чинним
                                    прайсом.
                                </li>
                                <li>
                                    Пацієнт має право отримати інформацію про
                                    вартість послуг.
                                </li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>5. Права пацієнта</h3>
                            <ul>
                                <li>Якісна та безпечна медична допомога.</li>
                                <li>Повна інформація про стан здоров&apos;я.</li>
                                <li>
                                    Конфіденційність медичної інформації.
                                </li>
                                <li>Вибір лікаря.</li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>6. Обов&apos;язки пацієнта</h3>
                            <ul>
                                <li>
                                    Надавати достовірну інформацію про стан
                                    здоров&apos;я.
                                </li>
                                <li>Виконувати рекомендації лікаря.</li>
                                <li>Дотримуватись правил центру.</li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>7. Відмова у наданні послуг</h3>
                            <p>
                                Медичний центр може відмовити у наданні послуг
                                у разі порушення правил або неадекватної
                                поведінки.
                            </p>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>8. Конфіденційність</h3>
                            <p>
                                Уся інформація про пацієнта є конфіденційною та
                                обробляється відповідно до законодавства
                                України.
                            </p>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>9. Заключні положення</h3>
                            <p>
                                Адміністрація залишає за собою право вносити
                                зміни до цих правил.
                            </p>
                        </section>
                    </div>
                </section>

                <section className="air-alert-page__contact">
                    <ContactForm
                        title="МИ ЗАВЖДИ ПОРУЧ, ЩОБ ДОПОМОГТИ"
                        smallTitle="ПОРУЧ, ЩОБ ДОПОМОГТИ"
                        subtitle="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                        formType="Форма: Правила внутрішнього розпорядку"
                    />
                </section>
            </main>
        </div>
    );
}
