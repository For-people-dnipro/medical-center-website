import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import "./AboutUsHero.css";

const DEFAULT_IMAGE = "/images/about-us.jpg";

const ABOUT_COPY =
    "Медичний центр «Для людей» створений, щоб зробити медичну допомогу зрозумілою, доступною та уважною. Для нас важливий кожен пацієнт — зі своїми питаннями, потребами та історією. Ми віримо: якісна медицина починається з поваги до людини.";

export default function AboutUsHero({
    title = "Місце, де вам приділяють увагу",
    image = DEFAULT_IMAGE,
}) {
    return (
        <section className="about-us-hero">
            <div className="about-us-hero__container">
                <Breadcrumbs
                    className="about-us-hero__crumbs"
                    ariaLabel="Хлібні крихти"
                    items={[
                        { label: "Головна", to: "/" },
                        { label: "Про нас" },
                    ]}
                />

                <div className="about-us-hero__layout">
                    <div className="about-us-hero__media">
                        <img
                            src={image}
                            alt="Лікарка спілкується з пацієнткою та дитиною у медичному центрі Для Людей у Дніпрі"
                            className="about-us-hero__image"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                        />
                    </div>

                    <div className="about-us-hero__card">
                        <h1>
                            <span className="about-us-hero__title-desktop">
                                {title}
                            </span>
                            <span className="about-us-hero__title-mobile">
                                Місце турботи про вас
                            </span>
                        </h1>

                        <p className="about-us-hero__intro">{ABOUT_COPY}</p>

                        <ul aria-hidden="true" />

                        <p className="about-us-hero__mobile-copy">
                            {ABOUT_COPY}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
