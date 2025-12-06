import "./DeclarationSection.css";
import check from "../../public/icons/check.svg"; // твоя галочка
import nszulogo from "../assets/nszu.png"; // твоє зображення справа

export default function DeclarationSection() {
    return (
        <section className="decl-section">
            <div className="decl-container">
                {/* LEFT TEXT BLOCK */}
                <div className="decl-text">
                    <h2>
                        <span>БЕЗКОШТОВНЕ</span> медичне обслуговування
                    </h2>
                    <h3>
                        за умови <span>ПІДПИСАННЯ</span> декларації з сімейним
                        лікарем
                    </h3>

                    <p className="decl-description">
                        Підпишіть декларацію з нашим сімейним лікарем та
                        отримуйте безкоштовне медичне обслуговування в нашому
                        центрі.
                    </p>

                    <p className="decl-subtitle">Це дозволить вам:</p>

                    <ul className="decl-list">
                        <li>
                            <img src={check} alt="" /> проходити консультації та
                            огляди безкоштовно
                        </li>
                        <li>
                            <img src={check} alt="" /> отримувати направлення на
                            спеціалізовану (вторинну) медичну допомогу
                        </li>
                        <li>
                            <img src={check} alt="" /> отримувати направлення на
                            високоспеціалізовану (третинну) медичну допомогу
                        </li>
                        <li>
                            <img src={check} alt="" /> користуватись повним
                            спектром державних медичних послуг
                        </li>
                    </ul>

                    <div className="decl-actions">
                        <a className="decl-btn teal" href="#">
                            Підписати декларацію <span>➜</span>
                        </a>
                        <a className="decl-btn outline" href="#">
                            Перелік безкоштовних послуг <span>➜</span>
                        </a>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="decl-image">
                    <img src={nszulogo} alt="НСЗУ" />
                </div>
            </div>
        </section>
    );
}
