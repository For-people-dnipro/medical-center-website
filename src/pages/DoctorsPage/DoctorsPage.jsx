import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ContactForm from "../../components/ContactForm/ContactForm";
import DoctorCard from "../../components/DoctorCard/DoctorCard";
import DoctorFilters from "../../components/DoctorFilters/DoctorFilters";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import {
    collectUniqueSpecialisations,
    fetchDoctorBranches,
    fetchDoctorSpecialisations,
    fetchDoctorsList,
    getBranchIdentity,
} from "../../api/doctorsApi";
import useSeoMeta from "../../hooks/useSeoMeta";
import "./DoctorsPage.css";

const PAGE_TITLE = "НАША КОМАНДА";
const PAGE_DESCRIPTION =
    "Знайомтесь із нашими лікарями — досвідченими фахівцями, які дбають про ваше здоров'я щодня. Оберіть свого лікаря за спеціалізацією або місцем прийому.";
const BREADCRUMBS_LABEL = "Лікарі";
const SEARCH_PLACEHOLDER = "Ім'я лікаря";
const BRANCH_FILTER_LABEL = "Локація";
const SPECIALISATION_FILTER_LABEL = "Спеціалізація";
const LOAD_MORE_LABEL = "Показати більше";
const INITIAL_VISIBLE_COUNT = 9;
const LOAD_MORE_STEP = 9;
const EMPTY_STATE_TITLE =
    "На жаль, ми не змогли знайти лікаря за вашим запитом.";
const EMPTY_STATE_TEXT =
    "Будь ласка, змініть фільтри або скоригуйте пошуковий запит.";

function toSearchText(value) {
    return String(value || "")
        .replace(/\s+/g, " ")
        .trim();
}

