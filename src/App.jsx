import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./sections/Header";
import PageLoader from "./components/PageLoader/PageLoader";
import MobileCTA from "./components/MobileCTA/MobileCTA";
import "./styles/pageTransitions.css";
import Footer from "./components/Footer/Footer";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import {
    getGoogleAnalyticsId,
    hasAnalyticsConsent,
    initializeGoogleAnalytics,
    trackPageView,
} from "./lib/analytics";
import {
    prefetchRouteImages,
    prefetchRouteImagesFromHref,
    warmCriticalRouteImageCache,
} from "./lib/routeImagePrefetch";

const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs"));
const AllServices = lazy(() => import("./pages/AllServices"));
const DeclarationPage = lazy(() => import("./pages/DeclarationPage"));
const ConsultPage = lazy(() => import("./pages/ConsultPage/ConsultPage"));
const DiagnosticsPage = lazy(
    () => import("./pages/DiagnosticsPage/DiagnosticsPage"),
);
const ManipulationPage = lazy(
    () => import("./pages/ManipulationPage/ManipulationPage"),
);
const VaccinationPage = lazy(
    () => import("./pages/VaccinationPage/VaccinationPage"),
);
const PackagesPage = lazy(() => import("./pages/PackagesPage/PackagesPage"));
const TestPage = lazy(() => import("./pages/TestPage/TestPage"));
const Screening40Page = lazy(
    () => import("./pages/Screening40Page/Screening40Page"),
);
const AirAlertPage = lazy(() => import("./pages/AirAlertPage/AirAlertPage"));
const RulesPage = lazy(() => import("./pages/RulesPage/RulesPage"));
const OfferPage = lazy(() => import("./pages/OfferPage/OfferPage"));
const PrivacyPolicyPage = lazy(
    () => import("./pages/PrivacyPolicyPage/PrivacyPolicyPage"),
);
const DataProtectionPage = lazy(
    () => import("./pages/DataProtectionPage/DataProtectionPage"),
);
const FreeServicesPage = lazy(
    () => import("./pages/FreeServicesPage/FreeServicesPage"),
);
const BranchesPage = lazy(() => import("./pages/BranchesPage/BranchesPage"));
const AnalysesPage = lazy(() => import("./pages/AnalysesPage/AnalysesPage"));
const VacanciesPage = lazy(() => import("./pages/VacanciesPage/VacanciesPage"));
const NewsPage = lazy(() => import("./pages/NewsPage/NewsPage"));
const NewsArticlePage = lazy(
    () => import("./pages/NewsArticlePage/NewsArticlePage"),
);
const DoctorsPage = lazy(() => import("./pages/DoctorsPage/DoctorsPage"));
const DoctorProfilePage = lazy(
    () => import("./pages/DoctorProfilePage/DoctorProfilePage"),
);
const ContactsPage = lazy(() => import("./pages/ContactsPage/ContactsPage"));

const INITIAL_LOADER_DISPLAY_MS = 120;
const ROUTE_SHELL_READY_CLASS = "app-shell--ready";

function RouteFallback() {
    return <div className="route-fallback" aria-hidden="true" />;
}

function getSessionValue(key) {
    if (typeof window === "undefined") return "";

    try {
        return window.sessionStorage.getItem(key) || "";
    } catch {
        return "";
    }
}

function setSessionValue(key, value) {
    if (typeof window === "undefined") return;

    try {
        window.sessionStorage.setItem(key, value);
    } catch {
        /* ignore quota/security errors */
    }
}

function normalizePathname(pathname = "/") {
    const raw = String(pathname || "/").trim();
    const normalized = raw.startsWith("/") ? raw : `/${raw}`;
    const withoutTrailing = normalized.replace(/\/+$/, "");
    return withoutTrailing || "/";
}

