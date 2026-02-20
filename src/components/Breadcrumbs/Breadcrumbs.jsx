import { Link } from "react-router-dom";
import "./Breadcrumbs.css";

export default function Breadcrumbs({
    items = [],
    className = "",
    ariaLabel = "Breadcrumb",
    separator = "›",
}) {
    const sanitizedItems = items.filter(
        (item) => item && typeof item.label === "string" && item.label.trim(),
    );

    if (sanitizedItems.length === 0) {
        return null;
    }

    const rootClassName = ["breadcrumbs", className].filter(Boolean).join(" ");

    return (
        <nav className={rootClassName} aria-label={ariaLabel}>
            {sanitizedItems.map((item, index) => {
                const isLast = index === sanitizedItems.length - 1;
                const key = `${item.to || "current"}-${item.label}-${index}`;

                return (
                    <span key={key} className="breadcrumbs__item">
                        {item.to && !isLast ? (
                            <Link to={item.to}>{item.label}</Link>
                        ) : (
                            <span className="current" aria-current="page">
                                {item.label}
                            </span>
                        )}

                        {!isLast ? (
                            <span className="crumb-separator" aria-hidden="true">
                                {separator}
                            </span>
                        ) : null}
                    </span>
                );
            })}
        </nav>
    );
}
