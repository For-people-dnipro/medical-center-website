import { useState } from "react";
import "./Header.css";
import logo from "../assets/logo_main.svg";
import ncsuIcon from "../assets/nszu.png";
import arrowIcon from "../../public/icons/arrow-down.svg";
import { Link } from "react-router-dom";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const openInNewTab = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const handleLogoClick = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        setMenuOpen(false);
        setServicesOpen(false);
    };

    return (
        <>
            <header className="header">
                <div className="header-inner">
                    <div className="header-content">
                        <Link
                            to="/"
                            className="header-logo"
                            onClick={handleLogoClick}
                            aria-label="На головну"
                        >
                            <img src={logo} alt="Для людей" />
                        </Link>

                        <div className="header-right">
                            <nav className="header-nav">
                                <Link to="/about">Про нас</Link>
                                <Link to="/doctors">Лікарі</Link>
                                <Link to="/services">Послуги</Link>
                                <Link to="/branches">Філії</Link>
                                <Link to="/vacancies">Вакансії</Link>
                                <Link to="/news">Новини</Link>
                                <Link to="/contacts">Контакти</Link>
                            </nav>

                            <div className="header-actions">
                                <button
                                    type="button"
                                    onClick={() =>
                                        openInNewTab(
                                            "https://vitalab.com.ua/qr-code",
                                        )
                                    }
                                    className="outline-btn purple"
                                >
                                    Результати аналізів
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openInNewTab("/declaration")}
                                    className="outline-btn teal"
                                >
                                    Підписати декларацію
                                </button>
                            </div>
                        </div>

                        <div className="header-mobile-icons">
                            <img
                                src={ncsuIcon}
                                className="ncsu-icon"
                                alt="НСЗУ"
                            />
                        </div>
                    </div>
                </div>
            </header>{" "}
            <button
                className={`burger global-burger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
            >
                <span className="burger-icon">
                    <span />
                    <span />
                    <span />
                </span>
            </button>
            {menuOpen && (
                <div
                    className="menu-overlay"
                    onClick={() => setMenuOpen(false)}
                />
            )}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <nav className="mobile-nav">
                    <Link to="/about" onClick={() => setMenuOpen(false)}>
                        Про нас
                    </Link>

                    <Link to="/doctors" onClick={() => setMenuOpen(false)}>
                        Лікарі
                    </Link>

                    <button
                        className="mobile-dropdown-toggle"
                        onClick={() => setServicesOpen((v) => !v)}
                    >
                        <span>Послуги</span>
                        <img
                            src={arrowIcon}
                            alt=""
                            className={`arrow-icon ${servicesOpen ? "open" : ""}`}
                        />
                    </button>

                    {servicesOpen && (
                        <div className="mobile-submenu">
                            <Link
                                to="/services"
                                onClick={() => setMenuOpen(false)}
                            >
                                Всі послуги
                            </Link>

                            <Link
                                to="/declaration"
                                onClick={() => setMenuOpen(false)}
                            >
                                Декларація
                            </Link>

                            <Link
                                to="/consultation"
                                onClick={() => setMenuOpen(false)}
                            >
                                Консультація
                            </Link>

                            <Link
                                to="/analyses"
                                onClick={() => setMenuOpen(false)}
                            >
                                Аналізи
                            </Link>

                            <Link
                                to="/vaccination"
                                onClick={() => setMenuOpen(false)}
                            >
                                Вакцинація
                            </Link>

                            <Link
                                to="/diagnostics"
                                onClick={() => setMenuOpen(false)}
                            >
                                Діагностика
                            </Link>

                            <Link
                                to="/manipulation"
                                onClick={() => setMenuOpen(false)}
                            >
                                Маніпуляції
                            </Link>

                            <Link
                                to="/packages"
                                onClick={() => setMenuOpen(false)}
                            >
                                Пакетні послуги
                            </Link>

                            <Link
                                to="/checkup"
                                onClick={() => setMenuOpen(false)}
                            >
                                Check-up{" "}
                            </Link>
                        </div>
                    )}

                    <Link to="/branches" onClick={() => setMenuOpen(false)}>
                        Філії
                    </Link>

                    <Link to="/vacancies" onClick={() => setMenuOpen(false)}>
                        Вакансії
                    </Link>

                    <Link to="/news" onClick={() => setMenuOpen(false)}>
                        Новини
                    </Link>

                    <Link to="/contacts" onClick={() => setMenuOpen(false)}>
                        Контакти
                    </Link>
                </nav>

                <div className="mobile-actions">
                    <button
                        type="button"
                        onClick={() =>
                            openInNewTab("https://vitalab.com.ua/qr-code")
                        }
                        className="outline-btn purple"
                    >
                        Результати аналізів
                    </button>
                    <button
                        type="button"
                        onClick={() => openInNewTab("/declaration")}
                        className="outline-btn teal"
                    >
                        Підписати декларацію
                    </button>
                </div>
            </div>
        </>
    );
}
