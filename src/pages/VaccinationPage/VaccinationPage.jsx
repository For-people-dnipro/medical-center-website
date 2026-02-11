import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import ServicesTemplate from "../../components/CardTemplateServices/CardTemplateServices";
import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";
import FAQSection from "../../sections/FaqSection";
import VaccinesPriceSection from "../../sections/VaccinesPriceSection/VaccinesPriceSection";
import "./VaccinationPage.css";

const vaccinationFaqs = [
    {
        question: "Чи потрібна консультація лікаря перед вакцинацією?",
        answer: [
            "Так. Перед щепленням лікар проводить короткий огляд, уточнює скарги та загальний стан здоров'я, щоб переконатися у відсутності протипоказань.",
        ],
    },
    {
        question: "Які можуть бути реакції після вакцинації?",
        answer: [
            "Після щеплення можлива незначна місцева реакція: почервоніння, чутливість у місці ін'єкції або короткочасне підвищення температури. Це нормальна відповідь імунної системи.",
        ],
    },
    {
        question: "Чи можна вакцинуватися при застуді або нежиті?",
        answer: [
            "Рішення приймає лікар після огляду. За легкої симптоматики без температури вакцинація може бути можливою, але остаточну рекомендацію надає спеціаліст на прийомі.",
        ],
    },
    {
        question: "Чи можна робити декілька вакцин в один день?",
        answer: [
            "У багатьох випадках так, це безпечно за міжнародними протоколами. Схему та поєднання вакцин визначає лікар індивідуально.",
        ],
    },
    {
        question: "Чи можна займатися спортом після щеплення?",
        answer: [
            "Після вакцинації організм активно формує імунну відповідь, тому протягом перших 24-48 годин рекомендується уникати інтенсивних фізичних навантажень. Це не через небезпеку, а для того, щоб не створювати додатковий стрес для організму.",
        ],
    },
];

const vaccinationSteps = [
    {
        number: "1",
        title: "ПОПЕРЕДНІЙ ОГЛЯД У ЛІКАРЯ",
        text: [
            "Спеціальна підготовка не потрібна, достатньо пройти короткий огляд у лікаря та взяти із собою карту щеплень.",
            "Лікар уважно огляне вас або дитину, щоб переконатись, що немає ознак застуди чи загострення хронічних захворювань і візьме інформаційну згоду на проведення щеплення.",
        ],
    },
    {
        number: "2",
        title: "ПРОВЕДЕННЯ ЩЕПЛЕННЯ",
        text: [
            "Щеплення проводиться у маніпуляційному кабінеті нашою досвідченою медсестрою.",
            "Ми суворо дотримуємось вимог контролю, використовуємо лише сертифіковані матеріали та забезпечуємо повну безпеку під час вакцинації.",
        ],
    },
    {
        number: "3",
        title: "ПІСЛЯ ВАКЦИНАЦІЇ",
        text: [
            "Після щеплення ми просимо залишатись у клініці ще близько 30 хвилин, щоб переконатися, що організм добре реагує на вакцину. У разі потреби наші фахівці одразу нададуть допомогу.",
            "Якщо підвищується температура, то можна прийняти Ібупрофен або Парацетамол.",
        ],
    },
];

