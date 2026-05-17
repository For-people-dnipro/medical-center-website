const WEBP_AVAILABLE = new Set([
    "/images/ambulance.jpg",
    "/images/analyses-hero.jpg",
    "/images/analysesInfo.jpg",
    "/images/certificate-injections.jpg",
    "/images/consult-after-vaccine.jpg",
    "/images/consult-docs.jpg",
    "/images/consult-hero.jpg",
    "/images/consultation-before-vaccine.jpg",
    "/images/consultation.jpg",
    "/images/declaration-hero.jpg",
    "/images/diagnostics-hero.jpg",
    "/images/diagnostics-prepare.jpg",
    "/images/package-services.jpg",
    "/images/packages-hero-nurse.jpg",
    "/images/vacancy-hero.jpg",
    "/images/vaccination-hero.jpg",
    "/images/vaccination-section-picture.jpg",
    "/images/consultation-other-doctor.png",
]);

const IMAGE_DIMENSIONS = Object.freeze({
    "/images/about-us.jpg": { width: 1600, height: 1067 },
    "/images/vacancy-hero.jpg": { width: 1600, height: 1067 },
    "/images/vaccination-section-picture.jpg": { width: 1280, height: 853 },
    "/images/declaration-hero.jpg": { width: 1600, height: 1067 },
    "/images/consult-hero.jpg": { width: 1600, height: 1066 },
    "/images/diagnostics-hero.jpg": { width: 1600, height: 1066 },
    "/images/manipulation-hero.jpg": { width: 1600, height: 1067 },
    "/images/vaccination-hero.jpg": { width: 1600, height: 1067 },
    "/images/packages-hero-nurse.jpg": { width: 1600, height: 1067 },
    "/images/analyses-hero.jpg": { width: 1600, height: 900 },
    "/images/consultation.jpg": { width: 1600, height: 1067 },
    "/images/ambulance.jpg": { width: 1280, height: 853 },
    "/images/analysesInfo.jpg": { width: 1280, height: 855 },
    "/images/certificate-injections.jpg": { width: 1280, height: 853 },
    "/images/consult-after-vaccine.jpg": { width: 1280, height: 853 },
    "/images/consult-docs.jpg": { width: 1280, height: 853 },
    "/images/consultation-before-vaccine.jpg": { width: 1280, height: 853 },
    "/images/consultation-other-doctor.png": { width: 1280, height: 720 },
    "/images/diagnostics-prepare.jpg": { width: 1280, height: 853 },
    "/images/package-services.jpg": { width: 1280, height: 853 },
});

function toWebP(src) {
    return src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
}

export default function WebPImage({ src, alt = "", ...props }) {
    const {
        fetchpriority,
        fetchPriority = fetchpriority,
        width = IMAGE_DIMENSIONS[src]?.width,
        height = IMAGE_DIMENSIONS[src]?.height,
        decoding = "async",
        loading = "lazy",
        ...imageProps
    } = props;
    const normalizedImageProps = {
        ...imageProps,
        width,
        height,
        loading,
        decoding,
        fetchPriority,
    };

    if (src && WEBP_AVAILABLE.has(src)) {
        return (
            <picture>
                <source srcSet={toWebP(src)} type="image/webp" />
                <img src={src} alt={alt} {...normalizedImageProps} />
            </picture>
        );
    }

    return <img src={src} alt={alt} {...normalizedImageProps} />;
}
