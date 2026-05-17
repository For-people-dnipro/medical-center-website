import {
    buildOptimizedImageSrcSet,
    getOptimizedImageUrl,
    toAbsoluteMediaUrl,
} from "./imageOptimization";

const MEDIA_FORMAT_PRIORITY = {
    hero: ["large", "xlarge"],
    card: ["medium", "large", "xlarge", "small", "thumbnail"],
    default: ["medium", "large", "xlarge", "small", "thumbnail"],
};

const MEDIA_MIN_WIDTH = {
    hero: 1080,
    card: 640,
    default: 0,
};

const RESPONSIVE_FORMAT_ORDER = [
    "thumbnail",
    "small",
    "medium",
    "large",
    "xlarge",
];

export function pickSource(entry) {
    return entry?.attributes ?? entry ?? {};
}

function pickMediaSource(media) {
    if (!media) return null;

    if (Array.isArray(media?.data)) {
        return pickSource(media.data[0]);
    }

    return pickSource(media?.data ?? media);
}

function isUsableFormat(format) {
    return Boolean(format && typeof format === "object" && format.url);
}

function getOrderedFormats(source) {
    const formats =
        source?.formats && typeof source.formats === "object" ? source.formats : {};
    const namedFormats = RESPONSIVE_FORMAT_ORDER.map((name) => formats[name]).filter(
        (format) => isUsableFormat(format),
    );

    return [...namedFormats, source].filter((format, index, items) => {
        if (!isUsableFormat(format)) return false;
        const url = toAbsoluteMediaUrl(format.url);
        return url && items.findIndex((item) => item?.url === format.url) === index;
    });
}

function pickBestFormat(formats, variant = "default") {
    const priority =
        MEDIA_FORMAT_PRIORITY[variant] || MEDIA_FORMAT_PRIORITY.default;
    const minWidth = MEDIA_MIN_WIDTH[variant] ?? MEDIA_MIN_WIDTH.default;

    const orderedFormats = priority
        .map((name) => formats[name])
        .filter((format) => isUsableFormat(format));

    if (orderedFormats.length === 0) {
        return null;
    }

    if (minWidth <= 0) {
        return orderedFormats[0];
    }

    const sizedFormat = orderedFormats.find((format) => {
        const width = Number(format.width);
        return Number.isFinite(width) && width >= minWidth;
    });

    return sizedFormat || orderedFormats[0];
}

function makeResolvedMedia(source, preferred = null, fallbackAlt = "Зображення") {
    const mediaSource =
        preferred && typeof preferred === "object" ? preferred : source;
    const url = toAbsoluteMediaUrl(mediaSource?.url);
    if (!url) {
        return null;
    }

    const width = Number(mediaSource.width || source?.width);
    const height = Number(mediaSource.height || source?.height);
    const fallbackText =
        typeof fallbackAlt === "string" && fallbackAlt.trim()
            ? fallbackAlt.trim()
            : "Зображення";

    const variant = source?.__resolvedVariant || "default";
    const optimizedUrl = getOptimizedImageUrl(mediaSource?.url, {
        width,
        height,
        variant,
    });
    const optimizedSrcSet = buildOptimizedImageSrcSet(source?.url || mediaSource?.url, {
        maxWidth: Number(source?.width || mediaSource?.width),
        variant,
    });

    return {
        url: optimizedUrl || url,
        width: Number.isFinite(width) && width > 0 ? width : 1200,
        height: Number.isFinite(height) && height > 0 ? height : 680,
        alt:
            source?.alternativeText?.trim?.() ||
            source?.alt?.trim?.() ||
            source?.caption?.trim?.() ||
            source?.name?.trim?.() ||
            fallbackText,
        caption:
            typeof source?.caption === "string" && source.caption.trim()
                ? source.caption.trim()
                : "",
        srcSet:
            optimizedSrcSet ||
            getOrderedFormats(source)
                .map((format) => {
                    const absoluteUrl = getOptimizedImageUrl(format.url, {
                        width: Number(format.width),
                        variant,
                    });
                    const formatWidth = Number(format.width);
                    if (
                        !absoluteUrl ||
                        !Number.isFinite(formatWidth) ||
                        formatWidth <= 0
                    ) {
                        return "";
                    }

                    return `${absoluteUrl} ${formatWidth}w`;
                })
                .filter(Boolean)
                .join(", "),
    };
}

export function resolveMedia(media, options = {}) {
    const variant =
        typeof options.variant === "string" && options.variant.trim()
            ? options.variant.trim()
            : "default";
    const fallbackAlt =
        typeof options.fallbackAlt === "string" ? options.fallbackAlt : "";
    const source = pickMediaSource(media);
    if (!source || typeof source !== "object") {
        return null;
    }
    source.__resolvedVariant = variant;

    const formats =
        source.formats && typeof source.formats === "object"
            ? source.formats
            : {};
    const selectedFormat = pickBestFormat(formats, variant);
    const minWidth = MEDIA_MIN_WIDTH[variant] ?? MEDIA_MIN_WIDTH.default;
    const selectedWidth = Number(selectedFormat?.width);
    const originalWidth = Number(source.width);
    const shouldUseOriginalForHero =
        variant === "hero" &&
        (!selectedFormat ||
            (!Number.isNaN(selectedWidth) &&
                !Number.isNaN(originalWidth) &&
                selectedWidth < minWidth &&
                originalWidth > selectedWidth));

    if (shouldUseOriginalForHero) {
        return makeResolvedMedia(source, null, fallbackAlt);
    }

    if (selectedFormat) {
        return makeResolvedMedia(source, selectedFormat, fallbackAlt);
    }

    return makeResolvedMedia(source, null, fallbackAlt);
}

export function getResponsiveImageProps(media, options = {}) {
    const resolved = resolveMedia(media, options);
    if (!resolved) return null;

    const defaultSizesByVariant = {
        hero: "100vw",
        card: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        default: "100vw",
    };
    const variant =
        typeof options.variant === "string" && options.variant.trim()
            ? options.variant.trim()
            : "default";
    const sizes =
        typeof options.sizes === "string" && options.sizes.trim()
            ? options.sizes.trim()
            : defaultSizesByVariant[variant] || defaultSizesByVariant.default;

    return {
        src: resolved.url,
        srcSet: resolved.srcSet || undefined,
        sizes,
        width: resolved.width,
        height: resolved.height,
        alt: resolved.alt,
        caption: resolved.caption,
    };
}

