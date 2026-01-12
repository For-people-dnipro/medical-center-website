import ncsuIcon from "../assets/nszu.png";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import "./Header.css";
import Container from "../components/Container/Container";
import logo from "../assets/logo_main.svg";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const closeMenu = () => setMenuOpen(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    return (
        <header className="header">
            <Container>
                <div className="header-inner">
                    {/* LOGO */}
                    <div
                        className="header-logo"
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                    >
                        <img src={logo} alt="Для людей" />
                    </div>

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

                    <div className="header-mobile-icons">
                        <img
                            src={ncsuIcon}
                            alt="Договір з НСЗУ"
                            className="ncsu-icon"
                        />
                        <button
                            className={`burger ${menuOpen ? "open" : ""}`}
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                        >
                            <span className="burger-icon" aria-hidden="true">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>
                    </div>
                </div>
            </Container>

            {menuOpen &&
                createPortal(
                    <div className="menu-overlay" onClick={closeMenu}></div>,
                    document.body
                )}

            {createPortal(
                <div
                    ref={menuRef}
                    className={`mobile-menu ${menuOpen ? "open" : ""}`}
                >
                    <div className="mobile-nav">
                        <a href="/about" onClick={closeMenu}>
                            Про нас
                        </a>
                        <a href="/doctors" onClick={closeMenu}>
                            Лікарі
                        </a>

                        <button
                            className="mobile-dropdown-toggle"
                            onClick={() => setServicesOpen(!servicesOpen)}
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
                                <a href="/services/therapy" onClick={closeMenu}>
                                    Терапія
                                </a>
                                <a
                                    href="/services/pediatrics"
                                    onClick={closeMenu}
                                >
                                    Педіатрія
                                </a>
                                <a
                                    href="/services/diagnostics"
                                    onClick={closeMenu}
                                >
                                    Діагностика
                                </a>
                            </div>
                        )}

                        <a href="/branches" onClick={closeMenu}>
                            Філії
                        </a>
                        <a href="/vacancies" onClick={closeMenu}>
                            Вакансії
                        </a>
                        <a href="/news" onClick={closeMenu}>
                            Новини
                        </a>
                        <a href="/contacts" onClick={closeMenu}>
                            Контакти
                        </a>
                    </div>

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
        </header>
    );
}
