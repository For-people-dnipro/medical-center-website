import { useLayoutEffect, useRef, useState } from "react";
import ContactForm from "../../components/ContactForm/ContactForm";
import SeoHead from "../../components/Seo/SeoHead";
import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import ServicesIntroText from "../../components/ServicesIntroText/ServicesIntroText";
import useTabsUnderline from "../../hooks/useTabsUnderline";
import { getStaticSeo } from "../../seo/seoConfig";
import { scrollToSelectorWithOffset } from "../../lib/smoothScroll";
import "./Screening40Page.css";

const PAGE_SEO = getStaticSeo("screening40");

const screeningOverviewCards = [
    {
        title: "Медичний огляд",
        items: [
            "Вимірювання артеріального тиску, частоти серцевих скорочень, ваги, зросту та окружності талії  для оцінки основних показників здоров’я.",
        ],
    },
    {
        title: "Оцінка ризиків",
        items: [
            "Оцінка симптомів, способу життя та факторів ризику, що можуть впливати на серце, судини та загальне самопочуття.",
        ],
    },
    {
        title: "Лабораторні аналізи",
        items: [
            "Лабораторні дослідження крові для оцінки роботи серця, судин, нирок та визначення ризику розвитку цукрового діабету.",
        ],
    },
];

const screeningDetails = [
    {
        title: "ОГЛЯД ТА ПРОФІЛАКТИКА",
        items: [
            "Вимірювання артеріального тиску та ЕКГ.",
            "Вимірювання основних показників тіла та індексу маси тіла: вага, зріст, окружність талії.",
            "Збір даних про фактори ризику.",
            "Оцінка симптомів, які можуть свідчити про проблеми з серцем або судинами: біль або дискомфорт у грудях, задишка, набряки, біль у ногах під час ходьби.",
        ],
    },
    {
        title: "АНАЛІЗИ ТА ДОСЛІДЖЕННЯ",
        items: [
            "Ліпідограма — аналіз крові на холестерин і жири, що впливають на стан судин.",
            "Глікований гемоглобін (HbA1c) — показує ризик розвитку цукрового діабету.",
        ],
    },
    {
        title: "ЗА ПОКАЗАННЯМИ",
        items: [
            "Електроліти (натрій, калій) — важливі для роботи серця.",
            "Креатинін у крові — оцінка функції нирок.",
            "Розрахунок швидкості роботи нирок (eGFR) — допомагає виявити порушення на ранніх етапах.",
            "Аналіз сечі на альбумін — показує стан судин і нирок.",
        ],
    },
    {
        title: "АНКЕТУВАННЯ ТА ШКАЛИ РИЗИКУ",
        items: [
            "SCORE2 — оцінка ризику серцево-судинних захворювань на 10 років для людей 40–69 років.",
            "SCORE2-OP — оцінка ризику для людей віком 70+.",
            "FINDRISC — оцінка ризику розвитку цукрового діабету 2 типу.",
            "PHQ-9 — допомагає виявити ознаки депресії.",
            "GAD-7 — оцінка рівня тривожності.",
            "AUDIT-C — короткий тест для оцінки вживання алкоголю.",
        ],
    },
    {
        title: "ПРОФІЛАКТИЧНЕ КОНСУЛЬТУВАННЯ",
        items: [
            "Розбір результатів обстеження та індивідуальні рекомендації щодо подальших дій.",
            "Корекція харчування, підвищення фізичної активності, контроль ваги.",
            "Контроль та обмеження вживання тютюну й алкоголю.",
        ],
    },
    {
        title: "МАРШРУТИЗАЦІЯ ТА ДОКУМЕНТАЦІЯ",
        items: [
            "Електронне направлення до інших спеціалістів у разі виявлення ризиків або захворювань.",
            "Усі результати фіксуються в електронній системі охорони здоров’я.",
        ],
    },
];

const bookingSteps = [
    {
        title: "ОФОРМІТЬ ДІЯ.КАРТКУ",
        items: [
            "Для зарахування 2 000 грн від держави на проходження скринінгу.",
            "Оформити Дія.Картку можна онлайн у застосунку «Дія», через банк-партнер або офлайн через ЦНАП.",
            "Оформлення картки може зайняти певний час, тому краще подбати про це заздалегідь.",
        ],
    },
    {
        title: "ОБЕРІТЬ МЕДИЧНИЙ ЦЕНТР «ДЛЯ ЛЮДЕЙ»",
        items: [
            <>
                Записатися можна онлайн, за телефоном або на рецепції зручної
                для вас філії, адреси філій можна переглянути{" "}
                <a
                    className="screening-40-page__inline-link"
                    href="/branches"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    за посиланням
                </a>
                .
            </>,
            "Адміністратори допоможуть підібрати комфортний час для проходження скринінгу.",
        ],
    },
    {
        title: "ПРИЙДІТЬ У ЗАПЛАНОВАНИЙ ЧАС",
        items: [
            "На рецепції вам підкажуть, які саме обстеження входять у ваш скринінг.",
            "Перелік обстежень визначається відповідно до державної програми та залежить від віку, статі, факторів ризику й медичних даних.",
            "Після скринінгу лікар пояснить результати та, за потреби, надасть рекомендації щодо подальших дій.",
        ],
    },
];

