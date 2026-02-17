import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import InfoGridSection from "../../components/InfoGridSection/InfoGridSection";
import FAQSection from "../../sections/FaqSection";
import ContactForm from "../../components/ContactForm/ContactForm";
import "./AnalysesPage.css";

const recommendationItems = [
    "здавати аналізи вранці натщесерце;",
    "не їсти 8–12 годин;",
    "уникати алкоголю та жирної їжі;",
    "обмежити фізичні навантаження;",
    "не палити за 2–3 години;",
    "повідомити про ліки.",
];

const analysesFaqs = [
    {
        question: "Як правильно підготуватися до здачі аналізу крові?",
        answer: [
            "Рекомендовано здавати кров вранці натщесерце: останній прийом їжі має бути за 8–12 годин до забору.",
            "Напередодні уникайте алкоголю, жирної їжі та інтенсивних фізичних навантажень.",
        ],
    },
    {
        question: "Як підготуватися до загального аналізу сечі?",
        answer: [
            "Для дослідження використовуйте ранкову порцію сечі після гігієнічних процедур.",
            "Матеріал бажано доставити до лабораторії упродовж 1–2 годин після збору.",
        ],
    },
    {
        question: "Які правила підготовки до аналізу калу?",
        answer: [
            "Збір виконується у чистий контейнер без домішок сечі чи води.",
            "Перед дослідженням варто уникати продуктів і препаратів, які можуть змінити результат, якщо це погоджено з лікарем.",
        ],
    },
    {
        question: "Чи є особливості підготовки до гормональних досліджень?",
        answer: [
            "Так, для частини гормонів важливі час забору крові та день циклу.",
            "Оптимальну дату й умови підготовки краще узгодити з лікарем або адміністратором.",
        ],
    },
    {
        question: "Чи потрібно повідомляти лікаря про прийом ліків?",
        answer: [
            "Так, обов’язково повідомте про всі препарати, вітаміни та добавки, які приймаєте.",
            "Деякі засоби можуть впливати на результати аналізів.",
        ],
    },
    {
        question: "Де та як можна отримати результати аналізів?",
        answer: [
            "Результати можна отримати у вашого лікаря або через адміністратора медичного центру.",
            "Формат отримання залежить від типу дослідження та внутрішнього регламенту лабораторії.",
        ],
    },
];

export default function AnalysesPage() {
    return (
        <div className="analyses-page">
            <main className="analyses-page__main">
                <ServicesCardHero
                    title="АНАЛІЗИ"
                    subtitle="Турбота, що починається з розмови"
                    icon="/icons/service-tests.svg"
                    image="/images/consult-hero.jpg"
                    crumbs={[
                        { label: "Головна", to: "/" },
                        { label: "Послуги", to: "/services" },
                        { label: "Аналізи" },
                    ]}
                    buttonText="Обрати лікаря"
                    buttonHref="#analyses-contact"
                    buttonClassName="arrow-down"
                />

                <section className="analyses-page__intro">
                    <div className="analyses-page__container">
                        <p>
                            У нашому медичному центрі ви можете здати аналізи
                            безоплатно (для пацієнтів із декларацією) або за
                            власною потребою — за направленням лікаря чи за
                            вашим запитом. Ми виконуємо широкий спектр
                            лабораторних досліджень для точної діагностики та
                            контролю стану здоров’я. Повний перелік доступних
                            аналізів і актуальні умови можна уточнити у
                            адміністратора.
                        </p>
                    </div>
                </section>

                <InfoGridSection
                    type="analyses"
                    className="analyses-page__recommendation"
                    rightTitle="ДЛЯ ТОЧНИХ РЕЗУЛЬТАТІВ РЕКОМЕНДУЄМО:"
                    rightItems={recommendationItems}
                    imageSrc="/images/consultation.jpg"
                    imageAlt="Лікар під час консультації"
                />

                <section className="analyses-page__faq">
                    <FAQSection
                        title="НАЙБІЛЬШ ПОШИРЕНІ ЗАПИТАННЯ"
                        faqs={analysesFaqs}
                    />
                </section>

                <section id="analyses-contact" className="analyses-page__contact">
                    <div className="analyses-page__container">
                        <h2 className="analyses-page__contact-title">
                            Потрібно записатися?
                        </h2>
                    </div>
                    <ContactForm formType="Форма: Аналізи" />
                </section>
            </main>
        </div>
    );
}
