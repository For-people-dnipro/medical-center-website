import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import CardTemplateServices from "../../components/CardTemplateServices/CardTemplateServices";
import Ticket from "../../components/Ticket/Ticket";
import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";
import SeoHead from "../../components/Seo/SeoHead";
import { getStaticSeo } from "../../seo/seoConfig";
import "./TestPage.css";

const checkupPackages = [
    {
        title: "“Базовий”",
        subtitle: "Для тих, хто хоче впевнитися, що все гаразд.",
        items: [
            "Консультація терапевта",
            "Загальний аналіз крові",
            "Біохімічний аналіз крові (глюкоза, холестерин, печінкові та ниркові показники)",
            "Аналіз сечі",
            "УЗД органів черевної порожнини, щитоподібної залози, лімфатичних вузлів",
            "ЕКГ",
        ],
        recommendation: "Рекомендується проходити 1 раз на рік.",
    },
    {
        title: "“Жіноче здоров’я”",
        subtitle: "Для профілактики та спокою кожної жінки.",
        items: [
            "Консультація гінеколога",
            "Гінекологічне УЗД",
            "Цитологічний мазок (ПАП-тест)",
            "Загальний аналіз крові",
            "Аналіз сечі",
            "Гормональні показники",
        ],
        recommendation:
            "Рекомендується проходити 2 рази на рік або за рекомендацією лікаря.",
    },
    {
        title: "“Щитовидна залоза”",
        subtitle: "Для контролю енергії, ваги та настрою.",
        items: [
            "Консультація ендокринолога",
            "УЗД щитоподібної залози",
            "Аналіз крові на ТТГ, Т3, Т4",
            "За потреби — антитіла до ТПО",
        ],
        recommendation:
            "Рекомендується при втомі, зміні ваги або спадковій схильності.",
    },
    {
        title: "“Серце під контролем”",
        subtitle: "Для підтримки здорового серця.",
        items: [
            "Консультація терапевта",
            "ЕКГ",
            "Вимірювання артеріального тиску",
            "Аналіз крові на холестерин, глюкозу, ліпідограму",
        ],
        recommendation:
            "Рекомендується після 35 років або при підвищеному тиску, стресах, втомі.",
    },
];

const corporateBenefits = [
    "зменшити кількість лікарняних днів і стресових станів;",
    "своєчасно виявляти проблеми зі здоров’ям;",
    "підвищити рівень енергії та продуктивності команди;",
    "показати працівникам, що їхнє благополуччя для вас важливе.",
];

const checkupTopRow = checkupPackages.slice(0, 2);
const checkupBottomRow = checkupPackages.slice(2);
const PAGE_SEO = getStaticSeo("checkup");

