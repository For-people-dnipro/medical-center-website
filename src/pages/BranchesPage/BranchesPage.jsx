import ContactForm from "../../components/ContactForm/ContactForm";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import BranchCard from "../../components/BranchCard/BranchCard";
import "./BranchesPage.css";

const BRANCHES = [
    {
        id: "slava",
        address: "Дніпро, бульвар Слави, 8",
        hours: "ПН-ПТ: з 9:00 до 18:00",
        phoneDisplay: "+38 (066) 067-00-37",
        phoneHref: "+380660670037",
        lat: 48.414,
        lng: 35.0659,
        mapLink: "https://www.google.com/maps?q=бульвар+Слави,+8,+Дніпро",
        mapCenter: { lat: 48.414, lng: 35.0659 },
        mapMarkers: [
            {
                id: "slava",
                lat: 48.414,
                lng: 35.0659,
                link: "https://www.google.com/maps?q=бульвар+Слави,+8,+Дніпро",
            },
        ],
    },
    {
        id: "halytskoho",
        address: "Дніпро, вул. Д. Галицького, 34",
        hours: "ПН-ПТ: з 9:00 до 18:00",
        phoneDisplay: "+38 (050) 067-13-88",
        phoneHref: "+380500671388",
        lat: 48.4613,
        lng: 34.9384,
        mapLink:
            "https://www.google.com/maps?q=вул.+Данила+Галицького,+34,+Дніпро",
        mapCenter: { lat: 48.4613, lng: 34.9384 },
        mapMarkers: [
            {
                id: "halytskoho",
                lat: 48.4613,
                lng: 34.9384,
                link: "https://www.google.com/maps?q=вул.+Данила+Галицького,+34,+Дніпро",
            },
        ],
    },
    {
        id: "khmelnytskoho",
        address: "Дніпро, просп. Б. Хмельницького, 127",
        hours: "ПН-ПТ: з 9:00 до 18:00",
        phoneDisplay: "+38 (050) 067-22-35",
        phoneHref: "+380500672235",
        lat: 48.4063,
        lng: 35.0014,
        mapLink:
            "https://www.google.com/maps?q=просп.+Богдана+Хмельницького,+127,+Дніпро",
        mapCenter: { lat: 48.4063, lng: 35.0014 },
        mapMarkers: [
            {
                id: "khmelnytskoho",
                lat: 48.4063,
                lng: 35.0014,
                link: "https://www.google.com/maps?q=просп.+Богдана+Хмельницького,+127,+Дніпро",
            },
        ],
    },
];

export default function BranchesPage() {
    return (
        <div className="branches-page">
            <main className="branches-page__main">
                <section className="branches-page__hero">
                    <div className="branches-page__container">
                        <Breadcrumbs
                            className="branches-page__crumbs"
                            ariaLabel="Breadcrumb"
                            items={[
                                { label: "Головна", to: "/" },
                                { label: "Філії" },
                            ]}
                        />

                        <h1>НАШІ ФІЛІЇ</h1>
                    </div>
                </section>

                <section className="branches-page__list">
                    <div className="branches-page__container">
                        <div className="branches-page__cards">
                            {BRANCHES.map((branch) => (
                                <BranchCard key={branch.id} branch={branch} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="branches-page__contact">
                    <ContactForm
                        title="ВАША ДУМКА ВАЖЛИВА"
                        subtitle="ЗАЛИШТЕ СВІЙ ВІДГУК ЩОДО ЯКОСТІ НАШИХ ПОСЛУГ"
                        formType="Форма: Відгук"
                        placeholders={{
                            name: "Ваше імʼя",
                            phone: "Ваш номер телефону",
                            email: "Ваша ел. пошта (за бажанням)",
                            branch: "Оберіть філію",
                            diagnostic: "Вкажіть назву процедури",
                            checkupName: "Введіть назву CHECK-UP",
                            message: "Залиште свій відгук",
                        }}
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
