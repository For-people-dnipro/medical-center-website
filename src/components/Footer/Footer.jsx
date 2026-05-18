import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logofooter from "../../assets/logo_footer.svg";
import MapPin from "../MapPin";
import { Instagram, Facebook } from "lucide-react";

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
            phoneDisplay: "+38 (050) 067-13-88",
            phoneHref: "+380500671388",
        },
        {
            address: "м. Дніпро, просп. Б. Хмельницького, 127",
            hours: "ПН–ПТ з 9:00 до 18:00",
            phoneDisplay: "+38 (050) 067-22-35",
            phoneHref: "+380500672235",
        },
        {
            address: "м. Дніпро, бульвар Слави, 8",
            hours: "ПН–ПТ з 9:00 до 18:00",
            phoneDisplay: "+38 (066) 067-00-37",
            phoneHref: "+380660670037",
        },
    ];

    const mobileLeft = [
        { label: "Про клініку", href: "/about" },
        { label: "Лікарі", href: "/doctors" },
        { label: "Послуги", href: "/services" },
        { label: "Філії", href: "/branches" },
        { label: "Вакансії", href: "/vacancies" },
        { label: "Новини", href: "/news" },
        { label: "Контакти", href: "/contacts" },
    ];

    const mobileRight = [
        {
            label: "Документи",
            href: "https://drive.google.com/drive/folders/1cNnQCDB6XV-gfTbvyaZqrm35UHY6NrIE?usp=sharing",
            external: true,
        },
        { label: "Публічна оферта", href: "/offer" },
        { label: "Політика конфіденційності", href: "/privacy" },
        { label: "Захист персональних даних", href: "/data-protection" },
        { label: "Перелік безкоштовних послуг (ПМГ)", href: "/free-services" },
        { label: "Правила повітряної тривоги", href: "/air-alert" },
        { label: "Правила внутрішнього розпорядку", href: "/rules" },
    ];

    const desktopMenu = [
        { label: "Про клініку", href: "/about" },
        { label: "Лікарі", href: "/doctors" },
        { label: "Послуги", href: "/services" },
        { label: "Філії", href: "/branches" },
        { label: "Вакансії", href: "/vacancies" },
        { label: "Новини", href: "/news" },
        { label: "Контакти", href: "/contacts" },
        { label: "Документи", href: "https://drive.google.com/drive/folders/1cNnQCDB6XV-gfTbvyaZqrm35UHY6NrIE?usp=sharing", external: true },
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

    return (
        <footer className={`footer ${isRulesInMenu ? "rules-in-menu" : ""}`}>
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-logo">
                        <img
                            src={logofooter}
                            alt="Для людей"
                            width="255"
                            height="51"
                            loading="lazy"
                            decoding="async"
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
                                    <img src="/icons/icon-location.svg" alt="" aria-hidden="true" width="24" height="24" loading="lazy" decoding="async" />
                                    {b.address}
                                </p>
                                <p>
                                    <img src="/icons/icon-clock.svg" alt="" aria-hidden="true" width="24" height="24" loading="lazy" decoding="async" />
                                    {b.hours}
                                </p>
                                <p>
                                    <img src="/icons/icon-phone.svg" alt="" aria-hidden="true" width="24" height="24" loading="lazy" decoding="async" />
                                    <a href={`tel:${b.phoneHref}`}>{b.phoneDisplay}</a>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="footer-nav desktop-menu">
                    {menuToRender.map((item, i) =>
                        item.external ? (
                            <a
                                key={i}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.label}
                            </a>
                        ) : /^https?:/i.test(item.href) ? (
                            <a
                                key={i}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <Link key={i} to={item.href}>
                                {item.label}
                            </Link>
                        ),
                    )}
                </div>

                <div className="footer-mobile-menu">
                    <div className="footer-mobile-col">
                        {mobileLeft.map((item, i) =>
                            item.external ? (
                                <a
                                    key={i}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <Link key={i} to={item.href}>
                                    {item.label}
                                </Link>
                            ),
                        )}
                    </div>

                    <div className="footer-mobile-col">
                        {mobileRight.map((item, i) =>
                            item.external ? (
                                <a
                                    key={i}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <Link key={i} to={item.href}>
                                    {item.label}
                                </Link>
                            ),
                        )}
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <span className="footer-copy">
                    © 2025 Для людей. Всі права захищені
                </span>

                <a href="/rules" className="footer-rules">
                    Правила внутрішнього розпорядку
                </a>

                <div className="footer-socials" aria-label="Соцмережі">
                    <a
                        href="https://www.instagram.com/medcentr_dl?igsh=MXFjN3dsOWxneHhrYg=="
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                    >
                        <Instagram className="footer-icon" aria-hidden="true" />
                    </a>
                    <a
                        href="https://www.facebook.com/profile.php?id=61582468588174"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                    >
                        <Facebook className="footer-icon" aria-hidden="true" />
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
