
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    MapPin,
    Users,
    CheckCircle2,
    BookOpen,
    Send,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const getLocalDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getRoomFromResponse = (data) => {
    if (data?.room) return data.room;
    if (data?.data?.room) return data.data.room;
    if (data?.data && !Array.isArray(data.data)) return data.data;
    return data;
};

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        date: getLocalDate(),
        startTime: "09:00",
        endTime: "10:00",
        specialNote: "",
    });

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/rooms/${id}`);
                const roomData = getRoomFromResponse(response.data);

                if (!roomData?._id) {
                    throw new Error("Room information was not found.");
                }

                setRoom(roomData);
            } catch (err) {
                const message =
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load room details.";

                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const startMinutes = formData.startTime
        ? Number(formData.startTime.split(":")[0]) * 60 +
        Number(formData.startTime.split(":")[1])
        : 0;

    const endMinutes = formData.endTime
        ? Number(formData.endTime.split(":")[0]) * 60 +
        Number(formData.endTime.split(":")[1])
        : 0;

    const durationHours =
        startMinutes > 0 || endMinutes > 0
            ? (endMinutes - startMinutes) / 60
            : 0;

    const estimatedCost =
        durationHours > 0
            ? durationHours * Number(room?.hourlyRate || 0)
            : 0;

    const handleBooking = async (event) => {
        event.preventDefault();

        if (!user) {
            toast.error("Please sign in to book this room.");
            navigate("/login", {
                state: { from: `/rooms/${id}` },
            });
            return;
        }

        if (!formData.date || !formData.startTime || !formData.endTime) {
            toast.error("Please select a date, start time, and end time.");
            return;
        }

        if (formData.date < getLocalDate()) {
            toast.error("Please select today or a future date.");
            return;
        }

        if (endMinutes <= startMinutes) {
            toast.error("End time must be later than start time.");
            return;
        }

        try {
            setBookingLoading(true);

            await api.post("/bookings", {
                roomId: room._id,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                specialNote: formData.specialNote.trim(),
            });

            toast.success("Room booked successfully!");

            navigate("/my-bookings");
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Booking failed. Please try again.";

            toast.error(message);
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading room details..." />;
    }

    if (error || !room) {
        return (
            <section className="mx-auto max-w-3xl px-4 py-20 text-center">
                <div className="rounded-2xl border border-red-100 bg-red-50 p-8">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-red-500" />

                    <h1 className="text-2xl font-bold text-slate-900">
                        Room Not Found
                    </h1>

                    <p className="mt-3 text-slate-600">
                        {error || "This room may have been removed or is unavailable."}
                    </p>

                    <Link
                        to="/rooms"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800"
                    >
                        <ArrowLeft size={18} />
                        Back to Rooms
                    </Link>
                </div>
            </section>
        );
    }

    const ownerName =
        room.owner && typeof room.owner === "object"
            ? room.owner.name
            : null;

    const amenities = Array.isArray(room.amenities)
        ? room.amenities
        : [];

    return (
        <section className="bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    to="/rooms"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
                >
                    <ArrowLeft size={18} />
                    Back to all rooms
                </Link>

                <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Room information */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {room.image ? (
                            <img
                                src={room.image}
                                alt={room.name || "Study room"}
                                className="h-64 w-full object-cover sm:h-96"
                            />
                        ) : (
                            <div className="flex h-64 items-center justify-center bg-teal-50 sm:h-96">
                                <BookOpen className="h-20 w-20 text-teal-300" />
                            </div>
                        )}

                        <div className="p-5 sm:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-teal-700">
                                        StudyNook Study Space
                                    </p>

                                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                        {room.name}
                                    </h1>
                                </div>

                                <div className="rounded-xl bg-teal-50 px-4 py-3 text-right">
                                    <p className="text-2xl font-bold text-teal-800">
                                        ${Number(room.hourlyRate || 0).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-slate-600">per hour</p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <MapPin className="mb-2 h-5 w-5 text-teal-700" />
                                    <p className="text-xs text-slate-500">Floor</p>
                                    <p className="mt-1 font-semibold text-slate-800">
                                        {room.floor || "Not specified"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <Users className="mb-2 h-5 w-5 text-teal-700" />
                                    <p className="text-xs text-slate-500">Capacity</p>
                                    <p className="mt-1 font-semibold text-slate-800">
                                        {room.capacity || "Not specified"}
                                    </p>
                                </div>

                                <div className="col-span-2 rounded-xl bg-slate-50 p-4 sm:col-span-1">
                                    <CalendarDays className="mb-2 h-5 w-5 text-teal-700" />
                                    <p className="text-xs text-slate-500">Bookings</p>
                                    <p className="mt-1 font-semibold text-slate-800">
                                        {room.bookingCount ?? 0}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-slate-900">
                                    About this room
                                </h2>

                                <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                                    {room.description || "No description available."}
                                </p>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Amenities
                                </h2>

                                {amenities.length > 0 ? (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {amenities.map((amenity, index) => (
                                            <span
                                                key={`${amenity}-${index}`}
                                                className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800"
                                            >
                                                <CheckCircle2 size={16} />
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-3 text-slate-500">
                                        No amenities listed.
                                    </p>
                                )}
                            </div>

                            {ownerName && (
                                <p className="mt-8 border-t border-slate-100 pt-5 text-sm text-slate-500">
                                    Listed by{" "}
                                    <span className="font-semibold text-slate-700">
                                        {ownerName}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Booking form */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:sticky lg:top-24">
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-teal-700">
                                RESERVE YOUR SPACE
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                Book this room
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Choose your date and study hours to request a booking.
                            </p>
                        </div>

                        <form onSubmit={handleBooking} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="date"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Booking date
                                </label>

                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    min={getLocalDate()}
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="startTime"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Start time
                                    </label>

                                    <input
                                        id="startTime"
                                        name="startTime"
                                        type="time"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="endTime"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        End time
                                    </label>

                                    <input
                                        id="endTime"
                                        name="endTime"
                                        type="time"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>
                            </div>

                            {durationHours > 0 && (
                                <div className="rounded-xl bg-teal-50 p-4">
                                    <div className="flex items-center gap-2 text-sm text-teal-800">
                                        <Clock size={18} />
                                        <span>
                                            Estimated duration: {durationHours.toFixed(2)} hour(s)
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between border-t border-teal-100 pt-3">
                                        <span className="text-sm font-medium text-slate-600">
                                            Estimated total
                                        </span>

                                        <span className="text-xl font-bold text-teal-800">
                                            ${estimatedCost.toFixed(2)}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        Final price and availability are confirmed by the server.
                                    </p>
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="specialNote"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Special note{" "}
                                    <span className="font-normal text-slate-400">
                                        (optional)
                                    </span>
                                </label>

                                <textarea
                                    id="specialNote"
                                    name="specialNote"
                                    rows={3}
                                    maxLength={500}
                                    value={formData.specialNote}
                                    onChange={handleChange}
                                    placeholder="Any special requests?"
                                    className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                />
                            </div>

                            {!user && (
                                <p className="rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-800">
                                    Please sign in before submitting your booking.
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={bookingLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {bookingLoading ? (
                                    <>
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        {user ? "Confirm Booking" : "Sign In to Book"}
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs leading-5 text-slate-500">
                                Booking confirmation depends on room availability.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoomDetails;
