import { useEffect, useMemo, useRef, useState } from "react";
import "./NewsFilter.css";

export default function NewsFilter({
    themes = [],
    selectedTheme = "",
    onChange,
}) {
    const rootRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const options = useMemo(
        () => [
            { id: "all-themes", slug: "", name: "Усі теми" },
            ...themes
                .filter(
                    (theme) =>
                        typeof theme?.slug === "string" &&
                        typeof theme?.name === "string" &&
                        theme.slug.trim() &&
                        theme.name.trim(),
                )
                .map((theme) => ({
                    id: theme.id || theme.slug,
                    slug: theme.slug.trim(),
                    name: theme.name.trim(),
                })),
        ],
        [themes],
    );

    const activeOption =
        options.find((option) => option.slug === selectedTheme) || options[0];
    const triggerLabel = selectedTheme
        ? activeOption?.name || "Оберіть тему"
        : "Оберіть тему";

    useEffect(() => {
        const handleOutsideClick = (event) => {
            const root = rootRef.current;
            if (!root || !(event.target instanceof Node)) return;

            if (!root.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick, {
            passive: true,
        });
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div ref={rootRef} className={`news-filter ${isOpen ? "is-open" : ""}`}>
            <label className="news-filter__label" htmlFor="news-theme-filter">
                Тема новин
            </label>

            <div className="news-filter__control">
                <button
                    id="news-theme-filter"
                    type="button"
                    className="news-filter__trigger"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((state) => !state)}
                >
                    <span className="news-filter__trigger-label">
                        {triggerLabel}
                    </span>
                    <img
                        src="/icons/arrow-down.svg"
                        alt=""
                        aria-hidden="true"
                        className={`news-filter__trigger-arrow ${
                            isOpen ? "is-open" : ""
                        }`}
                    />
                </button>

                <div
                    className={`news-filter__menu ${isOpen ? "is-open" : ""}`}
                    role="listbox"
                    aria-label="Оберіть тему новин"
                >
                    {options.map((option) => {
                        const isActive = option.slug === selectedTheme;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                className={`news-filter__option ${
                                    isActive ? "is-active" : ""
                                }`}
                                onClick={() => {
                                    onChange?.(option.slug);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{option.name}</span>
                                {isActive ? (
                                    <span className="news-filter__option-check">
                                        <img
                                            src="/icons/arrow-down.svg"
                                            alt=""
                                        />
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
