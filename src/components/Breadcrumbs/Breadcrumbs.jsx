import { Link } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";

export default function Breadcrumbs({
    items = [],
    className = "",
    ariaLabel = "Breadcrumb",
    separator = "›",
    allowLastLink = false,
}) {
    const sanitizedItems = items
        .map((item) => {
            if (!item || typeof item !== "object") return null;

            const label =
                (typeof item.label === "string" && item.label.trim()) ||
                (typeof item.title === "string" && item.title.trim()) ||
                "";
            const to =
                (typeof item.to === "string" && item.to.trim()) ||
                (typeof item.link === "string" && item.link.trim()) ||
                "";

            if (!label) return null;

            return {
                ...item,
                label,
                to,
            };
        })
        .filter(Boolean);

    if (sanitizedItems.length === 0) {
        return null;
    }

    const rootClassName = [styles.breadcrumbs, className]
        .filter(Boolean)
        .join(" ");

    return (
        <nav className={rootClassName} aria-label={ariaLabel}>
            {sanitizedItems.map((item, index) => {
                const isLast = index === sanitizedItems.length - 1;
                const shouldRenderLink =
                    Boolean(item.to) && (!isLast || allowLastLink);
                const key = `${item.to || item.link || "current"}-${item.label}-${index}`;

                return (
                    <span key={key} className={styles.item}>
                        {shouldRenderLink ? (
                            <Link to={item.to} className={styles.link}>
                                {item.label}
                            </Link>
                        ) : (
                            <span className={styles.current} aria-current="page">
                                {item.label}
                            </span>
                        )}

                        {!isLast ? (
                            <span className={styles.separator} aria-hidden="true">
                                {separator}
                            </span>
                        ) : null}
                    </span>
                );
            })}
        </nav>
    );
}
