export const DEFAULT_TITLE = "МИ ЗАВЖДИ ПОРУЧ, ЩОБ ДОПОМОГТИ";
export const DEFAULT_MOBILE_TITLE = "ПОРУЧ, ЩОБ ДОПОМОГТИ";
export const DEFAULT_SUBTITLE = "ЗАЛИШТЕ ПОВІДОМЛЕННЯ";
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createInitialContactFormData() {
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
}

export function getDefaultDetailsLabels(detailsLabels = {}) {
    return {
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
}

