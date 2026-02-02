import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import AllServices from "./pages/AllServices";
import Header from "./sections/Header";
import MobileCTA from "./components/MobileCTA/MobileCTA";
import "./styles/pageTransitions.css";

function App() {
    const location = useLocation();

    return (
        <>
            <Header />
            <div className="page-fade" key={location.pathname}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<AllServices />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </div>
            <MobileCTA />
        </>
    );
}

export default App;
