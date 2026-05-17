import { useEffect, useRef, useState } from "react";
import "./RevealOnScroll.css";

export default function RevealOnScroll({
    children,
    className = "",
    threshold = 0.15,
    rootMargin = "0px 0px -10% 0px",
    as: Tag = "div",
}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold, rootMargin },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return (
        <Tag
            ref={ref}
            className={`reveal-on-scroll ${visible ? "is-visible" : ""} ${className}`.trim()}
        >
            {children}
        </Tag>
    );
}
