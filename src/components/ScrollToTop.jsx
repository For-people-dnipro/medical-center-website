import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTopWithOffset } from "../lib/smoothScroll";

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

function normalizePathname(pathname = "/") {
    const normalized = String(pathname || "/").trim();
    const withLeadingSlash = normalized.startsWith("/")
        ? normalized
        : `/${normalized}`;
    const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, "");
    return withoutTrailingSlash || "/";
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
        const handleSameRouteClick = (event) => {
            if (event.defaultPrevented) return;
            if (event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const anchor = event.target?.closest?.("a[href]");
            if (!anchor) return;
            if (anchor.hasAttribute("download")) return;

            const targetAttr = anchor.getAttribute("target");
            if (targetAttr && targetAttr.toLowerCase() !== "_self") return;

            const href = anchor.getAttribute("href") || "";
            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("javascript:") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:")
            ) {
                return;
            }

            let nextUrl;
            try {
                nextUrl = new URL(href, window.location.origin);
            } catch {
                return;
            }

            if (nextUrl.origin !== window.location.origin) return;
            if (nextUrl.hash) return;

            const currentUrl = new URL(window.location.href);
            const isSamePath =
                normalizePathname(nextUrl.pathname) ===
                normalizePathname(currentUrl.pathname);
            const isSameQuery = nextUrl.search === currentUrl.search;

            if (!isSamePath || !isSameQuery) return;

            event.preventDefault();
            scrollToTopWithOffset();
        };

        document.addEventListener("click", handleSameRouteClick, true);

        return () => {
            document.removeEventListener("click", handleSameRouteClick, true);
        };
    }, []);

    return null;
}
