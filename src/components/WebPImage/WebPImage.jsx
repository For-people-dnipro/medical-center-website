/**
 * Рендерить <picture> з WebP-версією якщо вона існує поруч з оригіналом.
 * Якщо WebP немає — просто рендерить <img>.
 *
 * Використання:
 *   <WebPImage src="/images/hero.jpg" alt="Hero" className="hero-img" loading="eager" />
 */

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

function toWebP(src) {
    return src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
}

export default function WebPImage({ src, alt = "", ...props }) {
    if (src && WEBP_AVAILABLE.has(src)) {
        return (
            <picture>
                <source srcSet={toWebP(src)} type="image/webp" />
                <img src={src} alt={alt} {...props} />
            </picture>
        );
    }

    return <img src={src} alt={alt} {...props} />;
}
