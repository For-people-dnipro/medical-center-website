export const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_STRAPI_URL ||
    ""
)
    .trim()
    .replace(/\/$/, "");

export const IMAGEKIT_MEDIA_URL_ENDPOINT = (
    import.meta.env.VITE_IMAGEKIT_MEDIA_URL_ENDPOINT || ""
)
    .trim()
    .replace(/\/$/, "");

export const IMAGEKIT_SITE_URL_ENDPOINT = (
    import.meta.env.VITE_IMAGEKIT_SITE_URL_ENDPOINT || ""
)
    .trim()
    .replace(/\/$/, "");

export const LOCAL_STRAPI_FALLBACK = import.meta.env.DEV
    ? "http://localhost:1337"
    : "";

export const SHOULD_USE_PRODUCTION_FALLBACK = import.meta.env.DEV;

