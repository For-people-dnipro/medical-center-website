import { useState } from "react";
import "./Header.css";
import logo from "../assets/logo_main.svg";
import ncsuIcon from "../assets/nszu.png";
import arrowIcon from "../../public/icons/arrow-down.svg";
import { Link, useLocation } from "react-router-dom";
import { SERVICE_MENU_ITEMS } from "../data/servicesCatalog";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const location = useLocation();

    const openInNewTab = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const closeMobileMenus = () => {
        setMenuOpen(false);
        setServicesOpen(false);
    };

    const toggleMobileMenu = () => {
        setMenuOpen((current) => {
            if (current) {
                setServicesOpen(false);
            }

            return !current;
        });
    };

    const handleLogoClick = (event) => {
        // Only logo re-click on home should scroll.
        // From other routes we keep immediate navigation behavior.
        if (location.pathname === "/") {
            event.preventDefault();
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
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
                            <img
                                src={logo}
                                alt="Логотип медичного центру Для Людей"
                            />
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
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <span className="burger-icon">
                    <span />
                    <span />
                    <span />
                </span>
            </button>
            {menuOpen && (
                <div className="menu-overlay" onClick={closeMobileMenus} />
            )}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <nav className="mobile-nav">
                    <Link to="/about" onClick={closeMobileMenus}>
                        Про нас
                    </Link>

                    <Link to="/doctors" onClick={closeMobileMenus}>
                        Лікарі
                    </Link>

                    <div className="mobile-services-group">
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

                        <div
                            className={`mobile-submenu ${servicesOpen ? "open" : ""}`}
                            aria-hidden={!servicesOpen}
                        >
                            <div className="mobile-submenu__inner">
                                {SERVICE_MENU_ITEMS.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={closeMobileMenus}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link to="/branches" onClick={closeMobileMenus}>
                        Філії
                    </Link>

                    <Link to="/vacancies" onClick={closeMobileMenus}>
                        Вакансії
                    </Link>

                    <Link to="/news" onClick={closeMobileMenus}>
                        Новини
                    </Link>

                    <Link to="/contacts" onClick={closeMobileMenus}>
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
