import { useEffect, useRef } from "react";
import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";
import FAQSection from "../../sections/FaqSection";
import "./VaccinationPage.css";
import VaccinesStaticSection from "../../components/VaccinesStaticSection/VaccinesStaticSection";
import VaccinationStandardsCarousel from "../../components/VaccinationStandardsCarousel/VaccinationStandardsCarousel";
import SeoHead from "../../components/Seo/SeoHead";
import { getStaticSeo } from "../../seo/seoConfig";

const vaccinationFaqs = [
    {
        question: "Чи потрібна консультація лікаря перед вакцинацією?",
        answer: [
            "Так. Перед щепленням лікар проводить короткий огляд, уточнює скарги та загальний стан здоров'я, щоб переконатися у відсутності протипоказань.",
        ],
    },
    {
        question: "Що робити, якщо потрібної вакцини немає у переліку?",
        answer: [
            "Якщо ви не знайшли необхідну вакцину у списку, зверніться до нас. За потреби ми допоможемо з індивідуальним замовленням рідкісних або специфічних вакцин.",
        ],
    },
    {
        question:
            "Чи можна зробити щеплення вакцинами, які не входять до Національного календаря?",
        answer: [
            "Так. У наших філіях доступні вакцини, які не входять до Національного календаря щеплень. Наприклад, проти вірусу папіломи людини або менінгококової інфекції, а також їх сучасні аналоги.",
        ],
    },
    {
        question: "Чи можна обрати вакцину іншого виробника?",
        answer: [
            "Так, пацієнти можуть обрати вакцини різних виробників.Зокрема доступні сучасні або багатокомпонентні варіанти (наприклад, ацелюлярний кашлюк замість цільноклітинного).",
        ],
    },
    {
        question: "У чому перевага сучасних багатокомпонентних вакцин?",
        answer: [
            "Такі вакцини:",
            "- знижують ризик небажаних реакцій.",
            "- забезпечують захист одразу від 6–7 збудників.",
            "- дозволяють зменшити кількість ін'єкцій, що особливо важливо для дітей раннього віку.",
        ],
    },
];

const vaccinationOfferItems = [
    "планові дитячі щеплення",
    "ревакцинацію",
    "вакцинацію перед подорожами",
    "сезонні щеплення (наприклад, проти грипу)",
];

const PAGE_SEO = getStaticSeo("vaccination");

