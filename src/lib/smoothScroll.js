const DEFAULT_GAP = 20;

function getHeaderOffset() {
    if (typeof document === "undefined") {
        return DEFAULT_GAP;
    }

    const headerHeight =
        document.querySelector(".header")?.getBoundingClientRect()?.height || 0;

    return headerHeight + DEFAULT_GAP;
}

export function scrollToTopWithOffset({ behavior = "smooth" } = {}) {
    if (typeof window === "undefined") return;

    window.scrollTo({
        top: 0,
        left: 0,
        behavior,
    });
}

export function scrollToElementWithOffset(target, options = {}) {
    if (typeof window === "undefined" || !target) {
        return false;
    }

    const offset =
        typeof options.offset === "number" ? options.offset : getHeaderOffset();
    const behavior =
        typeof options.behavior === "string" ? options.behavior : "smooth";
    const rect = target.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const top = Math.max(absoluteTop - offset, 0);

    window.scrollTo({
        top,
        left: 0,
        behavior,
    });

    return true;
}

export function scrollToSelectorWithOffset(selector, options = {}) {
    if (typeof document === "undefined") {
        return false;
    }

    const target = document.querySelector(selector);
    return scrollToElementWithOffset(target, options);
}
