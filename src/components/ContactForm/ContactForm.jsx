import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import emailjs from "@emailjs/browser";
import "./ContactForm.css";

const DEFAULT_TITLE = "МИ ЗАВЖДИ ПОРУЧ, ЩОБ ДОПОМОГТИ";
const DEFAULT_MOBILE_TITLE = "ПОРУЧ ЩОБ ДОПОМОГТИ";
const DEFAULT_SUBTITLE = "ЗАЛИШТЕ ПОВІДОМЛЕННЯ";

/**
 * Universal ContactForm
 * - Same layout/styles (uses your existing ContactForm.css)
 * - You can enable/disable fields per page via props
 * - Adds "form_type" marker so you see which form sent it
 */

export default function ContactForm({
    // titles (optional)
    title,
    subtitle = DEFAULT_SUBTITLE,
    smallTitle,

    // IMPORTANT: marker for email so you know which form sent it
    formType = "Загальна базова форма",
    buttonText = "Надіслати повідомлення",

    // choose fields for this exact form
    fields = {
        name: true,
        phone: true,
        email: true,
        branch: true,
        diagnostic: false, // for diagnostics page
        checkupName: false, // for check-up page
        message: true,
    },

    // labels/placeholders per form (optional)
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

    // labels used in EmailJS `details` string (optional overrides)
    detailsLabels = {},

    // branch options (optional)
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
    const hasEmailLike = fields.email || fields.diagnostic || fields.checkupName;
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
            company: "", // honeypot
        };
    }, []);

    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(false);
                setError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setSuccess(false);
                setError(false);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // spam bot trap
        if (formData.company) return;

        setLoading(true);
        setError(false);
        setSuccess(false);

        // Build email payload ONLY from fields that exist on this form
        // (so removed fields won't arrive)
        const details = [];

        // helper
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
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form className={formClassName} onSubmit={handleSubmit}>
                {/* honeypot */}
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
                    {subtitle && <h2 className="form-subtitle">{subtitle}</h2>}
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
                            required
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
                            required
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
                        />
                    </div>
                )}

                {fields.branch && (
                    <div className="form-group form-branch">
                        <label>{labels.branch}</label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled hidden>
                                {placeholders.branch}
                            </option>
                            {branchOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {fields.diagnostic && (
                    <div className="form-group form-email">
                        {/* We reuse area "email" slot visually in your grid.
                If you want a true separate grid-area, tell me and I’ll adjust CSS too. */}
                        <label>{labels.diagnostic}</label>
                        <input
                            type="text"
                            name="diagnostic"
                            value={formData.diagnostic}
                            onChange={handleChange}
                            placeholder={placeholders.diagnostic}
                            required
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
                            required
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
                            required
                        />
                    </div>
                )}

                <label className="form-consent">
                    <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        required
                    />
                    <span className="custom-checkbox" />
                    <span>{labels.consent}</span>
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

            {(success || error) &&
                createPortal(
                    <div
                        className="popup-overlay"
                        onClick={() => {
                            setSuccess(false);
                            setError(false);
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
                                    setError(false);
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
