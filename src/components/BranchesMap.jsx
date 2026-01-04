import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";

const branches = [
    {
        name: "вул. Данила Галицького, 34",
        lat: 48.4613,
        lng: 34.9384,
        link: "https://www.google.com/maps?q=вул.+Данила+Галицького,+34,+Дніпро",
    },
    {
        name: "просп. Богдана Хмельницького, 127",
        lat: 48.4063,
        lng: 35.0014,
        link: "https://www.google.com/maps?q=просп.+Богдана+Хмельницького,+127,+Дніпро",
    },
    {
        name: "бульвар Слави, 8",
        lat: 48.414,
        lng: 35.0659,
        link: "https://www.google.com/maps?q=бульвар+Слави,+8,+Дніпро",
    },
];

const customPin = {
    path: "M14 2 C10 2, 2 8, 2 14 C2 22, 14 34, 14 34 C14 34, 26 22, 26 14 C26 8, 18 2, 14 2 Z",
    fillColor: "#0c8a87",
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 1,
    anchor: { x: 14, y: 34 },
};

// (removed unused hover variant — we render a shadow instead)

export default function BranchesMap() {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    });

    if (!isLoaded) return null;

    return (
        <GoogleMap
            mapContainerStyle={{
                width: "100%",
                height: "100%",
                borderRadius: "20px",
            }}
            center={{ lat: 48.4272, lng: 35.0019 }}
            zoom={11}
            options={{
                scrollwheel: false,
                gestureHandling: "greedy",
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            }}
        >
            {branches.map((b, i) => (
                <div key={i}>
                    {/* Тінь (рендериться тільки при hover) */}
                    {hoveredIndex === i && (
                        <Marker
                            position={{ lat: b.lat, lng: b.lng }}
                            icon={{
                                // робимо еліпс трохи ширший ніж кружечок, з низькою непрозорістю
                                path: "M14 14 m -9, 0 a 9,4 0 1,0 18,0 a 9,4 0 1,0 -18,0",
                                fillColor: "rgba(0,0,0,0.18)",
                                fillOpacity: 1,
                                strokeWeight: 0,
                                anchor: { x: 14, y: 30 },
                                scale: 1,
                            }}
                            zIndex={0}
                            options={{ clickable: false }}
                        />
                    )}

                    {/* Основний пін (не масштабується) */}
                    <Marker
                        position={{ lat: b.lat, lng: b.lng }}
                        icon={customPin}
                        zIndex={hoveredIndex === i ? 10 : 1}
                        options={{ cursor: "pointer" }}
                        onMouseOver={() => setHoveredIndex(i)}
                        onMouseOut={() => setHoveredIndex(null)}
                        onClick={() => window.open(b.link, "_blank")}
                    />

                    {/* Білий кружечок — non-interactive, не перехоплює hover/click */}
                    <Marker
                        position={{ lat: b.lat, lng: b.lng }}
                        icon={{
                            path: "M14 14 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0",
                            fillColor: "#ffffff",
                            fillOpacity: 1,
                            strokeWeight: 0,
                            anchor: { x: 14, y: 34 },
                        }}
                        zIndex={hoveredIndex === i ? 11 : 2}
                        options={{ clickable: false }}
                    />
                </div>
            ))}
        </GoogleMap>
    );
}
