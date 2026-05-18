import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
    API_BASE_URL,
    LOCAL_STRAPI_FALLBACK,
    buildOptimizedImageSrcSet,
    getOptimizedImageUrl,
} from "../../api/foundation";

import "./Banner.css";

const STRAPI_URL = API_BASE_URL || LOCAL_STRAPI_FALLBACK;
const HOME_SLIDES_ENDPOINT =
    `${STRAPI_URL}/api/home-sliders?` +
    new URLSearchParams({
        "fields[0]": "order",
        "fields[1]": "buttonEnabled",
        "fields[2]": "buttonText",
        "fields[3]": "buttonLink",
        "fields[4]": "buttonColor",
        "sort[0]": "order:asc",
        "populate[0]": "photodesktop",
        "populate[1]": "photomobile",
    }).toString();
const DEFAULT_BUTTON_COLOR = "#302528";
const MOZ_SOURCE_URL = "https://moz.gov.ua";
const DESKTOP_HERO_WIDTH = 1920;
const DESKTOP_HERO_HEIGHT = 900;
const MOBILE_HERO_WIDTH = 768;
const MOZ_ATTRIBUTION_ASSET_MARKERS = [
    "Vam_40_Projdit_Skrining_zdorov_ya_40",
    "1850_3_401a7bac50",
];
const STATIC_HOME_SLIDES = Object.freeze([
    {
        id: "static-home-slide-1",
        order: 1,
        photodesktop:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/baner_1_nout_a6ff75aa64.webp",
        photodesktopSrcSet:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/medium_baner_1_nout_a6ff75aa64.webp 768w, https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/large_baner_1_nout_a6ff75aa64.webp 1200w, https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/xlarge_baner_1_nout_a6ff75aa64.webp 1600w, https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/baner_1_nout_a6ff75aa64.webp 1920w",
        photodesktopAvif:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/baner_1_nout_ecfa01a432.avif",
        photodesktopAvifSrcSet:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/baner_1_nout_ecfa01a432.avif",
        photomobile:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/baner_1_tf_5e7797be8d.webp",
        photomobileSrcSet:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/small_baner_1_tf_5e7797be8d.webp 280w, https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/medium_baner_1_tf_5e7797be8d.webp 448w, https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/large_baner_1_tf_5e7797be8d.webp 701w, https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/xlarge_baner_1_tf_5e7797be8d.webp 934w, https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/baner_1_tf_5e7797be8d.webp 1080w",
        photomobileAvif:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/1_0701208817.avif",
        photomobileAvifSrcSet:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/1_0701208817.avif",
        buttonEnabled: false,
        buttonText: "",
        buttonLink: "",
        buttonColor: DEFAULT_BUTTON_COLOR,
    },
    {
        id: "static-home-slide-2",
        order: 2,
        photodesktop:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/Vam_40_Projdit_Skrining_zdorov_ya_40_bezoplatno_v_nashih_medichnih_czentrah_Knopka_DETALNI_Sh_E_3_e91ce1b227.webp",
        photodesktopSrcSet:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/medium_Vam_40_Projdit_Skrining_zdorov_ya_40_bezoplatno_v_nashih_medichnih_czentrah_Knopka_DETALNI_Sh_E_3_e91ce1b227.webp 768w, https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/large_Vam_40_Projdit_Skrining_zdorov_ya_40_bezoplatno_v_nashih_medichnih_czentrah_Knopka_DETALNI_Sh_E_3_e91ce1b227.webp 1200w, https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/xlarge_Vam_40_Projdit_Skrining_zdorov_ya_40_bezoplatno_v_nashih_medichnih_czentrah_Knopka_DETALNI_Sh_E_3_e91ce1b227.webp 1600w, https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/Vam_40_Projdit_Skrining_zdorov_ya_40_bezoplatno_v_nashih_medichnih_czentrah_Knopka_DETALNI_Sh_E_3_e91ce1b227.webp 1920w",
        photomobile:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/2_bc91ebbbbf.avif",
        photomobileSrcSet:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/2_bc91ebbbbf.avif",
        photomobileAvif:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/2_bc91ebbbbf.avif",
        photomobileAvifSrcSet:
            "https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev/2_bc91ebbbbf.avif",
        buttonEnabled: true,
        buttonText: "ДЕТАЛЬНІШЕ",
        buttonLink: "/screening-40-plus",
        buttonColor: "#302528",
    },
]);

let cachedSlides = null;
let pendingSlidesRequest = null;

