import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export default function useTabsUnderline({ activeKey = "", tabKeys = [] }) {
    const tabListRef = useRef(null);
    const tabRefs = useRef({});

    const setTabRef = useCallback(
        (key) => (element) => {
            if (element) {
                tabRefs.current[key] = element;
                return;
            }
            delete tabRefs.current[key];
        },
        [],
    );

    const updateUnderline = useCallback(() => {
        const container = tabListRef.current;
        const activeElement = tabRefs.current[activeKey];
        if (!container || !activeElement) return;

        const containerRect = container.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        const left = activeRect.left - containerRect.left;
        const width = activeRect.width;

        container.style.setProperty("--underline-left", `${left}px`);
        container.style.setProperty("--underline-width", `${width}px`);

        const buttons = tabKeys
            .map((key) => tabRefs.current[key])
            .filter((button) => button && container.contains(button));
        if (buttons.length === 0) return;

        const firstTop = buttons[0].offsetTop;
        const isWrapped = buttons.some((button) => button.offsetTop !== firstTop);
        container.classList.toggle("is-wrapped", isWrapped);
    }, [activeKey, tabKeys]);

    useLayoutEffect(() => {
        const frame = requestAnimationFrame(updateUnderline);
        return () => cancelAnimationFrame(frame);
    }, [updateUnderline]);

    useEffect(() => {
        const container = tabListRef.current;
        if (!container || typeof ResizeObserver === "undefined") return undefined;

        const observer = new ResizeObserver(() => updateUnderline());
        observer.observe(container);

        tabKeys.forEach((key) => {
            const element = tabRefs.current[key];
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [tabKeys, updateUnderline]);

    useEffect(() => {
        window.addEventListener("resize", updateUnderline);
        return () => window.removeEventListener("resize", updateUnderline);
    }, [updateUnderline]);

    return {
        tabListRef,
        setTabRef,
    };
}
