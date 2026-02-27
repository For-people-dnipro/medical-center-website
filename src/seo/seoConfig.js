export const SEO_SITE_NAME = "Для людей";
export const SEO_SITE_TITLE_SUFFIX = "Для людей";
export const SEO_DEFAULT_TITLE = "Медичний центр | Для людей";
export const SEO_DEFAULT_DESCRIPTION =
    "Медичний центр “Для людей” у Дніпрі: консультації, діагностика, аналізи, вакцинація та турбота про ваше здоров'я.";
export const SEO_DEFAULT_ROBOTS =
    "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
export const SEO_DEFAULT_LOCALE = "uk_UA";
export const SEO_DEFAULT_LANGUAGE = "uk";

function toText(value) {
    return typeof value === "string" && value.trim() ? value.trim() : "";
}

export function firstSeoText(...values) {
    for (const value of values) {
        const text = toText(value);
        if (text) return text;
    }
    return "";
}

export function withSiteTitle(value, fallback = SEO_DEFAULT_TITLE) {
    const base = firstSeoText(value, fallback);
    if (!base) return SEO_DEFAULT_TITLE;
    if (/\|\s*для людей\s*$/i.test(base)) return base;
    return `${base} | ${SEO_SITE_TITLE_SUFFIX}`;
}

export function buildDoctorFallbackTitle(fullName) {
    return withSiteTitle(firstSeoText(fullName, "Лікар"));
}

export function buildDoctorFallbackDescription({
    shortDescription = "",
    fullName = "",
} = {}) {
    return firstSeoText(
        shortDescription,
        fullName ? `Профіль лікаря ${fullName} у медичному центрі “Для людей”.` : "",
        "Профіль лікаря медичного центру “Для людей”.",
    );
}

export const STATIC_PAGE_SEO = Object.freeze({
    home: {
        title: withSiteTitle("Медичний центр"),
        description:
            "Приватний медичний центр “Для людей” у Дніпрі: консультації, аналізи, діагностика, вакцинація та сімейна медицина.",
    },
    services: {
        title: withSiteTitle("Послуги"),
        description:
            "Повний перелік медичних послуг центру “Для людей”: консультації, аналізи, діагностика, вакцинація та маніпуляції.",
    },
    declaration: {
        title: withSiteTitle("Декларація"),
        description:
            "Підпишіть декларацію з сімейним лікарем у медичному центрі “Для людей” та отримуйте безоплатні послуги первинної допомоги.",
    },
    consultation: {
        title: withSiteTitle("Консультація"),
        description:
            "Консультації лікарів у медичному центрі “Для людей”: уважний підхід, сучасна діагностика та персональні рекомендації.",
    },
    diagnostics: {
        title: withSiteTitle("Діагностика"),
        description:
            "Сучасна діагностика в медичному центрі “Для людей”: обстеження, УЗД, лабораторні дослідження та точні результати.",
    },
    manipulation: {
        title: withSiteTitle("Маніпуляції"),
        description:
            "Медичні маніпуляції у центрі “Для людей”: ін'єкції, крапельниці, перев'язки та безпечні процедури під наглядом фахівців.",
    },
    vaccination: {
        title: withSiteTitle("Вакцинація"),
        description:
            "Вакцинація для дітей і дорослих у медичному центрі “Для людей” за сучасними стандартами безпеки та контролю якості.",
    },
    packages: {
        title: withSiteTitle("Пакетні послуги"),
        description:
            "Пакетні медичні послуги у центрі “Для людей”: комплексні програми обстежень і супроводу для вашого здоров'я.",
    },
    checkup: {
        title: withSiteTitle("CHECK-UP"),
        description:
            "Програми CHECK-UP у медичному центрі “Для людей” для профілактики, раннього виявлення змін та контролю стану здоров'я.",
    },
    airAlert: {
        title: withSiteTitle("Правила повітряної тривоги"),
        description:
            "Правила поведінки під час повітряної тривоги в медичних центрах “Для людей”.",
    },
    doctors: {
        title: withSiteTitle("Лікарі"),
        description:
            "Наша команда лікарів: оберіть фахівця за спеціалізацією або локацією та запишіться на прийом.",
    },
    branches: {
        title: withSiteTitle("Філії"),
        description:
            "Адреси, графік роботи та контакти філій медичного центру “Для людей” у місті Дніпро.",
    },
    analyses: {
        title: withSiteTitle("Аналізи"),
        description:
            "Лабораторні аналізи в медичному центрі “Для людей”: зручний запис, сучасна діагностика та точні результати.",
    },
    vacancies: {
        title: withSiteTitle("Вакансії"),
        description:
            "Актуальні вакансії медичного центру “Для людей”. Приєднуйтесь до команди професіоналів.",
    },
    news: {
        title: withSiteTitle("Новини"),
        description:
            "Читайте актуальні новини медичного центру “Для людей”: події, корисні матеріали, акції та оновлення.",
    },
    newsArticle: {
        title: withSiteTitle("Новина"),
        description: "Новини медичного центру “Для людей”.",
    },
});

export function getStaticSeo(key) {
    return STATIC_PAGE_SEO[key] || {
        title: SEO_DEFAULT_TITLE,
        description: SEO_DEFAULT_DESCRIPTION,
    };
}