function branchLabel(branch) {
    return branch.shortAddress || branch.name || branch.address || "—";
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [branches, setBranches] = useState([]);
    const [specialisations, setSpecialisations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedSpecialisation, setSelectedSpecialisation] = useState("");
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    useSeoMeta({
        title: "Лікарі | Для людей",
        description:
            "Наша команда лікарів: оберіть фахівця за спеціалізацією або локацією та запишіться на прийом.",
        ogTitle: "Лікарі | Для людей",
        ogDescription:
            "Ознайомтеся з лікарями медичного центру “Для людей” та знайдіть свого фахівця.",
        canonicalUrl:
            typeof window !== "undefined"
                ? `${window.location.origin}/doctors`
                : "",
        type: "website",
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchValue(toSearchText(searchValue));
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadFilterDictionaries() {
            setInitialLoading(true);

            try {
                const [branchesList, specialisationsList] = await Promise.all([
                    fetchDoctorBranches({ signal: controller.signal }),
                    fetchDoctorSpecialisations({ signal: controller.signal }),
                ]);

                if (controller.signal.aborted) return;

                setBranches(branchesList || []);
                setSpecialisations(specialisationsList || []);
            } catch (requestError) {
                if (requestError?.name === "AbortError") return;
                console.error(
                    "Failed to load doctor filters data:",
                    requestError,
                );
            } finally {
                if (!controller.signal.aborted) {
                    setInitialLoading(false);
                }
            }
        }

        loadFilterDictionaries();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        async function loadDoctors() {
            setLoading(true);
            setError("");

            try {
                const doctorsResponse = await fetchDoctorsList({
                    signal: controller.signal,
                    search: debouncedSearchValue,
                    branchId: selectedBranch,
                    specialisationId: selectedSpecialisation,
                });

                if (controller.signal.aborted) return;
                setDoctors(doctorsResponse.items || []);
            } catch (requestError) {
                if (requestError?.name === "AbortError") return;
                console.error("Failed to load doctors:", requestError);
                const rawMessage = String(requestError?.message || "");
                setError(
                    rawMessage.includes("UNAUTHORIZED")
                        ? "Немає доступу до Doctors API. У Strapi увімкніть `find` для Public role."
                        : "Не вдалося завантажити список лікарів. Спробуйте пізніше.",
                );
                setDoctors([]);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadDoctors();

        return () => controller.abort();
    }, [debouncedSearchValue, selectedBranch, selectedSpecialisation]);

    useEffect(() => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    }, [debouncedSearchValue, selectedBranch, selectedSpecialisation]);

    const branchOptions = useMemo(() => {
        const sourceBranches =
            (branches || []).length > 0
                ? branches
                : Array.from(
                      (doctors || [])
                          .reduce((map, doctor) => {
                              const branch = doctor?.branch;
                              const key = getBranchIdentity(branch);
                              if (
                                  !branch ||
                                  !key ||
                                  branch.isActive === false ||
                                  map.has(key)
                              ) {
                                  return map;
                              }
                              map.set(key, branch);
                              return map;
                          }, new Map())
                          .values(),
                  );

        return sourceBranches.map((branch) => ({
            value: String(branch.id ?? getBranchIdentity(branch)),
            label: branchLabel(branch),
        }));
    }, [branches, doctors]);

    const specialisationOptions = useMemo(() => {
        const source =
            (specialisations || []).length > 0
                ? specialisations
                : collectUniqueSpecialisations(doctors);

        return source.map((spec) => ({
            value: String(spec.id ?? ""),
            label: spec.name || "—",
        }));
    }, [specialisations, doctors]);

    const visibleDoctors = doctors.slice(0, visibleCount);
    const shouldShowLoadMore =
        !loading &&
        !initialLoading &&
        !error &&
        doctors.length > INITIAL_VISIBLE_COUNT &&
        visibleDoctors.length < doctors.length;

    return (
        <main className="doctors-page">
            <section className="doctors-page__hero">
                <div className="doctors-page__container">
                    <Breadcrumbs
                        className="doctors-page__crumbs"
                        ariaLabel="Breadcrumb"
                        items={[
                            { label: "Головна", to: "/" },
                            { label: BREADCRUMBS_LABEL },
                        ]}
                    />

                    <h1 className="doctors-page__title">{PAGE_TITLE}</h1>
                    <p className="doctors-page__subtitle">{PAGE_DESCRIPTION}</p>

                    <DoctorFilters
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        searchPlaceholder={SEARCH_PLACEHOLDER}
                        branchValue={selectedBranch}
                        onBranchChange={setSelectedBranch}
                        branchOptions={branchOptions}
                        branchFilterLabel={BRANCH_FILTER_LABEL}
                        branchDisabled={branchOptions.length === 0}
                        specialisationValue={selectedSpecialisation}
                        onSpecialisationChange={setSelectedSpecialisation}
                        specialisationOptions={specialisationOptions}
                        specialisationFilterLabel={SPECIALISATION_FILTER_LABEL}
                        specialisationDisabled={
                            specialisationOptions.length === 0
                        }
                    />
                </div>
            </section>

            <section
                className="doctors-page__list"
                aria-label={BREADCRUMBS_LABEL}
            >
                <div className="doctors-page__container">
                    {(loading || initialLoading) && doctors.length === 0 ? (
                        <div className="doctors-page__state" role="status">
                            Завантажуємо лікарів...
                        </div>
                    ) : null}

                    {!loading && !initialLoading && error ? (
                        <div
                            className="doctors-page__state doctors-page__state--error"
                            role="alert"
                        >
                            {error}
                        </div>
                    ) : null}

                    {!loading &&
                    !initialLoading &&
                    !error &&
                    doctors.length === 0 ? (
                        <div className="doctors-page__state" role="status">
                            <p className="doctors-page__empty-title">
                                {EMPTY_STATE_TITLE}
                            </p>
                            <p className="doctors-page__empty-text">
                                {EMPTY_STATE_TEXT}
                            </p>
                        </div>
                    ) : null}

                    {!error && visibleDoctors.length > 0 ? (
                        <>
                            <div className="doctors-page__grid">
                                {visibleDoctors.map((doctor) => (
                                    <DoctorCard
                                        key={doctor.id || doctor.slug}
                                        doctor={doctor}
                                    />
                                ))}
                            </div>

                            {shouldShowLoadMore ? (
                                <div className="doctors-page__load-more">
                                    <LoadMoreButton
                                        label={LOAD_MORE_LABEL}
                                        onClick={() =>
                                            setVisibleCount((current) =>
                                                Math.min(
                                                    doctors.length,
                                                    current + LOAD_MORE_STEP,
                                                ),
                                            )
                                        }
                                    />
                                </div>
                            ) : null}
                        </>
                    ) : null}
                </div>
            </section>

            <section className="doctors-page__contact">
                <div className="doctors-page__container">
                    <ContactForm
                        title="ВАША ДУМКА ВАЖЛИВА"
                        subtitle="ЗАЛИШТЕ СВІЙ ВІДГУК ЩОДО ЯКОСТІ НАШИХ ПОСЛУГ"
                        formType="Відгук щодо якості послуг"
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
                </div>
            </section>
        </main>
    );
}
