import { useState } from "react";
import emailjs from "@emailjs/browser";
import "./ContactForm.css";

export default function ContactForm({
    title = "МИ ЗАВЖДИ ПОРУЧ, ЩОБ ДОПОМОГТИ",
    subtitle = "ЗАЛИШТЕ ПОВІДОМЛЕННЯ",
}) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        branch: "",
        message: "",
        consent: false,
        company: "",
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.company) return;

        setLoading(true);
        setError(false);
        setSuccess(false);

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    title: "Контактна форма — Для людей",
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    branch: formData.branch,
                    message: formData.message,
                    time: new Date().toLocaleString("uk-UA"),
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            setSuccess(true);
            setFormData({
                name: "",
                phone: "",
                email: "",
                branch: "",
                message: "",
                consent: false,
                company: "",
            });
        } catch (err) {
            console.error("EmailJS error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
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
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>

            <div className="form-group form-name">
                <label>Імʼя *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group form-phone">
                <label>Номер телефону *</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group form-email">
                <label>Електронна пошта</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group form-branch">
                <label>Оберіть філію медичного центру *</label>
                <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled hidden>
                        Оберіть філію
                    </option>
                    <option value="Потрібна консультація">
                        Ще не визначився / Потрібна консультація
                    </option>
                    <option value="вул. Данила Галицького, 34">
                        вул. Данила Галицького, 34
                    </option>
                    <option value="просп. Богдана Хмельницького, 127">
                        просп. Богдана Хмельницького, 127
                    </option>
                    <option value="бульвар Слави, 8">бульвар Слави, 8</option>
                </select>
            </div>

            <div className="form-message">
                <label>Повідомлення *</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
            </div>

            <label className="form-consent">
                <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    required
                />
                <span className="custom-checkbox" />
                <span>Даю згоду на збір та обробку персональних даних</span>
            </label>

            <div className="form-button">
                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                >
                    <span className="submit-button__text">
                        {loading ? "Надсилання..." : "Надіслати повідомлення"}
                    </span>
                    <span className="submit-button__icon">
                        <img src="/icons/arrow-right.svg" alt="" />
                    </span>
                </button>
            </div>

            {success && (
                <p className="form-success">Дякуємо, повідомлення надіслано!</p>
            )}
            {error && <p className="form-error">Помилка. Спробуйте пізніше.</p>}
        </form>
    );
}
