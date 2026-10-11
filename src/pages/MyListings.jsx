
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Pencil,
    Trash2,
    MapPin,
    Users,
    BookOpen,
    X,
    Save,
    LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";

const emptyForm = {
    name: "",
    description: "",
    image: "",
    floor: "",
    capacity: "",
    hourlyRate: "",
    amenities: [],
};

const availableAmenities = [
    "Wi-Fi",
    "Air Conditioning",
    "Power Outlets",
    "Whiteboard",
    "Projector",
    "Comfortable Seating",
    "Quiet Environment",
    "Natural Light",
];

const unwrapRooms = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.rooms)) return data.rooms;
    if (Array.isArray(data?.data?.rooms)) return data.data.rooms;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

const MyListings = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const [roomToDelete, setRoomToDelete] = useState(null);

    const fetchMyRooms = useCallback(async () => {
        try {
            setLoading(true);
            setPageError("");

            // The backend should return only rooms owned by the signed-in user.
            const response = await api.get("/rooms");
            const allRooms = unwrapRooms(response.data);

            setRooms(allRooms);
        } catch (error) {
            setPageError(
                error.response?.data?.message ||
                "Could not load your room listings. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyRooms();
    }, [fetchMyRooms]);

    const openEditForm = (room) => {
        setEditingRoom(room);

        setFormData({
            name: room.name || "",
            description: room.description || "",
            image: room.image || "",
            floor: room.floor || "",
            capacity: String(room.capacity ?? ""),
            hourlyRate: String(room.hourlyRate ?? ""),
            amenities: Array.isArray(room.amenities) ? room.amenities : [],
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const closeEditForm = () => {
        if (saving) return;

        setEditingRoom(null);
        setFormData(emptyForm);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const toggleAmenity = (amenity) => {
        setFormData((previous) => ({
            ...previous,
            amenities: previous.amenities.includes(amenity)
                ? previous.amenities.filter((item) => item !== amenity)
                : [...previous.amenities, amenity],
        }));
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!editingRoom) return;

        const capacity = Number(formData.capacity);
        const hourlyRate = Number(formData.hourlyRate);

        if (!formData.name.trim() || !formData.description.trim()) {
            toast.error("Room name and description are required.");
            return;
        }

        if (!Number.isInteger(capacity) || capacity < 1) {
            toast.error("Capacity must be a whole number of at least 1.");
            return;
        }

        if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
            toast.error("Hourly rate must be greater than zero.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                image: formData.image.trim(),
                floor: formData.floor.trim(),
                capacity,
                hourlyRate,
                amenities: formData.amenities,
            };

            const response = await api.put(
                `/rooms/${editingRoom._id}`,
                payload
            );

            const updatedRoom =
                response.data?.room ||
                response.data?.data?.room ||
                response.data?.data;

            setRooms((previous) =>
                previous.map((room) =>
                    room._id === editingRoom._id
                        ? updatedRoom && updatedRoom._id
                            ? updatedRoom
                            : { ...room, ...payload }
                        : room
                )
            );

            setEditingRoom(null);
            setFormData(emptyForm);

            toast.success("Room updated successfully.");
            await fetchMyRooms();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Could not update this room."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!roomToDelete) return;

        const roomId = roomToDelete._id;

        try {
            setDeletingId(roomId);

            await api.delete(`/rooms/${roomId}`);

            setRooms((previous) =>
                previous.filter((room) => room._id !== roomId)
            );

            if (editingRoom?._id === roomId) {
                setEditingRoom(null);
                setFormData(emptyForm);
            }

            setRoomToDelete(null);
            toast.success("Room deleted successfully.");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Could not delete this room."
            );
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading your room listings..." />;
    }

    return (
        <section className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Page heading */}
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                            Room Management
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                            My Listings
                        </h1>

                        <p className="mt-3 text-slate-600">
                            Manage the study rooms you have listed on StudyNook.
                        </p>
                    </div>

                    <Link
                        to="/add-room"
                        className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 sm:self-auto"
                    >
                        <Plus size={19} />
                        Add New Room
                    </Link>
                </div>

                {/* Error state */}
                {pageError && (
                    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                        <p className="font-semibold text-red-800">{pageError}</p>

                        <button
                            type="button"
                            onClick={fetchMyRooms}
                            className="mt-3 font-semibold text-red-700 underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Edit form */}
                {editingRoom && (
                    <div className="mt-8 rounded-2xl border border-teal-200 bg-white p-5 shadow-sm sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Edit Room
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update the information for {editingRoom.name}.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditForm}
                                disabled={saving}
                                aria-label="Close edit form"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="mt-6 space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="edit-name"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Room name *
                                    </label>

                                    <input
                                        id="edit-name"
                                        name="name"
                                        required
                                        maxLength={100}
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="edit-image"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Image URL
                                    </label>

                                    <input
                                        id="edit-image"
                                        name="image"
                                        type="url"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="edit-description"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Description *
                                    </label>

                                    <textarea
                                        id="edit-description"
                                        name="description"
                                        rows={4}
                                        required
                                        maxLength={2000}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="edit-floor"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Floor / Location
                                    </label>

                                    <input
                                        id="edit-floor"
                                        name="floor"
                                        value={formData.floor}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="edit-capacity"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Capacity *
                                    </label>

                                    <input
                                        id="edit-capacity"
                                        name="capacity"
                                        type="number"
                                        min="1"
                                        step="1"
                                        required
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="edit-hourlyRate"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Hourly rate (USD) *
                                    </label>

                                    <input
                                        id="edit-hourlyRate"
                                        name="hourlyRate"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        required
                                        value={formData.hourlyRate}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="mb-3 text-sm font-semibold text-slate-700">
                                    Amenities
                                </p>

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {availableAmenities.map((amenity) => (
                                        <label
                                            key={amenity}
                                            className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 hover:border-teal-300"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.amenities.includes(amenity)}
                                                onChange={() => toggleAmenity(amenity)}
                                                className="h-4 w-4 accent-teal-700"
                                            />

                                            {amenity}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeEditForm}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                                >
                                    {saving ? (
                                        <LoaderCircle size={19} className="animate-spin" />
                                    ) : (
                                        <Save size={19} />
                                    )}
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Room list */}
                {!pageError && rooms.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <BookOpen className="mx-auto h-14 w-14 text-teal-700" />

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            No room listings yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-slate-500">
                            You haven't added a study room yet. Create your first listing to
                            get started.
                        </p>

                        <Link
                            to="/add-room"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
                        >
                            <Plus size={18} />
                            Add Your First Room
                        </Link>
                    </div>
                ) : (
                    !pageError && (
                        <>
                            <div className="mt-8 flex items-center justify-between">
                                <p className="text-sm text-slate-600">
                                    Your listings:{" "}
                                    <span className="font-bold text-slate-900">
                                        {rooms.length}
                                    </span>
                                </p>
                            </div>

                            <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {rooms.map((room) => (
                                    <article
                                        key={room._id}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                                    >
                                        {room.image ? (
                                            <img
                                                src={room.image}
                                                alt={room.name}
                                                className="h-48 w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-48 items-center justify-center bg-teal-50">
                                                <BookOpen className="h-14 w-14 text-teal-300" />
                                            </div>
                                        )}

                                        <div className="p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <h2 className="text-lg font-bold text-slate-900">
                                                    {room.name}
                                                </h2>

                                                <p className="shrink-0 text-lg font-bold text-teal-800">
                                                    ${Number(room.hourlyRate || 0).toFixed(2)}
                                                    <span className="text-xs font-normal text-slate-500">
                                                        /hr
                                                    </span>
                                                </p>
                                            </div>

                                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                                                {room.description || "No description available."}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                                                {room.floor && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin size={15} />
                                                        {room.floor}
                                                    </span>
                                                )}

                                                <span className="inline-flex items-center gap-1">
                                                    <Users size={15} />
                                                    {room.capacity ?? "—"} people
                                                </span>
                                            </div>

                                            {Array.isArray(room.amenities) &&
                                                room.amenities.length > 0 && (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {room.amenities.slice(0, 3).map((amenity) => (
                                                            <span
                                                                key={amenity}
                                                                className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800"
                                                            >
                                                                {amenity}
                                                            </span>
                                                        ))}

                                                        {room.amenities.length > 3 && (
                                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                                                +{room.amenities.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditForm(room)}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 px-3 py-2.5 text-sm font-semibold text-teal-800 transition hover:bg-teal-50"
                                                >
                                                    <Pencil size={16} />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setRoomToDelete(room)}
                                                    disabled={deletingId === room._id}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    {deletingId === room._id ? (
                                                        <LoaderCircle size={16} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    )
                )}
            </div>

            <ConfirmModal
                isOpen={Boolean(roomToDelete)}
                title="Delete this room?"
                message={`Are you sure you want to delete "${roomToDelete?.name || "this room"}"? This action cannot be undone.`}
                confirmText="Delete Room"
                cancelText="Keep Room"
                isLoading={Boolean(deletingId)}
                variant="danger"
                onCancel={() => {
                    if (!deletingId) setRoomToDelete(null);
                }}
                onConfirm={handleDelete}
            />
        </section>
    );
};

export default MyListings;
