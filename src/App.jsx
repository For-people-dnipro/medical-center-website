import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import Footer from "./components/Footer/Footer";

function App() {
    const location = useLocation();
    const [isLoaderVisible, setIsLoaderVisible] = useState(true);
    const [isLoaderExiting, setIsLoaderExiting] = useState(false);

    useEffect(() => {
        const showTimer = window.setTimeout(() => {
            setIsLoaderExiting(true);
        }, 1500);

        return () => window.clearTimeout(showTimer);
    }, []);

    useEffect(() => {
        const setBlankTarget = (anchor) => {
            const href = anchor.getAttribute("href") || "";

            if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
                return;
            }

            anchor.setAttribute("target", "_blank");
            anchor.setAttribute("rel", "noopener noreferrer");
        };

        const updateAnchors = (root = document) => {
            root.querySelectorAll("a[href]").forEach(setBlankTarget);
        };

        updateAnchors();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return;

                    if (node.matches("a[href]")) {
                        setBlankTarget(node);
                    }

                    updateAnchors(node);
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [location.pathname, isLoaderVisible]);

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
                <div className="page-fade" key={location.pathname}>
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
                        <Route path="/check-up" element={<TestPage />} />
                        <Route path="/air-alert" element={<AirAlertPage />} />
                        <Route path="/branches" element={<BranchesPage />} />
                        <Route path="/analyses" element={<AnalysesPage />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </div>
                <MobileCTA />
            </div>
            <Footer />
        </>
    );
}

export default App;