export default function TestPage() {
    const handleScrollToForm = (event) => {
        event.preventDefault();
        const target = document.querySelector("#checkup-form");

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="test-page">
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/checkup"
            />
            <main className="test-page__main">
                <ServicesCardHero
                    title="CHECK-UP"
                    subtitle="Перевірити здоров’я для власного спокою"
                    icon="/icons/service-checkup.svg"
                    image="/images/consultation.jpg"
                    crumbs={[
                        { label: "Головна", to: "/" },
                        { label: "Послуги", to: "/services" },
                        { label: "CHECK-UP" },
                    ]}
                    buttonText="Записатися"
                    buttonHref="#checkup-form"
                    buttonClassName="arrow-down"
                    buttonOnClick={handleScrollToForm}
                />

                <section className="services-text-under-card__intro">
                    <div className="services-text-under-card__container">
                        <p>
                            Регулярні профілактичні обстеження допомагають
                            помічати зміни ще до появи симптомів. Ми створили
                            прості програми перевірки здоров’я, які можна пройти
                            швидко, зручно та отримати показники, що дійсно
                            покажуть стан вашого здоров’я.
                        </p>
                    </div>
                </section>

                <section className="test-page__packages test-page__packages--top">
                    <div className="test-page__container">
                        <div className="test-page__packages-grid">
                            {checkupTopRow.map((pkg) => (
                                <article
                                    className="test-page__package-card"
                                    key={pkg.title}
                                >
                                    <h3 className="test-page__package-label">
                                        CHECK-UP
                                    </h3>
                                    <h3 className="test-page__package-title">
                                        {pkg.title}
                                    </h3>
                                    <p className="test-page__package-subtitle">
                                        {pkg.subtitle}
                                    </p>

                                    <ul className="test-page__package-list">
                                        {pkg.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>

                                    <p className="test-page__package-note">
                                        {pkg.recommendation}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <Ticket text="Всесвітня організація охорони здоров’я (ВООЗ) рекомендує проходити чекапи регулярно!" />

                <section className="test-page__packages test-page__packages--bottom">
                    <div className="test-page__container">
                        <div className="test-page__packages-grid">
                            {checkupBottomRow.map((pkg) => (
                                <article
                                    className="test-page__package-card"
                                    key={pkg.title}
                                >
                                    <p className="test-page__package-label">
                                        CHECK-UP
                                    </p>
                                    <h3 className="test-page__package-title">
                                        {pkg.title}
                                    </h3>
                                    <p className="test-page__package-subtitle">
                                        {pkg.subtitle}
                                    </p>

                                    <ul className="test-page__package-list">
                                        {pkg.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>

                                    <p className="test-page__package-note">
                                        {pkg.recommendation}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="test-page__corporate">
                    <div className="test-page__container">
                        <h2>ПІКЛУЄМОСЯ ПРО ЗДОРОВ’Я ВАШОЇ КОМАНДИ</h2>
                        <p className="test-page__corporate-text">
                            Ми проводимо профілактичні обстеження для окремих
                            пацієнтів і колективів компаній. Check-up програми
                            адаптуємо під потреби вашої організації — від
                            базових аналізів до комплексних обстежень із
                            консультаціями лікарів. Обстеження можливе у клініці
                            або з виїздом на підприємство. Формуємо програми
                            індивідуально з урахуванням кількості працівників і
                            специфіки роботи. Check-up для співробітників — це
                            турбота про здоров’я команди, яку відчувають усі.
                        </p>
                    </div>

                    <div className="test-page__corporate-card">
                        <CardTemplateServices
                            title="ТАКІ ПРОГРАМИ ДОПОМАГАЮТЬ:"
                            titleTag="h3"
                            text={
                                <>
                                    {corporateBenefits.map((benefit) => (
                                        <span
                                            className="test-page__benefit-item"
                                            key={benefit}
                                        >
                                            {benefit}
                                        </span>
                                    ))}
                                </>
                            }
                            image="/images/ambulance.jpg"
                            imageAlt="Медичні працівники біля швидкої допомоги"
                        />
                    </div>
                </section>

                <section id="checkup-form" className="test-page__form-section">
                    <ContactForm
                        title="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                        subtitle="МИ ПІДБЕРЕМО НАЙКРАЩИЙ ФОРМАТ ДЛЯ ВАШОЇ КОМПАНІЇ"
                        formType="Форма: CHECK-UP"
                        buttonText="Надіслати повідомлення"
                        fields={{
                            name: true,
                            phone: true,
                            email: false,
                            branch: false,
                            diagnostic: false,
                            checkupName: true,
                            message: true,
                        }}
                        labels={{
                            name: "Імʼя *",
                            phone: "Номер телефону *",
                            checkupName: "Назва CHECK-UP*",
                            message: "Повідомлення *",
                            consent:
                                "Даю згоду на збір та обробку персональних даних",
                        }}
                        placeholders={{
                            name: "Ваше імʼя",
                            phone: "Ваш номер телефону",
                            checkupName: "Введіть назву CHECK-UP",
                            message: "Що вас турбує?",
                        }}
                    />
                </section>
            </main>
        </div>
    );
}
