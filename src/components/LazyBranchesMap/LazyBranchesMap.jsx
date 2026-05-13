import { useState } from "react";
import BranchesMap from "../BranchesMap";

export default function LazyBranchesMap({ center, zoom = 14, borderRadius, ...rest }) {
    const [isInteractive, setIsInteractive] = useState(false);

    if (isInteractive) {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <BranchesMap center={center} zoom={zoom} borderRadius={borderRadius} {...rest} />
            </div>
        );
    }

    return (
        <div
            onClick={() => setIsInteractive(true)}
            style={{
                width: "100%",
                height: "100%",
                minHeight: 280,
                background: "linear-gradient(135deg, #e8f4f5 0%, #d0eaec 100%)",
                borderRadius: borderRadius ?? 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
            }}
            role="button"
            aria-label="Завантажити карту"
        >
            <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#008b96" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ zIndex: 1 }}>
                <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    fill="#008b96"
                />
                <circle cx="12" cy="9" r="2.5" fill="white" />
            </svg>

            <span style={{
                zIndex: 1,
                fontSize: 14,
                fontWeight: 500,
                color: "#008b96",
                background: "rgba(255,255,255,0.85)",
                borderRadius: 8,
                padding: "8px 18px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}>
                Показати карту
            </span>
        </div>
    );
}
