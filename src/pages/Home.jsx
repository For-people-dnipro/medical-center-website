import { Suspense, lazy, useEffect, useState } from "react";
import Banner from "../components/Banner/Banner";
import DeclarationSection from "../sections/DeclarationSection";
import Ticket from "../components/Ticket/Ticket";
import SeoHead from "../components/Seo/SeoHead";
import RevealOnScroll from "../components/RevealOnScroll/RevealOnScroll";
import { fetchWithEndpointFallback } from "../api/foundation";
import { getStaticSeo } from "../seo/seoConfig";

const PAGE_SEO = getStaticSeo("home");
const ServicesSection = lazy(() => import("../sections/ServicesSection"));
const DoctorsSection = lazy(() => import("../sections/DoctorsSection"));
const BranchesSection = lazy(() => import("../sections/BranchesSections"));
const WhyChooseUsSection = lazy(() => import("../sections/WhyChooseUsSection"));
const FAQSection = lazy(() => import("../sections/FaqSection"));
const ContactForm = lazy(() => import("../components/ContactForm/ContactForm"));
const homeFaqTitle = "НАЙБІЛЬШ ПОШИРЕНІ ЗАПИТАННЯ";
const homeFaqs = [
    {
        question: "Як записатися на прийом?",
        answer: [
            "Наш медичний центр має 3 філії. Оберіть необхідну вам.",
            <>
                Записатися можна через{" "}
                <a
                    href="https://helsi.me/clinic/9eeb07ee-f563-4f3c-a969-0c08b0988635"
                    target="_blank"
                    rel="noreferrer"
                >
                    helsi.me
                </a>
                .
            </>,
            "Це достатньо швидко, без очікувань, і ви можете зробити це самостійно на комп’ютері або через мобільний додаток. Також ви можете записатися на прийом зателефонувавши на рецепцію відповідної філії.",
            "",
            "Філія №1 «Західна»",
            "м. Дніпро, вул. Данила Галицького, 3",
            "050-067-13-88",
            <>
                Сторінка для запису за{" "}
                <a
                    href="https://helsi.me/clinic/9eeb07ee-f563-4f3c-a969-0c08b0988635"
                    target="_blank"
                    rel="noreferrer"
                >
                    посиланням
                </a>
            </>,
            "",
            "",
            "Філія №2 «Б. Хмельницького»",
            "м. Дніпро, пр-т Богдана Хмельницького, 127",
            "050-067-22-35",
            <>
                Сторінка для запису за{" "}
                <a
                    href="https://helsi.me/clinic/8e66e36b-2fde-4c62-be14-11279c08349f"
                    target="_blank"
                    rel="noreferrer"
                >
                    посиланням
                </a>
            </>,
            "",
            "",
            "Філія №3 «Перемога»",
            "м. Дніпро, бульвар Слави, 8",
            "066-067-00-37",
            <>
                Сторінка для запису за{" "}
                <a
                    href="https://helsi.me/clinic/ae8e3900-38f7-43c7-bc37-44350d072819"
                    target="_blank"
                    rel="noreferrer"
                >
                    посиланням
                </a>
            </>,
        ],
    },
    {
        question: "Чи доступний мій лікар у вихідні дні?",
        answer: [
            "Сімейний лікар, як і будь-який фахівець, має право на відпочинок. У нашому медичному центрі вихідними днями є загальновизнані дні — субота та неділя, у які плановий прийом сімейного лікаря не проводиться. У разі екстреної або невідкладної ситуації необхідно звернутися до служби невідкладної (екстреної) медичної допомоги.",
        ],
    },
    {
        question: "Чи надає мій лікар особистий номер телефону?",
        answer: [
            "Надання особистого номера телефону є правом лікаря, а не його обов’язком. Лікар самостійно вирішує, який контактний номер надати пацієнту — особистий або номер контакт-центру чи рецепції медичного закладу. Навіть у разі надання особистого номера лікар визначає зручний для себе час для відповідей на дзвінки чи повідомлення. У неробочий час, уночі або під час вихідних лікар має право бути недоступним. Для звернень рекомендуємо користуватися офіційними каналами зв’язку нашого медичного центру.",
        ],
    },

    {
        question: "Чи можу звернутись до терапевта разово, без декларації?",
        answer: (
            <>
                Так, ви можете звернутися на разову консультацію до лікаря без
                декларації. Прийом здійснюється на платній основі відповідно до
                нашого прайс-листа. Актуальні ціни ви можете переглянути на
                сайті клініки або за телефоном у адміністратора клініки Для
                запису оберіть зручне для вас відділення. Записатися можна через{" "}
                <a href="https://helsi.me/" target="_blank" rel="noreferrer">
                    helsi.mi
                </a>{" "}
                або за номером телефона відповідної філії.
            </>
        ),
    },
    {
        question: "Чи можу я отримати термінову консультацію?",
        answer: [
            "Так, ми робимо все можливе, щоб допомогти вам у термінових випадках. Зателефонуйте за номером телефону вашої філії, і наш адміністратор перевірить наявність вільних вікон у графіку спеціаліста. Якщо вільного часу немає, ми запропонуємо найближчу доступну дату.",
            "",
            "Філія №1 «Західна» — 050-067-13-88",
            "",
            "Філія №2 «Б. Хмельницького» — 050-067-22-35",
            "",
            "Філія №3 «Перемога» — 066-067-00-37",
        ],
    },
    {
        question: "Чи проводите вакцинацію пацієнтам без декларації?",
        answer: "Так, ми проводимо вакцинацію без декларації. Для цього достатньо записатися на прийом у найбільш зручне для вас відділення — за телефонами, вказаними на сайті. Наші адміністратори допоможуть обрати зручний час і дадуть відповіді на всі запитання.",
    },
    {
        question:
            "На які послуги можна отримати е-направлення у свого сімейного лікаря?",
        answer: [
            "Ваш сімейний лікар, з яким у вас укладена декларація, може створити електронне направлення (е-направлення), якщо під час огляду чи консультації ви потребуєте додаткових медичних послуг. Е-направлення дає змогу отримати безоплатну медичну допомогу, гарантовану Програмою медичних гарантій, у закладах, що працюють із НСЗУ. Зокрема, е-направлення може бути виписане на:",
            "",
            "• Консультацію до лікаря-спеціаліста — наприклад, кардіолога, ендокринолога, гастроентеролога та інших вузьких спеціалістів;",
            "",
            "• Проведення лабораторних досліджень — біохімічні, імунологічні, інші аналізи крові чи іншого біоматеріалу;",
            "",
            "• Проведення візуалізаційних обстежень — рентген, УЗД, комп’ютерну чи магнітно-резонансну томографію та інші інструментальні дослідження.",
            "",
            "Е-направлення виписує лікар, коли це необхідно для оцінки стану вашого здоров’я або для уточнення діагнозу. Саме це направлення дозволяє вам звернутися за відповідною послугою до будь-якого закладу охорони здоров’я, що має контракт із НСЗУ, безоплатно (за Програмою медичних гарантій).",
        ],
    },
    {
        question:
            "Як перепідписати декларацію, якщо вона вже укладена в іншому закладі?",
        answer: "Ви можете укласти декларацію з нашим сімейним лікарем, навіть якщо раніше вона була оформлена в іншій клініці. Вам не потрібно нічого робити з попередньою декларацією — під час укладання нової декларації попередня автоматично припиняється. Оформити декларацію можна в будь-якій з наших філій.",
    },
];

