import { API_BASE_URL, LOCAL_STRAPI_FALLBACK } from "./config";

export function normalizePath(path) {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return path.startsWith("/") ? path : `/${path}`;
}

export function buildApiUrl(path, params = {}) {
    const isAbsolutePath = /^https?:\/\//i.test(path);
    const normalizedPath = normalizePath(path);
    const baseUrl = isAbsolutePath
        ? path
        : API_BASE_URL
          ? `${API_BASE_URL}${normalizedPath}`
          : normalizedPath;

    const url =
        isAbsolutePath || API_BASE_URL
            ? new URL(baseUrl)
            : new URL(
                  baseUrl,
                  typeof window !== "undefined"
                      ? window.location.origin
                      : "http://localhost:5173",
              );

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
            return;
        }

        url.searchParams.set(key, String(value));
    });

    return url.toString();
}

export function buildCandidateUrls(path, params = {}) {
    const normalizedPath = normalizePath(path);
    const urls = [buildApiUrl(path, params)];

    if (
        !/^https?:\/\//i.test(path) &&
        !API_BASE_URL &&
        typeof window !== "undefined"
    ) {
        const fallbackUrl = new URL(normalizedPath, LOCAL_STRAPI_FALLBACK);
        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                return;
            }

            fallbackUrl.searchParams.set(key, String(value));
        });
        urls.push(fallbackUrl.toString());
    }

    return [...new Set(urls)];
}

