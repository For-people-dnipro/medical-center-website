import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ContactForm from "../../components/ContactForm/ContactForm";
import SeoHead from "../../components/Seo/SeoHead";
import { getStaticSeo } from "../../seo/seoConfig";
import { SOCIAL_LINKS } from "../../constants/socialLinks";
import "./ContactsPage.css";

const PAGE_SEO = getStaticSeo("contacts");
const BRANCHES = [
    {
        id: "galytskoho",
        address: "м. Дніпро, вул. Данила Галицького, 34",
        phone: "+38 (050) 067-13-88",
        tel: "+380500671388",
        mapLink:
            "https://www.google.com/maps?q=вул.+Данила+Галицького,+34,+Дніпро",
    },
    {
        id: "khmelnytskoho",
        address: "м. Дніпро, просп. Б. Хмельницького, 127",
        phone: "+38 (050) 067-22-35",
        tel: "+380500672235",
        mapLink:
            "https://www.google.com/maps?q=просп.+Богдана+Хмельницького,+127,+Дніпро",
    },
    {
        id: "slavy",
        address: "м. Дніпро, бульвар Слави, 8",
        phone: "+38 (066) 067-00-37",
        tel: "+380660670037",
        mapLink: "https://www.google.com/maps?q=бульвар+Слави,+8,+Дніпро",
    },
];

export default function ContactsPage() {
    return (
        <main className="contacts-page">
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/contacts"
            />

            <section className="contacts-page__connect">
                <div className="contacts-page__container">
                    <Breadcrumbs
                        className="contacts-page__crumbs"
                        ariaLabel="Breadcrumb"
                        items={[
                            { label: "Головна", to: "/" },
                            { label: "Контакти" },
                        ]}
                    />
                    <h1 className="contacts-page__title">
                        ЯК З НАМИ ЗВʼЯЗАТИСЯ
                    </h1>

                    <div className="contacts-page__connect-layout">
                        <div className="contacts-page__info-grid">
                            <article className="contacts-page__info-card">
                                <span
                                    className="contacts-page__info-icon"
                                    aria-hidden="true"
                                >
                                    <MapPin size={34} strokeWidth={1.8} />
                                </span>
                                <h2 className="contacts-page__info-title">
                                    Адреси філій
                                </h2>

                                <ul className="contacts-page__branch-list">
                                    {BRANCHES.map((branch) => (
                                        <li key={branch.id}>
                                            <a
                                                className="contacts-page__branch-address contacts-page__branch-address-link"
                                                href={branch.mapLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`Відкрити ${branch.address} на Google Maps`}
                                            >
                                                {branch.address}
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                <p className="contacts-page__schedule">
                                    Працюємо у будні з 09:00 до 18:00
                                </p>
                            </article>

                            <article className="contacts-page__info-card contacts-page__info-card--center">
                                <span
                                    className="contacts-page__info-icon"
                                    aria-hidden="true"
                                >
                                    <Phone size={34} strokeWidth={1.8} />
                                </span>
                                <h2 className="contacts-page__info-title">
                                    Контакт-центр
                                </h2>

                                <ul className="contacts-page__phone-list">
                                    {BRANCHES.map((branch) => (
                                        <li key={branch.id}>
                                            <a
                                                className="contacts-page__branch-phone"
                                                href={`tel:${branch.tel}`}
                                            >
                                                {branch.phone}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </article>

                            <article className="contacts-page__info-card contacts-page__info-card--online">
                                <span
                                    className="contacts-page__info-icon"
                                    aria-hidden="true"
                                >
                                    <Mail size={34} strokeWidth={1.8} />
                                </span>
                                <h2 className="contacts-page__info-title">
                                    Онлайн-звʼязок
                                </h2>
                                <p className="contacts-page__info-text">
                                    Пошта для запитань
                                </p>
                                <a
                                    className="contacts-page__info-link"
                                    href="mailto:dnipro4people@gmail.com"
                                >
                                    dnipro4people@gmail.com
                                </a>

                                <div
                                    className="contacts-page__socials"
                                    aria-label="Соцмережі"
                                >
                                    <a
                                        href={SOCIAL_LINKS.instagram}
                                        aria-label="Instagram"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Instagram
                                            className="footer-icon"
                                            aria-hidden="true"
                                        />
                                    </a>
                                    <a
                                        href={SOCIAL_LINKS.facebook}
                                        aria-label="Facebook"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Facebook
                                            className="footer-icon"
                                            aria-hidden="true"
                                        />
                                    </a>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contacts-page__review">
                <div className="contacts-page__container">
                    <ContactForm />
                </div>
            </section>
        </main>
    );
}
