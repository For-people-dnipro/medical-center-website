import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* ЛОГО + КОНТАКТИ */}
                <div className="footer-col footer-main">
                    <div className="footer-logo">{/* ТУТ БУДЕ ЛОГО */}</div>

                    <div className="footer-contact">
                        <p>вул. Д. Галицького 34, Дніпро</p>
                        <p>ПН–ПТ з 9:00 до 17:00</p>
                        <p>+380991367595</p>
                    </div>
                </div>

                {/* НАВІГАЦІЯ */}
                <div className="footer-col">
                    <a href="/about">Про клініку</a>
                    <a href="/departments">Відділення</a>
                    <a href="/doctors">Лікарі</a>
                    <a href="/services">Послуги</a>
                    <a href="/vacancies">Вакансії</a>
                    <a href="/news">Новини</a>
                </div>

                {/* СЕРВІСИ */}
                <div className="footer-col">
                    <a href="/contacts">Контакти</a>
                    <a href="/results">Результати аналізів</a>
                    <a href="/declaration">Підписати декларацію</a>
                </div>

                {/* ДОКУМЕНТИ */}
                <div className="footer-col">
                    <a href="/documents">Документи</a>
                    <a href="/privacy">Політика конфіденційності</a>
                    <a href="/data-protection">Захист персональних даних</a>
                    <a href="/rules">Правила внутрішнього розпорядку</a>
                </div>

                {/* ПРАВОВА ІНФА */}
                <div className="footer-col">
                    <a href="/offer">Публічна оферта</a>
                    <a href="/free-services">
                        Перелік безкоштовних послуг (ПМГ)
                    </a>
                    <a href="/air-alert">Правила під час повітряної тривоги</a>
                </div>
            </div>

            {/* НИЖНЯ ПАНЕЛЬ */}
            <div className="footer-bottom">
                <span>© 2025 Для людей. Всі права захищені</span>

                <div className="footer-socials">{/* ІКОНКИ СОЦМЕРЕЖ */}</div>
            </div>
        </footer>
    );
}
