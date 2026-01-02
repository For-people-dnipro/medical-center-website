import { useRef, useEffect, useState } from "react";
import "./Ticket.css";

const MESSAGE = "САМОЛІКУВАННЯ МОЖЕ БУТИ ШКІДЛИВИМ ДЛЯ ВАШОГО ЗДОРОВ’Я";

export default function Ticket() {
    const trackRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (trackRef.current) {
            setWidth(trackRef.current.scrollWidth / 2);
        }
    }, []);

    const chunk = Array.from({ length: 6 }, (_, i) => (
        <span className="ticket-item" key={i}>
            {MESSAGE}
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
