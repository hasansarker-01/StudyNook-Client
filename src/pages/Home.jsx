
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BookOpen,
    Search,
    ShieldCheck,
    Clock,
    Users,
} from "lucide-react";

import api from "../services/api";
import RoomCard from "../components/RoomCard";
import LoadingSpinner from "../components/LoadingSpinner";

const features = [
    {
        icon: Search,
        title: "Easy Discovery",
        description:
            "Explore available study spaces and find one that fits your needs.",
    },
    {
        icon: Clock,
        title: "Flexible Booking",
        description:
            "Choose your preferred date and time for a focused study session.",
    },
    {
        icon: ShieldCheck,
        title: "Simple Management",
        description:
            "Manage your bookings and keep track of your study spaces in one place.",
    },
];

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch the latest six study rooms from the API.
    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/rooms");
            const data = response.data;

            const roomList = Array.isArray(data)
                ? data
                : data?.rooms ?? data?.data?.rooms ?? data?.data ?? [];

            const validRooms = Array.isArray(roomList) ? roomList : [];

            const latestRooms = [...validRooms]
                .sort(
                    (a, b) =>
                        new Date(b.createdAt || 0).getTime() -
                        new Date(a.createdAt || 0).getTime()
                )
                .slice(0, 6);

            setRooms(latestRooms);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load study rooms. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;

        const loadRooms = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/rooms");
                const data = response.data;

                const roomList = Array.isArray(data)
                    ? data
                    : data?.rooms ?? data?.data?.rooms ?? data?.data ?? [];

                const validRooms = Array.isArray(roomList) ? roomList : [];

                const latestRooms = [...validRooms]
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt || 0).getTime() -
                            new Date(a.createdAt || 0).getTime()
                    )
                    .slice(0, 6);

                if (active) {
                    setRooms(latestRooms);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load study rooms. Please try again later."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadRooms();

        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="overflow-hidden">
            {/* Hero section with four animated bubbles */}
            <section className="relative isolate overflow-hidden bg-gradient-to-br from-teal-100 via-white to-cyan-100">
                {/* Bubble 1 */}
                <div
                    aria-hidden="true"
                    className="sn-bubble sn-float left-[5%] top-24 h-20 w-20"
                />

                {/* Bubble 2 */}
                <div
                    aria-hidden="true"
                    className="sn-bubble sn-float-reverse right-[8%] top-16 h-32 w-32"
                    style={{ animationDelay: "1s" }}
                />

                {/* Bubble 3 */}
                <div
                    aria-hidden="true"
                    className="sn-bubble sn-pulse bottom-16 left-[38%] h-14 w-14"
                    style={{ animationDelay: "2s" }}
                />

                {/* Bubble 4 */}
                <div
                    aria-hidden="true"
                    className="sn-bubble sn-float right-[35%] top-1/2 h-10 w-10"
                    style={{ animationDelay: "1.5s" }}
                />

                {/* Large rotating decorative circles */}
                <div
                    aria-hidden="true"
                    className="sn-spin pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border border-teal-400/60"
                >
                    <div className="absolute left-10 top-10 h-5 w-5 rounded-full bg-teal-300/60" />
                </div>

                <div
                    aria-hidden="true"
                    className="sn-spin pointer-events-none absolute -bottom-36 -left-28 h-80 w-80 rounded-full border border-cyan-200/50"
                    style={{ animationDirection: "reverse", animationDuration: "32s" }}
                />

                {/* Hero content */}
                <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
                    {/* Hero text */}
                    <div className="relative">
                        <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/90 px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm backdrop-blur">
                            <BookOpen size={16} />
                            Your next great study session starts here
                        </span>

                        <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            Find Your Perfect{" "}
                            <span className="text-teal-700">
                                Study Space
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                            Discover a quiet, comfortable study room and book
                            your perfect space for focused learning. Make every
                            study session count with StudyNook.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                            <Link
                                to="/rooms"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 font-semibold text-white! shadow-lg shadow-teal-700/20 transition-all duration-300 hover:-translate-y-1 hover:bg-teal-800 hover:!text-white hover:shadow-xl"
                            >
                                Explore Rooms
                                <ArrowRight
                                    size={19}
                                    className="text-white transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>


                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-6 py-3.5 font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:bg-teal-50"
                            >
                                Get Started
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
                            <span className="flex items-center gap-2">
                                <ShieldCheck
                                    size={18}
                                    className="text-teal-700"
                                />
                                Simple booking
                            </span>

                            <span className="flex items-center gap-2">
                                <Users
                                    size={18}
                                    className="text-teal-700"
                                />
                                Spaces for different needs
                            </span>
                        </div>
                    </div>

                    {/* Animated workspace image */}
                    <div className="relative mx-auto w-full max-w-xl">
                        <div
                            aria-hidden="true"
                            className="sn-pulse absolute -left-5 top-8 h-32 w-32 rounded-full bg-teal-200/60 blur-3xl"
                        />

                        <div
                            aria-hidden="true"
                            className="sn-float-reverse absolute -right-5 bottom-8 h-40 w-40 rounded-full bg-cyan-200/60 blur-3xl"
                        />

                        {/* Decorative circular frame */}
                        <div
                            aria-hidden="true"
                            className="sn-spin absolute -right-3 -top-3 h-24 w-24 rounded-full border-2 border-dashed border-teal-300/70"
                        />

                        <div className="sn-float relative overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur-sm">
                            <img
                                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
                                alt="Bright and comfortable study workspace"
                                className="h-72 w-full rounded-2xl object-cover sm:h-96"
                            />

                            <div className="flex items-center gap-4 p-4 sm:p-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                    <BookOpen size={25} />
                                </div>

                                <div className="min-w-0">
                                    <p className="font-bold text-slate-900">
                                        Your space to focus
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Find a room. Book a time. Get studying.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Floating availability badge */}
                        <div className="sn-float-reverse absolute  -left-3 rounded-2xl border border-teal-100 bg-white px-4 py-3 shadow-xl sm:-left-6">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                                </span>
                                <span className=" text-sm font-semibold text-slate-700">
                                    Your next study session awaits
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured study rooms */}

            {/* Featured Study Rooms Section */}
            <section className="relative isolate overflow-hidden bg-gradient-to-br from-pink-50 via-white to-teal-50 py-16 sm:py-20">
                {/* Background animated bubbles */}
                <div
                    aria-hidden="true"
                    className="sn-bubble sn-float pointer-events-none left-[5%] top-16 h-20 w-20"
                />

                <div
                    aria-hidden="true"
                    className="sn-bubble sn-float-reverse pointer-events-none right-[8%] top-24 h-28 w-28"
                />

                <div
                    aria-hidden="true"
                    className="sn-bubble sn-pulse pointer-events-none bottom-20 left-1/3 h-14 w-14"
                />

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Section Heading and Button */}
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl">
                            <p className="inline-flex rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-bold uppercase tracking-widest text-teal-700 shadow-sm">
                                Explore Spaces
                            </p>

                            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                                Find Your{" "}
                                <span className="text-teal-700">
                                    Study Spot
                                </span>
                            </h2>

                            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                                Explore study rooms and choose a comfortable place
                                that works for your next session.
                            </p>
                        </div>

                        {/* Animated View All Rooms Button */}
                        <Link
                            to="/rooms"
                            className="group inline-flex w-fit shrink-0 items-center justify-center gap-3 rounded-xl bg-teal-700 px-6 py-3.5 font-bold text-white! shadow-lg shadow-teal-700/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-teal-800 hover:shadow-xl hover:shadow-teal-700/25 active:translate-y-0"
                        >
                            <span className="text-white!">
                                View All Rooms
                            </span>

                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/25">
                                <ArrowRight
                                    size={17}
                                    className="text-white"
                                />
                            </span>

                        </Link>

                    </div>

                    {/* Featured Rooms API Content */}
                    {loading ? (
                        <div className="mt-12 rounded-2xl border border-white bg-white/70 p-8 shadow-sm">
                            <LoadingSpinner message="Finding available study rooms..." />
                        </div>
                    ) : error ? (
                        <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                            <p className="font-medium text-red-700">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={fetchRooms}
                                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-lg active:translate-y-0"
                            >
                                Try Again
                                <ArrowRight size={17} />
                            </button>
                        </div>
                    ) : rooms.length > 0 ? (
                        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                            {rooms.map((room, index) => (
                                <div
                                    key={room._id}
                                    className="min-w-0 animate-[sn-card-in_0.6s_ease-out_both] transition-transform duration-300 hover:-translate-y-2"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <RoomCard room={room} />
                                </div>
                            ))}
                            <div
                                aria-hidden="true"
                                className="sn-bubble sn-float pointer-events-none left-[5%] top-16 h-20 w-20"
                            />
                        </div>
                    ) : (
                        <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-14 text-center shadow-sm backdrop-blur-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                                <BookOpen size={32} />
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-slate-900">
                                No Study Rooms Yet
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
                                Study rooms will appear here once they have been
                                added to the platform.
                            </p>

                            <Link
                                to="/rooms"
                                className="group mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white! shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-teal-800 hover:shadow-lg"
                            >
                                <span className="text-white!">Browse Rooms</span>
                                <ArrowRight
                                    size={17}
                                    className="text-white transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    )}
                    <div
                        aria-hidden="true"
                        className="sn-bubble right  sn-pulse pointer-events-none bottom-20 left-1/3 h-14 w-14"
                    />
                </div>
            </section>



            {/* Features section */}
            <section className="relative isolate overflow-hidden bg-green-100 py-16 sm:py-20">
                <div
                    aria-hidden="true"
                    className="sn-bubble sn-float -left-8 top-12 h-24 w-24"
                />

                <div
                    aria-hidden="true"
                    className="sn-bubble sn-float-reverse -right-8 bottom-10 h-32 w-32"
                />

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-bold uppercase tracking-widest text-teal-700">
                            Why StudyNook
                        </p>

                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                            A Better Way to Study
                        </h2>

                        <p className="mt-4 leading-7 text-slate-600">
                            Everything you need to find and manage your study
                            space in one convenient place.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {features.map(
                            ({ icon: Icon, title, description }, index) => (
                                <article
                                    key={title}
                                    className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/10"
                                    style={{
                                        animationDelay: `${index * 150}ms`,
                                    }}
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-teal-100">
                                        <Icon size={24} />
                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                                        {title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                        {description}
                                    </p>
                                </article>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* Call to action */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 to-teal-950 px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
                    {/* Decorative CTA circles */}
                    <div
                        aria-hidden="true"
                        className="sn-spin pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/15"
                    />

                    <div
                        aria-hidden="true"
                        className="sn-pulse pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-teal-400/10 blur-2xl"
                    />

                    <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                                Ready to find your perfect space?
                            </h2>

                            <p className="mt-3 max-w-2xl leading-7 text-teal-100">
                                Start exploring study rooms and make your next
                                learning session more productive.
                            </p>
                        </div>

                        <Link
                            to="/rooms"
                            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-teal-800 transition-all duration-300 hover:-translate-y-1 hover:bg-teal-50 hover:shadow-lg"
                        >
                            Find a Room
                            <ArrowRight
                                size={19}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
