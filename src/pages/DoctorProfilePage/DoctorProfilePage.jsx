import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import BranchCard from "../../components/BranchCard/BranchCard";
import Button from "../../components/Button/Button";
import ContactForm from "../../components/ContactForm/ContactForm";
import DoctorProfileTabs from "../../components/DoctorProfileTabs/DoctorProfileTabs";
import RelatedDoctorsSection from "../../components/RelatedDoctorsSection/RelatedDoctorsSection";
import SeoHead from "../../components/Seo/SeoHead";
import { getResponsiveImageProps } from "../../api/foundation";
import {
    fetchDoctorBranches,
    fetchDoctorBySlug,
    fetchDoctorsList,
    formatExperienceYearsLabel,
    getBranchIdentity,
    getDoctorTabItems,
} from "../../api/doctorsApi";
import {
    buildDoctorFallbackDescription,
    buildDoctorFallbackTitle,
    firstSeoText,
    withSiteTitle,
} from "../../seo/seoConfig";
import "../BranchesPage/BranchesPage.css";
import "./DoctorProfilePage.css";

function buildDescription(doctor) {
    return firstSeoText(
        doctor?.seoDescription,
        doctor?.shortDescription,
        buildDoctorFallbackDescription({
            fullName: doctor?.fullName,
            shortDescription: doctor?.shortDescription,
        }),
    );
}

function getProfileButtons(doctor) {
    const defaults = [
        { id: "book", text: "Записатися до лікаря", href: "/contacts" },
        // { id: "declaration", text: "Підписати декларацію", href: "/declaration" },
    ];

    const buttons = Array.isArray(doctor?.buttons) ? doctor.buttons : [];

    return defaults.map((defaultButton, index) => {
        const candidate = buttons[index];
        const href = String(candidate?.href || "").trim();

        return {
            ...defaultButton,
            href: href || defaultButton.href,
        };
    });
}

