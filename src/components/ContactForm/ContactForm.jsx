import {
    DEFAULT_MOBILE_TITLE,
    DEFAULT_SUBTITLE,
    DEFAULT_TITLE,
    getDefaultDetailsLabels,
} from "./contactForm.constants";
import ContactFormFields from "./ContactFormFields";
import ContactFormStatusModal from "./ContactFormStatusModal";
import { useContactForm } from "./useContactForm";
import "./ContactForm.css";

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
    const resolvedDetailsLabels = getDefaultDetailsLabels(detailsLabels);
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

    const {
        branchDropdownOptions,
        closeStatus,
        fieldErrors,
        formData,
        handleBranchChange,
        handleChange,
        handleSubmit,
        loading,
        submitError,
        submitErrorMessage,
        success,
    } = useContactForm({
        branchOptions,
        fields,
        formType,
        resolvedDetailsLabels,
    });

    return (
        <>
            <form
                className={formClassName}
                onSubmit={handleSubmit}
                onInvalid={(event) => event.preventDefault()}
                noValidate
            >
                <div className="form-header">
                    <h2
                        className={hasSmallTitle ? "form-title--has-small" : ""}
                    >
                        <span className="form-title-main">{resolvedTitle}</span>
                        {hasSmallTitle ? (
                            <span className="form-title-small">
                                {resolvedSmallTitle}
                            </span>
                        ) : null}
                    </h2>
                    {subtitle ? (
                        <SubtitleTag className="form-subtitle">
                            {subtitle}
                        </SubtitleTag>
                    ) : null}
                </div>

                <ContactFormFields
                    branchDropdownOptions={branchDropdownOptions}
                    buttonText={buttonText}
                    fieldErrors={fieldErrors}
                    fields={fields}
                    formData={formData}
                    handleBranchChange={handleBranchChange}
                    handleChange={handleChange}
                    labels={labels}
                    loading={loading}
                    placeholders={placeholders}
                />
            </form>

            <ContactFormStatusModal
                onClose={closeStatus}
                submitError={submitError}
                submitErrorMessage={submitErrorMessage}
                success={success}
            />
        </>
    );
}

