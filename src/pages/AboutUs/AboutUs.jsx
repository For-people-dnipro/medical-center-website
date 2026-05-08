import AboutUsHero from "../../components/AboutUsHero/AboutUsHero";
import ContactForm from "../../components/ContactForm/ContactForm";
import InfoGridSection from "../../components/InfoGridSection/InfoGridSection";
import SeoHead from "../../components/Seo/SeoHead";
import Ticket from "../../components/Ticket/Ticket";
import DeclarationSection from "../../sections/DeclarationSection";
import { getStaticSeo } from "../../seo/seoConfig";
import "./AboutUs.css";

const PAGE_SEO = getStaticSeo("about");

const approachItems = [
    "Ми намагаємося, щоб кожна консультація була не просто прийомом, а співпрацею.",
    "Ми побачили, що для наших пацієнтів важлива не лише експертиза, а й спосіб, у який вона передається. Тому ми пояснюємо діагнози, говоримо зрозумілою мовою, пропонуємо варіанти рішень і підтримуємо на кожному етапі.",
];

const growthItems = [
    "Додаємо нові послуги, програми, пакети та спеціалістів. Ми уважно слухаємо, що потрібно людям, і розвиваємо клініку. Наше завдання — бути тим місцем, куди хочеться звернутись, коли потрібна якісна медична підтримка.",
    "Ми — про довіру, професійність і турботу, про медицину та клініку, де хочеться бути пацієнтом.",
];

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
                <InfoGridSection
                    type="packages"
                    className="about-us-page__info"
                    leftTitle="НАШ ПІДХІД"
                    leftItems={approachItems}
                    rightTitle="ЗРОСТАЄМО РАЗОМ"
                    rightItems={growthItems}
                />
                <DeclarationSection />
                <ContactForm
                    smallTitle="ПОРУЧ, ЩОБ ДОПОМОГТИ"
                    subtitle="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                />
            </main>
        </div>
    );
}
