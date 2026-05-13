import "./DoctorsSection.css";
import Button from "../components/Button/Button";
import { getResponsiveImageProps } from "../api/foundation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function buildLoopItems(items, minSlides = 6) {
    if (!Array.isArray(items) || items.length === 0) return [];
    if (items.length >= minSlides) return items;

    const result = [];
    while (result.length < minSlides) {
        result.push(...items);
    }

    return result.slice(0, minSlides);
}

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

function resolveDoctorSlug(entry, attrs = {}) {
    const normalized = String(attrs.slug || entry?.slug || "").trim();
    if (normalized) return normalized;
    return "";
}

export default function DoctorsSection({ doctors = [] }) {
    const limitedDoctors = doctors?.slice(0, 4) || [];
    const hasMobileCarousel = limitedDoctors.length > 1;
    const mobileDoctors = hasMobileCarousel
        ? buildLoopItems(limitedDoctors, 6)
        : limitedDoctors;
    const gridCountClass =
        limitedDoctors.length < 4 ? `grid--count-${limitedDoctors.length}` : "";
    const gridClassName = ["grid", gridCountClass].filter(Boolean).join(" ");

    const mobileNameRefs = useRef([]);
    const mobileSwiperRef = useRef(null);
    const [forceSplit, setForceSplit] = useState(false);

    useEffect(() => {
        if (!hasMobileCarousel) return undefined;

        const intervalId = window.setInterval(() => {
            const swiper = mobileSwiperRef.current;
            if (!swiper || swiper.destroyed) return;
            swiper.slideNext(650);
        }, 3200);

        return () => window.clearInterval(intervalId);
    }, [hasMobileCarousel, mobileDoctors.length]);

    useLayoutEffect(() => {
        if (window.innerWidth > 576 || limitedDoctors.length === 0) return;

        const hasOverflow = mobileNameRefs.current.some(
            (el) => el && el.scrollWidth > el.clientWidth,
        );

        setForceSplit(hasOverflow);
    }, [limitedDoctors.length]);

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
        const yearNow = new Date().getFullYear();
        const startYear = parseStartYear(attrs.startYear);
        if (startYear === null) return null;
        const yearsOfExperience = yearNow - startYear;
        if (yearsOfExperience <= 0) return 1;

        return yearsOfExperience;
    }

    function getDoctorImageProps(photo, { priority = false, mobile = false } = {}) {
        return getResponsiveImageProps(photo, {
            variant: "card",
            sizes: mobile
                ? "78vw"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 280px",
            priority,
        });
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
                    <div className={gridClassName}>
                        {limitedDoctors.map((doc) => {
                            const d = doc.attributes || doc || {};
                            const imageProps = getDoctorImageProps(d.photo, {
                                priority: true,
                            });
                            const years = computeExperience(d);
                            const cardPosition = getDoctorCardPosition(d);
                            const doctorImageAlt = buildDoctorImageAlt(d);
                            const doctorSlug = resolveDoctorSlug(doc, d);
                            const cardHref = doctorSlug
                                ? `/doctors/${doctorSlug}`
                                : "";
                            const cardContent = (
                                <>
                                    <div className="imageWrapper">
                                        {imageProps?.src && (
                                            <img
                                                src={imageProps.src}
                                                srcSet={imageProps.srcSet}
                                                sizes={imageProps.sizes}
                                                alt={doctorImageAlt}
                                                className="image"
                                                width={imageProps.width}
                                                height={imageProps.height}
                                                loading="eager"
                                                fetchpriority="high"
                                                decoding="async"
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
                                </>
                            );

                            return (
                                <div key={doc.id} className="card">
                                    {cardHref ? (
                                        <Link className="card-link" to={cardHref}>
                                            {cardContent}
                                        </Link>
                                    ) : (
                                        <div className="card-link">{cardContent}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="doctors-mobile">
                    <Swiper
                        modules={hasMobileCarousel ? [Autoplay] : []}
                        slidesPerView="auto"
                        centeredSlides={hasMobileCarousel}
                        spaceBetween={20}
                        loop={hasMobileCarousel}
                        watchOverflow={!hasMobileCarousel}
                        observer={hasMobileCarousel}
                        observeParents={hasMobileCarousel}
                        speed={650}
                        autoplay={
                            hasMobileCarousel
                                ? {
                                      delay: 3200,
                                      disableOnInteraction: false,
                                      pauseOnMouseEnter: false,
                                      waitForTransition: false,
                                  }
                                : false
                        }
                        grabCursor={hasMobileCarousel}
                        allowTouchMove={hasMobileCarousel}
                        onSwiper={(swiper) => {
                            mobileSwiperRef.current = swiper;
                            if (
                                hasMobileCarousel &&
                                swiper.autoplay &&
                                !swiper.autoplay.running
                            ) {
                                swiper.autoplay.start();
                            }
                        }}
                    >
                        {mobileDoctors.map((doc, index) => {
                            const d = doc.attributes || doc || {};
                            const imageProps = getDoctorImageProps(d.photo, {
                                priority: index === 0,
                                mobile: true,
                            });
                            const years = computeExperience(d);
                            const cardPosition = getDoctorCardPosition(d);
                            const doctorImageAlt = buildDoctorImageAlt(d);
                            const doctorSlug = resolveDoctorSlug(doc, d);
                            const cardHref = doctorSlug
                                ? `/doctors/${doctorSlug}`
                                : "";
                            const cardContent = (
                                <div className="mobile-card">
                                    <div className="imageWrapper">
                                        {imageProps?.src && (
                                            <img
                                                src={imageProps.src}
                                                srcSet={imageProps.srcSet}
                                                sizes={imageProps.sizes}
                                                alt={doctorImageAlt}
                                                className="mobile-image"
                                                width={imageProps.width}
                                                height={imageProps.height}
                                                loading={index === 0 ? "eager" : "lazy"}
                                                fetchpriority={
                                                    index === 0 ? "high" : "auto"
                                                }
                                                decoding="async"
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
                            );

                            return (
                                <SwiperSlide
                                    key={`${doc.id || doc.slug || index}-home-mobile-${index}`}
                                    className="doctor-slide"
                                >
                                    {cardHref ? (
                                        <Link
                                            className="mobile-card-link"
                                            to={cardHref}
                                        >
                                            {cardContent}
                                        </Link>
                                    ) : (
                                        <div className="mobile-card-link">
                                            {cardContent}
                                        </div>
                                    )}
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
