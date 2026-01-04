import "./Footer.css";
import logofooter from "../../assets/logo_footer.svg";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* ===== TOP ===== */}
                <div className="footer-top">
                    {/* LOGO */}
                    <div className="footer-logo">
                        <img src={logofooter} alt="Для людей" />
                    </div>

                    {/* CONTACT BLOCKS */}
                    <div className="footer-contacts">
                        {[1, 2, 3].map((_, i) => (
                            <div className="footer-contact-block" key={i}>
                                <p>
                                    <img
                                        src="/icons/icon-location.svg"
                                        alt=""
                                    />
                                    вул. Д. Галицького 34, Дніпро
                                </p>
                                <p>
                                    <img src="/icons/icon-clock.svg" alt="" />
                                    ПН–ПТ з 9:00 до 17:00
                                </p>
                                <p>
                                    <img src="/icons/icon-phone.svg" alt="" />
                                    +380991367595
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== NAVIGATION ===== */}
                <div className="footer-nav">
                    <div className="footer-col">
                        <a href="/about">Про клініку</a>
                        <a href="/doctors">Лікарі</a>
                        <a href="/services">Послуги</a>
                    </div>

                    <div className="footer-col">
                        <a href="/departments">Відділення</a>
                        <a href="/vacancies">Вакансії</a>
                        <a href="/news">Новини</a>
                    </div>

                    <div className="footer-col">
                        <a href="/contacts">Контакти</a>
                        <a href="/results">Результати аналізів</a>
                        <a href="/declaration">Підписати декларацію</a>
                    </div>

                    <div className="footer-col">
                        <a href="/documents">Документи</a>
                        <a href="/privacy">Політика конфіденційності</a>
                        <a href="/data-protection">Захист персональних даних</a>
                    </div>

                    <div className="footer-col">
                        <a href="/offer">Публічна оферта</a>
                        <a href="/free-services">
                            Перелік безкоштовних послуг (ПМГ)
                        </a>
                        <a href="/air-alert">
                            Правила під час повітряної тривоги
                        </a>
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

                <div className="footer-socials">
                    <a href="#" className="social-link instagram">
                        <img src="/icons/icon-instagram.svg" alt="Instagram" />
                    </a>

                    <a href="#" className="social-link facebook">
                        <img src="/icons/icon-facebook.svg" alt="Facebook" />
                    </a>

                    <a href="#" className="social-link telegram">
                        <img src="/icons/icon-telegram.svg" alt="Telegram" />
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
