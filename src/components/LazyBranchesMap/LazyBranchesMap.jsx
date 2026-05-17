import { Suspense, lazy, useEffect, useRef, useState } from "react";

const OBSERVER_ROOT_MARGIN = "600px 0px";
const BranchesMap = lazy(() => import("../BranchesMap"));

export default function LazyBranchesMap({
    center,
    zoom = 14,
    borderRadius,
    minHeight = 280,
    ...rest
}) {
    const containerRef = useRef(null);
    const [shouldLoadMap, setShouldLoadMap] = useState(false);

    useEffect(() => {
        if (shouldLoadMap || typeof window === "undefined") return undefined;

        const node = containerRef.current;
        if (!node) return undefined;

        if (!("IntersectionObserver" in window)) {
            const rafId = window.requestAnimationFrame(() => {
                setShouldLoadMap(true);
            });
            return () => window.cancelAnimationFrame(rafId);
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry?.isIntersecting) return;
                setShouldLoadMap(true);
                observer.disconnect();
            },
            {
                root: null,
                rootMargin: OBSERVER_ROOT_MARGIN,
                threshold: 0.01,
            },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [shouldLoadMap]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                minHeight,
                borderRadius: borderRadius ?? 0,
                overflow: "hidden",
                background:
                    "linear-gradient(135deg, rgba(232,244,245,0.9) 0%, rgba(208,234,236,0.9) 100%)",
            }}
        >
            {shouldLoadMap ? (
                <Suspense fallback={null}>
                    <BranchesMap
                        center={center}
                        zoom={zoom}
                        borderRadius={borderRadius}
                        {...rest}
                    />
                </Suspense>
            ) : null}
        </div>
    );
}
