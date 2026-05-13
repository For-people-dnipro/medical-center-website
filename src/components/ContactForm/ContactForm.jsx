import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { buildApiUrl } from "../../api/foundation";
import { useIsEn } from "../../en/useIsEn";
import "./ContactForm.css";

const DEFAULTS_UA = {
    title: "МИ ЗАВЖДИ ПОРУЧ, ЩОБ ДОПОМОГТИ",
    mobileTitle: "ПОРУЧ, ЩОБ ДОПОМОГТИ",
    subtitle: "ЗАЛИШТЕ ПОВІДОМЛЕННЯ",
    formType: "Загальна базова форма",
    buttonText: "Надіслати повідомлення",
    labels: {
        name: "Імʼя *",
        phone: "Номер телефону *",
        email: "Електронна пошта",
        branch: "Оберіть філію медичного центру *",
        diagnostic: "Необхідна діагностика *",
        checkupName: "Назва CHECK-UP*",
        message: "Повідомлення *",
        consent: "Даю згоду на збір та обробку персональних даних",
    },
    placeholders: {
        name: "Ваше імʼя",
        phone: "Ваш номер телефону",
        email: "Ваша ел. пошта (за бажанням)",
        branch: "Оберіть філію",
        diagnostic: "Вкажіть назву процедури",
        checkupName: "Введіть назву CHECK-UP",
        message: "Що вас турбує?",
    },
    branchOptions: [
        "Ще не визначився(лась) / Потрібна консультація",
        "вул. Данила Галицького, 34",
        "просп. Богдана Хмельницького, 127",
        "бульвар Слави, 8",
    ],
    errors: {
        name: "Введіть, будь ласка, імʼя.",
        phone: "Введіть, будь ласка, номер телефону.",
        email: "Вкажіть коректну електронну пошту.",
        branch: "Оберіть, будь ласка, філію.",
        diagnostic: "Вкажіть, будь ласка, назву процедури.",
        checkupName: "Введіть, будь ласка, назву CHECK-UP.",
        message: "Введіть, будь ласка, повідомлення.",
        consent: "Потрібно надати згоду на обробку персональних даних.",
        generic: "Будь ласка, зателефонуйте нам або повторіть спробу пізніше, дякуємо.",
    },
    popup: {
        successTitle: "Повідомлення надіслано",
        successText: "Дякуємо! Ми зв’яжемося з вами найближчим часом.",
        errorTitle: "Сталася помилка.",
        closeAria: "Закрити",
    },
    detailsLabels: {
        form: "Форма",
        name: "Імʼя",
        phone: "Телефон",
        email: "Email",
        branch: "Філія",
        diagnostic: "Діагностика",
        checkupName: "Назва CHECK-UP",
        message: "Повідомлення",
        dateTime: "Дата та час",
    },
    dateLocale: "uk-UA",
};

