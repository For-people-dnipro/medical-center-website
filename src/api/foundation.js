export {
    API_BASE_URL,
    LOCAL_STRAPI_FALLBACK,
    SHOULD_USE_PRODUCTION_FALLBACK,
} from "./foundation/config";
export {
    buildApiUrl,
    buildCandidateUrls,
    normalizePath,
} from "./foundation/urlBuilders";
export {
    buildOptimizedImageSrcSet,
    getOptimizedImageUrl,
    toAbsoluteMediaUrl,
} from "./foundation/imageOptimization";
export {
    getResponsiveImageProps,
    pickSource,
    resolveMedia,
} from "./foundation/mediaResolve";
export { fetchJson, fetchWithEndpointFallback } from "./foundation/fetchFallback";

