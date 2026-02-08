import "./CardTemplateServices.css";

export default function CardTemplateServices({
    title,
    text,
    image,
    imageAlt,
    reverse = false,
}) {
    return (
        <section className="service-template">
            <div
                className={`service-template__card ${reverse ? "reverse" : ""}`}
            >
                <div className="service-template__text">
                    <h2>{title}</h2>
                    <p>{text}</p>
                </div>

                <div className="service-template__image">
                    <img src={image} alt={imageAlt} />
                </div>
            </div>
        </section>
    );
}
