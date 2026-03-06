import { useEffect, useLayoutEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import ContactForm from "../../components/ContactForm/ContactForm";
import BranchesMap from "../../components/BranchesMap";
import MapPin from "../../components/MapPin";
import SeoHead from "../../components/Seo/SeoHead";
import { getStaticSeo } from "../../seo/seoConfig";
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

const PAGE_SEO = getStaticSeo("branches");

export default function BranchesPage() {
    const location = useLocation();

    const targetBranchId = useMemo(() => {
        const stateBranchId =
            typeof location.state?.scrollToBranchId === "string"
                ? location.state.scrollToBranchId
                : "";

        let hashBranchId = "";
        let hash = location.hash || "";
        if (hash) {
            try {
                hash = decodeURIComponent(hash);
            } catch {
                hash = "";
            }

            if (hash.startsWith("#branch-")) {
                hashBranchId = hash.replace("#branch-", "");
            }
        }

        return stateBranchId || hashBranchId || "";
    }, [location.hash, location.state]);

    useLayoutEffect(() => {
        if (!targetBranchId) return;

        // Route has already changed; set top position before first paint.
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [targetBranchId, location.key]);

    useEffect(() => {
        if (!targetBranchId) return;

        let delayId = 0;
        let rafId = 0;
        let attempts = 0;

        const scrollToBranchWhenReady = () => {
            const branchCard = document.getElementById(
                `branch-${targetBranchId}`,
            );
            if (
                !branchCard ||
                branchCard.getBoundingClientRect().height === 0
            ) {
                if (attempts < 60) {
                    attempts += 1;
                    rafId = window.requestAnimationFrame(
                        scrollToBranchWhenReady,
                    );
                }
                return;
            }

            const headerHeight =
                document.querySelector(".header")?.getBoundingClientRect()
                    .height || 0;
            const rect = branchCard.getBoundingClientRect();
            const absoluteTop = window.scrollY + rect.top;
            const targetTop = Math.max(
                absoluteTop -
                    headerHeight -
                    Math.max(window.innerHeight * 0.06, 18),
                0,
            );

            window.scrollTo({
                top: targetTop,
                left: 0,
                behavior: "smooth",
            });
        };

        // Wait briefly so users clearly see page change, then scroll down.
        delayId = window.setTimeout(() => {
            rafId = window.requestAnimationFrame(scrollToBranchWhenReady);
        }, 520);

        return () => {
            window.clearTimeout(delayId);
            window.cancelAnimationFrame(rafId);
        };
    }, [targetBranchId, location.key]);

    return (
        <div className="branches-page">
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/branches"
            />
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
                                    id={`branch-${branch.id}`}
                                >
                                    <div className="branches-page__card-content">
                                        <div className="branches-page__address-row">
                                            <MapPin
                                                className="branches-page__pin"
                                                size={28}
                                            />
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
                                            branches={branch.mapMarkers}
                                            center={branch.mapCenter}
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
