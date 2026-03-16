import { useEffect, useState } from "react";
import { Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logofooter from "../../assets/logo_footer.svg";
import MapPin from "../MapPin";
import { SOCIAL_LINKS } from "../../constants/socialLinks";

export default function Footer() {
    const [isRulesInMenu, setIsRulesInMenu] = useState(false);

    useEffect(() => {
        const checkWidth = () => {
            setIsRulesInMenu(
                window.innerWidth <= 1244 && window.innerWidth > 900,
            );
        };

        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    const branches = [
        {
            address: "м. Дніпро, вул. Данила Галицького, 34",
            hours: "ПН–ПТ з 9:00 до 18:00",
            phone: "+38 (050) 067-13-88",
        },
        {
            address: "м. Дніпро, просп. Б. Хмельницького, 127",
            hours: "ПН–ПТ з 9:00 до 18:00",
            phone: "+38 (050) 067-22-35",
        },
        {
            address: "м. Дніпро, бульвар Слави, 8",
            hours: "ПН–ПТ з 9:00 до 18:00",
            phone: "+38 (066) 067-00-37",
        },
    ];

    const mobileLeft = [
        { label: "Про нас", href: "/about" },
        { label: "Лікарі", href: "/doctors" },
        { label: "Послуги", href: "/services" },
        { label: "Філії", href: "/branches" },
        { label: "Вакансії", href: "/vacancies" },
        { label: "Новини", href: "/news" },
        { label: "Контакти", href: "/contacts" },
    ];

    const mobileRight = [
        { label: "Документи", href: "/documents" },
        { label: "Публічна оферта", href: "/offer" },
        { label: "Політика конфіденційності", href: "/privacy" },
        { label: "Захист персональних даних", href: "/data-protection" },
        { label: "Перелік безкоштовних послуг (ПМГ)", href: "/free-services" },
        { label: "Правила повітряної тривоги", href: "/air-alert" },
        { label: "Правила внутрішнього розпорядку", href: "/rules" },
    ];

    const desktopMenu = [
        { label: "Про нас", href: "/about" },
        { label: "Лікарі", href: "/doctors" },
        { label: "Послуги", href: "/services" },
        { label: "Філії", href: "/branches" },
        { label: "Вакансії", href: "/vacancies" },
        { label: "Новини", href: "/news" },
        { label: "Контакти", href: "/contacts" },
        { label: "Документи", href: "/documents" },
        {
            label: "Результати аналізів",
            href: "https://vitalab.com.ua/qr-code",
        },
        { label: "Підписати декларацію", href: "/declaration" },
        { label: "Політика конфіденційності", href: "/privacy" },
        { label: "Захист персональних даних", href: "/data-protection" },
        { label: "Публічна оферта", href: "/offer" },
        { label: "Перелік безкоштовних послуг (ПМГ)", href: "/free-services" },
        { label: "Правила повітряної тривоги", href: "/air-alert" },
    ];

    const desktopMenuWithRules = [
        ...desktopMenu,
        { label: "Правила внутрішнього розпорядку", href: "/rules" },
    ];

    const menuToRender = isRulesInMenu ? desktopMenuWithRules : desktopMenu;
    const isInternalRoute = (href) =>
        typeof href === "string" && href.startsWith("/") && !href.startsWith("//");

    return (
        <footer className={`footer ${isRulesInMenu ? "rules-in-menu" : ""}`}>
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-logo">
                        <img
                            src={logofooter}
                            alt="Логотип медичного центру Для Людей"
                        />
                    </div>

                    <div className="footer-mobile-addresses">
                        {branches.map((b, i) => (
                            <div className="footer-mobile-address" key={i}>
                                <MapPin size={25} />
                                <span>{b.address}</span>
                            </div>
                        ))}
                    </div>

                    <div className="footer-contacts">
                        {branches.map((b, i) => (
                            <div className="footer-contact-block" key={i}>
                                <p>
                                    <img
                                        src="/icons/icon-location.svg"
                                        alt=""
                                    />
                                    {b.address}
                                </p>
                                <p>
                                    <img src="/icons/icon-clock.svg" alt="" />
                                    {b.hours}
                                </p>
                                <p>
                                    <img src="/icons/icon-phone.svg" alt="" />
                                    <span>{b.phone}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="footer-nav desktop-menu">
                    {menuToRender.map((item, i) =>
                        isInternalRoute(item.href) ? (
                            <Link key={i} to={item.href}>
                                {item.label}
                            </Link>
                        ) : (
                            <a key={i} href={item.href}>
                                {item.label}
                            </a>
                        ),
                    )}
                </div>

                <div className="footer-mobile-menu">
                    <div className="footer-mobile-col">
                        {mobileLeft.map((item, i) =>
                            isInternalRoute(item.href) ? (
                                <Link key={i} to={item.href}>
                                    {item.label}
                                </Link>
                            ) : (
                                <a key={i} href={item.href}>
                                    {item.label}
                                </a>
                            ),
                        )}
                    </div>

                    <div className="footer-mobile-col">
                        {mobileRight.map((item, i) =>
                            isInternalRoute(item.href) ? (
                                <Link key={i} to={item.href}>
                                    {item.label}
                                </Link>
                            ) : (
                                <a key={i} href={item.href}>
                                    {item.label}
                                </a>
                            ),
                        )}
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <span className="footer-copy">
                    © 2025 Для людей. Всі права захищені
                </span>

                <Link to="/rules" className="footer-rules">
                    Правила внутрішнього розпорядку
                </Link>

                <div className="footer-socials" aria-label="Соцмережі">
                    <a
                        href={SOCIAL_LINKS.instagram}
                        aria-label="Instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Instagram className="footer-icon" />
                    </a>
                    <a
                        href={SOCIAL_LINKS.facebook}
                        aria-label="Facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Facebook className="footer-icon" />
                    </a>
                </div>

                <a
                    href="https://dashly.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-dev"
                >
                    DASHLY STUDIO
                </a>
            </div>
        </footer>
    );
}
