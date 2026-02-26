import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import BranchCard from "../../components/BranchCard/BranchCard";
import Button from "../../components/Button/Button";
import DoctorProfileTabs from "../../components/DoctorProfileTabs/DoctorProfileTabs";
import MapPin from "../../components/MapPin";
import RelatedDoctorsSection from "../../components/RelatedDoctorsSection/RelatedDoctorsSection";
import {
    fetchDoctorBySlug,
    fetchDoctorsList,
    formatExperienceYearsLabel,
    getBranchIdentity,
    getDoctorTabItems,
} from "../../api/doctorsApi";
import useSeoMeta from "../../hooks/useSeoMeta";
import "./DoctorProfilePage.css";

function buildDescription(doctor) {
    return (
        doctor?.seoDescription ||
        doctor?.shortDescription ||
        `Профіль лікаря ${doctor?.fullName || ""} у медичному центрі “Для людей”.`.trim()
    );
}

function getProfileButtons(doctor) {
    const defaults = [
        { id: "book", text: "Записатися до лікаря", href: "/contacts" },
        { id: "declaration", text: "Підписати декларацію", href: "/declaration" },
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

export default function DoctorProfilePage() {
    const { slug = "" } = useParams();
    const [doctor, setDoctor] = useState(null);
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
                    )
                    .slice(0, 4);

                setRelatedDoctors(related);
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

    const pageTitle = useMemo(() => {
        if (!doctor) return "Лікар | Для людей";
        return `${doctor.seoTitle || doctor.fullName} | Для людей`;
    }, [doctor]);

    const pageDescription = buildDescription(doctor);
    const canonicalUrl =
        typeof window !== "undefined" && slug
            ? `${window.location.origin}/doctors/${slug}`
            : "";

    useSeoMeta({
        title: pageTitle,
        description: pageDescription,
        ogTitle: doctor?.seoTitle || doctor?.fullName || "Лікар",
        ogDescription: pageDescription,
        ogImage: doctor?.photo?.url || "",
        canonicalUrl,
        type: "website",
    });

    if (loading) {
        return (
            <main className="doctor-profile-page">
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
                <div className="doctor-profile-page__container">
                    <div className="doctor-profile-page__state" role="status">
                        Лікаря не знайдено.
                    </div>
                </div>
            </main>
        );
    }

    const years = Number(doctor.experienceYears) || 0;
    const doctorPosition = doctor?.position || "";
    const tabItems = getDoctorTabItems(doctor);
    const branchAddress = doctor.branch?.address || doctor.address || "";
    const buttons = getProfileButtons(doctor);

    return (
        <main className="doctor-profile-page">
            <section className="doctor-profile-page__hero">
                <div className="doctor-profile-page__container">
                    <Breadcrumbs
                        className="doctor-profile-page__crumbs"
                        ariaLabel="Breadcrumb"
                        items={[
                            { label: "Головна", to: "/" },
                            { label: "Лікарі", to: "/doctors" },
                            { label: doctor.fullName },
                        ]}
                    />

                    <div className="doctor-profile-page__hero-card">
                        <div className="doctor-profile-page__photo-wrap">
                            {doctor.photo?.url ? (
                                <img
                                    className="doctor-profile-page__photo"
                                    src={doctor.photo.url}
                                    alt={doctor.fullName}
                                    width={doctor.photo.width || 760}
                                    height={doctor.photo.height || 960}
                                    loading="lazy"
                                    decoding="async"
                                />
                            ) : (
                                <div className="doctor-profile-page__photo doctor-profile-page__photo--placeholder">
                                    <span>{getInitials(doctor.fullName) || "Л"}</span>
                                </div>
                            )}

                            {years > 0 ? (
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
                                            <MapPin size={18} />
                                            <span>{branchAddress}</span>
                                        </p>
                                    </div>
                                ) : null}

                                {doctor.quote ? (
                                    <blockquote className="doctor-profile-page__quote">
                                        “{doctor.quote}”
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
                    </div>
                </div>
            </section>

            <section className="doctor-profile-page__tabs">
                <div className="doctor-profile-page__container">
                    <DoctorProfileTabs tabs={tabItems} />
                </div>
            </section>

            {doctor.branch ? (
                <section className="doctor-profile-page__branch">
                    <div className="doctor-profile-page__container">
                        <BranchCard branch={doctor.branch} />
                    </div>
                </section>
            ) : null}

            {relatedDoctors.length > 0 ? (
                <section className="doctor-profile-page__related">
                    <div className="doctor-profile-page__container">
                        <RelatedDoctorsSection
                            doctors={relatedDoctors}
                            branchAddress={branchAddress}
                        />
                    </div>
                </section>
            ) : null}
        </main>
    );
}
