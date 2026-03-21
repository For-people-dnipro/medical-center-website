import { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs/AboutUs";
import AllServices from "./pages/AllServices";
import DeclarationPage from "./pages/DeclarationPage";
import Header from "./sections/Header";
import MobileCTA from "./components/MobileCTA/MobileCTA";
import PageLoader from "./components/PageLoader/PageLoader";
import "./styles/pageTransitions.css";
import ConsultPage from "./pages/ConsultPage/ConsultPage";
import DiagnosticsPage from "./pages/DiagnosticsPage/DiagnosticsPage";
import ManipulationPage from "./pages/ManipulationPage/ManipulationPage";
import VaccinationPage from "./pages/VaccinationPage/VaccinationPage";
import PackagesPage from "./pages/PackagesPage/PackagesPage";
import TestPage from "./pages/TestPage/TestPage";
import Screening40Page from "./pages/Screening40Page/Screening40Page";
import AirAlertPage from "./pages/AirAlertPage/AirAlertPage";
import OfferPage from "./pages/OfferPage/OfferPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";
import DataProtectionPage from "./pages/DataProtectionPage/DataProtectionPage";
import FreeServicesPage from "./pages/FreeServicesPage/FreeServicesPage";
import BranchesPage from "./pages/BranchesPage/BranchesPage";
import AnalysesPage from "./pages/AnalysesPage/AnalysesPage";
import VacanciesPage from "./pages/VacanciesPage/VacanciesPage";
import NewsPage from "./pages/NewsPage/NewsPage";
import NewsArticlePage from "./pages/NewsArticlePage/NewsArticlePage";
import DoctorsPage from "./pages/DoctorsPage/DoctorsPage";
import DoctorProfilePage from "./pages/DoctorProfilePage/DoctorProfilePage";
import ContactsPage from "./pages/ContactsPage/ContactsPage";
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

const INITIAL_LOADER_DISPLAY_MS = 300;

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
        const showTimer = window.setTimeout(() => {
            setIsLoaderExiting(true);
        }, INITIAL_LOADER_DISPLAY_MS);

        return () => window.clearTimeout(showTimer);
    }, []);

    useEffect(() => {
        const isContactsRoute = normalizedPathname === "/contacts";
        const isScreening40Route = normalizedPathname === "/screening-40-plus";
        document.body.classList.toggle("route-contacts", isContactsRoute);
        document.body.classList.toggle(
            "route-screening-40-plus",
            isScreening40Route,
        );

        return () => {
            document.body.classList.remove("route-contacts");
            document.body.classList.remove("route-screening-40-plus");
        };
    }, [normalizedPathname]);

    useEffect(() => {
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
                className={`app-shell ${!isLoaderVisible ? "app-shell--ready" : ""}`}
            >
                <Header />
                <div className="route-viewport">
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
                            />{" "}
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
                            <Route path="/vacancies" element={<VacanciesPage />} />
                            <Route path="/news" element={<NewsPage />} />
                            <Route path="/news/:slug" element={<NewsArticlePage />} />
                            <Route path="/contacts" element={<ContactsPage />} />
                            <Route path="*" element={<Home />} />
                        </Routes>
                    </div>
                </div>
                <MobileCTA />
            </div>
            <Footer />
            <CookieBanner />
        </>
    );
}

export default App;
