import Button from "../Button/Button";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import "./ServicesCardHero.css";

export default function ServicesCardHero({
    title,
    subtitle,
    icon,
    image,
    crumbs = [],
    buttonText,
    buttonHref,
    buttonClassName = "",
    buttonOnClick,
}) {
    return (
        <section className="services-card-hero">
            <div className="services-card-hero__container">
                <div className="services-card-hero__card">
                    {/* LEFT */}
                    <div className="services-card-hero__left">
                        {crumbs.length > 0 && (
                            <Breadcrumbs
                                className="services-card-hero__crumbs"
                                items={crumbs}
                            />
                        )}
                        <div className="services-card-hero__title">
                            {icon && (
                                <span className="services-card-hero__icon">
                                    <img src={icon} alt="" />
                                </span>
                            )}
                            <h2>{title}</h2>
                        </div>

                        <span className="services-card-hero__line" />

                        {subtitle && (
                            <h3 className="services-card-hero__subtitle">
                                {subtitle}
                            </h3>
                        )}

                        {buttonText && buttonHref && (
                            <Button
                                href={buttonHref}
                                className={`services-card-hero__button ${buttonClassName}`}
                                onClick={buttonOnClick}
                            >
                                {buttonText}
                            </Button>
                        )}
                    </div>

                    {/* RIGHT */}
                    {image && (
                        <div className="services-card-hero__right">
                            <img src={image} alt={title} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