function runWhenBrowserIsIdle(callback, timeout = 2200) {
    if (typeof window === "undefined") return undefined;

    if ("requestIdleCallback" in window) {
        const idleId = window.requestIdleCallback(callback, { timeout });
        return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(callback, timeout);
    return () => window.clearTimeout(timeoutId);
}

export default function Home() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function extractFeaturedDoctors(payload) {
            const data = payload?.data;

            if (data?.attributes?.featured_doctors?.data) {
                return data.attributes.featured_doctors.data;
            }

            if (Array.isArray(data) && data[0]?.attributes?.featured_doctors?.data) {
                return data[0].attributes.featured_doctors.data;
            }

            return [];
        }

        function toNumberOrNull(value) {
            const num = Number(value);
            return Number.isFinite(num) ? num : null;
        }

        function pickHomepageDoctors(items = []) {
            if (!Array.isArray(items)) return [];

            const selected = items
                .map((item, index) => {
                    const attrs = item?.attributes || item || {};
                    const homepagePriority = toNumberOrNull(
                        attrs.homepage_priority ?? attrs.homepagePriority,
                    );

                    if (homepagePriority === null) {
                        return null;
                    }

                    return {
                        item,
                        homepagePriority,
                        order: toNumberOrNull(attrs.order),
                        index,
                    };
                })
                .filter(Boolean)
                .sort((a, b) => {
                    if (a.homepagePriority !== b.homepagePriority) {
                        return a.homepagePriority - b.homepagePriority;
                    }

                    const orderA = Number.isFinite(a.order)
                        ? a.order
                        : Number.MAX_SAFE_INTEGER;
                    const orderB = Number.isFinite(b.order)
                        ? b.order
                        : Number.MAX_SAFE_INTEGER;
                    if (orderA !== orderB) {
                        return orderA - orderB;
                    }

                    return a.index - b.index;
                })
                .map((entry) => entry.item);

            return selected;
        }

        async function load() {
            try {
                let items = [];

                try {
                    const homepagePayload = await fetchWithEndpointFallback({
                        endpoints: ["/api/homepage"],
                        paramsVariants: [
                            {
                                "populate[featured_doctors][populate][0]": "photo",
                                "populate[featured_doctors][populate][1]": "branch",
                                "populate[featured_doctors][populate][2]":
                                    "specialisations",
                            },
                        ],
                        retryStatusCodes: [],
                    });
                    items = extractFeaturedDoctors(homepagePayload);
                } catch (homepageError) {
                    console.warn("Homepage featured doctors request skipped:", homepageError);
                }

                if (!items.length) {
                    const doctorsPayload = await fetchWithEndpointFallback({
                        endpoints: ["/api/doctors"],
                        paramsVariants: [
                            {
                                "fields[0]": "name",
                                "fields[1]": "surname",
                                "fields[2]": "slug",
                                "fields[3]": "positionShort",
                                "fields[4]": "positionLong",
                                "fields[5]": "startYear",
                                "fields[6]": "order",
                                "fields[7]": "homepage_priority",
                                "fields[8]": "show_on_homepage",
                                "fields[9]": "isActive",
                                "populate[photo][fields][0]": "url",
                                "populate[photo][fields][1]": "alternativeText",
                                "populate[photo][fields][2]": "width",
                                "populate[photo][fields][3]": "height",
                                "populate[photo][fields][4]": "formats",
                                "populate[branch][fields][0]": "name",
                                "populate[branch][fields][1]": "slug",
                                "populate[branch][fields][2]": "address",
                                "populate[specialisations][fields][0]": "name",
                                "populate[specialisations][fields][1]": "slug",
                                "pagination[pageSize]": 8,
                                "sort[0]": "order:asc",
                                "sort[1]": "surname:asc",
                                "sort[2]": "name:asc",
                            },
                        ],
                        retryStatusCodes: [],
                    });
                    const allDoctors = Array.isArray(doctorsPayload?.data)
                        ? doctorsPayload.data
                        : [];
                    const selectedHomepageDoctors = pickHomepageDoctors(allDoctors);
                    items = selectedHomepageDoctors.length
                        ? selectedHomepageDoctors
                        : allDoctors;
                }

                setDoctors(items.slice(0, 4));
            } catch (err) {
                console.error("Failed to load doctors:", err);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        }

        const cancelIdle = runWhenBrowserIsIdle(load);

        return () => {
            cancelIdle?.();
        };
    }, []);

    return (
        <div>
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/"
            />
            <div className="page-home">
                <Banner />
                <RevealOnScroll>
                    <DeclarationSection />
                </RevealOnScroll>
                <Ticket text="САМОЛІКУВАННЯ МОЖЕ БУТИ ШКІДЛИВИМ ДЛЯ ВАШОГО ЗДОРОВ’Я" />

                <Suspense fallback={null}>
                    <RevealOnScroll>
                        <ServicesSection />
                    </RevealOnScroll>
                    <RevealOnScroll>
                        {loading ? (
                            <div
                                className="doctors-section-placeholder"
                                aria-hidden="true"
                                style={{ minHeight: "640px" }}
                            />
                        ) : (
                            <DoctorsSection doctors={doctors} />
                        )}
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <BranchesSection />
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <WhyChooseUsSection />
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <FAQSection title={homeFaqTitle} faqs={homeFaqs} />
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <ContactForm
                            smallTitle="ПОРУЧ, ЩОБ ДОПОМОГТИ"
                            subtitle="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                        />
                    </RevealOnScroll>
                </Suspense>
            </div>
        </div>
    );
}
