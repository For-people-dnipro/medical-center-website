import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import CardTemplateServices from "../../components/CardTemplateServices/CardTemplateServices";
import Ticket from "../../components/Ticket/Ticket";
import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";
import InfoGridSection from "../../components/InfoGridSection/InfoGridSection";
import PackagesCardsGrid from "../../components/PackagesCardsGrid/PackagesCardsGrid";
import "./PackagesPage.css";

const packageBenefits = [
    <>
        <strong>Зручно.</strong> Усі послуги вже зібрані — не потрібно щоразу
        записуватись і платити окремо.
    </>,
    <>
        <strong>Спокійно.</strong> Ви знаєте, що отримуєте все необхідне — без
        поспіху, пропусків і зайвих витрат.
    </>,
    <>
        <strong>Прозоро.</strong> Ви заздалегідь знаєте повну вартість і склад
        пакета.
    </>,
    <>
        <strong>Послідовно.</strong> Лікар супроводжує вас на кожному етапі, від
        першої консультації до завершення програми.
    </>,
];

const packageAudience = [
    <>
        <strong>Для пацієнтів із хронічними станами</strong>
        Щоб отримати постійний контроль, корекцію лікування та поради без
        повторних візитів і плутанини.
    </>,
    <>
        <strong>Для тих, хто хоче спокою та впевненості</strong>
        Коли важливо знати, що все організовано заздалегідь: обстеження
        заплановані, консультації узгоджені, а лікар контролює процес.
    </>,
    <>
        <strong>Для тих, хто цінує послідовність</strong>
        Якщо важливо пройти весь шлях лікування або профілактики від початку до
        кінця з одним лікарем. Пакет допомагає рухатися по чіткому плану без
        хаосу.
    </>,
];

export default function PackagesPage() {
    const handleScrollToForm = (event) => {
        event.preventDefault();
        const target = document.querySelector("#packages-form");

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="packages-page">
            <main className="packages-page__main">
                <ServicesCardHero
                    title="ПАКЕТНІ ПОСЛУГИ"
                    subtitle="Турбота, спланована заздалегідь"
                    image="/images/packages-hero-nurse.jpg"
                    icon="/icons/service-packages.svg"
                    crumbs={[
                        { label: "Головна", to: "/" },
                        { label: "Послуги", to: "/services" },
                        { label: "Пакетні послуги" },
                    ]}
                    buttonText="Записатися"
                    buttonHref="#packages-form"
                    buttonOnClick={handleScrollToForm}
                />
                <section className="packages-page__about">
                    <CardTemplateServices
                        title="ЩО ТАКЕ ПАКЕТНІ ПОСЛУГИ"
                        text="Пакет — це комплекс медичних послуг, об’єднаних за темою або потребою. Ви отримуєте не окремі консультації, а повний супровід у певній сфері медицини. Кожен пакет включає перелік обстежень, консультацій та аналізів, підібраних лікарями так, щоб ви отримали цілісну допомогу без зайвих клопотів."
                        image="/images/package-services.jpg"
                        imageAlt="Медична процедура"
                    />
                </section>{" "}
                <section className="packages-page__warning">
                    <Ticket text="САМОЛІКУВАННЯ МОЖЕ БУТИ ШКІДЛИВИМ ДЛЯ ВАШОГО ЗДОРОВ’Я" />
                </section>
                <InfoGridSection
                    type="packages"
                    className="packages-page__info"
                    leftTitle="У ЧОМУ ПЕРЕВАГА ПАКЕТІВ"
                    leftItems={packageBenefits}
                    rightTitle="ДЛЯ КОГО ВОНИ СТВОРЕНІ"
                    rightItems={packageAudience}
                />
                <PackagesCardsGrid />
                <section id="packages-form" className="packages-page__contact">
                    <ContactForm
                        title="МИ ЗАВЖДИ ПОРУЧ, ЩОБ ДОПОМОГТИ"
                        subtitle="ЗАЛИШТЕ ПОВІДОМЛЕННЯ"
                    />
                </section>
            </main>
        </div>
    );
}
