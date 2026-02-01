import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Banner.css";

export default function Banner() {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        fetch("http://localhost:1337/api/home-sliders?populate=*")
            .then((res) => res.json())
            .then((data) => {
                const sortedSlides = data.data.sort(
                    (a, b) => (a.order || 0) - (b.order || 0),
                );
                setSlides(sortedSlides);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="banner-container">
            {/* ===== SLIDER ===== */}
            <Swiper
                modules={[Navigation, Pagination, Autoplay, Keyboard]}
                loop={slides.length > 1}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                }}
                speed={900}
                navigation={{
                    nextEl: ".banner-arrow-right",
                    prevEl: ".banner-arrow-left",
                }}
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                slidesPerView={1}
                allowTouchMove
            >
                {/* arrows — тільки для desktop */}
                <button className="banner-arrow banner-arrow-left">
                    <img src="/icons/arrow-left.svg" alt="prev" />
                </button>

                <button className="banner-arrow banner-arrow-right">
                    <img src="/icons/arrow-right.svg" alt="next" />
                </button>

                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="banner-slide">
                            <picture>
                                {/* MOBILE IMAGE */}
                                <source
                                    media="(max-width: 768px)"
                                    srcSet={
                                        slide.photomobile?.url
                                            ? `http://localhost:1337${slide.photomobile.url}`
                                            : undefined
                                    }
                                />

                                {/* DESKTOP IMAGE */}
                                <img
                                    src={
                                        slide.photodesktop?.url
                                            ? `http://localhost:1337${slide.photodesktop.url}`
                                            : ""
                                    }
                                    alt="banner"
                                    className="banner-image"
                                />
                            </picture>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="mobile-slogan">
                <span className="slogan-care">ДБАЄМО.</span>{" "}
                <span className="slogan-diagnose">ДІАГНОСТУЄМО.</span>{" "}
                <span className="slogan-treat">ЛІКУЄМО.</span>
            </div>

            {/* ===== FIXED MOBILE CTA (BUTTONS ONLY) ===== */}
            <div className="mobile-cta">
                <div className="mobile-cta-buttons">
                    <button className="mobile-btn">
                        <div className="mobile-btn-content">
                            <span className="mobile-btn-icon">
                                <img src="/icons/document.svg" alt="" />
                            </span>
                            <span className="mobile-btn-text">
                                Підписати декларацію
                            </span>
                        </div>
                    </button>

                    <button className="mobile-btn">
                        <div className="mobile-btn-content">
                            <span className="mobile-btn-icon">
                                <img src="/icons/lab.svg" alt="" />
                            </span>
                            <span className="mobile-btn-text">
                                Результати аналізів
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
