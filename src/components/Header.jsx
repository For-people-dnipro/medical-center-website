import "./Header.css";
import Container from "./Container";
import logo from "../assets/logo_main.svg";

export default function Header() {
    return (
        <header className="header">
            <Container>
                <div className="header-inner">
                    <div className="header-logo">
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
                </div>
            </Container>
        </header>
    );
}
