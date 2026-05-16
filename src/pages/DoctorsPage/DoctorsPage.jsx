import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import SeoHead from "../../components/Seo/SeoHead";
import { getStaticSeo } from "../../seo/seoConfig";
import "./DoctorsPage.css";

const MOBILE_BREAKPOINT = 768;
const PAGE_TITLE = "НАША КОМАНДА";
const PAGE_DESCRIPTION =
    "Знайомтесь із нашими лікарями — досвідченими фахівцями, які дбають про ваше здоров'я щодня. Оберіть свого лікаря за спеціалізацією або місцем прийому.";
const BREADCRUMBS_LABEL = "Лікарі";
const SEARCH_PLACEHOLDER = "Ім'я лікаря";
const BRANCH_FILTER_LABEL = "Локація";
const SPECIALISATION_FILTER_LABEL = "Спеціалізація";
const LOAD_MORE_LABEL = "Показати більше";
const DESKTOP_INITIAL_VISIBLE_COUNT = 12;
const DESKTOP_LOAD_MORE_STEP = 12;
const MOBILE_INITIAL_VISIBLE_COUNT = 4;
const MOBILE_LOAD_MORE_STEP = 4;
const DOCTORS_FORM_TITLE_DESKTOP = "ВАША ДУМКА ВАЖЛИВА";
const DOCTORS_FORM_SUBTITLE_DESKTOP =
    "ЗАЛИШТЕ СВІЙ ВІДГУК ЩОДО ЯКОСТІ НАШИХ ПОСЛУГ";
const DOCTORS_FORM_TITLE_MOBILE = "ВАША ДУМКА ВАЖЛИВА";
const DOCTORS_FORM_SUBTITLE_MOBILE = "ЗАЛИШТЕ ВІДГУК ";
const EMPTY_STATE_TITLE =
    "На жаль, ми не змогли знайти лікаря за вашим запитом.";
const EMPTY_STATE_TEXT =
    "Будь ласка, змініть фільтри або скоригуйте пошуковий запит.";
const PAGE_SEO = getStaticSeo("doctors");

function toSearchText(value) {
    return String(value || "")
        .replace(/\s+/g, " ")
        .trim();
}

function toFilterParam(value) {
    return String(value ?? "").trim();
}

function branchLabel(branch) {
    return branch.shortAddress || branch.name || branch.address || "—";
}

function getIsMobileViewport() {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

export default function DoctorsPage() {
    const [searchParams] = useSearchParams();
    const branchFromQuery = toFilterParam(searchParams.get("branch"));
    const [doctors, setDoctors] = useState([]);
    const [branches, setBranches] = useState([]);
    const [specialisations, setSpecialisations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isMobileViewport, setIsMobileViewport] =
        useState(getIsMobileViewport);

    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
    const [selectedBranch, setSelectedBranch] = useState(branchFromQuery);
    const [selectedSpecialisation, setSelectedSpecialisation] = useState("");
    const [visibleCount, setVisibleCount] = useState(() =>
        getIsMobileViewport()
            ? MOBILE_INITIAL_VISIBLE_COUNT
            : DESKTOP_INITIAL_VISIBLE_COUNT,
    );

    useEffect(() => {
        setSelectedBranch(branchFromQuery);
    }, [branchFromQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchValue(toSearchText(searchValue));
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue]);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const mediaQuery = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT}px)`,
        );
        const handleChange = (event) => {
            setIsMobileViewport(event.matches);
        };

        setIsMobileViewport(mediaQuery.matches);

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    const [allDoctors, setAllDoctors] = useState([]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadAll() {
            setInitialLoading(true);
            setLoading(true);
            setError("");

            try {
                const [doctorsResponse, branchesList, specialisationsList] =
                    await Promise.all([
                        fetchDoctorsList({
                            signal: controller.signal,
                            queryMode: "listing",
                        }),
                        fetchDoctorBranches({ signal: controller.signal }),
                        fetchDoctorSpecialisations({ signal: controller.signal }),
                    ]);

                if (controller.signal.aborted) return;

                setAllDoctors(doctorsResponse.items || []);
                setBranches(branchesList || []);
                setSpecialisations(specialisationsList || []);
            } catch (requestError) {
                if (requestError?.name === "AbortError") return;
                console.error("Failed to load doctors:", requestError);
                const rawMessage = String(requestError?.message || "");
                setError(
                    rawMessage.includes("UNAUTHORIZED")
                        ? "Немає доступу до Doctors API. У Strapi увімкніть `find` для Public role."
                        : "Не вдалося завантажити список лікарів. Спробуйте пізніше.",
                );
                setAllDoctors([]);
            } finally {
                if (!controller.signal.aborted) {
                    setInitialLoading(false);
                    setLoading(false);
                }
            }
        }

        loadAll();

        return () => controller.abort();
    }, []);

    const initialVisibleCount = isMobileViewport
        ? MOBILE_INITIAL_VISIBLE_COUNT
        : DESKTOP_INITIAL_VISIBLE_COUNT;
    const loadMoreStep = isMobileViewport
        ? MOBILE_LOAD_MORE_STEP
        : DESKTOP_LOAD_MORE_STEP;

    useEffect(() => {
        setVisibleCount(initialVisibleCount);
    }, [initialVisibleCount, debouncedSearchValue, selectedBranch, selectedSpecialisation]);

    const doctors = useMemo(() => {
        let result = allDoctors;

        if (selectedBranch) {
            result = result.filter((doc) => {
                const branch = doc?.branch ?? doc?.attributes?.branch?.data?.attributes ?? doc?.attributes?.branch;
                return String(branch?.id ?? getBranchIdentity(branch)) === selectedBranch;
            });
        }

        if (selectedSpecialisation) {
            result = result.filter((doc) => {
                const specs = doc?.specialisations ?? doc?.attributes?.specialisations?.data ?? [];
                return specs.some((s) => String(s?.id ?? s?.attributes?.id) === selectedSpecialisation);
            });
        }

        if (debouncedSearchValue) {
            const query = debouncedSearchValue.toLowerCase();
            result = result.filter((doc) => {
                const attrs = doc?.attributes ?? doc ?? {};
                const name = `${attrs.name ?? ""} ${attrs.surname ?? ""}`.toLowerCase();
                return name.includes(query);
            });
        }

        return result;
    }, [allDoctors, selectedBranch, selectedSpecialisation, debouncedSearchValue]);

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
        doctors.length > initialVisibleCount &&
        visibleDoctors.length < doctors.length;

    return (
        <main className="doctors-page">
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/doctors"
            />
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
                                {visibleDoctors.map((doctor, index) => (
                                    <DoctorCard
                                        key={doctor.id || doctor.slug}
                                        doctor={doctor}
                                        priority={index < 6}
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
                                                    current + loadMoreStep,
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
                <ContactForm
                    title={
                        isMobileViewport
                            ? DOCTORS_FORM_TITLE_MOBILE
                            : DOCTORS_FORM_TITLE_DESKTOP
                    }
                    subtitle={
                        isMobileViewport
                            ? DOCTORS_FORM_SUBTITLE_MOBILE
                            : DOCTORS_FORM_SUBTITLE_DESKTOP
                    }
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
            </section>
        </main>
    );
}
