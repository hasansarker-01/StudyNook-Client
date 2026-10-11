
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PublicLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            {/* Shared navigation */}
            <Navbar />

            {/* Current page content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Shared footer */}
            <Footer />
        </div>
    );
};

export default PublicLayout;
