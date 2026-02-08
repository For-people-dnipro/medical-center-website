import { Link } from "react-router-dom";
import Button from "../Button/Button";
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
                            <div className="services-card-hero__crumbs">
                                {crumbs
                                    .map((item, i) => (
                                        <span
                                            key={i}
                                            className={
                                                item.to
                                                    ? "crumb-link"
                                                    : "current"
                                            }
                                        >
                                            {item.to ? (
                                                <Link to={item.to}>
                                                    {item.label}
                                                </Link>
                                            ) : (
                                                item.label
                                            )}
                                        </span>
                                    ))
                                    .reduce((acc, el, i) => {
                                        if (i === 0) return [el];
                                        return [
                                            ...acc,
                                            <span
                                                key={`sep-${i}`}
                                                className="crumb-separator"
                                            >
                                                ›
                                            </span>,
                                            el,
                                        ];
                                    }, [])}
                            </div>
                        )}
                        <div className="services-card-hero__title">
                            {icon && (
                                <span className="services-card-hero__icon">
                                    <img src={icon} alt="" />
                                </span>
                            )}
                            <h1>{title}</h1>
                        </div>

                        <span className="services-card-hero__line" />

                        {subtitle && (
                            <p className="services-card-hero__subtitle">
                                {subtitle}
                            </p>
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
