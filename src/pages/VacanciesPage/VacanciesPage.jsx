import { useState } from "react";
import ContactForm from "../../components/ContactForm/ContactForm";
import VacanciesHero from "../../components/VacanciesHero/VacanciesHero";
import VacanciesList from "../../components/VacanciesList/VacanciesList";
import BenefitsSection from "../../components/BenefitsSection/BenefitsSection";
import "./VacanciesPage.css";
import Ticket from "../../components/Ticket/Ticket";

export default function VacanciesPage() {
    const [setSelectedVacancy] = useState("");

    const scrollToSection = (selector) => {
        const target = document.querySelector(selector);
        if (!target) return;

        target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleExploreVacancies = () => {
        scrollToSection("#vacancies-list");
    };

    const handleApply = (vacancyTitle) => {
        setSelectedVacancy(vacancyTitle || "");
        scrollToSection("#vacancies-form");
    };

    return (
        <div className="vacancies-page">
            <main className="vacancies-page__main">
                <VacanciesHero onExploreClick={handleExploreVacancies} />

                <VacanciesList
                    title="АКТУАЛЬНІ ВАКАНСІЇ"
                    endpoint="/api/vacancies"
                    sectionId="vacancies-list"
                    onApply={handleApply}
                />
                <section className="cta-all-pages">
                    <Ticket text="Долучайтеся до нашої команди — і давайте разом створювати медицину, якою хочеться пишатися." />
                </section>

                <BenefitsSection />

                <section id="vacancies-form" className="vacancies-page__form">
                    <ContactForm
                        smallTitle="ПОРУЧ, ЩОБ ДОПОМОГТИ"
                        subtitle="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                    />
                </section>
            </main>
        </div>
    );
}
