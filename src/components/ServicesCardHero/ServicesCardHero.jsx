import { Link } from "react-router-dom";
import Button from "../Button/Button";
import "./ServicesCardHero.css";

export default function ServicesCardHero() {
    return (
        <section className="services-card-hero">
            <div className="services-card-hero__container">
                <div className="services-card-hero__card">
                    {/* LEFT */}
                    <div className="services-card-hero__left">
                        <div className="services-card-hero__crumbs">
                            <Link to="/">Головна</Link>
                            <span>›</span>
                            <Link to="/services">Послуги</Link>
                            <span>›</span>
                            <span className="current">Декларація</span>
                        </div>

                        <div className="services-card-hero__title">
                            <span className="services-card-hero__icon">
                                <img
                                    src="/icons/service-declaration.svg"
                                    alt=""
                                />
                            </span>
                            <h1>ДЕКЛАРАЦІЯ</h1>
                        </div>

                        <span className="services-card-hero__line" />

                        <p className="services-card-hero__subtitle">
                            Турбота починається з довіри
                        </p>

                        <Button
                            href="#declaration-form"
                            className="services-card-hero__button"
                        >
                            Підписати декларацію
                        </Button>
                    </div>

                    {/* RIGHT */}
                    <div className="services-card-hero__right">
                        <img
                            src="../../images/declaration-hero.png"
                            alt="Підписання декларації"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
