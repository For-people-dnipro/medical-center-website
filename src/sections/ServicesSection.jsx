import "./ServicesSection.css";

export default function ServicesSection() {
    const services = [
        { icon: "/icons/service-declaration.svg", label: "ДЕКЛАРАРАЦІЯ" },
        { icon: "/icons/service-consult.svg", label: "КОНСУЛЬТАЦІЯ" },
        { icon: "/icons/service-tests.svg", label: "АНАЛІЗИ" },
        { icon: "/icons/service-vaccine.svg", label: "ВАКЦИНАЦІЯ" },
        { icon: "/icons/service-diagnostics.svg", label: "ДІАГНОСТИКА" },
        { icon: "/icons/service-manipulation.svg", label: "МАНІПУЛЯЦІЇ" },
        { icon: "/icons/service-packages.svg", label: "ПАКЕТНІ ПОСЛУГИ" },
        { icon: "/icons/service-checkup.svg", label: "CHECK-UP" },
        { icon: "/icons/service-cosmetology.svg", label: "КОСМЕТОЛОГІЯ" },
    ];

    return (
        <section className="services-section">
            <div className="services-title">
                <h2>ПОСЛУГИ</h2>
                <p>Все, що потрібно для турботи про здоров’я</p>
            </div>

            <div className="services-grid">
                {services.map((item, i) => {
                    let extraClass = "";

                    if (item.label === "АНАЛІЗИ") extraClass = "card-analizy";
                    if (item.label === "ПАКЕТНІ ПОСЛУГИ")
                        extraClass = "card-packages";
                    if (item.label === "CHECK-UP") extraClass = "card-checkup";
                    if (item.label === "КОСМЕТОЛОГІЯ")
                        extraClass = "card-cosmetology";

                    return (
                        <div className={`service-card ${extraClass}`} key={i}>
                            <img
                                src={item.icon}
                                alt=""
                                className="service-icon"
                            />
                            <span>{item.label}</span>
                        </div>
                    );
                })}

                {/* LAST BUTTON */}
                <div className="service-card more-btn">
                    <span>ВСІ ПОСЛУГИ</span>
                    <div className="arrow-circle">
                        <img
                            src="/icons/arrow-right.svg"
                            alt=""
                            className="service-arrow"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
