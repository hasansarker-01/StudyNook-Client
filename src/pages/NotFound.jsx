
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

const NotFound = () => {
    return (
        <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
            <div className="w-full max-w-xl text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                    <BookOpen size={32} />
                </div>

                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
                    Error 404
                </p>

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    Page Not Found
                </h1>

                <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-600">
                    Sorry, we couldn't find the page you're looking for.
                    Let's get you back to finding your perfect study space.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    <Link
                        to="/rooms"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-700"
                    >
                        Explore Rooms
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
