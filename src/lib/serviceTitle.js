const TRAILING_CITY_PATTERNS = [
    /\s*[–—-]?\s*(?:у|в)\s+дніпрі\s*$/iu,
    /\s*[–—-]?\s*м\.?\s*дніпро\s*$/iu,
    /\s*\(\s*(?:у|в)\s+дніпрі\s*\)\s*$/iu,
    /\s*\(\s*(?:м\.?\s*)?дніпро\s*\)\s*$/iu,
];

export function toUiServiceTitle(value) {
    const original = typeof value === "string" ? value.trim() : "";
    if (!original) return "";

    let normalized = original;
    TRAILING_CITY_PATTERNS.forEach((pattern) => {
        normalized = normalized.replace(pattern, "").trim();
    });

    normalized = normalized.replace(/\s{2,}/g, " ").trim();

    return normalized || original;
}
