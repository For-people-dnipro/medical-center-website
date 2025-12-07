import Banner from "../components/Banner";
import DeclarationSection from "../sections/DeclarationSection";
import Ticket from "../components/Ticket";
import ServiceSection from "../sections/ServicesSection";

export default function Home() {
    return (
        <div>
            <Banner />
            <DeclarationSection />
            <Ticket />
            <ServiceSection />
        </div>
    );
}
