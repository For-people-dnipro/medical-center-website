import "./BranchesSection.css";

const branches = [
    {
        name: "вул. Данила Галицького, 34",
        link: "https://www.google.com/maps?q=вул.+Данила+Галицького,+34,+Дніпро",
        lat: 48.464717,
        lng: 35.046183,
    },
    {
        name: "просп. Богдана Хмельницького, 127",
        link: "https://www.google.com/maps?q=просп.+Богдана+Хмельницького,+127,+Дніпро",
        lat: 48.47685,
        lng: 35.01375,
    },
    {
        name: "бульвар Слави, 8",
        link: "https://www.google.com/maps?q=бульвар+Слави,+8,+Дніпро",
        lat: 48.43748,
        lng: 35.0503,
    },
];

export default function BranchesSection() {
    return (
        <section className="branches-section">
            <div className="branches-container">
                {/* Ліва колонка */}
                <div className="branches-text">
                    <h2 className="branches-title">НАШІ ФІЛІЇ У М. ДНІПРО</h2>

                    <p className="branches-description">
                        Наші філії розташовані у зручних районах міста, щоб
                        якісна медична допомога була поруч із вами. Обирайте
                        найближчий медичний центр і отримуйте повний комплекс
                        медичних послуг.
                    </p>

                    <ul className="branches-list">
                        {branches.map((b, i) => (
                            <li key={i} className="branches-item">
                                <span className="icon">📍</span>
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

                    <div className="branches-button-wrapper">
                        <a href="/branches" className="branches-button">
                            Детальніше →
                        </a>
                    </div>
                </div>

                <div className="branches-map">
                    <iframe
                        title="locations map"
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: "20px" }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=48.464717,35.046183&zoom=12`}
                    ></iframe>
                </div>
            </div>
        </section>
    );
}
