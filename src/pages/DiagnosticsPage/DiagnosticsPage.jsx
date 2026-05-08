import Footer from "../../components/Footer/Footer";
import ContactForm from "../../components/ContactForm/ContactForm";
import CardTemplateServices from "../../components/CardTemplateServices/CardTemplateServices";
import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import ServicesPriceSection from "../../components/ServicesPriceSection/ServicesPriceSection";
import SectionTypes from "../../components/SectionTypes/SectionTypes";
import ServicesIntroText from "../../components/ServicesIntroText/ServicesIntroText";
import SeoHead from "../../components/Seo/SeoHead";
import { getStaticSeo } from "../../seo/seoConfig";
import { scrollToSelectorWithOffset } from "../../lib/smoothScroll";
import "./DiagnosticsPage.css";

const PAGE_SEO = getStaticSeo("diagnostics");

export default function DiagnosticsPage() {
    const handleScrollToForm = (event) => {
        event.preventDefault();
        scrollToSelectorWithOffset("#diagnostics-form");
    };

    return (
        <>
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/diagnostics"
            />
            <main className="diagnostics-page">
                {/* HERO */}
                <ServicesCardHero
                    title="ДІАГНОСТИКА У ДНІПРІ"
                    subtitle="Бачити. Розуміти. Діяти з турботою."
                    icon="/icons/service-diagnostics.svg"
                    image="/images/diagnostics-hero.jpg"
                    crumbs={[
                        { label: "Головна", to: "/" },
                        { label: "Послуги", to: "/services" },
                        { label: "Діагностика" },
                    ]}
                    buttonText="Записатися"
                    buttonHref="#diagnostics-form"
                    buttonClassName="arrow-down"
                    buttonOnClick={handleScrollToForm}
                />
                <ServicesIntroText>
                    <p>
                        Діагностика — це перший крок до розуміння вашого стану
                        здоров’я. Ми поєднуємо професійність лікарів, сучасні
                        методи та обладнання для обстеження, партнерські
                        лабораторії, щоб ви могли пройти всі необхідні
                        дослідження в одному місці — швидко, зручно і з
                        турботою.
                    </p>
                </ServicesIntroText>
                <SectionTypes />

                <ServicesPriceSection
                    title="ЦІНИ НА ДІАГНОСТИКУ"
                    endpoint="/api/service-prices"
                    page="diagnostics"
                    noteText="Не знайшли потрібну діагностику? Напишіть нам — ми обов’язково допоможемо."
                />

                <section className="diagnostics-page__about">
                    <CardTemplateServices
                        title="ЯК ПІДГОТУВАТИСЯ?"
                        text={
                            <>
                                Для більшості досліджень спеціальна підготовка
                                не потрібна. Якщо є нюанси (наприклад, потрібно
                                прийти натщесерце чи з повним сечовим міхуром) —
                                адміністратор або лікар попередять вас
                                заздалегідь.
                            </>
                        }
                        image="/images/diagnostics-prepare.jpg"
                        imageAlt="Підготовка до діагностики в медичному центрі Для Людей, Дніпро"
                    />
                </section>
                <section
                    id="diagnostics-form"
                    className="diagnostics-form-section"
                >
                    <ContactForm
                        title="ЗАПИШІТЬСЯ НА ДІАГНОСТИКУ"
                        subtitle="У ЗРУЧНИЙ ДЛЯ ВАС ЧАС"
                        formType="Форма: Діагностика"
                        fields={{
                            name: true,
                            phone: true,
                            email: false,
                            branch: false,
                            diagnostic: true,
                            message: true,
                        }}
                        labels={{
                            name: "Імʼя *",
                            phone: "Номер телефону *",
                            diagnostic: "Необхідна діагностика *",
                            message: "Повідомлення *",
                            consent:
                                "Даю згоду на збір та обробку персональних даних",
                        }}
                    />
                </section>
            </main>
        </>
    );
}
