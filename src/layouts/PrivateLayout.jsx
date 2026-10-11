
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const PrivateLayout = () => {
    const { user, authLoading } = useAuth();
    const location = useLocation();

    // Wait for the backend to verify the login session.
    if (authLoading) {
        return (
            <div className="flex min-h-screen flex-col bg-white">
                <Navbar />
                <main className="flex flex-1 items-center justify-center">
                    <LoadingSpinner message="Checking your login session..." />
                </main>
                <Footer />
            </div>
        );
    }

    // Redirect unauthenticated users to the login page.
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default PrivateLayout;
