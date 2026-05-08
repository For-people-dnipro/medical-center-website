import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Keyboard } from "swiper/modules";
import {
    API_BASE_URL,
    LOCAL_STRAPI_FALLBACK,
    buildOptimizedImageSrcSet,
    getOptimizedImageUrl,
} from "../../api/foundation";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Banner.css";

const STRAPI_URL = API_BASE_URL || LOCAL_STRAPI_FALLBACK;
const HOME_SLIDES_ENDPOINT = `${STRAPI_URL}/api/home-sliders?populate=*`;
const DEFAULT_BUTTON_COLOR = "#302528";
const MOZ_SOURCE_URL = "https://moz.gov.ua";
const MOZ_ATTRIBUTION_ASSET_MARKERS = [
    "Vam_40_Projdit_Skrining_zdorov_ya_40",
    "1850_3_401a7bac50",
];

let cachedSlides = null;
let pendingSlidesRequest = null;

function resolveMediaUrl(path) {
    const raw = String(path || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith("//")) return `https:${raw}`;
    return raw.startsWith("/") ? `${STRAPI_URL}${raw}` : `${STRAPI_URL}/${raw}`;
}

function pickSource(entry) {
    return entry?.attributes ?? entry ?? {};
}

function toText(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toBoolean(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === 1 || value === "1") return true;
    if (value === 0 || value === "0") return false;
    return fallback;
}

function pickMediaPath(media) {
    const source = pickSource(media?.data ?? media);
    return toText(source?.url);
}

function normalizeBannerLink(value) {
    const href = toText(value);
    if (!href) return "";
    if (/^(https?:\/\/|mailto:|tel:|#)/i.test(href)) return href;
    return href.startsWith("/") ? href : `/${href}`;
}

function normalizeButtonColor(value) {
    return toText(value, DEFAULT_BUTTON_COLOR);
}

function isExternalLink(href) {
    return /^https?:\/\//i.test(href);
}

function shouldShowMozAttribution(slide) {
    const paths = [slide.photodesktop, slide.photomobile].filter(Boolean);

    return paths.some((path) =>
        MOZ_ATTRIBUTION_ASSET_MARKERS.some((marker) => path.includes(marker)),
    );
}

function normalizeSlides(payload) {
    const rows = Array.isArray(payload?.data) ? payload.data : [];

    return rows
        .map((entry, index) => {
            const source = pickSource(entry);

            return {
                id: entry?.id ?? source.documentId ?? index,
                order: Number(source.order) || 0,
                photodesktop: pickMediaPath(source.photodesktop),
                photomobile: pickMediaPath(source.photomobile),
                buttonEnabled: toBoolean(
                    source.buttonEnabled ?? source.showButton,
                    false,
                ),
                buttonText: toText(source.buttonText),
                buttonLink: normalizeBannerLink(source.buttonLink),
                buttonColor: normalizeButtonColor(source.buttonColor),
            };
        })
        .sort((a, b) => a.order - b.order);
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

    const firstSlide = slides[0] || null;
    const firstDesktopImage = firstSlide?.photodesktop
        ? resolveMediaUrl(firstSlide.photodesktop)
        : "";
    const firstMobileImage = firstSlide?.photomobile
        ? resolveMediaUrl(firstSlide.photomobile)
        : "";
    const firstDesktopSrc = getOptimizedImageUrl(firstDesktopImage, {
        variant: "hero",
        width: 1600,
    });
    const firstDesktopSrcSet = buildOptimizedImageSrcSet(firstDesktopImage, {
        variant: "hero",
        maxWidth: 1920,
    });
    const firstMobileSrc = getOptimizedImageUrl(firstMobileImage, {
        variant: "hero",
        width: 768,
    });

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
            <Helmet>
                {firstDesktopSrc ? (
                    <link
                        rel="preload"
                        as="image"
                        href={firstDesktopSrc}
                        imageSrcSet={firstDesktopSrcSet || undefined}
                        imageSizes="100vw"
                        media="(min-width: 769px)"
                    />
                ) : null}
                {firstMobileSrc ? (
                    <link
                        rel="preload"
                        as="image"
                        href={firstMobileSrc}
                        media="(max-width: 768px)"
                    />
                ) : null}
            </Helmet>
            {/* ===== SLIDER ===== */}
            <Swiper
                modules={[Navigation, Pagination, Autoplay, Keyboard]}
                loop={slides.length > 1}
                autoHeight
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

                {slides.map((slide, index) => {
                    const hasButton =
                        slide.buttonEnabled &&
                        slide.buttonText &&
                        slide.buttonLink;
                    const hasMozAttribution = shouldShowMozAttribution(slide);
                    const buttonStyle = {
                        "--banner-button-accent": slide.buttonColor,
                    };
                    const isExternal = isExternalLink(slide.buttonLink);
                    const desktopImageUrl = slide.photodesktop
                        ? resolveMediaUrl(slide.photodesktop)
                        : "";
                    const mobileImageUrl = slide.photomobile
                        ? resolveMediaUrl(slide.photomobile)
                        : "";
                    const desktopSrc = getOptimizedImageUrl(desktopImageUrl, {
                        variant: "hero",
                        width: 1600,
                    });
                    const desktopSrcSet = buildOptimizedImageSrcSet(
                        desktopImageUrl,
                        {
                            variant: "hero",
                            maxWidth: 1920,
                        },
                    );
                    const mobileSrc = getOptimizedImageUrl(mobileImageUrl, {
                        variant: "hero",
                        width: 768,
                    });

                    return (
                        <SwiperSlide key={slide.id}>
                            <div className="banner-slide">
                                <picture>
                                    {/* MOBILE IMAGE */}
                                    <source
                                        media="(max-width: 768px)"
                                        srcSet={mobileSrc || undefined}
                                    />

                                    {/* DESKTOP IMAGE */}
                                    <img
                                        src={desktopSrc || desktopImageUrl || ""}
                                        srcSet={desktopSrcSet || undefined}
                                        sizes="100vw"
                                        alt={`Головний банер ${index + 1} медичного центру Для Людей у Дніпрі, Україна`}
                                        className="banner-image"
                                        loading={index === 0 ? "eager" : "lazy"}
                                        fetchpriority={index === 0 ? "high" : "auto"}
                                        decoding="async"
                                    />
                                </picture>

                                {hasButton ? (
                                    <a
                                        className="banner-button"
                                        href={slide.buttonLink}
                                        style={buttonStyle}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={
                                            isExternal
                                                ? "noopener noreferrer"
                                                : undefined
                                        }
                                    >
                                        <span className="banner-button__label">
                                            {slide.buttonText}
                                        </span>
                                        <span
                                            className="banner-button__icon"
                                            aria-hidden="true"
                                        />
                                    </a>
                                ) : null}

                                {hasMozAttribution ? (
                                    <p className="banner-attribution">
                                        Джерело:{" "}
                                        <a
                                            href={MOZ_SOURCE_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            МОЗ України
                                        </a>
                                    </p>
                                ) : null}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <div className="mobile-slogan">
                <span className="slogan-care">ДБАЄМО.</span>{" "}
                <span className="slogan-diagnose">ДІАГНОСТУЄМО.</span>{" "}
                <span className="slogan-treat">ЛІКУЄМО.</span>
            </div>
        </div>
    );
}