const helpfulLinks = [
    {
        href: "https://screening.moz.gov.ua",
        description: (
            <>
                Актуальні умови, роз’яснення щодо програми та корисну
                інформацію для пацієнтів можна переглянути на{" "}
                <a
                    className="screening-40-page__inline-link"
                    href="https://screening.moz.gov.ua"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    сайті Міністерства охорони здоров’я України
                </a>
                .
            </>
        ),
    },
];

const screeningInfoPanels = [
    {
        key: "included",
        label: "Що входить у скринінг?",
        description:
            "Склад програми формується відповідно до державних вимог і може уточнюватися залежно від ваших факторів ризику та медичних даних. До програми скринінгу входять такі обстеження:",
    },
    {
        key: "booking",
        label: "Як записатися на скринінг?",
        description:
            "Програма передбачає кілька простих кроків. Їх краще пройти завчасно, щоб обрати комфортну дату та швидко розпочати обстеження.",
    },
    {
        key: "links",
        label: "Корисні посилання",
        description: "",
    },
];

const SCREENING_INFO_PANEL_KEYS = screeningInfoPanels.map((panel) => panel.key);
const BOOKING_PANEL_KEY = screeningInfoPanels[1].key;
const DEFAULT_ACTIVE_PANEL_KEY = screeningInfoPanels[1].key;

