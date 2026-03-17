import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
    hasAnalyticsConsent,
    initializeGoogleAnalytics,
    trackPageView,
} from "./lib/analytics";
import {
    prefetchRouteImages,
    prefetchRouteImagesFromHref,
    warmCriticalRouteImageCache,
} from "./lib/routeImagePrefetch";

const ROUTE_ASSET_MAX_WAIT_MS = 1600;
const ROUTE_ASSET_SETTLE_MS = 70;
const ROUTES_WITH_SMALL_CRITICAL_MEDIA = new Set(["/services"]);

function normalizePathname(pathname = "/") {
    const raw = String(pathname || "/").trim();
    const normalized = raw.startsWith("/") ? raw : `/${raw}`;
    const withoutTrailing = normalized.replace(/\/+$/, "");
    return withoutTrailing || "/";
}

function isRouteCriticalImage(image, pathname = "/") {
    if (!(image instanceof HTMLImageElement)) return false;

    const normalizedPathname = normalizePathname(pathname);
    const isExplicitNonBlocking = image.dataset.routeNonblocking === "true";
    const isExplicitCritical = image.dataset.routeCritical === "true";

    if (isExplicitNonBlocking) {
        return false;
    }

    if (isExplicitCritical) {
        return true;
    }

    const rect = image.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 900;
    const viewportWidth = window.innerWidth || 1440;
    const widthHint =
        Number(image.getAttribute("width")) || image.naturalWidth || 0;
    const heightHint =
        Number(image.getAttribute("height")) || image.naturalHeight || 0;
    const visualWidth = rect.width || widthHint;
    const visualHeight = rect.height || heightHint;

    const areaThreshold = ROUTES_WITH_SMALL_CRITICAL_MEDIA.has(normalizedPathname)
        ? 64
        : 3600;
    if (visualWidth * visualHeight < areaThreshold) return false;

    const nearTopViewportMultiplier =
        normalizedPathname === "/services" ? 2 : 1.2;

    const isInsideHorizontalViewport =
        rect.right > -40 && rect.left < viewportWidth + 40;
    const isNearTopViewport =
        rect.bottom > -120 &&
        rect.top < viewportHeight * nearTopViewportMultiplier;

    return isInsideHorizontalViewport && isNearTopViewport;
}

function App() {
    const location = useLocation();
    const normalizedPathname = normalizePathname(location.pathname);
    const trackedPathRef = useRef("");
    const [isLoaderVisible, setIsLoaderVisible] = useState(true);
    const [isLoaderExiting, setIsLoaderExiting] = useState(false);
    const [isRouteAssetsReady, setIsRouteAssetsReady] = useState(true);
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

    useEffect(() => {
        const showTimer = window.setTimeout(() => {
            setIsLoaderExiting(true);
        }, 1500);

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

    useLayoutEffect(() => {
        setIsRouteAssetsReady(false);
    }, [normalizedPathname]);

    useEffect(() => {
        let isCancelled = false;
        let settleTimerId = 0;
        const cleanupImageListeners = new Set();
        const trackedImages = new WeakSet();
        let pendingImagesCount = 0;
        let hasSeenCriticalImage = false;

        const contentNode = document.querySelector(".page-content");
        if (!contentNode) {
            setIsRouteAssetsReady(true);
            return undefined;
        }

        const revealFallbackTimer = window.setTimeout(() => {
            if (!isCancelled) {
                setIsRouteAssetsReady(true);
            }
        }, ROUTE_ASSET_MAX_WAIT_MS);

        const clearSettleTimer = () => {
            if (settleTimerId) {
                window.clearTimeout(settleTimerId);
                settleTimerId = 0;
            }
        };

        const revealWhenSettled = () => {
            clearSettleTimer();
            settleTimerId = window.setTimeout(() => {
                if (!isCancelled && pendingImagesCount === 0) {
                    setIsRouteAssetsReady(true);
                }
            }, ROUTE_ASSET_SETTLE_MS);
        };

        const hasLoadingIndicator = () =>
            Boolean(
                contentNode.querySelector(
                    '[role="status"], [aria-busy="true"], .news-page__state, .doctors-page__state',
                ),
            );

        const trackImage = (image) => {
            if (!(image instanceof HTMLImageElement)) return;
            if (trackedImages.has(image)) return;
            if (!isRouteCriticalImage(image, normalizedPathname)) return;
            if (!image.currentSrc && !image.src) return;

            trackedImages.add(image);
            hasSeenCriticalImage = true;

            if (image.loading === "lazy") {
                image.loading = "eager";
            }
            if (!image.getAttribute("fetchpriority")) {
                image.fetchPriority = "high";
            }
            if (!image.getAttribute("decoding")) {
                image.decoding = "async";
            }

            const imageSource = String(image.currentSrc || image.src || "").toLowerCase();
            const isSvgAsset =
                imageSource.includes(".svg") ||
                imageSource.startsWith("data:image/svg+xml");

            if (image.complete && (image.naturalWidth > 0 || isSvgAsset)) {
                revealWhenSettled();
                return;
            }

            pendingImagesCount += 1;

            const finishImage = () => {
                image.removeEventListener("load", finishImage);
                image.removeEventListener("error", finishImage);
                pendingImagesCount = Math.max(0, pendingImagesCount - 1);
                if (pendingImagesCount === 0) {
                    revealWhenSettled();
                }
            };

            cleanupImageListeners.add(() => {
                image.removeEventListener("load", finishImage);
                image.removeEventListener("error", finishImage);
            });
            image.addEventListener("load", finishImage);
            image.addEventListener("error", finishImage);
        };

        const scanCriticalImages = () => {
            const images = contentNode.querySelectorAll("img");
            images.forEach(trackImage);

            if (hasSeenCriticalImage) {
                if (pendingImagesCount === 0) {
                    revealWhenSettled();
                }
                return;
            }

            if (!hasLoadingIndicator()) {
                revealWhenSettled();
            }
        };

        const observer = new MutationObserver(() => {
            if (isCancelled) return;
            scanCriticalImages();
        });

        observer.observe(contentNode, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["src", "srcset", "loading", "fetchpriority"],
        });

        const rafId = window.requestAnimationFrame(() => {
            if (isCancelled) return;
            scanCriticalImages();
        });
        const followupScanId = window.setTimeout(() => {
            if (isCancelled) return;
            scanCriticalImages();
        }, 90);
        const lateFollowupScanId = window.setTimeout(() => {
            if (isCancelled) return;
            scanCriticalImages();
        }, 220);

        return () => {
            isCancelled = true;
            window.clearTimeout(revealFallbackTimer);
            window.cancelAnimationFrame(rafId);
            window.clearTimeout(followupScanId);
            window.clearTimeout(lateFollowupScanId);
            clearSettleTimer();
            observer.disconnect();
            cleanupImageListeners.forEach((cleanup) => cleanup());
            cleanupImageListeners.clear();
        };
    }, [normalizedPathname]);

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
                <div
                    className={`route-viewport ${
                        isRouteAssetsReady ? "is-ready" : "is-loading"
                    }`}
                >
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

                    {!isRouteAssetsReady ? (
                        <div
                            className="route-asset-placeholder"
                            aria-hidden="true"
                        />
                    ) : null}
                </div>
                <MobileCTA />
            </div>
            <Footer />
            <CookieBanner />
        </>
    );
}

export default App;
