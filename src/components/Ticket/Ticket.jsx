import { useRef, useEffect, useState } from "react";
import "./Ticket.css";

export default function Ticket({ text }) {
    const trackRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        const update = () => {
            setWidth(el.scrollWidth / 2);
        };

        update();
        window.addEventListener("resize", update);

        return () => window.removeEventListener("resize", update);
    }, [text]);

    const chunk = Array.from({ length: 6 }, (_, i) => (
        <span className="ticket-item" key={i}>
            {text}
        </span>
    ));

    return (
        <div className="ticket-wrapper">
            <div
                className="ticket-track"
                ref={trackRef}
                style={{ "--move-distance": `-${width}px` }}
            >
                {chunk}
                {chunk}
            </div>
        </div>
    );
}
