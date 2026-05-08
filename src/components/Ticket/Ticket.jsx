import { useEffect, useRef, useState } from "react";
import "./Ticket.css";

const ITEMS_PER_LOOP = 8;
const MOBILE_BREAKPOINT = 768;
const DESKTOP_SPEED_PX_PER_SEC = 90;
const MOBILE_SPEED_PX_PER_SEC = 90;

export default function Ticket({ text }) {
    const trackRef = useRef(null);
    const [metrics, setMetrics] = useState({
        width: 0,
        duration: 14,
    });

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return undefined;

        const update = () => {
            const halfWidth = el.scrollWidth / 2;
            const isMobile = window.matchMedia(
                `(max-width: ${MOBILE_BREAKPOINT}px)`,
            ).matches;
            const pxPerSecond = isMobile
                ? MOBILE_SPEED_PX_PER_SEC
                : DESKTOP_SPEED_PX_PER_SEC;
            const duration = halfWidth
                ? Math.max(halfWidth / pxPerSecond, 6)
                : 14;

            setMetrics({
                width: halfWidth,
                duration,
            });
        };

        update();

        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(el);
        window.addEventListener("resize", update);

        return () => {
            window.removeEventListener("resize", update);
            resizeObserver.disconnect();
        };
    }, [text]);

    const loopA = Array.from({ length: ITEMS_PER_LOOP }, (_, i) => (
        <span className="ticket-item" key={i}>
            {text}
        </span>
    ));
    const loopB = Array.from({ length: ITEMS_PER_LOOP }, (_, i) => (
        <span className="ticket-item" key={i + ITEMS_PER_LOOP}>
            {text}
        </span>
    ));

    return (
        <div className="ticket-wrapper">
            <div
                className="ticket-track"
                ref={trackRef}
                style={{
                    "--move-distance": `-${metrics.width}px`,
                    "--duration": `${metrics.duration}s`,
                }}
            >
                {loopA}
                {loopB}
            </div>
        </div>
    );
}
