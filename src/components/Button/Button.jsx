import "./Button.css";

export default function Button({
    children,
    href = "#",
    withArrow = true,
    className = "",
}) {
    return (
        <a href={href} className={`ui-button ${className}`}>
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