export default function VaccinationPage() {
    const handleScrollToForm = (event) => {
        event.preventDefault();
        const target = document.querySelector("#vaccination-contact-form");

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>
            <main className="vaccination-page">
                <ServicesCardHero
                    title="ВАКЦИНАЦІЯ"
                    subtitle="Прояв турботи про себе та близьких"
                    icon="/icons/service-vaccine.svg"
                    image="/images/vaccination-hero.jpg"
                    crumbs={[
                        { label: "Головна", to: "/" },
                        { label: "Послуги", to: "/services" },
                        { label: "Вакцинація" },
                    ]}
                    buttonText="Записатися"
                    buttonHref="#vaccination-contact-form"
                    buttonOnClick={handleScrollToForm}
                />

                <section className="vaccination-page__intro">
                    <div className="vaccination-page__container">
                        <p className="vaccination-page__intro-text">
                            Вакцинація допомагає захистити себе і своїх рідних
                            від серйозних захворювань, зміцнює імунітет і дає
                            спокій за здоров'я родини. У нашій клініці
                            щеплення проводяться у комфортних умовах, з увагою
                            і турботою. Ми використовуємо лише перевірені
                            сертифіковані вакцини, дотримуємось усіх стандартів
                            зберігання та контролю якості.
                        </p>
                    </div>
                </section>

                <section className="vaccination-page__steps">
                    <div className="vaccination-page__container">
                        <h2 className="vaccination-page__section-title">
                            ЯК ПРОХОДИТЬ ВАКЦИНАЦІЯ
                        </h2>

                        <div className="vaccination-page__steps-grid">
                            {vaccinationSteps.map((step) => (
                                <article
                                    className="vaccination-page__step-card"
                                    key={step.number}
                                >
                                    <span className="vaccination-page__step-number">
                                        {step.number}
                                    </span>
                                    <h3 className="vaccination-page__step-title">
                                        {step.title}
                                    </h3>
                                    <div className="vaccination-page__step-text">
                                        {step.text.map((paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <ServicesTemplate
                    title="У НАС ВИ МОЖЕТЕ ЗРОБИТИ"
                    text={`• планові дитячі щеплення\n• ревакцинацію\n• вакцинацію перед подорожами\n• сезонні щеплення (наприклад, проти грипу)`}
                    image="/images/vaccination-hero.jpg"
                    imageAlt="Вакцинація в медичному центрі"
                />

                <section className="vaccination-page__mobile-offer">
                    <div className="vaccination-page__container">
                        <h2 className="vaccination-page__section-title">
                            ВИЇЗНА ВАКЦИНАЦІЯ
                        </h2>
                        <p className="vaccination-page__mobile-offer-text">
                            Ми розуміємо, як важко знайти час на медичні
                            процедури у щільному графіку. Саме тому пропонуємо
                            виїзну вакцинацію - зручний спосіб подбати про
                            здоров'я колективу, учнів або великої родини без
                            відвідування клініки. Ми дбаємо про безпеку та
                            комфорт кожного пацієнта. Перед щепленням лікар
                            проводить короткий огляд, пояснює всі деталі та
                            відповідає на запитання.
                        </p>

                        <div className="vaccination-page__mobile-offer-grid">
                            <article className="vaccination-page__mobile-offer-card">
                                <h3>
                                    НАША КОМАНДА ПРИЙДЕ ДО ВАС З УСІМ НЕОБХІДНИМ
                                </h3>
                                <ul>
                                    <li>із сертифікованими вакцинами</li>
                                    <li>зі стерильними інструментами;</li>
                                    <li>
                                        з холодильним обладнанням для
                                        правильного зберігання та
                                        транспортування препаратів;
                                    </li>
                                    <li>
                                        з повним пакетом документів і медичним
                                        супроводом.
                                    </li>
                                </ul>
                            </article>

                            <article className="vaccination-page__mobile-offer-card vaccination-page__mobile-offer-card--bordered">
                                <h3>ЦЕ РІШЕННЯ ІДЕАЛЬНО ПІДХОДИТЬ ДЛЯ</h3>
                                <ul>
                                    <li>
                                        компаній, які дбають про здоров'я
                                        співробітників;
                                    </li>
                                    <li>
                                        навчальних закладів, що організовують
                                        вакцинацію для дітей та педагогів;
                                    </li>
                                    <li>
                                        великих родин або громадських
                                        організацій;
                                    </li>
                                </ul>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="vaccination-page__records">
                    <div className="vaccination-page__container">
                        <h2>
                            МИ ДБАЄМО, ЩОБ ВАША МЕДИЧНА ІНФОРМАЦІЯ БУЛА ПОВНОЮ,
                            ТОЧНОЮ ТА ДОСТУПНОЮ.
                        </h2>
                        <p>
                            Всі вакцинації, проведені нашими лікарями,
                            обов'язково вносяться до електронної системи
                            охорони здоров'я (ЕСОЗ). Це гарантує, що у вашій
                            медкартці зберігаються точні дати щеплень, назви
                            вакцин і серії препаратів. За потреби інформація
                            дублюється у карту профілактичних щеплень,
                            затверджену МОЗ. Ви можете переглядати всю історію
                            вакцинацій у своєму кабінеті в HELSI (Медкарта →
                            Вакцинації). Тож усі потрібні дані завжди доступні у
                            зручному для вас форматі.
                        </p>
                    </div>
                </section>

                <VaccinesPriceSection />

                <FAQSection
                    title="НАЙБІЛЬШ ПОШИРЕНІ ЗАПИТАННЯ"
                    faqs={vaccinationFaqs}
                />

                <section
                    id="vaccination-contact-form"
                    className="vaccination-page__contact"
                >
                    <ContactForm
                        title="ЗАПИШІТЬСЯ НА ВАКЦИНАЦІЮ"
                        subtitle="ПОДБАЙТЕ ПРО БЕЗПЕКУ СВОЄЇ РОДИНИ ВЖЕ СЬОГОДНІ."
                        formType="Форма: Вакцинація"
                        fields={{
                            name: true,
                            phone: true,
                            email: false,
                            branch: false,
                            diagnostic: true,
                            message: true,
                        }}
                        labels={{
                            name: "Ім'я *",
                            phone: "Номер телефону *",
                            diagnostic: "Назва вакцини та необхідна кількість*",
                            message: "Повідомлення *",
                            consent:
                                "Даю згоду на збір та обробку персональних даних",
                        }}
                        placeholders={{
                            name: "Ваше ім'я",
                            phone: "Ваш номер телефону",
                            diagnostic: "Введіть назву вакцини та кількість",
                            message: "Що вас турбує?",
                        }}
                    />
                </section>
            </main>

            <Footer />
        </>
    );
}
