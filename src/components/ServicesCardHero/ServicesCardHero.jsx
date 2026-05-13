import { useState } from "react";
import Button from "../Button/Button";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import WebPImage from "../WebPImage/WebPImage";
import { toUiServiceTitle } from "../../lib/serviceTitle";
import { scrollToElementWithOffset } from "../../lib/smoothScroll";
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
    const [loadedImageSrc, setLoadedImageSrc] = useState("");
    const safeButtonHref =
        typeof buttonHref === "string" ? buttonHref.trim() : "";
    const isSamePageAnchorLink =
        safeButtonHref.startsWith("#") && safeButtonHref.length > 1;
    const isHeroImageLoaded = !!image && loadedImageSrc === image;

    const heroImageAlt = title
        ? `${title} — медичний центр Для Людей, Дніпро, Україна`
        : "Медичний центр Для Людей, Дніпро, Україна";

    const handleHeroButtonClick = (event) => {
        if (typeof buttonOnClick === "function") {
            buttonOnClick(event);
        }

        if (event.defaultPrevented || !isSamePageAnchorLink) {
            return;
        }

        const targetId = decodeURIComponent(safeButtonHref.slice(1));
        const target = targetId ? document.getElementById(targetId) : null;

        if (!target) {
            return;
        }

        event.preventDefault();
        scrollToElementWithOffset(target);
    };

    return (
        <section className="services-card-hero">
            <div className="services-card-hero__container">
                <div className="services-card-hero__card">
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
                                onClick={handleHeroButtonClick}
                            >
                                {buttonText}
                            </Button>
                        )}
                    </div>

                    {image && (
                        <div
                            className={`services-card-hero__right${
                                isHeroImageLoaded ? " is-loaded" : ""
                            }`}
                        >
                            <WebPImage
                                src={image}
                                alt={heroImageAlt}
                                loading="eager"
                                fetchpriority="high"
                                decoding="async"
                                data-route-nonblocking="true"
                                onLoad={() => setLoadedImageSrc(image)}
                                onError={() => setLoadedImageSrc(image)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
