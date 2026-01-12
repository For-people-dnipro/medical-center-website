import { useState } from "react";
import { createPortal } from "react-dom";
import "./Header.css";
import Container from "../components/Container/Container";
import logo from "../assets/logo_main.svg";
import ncsuIcon from "../assets/nszu.png";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    /* 🔥 ОДИН BURGER — ОДНА АНІМАЦІЯ */
    const BurgerButton = (
        <button
            className={`burger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
        >
            <span className="burger-icon">
                <span />
                <span />
                <span />
            </span>
        </button>
    );

    return (
        <>
            {/* ================= HEADER ================= */}
            <header className="header">
                {/* ОБГОРТКА НА ВСЮ ШИРИНУ */}
                <div className="header-inner">
                    {/* ЦЕНТРОВКА КОНТЕНТУ */}
                    <div className="header-content">
                        <div className="header-logo">
                            <img src={logo} alt="Для людей" />
                        </div>

                        {/* DESKTOP */}
                        <div className="header-right">
                            <nav className="header-nav">
                                <a href="/about">Про нас</a>
                                <a href="/doctors">Лікарі</a>
                                <a href="/services">Послуги</a>
                                <a href="/branches">Філії</a>
                                <a href="/vacancies">Вакансії</a>
                                <a href="/news">Новини</a>
                                <a href="/contacts">Контакти</a>
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
                            {BurgerButton}
                        </div>
                    </div>
                </div>
            </header>

            {/* ================= OVERLAY ================= */}
            {menuOpen &&
                createPortal(
                    <div
                        className="menu-overlay"
                        onClick={() => setMenuOpen(false)}
                    />,
                    document.body
                )}

            {/* ================= MOBILE MENU ================= */}
            {menuOpen &&
                createPortal(
                    <div className="mobile-menu open">
                        <nav className="mobile-nav">
                            <a href="/about">Про нас</a>
                            <a href="/doctors">Лікарі</a>

                            <button
                                className="mobile-dropdown-toggle"
                                onClick={() => setServicesOpen((v) => !v)}
                            >
                                Послуги
                                <span
                                    className={`arrow ${
                                        servicesOpen ? "open" : ""
                                    }`}
                                >
                                    ▾
                                </span>
                            </button>

                            {servicesOpen && (
                                <div className="mobile-submenu">
                                    <a href="#">Терапія</a>
                                    <a href="#">Педіатрія</a>
                                    <a href="#">Діагностика</a>
                                </div>
                            )}

                            <a href="/branches">Філії</a>
                            <a href="/vacancies">Вакансії</a>
                            <a href="/news">Новини</a>
                            <a href="/contacts">Контакти</a>
                        </nav>

                        <div className="mobile-actions">
                            <button className="outline-btn purple">
                                Результати аналізів
                            </button>
                            <button className="outline-btn teal">
                                Підписати декларацію
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