function getInitials(name) {
    return (name || "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function parseStartYear(value) {
    const text = String(value ?? "").trim();
    if (!text) return null;

    const direct = Number(text.replace(",", "."));
    const numeric =
        Number.isFinite(direct)
            ? direct
            : Number(
                  (text.match(/-?\d+(?:[.,]\d+)?/)?.[0] || "").replace(
                      ",",
                      ".",
                  ),
              );
    const year = Math.trunc(numeric);
    if (!Number.isFinite(year) || year <= 0) return null;
    return year;
}

function resolveExperienceYears(doctor) {
    const currentYear = new Date().getFullYear();
    const startYear = parseStartYear(doctor?.startYear);

    if (startYear === null) return null;
    const yearsOfExperience = currentYear - startYear;
    if (yearsOfExperience <= 0) return 1;

    return yearsOfExperience;
}

function dedupeDoctors(items = []) {
    const unique = new Map();

    items.forEach((item, index) => {
        if (!item) return;

        const key =
            String(item.documentId || "").trim() ||
            String(item.slug || "").trim().toLowerCase() ||
            String(item.id || "").trim() ||
            `idx-${index}`;

        if (!unique.has(key)) {
            unique.set(key, item);
        }
    });

    return Array.from(unique.values());
}

export default function DoctorProfilePage() {
    const { slug = "" } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [doctorBranch, setDoctorBranch] = useState(null);
    const [relatedDoctors, setRelatedDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function loadDoctorProfile() {
            if (!slug) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");
            setNotFound(false);
            setDoctor(null);
            setDoctorBranch(null);
            setRelatedDoctors([]);

            try {
                const doctorData = await fetchDoctorBySlug(slug, {
                    signal: controller.signal,
                });

                if (controller.signal.aborted) return;

                if (!doctorData || doctorData.isActive === false) {
                    setNotFound(true);
                    return;
                }

                setDoctor(doctorData);
                setDoctorBranch(doctorData.branch || null);

                const branchIdentity = getBranchIdentity(doctorData.branch);
                if (!branchIdentity) return;

                const doctorsResponse = await fetchDoctorsList({
                    signal: controller.signal,
                });

                if (controller.signal.aborted) return;

                const related = (doctorsResponse.items || [])
                    .filter((item) => item.slug !== doctorData.slug)
                    .filter(
                        (item) =>
                            getBranchIdentity(item.branch) === branchIdentity,
                    );

                setRelatedDoctors(dedupeDoctors(related));

                try {
                    const branchesList = await fetchDoctorBranches({
                        signal: controller.signal,
                    });

                    if (controller.signal.aborted) return;

                    const resolvedBranch = (branchesList || []).find(
                        (branch) =>
                            getBranchIdentity(branch) === branchIdentity,
                    );

                    if (resolvedBranch) {
                        setDoctorBranch(resolvedBranch);
                    }
                } catch (branchRequestError) {
                    if (branchRequestError?.name === "AbortError") return;
                    console.error(
                        "Failed to resolve doctor branch from branches list:",
                        branchRequestError,
                    );
                }
            } catch (requestError) {
                if (requestError?.name === "AbortError") return;
                console.error("Failed to load doctor profile:", requestError);
                const rawMessage = String(requestError?.message || "");
                setError(
                    rawMessage.includes("UNAUTHORIZED")
                        ? "Немає доступу до Doctors API. У Strapi увімкніть `find` для Public role."
                        : "Не вдалося завантажити сторінку лікаря. Спробуйте пізніше.",
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadDoctorProfile();

        return () => controller.abort();
    }, [slug]);

    const pageTitle = withSiteTitle(
        doctor?.seoTitle,
        buildDoctorFallbackTitle(doctor?.fullName),
    );
    const pageDescription = buildDescription(doctor);
    const canonicalPath = slug ? `/doctors/${slug}` : "/doctors";
    const fallbackTitle = buildDoctorFallbackTitle(doctor?.fullName);
    const fallbackDescription = buildDoctorFallbackDescription({
        fullName: doctor?.fullName,
        shortDescription: doctor?.shortDescription,
    });
    const doctorPhotoProps = getResponsiveImageProps(doctor?.photo, {
        variant: "hero",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 520px",
    });
    const seoProps = {
        title: pageTitle,
        description: pageDescription,
        fallbackTitle,
        fallbackDescription,
        ogTitle: firstSeoText(doctor?.seoTitle, doctor?.fullName, "Лікар"),
        ogDescription: pageDescription,
        ogType: "website",
        ogImage: doctor?.photo?.url || "",
        canonicalPath,
        preloadImages: doctorPhotoProps?.src
            ? [
                  {
                      href: doctorPhotoProps.src,
                      imageSrcSet: doctorPhotoProps.srcSet,
                      imageSizes: doctorPhotoProps.sizes,
                  },
              ]
            : [],
    };

    if (loading) {
        return (
            <main className="doctor-profile-page">
                <SeoHead {...seoProps} />
                <div className="doctor-profile-page__container">
                    <div className="doctor-profile-page__state" role="status">
                        Завантажуємо сторінку лікаря...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="doctor-profile-page">
                <SeoHead {...seoProps} />
                <div className="doctor-profile-page__container">
                    <div
                        className="doctor-profile-page__state doctor-profile-page__state--error"
                        role="alert"
                    >
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (notFound || !doctor) {
        return (
            <main className="doctor-profile-page">
                <SeoHead {...seoProps} />
                <div className="doctor-profile-page__container">
                    <div className="doctor-profile-page__state" role="status">
                        Лікаря не знайдено.
                    </div>
                </div>
            </main>
        );
    }

    const years = resolveExperienceYears(doctor);
    const hasStartYear = years !== null;
    const doctorPosition = doctor?.position || "";
    const tabItems = getDoctorTabItems(doctor);
    const activeBranch = doctorBranch || doctor.branch || null;
    const branchAddress = activeBranch?.address || doctor.address || "";
    const branchFilterValue = String(
        activeBranch?.id ?? getBranchIdentity(activeBranch),
    ).trim();
    const doctorsByBranchHref = branchFilterValue
        ? `/doctors?branch=${encodeURIComponent(branchFilterValue)}`
        : "/doctors";
    const buttons = getProfileButtons(doctor);
    const doctorNameForAlt = String(doctor.fullName || "Лікар").trim();
    const doctorImageAlt = `Сімейний лікар ${doctorNameForAlt} — медичний центр Для Людей, Дніпро`;
    const doctorPageSource = `Лікар: ${doctor.fullName || "Лікар"}`;
    return (
        <main className="doctor-profile-page">
            <SeoHead {...seoProps} />
            <section className="doctor-profile-page__hero">
                <div className="doctor-profile-page__container doctor-profile-page__container--hero">
                    <Breadcrumbs
                        className="doctor-profile-page__crumbs"
                        ariaLabel="Breadcrumb"
                        items={[
                            { label: "Головна", to: "/" },
                            { label: "Лікарі", to: "/doctors" },
                            { label: doctor.fullName },
                        ]}
                    />

                    <div className="doctor-profile-page__hero-layout">
                        <div className="doctor-profile-page__photo-card">
                            <div className="doctor-profile-page__photo-wrap">
                                {doctorPhotoProps?.src ? (
                                    <img
                                        className="doctor-profile-page__photo"
                                        src={doctorPhotoProps.src}
                                        srcSet={doctorPhotoProps.srcSet}
                                        sizes={doctorPhotoProps.sizes}
                                        alt={doctorImageAlt}
                                        width={doctorPhotoProps.width || 760}
                                        height={doctorPhotoProps.height || 960}
                                        loading="eager"
                                        fetchpriority="high"
                                        decoding="async"
                                    />
                                ) : (
                                    <div className="doctor-profile-page__photo doctor-profile-page__photo--placeholder">
                                        <span>{getInitials(doctor.fullName) || "Л"}</span>
                                    </div>
                                )}

                                {hasStartYear ? (
                                    <div
                                        className="doctor-profile-page__experience-badge"
                                        aria-hidden="true"
                                    >
                                        <div className="doctor-profile-page__experience-number">
                                            {years}
                                        </div>
                                        <div className="doctor-profile-page__experience-line" />
                                        <div className="doctor-profile-page__experience-text">
                                            {formatExperienceYearsLabel(years)}
                                            <br />
                                            досвіду
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <article className="doctor-profile-page__info-card">
                            <div className="doctor-profile-page__hero-content">
                                <div className="doctor-profile-page__hero-top">
                                    <h1 className="doctor-profile-page__name">
                                        {doctor.fullName}
                                    </h1>

                                    {doctorPosition ? (
                                        <p className="doctor-profile-page__specialisation">
                                            {doctorPosition}
                                        </p>
                                    ) : null}

                                    {branchAddress ? (
                                        <div className="doctor-profile-page__address-row">
                                            <p className="doctor-profile-page__address-label">
                                                Приймає за адресою:
                                            </p>
                                            <p className="doctor-profile-page__address">
                                                <img
                                                    className="doctor-profile-page__address-icon"
                                                    src="/icons/map-point-green.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                                <span>{branchAddress}</span>
                                            </p>
                                        </div>
                                    ) : null}

                                    {doctor.quote ? (
                                        <blockquote className="doctor-profile-page__quote">
                                            {doctor.quote}
                                        </blockquote>
                                    ) : null}
                                </div>

                                {buttons.length > 0 ? (
                                    <div className="doctor-profile-page__actions">
                                        {buttons.slice(0, 2).map((button) => (
                                            <Button
                                                key={button.id || button.href}
                                                href={button.href}
                                            >
                                                {button.text}
                                            </Button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section className="doctor-profile-page__tabs">
                <div className="doctor-profile-page__container">
                    <DoctorProfileTabs
                        tabs={tabItems}
                        initialTabKey="education"
                    />
                </div>
            </section>

            {activeBranch ? (
                <section className="doctor-profile-page__branch branches-page__list">
                    <div className="branches-page__container">
                        <div className="branches-page__cards">
                            <BranchCard branch={activeBranch} />
                        </div>
                    </div>
                </section>
            ) : null}

            {relatedDoctors.length > 0 ? (
                <section className="doctor-profile-page__related">
                    <div className="doctor-profile-page__container">
                        <RelatedDoctorsSection
                            doctors={relatedDoctors}
                            branchAddress={branchAddress}
                            allDoctorsHref={doctorsByBranchHref}
                            allDoctorsLabel="Дивитися всіх"
                        />
                    </div>
                </section>
            ) : null}

            <section className="doctor-profile-page__contact">
                <ContactForm
                    title="ВАША ДУМКА ВАЖЛИВА"
                    subtitle="ЗАЛИШТЕ СВІЙ ВІДГУК ЩОДО ЯКОСТІ НАШИХ ПОСЛУГ"
                    formType={doctorPageSource}
                    detailsLabels={{ form: "Сторінка лікаря" }}
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
    );
}
