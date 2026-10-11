
import { Link } from "react-router-dom";
import { BookOpen, Mail, MapPin, ArrowUpRight } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white">
                                <BookOpen size={24} />
                            </span>

                            <span className="text-2xl font-bold tracking-tight text-white">
                                Study<span className="text-teal-400">Nook</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                            Find your perfect study space. Discover comfortable, quiet
                            rooms designed to help you focus, learn, and achieve more.
                        </p>

                        <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                            <MapPin size={17} className="shrink-0 text-teal-400" />
                            Your space for focused learning
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                            Quick Links
                        </h2>

                        <ul className="mt-5 space-y-3 text-sm">
                            <li>
                                <Link
                                    to="/"
                                    className="transition hover:text-teal-400"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/rooms"
                                    className="transition hover:text-teal-400"
                                >
                                    Explore Rooms
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/add-room"
                                    className="transition hover:text-teal-400"
                                >
                                    List a Study Room
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/my-bookings"
                                    className="transition hover:text-teal-400"
                                >
                                    My Bookings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                            Get in Touch
                        </h2>

                        <p className="mt-5 text-sm leading-6 text-slate-400">
                            Have questions about finding or listing a study room?
                        </p>

                        <a
                            href="mailto:support@studynook.com"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal-400 transition hover:text-teal-300"
                        >
                            <Mail size={17} />
                            Contact Support
                            <ArrowUpRight size={15} />
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-slate-500">
                        © {currentYear} StudyNook. All rights reserved.
                    </p>

                    <Link
                        to="/rooms"
                        className="inline-flex items-center gap-2 text-slate-400 transition hover:text-teal-400"
                    >
                        Find your study space
                        <ArrowUpRight size={15} />
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
