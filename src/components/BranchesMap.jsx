import { Fragment, memo, useMemo, useState } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

const DEFAULT_BRANCHES = [
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

const WHITE_DOT_PATH =
    "M0,-7.8 m-3.8,0 a3.8,3.8 0 1,0 7.6,0 a3.8,3.8 0 1,0 -7.6,0";

const DEFAULT_CENTER = { lat: 48.4272, lng: 35.0019 };
const SCRIPT_ID = "branches-google-maps-script";
const MAP_OPTIONS = {
    scrollwheel: false,
    gestureHandling: "greedy",
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: [
        {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#f5f7f9" }], // світліший фон
        },
    ],
};
function normalizeBranch(branch, index) {
    const lat = Number(branch?.lat);
    const lng = Number(branch?.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
    }

    return {
        id: branch?.id ?? `${lat}:${lng}:${index}`,
        lat,
        lng,
        link: branch?.link,
    };
}

function areCentersEqual(prevCenter, nextCenter) {
    return (
        Number(prevCenter?.lat) === Number(nextCenter?.lat) &&
        Number(prevCenter?.lng) === Number(nextCenter?.lng)
    );
}

function areBranchesEqual(prevBranches, nextBranches) {
    const prev = Array.isArray(prevBranches) ? prevBranches : [];
    const next = Array.isArray(nextBranches) ? nextBranches : [];

    if (prev.length !== next.length) {
        return false;
    }

    for (let i = 0; i < prev.length; i += 1) {
        const prevBranch = prev[i] || {};
        const nextBranch = next[i] || {};

        if (
            Number(prevBranch.lat) !== Number(nextBranch.lat) ||
            Number(prevBranch.lng) !== Number(nextBranch.lng) ||
            (prevBranch.id ?? "") !== (nextBranch.id ?? "") ||
            (prevBranch.link ?? "") !== (nextBranch.link ?? "")
        ) {
            return false;
        }
    }

    return true;
}

function areMapPropsEqual(prevProps, nextProps) {
    return (
        prevProps.zoom === nextProps.zoom &&
        prevProps.borderRadius === nextProps.borderRadius &&
        areCentersEqual(prevProps.center, nextProps.center) &&
        areBranchesEqual(prevProps.branches, nextProps.branches)
    );
}

function BranchesMap({
    branches = DEFAULT_BRANCHES,
    center = DEFAULT_CENTER,
    zoom = 11,
    borderRadius = 20,
}) {
    const [hoveredId, setHoveredId] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        id: SCRIPT_ID,
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "",
    });

    const normalizedBranches = useMemo(() => {
        const source = Array.isArray(branches) ? branches : DEFAULT_BRANCHES;
        return source
            .map((branch, index) => normalizeBranch(branch, index))
            .filter(Boolean);
    }, [branches]);

    const safeCenter = useMemo(() => {
        const lat = Number(center?.lat);
        const lng = Number(center?.lng);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return { lat, lng };
        }

        if (normalizedBranches.length === 1) {
            return {
                lat: normalizedBranches[0].lat,
                lng: normalizedBranches[0].lng,
            };
        }

        return DEFAULT_CENTER;
    }, [center?.lat, center?.lng, normalizedBranches]);

    const mapContainerStyle = useMemo(
        () => ({
            width: "100%",
            height: "100%",
            borderRadius: `${borderRadius}px`,
        }),
        [borderRadius],
    );

    const mainIcons = useMemo(() => {
        return normalizedBranches.reduce((acc, branch) => {
            acc[branch.id] = {
                path: PIN_PATH,
                fillColor: "#008b96",
                fillOpacity: 1,
                strokeWeight: 0,
                scale: hoveredId === branch.id ? 1 : 0.9,
            };
            return acc;
        }, {});
    }, [normalizedBranches, hoveredId]);

    const whiteDotIcon = useMemo(
        () => ({
            path: WHITE_DOT_PATH,
            fillColor: "#ffffff",
            fillOpacity: 1,
            strokeWeight: 0,
        }),
        [],
    );

    if (loadError || !isLoaded || normalizedBranches.length === 0) {
        return null;
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={safeCenter}
            zoom={zoom}
            options={MAP_OPTIONS}
        >
            {normalizedBranches.map((branch) => (
                <Fragment key={branch.id}>
                    <MarkerF
                        position={{ lat: branch.lat, lng: branch.lng }}
                        icon={mainIcons[branch.id]}
                        options={{
                            zIndex: 10,
                            optimized: false,
                        }}
                        onMouseOver={() => setHoveredId(branch.id)}
                        onMouseOut={() => setHoveredId(null)}
                        onClick={() => {
                            if (branch.link) {
                                const url = String(branch.link);
                                if (url.startsWith("https://") || url.startsWith("http://")) {
                                    window.open(url, "_blank", "noopener,noreferrer");
                                }
                            }
                        }}
                    />

                    <MarkerF
                        position={{ lat: branch.lat, lng: branch.lng }}
                        icon={whiteDotIcon}
                        options={{
                            zIndex: 11,
                            clickable: false,
                            optimized: false,
                        }}
                    />
                </Fragment>
            ))}
        </GoogleMap>
    );
}

export default memo(BranchesMap, areMapPropsEqual);
