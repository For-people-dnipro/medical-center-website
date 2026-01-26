import "./DoctorsSection.css";
import Button from "../components/Button/Button";

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export default function DoctorsSection({ doctors = [] }) {
    const limitedDoctors = Array.isArray(doctors) ? doctors.slice(0, 4) : [];

    if (!limitedDoctors.length) return null;

    function pluralizeYears(n) {
        const abs = Math.abs(Number(n) || 0);
        const rem10 = abs % 10;
        const rem100 = abs % 100;
        if (rem10 === 1 && rem100 !== 11) return "рік";
        if (rem10 >= 2 && rem10 <= 4 && !(rem100 >= 12 && rem100 <= 14))
            return "роки";
        return "років";
    }

    function computeExperience(attrs = {}) {
        const now = new Date();
        const yearNow = now.getFullYear();

        const startYear =
            attrs.startYear ||
            attrs.workStartYear ||
            attrs.experienceStartYear ||
            attrs.start_of_career ||
            attrs.start_year;

        if (startYear && !isNaN(Number(startYear))) {
            return Math.max(0, yearNow - Number(startYear));
        }

        const exp = Number(attrs.experience ?? attrs.years ?? attrs.experiance);
        if (!isNaN(exp) && exp !== 0) return Math.max(0, Math.floor(exp));

        return 0;
    }

    return (
        <section className="section">
            <div className="doctors-container">
                <h2 className="title">ЛІКАРІ</h2>
                <p className="subtitle">
                    Команда, яка щодня дбає про ваше самопочуття
                </p>

                {/* ===== DESKTOP GRID ===== */}
                <div className="doctors-scroll">
                    <div className="grid">
                        {limitedDoctors.map((doc) => {
                            const d = doc.attributes || doc || {};
                            const photoUrl = d.photo?.url;
                            const imgSrc = photoUrl
                                ? `${API_URL}${photoUrl}`
                                : "";
                            const years = computeExperience(d);

                            return (
                                <div key={doc.id} className="card">
                                    <div className="imageWrapper">
                                        {imgSrc && (
                                            <img
                                                src={imgSrc}
                                                alt={d.name || "doctor"}
                                                className="image"
                                            />
                                        )}

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
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===== MOBILE SLIDER ===== */}
                <div className="doctors-mobile">
                    <div className="mobile-track">
                        {limitedDoctors.map((doc) => {
                            const d = doc.attributes || doc || {};
                            const photoUrl = d.photo?.url;
                            const imgSrc = photoUrl
                                ? `${API_URL}${photoUrl}`
                                : "";

                            return (
                                <div key={doc.id} className="mobile-card">
                                    {imgSrc && (
                                        <img
                                            src={imgSrc}
                                            alt={d.name || "doctor"}
                                            className="mobile-image"
                                        />
                                    )}

                                    <h3 className="mobile-name">
                                        {d.surname} {d.name}
                                    </h3>

                                    {d.position && (
                                        <p className="mobile-position">
                                            {d.position}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="buttonWrapper">
                    <Button href="/doctors">Наша команда</Button>
                </div>
            </div>
        </section>
    );
}
