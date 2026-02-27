import Button from "../Button/Button";
import DoctorCard from "../DoctorCard/DoctorCard";
import "./RelatedDoctorsSection.css";

export default function RelatedDoctorsSection({
    doctors = [],
    branchAddress = "",
    title = "ЛІКАРІ",
    className = "",
}) {
    const items = doctors.slice(0, 4);
    if (!items.length) return null;

    const rootClassName = ["related-doctors", className].filter(Boolean).join(" ");
    const countClass =
        items.length < 4 ? `related-doctors__grid--count-${items.length}` : "";
    const gridClassName = ["related-doctors__grid", countClass]
        .filter(Boolean)
        .join(" ");

    return (
        <section className={rootClassName}>
            <div className="related-doctors__header">
                <h2 className="related-doctors__title">{title}</h2>
                <p className="related-doctors__subtitle">
                    {branchAddress
                        ? `які приймають за адресою – ${branchAddress}`
                        : "які приймають у цій філії"}
                </p>
            </div>

            <div className={gridClassName}>
                {items.map((doctor) => (
                    <DoctorCard key={doctor.id || doctor.slug} doctor={doctor} />
                ))}
            </div>

            <div className="related-doctors__actions">
                <Button href="/doctors">Наша команда</Button>
            </div>
        </section>
    );
}
