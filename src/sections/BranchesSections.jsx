import "./BranchesSection.css";
import Button from "../components/Button/Button";
import MapPin from "../components/MapPin";
import BranchesMap from "../components/BranchesMap";
import { Link } from "react-router-dom";

const branches = [
    {
        id: "halytskoho",
        name: "вул. Данила Галицького, 34",
    },
    {
        id: "khmelnytskoho",
        name: "просп. Б. Хмельницького, 127",
    },
    {
        id: "slava",
        name: "бульвар Слави, 8",
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
                                <Link
                                    to="/branches"
                                    state={{ scrollToBranchId: b.id }}
                                >
                                    {b.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {/* ✅ DESKTOP BUTTON */}
                    <div className="branches-button-wrapper desktop-only">
                        <Button href="/branches">Детальніше</Button>
                    </div>
                </div>

                {/* MAP */}
                <div className="branches-map">
                    <BranchesMap />
                </div>

                {/* ✅ MOBILE BUTTON */}
                <div className="branches-button-wrapper mobile-only">
                    <Button href="/branches">Детальніше</Button>
                </div>
            </div>
        </section>
    );
}
