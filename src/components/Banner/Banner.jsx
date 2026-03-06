import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Banner.css";

const STRAPI_URL = (import.meta.env.VITE_STRAPI_URL || "http://localhost:1337")
    .trim()
    .replace(/\/$/, "");
const HOME_SLIDES_ENDPOINT = `${STRAPI_URL}/api/home-sliders?populate=*`;

let cachedSlides = null;
let pendingSlidesRequest = null;

function normalizeSlides(payload) {
    const rows = Array.isArray(payload?.data) ? payload.data : [];

    return rows
        .slice()
        .sort((a, b) => (a?.order || 0) - (b?.order || 0));
}

function resolveMediaUrl(path) {
    const raw = String(path || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith("//")) return `https:${raw}`;
    return raw.startsWith("/") ? `${STRAPI_URL}${raw}` : `${STRAPI_URL}/${raw}`;
}

async function loadSlides() {
    if (Array.isArray(cachedSlides)) {
        return cachedSlides;
    }

    if (!pendingSlidesRequest) {
        pendingSlidesRequest = fetch(HOME_SLIDES_ENDPOINT)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load slider: HTTP ${response.status}`);
                }

                return response.json();
            })
            .then((payload) => {
                cachedSlides = normalizeSlides(payload);
                return cachedSlides;
            })
            .finally(() => {
                pendingSlidesRequest = null;
            });
    }

    return pendingSlidesRequest;
}

export default function Banner() {
    const [slides, setSlides] = useState(() =>
        Array.isArray(cachedSlides) ? cachedSlides : [],
    );

    useEffect(() => {
        let isMounted = true;

        loadSlides()
            .then((nextSlides) => {
                if (!isMounted || !Array.isArray(nextSlides)) return;
                setSlides(nextSlides);
            })
            .catch((error) => {
                if (!isMounted) return;
                console.error(error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    if (slides.length === 0) {
        return (
            <div className="banner-container">
                <div
                    className="banner-placeholder"
                    aria-hidden="true"
                />

                <div className="mobile-slogan">
                    <span className="slogan-care">ДБАЄМО.</span>{" "}
                    <span className="slogan-diagnose">ДІАГНОСТУЄМО.</span>{" "}
                    <span className="slogan-treat">ЛІКУЄМО.</span>
                </div>
            </div>
        );
    }

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
                    <img src="/icons/arrow-left.svg" alt="" />
                </button>

                <button className="banner-arrow banner-arrow-right">
                    <img src="/icons/arrow-right.svg" alt="" />
                </button>

                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <div className="banner-slide">
                            <picture>
                                {/* MOBILE IMAGE */}
                                <source
                                    media="(max-width: 768px)"
                                    srcSet={
                                        slide.photomobile?.url
                                            ? resolveMediaUrl(slide.photomobile.url)
                                            : undefined
                                    }
                                />

                                {/* DESKTOP IMAGE */}
                                <img
                                    src={
                                        slide.photodesktop?.url
                                            ? resolveMediaUrl(slide.photodesktop.url)
                                            : ""
                                    }
                                    alt={`Головний банер ${index + 1} медичного центру Для Людей у Дніпрі, Україна`}
                                    className="banner-image"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    fetchPriority={index === 0 ? "high" : "auto"}
                                    decoding="async"
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
        </div>
    );
}
