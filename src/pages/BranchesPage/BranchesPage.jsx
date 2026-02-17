import { Link } from "react-router-dom";
import ContactForm from "../../components/ContactForm/ContactForm";
import BranchesMap from "../../components/BranchesMap";
import MapPin from "../../components/MapPin";
import "./BranchesPage.css";

const BRANCHES = [
    {
        id: "slava",
        address: "Дніпро, бульвар Слави, 8",
        hours: "ПН-ПТ: з 9:00 до 17:00",
        phoneDisplay: "+38 (066) 067-00-37",
        phoneHref: "+380660670037",
        lat: 48.414,
        lng: 35.0659,
        mapLink: "https://www.google.com/maps?q=бульвар+Слави,+8,+Дніпро",
    },
    {
        id: "halytskoho",
        address: "Дніпро, вул. Д. Галицького, 34",
        hours: "ПН-ПТ: з 9:00 до 17:00",
        phoneDisplay: "+38 (050) 067-13-88",
        phoneHref: "+380500671388",
        lat: 48.4613,
        lng: 34.9384,
        mapLink:
            "https://www.google.com/maps?q=вул.+Данила+Галицького,+34,+Дніпро",
    },
    {
        id: "khmelnytskoho",
        address: "Дніпро, просп. Б. Хмельницького, 127",
        hours: "ПН-ПТ: з 9:00 до 17:00",
        phoneDisplay: "+38 (050) 067-22-35",
        phoneHref: "+380500672235",
        lat: 48.4063,
        lng: 35.0014,
        mapLink:
            "https://www.google.com/maps?q=просп.+Богдана+Хмельницького,+127,+Дніпро",
    },
];

export default function BranchesPage() {
    return (
        <div className="branches-page">
            <main className="branches-page__main">
                <section className="branches-page__hero">
                    <div className="branches-page__container">
                        <nav
                            className="branches-page__crumbs"
                            aria-label="Breadcrumb"
                        >
                            <Link to="/">Головна</Link>
                            <span className="crumb-separator">›</span>
                            <span className="current">Філії</span>
                        </nav>

                        <h1>НАШІ ФІЛІЇ</h1>
                    </div>
                </section>

                <section className="branches-page__list">
                    <div className="branches-page__container">
                        <div className="branches-page__cards">
                            {BRANCHES.map((branch) => (
                                <article
                                    className="branches-page__card"
                                    key={branch.id}
                                >
                                    <div className="branches-page__card-content">
                                        <div className="branches-page__address-row">
                                            <span
                                                className="branches-page__pin"
                                                aria-hidden="true"
                                            >
                                                <MapPin size={24} />
                                            </span>
                                            <h2>{branch.address}</h2>
                                        </div>

                                        <div className="branches-page__meta">
                                            <div className="branches-page__meta-item">
                                                <p className="branches-page__meta-label">
                                                    Графік роботи:
                                                </p>
                                                <p className="branches-page__meta-value">
                                                    {branch.hours}
                                                </p>
                                            </div>

                                            <div className="branches-page__meta-item">
                                                <p className="branches-page__meta-label">
                                                    Контактний номер:
                                                </p>
                                                <p className="branches-page__meta-value">
                                                    <a
                                                        href={`tel:${branch.phoneHref}`}
                                                    >
                                                        {branch.phoneDisplay}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="branches-page__map">
                                        <BranchesMap
                                            branches={[
                                                {
                                                    lat: branch.lat,
                                                    lng: branch.lng,
                                                    link: branch.mapLink,
                                                },
                                            ]}
                                            center={{
                                                lat: branch.lat,
                                                lng: branch.lng,
                                            }}
                                            zoom={14}
                                            borderRadius={0}
                                        />
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="branches-page__contact">
                    <ContactForm
                        title="ВАША ДУМКА ВАЖЛИВА"
                        subtitle="ЗАЛИШТЕ СВІЙ ВІДГУК ЩОДО ЯКОСТІ НАШИХ ПОСЛУГ"
                        formType="Форма: Відгук"
                        fields={{
                            name: true,
                            phone: true,
                            email: true,
                            branch: false,
                            diagnostic: false,
                            checkupName: false,
                            message: true,
                        }}
                    />
                </section>
            </main>
        </div>
    );
}
