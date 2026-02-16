import ServicesSection from "../sections/ServicesSection";
import ContactForm from "../components/ContactForm/ContactForm";
import Footer from "../components/Footer/Footer";
import "./AllServices.css";
import { Link } from "react-router-dom";

export default function AllServices() {
    return (
        <div className="all-services-page">
            <main className="all-services-main">
                <section className="all-services-hero">
                    <div className="services-grid services-grid--crumbs">
                        <div className="all-services-crumbs">
                            <Link to="/">Головна</Link>
                            <span className="crumb-separator">›</span>
                            <span className="current">Послуги</span>
                        </div>
                    </div>
                </section>
                <ServicesSection />

                <section className="all-services-contact">
                    <ContactForm smallTitle="МИ ЗАВЖДИ ПОРУЧ" />
                </section>
            </main>
        </div>
    );
}
