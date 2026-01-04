import { useRef, useEffect, useState } from "react";
import "./BranchesSection.css";
import Button from "../components/Button/Button";
import MapPin from "../components/MapPin";

const latLngToPercent = (
    lat,
    lng,
    centerLat,
    centerLng,
    zoom,
    containerWidth
) => {
    const mercatorLat = (lat) =>
        Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

    const mapSize = 256 * Math.pow(2, zoom);

    const worldX = ((lng + 180) / 360) * mapSize;
    const worldY = ((1 - mercatorLat(lat) / Math.PI) / 2) * mapSize;

    const centerWorldX = ((centerLng + 180) / 360) * mapSize;
    const centerWorldY = ((1 - mercatorLat(centerLat) / Math.PI) / 2) * mapSize;

    const pixelX = worldX - centerWorldX;
    const pixelY = worldY - centerWorldY;

    return {
        x: 50 + (pixelX / containerWidth) * 100,
        y: 50 + (pixelY / containerWidth) * 100,
    };
};

const branches = [
    {
        name: "вул. Данила Галицького, 34",
        link: "https://www.google.com/maps?q=вул.+Данила+Галицького,+34,+Дніпро",
        lat: 48.4613,
        lng: 34.9384,
    },
    {
        name: "просп. Богдана Хмельницького, 127",
        link: "https://www.google.com/maps?q=просп.+Богдана+Хмельницького,+127,+Дніпро",
        lat: 48.4063,
        lng: 35.0014,
    },
    {
        name: "бульвар Слави, 8",
        link: "https://www.google.com/maps?q=бульвар+Слави,+8,+Дніпро",
        lat: 48.414,
        lng: 35.0659,
    },
];

export default function BranchesSection() {
    const mapRef = useRef(null);
    const [width, setWidth] = useState(400);

    const center = { lat: 48.4272, lng: 35.0019 };
    const zoom = 11;

    useEffect(() => {
        if (!mapRef.current) return;
        const update = () =>
            setWidth(mapRef.current.getBoundingClientRect().width);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return (
        <section className="branches-section">
            {" "}
            <div className="branches-container">
                {" "}
                {/* Ліва колонка */}{" "}
                <div className="branches-text">
                    {" "}
                    <h2 className="branches-title">
                        НАШІ ФІЛІЇ У М. ДНІПРО
                    </h2>{" "}
                    <p className="branches-description">
                        {" "}
                        Наші філії розташовані у зручних районах міста, щоб
                        якісна медична допомога була поруч із вами. Обирайте
                        найближчий медичний центр і отримуйте повний комплекс
                        медичних послуг.{" "}
                    </p>{" "}
                    <ul className="branches-list">
                        {" "}
                        {branches.map((b, i) => (
                            <li key={i} className="branches-item">
                                {" "}
                                <span className="icon">
                                    <MapPin size={22} />
                                </span>
                                <a
                                    href={b.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {" "}
                                    {b.name}{" "}
                                </a>{" "}
                            </li>
                        ))}{" "}
                    </ul>
                    <div className="branches-button-wrapper">
                        <Button href="/doctors">Детальніше</Button>
                    </div>
                </div>
                {/* MAP */}
                <div className="branches-map" ref={mapRef}>
                    <iframe
                        title="Dnipro map"
                        src={`https://www.google.com/maps?ll=${center.lat},${center.lng}&z=${zoom}&hl=uk&output=embed`}
                        loading="lazy"
                        width="100%"
                        height="100%"
                        referrerPolicy="no-referrer-when-downgrade"
                    />

                    {/* MARKERS */}
                    {branches.map((b, i) => {
                        const pos = latLngToPercent(
                            b.lat,
                            b.lng,
                            center.lat,
                            center.lng,
                            zoom,
                            width
                        );

                        const openMaps = () =>
                            window.open(
                                b.link,
                                "_blank",
                                "noopener,noreferrer"
                            );

                        return (
                            <div
                                key={i}
                                className="branches-pin"
                                onClick={openMaps}
                                style={{
                                    left: `${pos.x}%`,
                                    top: `${pos.y}%`,
                                }}
                            >
                                <svg width="28" height="36" viewBox="0 0 28 36">
                                    <path
                                        d="M14 2 C10 2, 2 8, 2 14 C2 22, 14 34, 14 34 C14 34, 26 22, 26 14 C26 8, 18 2, 14 2 Z"
                                        fill="#0c8a87"
                                    />
                                    <circle
                                        cx="14"
                                        cy="14"
                                        r="5"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
