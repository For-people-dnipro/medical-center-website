import AboutUsHero from "../../components/AboutUsHero/AboutUsHero";
import ContactForm from "../../components/ContactForm/ContactForm";
import SeoHead from "../../components/Seo/SeoHead";
import Ticket from "../../components/Ticket/Ticket";
import DeclarationSection from "../../sections/DeclarationSection";
import { getStaticSeo } from "../../seo/seoConfig";

const PAGE_SEO = getStaticSeo("about");

export default function AboutUs() {
    return (
        <div>
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/about"
            />

            <main>
                <AboutUsHero />
                <Ticket text="«Для людей» — не просто назва, а принцип, за яким ми працюємо щодня." />
                <DeclarationSection />
                <ContactForm
                    smallTitle="ПОРУЧ, ЩОБ ДОПОМОГТИ"
                    subtitle="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                />
            </main>
        </div>
    );
}
