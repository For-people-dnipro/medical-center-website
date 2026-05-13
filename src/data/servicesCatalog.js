export const SERVICE_CARDS = Object.freeze([
    {
        icon: "/icons/service-declaration.svg",
        iconMobile: "/icons/service-declaration-mobile.svg",
        label: "Декларація",
        href: "/declaration",
    },
    {
        icon: "/icons/service-consult.svg",
        iconMobile: "/icons/service-consult-mobile.svg",
        label: "Консультація",
        href: "/consultation",
    },
    {
        icon: "/icons/service-tests.svg",
        iconMobile: "/icons/service-tests-mobile.svg",
        label: "Аналізи",
        href: "/analyses",
    },
    {
        icon: "/icons/service-checkup.svg",
        iconMobile: "/icons/service-checkup-mobile.svg",
        label: "Скринінг 40+",
        href: "/screening-40-plus",
    },
    {
        icon: "/icons/service-vaccine.svg",
        iconMobile: "/icons/service-vaccine-mobile.svg",
        label: "Вакцинація",
        href: "/vaccination",
    },
    {
        icon: "/icons/service-diagnostics.svg",
        iconMobile: "/icons/service-diagnostics-mobile.svg",
        label: "Діагностика",
        href: "/diagnostics",
    },
    {
        icon: "/icons/service-manipulation.svg",
        iconMobile: "/icons/service-manipulation-mobile.svg",
        label: "Маніпуляції",
        href: "/manipulation",
    },
]);

export const SERVICE_MENU_ITEMS = Object.freeze([
    { label: "Всі послуги", href: "/services" },
    ...SERVICE_CARDS.map(({ label, href }) => ({ label, href })),
]);
