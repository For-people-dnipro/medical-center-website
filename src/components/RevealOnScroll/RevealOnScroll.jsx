import { useEffect, useRef, useState } from "react";
import "./RevealOnScroll.css";

export default function RevealOnScroll({
    children,
    className = "",
    threshold = 0.15,
    rootMargin = "0px 0px -10% 0px",
    waitForScroll = false,
    as: Tag = "div",
}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        let hasScrolled = !waitForScroll || window.scrollY > 0;
        let isIntersecting = false;

        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return undefined;
        }

        const revealIfReady = () => {
            if (hasScrolled && isIntersecting) {
                setVisible(true);
                observer.disconnect();
                window.removeEventListener("scroll", handleScroll);
            }
        };

        const handleScroll = () => {
            hasScrolled = true;
            revealIfReady();
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    isIntersecting = entry.isIntersecting;
                    revealIfReady();
                });
            },
            { threshold, rootMargin },
        );

        observer.observe(node);
        if (waitForScroll) {
            window.addEventListener("scroll", handleScroll, { passive: true });
        }

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, [threshold, rootMargin, waitForScroll]);

    return (
        <Tag
            ref={ref}
            className={`reveal-on-scroll ${visible ? "is-visible" : ""} ${className}`.trim()}
        >
            {children}
        </Tag>
    );
}
