import { useEffect, useState } from "react";
import Button from "../Button/Button";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { toUiServiceTitle } from "../../lib/serviceTitle";
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
    const uiTitle = toUiServiceTitle(title);
    const [isHeroImageLoaded, setIsHeroImageLoaded] = useState(false);

    useEffect(() => {
        setIsHeroImageLoaded(false);
    }, [image]);

    const heroImageAlt = title
        ? `${title} — медичний центр Для Людей, Дніпро, Україна`
        : "Медичний центр Для Людей, Дніпро, Україна";

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
                            <h1>{uiTitle}</h1>
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
                        <div
                            className={`services-card-hero__right${
                                isHeroImageLoaded ? " is-loaded" : ""
                            }`}
                        >
                            <img
                                src={image}
                                alt={heroImageAlt}
                                loading="eager"
                                fetchPriority="high"
                                decoding="async"
                                data-route-nonblocking="true"
                                onLoad={() => setIsHeroImageLoaded(true)}
                                onError={() => setIsHeroImageLoaded(true)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
