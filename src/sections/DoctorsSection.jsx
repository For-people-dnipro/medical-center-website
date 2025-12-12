import "./DoctorsSection.css";

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export default function DoctorsSection({ doctors = [] }) {
    console.log("DoctorsSection doctors prop:", doctors);

    const limitedDoctors = Array.isArray(doctors) ? doctors.slice(0, 4) : [];

    if (!limitedDoctors.length) {
        return (
            <section className="section">
                <div className="container">
                    <h2 className="title">ЛІКАРІ</h2>
                    <p className="subtitle">
                        Команда, яка щодня дбає про ваше самопочуття
                    </p>
                    <p style={{ textAlign: "center", padding: 40 }}>
                        Дані лікарів відсутні.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="section">
            <div className="container">
                <h2 className="title">ЛІКАРІ</h2>
                <p className="subtitle">
                    Команда, яка щодня дбає про ваше самопочуття
                </p>

                <div className="grid">
                    {limitedDoctors.map((doc) => {
                        const d = doc.attributes || doc || {};

                        // Безпечне отримання зображення (підтримує кілька можливих шляхів)
                        const photoUrl =
                            d.photo?.data?.attributes?.formats?.medium?.url ||
                            d.photo?.data?.attributes?.url ||
                            d.photo?.url ||
                            d.image?.data?.attributes?.url ||
                            null;
                        const imgSrc = photoUrl
                            ? `${API_URL}${photoUrl}`
                            : "/placeholder-doctor.png";

                        // Нове поле: підтримка різних імен (workplace, place_of_work, employer)
                        const workplace =
                            d.workplace ||
                            d.place_of_work ||
                            d.employer ||
                            d.company ||
                            "";

                        return (
                            <div key={doc.id} className="card">
                                <div className="imageWrapper">
                                    <img
                                        src={imgSrc}
                                        alt={d.name || "doctor"}
                                        className="image"
                                    />
                                    {d.experience && (
                                        <span className="experience">
                                            {d.experience} років
                                        </span>
                                    )}
                                </div>

                                <h3 className="name">
                                    {d.surname} <br /> {d.name}
                                </h3>

                                {d.position && (
                                    <p className="position">{d.position}</p>
                                )}

                                {/* Покажемо місце роботи якщо є */}
                                {workplace ? (
                                    <p className="workplace">{workplace}</p>
                                ) : (
                                    <p className="address">
                                        Дніпро — вул. Б.Хмельницького 4
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="buttonWrapper">
                    <a href="/doctors" className="button">
                        Наша команда →
                    </a>
                </div>
            </div>
        </section>
    );
}
