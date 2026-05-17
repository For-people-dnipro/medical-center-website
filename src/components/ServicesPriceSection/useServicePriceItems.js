import { useEffect, useRef, useState } from "react";
import {
    buildRequestUrl,
    normalizeServicePriceItems,
    readCachedItems,
    writeCachedItems,
} from "./servicePriceSection.utils";

export function useServicePriceItems({
    cacheKey,
    endpoint,
    filterField,
    filterValue,
    page,
    visitType,
}) {
    const initialCachedItems = readCachedItems(cacheKey);
    const requestIdRef = useRef(0);
    const lastStableItemsRef = useRef(initialCachedItems);
    const itemsRef = useRef(initialCachedItems);
    const [items, setItems] = useState(initialCachedItems);
    const [loading, setLoading] = useState(initialCachedItems.length === 0);
    const [error, setError] = useState("");

    useEffect(() => {
        const cachedItems = readCachedItems(cacheKey);
        lastStableItemsRef.current = cachedItems;
        itemsRef.current = cachedItems;
        setItems(cachedItems);
        setError("");
        setLoading(cachedItems.length === 0);
    }, [cacheKey]);

    useEffect(() => {
        const controller = new AbortController();
        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;

        async function fetchItems() {
            const requestUrl = buildRequestUrl(endpoint, {
                filterField,
                filterValue,
            });

            console.info("[ServicesPriceSection] fetch:start", {
                endpoint,
                page,
                visitType,
                requestId,
                requestUrl,
            });

            setLoading(true);
            setError("");

            try {
                const response = await fetch(requestUrl, {
                    signal: controller.signal,
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const payload = await response.json();
                const normalizedItems = normalizeServicePriceItems(payload);

                if (requestId !== requestIdRef.current) {
                    console.warn(
                        "[ServicesPriceSection] fetch:stale-response:ignored",
                        { requestId, latestRequestId: requestIdRef.current },
                    );
                    return;
                }

                console.info("[ServicesPriceSection] fetch:success", {
                    requestId,
                    itemsCount: normalizedItems.length,
                });

                if (normalizedItems.length > 0) {
                    writeCachedItems(cacheKey, normalizedItems);
                    lastStableItemsRef.current = normalizedItems;
                    itemsRef.current = normalizedItems;
                    setItems(normalizedItems);
                    return;
                }

                const fallbackItems =
                    lastStableItemsRef.current.length > 0
                        ? lastStableItemsRef.current
                        : itemsRef.current.length > 0
                          ? itemsRef.current
                          : readCachedItems(cacheKey);

                if (fallbackItems.length > 0) {
                    console.warn(
                        "[ServicesPriceSection] fetch:empty-response:keeping-existing-items",
                        {
                            requestId,
                            keptItemsCount: fallbackItems.length,
                        },
                    );
                    setItems(fallbackItems);
                    return;
                }

                console.warn("[ServicesPriceSection] fetch:empty-response", {
                    requestId,
                });
                setItems([]);
            } catch (error) {
                if (error?.name === "AbortError") {
                    console.info("[ServicesPriceSection] fetch:aborted", {
                        requestId,
                    });
                    return;
                }

                console.error("Failed to load service prices:", error);

                if (requestId !== requestIdRef.current) {
                    return;
                }

                const fallbackItems =
                    lastStableItemsRef.current.length > 0
                        ? lastStableItemsRef.current
                        : itemsRef.current.length > 0
                          ? itemsRef.current
                          : readCachedItems(cacheKey);

                if (fallbackItems.length > 0) {
                    console.warn(
                        "[ServicesPriceSection] fetch:error:keeping-existing-items",
                        {
                            requestId,
                            keptItemsCount: fallbackItems.length,
                        },
                    );
                    setItems(fallbackItems);
                    setError("");
                    return;
                }

                setItems([]);
                setError("Не вдалося завантажити ціни. Спробуйте пізніше.");
            } finally {
                if (
                    requestId === requestIdRef.current &&
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }
            }
        }

        fetchItems();

        return () => controller.abort();
    }, [cacheKey, endpoint, filterField, filterValue, page, visitType]);

    useEffect(() => {
        itemsRef.current = items;

        if (items.length > 0) {
            writeCachedItems(cacheKey, items);
            lastStableItemsRef.current = items;
        }

        console.info("[ServicesPriceSection] items:changed", {
            endpoint,
            page,
            visitType,
            itemsCount: items.length,
        });

        if (items.length === 0) {
            console.warn("[ServicesPriceSection] items:empty", {
                endpoint,
                page,
                visitType,
            });
        }
    }, [cacheKey, endpoint, items, page, visitType]);

    return {
        error,
        items,
        loading,
    };
}

