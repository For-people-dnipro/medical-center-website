import BranchesMap from "../BranchesMap";
import "./BranchCard.css";

export default function BranchCard({ branch, className = "" }) {
    if (!branch) return null;

    const rootClassName = ["branch-card", className].filter(Boolean).join(" ");
    const title = branch.address || branch.name || "Філія";
    const descriptionText = branch.description || "";
    const descriptionParts = descriptionText
        ? descriptionText
              .split(/\n{2,}/)
              .map((part) => part.trim())
              .filter(Boolean)
        : [];
    const hasMap = Boolean(
        (Array.isArray(branch.mapMarkers) && branch.mapMarkers.length > 0) ||
            branch.mapCenter,
    );

    return (
        <article className={rootClassName}>
            <div className="branch-card__content">
                <div className="branch-card__top">
                    <h2 className="branch-card__title">{title}</h2>

                    {descriptionParts.length > 0 ? (
                        <div className="branch-card__description">
                            {descriptionParts.map((part) => (
                                <p key={part}>{part}</p>
                            ))}
                        </div>
                    ) : null}
                </div>

                {(branch.hours || branch.phoneDisplay) && (
                    <div className="branch-card__meta">
                        {branch.hours ? (
                            <div className="branch-card__meta-item">
                                <p className="branch-card__meta-label">
                                    Графік роботи:
                                </p>
                                <p className="branch-card__meta-value">
                                    {branch.hours}
                                </p>
                            </div>
                        ) : null}

                        {branch.phoneDisplay ? (
                            <div className="branch-card__meta-item">
                                <p className="branch-card__meta-label">
                                    Контактний номер:
                                </p>
                                <p className="branch-card__meta-value">
                                    {branch.phoneHref ? (
                                        <a href={`tel:${branch.phoneHref}`}>
                                            {branch.phoneDisplay}
                                        </a>
                                    ) : (
                                        branch.phoneDisplay
                                    )}
                                </p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            {hasMap ? (
                <div className="branch-card__map">
                    <BranchesMap
                        branches={branch.mapMarkers}
                        center={branch.mapCenter}
                        zoom={14}
                        borderRadius={0}
                    />
                </div>
            ) : null}
        </article>
    );
}

