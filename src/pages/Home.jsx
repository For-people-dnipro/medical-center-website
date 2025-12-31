import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import DeclarationSection from "../sections/DeclarationSection";
import Ticket from "../components/Ticket";
import ServicesSection from "../sections/ServicesSection";
import DoctorsSection from "../sections/DoctorsSection";
import BranchesSection from "../sections/BranchesSections";
import WhyChooseUsSection from "../sections/WhyChooseUsSection";
import FAQSection from "../sections/FaqSection";
import ContactForm from "../components/ContactForm/ContactForm";

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export default function Home() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                // Змініть endpoint якщо у вас інший (наприклад /api/homepage?populate=featured_doctors)
                const res = await fetch(`${API_URL}/api/doctors?populate=*`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                console.log("Doctors API response:", data);

                // Підтримуємо кілька можливих структур відповіді
                let items = [];
                if (Array.isArray(data.data)) {
                    // випадок: /api/doctors?populate=*
                    items = data.data;
                }
                // випадок: /api/homepage?populate=featured_doctors
                if (
                    !items.length &&
                    data.data &&
                    data.data[0]?.attributes?.featured_doctors
                ) {
                    items = data.data[0].attributes.featured_doctors.data || [];
                }

                setDoctors(items);
            } catch (err) {
                console.error("Failed to load doctors:", err);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
        <div>
            <Banner />
            <DeclarationSection />
            <Ticket />
            <ServicesSection />

            {/* можна показати loader, якщо потрібно */}
            {loading ? null : <DoctorsSection doctors={doctors} />}
            <BranchesSection />
            <WhyChooseUsSection />
            <FAQSection />
            <ContactForm />
        </div>
    );
}
