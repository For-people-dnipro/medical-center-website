import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToPageTop() {
    window.scrollTo(0, 0);
}

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        const { history } = window;
        if (!("scrollRestoration" in history)) return undefined;

        const previousValue = history.scrollRestoration;
        history.scrollRestoration = "manual";

        return () => {
            history.scrollRestoration = previousValue;
        };
    }, []);

    useLayoutEffect(() => {
        scrollToPageTop();
    }, [pathname]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            scrollToPageTop();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    return null;
}
