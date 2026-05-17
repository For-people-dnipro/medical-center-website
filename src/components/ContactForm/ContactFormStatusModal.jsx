import { createPortal } from "react-dom";

export default function ContactFormStatusModal({
    onClose,
    submitError,
    submitErrorMessage,
    success,
}) {
    if (!success && !submitError) {
        return null;
    }

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup" onClick={(event) => event.stopPropagation()}>
                <button
                    className="popup-close"
                    aria-label="Закрити"
                    onClick={onClose}
                >
                    ×
                </button>

                <h3>
                    {success ? "Повідомлення надіслано" : "Сталася помилка."}
                </h3>

                <p>
                    {success
                        ? "Дякуємо! Ми зв’яжемося з вами найближчим часом."
                        : submitErrorMessage ||
                          "Будь ласка, зателефонуйте нам або повторіть спробу пізніше, дякуємо."}
                </p>
            </div>
        </div>,
        document.body,
    );
}

