import "./Button.css";
import { Link } from "react-router-dom";

export default function Button({
    children,
    href = "#",
    withArrow = true,
    className = "",
    onClick,
    type = "button",
    disabled = false,
}) {
    const buttonClassName = `ui-button ${className}`.trim();
    const isLink = href !== null && href !== undefined;
    const safeHref = typeof href === "string" ? href.trim() : "";
    const isInternalRoute =
        safeHref.length > 0 &&
        safeHref.startsWith("/") &&
        !safeHref.startsWith("//");

    const handleLinkClick = (event) => {
        if (disabled) {
            event.preventDefault();
            return;
        }

        if (typeof onClick === "function") {
            onClick(event);
        }
    };

    if (isLink) {
        if (isInternalRoute) {
            return (
                <Link
                    to={safeHref}
                    className={buttonClassName}
                    onClick={handleLinkClick}
                    aria-disabled={disabled || undefined}
                    tabIndex={disabled ? -1 : undefined}
                >
                    <span className="ui-button-text">{children}</span>

                    {withArrow && (
                        <img
                            src="/icons/arrow-right.svg"
                            alt=""
                            className="ui-button-arrow"
                        />
                    )}
                </Link>
            );
        }

        return (
            <a
                href={safeHref || "#"}
                className={buttonClassName}
                onClick={handleLinkClick}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : undefined}
            >
                <span className="ui-button-text">{children}</span>

                {withArrow && (
                    <img
                        src="/icons/arrow-right.svg"
                        alt=""
                        className="ui-button-arrow"
                    />
                )}
            </a>
        );
    }

    return (
        <button
            type={type}
            className={buttonClassName}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="ui-button-text">{children}</span>

            {withArrow && (
                <img
                    src="/icons/arrow-right.svg"
                    alt=""
                    className="ui-button-arrow"
                />
            )}
        </button>
    );
}
