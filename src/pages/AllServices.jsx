import ServicesSection from "../sections/ServicesSection";
import ContactForm from "../components/ContactForm/ContactForm";
import Footer from "../components/Footer/Footer";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import "./AllServices.css";

export default function AllServices() {
    return (
        <div className="all-services-page">
            <main className="all-services-main">
                <section className="all-services-hero">
                    <div className="services-grid services-grid--crumbs">
                        <Breadcrumbs
                            className="all-services-crumbs"
                            items={[
                                { label: "Головна", to: "/" },
                                { label: "Послуги" },
                            ]}
                        />
                    </div>
                </section>
                <ServicesSection />

                <section className="all-services-contact">
                    <ContactForm
                        smallTitle="ПОРУЧ, ЩОБ ДОПОМОГТИ"
                        subtitle="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                    />
                </section>
            </main>
        </div>
    );
}