export default function VaccinationPage() {
    const pageRef = useRef(null);
    const stepsSectionRef = useRef(null);
    const timelineSequenceStartedRef = useRef(false);

    const handleScrollToForm = (event) => {
        event.preventDefault();
        const target = document.querySelector("#vaccination-contact-form");

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    useEffect(() => {
        const pageNode = pageRef.current;

        if (!pageNode) {
            return;
        }

        const revealBlocks = pageNode.querySelectorAll("[data-reveal='true']");

        if (revealBlocks.length === 0) {
            return;
        }

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
            revealBlocks.forEach((block) => block.classList.add("is-visible"));
            return;
        }

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.2,
                rootMargin: "0px 0px -10% 0px",
            },
        );

        revealBlocks.forEach((block) => {
            revealObserver.observe(block);
        });

        return () => revealObserver.disconnect();
    }, []);

    useEffect(() => {
        const stepsNode = stepsSectionRef.current;

        if (!stepsNode) {
            return;
        }

        const timelineSteps = stepsNode.querySelectorAll(".js-timeline-step");
        const timelineNodes = stepsNode.querySelectorAll(".js-timeline-node");
        const timers = [];

        if (timelineSteps.length === 0 || timelineNodes.length === 0) {
            return;
        }

        stepsNode.classList.add("timeline-sequence-enabled");

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
            timelineSteps.forEach((step, index) => {
                step.classList.add("is-active");
                timelineNodes[index]?.classList.add("is-active");
            });
            return;
        }

        const timelineObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (
                        !entry.isIntersecting ||
                        timelineSequenceStartedRef.current
                    ) {
                        return;
                    }

                    timelineSequenceStartedRef.current = true;

                    timelineSteps.forEach((step, index) => {
                        const delay = index * 300;
                        const timerId = window.setTimeout(() => {
                            step.classList.add("is-active");
                            timelineNodes[index]?.classList.add("is-active");
                        }, delay);

                        timers.push(timerId);
                    });

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.35,
                rootMargin: "0px 0px -12% 0px",
            },
        );

        timelineObserver.observe(stepsNode);

        return () => {
            timelineObserver.disconnect();
            timers.forEach((timerId) => window.clearTimeout(timerId));
        };
    }, []);

    return (
        <>
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/vaccination"
            />
            <main className="vaccination-page" ref={pageRef}>
                <ServicesCardHero
                    title="ВАКЦИНАЦІЯ У ДНІПРІ"
                    subtitle="Прояв турботи про себе та близьких"
                    icon="/icons/service-vaccine.svg"
                    image="/images/vaccination-hero.jpg"
                    crumbs={[
                        { label: "Головна", to: "/" },
                        { label: "Послуги", to: "/services" },
                        { label: "Вакцинація" },
                    ]}
                    buttonText="Записатися"
                    buttonHref="#vaccination-contact-form"
                    buttonClassName="arrow-down"
                    buttonOnClick={handleScrollToForm}
                />
                {/* <section className="services-text-under-card__intro">
                    <div className="services-text-under-card__container">
                        <p>
                            Вакцинація допомагає захистити себе і своїх рідних
                            від серйозних захворювань, зміцнює імунітет і дає
                            спокій за здоров’я родини. У нашій клініці щеплення
                            проводяться у комфортних умовах, з увагою і
                            турботою. Ми використовуємо лише перевірені
                            сертифіковані вакцини, дотримуємось усіх стандартів
                            зберігання та контролю якості.
                        </p>
                    </div>
                </section> */}
                <section
                    className="vaccination-page__steps scroll-reveal timeline-sequence-enabled"
                    data-reveal="true"
                    ref={stepsSectionRef}
                >
                    <div className="vaccination-page__container">
                        <div className="vaccination-page__steps-intro">
                            <p className="vaccination-page__steps-eyebrow">
                                БЕЗПЕЧНО • ПРОФЕСІЙНО • ПІД КОНТРОЛЕМ
                            </p>
                            <h2 className="vaccination-page__steps-title">
                                <span className="vaccination-page__steps-title-full">
                                    БЕЗПЕЧНА ВАКЦИНАЦІЯ — КРОК ЗА КРОКОМ
                                </span>
                                <span className="vaccination-page__steps-title-short">
                                    Безпечна вакцинація
                                </span>
                            </h2>
                            <p className="vaccination-page__steps-description">
                                Ми працюємо відповідно до чітких медичних
                                протоколів та міжнародних стандартів безпеки.
                                Кожен етап організований так, щоб забезпечити
                                максимальну безпеку та комфорт на кожному етапі.
                            </p>
                        </div>

                        <div className="vaccination-page__timeline-wrapper">
                            <svg
                                className="vaccination-page__timeline-line"
                                viewBox="0 0 1200 420"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M13 205
C80 300 190 305 255 260
S410 225 510 265
S670 295 760 130
S900 20 986 3"
                                    fill="none"
                                    stroke="var(--color-primary)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    filter="url(#timeline-shadow)"
                                />
                            </svg>

                            <span className="vaccination-page__timeline-node vaccination-page__timeline-node--1 js-timeline-node" />
                            <span className="vaccination-page__timeline-node vaccination-page__timeline-node--2 js-timeline-node" />
                            <span className="vaccination-page__timeline-node vaccination-page__timeline-node--3 js-timeline-node" />

                            <article className="vaccination-page__timeline-step vaccination-page__timeline-step--1 js-timeline-step">
                                <span
                                    className="vaccination-page__timeline-step-bg"
                                    aria-hidden="true"
                                >
                                    1
                                </span>
                                <h3>ПОПЕРЕДНІЙ ОГЛЯД У ЛІКАРЯ</h3>
                                <p>
                                    Спеціальна підготовка не потрібна —
                                    достатньо пройти огляд і взяти карту
                                    щеплень. Лікар перевірить стан здоров’я та
                                    оформить згоду.
                                </p>
                            </article>

                            <article className="vaccination-page__timeline-step vaccination-page__timeline-step--2 js-timeline-step">
                                <span
                                    className="vaccination-page__timeline-step-bg"
                                    aria-hidden="true"
                                >
                                    2
                                </span>
                                <h3>ПРОВЕДЕННЯ ЩЕПЛЕННЯ</h3>
                                <p>
                                    Вакцинацію проводить досвідчений медичний
                                    персонал у стерильних умовах із
                                    використанням сертифікованих матеріалів.
                                </p>
                            </article>

                            <article className="vaccination-page__timeline-step vaccination-page__timeline-step--3 js-timeline-step">
                                <span
                                    className="vaccination-page__timeline-step-bg"
                                    aria-hidden="true"
                                >
                                    3
                                </span>
                                <h3>ПІСЛЯ ВАКЦИНАЦІЇ</h3>
                                <p>
                                    Рекомендуємо залишатись у клініці близько 30
                                    хвилин для контролю реакції організму. За
                                    потреби наші фахівці одразу нададуть
                                    допомогу.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>{" "}
                <section className="vaccination-page__offer">
                    <div className="vaccination-page__container">
                        <div className="vaccination-page__offer-card">
                            <div className="vaccination-page__offer-content">
                                <h2 className="vaccination-page__offer-title">
                                    У НАС ВИ МОЖЕТЕ ЗРОБИТИ
                                </h2>

                                <ul className="vaccination-page__offer-list">
                                    {vaccinationOfferItems.map((item) => (
                                        <li
                                            className="vaccination-page__offer-item"
                                            key={item}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="vaccination-page__offer-media">
                                <img
                                    src="/images/vaccination-section-picture.jpg"
                                    alt="Вакцинація в медичному центрі Для Людей, Дніпро, Україна"
                                />
                            </div>
                        </div>
                    </div>
                </section>{" "}
                <VaccinesStaticSection />
                <VaccinationStandardsCarousel />
                <section className="vaccination-visit">
                    <div className="vaccination-visit__container">
                        <h2 className="vaccination-visit__title">
                            ВИЇЗНА ВАКЦИНАЦІЯ
                        </h2>

                        <p className="vaccination-visit__text">
                            Ми розуміємо, як важко знайти час на медичні
                            процедури у щільному графіку. Саме тому пропонуємо
                            виїзну вакцинацію - зручний спосіб подбати про
                            здоров'я колективу, учнів або великої родини без
                            відвідування клініки. Ми дбаємо про безпеку та
                            комфорт кожного пацієнта. Перед щепленням лікар
                            проводить короткий огляд, пояснює всі деталі та
                            відповідає на запитання.
                        </p>

                        <div className="vaccination-visit__grid">
                            <article className="vaccination-visit__card">
                                <h3 className="vaccination-visit__card-title">
                                    НАША КОМАНДА ПРИЙДЕ ДО ВАС З УСІМ НЕОБХІДНИМ
                                </h3>

                                <ul className="vaccination-visit__list">
                                    <li>із сертифікованими вакцинами</li>
                                    <li>зі стерильними інструментами</li>
                                    <li>
                                        з холодильним обладнанням для
                                        правильного зберігання та
                                        транспортування препаратів
                                    </li>
                                    <li>
                                        з повним пакетом документів і медичним
                                        супроводом
                                    </li>
                                </ul>
                            </article>

                            <article className="vaccination-visit__card vaccination-visit__card--border">
                                <h3 className="vaccination-visit__card-title">
                                    ЦЕ РІШЕННЯ ІДЕАЛЬНО ПІДХОДИТЬ ДЛЯ
                                </h3>

                                <ul className="vaccination-visit__list">
                                    <li>
                                        компаній, які дбають про здоров'я
                                        співробітників
                                    </li>
                                    <li>
                                        навчальних закладів, що організовують
                                        вакцинацію для дітей та педагогів
                                    </li>
                                    <li>
                                        великих родин або громадських
                                        організацій
                                    </li>
                                </ul>
                            </article>
                        </div>
                    </div>
                </section>
                <section className="vaccination-page__records">
                    <div className="vaccination-page__container">
                        <h3>
                            МИ ДБАЄМО, ЩОБ ВАША МЕДИЧНА ІНФОРМАЦІЯ БУЛА ПОВНОЮ,
                            ТОЧНОЮ ТА ДОСТУПНОЮ.
                        </h3>
                        <p>
                            Всі вакцинації, проведені нашими лікарями,
                            обов'язково вносяться до електронної системи охорони
                            здоров'я (ЕСОЗ). Це гарантує, що у вашій медкартці
                            зберігаються точні дати щеплень, назви вакцин і
                            серії препаратів. За потреби інформація дублюється у
                            карту профілактичних щеплень, затверджену МОЗ. Ви
                            можете переглядати всю історію вакцинацій у своєму
                            кабінеті в HELSI (Медкарта → Вакцинації). Тож усі
                            потрібні дані завжди доступні у зручному для вас
                            форматі.
                        </p>
                    </div>
                </section>
                <FAQSection
                    title="НАЙБІЛЬШ ПОШИРЕНІ ЗАПИТАННЯ"
                    faqs={vaccinationFaqs}
                />
                <section
                    id="vaccination-contact-form"
                    className="vaccination-page__contact"
                >
                    <ContactForm
                        title="ЗАПИШІТЬСЯ НА ВАКЦИНАЦІЮ"
                        subtitle="ПОДБАЙТЕ ПРО БЕЗПЕКУ СВОЄЇ РОДИНИ ВЖЕ СЬОГОДНІ"
                        formType="Вакцинація"
                        fields={{
                            name: true,
                            phone: true,
                            diagnostic: true,
                            email: false,
                            branch: false,
                            message: true,
                        }}
                        labels={{
                            name: "Ім'я *",
                            phone: "Номер телефону *",
                            diagnostic:
                                "Назва вакцини та необхідна кількість *",
                            message: "Повідомлення *",
                            consent:
                                "Даю згоду на збір та обробку персональних даних",
                        }}
                        detailsLabels={{
                            diagnostic: "Назва вакцини та кількість",
                        }}
                        placeholders={{
                            name: "Ваше ім'я",
                            phone: "Ваш номер телефону",
                            diagnostic: "Введіть назву вакцини та кількість",
                            message: "Що вас турбує?",
                        }}
                    />
                </section>
            </main>
        </>
    );
}
