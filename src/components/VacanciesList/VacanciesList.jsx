import { useEffect, useState } from "react";
import VacancyItem from "../VacancyItem/VacancyItem";
import { useVacancies } from "./useVacancies";
import { DEFAULT_ENDPOINT } from "./vacanciesList.utils";
import "./VacanciesList.css";

function SkeletonList() {
    return Array.from({ length: 4 }).map((_, index) => (
        <article
            key={`vacancy-skeleton-${index}`}
            className="vacancies-list__skeleton-item"
            aria-hidden="true"
        >
            <div className="vacancies-list__skeleton-line vacancies-list__skeleton-line--title" />
            <div className="vacancies-list__skeleton-line vacancies-list__skeleton-line--meta" />
        </article>
    ));
}

export default function VacanciesList({
    title = "АКТУАЛЬНІ ВАКАНСІЇ",
    endpoint = DEFAULT_ENDPOINT,
    sectionId = "vacancies-list",
}) {
    const [openId, setOpenId] = useState(null);
    const { error, loading, vacancies } = useVacancies(endpoint);

    useEffect(() => {
        setOpenId((currentId) => {
            if (currentId === null) return null;
            return vacancies.some((vacancy) => vacancy.id === currentId)
                ? currentId
                : null;
        });
    }, [vacancies]);

    useEffect(() => {
        if (openId === null) return;

        const handleDocumentClick = (event) => {
            if (event.target.closest(".vacancy-item__trigger")) return;
            if (event.target.closest("a, button")) return;
            setOpenId(null);
        };

        const timeoutId = window.setTimeout(() => {
            document.addEventListener("click", handleDocumentClick);
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [openId]);

    const hasVacancies = vacancies.length > 0;

    return (
        <section
            id={sectionId}
            className="vacancies-list"
            aria-labelledby="vacancies-list-title"
        >
            <div className="vacancies-list__container">
                <h2 id="vacancies-list-title" className="vacancies-list__title">
                    {title}
                </h2>

                <div className="vacancies-list__items" aria-live="polite">
                    {loading ? <SkeletonList /> : null}

                    {!loading && error ? (
                        <div className="vacancies-list__state" role="alert">
                            {error}
                        </div>
                    ) : null}

                    {!loading && !error && !hasVacancies ? (
                        <div className="vacancies-list__state" role="status">
                            Наразі активних вакансій немає.
                        </div>
                    ) : null}

                    {!loading && !error && hasVacancies
                        ? vacancies.map((vacancy) => (
                              <VacancyItem
                                  key={vacancy.id}
                                  vacancy={vacancy}
                                  isOpen={openId === vacancy.id}
                                  onToggle={() =>
                                      setOpenId((current) =>
                                          current === vacancy.id
                                              ? null
                                              : vacancy.id,
                                      )
                                  }
                              />
                          ))
                        : null}
                </div>
            </div>
        </section>
    );
}
