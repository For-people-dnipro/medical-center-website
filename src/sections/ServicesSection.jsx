import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./ServicesSection.css";
import Button from "../components/Button/Button";
import { SERVICE_CARDS } from "../data/servicesCatalog";
import { toUiServiceTitle } from "../lib/serviceTitle";

export default function ServicesSection() {
    const location = useLocation();
    const normalizedPathname =
        typeof location.pathname === "string"
            ? location.pathname.replace(/\/+$/, "") || "/"
            : "/";
    const prioritizeImages = normalizedPathname === "/services";

    const servicesWithUiLabels = SERVICE_CARDS.map((item) => ({
        ...item,
        uiLabel: toUiServiceTitle(item.label),
    }));

    const getExtraClass = (label) => {
        if (label === "Аналізи") return "card-analizy";
        if (label === "Пакетні послуги") return "card-packages";
        if (label === "Check-up") return "card-checkup";
        if (label === "Косметологія") return "card-cosmetology";
        if (label === "Консультація") return "card-consultation";
        return "";
    };

    const [search, setSearch] = useState("");

    const mobileServices = [
        ...servicesWithUiLabels.slice(1),
        servicesWithUiLabels[0],
    ];

    const filteredServices = mobileServices.filter((item) =>
        item.uiLabel.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <section className="services-section">
            <div className="services-desktop">
                <div className="services-title">
                    <h2>ПОСЛУГИ</h2>
                    <h3>Все, що потрібно для турботи про здоров’я</h3>
                </div>

                <div className="services-grid">
                    {servicesWithUiLabels.map((item, i) => {
                        const cardClass = `service-card ${getExtraClass(
                            item.uiLabel,
                        )}`;
                        const content = (
                            <>
                                <div className="service-icon-wrap">
                                    <img
                                        src={item.icon}
                                        alt=""
                                        loading={prioritizeImages ? "eager" : "lazy"}
                                        fetchpriority={
                                            prioritizeImages ? "high" : "auto"
                                        }
                                        decoding="async"
                                        data-route-critical={
                                            prioritizeImages ? "true" : undefined
                                        }
                                    />
                                </div>
                                <span>{item.uiLabel}</span>
                            </>
                        );

                        return item.href ? (
                            <Link className={cardClass} key={i} to={item.href}>
                                {content}
                            </Link>
                        ) : (
                            <div className={cardClass} key={i}>
                                {content}
                            </div>
                        );
                    })}

                    <Link className="service-card more-btn" to="/services">
                        <span>ВСІ ПОСЛУГИ</span>
                        <div className="arrow-circle">
                            <img
                                src="/icons/arrow-right.svg"
                                alt=""
                                className="service-arrow"
                                loading={prioritizeImages ? "eager" : "lazy"}
                                fetchpriority={prioritizeImages ? "high" : "auto"}
                                decoding="async"
                                data-route-critical={
                                    prioritizeImages ? "true" : undefined
                                }
                            />
                        </div>
                    </Link>
                </div>
            </div>

            <div className="services-mobile">
                <div className="services-mobile-card">
                    <div className="services-title">
                        <h2>ПОСЛУГИ</h2>
                        <h3>Все для турботи про ваше здоров’я</h3>
                    </div>{" "}
                    <h1 className="visually-hidden">
                        Приватний медичний центр "Для Людей" у місті Дніпро,
                        Україна.
                    </h1>
                    <div className="services-search-wrapper">
                        <input
                            type="text"
                            className="services-search"
                            placeholder="Введіть назву послуги..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div
                        className={`services-scroll-wrapper ${
                            filteredServices.length > 0 ? "has-results" : ""
                        }`}
                    >
                        {filteredServices.length > 0 ? (
                            <>
                                <div className="services-scroll">
                                    {filteredServices.map((item, i) => {
                                        const chipContent = (
                                            <>
                                                <div className="service-left">
                                                    <div className="service-icon-wrap">
                                                        <img
                                                            src={
                                                                item.iconMobile
                                                            }
                                                            alt=""
                                                            loading={
                                                                prioritizeImages
                                                                    ? "eager"
                                                                    : "lazy"
                                                            }
                                                            fetchpriority={
                                                                prioritizeImages
                                                                    ? "high"
                                                                    : "auto"
                                                            }
                                                            decoding="async"
                                                            data-route-critical={
                                                                prioritizeImages
                                                                    ? "true"
                                                                    : undefined
                                                            }
                                                        />
                                                    </div>
                                                    <span>{item.uiLabel}</span>
                                                </div>

                                                <img
                                                    src="/icons/arrow-right.svg"
                                                    alt=""
                                                    className="service-arrow"
                                                    loading={
                                                        prioritizeImages
                                                            ? "eager"
                                                            : "lazy"
                                                    }
                                                    fetchpriority={
                                                        prioritizeImages
                                                            ? "high"
                                                            : "auto"
                                                    }
                                                    decoding="async"
                                                    data-route-critical={
                                                        prioritizeImages
                                                            ? "true"
                                                            : undefined
                                                    }
                                                />
                                            </>
                                        );

                                        return item.href ? (
                                            <Link
                                                className="service-chip"
                                                key={i}
                                                to={item.href}
                                            >
                                                {chipContent}
                                            </Link>
                                        ) : (
                                            <div
                                                className="service-chip"
                                                key={i}
                                            >
                                                {chipContent}
                                            </div>
                                        );
                                    })}
                                </div>

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
                    <div className="services-btn">
                        <Button href="/services">Всі послуги</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
