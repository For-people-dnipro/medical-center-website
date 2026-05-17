import { useEffect, useMemo, useState } from "react";
import { buildApiUrl } from "../../api/foundation";
import {
    createInitialContactFormData,
    EMAIL_PATTERN,
} from "./contactForm.constants";

function normalizeBranchOptions(branchOptions = []) {
    return (branchOptions || [])
        .map((option) => {
            if (option && typeof option === "object") {
                const value = String(option.value ?? option.label ?? "").trim();
                const label = String(option.label ?? option.value ?? "—").trim();
                return value ? { value, label } : null;
            }

            const value = String(option ?? "").trim();
            return value ? { value, label: value } : null;
        })
        .filter(Boolean);
}

function validateContactForm({ values, fields }) {
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
        errors.consent = "Потрібно надати згоду на обробку персональних даних.";
    }

    return errors;
}

function buildDetails({ fields, formData, resolvedDetailsLabels, formType }) {
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
    if (fields.branch) addField(resolvedDetailsLabels.branch, formData.branch);
    if (fields.diagnostic) {
        addField(resolvedDetailsLabels.diagnostic, formData.diagnostic);
    }
    if (fields.checkupName) {
        addField(resolvedDetailsLabels.checkupName, formData.checkupName);
    }
    if (fields.message) addField(resolvedDetailsLabels.message, formData.message);

    addField(
        resolvedDetailsLabels.dateTime,
        new Date().toLocaleString("uk-UA"),
    );

    return details.join("\n");
}

export function useContactForm({
    branchOptions,
    fields,
    formType,
    resolvedDetailsLabels,
}) {
    const initialData = useMemo(() => createInitialContactFormData(), []);
    const branchDropdownOptions = useMemo(
        () => normalizeBranchOptions(branchOptions),
        [branchOptions],
    );

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

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        clearFieldError(name);
    };

    const handleBranchChange = (nextValue) => {
        setFormData((prev) => ({
            ...prev,
            branch: nextValue,
        }));
        clearFieldError("branch");
    };

    const closeStatus = () => {
        setSuccess(false);
        setSubmitError(false);
        setSubmitErrorMessage("");
    };

    useEffect(() => {
        if (success || submitError) {
            const timer = setTimeout(() => {
                closeStatus();
            }, 3000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [success, submitError]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                closeStatus();
            }
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.company) return;

        const errors = validateContactForm({ values: formData, fields });
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);
        setSubmitError(false);
        setSuccess(false);
        setSubmitErrorMessage("");
        setFieldErrors({});

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
            details: buildDetails({
                fields,
                formData,
                resolvedDetailsLabels,
                formType,
            }),
            formType,
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
                    if (
                        typeof errorPayload?.message === "string" &&
                        errorPayload.message.trim()
                    ) {
                        errorMessage = errorPayload.message.trim();
                    } else if (
                        Array.isArray(errorPayload?.details) &&
                        errorPayload.details.length > 0
                    ) {
                        errorMessage = errorPayload.details.join(", ");
                    }
                } catch {
                    // Keep HTTP fallback message when response body cannot be parsed.
                }

                throw new Error(errorMessage);
            }

            setSuccess(true);
            setFormData(initialData);
        } catch (error) {
            console.error("Contact form submission error:", error);
            setSubmitErrorMessage(
                error instanceof Error && error.message
                    ? error.message
                    : "Будь ласка, зателефонуйте нам або повторіть спробу пізніше, дякуємо.",
            );
            setSubmitError(true);
        } finally {
            setLoading(false);
        }
    };

    return {
        branchDropdownOptions,
        clearFieldError,
        closeStatus,
        fieldErrors,
        formData,
        handleBranchChange,
        handleChange,
        handleSubmit,
        loading,
        setSubmitError,
        setSuccess,
        submitError,
        submitErrorMessage,
        success,
    };
}

