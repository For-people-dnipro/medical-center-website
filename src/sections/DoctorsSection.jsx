import "./DoctorsSection.css";
import Button from "../components/Button/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useLayoutEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

function getDoctorCardPosition(attrs = {}) {
    return (
        attrs.positionShort ||
        attrs.position_short ||
        attrs.shortPosition ||
        attrs.positionLong ||
        attrs.position_long ||
        attrs.position ||
        ""
    );
}

function buildDoctorImageAlt(attrs = {}) {
    const fullName = [attrs.surname, attrs.name].filter(Boolean).join(" ").trim();
    const doctorName = fullName || attrs.fullName || "Лікар";
    return `Сімейний лікар ${doctorName} — медичний центр Для Людей, Дніпро`;
}

function parseStartYear(value) {
    const text = String(value ?? "").trim();
    if (!text) return null;

    const direct = Number(text.replace(",", "."));
    const numeric =
        Number.isFinite(direct)
            ? direct
            : Number(
                  (text.match(/-?\d+(?:[.,]\d+)?/)?.[0] || "").replace(
                      ",",
                      ".",
                  ),
              );
    const year = Math.trunc(numeric);
    if (!Number.isFinite(year) || year <= 0) return null;
    return year;
}

export default function DoctorsSection({ doctors = [] }) {
    const limitedDoctors = doctors?.slice(0, 4) || [];
    if (!limitedDoctors.length) return null;

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
        const startYear = parseStartYear(attrs.startYear);
        if (startYear === null) return null;
        const yearsOfExperience = yearNow - startYear;
        if (yearsOfExperience <= 0) return 1;

        return yearsOfExperience;
    }

    return (
        <section className="section">
            <div className="doctors-container">
                <h2 className="title">ЛІКАРІ</h2>

                <h3 className="subtitle subtitle-desktop">
                    Команда, яка щодня дбає про ваше самопочуття
                </h3>
                <h3 className="subtitle subtitle-mobile">
                    Команда, яка дбає про вас щодня
                </h3>

                <div className="doctors-scroll">
                    <div className="grid">
                        {limitedDoctors.map((doc) => {
                            const d = doc.attributes || doc || {};
                            const imgSrc = d.photo?.url
                                ? `${API_URL}${d.photo.url}`
                                : "";
                            const years = computeExperience(d);
                            const cardPosition = getDoctorCardPosition(d);
                            const doctorImageAlt = buildDoctorImageAlt(d);

                            return (
                                <div key={doc.id} className="card">
                                    <div className="imageWrapper">
                                        {imgSrc && (
                                            <img
                                                src={imgSrc}
                                                alt={doctorImageAlt}
                                                className="image"
                                            />
                                        )}

                                        {years !== null && (
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

                                    <p className="name">
                                        {d.surname}
                                        <br />
                                        {d.name}
                                    </p>

                                    {cardPosition && (
                                        <p className="position">{cardPosition}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

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
                            const cardPosition = getDoctorCardPosition(d);
                            const doctorImageAlt = buildDoctorImageAlt(d);

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
                                                    alt={doctorImageAlt}
                                                    className="mobile-image"
                                                />
                                            )}

                                            {years !== null && (
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

                                        {cardPosition && (
                                            <p className="mobile-position">
                                                {cardPosition}
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
