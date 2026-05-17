import { useEffect, useState } from "react";
import {
    buildRequestUrl,
    getEndpointCandidates,
    normalizeVacancies,
} from "./vacanciesList.utils";

export function useVacancies(endpoint) {
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadVacancies() {
            setLoading(true);
            setError("");

            try {
                const endpointCandidates = getEndpointCandidates(endpoint);
                let payload = null;
                let unauthorized = false;

                for (const candidate of endpointCandidates) {
                    const requestUrls = [
                        buildRequestUrl(candidate, { includePopulate: true }),
                        buildRequestUrl(candidate, { includePopulate: false }),
                    ];

                    for (const requestUrl of requestUrls) {
                        const response = await fetch(requestUrl, {
                            signal: controller.signal,
                        });

                        if (response.status === 401 || response.status === 403) {
                            unauthorized = true;
                            continue;
                        }

                        if (response.status === 404 || response.status === 400) {
                            continue;
                        }

                        if (!response.ok) {
                            continue;
                        }

                        payload = await response.json();
                        break;
                    }

                    if (payload) {
                        break;
                    }
                }

                if (!payload) {
                    if (unauthorized) {
                        throw new Error("UNAUTHORIZED");
                    }

                    throw new Error("NO_VALID_ENDPOINT");
                }

                setVacancies(normalizeVacancies(payload));
            } catch (error) {
                if (error?.name === "AbortError") {
                    return;
                }

                console.error("Failed to load vacancies:", error);
                setVacancies([]);
                setError(
                    error?.message === "UNAUTHORIZED"
                        ? "Немає доступу до вакансій API. У Strapi увімкніть permission `find` для Public role."
                        : "Не вдалося завантажити вакансії. Спробуйте пізніше.",
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadVacancies();

        return () => controller.abort();
    }, [endpoint]);

    return {
        error,
        loading,
        vacancies,
    };
}

