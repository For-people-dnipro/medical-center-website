import CustomDropdown from "../CustomDropdown/CustomDropdown";

export default function ContactFormFields({
    branchDropdownOptions,
    buttonText,
    fieldErrors,
    fields,
    formData,
    handleBranchChange,
    handleChange,
    labels,
    loading,
    placeholders,
}) {
    return (
        <>
            <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="honeypot"
                tabIndex="-1"
                autoComplete="off"
            />

            {fields.name && (
                <div className="form-group form-name">
                    <label>{labels.name}</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={placeholders.name}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.name)}
                    />
                </div>
            )}

            {fields.phone && (
                <div className="form-group form-phone">
                    <label>{labels.phone}</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={placeholders.phone}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.phone)}
                    />
                </div>
            )}

            {fields.email && (
                <div className="form-group form-email">
                    <label>{labels.email}</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={placeholders.email}
                        aria-invalid={Boolean(fieldErrors.email)}
                    />
                </div>
            )}

            {fields.branch && (
                <div className="form-group form-branch">
                    <label>{labels.branch}</label>
                    <CustomDropdown
                        id="contact-form-branch"
                        value={formData.branch}
                        onChange={handleBranchChange}
                        options={branchDropdownOptions}
                        placeholder={placeholders.branch}
                        ariaLabel={labels.branch}
                        allowEmptyOption={false}
                        className="contact-form__branch-dropdown"
                        ariaRequired="true"
                        ariaInvalid={Boolean(fieldErrors.branch)}
                    />
                </div>
            )}

            {fields.diagnostic && (
                <div className="form-group form-email">
                    <label>{labels.diagnostic}</label>
                    <input
                        type="text"
                        name="diagnostic"
                        value={formData.diagnostic}
                        onChange={handleChange}
                        placeholder={placeholders.diagnostic}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.diagnostic)}
                    />
                </div>
            )}

            {!fields.email && !fields.diagnostic && fields.checkupName && (
                <div className="form-group form-email">
                    <label>{labels.checkupName}</label>
                    <input
                        type="text"
                        name="checkupName"
                        value={formData.checkupName}
                        onChange={handleChange}
                        placeholder={placeholders.checkupName}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.checkupName)}
                    />
                </div>
            )}

            {fields.message && (
                <div className="form-message">
                    <label>{labels.message}</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={placeholders.message}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.message)}
                    />
                </div>
            )}

            <label className="form-consent">
                <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.consent)}
                />
                <span className="custom-checkbox" />
                <span className="form-consent__label">{labels.consent}</span>
            </label>

            <div className="form-button">
                <button type="submit" className="submit-button" disabled={loading}>
                    <span className="submit-button__text">
                        {loading ? "Надсилання..." : buttonText}
                    </span>
                    <span className="submit-button__icon">
                        <img src="/icons/arrow-right.svg" alt="" />
                    </span>
                </button>
            </div>
        </>
    );
}

