function decodeHtmlEntities(value) {
    if (!value) return "";

    if (typeof document === "undefined") {
        return value
            .replace(/&nbsp;/gi, " ")
            .replace(/&amp;/gi, "&")
            .replace(/&lt;/gi, "<")
            .replace(/&gt;/gi, ">")
            .replace(/&quot;/gi, '"')
            .replace(/&#39;/gi, "'");
    }

    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
}

export function htmlToPlainText(value) {
    const source = String(value || "");
    if (!source.trim()) return "";

    return decodeHtmlEntities(
        source
            .replace(/<\s*br\s*\/?>/gi, "\n")
            .replace(/<\s*\/p\s*>/gi, "\n\n")
            .replace(/<\s*\/div\s*>/gi, "\n")
            .replace(/<\s*\/li\s*>/gi, "\n")
            .replace(/<li[^>]*>/gi, "• ")
            .replace(/<[^>]+>/g, " ")
            .replace(/\r/g, "")
            .replace(/[ \t]+\n/g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .replace(/[ \t]{2,}/g, " ")
            .trim(),
    );
}

export function renderPlainTextBlocks(value, renderLine) {
    const text = htmlToPlainText(value);
    if (!text) return null;

    return text
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block, index) => renderLine(block, index));
}
