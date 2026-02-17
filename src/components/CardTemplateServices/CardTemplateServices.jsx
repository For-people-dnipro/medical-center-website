import "./CardTemplateServices.css";

export default function CardTemplateServices({
    title,
    text,
    image,
    imageAlt,
    reverse = false,
    titleTag = "h2",
}) {
    const TitleTag = titleTag;

    return (
        <section className="service-template">
            <div
                className={`service-template__card ${reverse ? "reverse" : ""}`}
            >
                <div className="service-template__text">
                    <TitleTag>{title}</TitleTag>
                    <p>{text}</p>
                </div>

                <div className="service-template__image">
                    <img src={image} alt={imageAlt} />
                </div>
            </div>
        </section>
    );
}
