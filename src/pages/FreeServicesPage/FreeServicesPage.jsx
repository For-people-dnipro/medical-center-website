import ContactForm from "../../components/ContactForm/ContactForm";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import SeoHead from "../../components/Seo/SeoHead";
import { getStaticSeo } from "../../seo/seoConfig";
import "../AirAlertPage/AirAlertPage.css";

const PAGE_SEO = getStaticSeo("freeServices");

export default function FreeServicesPage() {
    return (
        <div className="air-alert-page">
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/free-services"
            />
            <main className="air-alert-page__main">
                <section className="air-alert-page__intro">
                    <div className="air-alert-page__container">
                        <Breadcrumbs
                            className="air-alert-page__crumbs"
                            ariaLabel="Breadcrumb"
                            items={[
                                { label: "Головна", to: "/" },
                                {
                                    label: "Перелік безкоштовних медичних послуг",
                                },
                            ]}
                        />

                        <h1>Перелік безкоштовних медичних послуг</h1>
                    </div>
                </section>

                <section className="air-alert-page__content">
                    <div className="air-alert-page__container">
                        <p className="air-alert-page__lead">
                            У медичному центрі «Для людей» пацієнти можуть
                            отримати низку медичних послуг безкоштовно,
                            відповідно до Програми медичних гарантій
                            Національної служби здоров&apos;я України (НСЗУ) та
                            чинного законодавства України.
                        </p>

                        <section className="air-alert-page__block">
                            <p>
                                Безкоштовні медичні послуги надаються пацієнтам,
                                які підписали декларацію з лікарем первинної
                                медичної допомоги у медичному центрі «Для
                                людей».
                            </p>
                            <p>
                                Нижче наведено перелік основних послуг, які
                                можуть надаватися безкоштовно.
                            </p>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>1. Консультації та огляди</h3>
                            <p>
                                Пацієнти можуть отримати безкоштовні
                                консультації та профілактичні огляди, зокрема:
                            </p>
                            <ul>
                                <li>
                                    профілактичні огляди для дорослих та дітей;
                                </li>
                                <li>
                                    контроль стану здоров&apos;я та
                                    спостереження за хронічними захворюваннями;
                                </li>
                                <li>
                                    первинну діагностику та лікування
                                    найпоширеніших захворювань.
                                </li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>2. Аналізи</h3>
                            <p>
                                До переліку безкоштовних лабораторних досліджень
                                входять:
                            </p>
                            <ul>
                                <li>
                                    загальний аналіз крові (з лейкоцитарною
                                    формулою);
                                </li>
                                <li>загальний аналіз сечі;</li>
                                <li>визначення рівня глюкози в крові;</li>
                                <li>визначення рівня холестерину.</li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>3. Діагностика</h3>
                            <p>
                                У рамках безкоштовних послуг проводяться такі
                                діагностичні процедури:
                            </p>
                            <ul>
                                <li>електрокардіограма (ЕКГ);</li>
                                <li>вимірювання артеріального тиску;</li>
                                <li>
                                    антропометричні вимірювання (вага, зріст,
                                    окружність талії).
                                </li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>4. Швидкі тести</h3>
                            <p>
                                Пацієнти можуть пройти швидке тестування на такі
                                захворювання:
                            </p>
                            <ul>
                                <li>тестування на ВІЛ;</li>
                                <li>тестування на гепатит B;</li>
                                <li>тестування на гепатит C.</li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>5. Вакцинація</h3>
                            <p>
                                У медичному центрі проводяться безкоштовні
                                профілактичні щеплення:
                            </p>
                            <ul>
                                <li>
                                    вакцинація відповідно до Національного
                                    календаря профілактичних щеплень України;
                                </li>
                                <li>
                                    оцінка стану здоров&apos;я перед проведенням
                                    вакцинації;
                                </li>
                                <li>рекомендації щодо подальших щеплень.</li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>6. Направлення</h3>
                            <p>За потреби лікар може надати пацієнту:</p>
                            <ul>
                                <li>направлення до профільних лікарів;</li>
                                <li>
                                    направлення на лабораторні та
                                    інструментальні обстеження;
                                </li>
                                <li>
                                    рекомендації щодо подальшої діагностики та
                                    лікування.
                                </li>
                            </ul>
                        </section>

                        <section className="air-alert-page__block">
                            <h3>Важливо</h3>
                            <p>
                                Безкоштовні медичні послуги надаються пацієнтам,
                                які підписали декларацію з сімейним лікарем,
                                терапевтом або педіатром у медичному центрі «Для
                                людей» відповідно до Програми медичних гарантій.
                            </p>
                            <p>
                                Обсяг безкоштовних послуг може залежати від умов
                                державної програми медичних гарантій та чинного
                                законодавства України.
                            </p>
                        </section>
                    </div>
                </section>

                <section className="air-alert-page__contact">
                    <ContactForm
                        title="МИ ЗАВЖДИ ПОРУЧ, ЩОБ ДОПОМОГТИ"
                        smallTitle="ПОРУЧ, ЩОБ ДОПОМОГТИ"
                        subtitle="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                        formType="Форма: Перелік безкоштовних медичних послуг"
                    />
                </section>
            </main>
        </div>
    );
}
