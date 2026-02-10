import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, Fragment } from "react";

const branches = [
    {
        lat: 48.4613,
        lng: 34.9384,
        link: "https://www.google.com/maps?q=вул.+Данила+Галицького,+34,+Дніпро",
    },
    {
        lat: 48.4063,
        lng: 35.0014,
        link: "https://www.google.com/maps?q=просп.+Богдана+Хмельницького,+127,+Дніпро",
    },
    {
        lat: 48.414,
        lng: 35.0659,
        link: "https://www.google.com/maps?q=бульвар+Слави,+8,+Дніпро",
    },
];

const PIN_PATH =
    "M0,-18 \
   C-6,-18 -10,-14 -10,-8 \
   C-10,0 0,14 0,14 \
   C0,14 10,0 10,-8 \
   C10,-14 6,-18 0,-18 Z";

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
                <Fragment key={i}>
                    {/* ОСНОВНИЙ ПІН */}
                    <Marker
                        position={{ lat: b.lat, lng: b.lng }}
                        icon={{
                            path: PIN_PATH,
                            fillColor: "#008b96",
                            fillOpacity: 1,
                            strokeWeight: 0,
                            scale: hoveredIndex === i ? 1.0 : 0.9,
                        }}
                        zIndex={10}
                        onMouseOver={() => setHoveredIndex(i)}
                        onMouseOut={() => setHoveredIndex(null)}
                        onClick={() => window.open(b.link, "_blank")}
                    />

                    {/* БІЛИЙ КРУЖЕЧОК */}
                    <Marker
                        position={{ lat: b.lat, lng: b.lng }}
                        icon={{
                            path: "M0,-7.8 m-3.8,0 a3.8,3.8 0 1,0 7.6,0 a3.8,3.8 0 1,0 -7.6,0",

                            fillColor: "#ffffff",
                            fillOpacity: 1,
                            strokeWeight: 0,
                        }}
                        zIndex={11}
                        options={{ clickable: false }}
                    />
                </Fragment>
            ))}
        </GoogleMap>
    );
}