const DEFAULTS_EN = {
    title: "WE ARE ALWAYS HERE TO HELP",
    mobileTitle: "HERE TO HELP",
    subtitle: "SEND US A MESSAGE",
    formType: "General contact form (EN)",
    buttonText: "Send message",
    labels: {
        name: "Name *",
        phone: "Phone number *",
        email: "Email",
        branch: "Choose a branch of the medical centre *",
        diagnostic: "Required diagnostics *",
        checkupName: "CHECK-UP name *",
        message: "Message *",
        consent: "I consent to the collection and processing of my personal data",
    },
    placeholders: {
        name: "Your name",
        phone: "Your phone number",
        email: "Your email (optional)",
        branch: "Choose a branch",
        diagnostic: "Specify the procedure name",
        checkupName: "Enter the CHECK-UP name",
        message: "What can we help you with?",
    },
    branchOptions: [
        "Not decided yet / Need consultation",
        "Danyla Halytskoho St., 34",
        "Bohdana Khmelnytskoho Ave., 127",
        "Slavy Blvd., 8",
    ],
    errors: {
        name: "Please enter your name.",
        phone: "Please enter your phone number.",
        email: "Please enter a valid email address.",
        branch: "Please choose a branch.",
        diagnostic: "Please specify the procedure name.",
        checkupName: "Please enter the CHECK-UP name.",
        message: "Please enter your message.",
        consent: "You need to consent to the processing of personal data.",
        generic: "Please call us or try again later. Thank you.",
    },
    popup: {
        successTitle: "Message sent",
        successText: "Thank you! We will get back to you shortly.",
        errorTitle: "An error occurred.",
        closeAria: "Close",
    },
    detailsLabels: {
        form: "Form",
        name: "Name",
        phone: "Phone",
        email: "Email",
        branch: "Branch",
        diagnostic: "Diagnostics",
        checkupName: "CHECK-UP name",
        message: "Message",
        dateTime: "Date and time",
    },
    dateLocale: "en-GB",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({
    title,
    subtitle,
    smallTitle,
    subtitleTag,

    formType,
    buttonText,

    fields = {
        name: true,
        phone: true,
        email: true,
        branch: true,
        diagnostic: false,
        checkupName: false,
        message: true,
    },

    labels,
    placeholders,
    detailsLabels = {},
    branchOptions,
}) {
    const isEn = useIsEn();
    const D = isEn ? DEFAULTS_EN : DEFAULTS_UA;

    // Resolve defaults from current locale. Caller-provided values always win.
    const resolvedSubtitle = subtitle ?? D.subtitle;
    const resolvedFormType = formType ?? D.formType;
    const resolvedButtonText = buttonText ?? D.buttonText;
    const resolvedLabels = labels ?? D.labels;
    const resolvedPlaceholders = placeholders ?? D.placeholders;
    const resolvedBranchOptions = branchOptions ?? D.branchOptions;
    const ERR = D.errors;
    const POPUP = D.popup;
    const resolvedDetailsLabels = {
        ...D.detailsLabels,
        ...detailsLabels,
    };

    const resolvedTitle = title ?? D.title;
    const resolvedSmallTitle =
        smallTitle ?? (title == null ? D.mobileTitle : undefined);
    const hasSmallTitle = Boolean(resolvedSmallTitle);
    const SubtitleTag = subtitleTag ?? "h3";
    const hasEmailLike =
        fields.email || fields.diagnostic || fields.checkupName;
    const formClassName = [
        "contact-form",
        !hasEmailLike && "contact-form--no-email",
        !fields.branch && "contact-form--no-branch",
    ]
        .filter(Boolean)
        .join(" ");

    const initialData = useMemo(() => {
        return {
            name: "",
            phone: "",
            email: "",
            branch: "",
            diagnostic: "",
            checkupName: "",
            message: "",
            consent: false,
            company: "",
        };
    }, []);

    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const clearFieldError = (fieldName) => {
        setFieldErrors((prev) => {
            if (!prev[fieldName]) return prev;
            const next = { ...prev };
            delete next[fieldName];
            return next;
        });
    };

    const branchDropdownOptions = useMemo(
        () =>
            (resolvedBranchOptions || [])
                .map((option) => {
                    if (option && typeof option === "object") {
                        const value = String(
                            option.value ?? option.label ?? "",
                        ).trim();
                        const label = String(
                            option.label ?? option.value ?? "—",
                        ).trim();
                        return value ? { value, label } : null;
                    }

                    const value = String(option ?? "").trim();
                    return value ? { value, label: value } : null;
                })
                .filter(Boolean),
        [resolvedBranchOptions],
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        clearFieldError(name);
    };

    const validateForm = (values) => {
        const errors = {};
        const getText = (candidate) => String(candidate || "").trim();

        if (fields.name && !getText(values.name)) {
            errors.name = ERR.name;
        }

        if (fields.phone && !getText(values.phone)) {
            errors.phone = ERR.phone;
        }

        if (fields.email && getText(values.email)) {
            if (!EMAIL_PATTERN.test(getText(values.email))) {
                errors.email = ERR.email;
            }
        }

        if (fields.branch && !getText(values.branch)) {
            errors.branch = ERR.branch;
        }

        if (fields.diagnostic && !getText(values.diagnostic)) {
            errors.diagnostic = ERR.diagnostic;
        }

        if (
            !fields.email &&
            !fields.diagnostic &&
            fields.checkupName &&
            !getText(values.checkupName)
        ) {
            errors.checkupName = ERR.checkupName;
        }

        if (fields.message && !getText(values.message)) {
            errors.message = ERR.message;
        }

        if (!values.consent) {
            errors.consent = ERR.consent;
        }

        return errors;
    };

    useEffect(() => {
        if (success || submitError) {
            const timer = setTimeout(() => {
                setSuccess(false);
                setSubmitError(false);
                setSubmitErrorMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, submitError]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setSuccess(false);
                setSubmitError(false);
                setSubmitErrorMessage("");
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.company) return;

        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);
        setSubmitError(false);
        setSuccess(false);
        setSubmitErrorMessage("");
        setFieldErrors({});

        const details = [];

        const addField = (label, value) => {
            if (value && value.trim() !== "") {
                details.push(`${label}: ${value}`);
            }
        };

        addField(resolvedDetailsLabels.form, resolvedFormType);

        if (fields.name) addField(resolvedDetailsLabels.name, formData.name);
        if (fields.phone) addField(resolvedDetailsLabels.phone, formData.phone);
        if (fields.email) addField(resolvedDetailsLabels.email, formData.email);
        if (fields.branch)
            addField(resolvedDetailsLabels.branch, formData.branch);
        if (fields.diagnostic)
            addField(resolvedDetailsLabels.diagnostic, formData.diagnostic);
        if (fields.checkupName)
            addField(resolvedDetailsLabels.checkupName, formData.checkupName);
        if (fields.message)
            addField(resolvedDetailsLabels.message, formData.message);

        addField(
            resolvedDetailsLabels.dateTime,
            new Date().toLocaleString(D.dateLocale),
        );
        const payload = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            branch: formData.branch,
            diagnostic: formData.diagnostic,
            checkupName: formData.checkupName,
            message: formData.message,
            consent: formData.consent,
            company: formData.company,
            details: details.join("\n"),
            formType: resolvedFormType,
        };

        try {
            const response = await fetch(buildApiUrl("/api/contact-submissions"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;

                try {
                    const errorPayload = await response.json();
                    if (typeof errorPayload?.message === "string" && errorPayload.message.trim()) {
                        errorMessage = errorPayload.message.trim();
                    } else if (
                        Array.isArray(errorPayload?.details) &&
                        errorPayload.details.length > 0
                    ) {
                        errorMessage = errorPayload.details.join(", ");
                    }
                } catch {
                    // Ignore JSON parsing failures for non-JSON error responses.
                }

                throw new Error(errorMessage);
            }

            setSuccess(true);
            setFormData(initialData);
        } catch (err) {
            console.error("Contact form submission error:", err);
            setSubmitErrorMessage(
                err instanceof Error && err.message
                    ? err.message
                    : ERR.generic,
            );
            setSubmitError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form
                className={formClassName}
                onSubmit={handleSubmit}
                onInvalid={(event) => event.preventDefault()}
                noValidate
            >
                <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="honeypot"
                    tabIndex="-1"
                    autoComplete="off"
                />

                <div className="form-header">
                    <h2
                        className={hasSmallTitle ? "form-title--has-small" : ""}
                    >
                        <span className="form-title-main">{resolvedTitle}</span>
                        {hasSmallTitle && (
                            <span className="form-title-small">
                                {resolvedSmallTitle}
                            </span>
                        )}
                    </h2>
                    {resolvedSubtitle && (
                        <SubtitleTag className="form-subtitle">
                            {resolvedSubtitle}
                        </SubtitleTag>
                    )}
                </div>

                {fields.name && (
                    <div className="form-group form-name">
                        <label>{resolvedLabels.name}</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={resolvedPlaceholders.name}
                            aria-required="true"
                            aria-invalid={Boolean(fieldErrors.name)}
                        />
                    </div>
                )}

                {fields.phone && (
                    <div className="form-group form-phone">
                        <label>{resolvedLabels.phone}</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={resolvedPlaceholders.phone}
                            aria-required="true"
                            aria-invalid={Boolean(fieldErrors.phone)}
                        />
                    </div>
                )}

                {fields.email && (
                    <div className="form-group form-email">
                        <label>{resolvedLabels.email}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={resolvedPlaceholders.email}
                            aria-invalid={Boolean(fieldErrors.email)}
                        />
                    </div>
                )}

                {fields.branch && (
                    <div className="form-group form-branch">
                        <label>{resolvedLabels.branch}</label>
                        <CustomDropdown
                            id="contact-form-branch"
                            value={formData.branch}
                            onChange={(nextValue) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    branch: nextValue,
                                }));
                                clearFieldError("branch");
                            }}
                            options={branchDropdownOptions}
                            placeholder={resolvedPlaceholders.branch}
                            ariaLabel={resolvedLabels.branch}
                            allowEmptyOption={false}
                            className="contact-form__branch-dropdown"
                            ariaRequired="true"
                            ariaInvalid={Boolean(fieldErrors.branch)}
                        />
                    </div>
                )}

                {fields.diagnostic && (
                    <div className="form-group form-email">
                        <label>{resolvedLabels.diagnostic}</label>
                        <input
                            type="text"
                            name="diagnostic"
                            value={formData.diagnostic}
                            onChange={handleChange}
                            placeholder={resolvedPlaceholders.diagnostic}
                            aria-required="true"
                            aria-invalid={Boolean(fieldErrors.diagnostic)}
                        />
                    </div>
                )}

                {!fields.email && !fields.diagnostic && fields.checkupName && (
                    <div className="form-group form-email">
                        <label>{resolvedLabels.checkupName}</label>
                        <input
                            type="text"
                            name="checkupName"
                            value={formData.checkupName}
                            onChange={handleChange}
                            placeholder={resolvedPlaceholders.checkupName}
                            aria-required="true"
                            aria-invalid={Boolean(fieldErrors.checkupName)}
                        />
                    </div>
                )}

                {fields.message && (
                    <div className="form-message">
                        <label>{resolvedLabels.message}</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={resolvedPlaceholders.message}
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
                    <span className="form-consent__label">{resolvedLabels.consent}</span>
                </label>

                <div className="form-button">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        <span className="submit-button__text">
                            {loading
                                ? isEn ? "Sending..." : "Надсилання..."
                                : resolvedButtonText}
                        </span>
                        <span className="submit-button__icon">
                            <img src="/icons/arrow-right.svg" alt="" />
                        </span>
                    </button>
                </div>

            </form>

            {(success || submitError) &&
                createPortal(
                    <div
                        className="popup-overlay"
                            onClick={() => {
                                setSuccess(false);
                                setSubmitError(false);
                            }}
                        >
                        <div
                            className="popup"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="popup-close"
                                aria-label={POPUP.closeAria}
                                onClick={() => {
                                    setSuccess(false);
                                    setSubmitError(false);
                                    setSubmitErrorMessage("");
                                }}
                            >
                                ×
                            </button>

                            <h3>
                                {success
                                    ? POPUP.successTitle
                                    : POPUP.errorTitle}
                            </h3>

                            <p>
                                {success
                                    ? POPUP.successText
                                    : submitErrorMessage || ERR.generic}
                            </p>
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
