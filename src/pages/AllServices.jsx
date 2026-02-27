import ServicesSection from "../sections/ServicesSection";
import ContactForm from "../components/ContactForm/ContactForm";
import Footer from "../components/Footer/Footer";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import SeoHead from "../components/Seo/SeoHead";
import { getStaticSeo } from "../seo/seoConfig";
import "./AllServices.css";

const PAGE_SEO = getStaticSeo("services");

export default function AllServices() {
    return (
        <div className="all-services-page">
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/services"
            />
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
