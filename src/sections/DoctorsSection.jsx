import "./DoctorsSection.css";
import Button from "../components/Button/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useLayoutEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export default function DoctorsSection({ doctors = [] }) {
    const limitedDoctors = doctors?.slice(0, 4) || [];
    if (!limitedDoctors.length) return null;

    /* ===== MOBILE NAME SPLIT (ONE-TIME, STABLE) ===== */
    const mobileNameRefs = useRef([]);
    const [forceSplit, setForceSplit] = useState(false);

    useLayoutEffect(() => {
        // тільки для mobile
        if (window.innerWidth > 576) return;

        const hasOverflow = mobileNameRefs.current.some(
            (el) => el && el.scrollWidth > el.clientWidth,
        );

        setForceSplit(hasOverflow);
    }, []);

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
        const yearNow = new Date().getFullYear();
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

                <p className="subtitle subtitle-desktop">
                    Команда, яка щодня дбає про ваше самопочуття
                </p>
                <p className="subtitle subtitle-mobile">
                    Команда, яка дбає про вас щодня
                </p>

                {/* ===== DESKTOP GRID ===== */}
                <div className="doctors-scroll">
                    <div className="grid">
                        {limitedDoctors.map((doc) => {
                            const d = doc.attributes || doc || {};
                            const imgSrc = d.photo?.url
                                ? `${API_URL}${d.photo.url}`
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
                                                <div className="exp-line" />
                                                <div className="exp-text">
                                                    {pluralizeYears(years)}
                                                    <br />
                                                    досвіду
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* DESKTOP — завжди 2 рядки */}
                                    <h3 className="name">
                                        {d.surname}
                                        <br />
                                        {d.name}
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
                    <Swiper
                        modules={[Autoplay]}
                        slidesPerView="auto"
                        centeredSlides
                        spaceBetween={20}
                        loop
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        grabCursor
                    >
                        {limitedDoctors.map((doc, index) => {
                            const d = doc.attributes || doc || {};
                            const imgSrc = d.photo?.url
                                ? `${API_URL}${d.photo.url}`
                                : "";
                            const years = computeExperience(d);

                            return (
                                <SwiperSlide
                                    key={doc.id}
                                    className="doctor-slide"
                                >
                                    <div className="mobile-card">
                                        <div className="imageWrapper">
                                            {imgSrc && (
                                                <img
                                                    src={imgSrc}
                                                    alt={d.name || "doctor"}
                                                    className="mobile-image"
                                                />
                                            )}

                                            {years > 0 && (
                                                <div className="experience">
                                                    <div className="exp-number">
                                                        {years}
                                                    </div>
                                                    <div className="exp-line" />
                                                    <div className="exp-text">
                                                        {pluralizeYears(years)}
                                                        <br />
                                                        досвіду
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* MOBILE — єдине глобальне рішення */}
                                        <h3
                                            ref={(el) =>
                                                (mobileNameRefs.current[index] =
                                                    el)
                                            }
                                            className={`smart-name ${
                                                forceSplit ? "split" : ""
                                            }`}
                                        >
                                            {forceSplit ? (
                                                <>
                                                    <span className="surname">
                                                        {d.surname}
                                                    </span>
                                                    <span className="rest">
                                                        {d.name}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    {d.surname} {d.name}
                                                </>
                                            )}
                                        </h3>

                                        {d.position && (
                                            <p className="mobile-position">
                                                {d.position}
                                            </p>
                                        )}
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>

                <div className="buttonWrapper">
                    <Button href="/doctors">Наша команда</Button>
                </div>
            </div>
        </section>
    );
}
