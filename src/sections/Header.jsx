import { useState } from "react";
import "./Header.css";
import logo from "../assets/logo_main.svg";
import ncsuIcon from "../assets/nszu.png";
import arrowIcon from "../../public/icons/arrow-down.svg";
import { Link } from "react-router-dom";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    const handleLogoClick = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        setMenuOpen(false);
        setServicesOpen(false);
    };

    return (
        <>
            {/* ================= HEADER ================= */}
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

                        {/* DESKTOP */}
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
                                <button className="outline-btn purple">
                                    Результати аналізів
                                </button>
                                <button className="outline-btn teal">
                                    Підписати декларацію
                                </button>
                            </div>
                        </div>

                        {/* MOBILE ICONS */}
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
            {/* ================= OVERLAY ================= */}
            {menuOpen && (
                <div
                    className="menu-overlay"
                    onClick={() => setMenuOpen(false)}
                />
            )}
            {/* ================= MOBILE MENU ================= */}
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
                                to="/services#therapy"
                                onClick={() => setMenuOpen(false)}
                            >
                                Терапія
                            </Link>
                            <Link
                                to="/services#pediatrics"
                                onClick={() => setMenuOpen(false)}
                            >
                                Педіатрія
                            </Link>
                            <Link
                                to="/services#diagnostics"
                                onClick={() => setMenuOpen(false)}
                            >
                                Діагностика
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
                    <button className="outline-btn purple">
                        Результати аналізів
                    </button>
                    <button className="outline-btn teal">
                        Підписати декларацію
                    </button>
                </div>
            </div>
        </>
    );
}