export default function Screening40Page() {
    const [activePanel, setActivePanel] = useState(DEFAULT_ACTIVE_PANEL_KEY);
    const [panelHeight, setPanelHeight] = useState(null);
    const [isPanelScrollable, setIsPanelScrollable] = useState(false);
    const tabsPanelRef = useRef(null);
    const tabsPanelContentRef = useRef(null);
    const tabsScrollbarThumbRef = useRef(null);
    const bookingPanelMeasureRef = useRef(null);
    const { tabListRef, setTabRef } = useTabsUnderline({
        activeKey: activePanel,
        tabKeys: SCREENING_INFO_PANEL_KEYS,
    });

    useLayoutEffect(() => {
        const panelElement = tabsPanelRef.current;
        const contentElement = tabsPanelContentRef.current;
        const thumbElement = tabsScrollbarThumbRef.current;
        const bookingMeasureElement = bookingPanelMeasureRef.current;

        if (
            !panelElement ||
            !contentElement ||
            !thumbElement ||
            !bookingMeasureElement
        ) {
            return undefined;
        }

        const threshold = 2;
        const mobileMediaQuery = window.matchMedia("(max-width: 768px)");
        let frameId = 0;
        const resetThumb = () => {
            thumbElement.style.height = "0px";
            thumbElement.style.transform = "translateY(0px)";
        };

        const updatePanelMetrics = () => {
            if (mobileMediaQuery.matches) {
                setPanelHeight((currentHeight) =>
                    currentHeight === null ? currentHeight : null,
                );
                setIsPanelScrollable(false);
                resetThumb();
                return;
            }

            const panelStyles = window.getComputedStyle(panelElement);
            const verticalPadding =
                parseFloat(panelStyles.paddingTop) +
                parseFloat(panelStyles.paddingBottom);
            const referencePanelHeight = Math.ceil(
                bookingMeasureElement.offsetHeight + verticalPadding,
            );
            const naturalPanelHeight = Math.ceil(
                contentElement.offsetHeight + verticalPadding,
            );
            const nextHeight = Math.min(
                naturalPanelHeight,
                referencePanelHeight,
            );
            const effectiveClientHeight = nextHeight;
            const scrollTop = panelElement.scrollTop;
            const railHeight = Math.max(
                0,
                effectiveClientHeight - verticalPadding,
            );
            const hasOverflow =
                naturalPanelHeight - effectiveClientHeight > threshold;
            const scrollRange = Math.max(
                1,
                naturalPanelHeight - effectiveClientHeight,
            );

            setPanelHeight((currentHeight) =>
                currentHeight === nextHeight ? currentHeight : nextHeight,
            );
            setIsPanelScrollable((currentValue) =>
                currentValue === hasOverflow ? currentValue : hasOverflow,
            );
            const thumbHeight = hasOverflow
                ? Math.max(
                      24,
                      Math.round(
                          (railHeight / naturalPanelHeight) * railHeight * 0.85,
                      ),
                  )
                : 0;
            const maxThumbTop = Math.max(0, railHeight - thumbHeight);
            const thumbTop = hasOverflow
                ? Math.round((scrollTop / scrollRange) * maxThumbTop)
                : 0;

            thumbElement.style.height = `${thumbHeight}px`;
            thumbElement.style.transform = `translateY(${thumbTop}px)`;
        };

        const scheduleUpdate = () => {
            window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(updatePanelMetrics);
        };

        panelElement.scrollTop = 0;
        scheduleUpdate();

        const resizeObserver = new ResizeObserver(scheduleUpdate);
        resizeObserver.observe(contentElement);
        resizeObserver.observe(bookingMeasureElement);
        resizeObserver.observe(panelElement);

        panelElement.addEventListener("scroll", scheduleUpdate, {
            passive: true,
        });
        window.addEventListener("resize", scheduleUpdate);
        mobileMediaQuery.addEventListener("change", scheduleUpdate);

        return () => {
            window.cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            panelElement.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
            mobileMediaQuery.removeEventListener("change", scheduleUpdate);
        };
    }, [activePanel]);

    const handleScrollToForm = (event) => {
        event.preventDefault();
        scrollToSelectorWithOffset("#screening-40-form");
    };

    const activePanelMeta =
        screeningInfoPanels.find((panel) => panel.key === activePanel) ||
        screeningInfoPanels[0];
    const bookingPanelMeta =
        screeningInfoPanels.find((panel) => panel.key === BOOKING_PANEL_KEY) ||
        screeningInfoPanels[1];

    const renderPanelContent = (panelKey) => {
        if (panelKey === BOOKING_PANEL_KEY) {
            return (
                <div className="screening-40-page__panel-stack">
                    {bookingSteps.map((step, index) => (
                        <section
                            className="screening-40-page__panel-section screening-40-page__panel-section--step"
                            key={step.title}
                        >
                            <div className="screening-40-page__panel-step-top">
                                <span className="screening-40-page__panel-step-number">
                                    {index + 1}.
                                </span>
                                <h4>{step.title}</h4>
                            </div>

                            <ul>
                                {step.items.map((item, itemIndex) => (
                                    <li key={`${step.title}-${itemIndex}`}>
                                        <span className="screening-40-page__panel-step-item-text">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            );
        }

        if (panelKey === "links") {
            return (
                <div className="screening-40-page__panel-stack">
                    {helpfulLinks.map((link) => (
                        <section
                            className="screening-40-page__panel-section"
                            key={link.href}
                        >
                            <p>{link.description}</p>
                        </section>
                    ))}
                </div>
            );
        }

        return (
            <div className="screening-40-page__panel-stack">
                {screeningDetails.map((section) => (
                    <section
                        className="screening-40-page__panel-section"
                        key={section.title}
                    >
                        <h4>{section.title}</h4>
                        <ul>
                            {section.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        );
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
                    title="СКРИНІНГ ЗДОРОВ’Я 40+"
                    subtitle="Безоплатний скринінг здоров’я для людей 40+"
                    icon="/icons/service-checkup.svg"
                    image="/images/consultation.jpg"
                    crumbs={[
                        { label: "Головна", to: "/" },
                        { label: "Послуги", to: "/services" },
                        { label: "Скринінг здоров’я 40+" },
                    ]}
                    buttonText="Записатися на скринінг"
                    buttonHref="#screening-40-form"
                    buttonClassName="arrow-down"
                    buttonOnClick={handleScrollToForm}
                />

                <ServicesIntroText>
                    <p>
                        Національний скринінг здоров’я 40+ — це програма
                        профілактичних обстежень для людей віком від 40 років.
                        Вона допомагає вчасно виявити серцево-судинні
                        захворювання, цукровий діабет і порушення ментального
                        здоров’я, часто ще до появи перших симптомів. Раннє
                        обстеження дозволяє контролювати стан здоров’я та
                        запобігати розвитку ускладнень.
                    </p>
                </ServicesIntroText>

                <section className="screening-40-page__overview">
                    <div className="screening-40-page__container">
                        <h2 className="screening-40-page__section-title">
                            ЩО ВКЛЮЧАЄ СКРИНІНГ?
                        </h2>

                        <div className="screening-40-page__overview-grid">
                            {screeningOverviewCards.map((card) => (
                                <article
                                    className="screening-40-page__overview-card"
                                    key={card.title}
                                >
                                    <h3>{card.title}</h3>
                                    <ul>
                                        {card.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="screening-40-page__details">
                    <div className="screening-40-page__container">
                        <div className="screening-40-page__details-shell">
                            <div className="screening-40-page__details-header">
                                <h2 className="screening-40-page__section-title screening-40-page__section-title--centered screening-40-page__details-title">
                                    <span className="screening-40-page__details-title-main screening-40-page__details-title-main--desktop">
                                        КОРИСНА ІНФОРМАЦІЯ ПРО СКРИНІНГ 40+
                                    </span>
                                    <span className="screening-40-page__details-title-main screening-40-page__details-title-main--mobile">
                                        КОРИСНА ІНФОРМАЦІЯ
                                    </span>
                                </h2>
                            </div>

                            <div
                                className="screening-40-page__tabs"
                                role="tablist"
                                aria-label="Навігація по скринінгу 40+"
                                ref={tabListRef}
                            >
                                {screeningInfoPanels.map((panel) => {
                                    const isActive = activePanel === panel.key;

                                    return (
                                        <button
                                            key={panel.key}
                                            type="button"
                                            className={`screening-40-page__tab ${
                                                isActive ? "is-active" : ""
                                            }`}
                                            onClick={() =>
                                                setActivePanel(panel.key)
                                            }
                                            role="tab"
                                            aria-selected={isActive}
                                            aria-controls={`screening-40-panel-${panel.key}`}
                                            id={`screening-40-tab-${panel.key}`}
                                            ref={setTabRef(panel.key)}
                                        >
                                            {panel.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="screening-40-page__tabs-panel-shell">
                                <div
                                    className="screening-40-page__tabs-panel-measure"
                                    aria-hidden="true"
                                >
                                    <div
                                        className="screening-40-page__tabs-panel-content"
                                        ref={bookingPanelMeasureRef}
                                    >
                                        <div className="screening-40-page__tabs-panel-head">
                                            {bookingPanelMeta.description ? (
                                                <p>{bookingPanelMeta.description}</p>
                                            ) : null}
                                        </div>

                                        {renderPanelContent(BOOKING_PANEL_KEY)}
                                    </div>
                                </div>

                                <div
                                    className="screening-40-page__tabs-panel"
                                    role="tabpanel"
                                    id={`screening-40-panel-${activePanelMeta.key}`}
                                    aria-labelledby={`screening-40-tab-${activePanelMeta.key}`}
                                    ref={tabsPanelRef}
                                    style={
                                        panelHeight
                                            ? { height: `${panelHeight}px` }
                                            : undefined
                                    }
                                >
                                    <div
                                        className="screening-40-page__tabs-panel-content"
                                        key={activePanelMeta.key}
                                        ref={tabsPanelContentRef}
                                    >
                                        {activePanelMeta.description ? (
                                            <div className="screening-40-page__tabs-panel-head">
                                                <p>{activePanelMeta.description}</p>
                                            </div>
                                        ) : null}

                                        {renderPanelContent(activePanel)}
                                    </div>
                                </div>

                                <div
                                    className={`screening-40-page__tabs-scrollbar ${
                                        isPanelScrollable ? "is-visible" : ""
                                    }`}
                                    aria-hidden="true"
                                >
                                    <span
                                        ref={tabsScrollbarThumbRef}
                                        className="screening-40-page__tabs-scrollbar-thumb"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="screening-40-form"
                    className="screening-40-page__form-section"
                >
                    <ContactForm
                        title="ЗАПИШІТЬСЯ НА СКРИНІНГ 40+"
                        subtitle="МИ ДОПОМОЖЕМО ОБРАТИ ЗРУЧНУ ФІЛІЮ ТА ЧАС"
                        formType="Форма: Скринінг 40+"
                        buttonText="Надіслати заявку"
                        fields={{
                            name: true,
                            phone: true,
                            email: true,
                            branch: true,
                            diagnostic: false,
                            checkupName: false,
                            message: true,
                        }}
                        labels={{
                            name: "Імʼя *",
                            phone: "Номер телефону *",
                            email: "Електронна пошта",
                            branch: "Оберіть філію *",
                            message: "Коментар або запит *",
                            consent:
                                "Даю згоду на збір та обробку персональних даних",
                        }}
                        placeholders={{
                            name: "Ваше імʼя",
                            phone: "Ваш номер телефону",
                            email: "Ваша ел. пошта (за бажанням)",
                            message:
                                "Напишіть, що важливо врахувати для запису",
                        }}
                    />
                </section>
            </main>
        </div>
    );
}
