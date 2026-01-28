import "./BranchesSection.css";
import Button from "../components/Button/Button";
import MapPin from "../components/MapPin";
import BranchesMap from "../components/BranchesMap";

const branches = [
    {
        name: "вул. Данила Галицького, 34",
        link: "https://www.google.com/maps?q=вул.+Данила+Галицького,+34,+Дніпро",
    },
    {
        name: "просп. Б. Хмельницького, 127",
        link: "https://www.google.com/maps?q=просп.+Богдана+Хмельницького,+127,+Дніпро",
    },
    {
        name: "бульвар Слави, 8",
        link: "https://www.google.com/maps?q=бульвар+Слави,+8,+Дніпро",
    },
];

export default function BranchesSection() {
    return (
        <section className="branches-section">
            <div className="branches-container">
                {/* LEFT */}
                <div className="branches-text">
                    <h2 className="branches-title">НАШІ ФІЛІЇ У М. ДНІПРО</h2>

                    <p className="branches-description">
                        Наші філії розташовані у зручних районах міста, щоб
                        якісна медична допомога була поруч із вами. Обирайте
                        найближчий медичний центр і отримуйте повний комплекс
                        медичних послуг
                    </p>

                    <ul className="branches-list">
                        {branches.map((b, i) => (
                            <li key={i} className="branches-item">
                                <span className="icon">
                                    <MapPin size={30} /> {/* ⬅ компактний */}
                                </span>
                                <a
                                    href={b.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {b.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    {/* ✅ DESKTOP BUTTON */}
                    <div className="branches-button-wrapper desktop-only">
                        <Button href="/doctors">Детальніше</Button>
                    </div>
                </div>

                {/* MAP */}
                <div className="branches-map">
                    <BranchesMap />
                </div>

                {/* ✅ MOBILE BUTTON */}
                <div className="branches-button-wrapper mobile-only">
                    <Button href="/doctors">Детальніше</Button>
                </div>
            </div>
        </section>
    );
}
