import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
// import logoMain from "../../assets/logo_main.svg";
import "./VacanciesHero.css";

const DEFAULT_IMAGE = "/images/vacancy-hero.jpg";

export default function VacanciesHero({
    title = "Приєднуйтесь до команди!",
    image = DEFAULT_IMAGE,
}) {
    return (
        <section className="vacancies-hero">
            <div className="vacancies-hero__container">
                <Breadcrumbs
                    className="vacancies-hero__crumbs"
                    ariaLabel="Хлібні крихти"
                    items={[
                        { label: "Головна", to: "/" },
                        { label: "Вакансії" },
                    ]}
                />

                <div className="vacancies-hero__layout">
                    <div className="vacancies-hero__media">
                        <img
                            src={image}
                            alt="Команда медичного центру Для Людей у Дніпрі, Україна"
                            className="vacancies-hero__image"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                        />
                        {/* <img
                            src={logoMain}
                            alt="Для людей медичний центр"
                            className="vacancies-hero__brand"
                        /> */}
                    </div>

                    <div className="vacancies-hero__card">
                        <h1>{title}</h1>
                        <p className="vacancies-hero__intro">
                            Ми шукаємо фахівців, які:
                        </p>

                        <ul>
                            <li>поділяють наші цінності</li>
                            <li>хочуть зростати у здоровому середовищі</li>
                            <li>дбають про пацієнтів і колег</li>
                        </ul>

                        <p className="vacancies-hero__mobile-copy">
                            Ми шукаємо фахівців, які поділяють наші цінності,
                            прагнуть професійного розвитку та ставляться з
                            повагою і турботою до пацієнтів і колег.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
