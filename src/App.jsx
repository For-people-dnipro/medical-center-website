import { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
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
import AirAlertPage from "./pages/AirAlertPage/AirAlertPage";
import BranchesPage from "./pages/BranchesPage/BranchesPage";
import AnalysesPage from "./pages/AnalysesPage/AnalysesPage";
import VacanciesPage from "./pages/VacanciesPage/VacanciesPage";
import NewsPage from "./pages/NewsPage/NewsPage";
import NewsArticlePage from "./pages/NewsArticlePage/NewsArticlePage";
import DoctorsPage from "./pages/DoctorsPage/DoctorsPage";
import DoctorProfilePage from "./pages/DoctorProfilePage/DoctorProfilePage";
import Footer from "./components/Footer/Footer";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import {
    hasAnalyticsConsent,
    initializeGoogleAnalytics,
    trackPageView,
} from "./lib/analytics";

function App() {
    const location = useLocation();
    const trackedPathRef = useRef("");
    const [isLoaderVisible, setIsLoaderVisible] = useState(true);
    const [isLoaderExiting, setIsLoaderExiting] = useState(false);
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

    useEffect(() => {
        const showTimer = window.setTimeout(() => {
            setIsLoaderExiting(true);
        }, 1500);

        return () => window.clearTimeout(showTimer);
    }, []);

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

    const shouldSkipPageTransition =
        location.state?.skipPageTransition === true;

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
                    className={shouldSkipPageTransition ? "" : "page-fade"}
                    key={location.pathname}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
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
                            path="/check-up"
                            element={<Navigate to="/checkup" replace />}
                        />
                        <Route path="/air-alert" element={<AirAlertPage />} />
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
                        <Route path="*" element={<Home />} />
                    </Routes>
                </div>
                <MobileCTA />
            </div>
            <Footer />
            <CookieBanner />
        </>
    );
}

export default App;
