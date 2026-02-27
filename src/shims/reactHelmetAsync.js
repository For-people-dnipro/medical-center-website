import { Children, Fragment, isValidElement, useEffect } from "react";

const MANAGED_ATTR = "data-helmet-shim";

function toAttrName(key) {
    if (key === "charSet") return "charset";
    if (key === "httpEquiv") return "http-equiv";
    return key;
}

function setElementAttributes(node, props = {}) {
    Object.entries(props).forEach(([key, rawValue]) => {
        if (key === "children") return;
        if (rawValue === undefined || rawValue === null || rawValue === false) {
            return;
        }
        const attr = toAttrName(key);
        const value = rawValue === true ? "" : String(rawValue);
        node.setAttribute(attr, value);
    });
}

function flattenHelmetChildren(children) {
    const result = [];
    Children.forEach(children, (child) => {
        if (!child) return;

        if (isValidElement(child) && child.type === Fragment) {
            result.push(...flattenHelmetChildren(child.props.children));
            return;
        }

        result.push(child);
    });
    return result;
}

function removeBySelector(selector) {
    if (!selector) return;
    document.head.querySelectorAll(selector).forEach((node) => node.remove());
}

function applyMeta(props) {
    const selector = props.name
        ? `meta[name="${props.name}"]`
        : props.property
          ? `meta[property="${props.property}"]`
          : props.charSet || props.charset
            ? "meta[charset]"
            : props.httpEquiv || props["http-equiv"]
              ? `meta[http-equiv="${props.httpEquiv || props["http-equiv"]}"]`
              : "";

    removeBySelector(selector);

    const node = document.createElement("meta");
    setElementAttributes(node, props);
    node.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(node);
}

function applyLink(props) {
    const rel = props.rel ? String(props.rel) : "";
    const selector = rel ? `link[rel="${rel}"]` : "";
    removeBySelector(selector);

    const node = document.createElement("link");
    setElementAttributes(node, props);
    node.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(node);
}

function applyScript(props) {
    const type = props.type ? String(props.type) : "";
    const selector = type ? `script[type="${type}"]` : "";
    removeBySelector(selector);

    const node = document.createElement("script");
    setElementAttributes(node, props);
    if (props.children !== undefined && props.children !== null) {
        node.textContent = String(props.children);
    }
    node.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(node);
}

export function HelmetProvider({ children }) {
    return children;
}

export function Helmet({ children }) {
    useEffect(() => {
        if (typeof document === "undefined") return undefined;

        const nodes = flattenHelmetChildren(children);

        nodes.forEach((child) => {
            if (!isValidElement(child)) return;

            const type = String(child.type);
            const props = child.props || {};

            if (type === "title") {
                const titleValue = Children.toArray(props.children).join("");
                document.title = titleValue;
                return;
            }

            if (type === "meta") {
                applyMeta(props);
                return;
            }

            if (type === "link") {
                applyLink(props);
                return;
            }

            if (type === "script") {
                applyScript(props);
                return;
            }

            if (type === "html") {
                if (props.lang) {
                    document.documentElement.setAttribute("lang", String(props.lang));
                }
            }
        });

        return () => {
            if (typeof document === "undefined") return;
            document
                .head
                .querySelectorAll(`[${MANAGED_ATTR}]`)
                .forEach((node) => node.remove());
        };
    }, [children]);

    return null;
}
