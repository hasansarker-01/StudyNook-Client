
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BookOpen,
    UserRound,
    Mail,
    Image as ImageIcon,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const initialForm = {
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
};

const Register = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const register = auth?.register;

    const [formData, setFormData] = useState(initialForm);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const passwordRules = [
        {
            label: "At least 6 characters",
            valid: formData.password.length >= 6,
        },
        {
            label: "One uppercase letter",
            valid: /[A-Z]/.test(formData.password),
        },
        {
            label: "One lowercase letter",
            valid: /[a-z]/.test(formData.password),
        },
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
            form: "",
        }));
    };

    const validateForm = () => {
        const nextErrors = {};

        if (!formData.name.trim()) {
            nextErrors.name = "Please enter your full name.";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            nextErrors.email = "Please enter a valid email address.";
        }

        if (!formData.photoURL.trim()) {
            nextErrors.photoURL = "Profile image URL is required.";
        } else {
            try {
                const imageUrl = new URL(formData.photoURL.trim());

                if (!["http:", "https:"].includes(imageUrl.protocol)) {
                    nextErrors.photoURL = "Use a valid HTTP or HTTPS image URL.";
                }
            } catch {
                nextErrors.photoURL = "Please enter a valid image URL.";
            }
        }

        if (!formData.password) {
            nextErrors.password = "Password is required.";
        } else if (
            formData.password.length < 6 ||
            !/[A-Z]/.test(formData.password) ||
            !/[a-z]/.test(formData.password)
        ) {
            nextErrors.password =
                "Use at least 6 characters with uppercase and lowercase letters.";
        }

        if (!formData.confirmPassword) {
            nextErrors.confirmPassword = "Please confirm your password.";
        } else if (formData.password !== formData.confirmPassword) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        if (!validateForm()) {
            toast.error("Please check the form and try again.");
            return;
        }

        if (typeof register !== "function") {
            toast.error("Registration service is unavailable. Please try again.");
            return;
        }

        setLoading(true);

        try {
            await register({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                photoURL: formData.photoURL.trim(),
                password: formData.password,
            });

            toast.success("Account created successfully!");
            navigate("/login", { replace: true });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Registration failed. Please try again.";

            setErrors((previous) => ({
                ...previous,
                form: message,
            }));

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full rounded-2xl border bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors[field]
            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border-emerald-100 focus:border-emerald-400 focus:ring-emerald-50"
        }`;

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-green-200 px-4 py-8 sm:px-6">
            {/* Soft round background decorations */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-100/70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-lime-100/70 blur-3xl" />
            <div className="pointer-events-none absolute right-[15%] top-10 h-10 w-10 rounded-full border-8 border-emerald-100" />
            <div className="pointer-events-none absolute bottom-20 left-[12%] h-5 w-5 rounded-full bg-lime-700" />

            <section className="relative grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-white bg-white/90 shadow-[0_24px_80px_rgba(16,91,56,0.10)] backdrop-blur-xl lg:grid-cols-[0.82fr_1.18fr]">
                {/* LEFT SIDE — small image and welcome message */}
                <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#e4f7e9] via-[#8cd39a] to-[#57bc57] p-8 lg:flex xl:p-10">
                    <div className="pointer-events-none absolute -right-14 top-20 h-48 w-48 rounded-full border-[24px] border-white/50" />
                    <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-emerald-100/70" />

                    <Link to="/" className="relative z-10 inline-flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                            <BookOpen size={23} />
                        </span>
                        <span className="text-xl font-extrabold tracking-tight text-slate-800">
                            Study<span className="text-emerald-600">Nook</span>
                        </span>
                    </Link>

                    <div className="relative z-10 my-8">
                        {/* Small rounded study image */}
                        <div className="relative mx-auto w-full max-w-[270px]">
                            <div className="absolute -left-4 top-8 h-16 w-16 rounded-full bg-lime-200/80" />
                            <div className="absolute -right-3 bottom-7 h-12 w-12 rounded-full bg-emerald-200/80" />

                            <div className="relative overflow-hidden rounded-[28px] border-[6px] border-white shadow-xl shadow-emerald-900/10">
                                <img
                                    src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=700&q=80"
                                    alt="A peaceful library filled with books"
                                    className="h-[220px] w-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/40 bg-white/90 p-3 backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                            <BookOpen size={20} />
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">
                                                Your study space
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Learn, focus, and grow.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -right-5 -top-5 flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white bg-lime-300 text-emerald-800 shadow-md">
                                <Sparkles size={21} />
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-800 xl:text-[34px]">
                                Make room for
                                <span className="mt-1 block text-emerald-600">
                                    better learning.
                                </span>
                            </h1>
                            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-blue-100">
                                Create your account and find a comfortable place to focus on
                                what matters.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                        <span className="h-2 w-2 rounded-full" />
                        A calmer way to study
                    </div>
                </aside>

                {/* RIGHT SIDE — registration form */}
                <div className="px-5 py-7 sm:px-9 sm:py-9 lg:px-10 xl:px-12 xl:py-10">
                    {/* Mobile brand */}
                    <Link to="/" className="mb-7 inline-flex items-center gap-2 lg:hidden">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                            <BookOpen size={21} />
                        </span>
                        <span className="text-xl font-extrabold text-slate-800">
                            Study<span className="text-emerald-600">Nook</span>
                        </span>
                    </Link>

                    <div className="mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <Sparkles size={14} />
                            Start your journey
                        </span>

                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-[34px]">
                            Create account
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Join StudyNook and make your next study session count.
                        </p>
                    </div>

                    {errors.form && (
                        <div
                            role="alert"
                            className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                        >
                            {errors.form}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        {/* Full name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                                Full name
                            </label>
                            <div className="relative">
                                <UserRound
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    aria-invalid={Boolean(errors.name)}
                                    className={inputClass("name")}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    aria-invalid={Boolean(errors.email)}
                                    className={inputClass("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Profile image URL */}
                        <div>
                            <label
                                htmlFor="photoURL"
                                className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                                Profile image URL
                            </label>
                            <div className="relative">
                                <ImageIcon
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="photoURL"
                                    name="photoURL"
                                    type="url"
                                    autoComplete="url"
                                    placeholder="https://example.com/photo.jpg"
                                    value={formData.photoURL}
                                    onChange={handleChange}
                                    aria-invalid={Boolean(errors.photoURL)}
                                    className={inputClass("photoURL")}
                                />
                            </div>
                            {errors.photoURL && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.photoURL}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    aria-invalid={Boolean(errors.password)}
                                    className={`${inputClass("password")} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((previous) => !previous)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}

                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                                {passwordRules.map((rule) => (
                                    <span
                                        key={rule.label}
                                        className={`inline-flex items-center gap-1 text-[11px] ${rule.valid ? "text-emerald-700" : "text-slate-400"
                                            }`}
                                    >
                                        <CheckCircle2 size={12} />
                                        {rule.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                                Confirm password
                            </label>
                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Enter your password again"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    aria-invalid={Boolean(errors.confirmPassword)}
                                    className={`${inputClass("confirmPassword")} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword((previous) => !previous)
                                    }
                                    aria-label={
                                        showConfirmPassword ? "Hide password" : "Show password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/25 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                            {loading ? "Creating account..." : "Create my account"}
                            {!loading && (
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-bold text-emerald-700 transition hover:text-emerald-800 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>

                    <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
                        By creating an account, you agree to use StudyNook responsibly.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Register;
