import "./DeclarationSection.css";
import check from "../../public/icons/check.svg";
import nszulogo from "../assets/nszu.png";
import Button from "../components/Button/Button";

export default function DeclarationSection() {
    return (
        <section className="decl-section">
            <div className="decl-container">
                <div className="decl-title">
                    <h2>
                        <span>БЕЗКОШТОВНЕ</span> медичне обслуговування
                    </h2>
                    <h2>
                        за умови <span>ПІДПИСАННЯ</span> декларації з сімейним
                        лікарем
                    </h2>
                </div>

                <div className="decl-title-mobile">
                    <h2>
                        <span>БЕЗКОШТОВНЕ</span> медичне обслуговування після
                        підписання <span>ДЕКЛАРАЦІЇ</span>
                    </h2>
                </div>

                <div className="decl-content">
                    <div className="decl-text">
                        <p className="decl-description">
                            Підпишіть декларацію з нашим сімейним лікарем та
                            отримуйте безкоштовне медичне обслуговування в
                            нашому центрі.
                        </p>

                        <p className="decl-subtitle">Це дозволить вам:</p>

                        <ul className="decl-list">
                            <li>
                                <img src={check} alt="" />
                                проходити консультації та огляди безкоштовно
                            </li>
                            <li>
                                <img src={check} alt="" />
                                отримувати направлення на спеціалізовану медичну
                                допомогу
                            </li>
                            <li>
                                <img src={check} alt="" />
                                отримувати направлення на високоспеціалізовану
                                допомогу
                            </li>
                            <li>
                                <img src={check} alt="" />
                                користуватись повним спектром державних медичних
                                послуг
                            </li>
                        </ul>

                        <ul className="decl-list-mobile">
                            <li>
                                <img src={check} alt="" />
                                проходити консультації та огляди безкоштовно
                            </li>
                            <li>
                                <img src={check} alt="" />
                                безкоштовно отримувати направлення до
                                спеціалістів
                            </li>
                            <li>
                                <img src={check} alt="" />
                                мати доступ до гарантованих державою послуг
                            </li>
                        </ul>

                        <div className="decl-actions">
                            <Button href="/doctors">
                                Підписати декларацію
                            </Button>
                            <Button href="/doctors">
                                Перелік безкоштовних послуг
                            </Button>
                        </div>
                    </div>

                    <div className="decl-actions-mobile">
                        <Button href="/doctors">
                            Перелік безкоштовних послуг
                        </Button>
                    </div>

                    <div className="decl-image">
                        <img src={nszulogo} alt="НСЗУ" />
                    </div>
                </div>
            </div>
        </section>
    );
}
