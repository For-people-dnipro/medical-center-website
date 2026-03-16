import Button from "../../components/Button/Button";
import ContactForm from "../../components/ContactForm/ContactForm";
import InfoGridSection from "../../components/InfoGridSection/InfoGridSection";
import SeoHead from "../../components/Seo/SeoHead";
import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import ServicesIntroText from "../../components/ServicesIntroText/ServicesIntroText";
import { getStaticSeo } from "../../seo/seoConfig";
import "./Screening40Page.css";

const PAGE_SEO = getStaticSeo("screening40");

const screeningBenefits = [
    "Допомагає вчасно виявити зміни, які можуть не мати виражених симптомів на ранньому етапі.",
    "Дає зрозумілий маршрут подальших дій: профілактика, контроль у динаміці або консультація вузького спеціаліста.",
    "Зменшує ризик відкладати важливі перевірки здоров’я на потім.",
];

const screeningAudience = [
    "тим, хто давно не проходив профілактичні огляди або базові аналізи;",
    "людям із підвищеним тиском, коливаннями ваги, втомою або зниженням енергії;",
    "тим, у кого є сімейна історія серцево-судинних, ендокринних чи метаболічних захворювань;",
];

const screeningIncludedBase = [
    "консультація лікаря первинної ланки або терапевта;",
    "збір анамнезу, оцінка факторів ризику, вимірювання артеріального тиску та базових показників;",
    "загальний аналіз крові та загальний аналіз сечі;",
    "глюкоза, ліпідний профіль і базові біохімічні показники;",
    "ЕКГ та первинні рекомендації за результатами;",
];

const screeningIncludedExtra = [
    "УЗД окремих органів або систем за показаннями;",
    "розширені лабораторні показники для оцінки обміну речовин;",
    "консультації суміжних спеціалістів після первинного огляду;",
    "персональний план профілактики, контролю та повторного спостереження;",
];

export default function Screening40Page() {
    const handleScrollToForm = (event) => {
        event.preventDefault();
        const target = document.querySelector("#screening-40-form");

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="screening-40-page">
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/screening-40-plus"
            />
            <main className="screening-40-page__main">
                <ServicesCardHero
                    title="СКРИНІНГ 40+ У ДНІПРІ"
                    subtitle="Планова перевірка здоров’я, коли важливі системність і профілактика"
                    icon="/icons/service-checkup.svg"
                    image="/images/package-services.jpg"
                    crumbs={[
                        { label: "Головна", to: "/" },
                        { label: "Послуги", to: "/services" },
                        { label: "Скринінг 40+" },
                    ]}
                    buttonText="Записатися на скринінг"
                    buttonHref="#screening-40-form"
                    buttonClassName="arrow-down"
                    buttonOnClick={handleScrollToForm}
                />

                <ServicesIntroText>
                    <p>
                        Скринінг 40+ створений для тих, хто хоче не чекати на
                        симптоми, а регулярно перевіряти ключові показники
                        здоров’я. Після 40 років профілактичні обстеження
                        допомагають краще контролювати серцево-судинні,
                        метаболічні та загальні ризики, щоб вчасно реагувати на
                        зміни й зберігати якість життя.
                    </p>
                </ServicesIntroText>

                <InfoGridSection
                    type="vaccination"
                    className="screening-40-page__info-section"
                    leftTitle="ПЕРЕВАГИ СКРИНІНГУ"
                    leftItems={screeningBenefits}
                    rightTitle="КОМУ ВАРТО ЗАПЛАНУВАТИ"
                    rightItems={screeningAudience}
                />

                <InfoGridSection
                    type="vaccination"
                    className="screening-40-page__info-section screening-40-page__info-section--compact"
                    leftTitle="ЩО ВХОДИТЬ ДО БАЗОВОЇ ПРОГРАМИ"
                    leftItems={screeningIncludedBase}
                    rightTitle="ЩО МОЖЕМО ДОДАТИ ЗА ПОКАЗАННЯМИ"
                    rightItems={screeningIncludedExtra}
                />

                <section className="screening-40-page__cta">
                    <div className="screening-40-page__container">
                        <div className="screening-40-page__cta-card">
                            <div className="screening-40-page__cta-content">
                                <h2>ГОТОВІ ЗАПЛАНУВАТИ СКРИНІНГ?</h2>
                                <p>
                                    Залиште заявку, і ми допоможемо обрати
                                    зручну філію, формат обстеження та наступні
                                    кроки саме для вас.
                                </p>
                            </div>

                            <Button
                                href="#screening-40-form"
                                className="screening-40-page__cta-button"
                                onClick={handleScrollToForm}
                            >
                                Записатися на консультацію
                            </Button>
                        </div>
                    </div>
                </section>

                <section
                    id="screening-40-form"
                    className="screening-40-page__form-section"
                >
                    <ContactForm
                        title="ЗАПИШІТЬСЯ НА СКРИНІНГ 40+"
                        subtitle="МИ ДОПОМОЖЕМО ОБРАТИ ЗРУЧНИЙ МАРШРУТ"
                        formType="Форма: Скринінг 40+"
                        buttonText="Надіслати заявку"
                        fields={{
                            name: true,
                            phone: true,
                            email: false,
                            branch: true,
                            diagnostic: false,
                            checkupName: false,
                            message: true,
                        }}
                        labels={{
                            name: "Імʼя *",
                            phone: "Номер телефону *",
                            branch: "Оберіть філію *",
                            message: "Коментар або запит *",
                            consent:
                                "Даю згоду на збір та обробку персональних даних",
                        }}
                        placeholders={{
                            name: "Ваше імʼя",
                            phone: "Ваш номер телефону",
                            message:
                                "Напишіть, що важливо врахувати для запису або консультації",
                        }}
                    />
                </section>
            </main>
        </div>
    );
}
