
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    BookOpen,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ArrowRight,
    Sparkles,
    ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const email = formData.email.trim();

        if (!email || !formData.password) {
            toast.error("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            await login({
                email,
                password: formData.password,
            });

            toast.success("Welcome back to StudyNook!");

            const destination = location.state?.from;

            navigate(
                typeof destination === "string" && destination.startsWith("/")
                    ? destination
                    : "/",
                { replace: true }
            );
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Login failed. Please check your credentials.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f8f7] px-4 py-10 sm:px-6 lg:py-16">

            {/* Animated background decoration */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-80 w-80 animate-[float_9s_ease-in-out_infinite] rounded-full bg-teal-200/40 blur-3xl" />
                <div className="absolute -bottom-36 -right-24 h-96 w-96 animate-[float_12s_ease-in-out_infinite] rounded-full bg-cyan-200/40 blur-3xl [animation-delay:1.5s]" />
                <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/30 blur-3xl" />
            </div>

            <div className="login-entrance relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_30px_100px_-35px_rgba(15,118,110,0.25)] md:min-h-[650px] md:grid-cols-[1fr_0.92fr]">

                {/* Left branding panel */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-[#073f3b] p-10 text-white md:flex lg:p-14">

                    {/* Decorative gradient shapes */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-700/50 via-transparent to-emerald-950/70" />
                    <div className="absolute -right-24 top-24 h-72 w-72 animate-[float_10s_ease-in-out_infinite] rounded-full border border-white/10 bg-teal-400/10" />
                    <div className="absolute -right-10 top-40 h-44 w-44 rounded-full border border-white/10" />
                    <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-teal-500/20 blur-2xl" />

                    {/* Brand */}
                    <Link
                        to="/"
                        className="group relative z-10 inline-flex w-fit items-center gap-3"
                    >
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-sm transition duration-300 group-hover:rotate-[-6deg] group-hover:bg-white/20">
                            <BookOpen size={25} strokeWidth={1.8} />
                        </span>

                        <span className="text-2xl font-bold tracking-tight">
                            Study<span className="text-teal-300">Nook</span>
                        </span>
                    </Link>

                    {/* Main content */}
                    <div className="relative z-10 my-10 max-w-lg">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-white/10 px-4 py-2 text-sm font-medium text-teal-100 backdrop-blur-sm">
                            <Sparkles size={15} className="text-teal-300" />
                            Your space to grow
                        </div>

                        <h1 className="text-4xl font-bold leading-[1.2] tracking-tight lg:text-5xl">
                            Make room for
                            <span className="mt-2 block bg-gradient-to-r from-teal-200 to-emerald-300 bg-clip-text text-transparent">
                                your next big idea.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-md text-base leading-8 text-teal-100/80 lg:text-lg">
                            Your learning journey deserves the right space.
                            Sign in to discover study rooms, manage bookings,
                            and focus on what matters.
                        </p>

                        {/* Decorative book illustration */}
                        <div className="relative mt-10 flex h-36 items-end gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] px-6 pt-5 backdrop-blur-sm">
                            <div className="absolute right-5 top-4 text-xs font-medium tracking-widest text-teal-200/70">
                                LEARN · FOCUS · GROW
                            </div>

                            <div className="h-20 w-10 animate-[float_5s_ease-in-out_infinite] rounded-t-lg border border-white/10 bg-gradient-to-b from-teal-300 to-teal-600 shadow-lg" />
                            <div className="h-28 w-12 animate-[float_6s_ease-in-out_infinite] rounded-t-lg border border-white/10 bg-gradient-to-b from-amber-200 to-amber-500 shadow-lg [animation-delay:0.5s]" />
                            <div className="h-24 w-10 animate-[float_7s_ease-in-out_infinite] rounded-t-lg border border-white/10 bg-gradient-to-b from-emerald-200 to-emerald-500 shadow-lg [animation-delay:1s]" />
                            <div className="h-32 w-12 animate-[float_5.5s_ease-in-out_infinite] rounded-t-lg border border-white/10 bg-gradient-to-b from-cyan-200 to-cyan-500 shadow-lg [animation-delay:0.7s]" />
                            <div className="h-[4.5rem] w-10 rounded-t-lg border border-white/10 bg-gradient-to-b from-rose-200 to-rose-400 shadow-lg" />

                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400" />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                        <p className="text-sm text-teal-100/70">
                            Find your space. Focus on your goals.
                        </p>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5">
                            <ArrowRight size={18} className="text-teal-200" />
                        </div>
                    </div>
                </div>

                {/* Right login form */}
                <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

                    <div className="w-full max-w-md">

                        {/* Mobile brand */}
                        <Link
                            to="/"
                            className="group mb-10 inline-flex items-center gap-3 md:hidden"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-800 text-white shadow-lg shadow-teal-900/20 transition duration-300 group-hover:-rotate-6">
                                <BookOpen size={23} />
                            </span>

                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                Study<span className="text-teal-700">Nook</span>
                            </span>
                        </Link>

                        {/* Heading */}
                        <div className="form-entrance">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-800 ring-1 ring-teal-100">
                                <LockKeyhole size={25} strokeWidth={1.8} />
                            </div>

                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
                                Welcome back
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Sign in to
                                <span className="block text-teal-800">
                                    StudyNook.
                                </span>
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                                Pick up where you left off. Your next great
                                study session is waiting.
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="form-entrance mt-9 space-y-6 [animation-delay:150ms]"
                        >
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2.5 block text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>

                                <div className="input-focus-group relative">
                                    <Mail
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2.5 flex items-center justify-between gap-3">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-slate-700"
                                    >
                                        Password
                                    </label>
                                </div>

                                <div className="input-focus-group relative">
                                    <LockKeyhole
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200"
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-12 pr-14 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((previous) => !previous)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-teal-800 px-5 font-semibold text-white shadow-lg shadow-teal-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-xl hover:shadow-teal-900/20 focus:outline-none focus:ring-4 focus:ring-teal-600/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                                {loading ? (
                                    <>
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight
                                            size={18}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Registration link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500">
                                Don&apos;t have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-bold text-teal-800 underline decoration-teal-300/0 underline-offset-4 transition-all duration-200 hover:text-teal-600 hover:decoration-teal-500"
                                >
                                    Create account
                                </Link>
                            </p>
                        </div>

                        {/* Security note */}
                        <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-6 text-xs leading-5 text-slate-400">
                            <ShieldCheck size={16} className="shrink-0 text-teal-700" />
                            <span>Your account details are handled securely.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation styles */}
            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-12px);
                    }
                }

                @keyframes loginEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .login-entrance {
                    animation: loginEntrance 650ms cubic-bezier(0.2, 0.65, 0.3, 1) both;
                }

                .form-entrance {
                    animation: loginEntrance 700ms cubic-bezier(0.2, 0.65, 0.3, 1) both;
                }

                .input-focus-group:focus-within > svg {
                    color: #0f766e;
                }

                @media (prefers-reduced-motion: reduce) {
                    .login-entrance,
                    .form-entrance,
                    .input-focus-group,
                    [class*="animate-"] {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default Login;