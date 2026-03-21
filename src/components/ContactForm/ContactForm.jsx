import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import emailjs from "@emailjs/browser";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import "./ContactForm.css";

const DEFAULT_TITLE = "МИ ЗАВЖДИ ПОРУЧ, ЩОБ ДОПОМОГТИ";
const DEFAULT_MOBILE_TITLE = "ПОРУЧ, ЩОБ ДОПОМОГТИ";
const DEFAULT_SUBTITLE = "ЗАЛИШТЕ ПОВІДОМЛЕННЯ";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({
    title,
    subtitle = DEFAULT_SUBTITLE,
    smallTitle,
    subtitleTag,

    formType = "Загальна базова форма",
    buttonText = "Надіслати повідомлення",

    fields = {
        name: true,
        phone: true,
        email: true,
        branch: true,
        diagnostic: false,
        checkupName: false,
        message: true,
    },

    labels = {
        name: "Імʼя *",
        phone: "Номер телефону *",
        email: "Електронна пошта",
        branch: "Оберіть філію медичного центру *",
        diagnostic: "Необхідна діагностика *",
        checkupName: "Назва CHECK-UP*",
        message: "Повідомлення *",
        consent: "Даю згоду на збір та обробку персональних даних",
    },

    placeholders = {
        name: "Ваше імʼя",
        phone: "Ваш номер телефону",
        email: "Ваша ел. пошта (за бажанням)",
        branch: "Оберіть філію",
        diagnostic: "Вкажіть назву процедури",
        checkupName: "Введіть назву CHECK-UP",
        message: "Що вас турбує?",
    },

    detailsLabels = {},

    branchOptions = [
        "Ще не визначився(лась) / Потрібна консультація",
        "вул. Данила Галицького, 34",
        "просп. Богдана Хмельницького, 127",
        "бульвар Слави, 8",
    ],
}) {
    const resolvedDetailsLabels = {
        form: "Форма",
        name: "Імʼя",
        phone: "Телефон",
        email: "Email",
        branch: "Філія",
        diagnostic: "Діагностика",
        checkupName: "Назва CHECK-UP",
        message: "Повідомлення",
        dateTime: "Дата та час",
        ...detailsLabels,
    };

    const resolvedTitle = title ?? DEFAULT_TITLE;
    const resolvedSmallTitle =
        smallTitle ?? (title == null ? DEFAULT_MOBILE_TITLE : undefined);
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
            (branchOptions || [])
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
        [branchOptions],
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
            errors.name = "Введіть, будь ласка, імʼя.";
        }

        if (fields.phone && !getText(values.phone)) {
            errors.phone = "Введіть, будь ласка, номер телефону.";
        }

        if (fields.email && getText(values.email)) {
            if (!EMAIL_PATTERN.test(getText(values.email))) {
                errors.email = "Вкажіть коректну електронну пошту.";
            }
        }

        if (fields.branch && !getText(values.branch)) {
            errors.branch = "Оберіть, будь ласка, філію.";
        }

        if (fields.diagnostic && !getText(values.diagnostic)) {
            errors.diagnostic = "Вкажіть, будь ласка, назву процедури.";
        }

        if (
            !fields.email &&
            !fields.diagnostic &&
            fields.checkupName &&
            !getText(values.checkupName)
        ) {
            errors.checkupName = "Введіть, будь ласка, назву CHECK-UP.";
        }

        if (fields.message && !getText(values.message)) {
            errors.message = "Введіть, будь ласка, повідомлення.";
        }

        if (!values.consent) {
            errors.consent =
                "Потрібно надати згоду на обробку персональних даних.";
        }

        return errors;
    };

    useEffect(() => {
        if (success || submitError) {
            const timer = setTimeout(() => {
                setSuccess(false);
                setSubmitError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, submitError]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setSuccess(false);
                setSubmitError(false);
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
        setFieldErrors({});

        const details = [];

        const addField = (label, value) => {
            if (value && value.trim() !== "") {
                details.push(`${label}: ${value}`);
            }
        };

        addField(resolvedDetailsLabels.form, formType);

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
            new Date().toLocaleString("uk-UA"),
        );
        const payload = {
            details: details.join("\n"),
            formType,
            to_email: import.meta.env.VITE_EMAIL_TO,
        };

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                payload,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            );

            setSuccess(true);
            setFormData(initialData);
        } catch (err) {
            console.error("EmailJS error:", err);
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
                    {subtitle && (
                        <SubtitleTag className="form-subtitle">
                            {subtitle}
                        </SubtitleTag>
                    )}
                </div>

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
                            onChange={(nextValue) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    branch: nextValue,
                                }));
                                clearFieldError("branch");
                            }}
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
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        <span className="submit-button__text">
                            {loading ? "Надсилання..." : buttonText}
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
                                aria-label="Закрити"
                                onClick={() => {
                                    setSuccess(false);
                                    setSubmitError(false);
                                }}
                            >
                                ×
                            </button>

                            <h3>
                                {success
                                    ? "Повідомлення надіслано"
                                    : "Сталася помилка."}
                            </h3>

                            <p>
                                {success
                                    ? "Дякуємо! Ми зв’яжемося з вами найближчим часом."
                                    : "Будь ласка, зателефонуйте нам або повторіть спробу пізніше, дякуємо."}
                            </p>
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
