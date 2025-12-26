import "./DoctorsSection.css";
import Button from "../components/Button/Button";

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
                    <p
                        className="no-data-message"
                        style={{ textAlign: "center", padding: 40 }}
                    >
                        Дані лікарів відсутні.
                    </p>
                </div>
            </section>
        );
    }

    function pluralizeYears(n) {
        const abs = Math.abs(Number(n) || 0);
        const rem10 = abs % 10;
        const rem100 = abs % 100;
        if (rem10 === 1 && rem100 !== 11) return "рік";
        if (rem10 >= 2 && rem10 <= 4 && !(rem100 >= 12 && rem100 <= 14))
            return "роки";
        return "років";
    }

    function computeExperience(attrs = {}, raw = {}) {
        const now = new Date();
        const yearNow = now.getFullYear();

        // 1) Start year field
        const startYear =
            attrs.startYear ||
            attrs.workStartYear ||
            attrs.experienceStartYear ||
            attrs.start_of_career ||
            attrs.start_year;
        if (startYear && !isNaN(Number(startYear))) {
            return Math.max(0, yearNow - Number(startYear));
        }

        // 2) Start date field
        const startDate =
            attrs.startDate ||
            attrs.experienceStartDate ||
            attrs.startedAt ||
            attrs.start_date;
        if (startDate) {
            const sd = new Date(startDate);
            if (!isNaN(sd)) {
                let years = yearNow - sd.getFullYear();
                const hasAnniversary =
                    now.getMonth() > sd.getMonth() ||
                    (now.getMonth() === sd.getMonth() &&
                        now.getDate() >= sd.getDate());
                if (!hasAnniversary) years--;
                return Math.max(0, years);
            }
        }

        // 3) Numeric experience field (already years)
        const exp = Number(attrs.experience ?? attrs.years ?? attrs.experiance);
        if (!isNaN(exp) && exp !== 0) return Math.max(0, Math.floor(exp));

        return 0;
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

                        const years = computeExperience(d, doc);

                        return (
                            <div key={doc.id} className="card">
                                <div className="imageWrapper">
                                    <img
                                        src={imgSrc}
                                        alt={d.name || "doctor"}
                                        className="image"
                                    />

                                    {years > 0 && (
                                        <div className="experience">
                                            <div className="exp-number">
                                                {years}
                                            </div>
                                            <div className="exp-line"></div>
                                            <div className="exp-text">
                                                {pluralizeYears(years)}
                                                <br />
                                                досвіду
                                            </div>
                                        </div>
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
                    <Button href="/doctors">Наша команда</Button>
                </div>
            </div>
        </section>
    );
}
