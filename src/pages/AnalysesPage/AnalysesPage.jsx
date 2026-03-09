import { useEffect, useState } from "react";
import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import InfoGridSection from "../../components/InfoGridSection/InfoGridSection";
import FAQSection from "../../sections/FaqSection";
import ContactForm from "../../components/ContactForm/ContactForm";
import ServicesIntroText from "../../components/ServicesIntroText/ServicesIntroText";
import SeoHead from "../../components/Seo/SeoHead";
import { getStaticSeo } from "../../seo/seoConfig";
import "./AnalysesPage.css";

const recommendationItems = [
    "здавати аналізи вранці натщесерце",
    "не їсти 8–12 годин",
    "уникати алкоголю та жирної їжі",
    "обмежити фізичні навантаження",
    "не палити за 2–3 години",
    "повідомити про ліки",
];

const analysesFaqs = [
    {
        question: "Де перевірити результати аналізів онлайн?",
        answer: [
            <>
                Результати доступні онлайн через чат-боти лабораторії за{" "}
                <a
                    href="https://vitalab.com.ua/qr-code"
                    target="_blank"
                    rel="noreferrer"
                >
                    посиланням
                </a>
                .
            </>,
        ],
    },
    {
        question: "Як підготуватися до аналізу крові?",
        answer: [
            "Аналіз крові чутливий до зовнішніх факторів, тому важливо:",
            "• здавати натщесерце (не раніше ніж через 8 годин після їжі)",
            "• напередодні не вживати жирну їжу, багато солодкого та каву",
            "• за 24 години уникати сильних фізичних навантажень",
            "• не приймати ліки перед процедурою (лише після узгодження з лікарем)",
            "• за 30 хвилин до забору посидіти спокійно, без поспіху й хвилювання",
            "",
            "Для гормональних або біохімічних досліджень можуть діяти додаткові обмеження.",
        ],
    },
    {
        question: "Як підготуватися до аналізу сечі?",
        answer: [
            "Щоб отримати коректний результат:",
            "• провести гігієну перед збором",
            "• використовувати стерильний контейнер",
            "• зібрати першу ранкову порцію сечі",
            "• не приймати сечогінні засоби перед дослідженням",
            "• не вживати продукти, що змінюють колір сечі (буряк, морква)",
            "",
            "Для добового аналізу сеча збирається протягом 24 годин згідно з правилами лабораторії.",
        ],
    },
    {
        question: "Як підготуватися до аналізу калу?",
        answer: [
            "Загальні рекомендації:",
            "• харчуватися у звичному режимі",
            "• за 3–5 днів (за можливості) не приймати антибіотики та пробіотики",
            "• не використовувати проносні засоби та ректальні свічки",
            "• збирати матеріал у стерильний контейнер",
            "• доставити зразок у лабораторію якнайшвидше",
            "",
            "Залежно від мети (інфекції, прихована кров, мікрофлора) підхід може відрізнятися",
        ],
    },
    {
        question: "Як підготуватися до аналізів на гормони?",
        answer: [
            "Гормональні показники залежать від стану організму, тому:",
            "• здавати аналіз вранці та натщесерце",
            "• уникати емоційного та фізичного перенапруження",
            "• жінкам уточнити, на який день циклу потрібно здавати конкретний гормон",
            "• інколи потрібно відмовитися від алкоголю та нікотину за 48 годин (залежить від тесту)",
        ],
    },
    {
        question: "О котрій годині відбувається забір аналізів?",
        answer: [
            "Забір аналізів проводиться в ранкові години. Точний час можна уточнити у реєстратурі вашої філії.",
        ],
    },
    {
        question: "Які аналізи можна здати безкоштовно за декларацією?",
        answer: [
            "Якщо у вас підписана декларація з одним із наших лікарів, то згідно програми медичних гарантій, ви можете отрмати безкоштовно наступні дослідження:",
            "• Загальний аналіз крові з лейкоцитарною формулою",
            "• Загальний аналіз сечі",
            "• Глюкоза крові",
            "• Загальний холестерин",
        ],
    },
];

const PAGE_SEO = getStaticSeo("analyses");
const MOBILE_BREAKPOINT = 768;

const isMobileViewport = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
};

export default function AnalysesPage() {
    const [isMobileFormHeading, setIsMobileFormHeading] =
        useState(isMobileViewport);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT}px)`,
        );

        const handleMediaQueryChange = (event) => {
            setIsMobileFormHeading(event.matches);
        };

        setIsMobileFormHeading(mediaQuery.matches);

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleMediaQueryChange);
            return () =>
                mediaQuery.removeEventListener(
                    "change",
                    handleMediaQueryChange,
                );
        }

        mediaQuery.addListener(handleMediaQueryChange);
        return () => mediaQuery.removeListener(handleMediaQueryChange);
    }, []);

    return (
        <div className="analyses-page">
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/analyses"
            />
            <main className="analyses-page__main">
                <ServicesCardHero
                    title="АНАЛІЗИ У ДНІПРІ"
                    subtitle="Точна лабораторна діагностика"
                    icon="/icons/service-tests.svg"
                    image="/images/analyses-hero.jpg"
                    crumbs={[
                        { label: "Головна", to: "/" },
                        { label: "Послуги", to: "/services" },
                        { label: "Аналізи" },
                    ]}
                    buttonText="Записатися на аналізи"
                    buttonHref="#analyses-contact"
                    buttonClassName="arrow-down"
                />

                <ServicesIntroText>
                    <p>
                        У нашому медичному центрі ви можете здати аналізи
                        безоплатно (для пацієнтів із декларацією) або за власною
                        потребою — за направленням лікаря чи за вашим запитом.
                        Ми виконуємо широкий спектр лабораторних досліджень для
                        точної діагностики та контролю стану здоров’я. Повний
                        перелік доступних аналізів і актуальні умови можна
                        уточнити у адміністратора.
                    </p>
                </ServicesIntroText>

                <InfoGridSection
                    type="analyses"
                    className="analyses-page__recommendation"
                    rightTitle="Для точних результатів:"
                    rightItems={recommendationItems}
                    imageSrc="/images/analysesInfo.jpg"
                    imageAlt="Лабораторна діагностика в медичному центрі Для Людей, Дніпро"
                />

                <section className="analyses-page__faq">
                    <FAQSection
                        title="НАЙБІЛЬШ ПОШИРЕНІ ЗАПИТАННЯ"
                        faqs={analysesFaqs}
                    />
                </section>

                <section
                    id="analyses-contact"
                    className="analyses-page__contact"
                >
                    <ContactForm
                        title="ПОТРІБНО ЗАПИСАТИСЯ?"
                        subtitle={
                            isMobileFormHeading
                                ? "ЗАЛИШТЕ ЗАЯВКУ"
                                : "ЗАЛИШТЕ ЗАЯВКУ — МИ ЗВ’ЯЖЕМОСЯ З ВАМИ"
                        }
                        formType="Форма: запис на аналіз"
                    />
                </section>
            </main>
        </div>
    );
}
