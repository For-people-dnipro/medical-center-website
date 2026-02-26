import Button from "../Button/Button";
import "./LoadMoreButton.css";

export default function LoadMoreButton({
    onClick,
    disabled = false,
    isLoading = false,
    label = "Показати більше",
    loadingLabel = "Завантаження...",
    className = "",
}) {
    const text = isLoading ? loadingLabel : label;

    return (
        <Button
            href={null}
            type="button"
            className={`load-more-button arrow-down ${className}`.trim()}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </Button>
    );
}
