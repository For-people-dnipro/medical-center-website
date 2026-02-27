import { Search, X } from "lucide-react";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import "./DoctorFilters.css";

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
                <CustomDropdown
                    id="doctor-branch"
                    value={branchValue}
                    onChange={onBranchChange}
                    options={branchOptions}
                    placeholder={resolvedBranchLabel}
                    emptyOptionLabel="Усі локації"
                    ariaLabel={branchAriaLabel || resolvedBranchLabel}
                    disabled={branchDisabled}
                    allowEmptyOption
                />

                <label
                    className="doctor-filters__sr-only"
                    htmlFor="doctor-specialisation"
                >
                    {specialisationAriaLabel || resolvedSpecialisationLabel}
                </label>
                <CustomDropdown
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
                    allowEmptyOption
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
