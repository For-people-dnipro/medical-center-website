import { Link } from "react-router-dom";
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

export default function DoctorCard({
    doctor,
    className = "",
    href,
    showSpecialisation = true,
}) {
    if (!doctor) return null;

    const cardClassName = ["doctor-card", className].filter(Boolean).join(" ");
    const displayName = getDoctorDisplayName(doctor);
    const summaryLine = getDoctorCardSummary(doctor);
    const cardHref = href || `/doctors/${doctor.slug}`;
    const years = Number(doctor.experienceYears) || 0;
    const shouldShowBadge = years > 0;
    const splitName = getSplitNameParts(doctor, displayName);

    return (
        <article className={cardClassName}>
            <Link className="doctor-card__link" to={cardHref}>
                <div className="doctor-card__image-wrap">
                    {doctor.photo?.url ? (
                        <img
                            className="doctor-card__image"
                            src={doctor.photo.url}
                            alt={displayName}
                            width={doctor.photo.width || 720}
                            height={doctor.photo.height || 880}
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <div className="doctor-card__image doctor-card__image--placeholder">
                            <span>{getInitials(displayName) || "Л"}</span>
                        </div>
                    )}

                    {shouldShowBadge ? (
                        <div className="doctor-card__experience" aria-hidden="true">
                            <div className="doctor-card__experience-number">
                                {years}
                            </div>
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
                        <p className="doctor-card__specialisation">
                            {summaryLine}
                        </p>
                    ) : null}
                </div>
            </Link>
        </article>
    );
}
