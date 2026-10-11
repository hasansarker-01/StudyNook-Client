
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    CalendarDays,
    Clock,
    MapPin,
    Users,
    BookOpen,
    XCircle,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";

const unwrapBookings = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.bookings)) return data.bookings;
    if (Array.isArray(data?.data?.bookings)) return data.data.bookings;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";

    const date = new Date(`${String(dateString).slice(0, 10)}T12:00:00`);

    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatTime = (time) => {
    if (!time) return "—";

    const [hours, minutes] = String(time).split(":").map(Number);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return time;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
};

const getRoom = (booking) => {
    if (booking.roomId && typeof booking.roomId === "object") {
        return booking.roomId;
    }

    if (booking.room && typeof booking.room === "object") {
        return booking.room;
    }

    return null;
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [filter, setFilter] = useState("all");
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setPageError("");

            const response = await api.get("/bookings/my");
            setBookings(unwrapBookings(response.data));
        } catch (error) {
            setPageError(
                error.response?.data?.message ||
                "Could not load your bookings. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleCancel = async () => {
        if (!bookingToCancel) return;

        const bookingId = bookingToCancel._id;

        try {
            setCancellingId(bookingId);

            await api.patch(`/bookings/${bookingId}/cancel`);

            setBookings((previous) =>
                previous.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status: "cancelled" }
                        : booking
                )
            );

            setBookingToCancel(null);
            toast.success("Booking cancelled successfully.");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to cancel this booking."
            );
        } finally {
            setCancellingId(null);
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const status = String(booking.status || "confirmed").toLowerCase();

        if (filter === "upcoming") {
            return status === "confirmed";
        }

        if (filter === "cancelled") {
            return status === "cancelled";
        }

        return true;
    });

    const confirmedCount = bookings.filter(
        (booking) => String(booking.status).toLowerCase() === "confirmed"
    ).length;

    if (loading) {
        return <LoadingSpinner message="Loading your bookings..." />;
    }

    return (
        <section className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Heading */}
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                            Your Study Schedule
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                            My Bookings
                        </h1>

                        <p className="mt-3 text-slate-600">
                            View and manage your StudyNook room reservations.
                        </p>
                    </div>

                    <Link
                        to="/rooms"
                        className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 sm:self-auto"
                    >
                        <BookOpen size={19} />
                        Explore Rooms
                    </Link>
                </div>

                {/* Summary cards */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                                <CalendarDays size={22} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">Total Bookings</p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {bookings.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                                <Clock size={22} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">Confirmed Bookings</p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {confirmedCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and refresh */}
                <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: "all", label: "All Bookings" },
                            { value: "upcoming", label: "Confirmed" },
                            { value: "cancelled", label: "Cancelled" },
                        ].map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setFilter(item.value)}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === item.value
                                        ? "bg-teal-700 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-800"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={fetchBookings}
                        className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:self-auto"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {/* Error state */}
                {pageError && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                        <p className="font-semibold text-red-800">{pageError}</p>

                        <button
                            type="button"
                            onClick={fetchBookings}
                            className="mt-3 font-semibold text-red-700 underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Booking cards */}
                {!pageError && filteredBookings.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <CalendarDays className="mx-auto h-14 w-14 text-teal-700" />

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            {bookings.length === 0
                                ? "No bookings yet"
                                : "No bookings in this category"}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-slate-500">
                            {bookings.length === 0
                                ? "Explore available study rooms and book a space for your next study session."
                                : "Try another filter to view your other bookings."}
                        </p>

                        {bookings.length === 0 && (
                            <Link
                                to="/rooms"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
                            >
                                <BookOpen size={18} />
                                Find a Study Room
                            </Link>
                        )}
                    </div>
                ) : (
                    !pageError && (
                        <div className="mt-6 grid gap-6 lg:grid-cols-2">
                            {filteredBookings.map((booking) => {
                                const room = getRoom(booking);
                                const status = String(
                                    booking.status || "confirmed"
                                ).toLowerCase();

                                const isCancelled = status === "cancelled";

                                return (
                                    <article
                                        key={booking._id}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                    >
                                        <div className="flex flex-col sm:flex-row">
                                            {/* Room image */}
                                            <div className="h-48 shrink-0 bg-teal-50 sm:h-auto sm:w-40">
                                                {room?.image ? (
                                                    <img
                                                        src={room.image}
                                                        alt={room.name || "Study room"}
                                                        className="h-full min-h-40 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full min-h-40 items-center justify-center">
                                                        <BookOpen className="h-12 w-12 text-teal-300" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1 p-5">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div>
                                                        <h2 className="text-lg font-bold text-slate-900">
                                                            {room?.name || "Study Room"}
                                                        </h2>

                                                        <p className="mt-1 text-sm text-slate-500">
                                                            Booking ID:{" "}
                                                            {booking._id
                                                                ? String(booking._id).slice(-8).toUpperCase()
                                                                : "—"}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${isCancelled
                                                                ? "bg-red-50 text-red-700"
                                                                : status === "confirmed"
                                                                    ? "bg-emerald-50 text-emerald-700"
                                                                    : "bg-amber-50 text-amber-700"
                                                            }`}
                                                    >
                                                        {status}
                                                    </span>
                                                </div>

                                                <div className="mt-5 space-y-3">
                                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                                        <CalendarDays
                                                            size={17}
                                                            className="shrink-0 text-teal-700"
                                                        />
                                                        <span>{formatDate(booking.date)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                                        <Clock
                                                            size={17}
                                                            className="shrink-0 text-teal-700"
                                                        />
                                                        <span>
                                                            {formatTime(booking.startTime)} –{" "}
                                                            {formatTime(booking.endTime)}
                                                        </span>
                                                    </div>

                                                    {room?.floor && (
                                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                                            <MapPin
                                                                size={17}
                                                                className="shrink-0 text-teal-700"
                                                            />
                                                            <span>{room.floor}</span>
                                                        </div>
                                                    )}

                                                    {room?.capacity && (
                                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                                            <Users
                                                                size={17}
                                                                className="shrink-0 text-teal-700"
                                                            />
                                                            <span>Capacity: {room.capacity} people</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {booking.specialNote && (
                                                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                                                        <p className="text-xs font-semibold text-slate-500">
                                                            Special note
                                                        </p>
                                                        <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
                                                            {booking.specialNote}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                                    <div>
                                                        <p className="text-xs text-slate-500">
                                                            Total cost
                                                        </p>
                                                        <p className="mt-1 text-xl font-bold text-teal-800">
                                                            $
                                                            {Number(booking.totalCost || 0).toFixed(2)}
                                                        </p>
                                                    </div>

                                                    {!isCancelled && status === "confirmed" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setBookingToCancel(booking)}
                                                            disabled={cancellingId === booking._id}
                                                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                                                        >
                                                            <XCircle size={17} />
                                                            Cancel Booking
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )
                )}
            </div>

            <ConfirmModal
                isOpen={Boolean(bookingToCancel)}
                title="Cancel this booking?"
                message="Are you sure you want to cancel this reservation? Please confirm before continuing."
                confirmText="Yes, Cancel Booking"
                cancelText="Keep Booking"
                variant="danger"
                isLoading={Boolean(cancellingId)}
                onCancel={() => {
                    if (!cancellingId) setBookingToCancel(null);
                }}
                onConfirm={handleCancel}
            />
        </section>
    );
};

export default MyBookings;
