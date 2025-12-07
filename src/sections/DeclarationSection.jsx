import "./DeclarationSection.css";
import check from "../../public/icons/check.svg";
import nszulogo from "../assets/nszu.png";

export default function DeclarationSection() {
    return (
        <section className="decl-section">
            <div className="decl-container">
                {/* TITLE CENTERED ABOVE BOTH COLUMNS */}
                <div className="decl-title">
                    <h2>
                        <span>БЕЗКОШТОВНЕ</span> медичне обслуговування
                    </h2>
                    <h3>
                        за умови <span>ПІДПИСАННЯ</span> декларації з сімейним
                        лікарем
                    </h3>
                </div>

                {/* LEFT TEXT BLOCK */}
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
                                <img src={check} alt="" /> проходити
                                консультації та огляди безкоштовно
                            </li>
                            <li>
                                <img src={check} alt="" /> отримувати
                                направлення на спеціалізовану медичну допомогу
                            </li>
                            <li>
                                <img src={check} alt="" /> отримувати
                                направлення на високоспеціалізовану допомогу
                            </li>
                            <li>
                                <img src={check} alt="" /> користуватись повним
                                спектром державних медичних послуг
                            </li>
                        </ul>

                        <div className="decl-actions">
                            <a href="#" className="decl-btn">
                                Підписати онлайн
                                <img
                                    src="/icons/arrow-right.svg"
                                    className="btn-arrow"
                                />
                            </a>

                            <a href="#" className="decl-btn">
                                Дізнатися більше
                                <img
                                    src="/icons/arrow-right.svg"
                                    className="btn-arrow"
                                />
                            </a>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="decl-image">
                        <img src={nszulogo} alt="НСЗУ" />
                    </div>
                </div>
            </div>
        </section>
    );
}