function App() {
    const location = useLocation();
    const normalizedPathname = normalizePathname(location.pathname);
    const trackedPathRef = useRef("");
    const [isLoaderVisible, setIsLoaderVisible] = useState(true);
    const [isLoaderExiting, setIsLoaderExiting] = useState(false);
    const measurementId = getGoogleAnalyticsId();

    useEffect(() => {
        const hasSeenLoader = getSessionValue("has-seen-loader");
        if (hasSeenLoader === "1") {
            setIsLoaderVisible(false);
            return undefined;
        }

        const showTimer = window.setTimeout(() => {
            setSessionValue("has-seen-loader", "1");
            setIsLoaderExiting(true);
        }, INITIAL_LOADER_DISPLAY_MS);

        return () => window.clearTimeout(showTimer);
    }, []);

    useEffect(() => {
        const isHomeRoute = normalizedPathname === "/";
        const isContactsRoute = normalizedPathname === "/contacts";
        const isScreening40Route = normalizedPathname === "/screening-40-plus";
        document.body.classList.toggle("route-home", isHomeRoute);
        document.body.classList.toggle("route-contacts", isContactsRoute);
        document.body.classList.toggle(
            "route-screening-40-plus",
            isScreening40Route,
        );

        return () => {
            document.body.classList.remove("route-home");
            document.body.classList.remove("route-contacts");
            document.body.classList.remove("route-screening-40-plus");
        };
    }, [normalizedPathname]);

    useEffect(() => {
        if (isLoaderVisible) return undefined;

        const setLinkTarget = (anchor) => {
            const href = anchor.getAttribute("href") || "";

            if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
                return;
            }

            let url;

            try {
                url = new URL(href, window.location.origin);
            } catch {
                return;
            }

            const isHttpLink =
                url.protocol === "http:" || url.protocol === "https:";
            const isExternal = isHttpLink && url.origin !== window.location.origin;

            if (isExternal) {
                anchor.setAttribute("target", "_blank");
                anchor.setAttribute("rel", "noopener noreferrer");
                return;
            }

            anchor.removeAttribute("target");
            anchor.removeAttribute("rel");
        };

        const updateAnchors = (root = document) => {
            root.querySelectorAll("a[href]").forEach(setLinkTarget);
        };

        updateAnchors();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return;

                    if (node.matches("a[href]")) {
                        setLinkTarget(node);
                    }

                    updateAnchors(node);
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [location.pathname, isLoaderVisible]);

    useEffect(() => {
        const currentPath = `${location.pathname}${location.search}`;
        if (!currentPath || currentPath === trackedPathRef.current) {
            return;
        }

        if (!hasAnalyticsConsent()) {
            trackedPathRef.current = currentPath;
            return;
        }

        const initialized = initializeGoogleAnalytics(measurementId);
        if (!initialized) {
            trackedPathRef.current = currentPath;
            return;
        }

        trackPageView();
        trackedPathRef.current = currentPath;
    }, [location.pathname, location.search, measurementId]);

    useEffect(() => {
        prefetchRouteImages(normalizedPathname, { highPriority: true });
    }, [normalizedPathname]);

    useEffect(() => {
        const handlePointerOver = (event) => {
            const anchor = event.target?.closest?.("a[href]");
            if (!anchor) return;
            prefetchRouteImagesFromHref(anchor.getAttribute("href"));
        };

        const handlePointerDown = (event) => {
            const anchor = event.target?.closest?.("a[href]");
            if (!anchor) return;
            prefetchRouteImagesFromHref(anchor.getAttribute("href"), {
                highPriority: true,
            });
        };

        const handleTouchStart = (event) => {
            const anchor = event.target?.closest?.("a[href]");
            if (!anchor) return;
            prefetchRouteImagesFromHref(anchor.getAttribute("href"), {
                highPriority: true,
            });
        };

        const handleFocusIn = (event) => {
            const anchor = event.target?.closest?.("a[href]");
            if (!anchor) return;
            prefetchRouteImagesFromHref(anchor.getAttribute("href"));
        };

        document.addEventListener("pointerover", handlePointerOver, true);
        document.addEventListener("pointerdown", handlePointerDown, true);
        document.addEventListener("touchstart", handleTouchStart, true);
        document.addEventListener("focusin", handleFocusIn, true);

        return () => {
            document.removeEventListener("pointerover", handlePointerOver, true);
            document.removeEventListener("pointerdown", handlePointerDown, true);
            document.removeEventListener("touchstart", handleTouchStart, true);
            document.removeEventListener("focusin", handleFocusIn, true);
        };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        if ("requestIdleCallback" in window) {
            const callbackId = window.requestIdleCallback(() => {
                warmCriticalRouteImageCache();
            });

            return () => window.cancelIdleCallback(callbackId);
        }

        const timeoutId = window.setTimeout(() => {
            warmCriticalRouteImageCache();
        }, 700);

        return () => window.clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        let cancelled = false;

        const warmContentCache = async () => {
            try {
                const [doctorsApi, newsApi] = await Promise.all([
                    import("./api/doctorsApi"),
                    import("./api/newsApi"),
                ]);

                if (cancelled) return;

                const [doctorsResponse, newsResponse] = await Promise.allSettled([
                    doctorsApi.fetchDoctorsList(),
                    newsApi.fetchNewsList(),
                    doctorsApi.fetchDoctorBranches(),
                    doctorsApi.fetchDoctorSpecialisations(),
                    newsApi.fetchThemes(),
                ]);

                if (cancelled) return;

                const doctors =
                    doctorsResponse.status === "fulfilled"
                        ? doctorsResponse.value?.items || []
                        : [];
                const news =
                    newsResponse.status === "fulfilled"
                        ? newsResponse.value?.items || []
                        : [];

                doctors.slice(0, 8).forEach((doctor) => {
                    doctorsApi.prefetchDoctorBySlug(doctor?.slug);
                });
                news.slice(0, 8).forEach((item) => {
                    newsApi.prefetchNewsBySlug(item?.slug);
                });
            } catch {
                /* ignore prefetch errors */
            }
        };

        if ("requestIdleCallback" in window) {
            const callbackId = window.requestIdleCallback(warmContentCache, {
                timeout: 1800,
            });
            return () => {
                cancelled = true;
                window.cancelIdleCallback(callbackId);
            };
        }

        const timeoutId = window.setTimeout(warmContentCache, 900);
        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, []);

    const shouldSkipPageTransition =
        location.state?.skipPageTransition === true;
    const routeTransitionKey = location.pathname;

    return (
        <>
            {isLoaderVisible ? (
                <PageLoader
                    isExiting={isLoaderExiting}
                    onExited={() => setIsLoaderVisible(false)}
                />
            ) : null}

            <div
                className={`app-shell ${!isLoaderVisible ? ROUTE_SHELL_READY_CLASS : ""}`}
            >
                <Header />
                <div className="route-viewport">
                    <Suspense fallback={<RouteFallback />}>
                        <div
                            key={routeTransitionKey}
                            className={`page-content ${
                                shouldSkipPageTransition ? "" : "page-fade"
                            }`.trim()}
                        >
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<AboutUs />} />
                                <Route path="/services" element={<AllServices />} />
                                <Route
                                    path="/declaration"
                                    element={<DeclarationPage />}
                                />
                                <Route path="/consultation" element={<ConsultPage />} />
                                <Route
                                    path="/diagnostics"
                                    element={<DiagnosticsPage />}
                                />
                                <Route
                                    path="/manipulation"
                                    element={<ManipulationPage />}
                                />
                                <Route
                                    path="/vaccination"
                                    element={<VaccinationPage />}
                                />
                                <Route path="/packages" element={<PackagesPage />} />
                                <Route path="/checkup" element={<TestPage />} />
                                <Route
                                    path="/screening-40-plus"
                                    element={<Screening40Page />}
                                />
                                <Route
                                    path="/check-up"
                                    element={<Navigate to="/checkup" replace />}
                                />
                                <Route path="/air-alert" element={<AirAlertPage />} />
                                <Route path="/rules" element={<RulesPage />} />
                                <Route path="/offer" element={<OfferPage />} />
                                <Route
                                    path="/privacy"
                                    element={<PrivacyPolicyPage />}
                                />
                                <Route
                                    path="/data-protection"
                                    element={<DataProtectionPage />}
                                />
                                <Route
                                    path="/free-services"
                                    element={<FreeServicesPage />}
                                />
                                <Route path="/doctors" element={<DoctorsPage />} />
                                <Route
                                    path="/doctors/:slug"
                                    element={<DoctorProfilePage />}
                                />
                                <Route path="/branches" element={<BranchesPage />} />
                                <Route path="/analyses" element={<AnalysesPage />} />
                                <Route
                                    path="/vacancies"
                                    element={<VacanciesPage />}
                                />
                                <Route path="/news" element={<NewsPage />} />
                                <Route
                                    path="/news/:slug"
                                    element={<NewsArticlePage />}
                                />
                                <Route path="/contacts" element={<ContactsPage />} />
                                <Route path="*" element={<Home />} />
                            </Routes>
                        </div>
                    </Suspense>
                </div>
                <MobileCTA />
            </div>
            <Footer />
            <CookieBanner />
        </>
    );
}

export default App;
