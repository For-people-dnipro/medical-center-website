import { useState } from "react";
import ContactForm from "../../components/ContactForm/ContactForm";
import VacanciesHero from "../../components/VacanciesHero/VacanciesHero";
import VacanciesList from "../../components/VacanciesList/VacanciesList";
import "./VacanciesPage.css";

export default function VacanciesPage() {
    const [selectedVacancy, setSelectedVacancy] = useState("");

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

                <section id="vacancies-form" className="vacancies-page__form">
                    <ContactForm
                        title="ПОДАТИ ЗАЯВКУ"
                        smallTitle="ПОДАТИ ЗАЯВКУ"
                        subtitle="МИ ЗВʼЯЖЕМОСЯ З ВАМИ НАЙБЛИЖЧИМ ЧАСОМ"
                        formType={`Форма: Вакансії${
                            selectedVacancy ? ` (${selectedVacancy})` : ""
                        }`}
                        fields={{
                            name: true,
                            phone: true,
                            email: true,
                            branch: false,
                            diagnostic: true,
                            checkupName: false,
                            message: true,
                        }}
                        labels={{
                            name: "Імʼя *",
                            phone: "Номер телефону *",
                            email: "Електронна пошта",
                            diagnostic: "Вакансія *",
                            message: "Коротко про ваш досвід *",
                            consent:
                                "Даю згоду на збір та обробку персональних даних",
                        }}
                        placeholders={{
                            name: "Ваше імʼя",
                            phone: "Ваш номер телефону",
                            email: "Ваша ел. пошта (за бажанням)",
                            diagnostic:
                                selectedVacancy || "Вкажіть назву вакансії",
                            message:
                                "Розкажіть про ваш досвід і зручний час для звʼязку",
                        }}
                        detailsLabels={{
                            diagnostic: "Вакансія",
                        }}
                    />
                </section>
            </main>
        </div>
    );
}