function runWhenBrowserIsIdle(callback, timeout = 1800) {
    if (typeof window === "undefined") return undefined;

    if ("requestIdleCallback" in window) {
        const idleId = window.requestIdleCallback(callback, { timeout });
        return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(callback, timeout);
    return () => window.clearTimeout(timeoutId);
}

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

function buildMediaSrcSet(media) {
    const source = pickSource(media?.data ?? media);
    const formats =
        source?.formats && typeof source.formats === "object" ? source.formats : {};
    const candidates = [
        formats.small,
        formats.medium,
        formats.large,
        formats.xlarge,
        source,
    ];
    const seenUrls = new Set();

    return candidates
        .map((candidate) => {
            const url = toText(candidate?.url);
            const width = Number(candidate?.width);

            if (!url || !Number.isFinite(width) || width <= 0 || seenUrls.has(url)) {
                return "";
            }

            seenUrls.add(url);
            return `${resolveMediaUrl(url)} ${Math.round(width)}w`;
        })
        .filter(Boolean)
        .join(", ");
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
                photodesktopSrcSet: buildMediaSrcSet(source.photodesktop),
                photomobile: pickMediaPath(source.photomobile),
                photomobileSrcSet: buildMediaSrcSet(source.photomobile),
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
        Array.isArray(cachedSlides) ? cachedSlides : STATIC_HOME_SLIDES,
    );
    const [activeIndex, setActiveIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [direction, setDirection] = useState("next");
    const [isPaused, setIsPaused] = useState(false);
    const isAnimatingRef = useRef(false);
    const touchStartXRef = useRef(null);
    const touchStartYRef = useRef(null);

    const changeSlide = (computeNextIndex, dir) => {
        if (isAnimatingRef.current) return;
        setActiveIndex((currentIndex) => {
            const nextIndex =
                typeof computeNextIndex === "function"
                    ? computeNextIndex(currentIndex)
                    : computeNextIndex;
            if (nextIndex === currentIndex) return currentIndex;
            isAnimatingRef.current = true;
            setDirection(dir);
            setPrevIndex(currentIndex);
            return nextIndex;
        });
    };

    useEffect(() => {
        if (prevIndex === null) return undefined;
        const timeoutId = window.setTimeout(() => {
            setPrevIndex(null);
            isAnimatingRef.current = false;
        }, 600);
        return () => window.clearTimeout(timeoutId);
    }, [prevIndex, activeIndex]);

    useEffect(() => {
        let isMounted = true;

        const cancelIdle = runWhenBrowserIsIdle(() => {
            loadSlides()
                .then((nextSlides) => {
                    if (!isMounted || !Array.isArray(nextSlides)) return;
                    if (nextSlides.length > 0) {
                        setSlides(nextSlides);
                    }
                })
                .catch((error) => {
                    if (!isMounted) return;
                    console.error(error);
                });
        });

        return () => {
            isMounted = false;
            cancelIdle?.();
        };
    }, []);

    useEffect(() => {
        if (slides.length <= 1 || isPaused) return undefined;

        const intervalId = window.setInterval(() => {
            changeSlide(
                (currentIndex) => (currentIndex + 1) % slides.length,
                "next",
            );
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, [slides.length, isPaused]);

    const handleTouchStart = (event) => {
        const touch = event.touches[0];
        if (!touch) return;
        touchStartXRef.current = touch.clientX;
        touchStartYRef.current = touch.clientY;
        setIsPaused(true);
    };

    const handleTouchEnd = (event) => {
        const startX = touchStartXRef.current;
        const startY = touchStartYRef.current;
        touchStartXRef.current = null;
        touchStartYRef.current = null;
        setIsPaused(false);

        if (startX === null) return;
        const touch = event.changedTouches[0];
        if (!touch) return;
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - (startY ?? touch.clientY);

        if (
            Math.abs(deltaX) < 40 ||
            Math.abs(deltaX) <= Math.abs(deltaY)
        ) {
            return;
        }

        if (deltaX < 0) showNextSlide();
        else showPreviousSlide();
    };

    const handleTouchCancel = () => {
        touchStartXRef.current = null;
        touchStartYRef.current = null;
        setIsPaused(false);
    };

    const handlePointerEnter = () => setIsPaused(true);
    const handlePointerLeave = () => setIsPaused(false);

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
    }) || firstSlide?.photodesktopSrcSet || "";
    const firstMobileSrc = getOptimizedImageUrl(firstMobileImage, {
        variant: "hero",
        width: MOBILE_HERO_WIDTH,
    });
    const firstMobileSrcSet = buildOptimizedImageSrcSet(firstMobileImage, {
        variant: "hero",
        maxWidth: MOBILE_HERO_WIDTH,
    }) || firstSlide?.photomobileSrcSet || "";

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

    const safeActiveIndex = Math.min(activeIndex, slides.length - 1);

    const showPreviousSlide = () => {
        changeSlide(
            (currentIndex) =>
                currentIndex === 0 ? slides.length - 1 : currentIndex - 1,
            "prev",
        );
    };

    const showNextSlide = () => {
        changeSlide(
            (currentIndex) => (currentIndex + 1) % slides.length,
            "next",
        );
    };

    const handleSliderKeyDown = (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            showPreviousSlide();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            showNextSlide();
        }
    };

    useEffect(() => {
        if (slides.length <= 1) return undefined;

        const handler = (event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            const target = event.target;
            if (
                target instanceof HTMLElement &&
                (target.matches("input, textarea, select, [contenteditable]") ||
                    target.isContentEditable)
            ) {
                return;
            }
            if (event.key === "ArrowLeft") showPreviousSlide();
            else showNextSlide();
        };

        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [slides.length]);

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
                        imageSrcSet={firstMobileSrcSet || undefined}
                        imageSizes="100vw"
                        media="(max-width: 768px)"
                    />
                ) : null}
            </Helmet>
            <div
                className="banner-slider"
                data-direction={direction}
                role="region"
                aria-label="Головний банер"
                onKeyDown={handleSliderKeyDown}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
            >
                <button
                    type="button"
                    className="banner-arrow banner-arrow-left"
                    aria-label="Попередній слайд"
                    onClick={showPreviousSlide}
                >
                    <img src="/icons/arrow-left.svg" alt="" aria-hidden="true" />
                </button>

                <button
                    type="button"
                    className="banner-arrow banner-arrow-right"
                    aria-label="Наступний слайд"
                    onClick={showNextSlide}
                >
                    <img src="/icons/arrow-right.svg" alt="" aria-hidden="true" />
                </button>

                {slides.map((slide, index) => {
                    const isActive = index === safeActiveIndex;
                    const isPrev = index === prevIndex;
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
                        width: MOBILE_HERO_WIDTH,
                    });
                    const mobileSrcSet = buildOptimizedImageSrcSet(mobileImageUrl, {
                        variant: "hero",
                        maxWidth: MOBILE_HERO_WIDTH,
                    });

                    const isAnimating = prevIndex !== null;

                    return (
                        <div
                            key={slide.id}
                            className={[
                                "banner-slide",
                                isActive ? "banner-slide--active" : "",
                                isPrev ? "banner-slide--prev" : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            data-anim={
                                isAnimating && (isActive || isPrev)
                                    ? direction
                                    : undefined
                            }
                            aria-hidden={!isActive}
                        >
                            <picture>
                                {slide.photomobileAvifSrcSet ? (
                                    <source
                                        type="image/avif"
                                        media="(max-width: 768px)"
                                        srcSet={slide.photomobileAvifSrcSet}
                                        sizes="100vw"
                                    />
                                ) : null}
                                {slide.photodesktopAvifSrcSet ? (
                                    <source
                                        type="image/avif"
                                        srcSet={slide.photodesktopAvifSrcSet}
                                        sizes="100vw"
                                    />
                                ) : null}
                                <source
                                    media="(max-width: 768px)"
                                    srcSet={
                                        mobileSrcSet ||
                                        slide.photomobileSrcSet ||
                                        mobileSrc ||
                                        undefined
                                    }
                                    sizes="100vw"
                                />

                                <img
                                    src={desktopSrc || desktopImageUrl || ""}
                                    srcSet={
                                        desktopSrcSet ||
                                        slide.photodesktopSrcSet ||
                                        undefined
                                    }
                                    sizes="100vw"
                                    width={DESKTOP_HERO_WIDTH}
                                    height={DESKTOP_HERO_HEIGHT}
                                    alt={`Головний банер ${index + 1} медичного центру Для Людей у Дніпрі, Україна`}
                                    className="banner-image"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    fetchPriority={
                                        index === 0 ? "high" : "auto"
                                    }
                                    decoding={index === 0 ? "sync" : "async"}
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
                    );
                })}

                {slides.length > 1 ? (
                    <div className="banner-pagination" aria-hidden="true">
                        {slides.map((slide, index) => (
                            <span
                                key={`${slide.id}-dot`}
                                className={[
                                    "banner-pagination__bullet",
                                    index === safeActiveIndex
                                        ? "banner-pagination__bullet--active"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            />
                        ))}
                    </div>
                ) : null}
            </div>

            <div className="mobile-slogan">
                <span className="slogan-care">ДБАЄМО.</span>{" "}
                <span className="slogan-diagnose">ДІАГНОСТУЄМО.</span>{" "}
                <span className="slogan-treat">ЛІКУЄМО.</span>
            </div>
        </div>
    );
}
