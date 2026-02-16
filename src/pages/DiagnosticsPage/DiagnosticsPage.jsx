import Footer from "../../components/Footer/Footer";
import ContactForm from "../../components/ContactForm/ContactForm";
import CardTemplateServices from "../../components/CardTemplateServices/CardTemplateServices";
import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import SectionTypes from "../../components/SectionTypes/SectionTypes";
import "./DiagnosticsPage.css";

export default function DiagnosticsPage() {
    const handleScrollToForm = (event) => {
        event.preventDefault();
        const target = document.querySelector("#diagnostics-form");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>
            <main className="diagnostics-page">
                {/* HERO */}
                <ServicesCardHero
                    title="ДІАГНОСТИКА"
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
                <section className="services-text-under-card__intro">
                    <div className="services-text-under-card__container">
                        <p>
                            Діагностика — це перший крок до розуміння вашого
                            стану здоров’я. Ми поєднуємо професійність лікарів,
                            сучасні методи та обладнання для обстеження,
                            партнерські лабораторії, щоб ви могли пройти всі
                            необхідні дослідження в одному місці — швидко,
                            зручно і з турботою.
                        </p>
                    </div>
                </section>
                <SectionTypes />
                <section>
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
                        imageAlt="Підготовка до діагностики"
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
