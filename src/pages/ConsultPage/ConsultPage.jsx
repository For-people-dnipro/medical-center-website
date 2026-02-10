import ServicesCardHero from "../../components/ServicesCardHero/ServicesCardHero";
import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";
import "./ConsultPage.css";
import Ticket from "../../components/Ticket/Ticket";
import CardTemplateServices from "../../components/CardTemplateServices/CardTemplateServices";

export default function ConsultPage() {
    return (
        <div className="consult-page">
            <main className="consult-page__main">
                <ServicesCardHero
                    title="КОНСУЛЬТАЦІЯ"
                    subtitle="Турбота, що починається з розмови"
                    icon="/icons/service-consult.svg"
                    image="/images/consult-hero.jpg"
                    crumbs={[
                        { label: "Головна", to: "/" },
                        { label: "Послуги", to: "/services" },
                        { label: "Консультація" },
                    ]}
                    buttonText="Обрати лікаря"
                    buttonHref="#contact-form"
                />

                <section className="services-text-under-card__intro">
                    <div className="services-text-under-card__container">
                        <p>
                            Консультація у лікарів в Медичному центрі «Для
                            людей» — це зустріч із лікарем, який слухає, пояснює
                            і допомагає знайти рішення без поспіху та зайвих
                            формальностей. Ми поруч, щоб підтримати вас у
                            будь-якій ситуації — від першого питання до повного
                            одужання.
                        </p>
                    </div>
                </section>

                <section className="consult-page__specialists">
                    <div className="services-text-under-card__container">
                        <h2>НАШІ СПЕЦІАЛІСТИ</h2>
                        <h3 className="consult-page__subtitle">
                            У нашій клініці ви можете отримати консультацію
                            досвідчених фахівців:
                        </h3>

                        <div className="consult-page__grid">
                            <article className="consult-page__card">
                                <h3>ТЕРАПЕВТА / СІМЕЙНОГО ЛІКАРЯ</h3>
                                <p>
                                    Огляд, профілактика, направлення, контроль
                                    загального стану.
                                </p>
                            </article>

                            <article className="consult-page__card">
                                <h3>ГІНЕКОЛОГА</h3>
                                <p>
                                    Жіноче здоров’я, планування та ведення
                                    вагітності, профілактичні огляди.
                                </p>
                            </article>

                            <article className="consult-page__card">
                                <h3>ЕНДОКРИНОЛОГА</h3>
                                <p>
                                    Гормональний баланс, контроль діабету,
                                    щитоподібна залоза, обмін речовин.
                                </p>
                            </article>

                            <article className="consult-page__card">
                                <h3>НЕВРОЛОГА</h3>
                                <p>
                                    Головний біль, безсоння, наслідки стресу,
                                    відновлення після перевантажень.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="cta-all-pages">
                    <Ticket text="Підпишіть декларацію онлайн або завітайте до клініки і дозвольте нам дбати про вас." />
                </section>

                <CardTemplateServices
                    title="ЯКЩО ПОТРІБЕН ІНШИЙ ЛІКАР"
                    text={
                        <>
                            Навіть якщо у нас, поки що, ще немає потрібного
                            фахівця — ми не залишимо вас без відповіді. Наші
                            лікарі направлять вас до перевірених колег,{" "}
                            <strong>яким ми довіряємо</strong>. Бо турбота про
                            здоров’я — це не лише про наші стіни, а про спільну
                            відповідальність за ваш добробут.
                        </>
                    }
                    image="/images/consultation-other-doctor.png"
                    imageAlt="Лікар консультує пацієнта"
                />

                <section id="consult-form" className="consult-page__contact">
                    <ContactForm smallTitle="МИ ЗАВЖДИ ПОРУЧ" />
                </section>
            </main>

            <Footer />
        </div>
    );
}
