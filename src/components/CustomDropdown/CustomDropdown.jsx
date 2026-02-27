import { useEffect, useMemo, useRef, useState } from "react";
import "./CustomDropdown.css";

function normalizeOption(option, fallbackId) {
    if (option && typeof option === "object") {
        return {
            value: String(option.value ?? ""),
            label: String(option.label || "—"),
            id: String(option.id ?? option.value ?? option.label ?? fallbackId),
        };
    }

    return {
        value: String(option ?? ""),
        label: String(option ?? "—"),
        id: fallbackId,
    };
}

export default function CustomDropdown({
    id,
    value,
    onChange,
    options = [],
    placeholder = "",
    emptyOptionLabel = "",
    ariaLabel = "",
    disabled = false,
    allowEmptyOption = true,
    className = "",
    ariaRequired = false,
    ariaInvalid = false,
    ariaDescribedBy = "",
}) {
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const selectedValue = String(value ?? "");
    const resolvedPlaceholder = placeholder || "Оберіть значення";
    const resolvedEmptyOptionLabel = emptyOptionLabel || resolvedPlaceholder;
    const isMenuOpen = !disabled && isOpen;

    const baseItems = useMemo(
        () =>
            options.map((option, index) =>
                normalizeOption(option, `${id}-opt-${index}`),
            ),
        [id, options],
    );

    const items = useMemo(() => {
        if (!allowEmptyOption) return baseItems;

        return [
            {
                value: "",
                label: resolvedEmptyOptionLabel,
                id: `${id}-empty`,
            },
            ...baseItems,
        ];
    }, [allowEmptyOption, baseItems, id, resolvedEmptyOptionLabel]);

    const activeItem =
        items.find((item) => item.value === selectedValue) || items[0];
    const triggerLabel = selectedValue ? activeItem?.label : resolvedPlaceholder;

    useEffect(() => {
        const handleOutsideClick = (event) => {
            const root = rootRef.current;
            if (!root || !(event.target instanceof Node)) return;
            if (!root.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key !== "Escape") return;
            setIsOpen(false);
            triggerRef.current?.focus();
        };

        const handleWindowBlur = () => {
            setIsOpen(false);
        };

        document.addEventListener("pointerdown", handleOutsideClick, {
            passive: true,
        });
        document.addEventListener("keydown", handleEscape);
        window.addEventListener("blur", handleWindowBlur);

        return () => {
            document.removeEventListener("pointerdown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
            window.removeEventListener("blur", handleWindowBlur);
        };
    }, []);

    const menuId = `${id}-menu`;
    const rootClassName = [
        "custom-dropdown",
        isMenuOpen && "is-open",
        disabled && "is-disabled",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div ref={rootRef} className={rootClassName}>
            <button
                id={id}
                ref={triggerRef}
                type="button"
                className="custom-dropdown__trigger"
                aria-label={ariaLabel || resolvedPlaceholder}
                aria-haspopup="listbox"
                aria-expanded={isMenuOpen}
                aria-controls={menuId}
                aria-required={ariaRequired || undefined}
                aria-invalid={ariaInvalid}
                aria-describedby={ariaDescribedBy || undefined}
                disabled={disabled}
                onClick={() => setIsOpen((state) => !state)}
            >
                <span
                    className={`custom-dropdown__trigger-label${
                        selectedValue ? "" : " is-placeholder"
                    }`}
                >
                    {triggerLabel}
                </span>
                <img
                    src="/icons/arrow-down.svg"
                    alt=""
                    aria-hidden="true"
                    className={`custom-dropdown__arrow${isMenuOpen ? " is-open" : ""}`}
                />
            </button>

            <div
                id={menuId}
                className={`custom-dropdown__menu${isMenuOpen ? " is-open" : ""}`}
                role="listbox"
                aria-label={ariaLabel || resolvedPlaceholder}
                aria-hidden={!isMenuOpen}
            >
                {items.map((item) => {
                    const isActive = item.value === selectedValue;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            tabIndex={isMenuOpen ? 0 : -1}
                            className={`custom-dropdown__option${
                                isActive ? " is-active" : ""
                            }`}
                            onClick={() => {
                                onChange?.(item.value);
                                setIsOpen(false);
                            }}
                        >
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
