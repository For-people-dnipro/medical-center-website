import { Link } from "react-router-dom";
import { getResponsiveImageProps } from "../../api/foundation";
import {
    formatExperienceYearsLabel,
    getDoctorCardSummary,
    getDoctorDisplayName,
} from "../../api/doctorsApi";
import "./DoctorCard.css";

function getInitials(name) {
    return (name || "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function getSplitNameParts(doctor, displayName) {
    const lastName = String(doctor?.lastName || "").trim();
    const firstName = String(doctor?.firstName || "").trim();

    if (lastName && firstName) {
        return {
            firstLine: lastName,
            secondLine: firstName,
        };
    }

    const full = String(displayName || "").trim();
    if (!full) return null;

    const parts = full.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return {
            firstLine: parts[0],
            secondLine: parts.slice(1).join(" "),
        };
    }

    return null;
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

function resolveExperienceYears(doctor) {
    const currentYear = new Date().getFullYear();
    const startYear = parseStartYear(doctor?.startYear);

    if (startYear === null) return null;
    const yearsOfExperience = currentYear - startYear;
    if (yearsOfExperience <= 0) return 1;

    return yearsOfExperience;
}

export default function DoctorCard({
    doctor,
    className = "",
    href,
    showSpecialisation = true,
    asLink = true,
    priority = false,
}) {
    if (!doctor) return null;

    const cardClassName = ["doctor-card", className].filter(Boolean).join(" ");
    const displayName = getDoctorDisplayName(doctor);
    const summaryLine = getDoctorCardSummary(doctor);
    const cardHref = href || `/doctors/${doctor.slug}`;
    const years = resolveExperienceYears(doctor);
    const shouldShowBadge = years !== null;
    const splitName = getSplitNameParts(doctor, displayName);
    const doctorImageAlt = `Сімейний лікар ${displayName} — медичний центр Для Людей, Дніпро`;
    const imageLoading = priority ? "eager" : "lazy";
    const imageFetchPriority = priority ? "high" : "auto";
    const imageProps = getResponsiveImageProps(doctor.photo, {
        variant: "card",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw",
    });

    const cardContent = (
        <>
            <div className="doctor-card__image-wrap">
                {imageProps?.src ? (
                    <img
                        className="doctor-card__image"
                        src={imageProps.src}
                        srcSet={imageProps.srcSet}
                        sizes={imageProps.sizes}
                        alt={doctorImageAlt}
                        width={imageProps.width || 720}
                        height={imageProps.height || 880}
                        loading={imageLoading}
                        fetchpriority={imageFetchPriority}
                        decoding="async"
                    />
                ) : (
                    <div className="doctor-card__image doctor-card__image--placeholder">
                        <span>{getInitials(displayName) || "Л"}</span>
                    </div>
                )}

                {shouldShowBadge ? (
                    <div className="doctor-card__experience" aria-hidden="true">
                        <div className="doctor-card__experience-number">{years}</div>
                        <div className="doctor-card__experience-line" />
                        <div className="doctor-card__experience-text">
                            {formatExperienceYearsLabel(years)}
                            <br />
                            досвіду
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="doctor-card__body">
                <h3
                    className={`doctor-card__name${
                        splitName ? " doctor-card__name--split" : ""
                    }`}
                >
                    {splitName ? (
                        <>
                            <span className="doctor-card__name-line">
                                {splitName.firstLine}
                            </span>
                            <span className="doctor-card__name-line">
                                {splitName.secondLine}
                            </span>
                        </>
                    ) : (
                        displayName
                    )}
                </h3>
                {showSpecialisation && summaryLine ? (
                    <p className="doctor-card__specialisation">{summaryLine}</p>
                ) : null}
            </div>
        </>
    );

    return (
        <article className={cardClassName}>
            {asLink ? (
                <Link className="doctor-card__link" to={cardHref}>
                    {cardContent}
                </Link>
            ) : (
                <div className="doctor-card__link">{cardContent}</div>
            )}
        </article>
    );
}
