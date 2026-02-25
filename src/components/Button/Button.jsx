import "./Button.css";

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

    if (isLink) {
        return (
            <a
                href={href}
                className={buttonClassName}
                onClick={onClick}
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
