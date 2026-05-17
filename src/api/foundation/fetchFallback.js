import { SHOULD_USE_PRODUCTION_FALLBACK } from "./config";
import { buildCandidateUrls } from "./urlBuilders";

export async function fetchJson(url, { signal } = {}) {
    const response = await fetch(url, { signal });

    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const payload = await response.json();
            message = payload?.error?.message || payload?.message || message;
        } catch {
            // Ignore invalid JSON bodies and keep the HTTP-based fallback message.
        }

        const error = new Error(message);
        error.status = response.status;
        error.url = url;
        throw error;
    }

    return response.json();
}

export async function fetchWithEndpointFallback({
    endpoints,
    paramsVariants = [{}],
    signal,
    unauthorizedMessage = "UNAUTHORIZED",
    retryStatusCodes = SHOULD_USE_PRODUCTION_FALLBACK ? [400, 404] : [],
    allowProductionFallback = SHOULD_USE_PRODUCTION_FALLBACK,
}) {
    let lastError = null;
    let unauthorizedError = null;
    const attemptErrors = [];

    const activeEndpoints =
        allowProductionFallback || endpoints.length <= 1
            ? endpoints
            : endpoints.slice(0, 1);
    const activeParamsVariants =
        allowProductionFallback || paramsVariants.length <= 1
            ? paramsVariants
            : paramsVariants.slice(0, 1);

    for (const endpoint of activeEndpoints) {
        for (const params of activeParamsVariants) {
            const requestUrls = buildCandidateUrls(endpoint, params);

            for (const requestUrl of requestUrls) {
                try {
                    return await fetchJson(requestUrl, { signal });
                } catch (requestError) {
                    if (requestError?.name === "AbortError") {
                        throw requestError;
                    }

                    const status = Number(requestError?.status);
                    if (status === 401 || status === 403) {
                        unauthorizedError =
                            unauthorizedError ||
                            new Error(unauthorizedMessage);
                        attemptErrors.push({
                            url: requestUrl,
                            status,
                            message: requestError?.message || "Unauthorized",
                        });
                        continue;
                    }

                    attemptErrors.push({
                        url: requestUrl,
                        status,
                        message: requestError?.message || "Request failed",
                    });

                    if (retryStatusCodes.includes(status)) {
                        lastError = requestError;
                        continue;
                    }

                    lastError = requestError;
                }
            }
        }
    }

    if (unauthorizedError) {
        unauthorizedError.attempts = attemptErrors;
        throw unauthorizedError;
    }

    const error = lastError || new Error("NO_VALID_ENDPOINT");
    error.attempts = attemptErrors;
    throw error;
}

