import { useState } from "react";
import "./ServicesSection.css";
import Button from "../components/Button/Button";

export default function ServicesSection() {
    const services = [
        {
            icon: "/icons/service-declaration.svg",
            iconMobile: "/icons/service-declaration-mobile.svg",
            label: "Декларація",
        },
        {
            icon: "/icons/service-consult.svg",
            iconMobile: "/icons/service-consult-mobile.svg",
            label: "Консультація",
        },
        {
            icon: "/icons/service-tests.svg",
            iconMobile: "/icons/service-tests-mobile.svg",
            label: "Аналізи",
        },
        {
            icon: "/icons/service-vaccine.svg",
            iconMobile: "/icons/service-vaccine-mobile.svg",
            label: "Вакцинація",
        },
        {
            icon: "/icons/service-diagnostics.svg",
            iconMobile: "/icons/service-diagnostics-mobile.svg",
            label: "Діагностика",
        },
        {
            icon: "/icons/service-manipulation.svg",
            iconMobile: "/icons/service-manipulation-mobile.svg",
            label: "Маніпуляції",
        },
        {
            icon: "/icons/service-packages.svg",
            iconMobile: "/icons/service-packages-mobile.svg",
            label: "Пакетні послуги",
        },
        {
            icon: "/icons/service-checkup.svg",
            iconMobile: "/icons/service-checkup-mobile.svg",
            label: "Check-up",
        },
        // {
        //     icon: "/icons/service-cosmetology.svg",
        //     iconMobile: "/icons/service-cosmetology-mobile.svg",
        //     label: "Косметологія",
        // },
    ];
    const getExtraClass = (label) => {
        if (label === "Аналізи") return "card-analizy";
        if (label === "Пакетні послуги") return "card-packages";
        if (label === "Check-up") return "card-checkup";
        if (label === "Косметологія") return "card-cosmetology";
        return "";
    };

    const [search, setSearch] = useState("");

    // для мобільного: перший елемент в кінець
    const mobileServices = [...services.slice(1), services[0]];

    const filteredServices = mobileServices.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <section className="services-section">
            {/* ================= DESKTOP ================= */}
            <div className="services-desktop">
                <div className="services-title">
                    <h2>ПОСЛУГИ</h2>
                    <p>Все, що потрібно для турботи про здоров’я</p>
                </div>

                <div className="services-grid">
                    {services.map((item, i) => (
                        <div
                            className={`service-card ${getExtraClass(
                                item.label,
                            )}`}
                            key={i}
                        >
                            <div className="service-icon-wrap">
                                <img src={item.icon} alt="" />
                            </div>
                            <span>{item.label}</span>
                        </div>
                    ))}

                    <div className="service-card more-btn">
                        <span>ВСІ ПОСЛУГИ</span>
                        <div className="arrow-circle">
                            <img
                                src="/icons/arrow-right.svg"
                                alt=""
                                className="service-arrow"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= MOBILE ================= */}
            <div className="services-mobile">
                <div className="services-mobile-card">
                    <div className="services-title">
                        <h2>ПОСЛУГИ</h2>
                        <p>Все для турботи про ваше здоров’я</p>
                    </div>

                    {/* SEARCH */}
                    <div className="services-search-wrapper">
                        <input
                            type="text"
                            className="services-search"
                            placeholder="Введіть назву послуги..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* CONTENT */}
                    <div
                        className={`services-scroll-wrapper ${
                            filteredServices.length > 0 ? "has-results" : ""
                        }`}
                    >
                        {filteredServices.length > 0 ? (
                            <>
                                <div className="services-scroll">
                                    {filteredServices.map((item, i) => (
                                        <div className="service-chip" key={i}>
                                            <div className="service-left">
                                                <div className="service-icon-wrap">
                                                    <img
                                                        src={item.iconMobile}
                                                        alt=""
                                                    />
                                                </div>
                                                <span>{item.label}</span>
                                            </div>

                                            <img
                                                src="/icons/arrow-right.svg"
                                                alt=""
                                                className="service-arrow"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* FADE тільки коли НЕ шукаємо */}
                                {search === "" && (
                                    <div className="services-fade" />
                                )}
                            </>
                        ) : (
                            <div className="services-empty-centered">
                                <p>На жаль, таку послугу не знайдено</p>
                            </div>
                        )}
                    </div>

                    {/* BUTTON */}
                    <div className="services-btn">
                        <Button href="/">Всі послуги</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
