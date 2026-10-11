
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    BookOpen,
    Menu,
    X,
    LogOut,
    UserRound,
    ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    // Navigation link styling with active and hover states.
    const navLinkClass = ({ isActive }) =>
        `group relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${isActive
            ? "bg-teal-50 !text-teal-800 shadow-sm ring-1 ring-teal-100"
            : "text-slate-600 hover:bg-teal-50 hover:!text-teal-800"
        }`;

    // Logout using the existing API and authentication context.
    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            await api.post("/auth/logout");
            setUser(null);
            setIsMenuOpen(false);
            toast.success("Logged out successfully");
            navigate("/");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to log out. Please try again."
            );
        } finally {
            setIsLoggingOut(false);
        }
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 border-b border-teal-100/80 bg-white/90 shadow-sm shadow-slate-900/5 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

                {/* Colorful animated logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="group flex shrink-0 items-center gap-3"
                    aria-label="StudyNook home"
                >
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 text-white shadow-lg shadow-teal-700/25 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105 group-hover:shadow-teal-700/40">
                        <BookOpen size={24} strokeWidth={2.2} />

                        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-amber-400" />
                    </span>

                    <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                        Study
                        <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                            Nook
                        </span>
                    </span>
                </Link>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-1 lg:flex">
                    <NavLink to="/" end className={navLinkClass}>
                        Home
                    </NavLink>

                    <NavLink to="/rooms" className={navLinkClass}>
                        Explore Rooms
                    </NavLink>

                    {user && (
                        <>
                            <NavLink to="/add-room" className={navLinkClass}>
                                Add Room
                            </NavLink>

                            <NavLink
                                to="/my-listings"
                                className={navLinkClass}
                            >
                                My Listings
                            </NavLink>

                            <NavLink
                                to="/my-bookings"
                                className={navLinkClass}
                            >
                                My Bookings
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Desktop authentication */}
                <div className="hidden shrink-0 items-center gap-3 md:flex">
                    {user ? (
                        <>
                            <div className="flex max-w-48 items-center gap-2 rounded-xl border border-teal-100 bg-teal-50/70 px-3 py-2">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-sm">
                                    <UserRound size={18} />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500">
                                        Welcome back
                                    </p>

                                    <p className="truncate text-sm font-bold text-slate-800">
                                        {user.name || user.email}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="group inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <LogOut
                                    size={17}
                                    className="transition-transform duration-300 group-hover:-translate-x-0.5"
                                />
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-xl border border-green-700 px-4 py-2.5 text-sm font-bold text-slate-700 transition-all duration-300 hover:bg-teal-50 hover:text-teal-800"
                            >
                                Sign In
                            </Link>

                            <Link
                                to="/register"
                                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-3 text-sm font-bold !text-white shadow-lg shadow-teal-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-teal-700/30"
                            >
                                <span className="!text-white">
                                    Get Started
                                </span>

                                <ArrowRight
                                    size={17}
                                    className="text-white transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 md:hidden ${isMenuOpen
                        ? "rotate-90 border-teal-200 bg-teal-50 text-teal-800"
                        : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                        }`}
                    aria-label={
                        isMenuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
                </button>
            </nav>

            {/* Animated mobile navigation */}
            <div
                className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden ${isMenuOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "pointer-events-none grid-rows-[0fr] opacity-0"
                    }`}
                aria-hidden={!isMenuOpen}
            >
                <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-teal-100 bg-gradient-to-b from-teal-50/70 to-white px-4 py-4">
                        <div className="mx-auto flex max-w-7xl flex-col gap-2">

                            <NavLink
                                to="/"
                                end
                                onClick={closeMenu}
                                className={navLinkClass}
                                tabIndex={isMenuOpen ? 0 : -1}
                            >
                                Home
                            </NavLink>

                            <NavLink
                                to="/rooms"
                                onClick={closeMenu}
                                className={navLinkClass}
                                tabIndex={isMenuOpen ? 0 : -1}
                            >
                                Explore Rooms
                            </NavLink>

                            {user ? (
                                <>
                                    <NavLink
                                        to="/add-room"
                                        onClick={closeMenu}
                                        className={navLinkClass}
                                        tabIndex={isMenuOpen ? 0 : -1}
                                    >
                                        Add Room
                                    </NavLink>

                                    <NavLink
                                        to="/my-listings"
                                        onClick={closeMenu}
                                        className={navLinkClass}
                                        tabIndex={isMenuOpen ? 0 : -1}
                                    >
                                        My Listings
                                    </NavLink>

                                    <NavLink
                                        to="/my-bookings"
                                        onClick={closeMenu}
                                        className={navLinkClass}
                                        tabIndex={isMenuOpen ? 0 : -1}
                                    >
                                        My Bookings
                                    </NavLink>

                                    <div className="my-2 border-t border-teal-100" />

                                    <div className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-white p-3 shadow-sm">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                                            <UserRound size={20} />
                                        </span>

                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-slate-500">
                                                Signed in as
                                            </p>

                                            <p className="truncate text-sm font-bold text-slate-800">
                                                {user.name || user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="mt-1 flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition-all duration-300 hover:bg-red-100 disabled:opacity-50"
                                    >
                                        <LogOut size={17} />
                                        {isLoggingOut
                                            ? "Logging out..."
                                            : "Logout"}
                                    </button>
                                </>
                            ) : (
                                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-teal-100 pt-4">
                                    <Link
                                        to="/login"
                                        onClick={closeMenu}
                                        tabIndex={isMenuOpen ? 0 : -1}
                                        className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all duration-300 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                                    >
                                        Sign In
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={closeMenu}
                                        tabIndex={isMenuOpen ? 0 : -1}
                                        className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-3 text-sm font-bold !text-white shadow-md shadow-teal-700/20 transition-all duration-300 hover:from-teal-700 hover:to-cyan-700"
                                    >
                                        <span className="!text-white">
                                            Get Started
                                        </span>
                                        <ArrowRight
                                            size={16}
                                            className="text-white transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
