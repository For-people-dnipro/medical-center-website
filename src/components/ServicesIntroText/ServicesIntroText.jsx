import "./ServicesIntroText.css";

export default function ServicesIntroText({ children, text }) {
    const content = children ?? text;

    return (
        <section className="services-text-under-card__intro">
            <div className="services-text-under-card__container">
                {content}
            </div>
        </section>
    );
}
