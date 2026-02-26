import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import "./DoctorFilters.css";

function DoctorFiltersDropdown({
    id,
    value,
    onChange,
    options = [],
    placeholder = "",
    emptyOptionLabel = "",
    ariaLabel = "",
    disabled = false,
}) {
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const selectedValue = String(value ?? "");
    const resolvedPlaceholder = placeholder || "Оберіть значення";
    const resolvedEmptyOptionLabel = emptyOptionLabel || resolvedPlaceholder;

    const items = useMemo(
        () => [
            {
                value: "",
                label: resolvedEmptyOptionLabel,
                id: `${id}-empty`,
            },
            ...options.map((option, index) => ({
                value: String(option?.value ?? ""),
                label: String(option?.label || "—"),
                id: option?.value ?? option?.label ?? `${id}-opt-${index}`,
            })),
        ],
        [id, options, resolvedEmptyOptionLabel],
    );

    const activeItem =
        items.find((item) => item.value === selectedValue) || items[0];
    const triggerLabel = selectedValue ? activeItem.label : resolvedPlaceholder;

    useEffect(() => {
        if (disabled) {
            setIsOpen(false);
        }
    }, [disabled]);

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

    return (
        <div
            ref={rootRef}
            className={`doctor-filters__select-wrap doctor-filters__select${
                isOpen ? " is-open" : ""
            }${disabled ? " is-disabled" : ""}`}
        >
            <button
                id={id}
                ref={triggerRef}
                type="button"
                className="doctor-filters__select-trigger"
                aria-label={ariaLabel || resolvedPlaceholder}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={menuId}
                disabled={disabled}
                onClick={() => setIsOpen((state) => !state)}
            >
                <span
                    className={`doctor-filters__select-trigger-label${
                        selectedValue ? "" : " is-placeholder"
                    }`}
                >
                    {triggerLabel}
                </span>
                <img
                    src="/icons/arrow-down.svg"
                    alt=""
                    aria-hidden="true"
                    className={`doctor-filters__select-arrow${
                        isOpen ? " is-open" : ""
                    }`}
                />
            </button>

            <div
                id={menuId}
                className={`doctor-filters__select-menu${isOpen ? " is-open" : ""}`}
                role="listbox"
                aria-label={ariaLabel || resolvedPlaceholder}
                aria-hidden={!isOpen}
            >
                {items.map((item) => {
                    const isActive = item.value === selectedValue;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            tabIndex={isOpen ? 0 : -1}
                            className={`doctor-filters__select-option${
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

export default function DoctorFilters({
    searchValue,
    onSearchChange,
    searchPlaceholder = "",
    searchAriaLabel = "",
    branchValue,
    onBranchChange,
    branchOptions = [],
    branchFilterLabel = "",
    branchAriaLabel = "",
    branchDisabled = false,
    specialisationValue,
    onSpecialisationChange,
    specialisationOptions = [],
    specialisationFilterLabel = "",
    specialisationAriaLabel = "",
    specialisationDisabled = false,
    onReset,
    showReset = false,
    resetFiltersLabel = "",
    filtersAriaLabel = "",
}) {
    const resolvedSearchPlaceholder = searchPlaceholder || "Ім'я лікаря";
    const resolvedBranchLabel = branchFilterLabel || "Локація";
    const resolvedSpecialisationLabel =
        specialisationFilterLabel || "Спеціалізація";
    const resolvedResetLabel = resetFiltersLabel || "Скинути";

    return (
        <section
            className="doctor-filters"
            aria-label={filtersAriaLabel || "Фільтри лікарів"}
        >
            <div className="doctor-filters__search">
                <label
                    className="doctor-filters__sr-only"
                    htmlFor="doctor-search"
                >
                    {searchAriaLabel || resolvedSearchPlaceholder}
                </label>
                <input
                    id="doctor-search"
                    type="search"
                    value={searchValue}
                    onChange={(event) => onSearchChange?.(event.target.value)}
                    placeholder={resolvedSearchPlaceholder}
                    autoComplete="off"
                />
                <Search size={18} aria-hidden="true" />
            </div>

            <div className="doctor-filters__controls">
                <label
                    className="doctor-filters__sr-only"
                    htmlFor="doctor-branch"
                >
                    {branchAriaLabel || resolvedBranchLabel}
                </label>
                <DoctorFiltersDropdown
                    id="doctor-branch"
                    value={branchValue}
                    onChange={onBranchChange}
                    options={branchOptions}
                    placeholder={resolvedBranchLabel}
                    emptyOptionLabel="Усі локації"
                    ariaLabel={branchAriaLabel || resolvedBranchLabel}
                    disabled={branchDisabled}
                />

                <label
                    className="doctor-filters__sr-only"
                    htmlFor="doctor-specialisation"
                >
                    {specialisationAriaLabel || resolvedSpecialisationLabel}
                </label>
                <DoctorFiltersDropdown
                    id="doctor-specialisation"
                    value={specialisationValue}
                    onChange={onSpecialisationChange}
                    options={specialisationOptions}
                    placeholder={resolvedSpecialisationLabel}
                    emptyOptionLabel="Усі спеціалізації"
                    ariaLabel={
                        specialisationAriaLabel || resolvedSpecialisationLabel
                    }
                    disabled={specialisationDisabled}
                />

                {showReset ? (
                    <button
                        type="button"
                        className="doctor-filters__reset"
                        onClick={() => onReset?.()}
                    >
                        <X size={16} aria-hidden="true" />
                        <span>{resolvedResetLabel}</span>
                    </button>
                ) : null}
            </div>
        </section>
    );
}
