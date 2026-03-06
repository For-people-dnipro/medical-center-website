import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToPageTop() {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlBehavior = html?.style.scrollBehavior || "";
    const previousBodyBehavior = body?.style.scrollBehavior || "";

    if (html) {
        html.style.scrollBehavior = "auto";
    }
    if (body) {
        body.style.scrollBehavior = "auto";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (html) {
        html.style.scrollBehavior = previousHtmlBehavior;
    }
    if (body) {
        body.style.scrollBehavior = previousBodyBehavior;
    }
}

export default function ScrollToTop() {
    const location = useLocation();
    const shouldSkipScrollReset = location.state?.disableScrollReset === true;

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
        if (shouldSkipScrollReset) return;
        scrollToPageTop();
    }, [location.pathname, shouldSkipScrollReset]);

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
