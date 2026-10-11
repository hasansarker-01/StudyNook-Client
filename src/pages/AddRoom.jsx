
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    BookOpen,
    ImagePlus,
    MapPin,
    Users,
    DollarSign,
    ListChecks,
    LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialFormData = {
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

const AddRoom = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleAmenityChange = (amenity) => {
        setFormData((previous) => {
            const alreadySelected = previous.amenities.includes(amenity);

            return {
                ...previous,
                amenities: alreadySelected
                    ? previous.amenities.filter((item) => item !== amenity)
                    : [...previous.amenities, amenity],
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user) {
            toast.error("Please sign in before adding a room.");
            navigate("/login");
            return;
        }

        const hourlyRate = Number(formData.hourlyRate);
        const capacity = Number(formData.capacity);

        if (!formData.name.trim() || !formData.description.trim()) {
            toast.error("Please enter the room name and description.");
            return;
        }

        if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
            toast.error("Hourly rate must be greater than zero.");
            return;
        }

        if (!Number.isInteger(capacity) || capacity < 1) {
            toast.error("Capacity must be a whole number of at least 1.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                image: formData.image.trim(),
                floor: formData.floor.trim(),
                capacity,
                hourlyRate,
                amenities: formData.amenities,
            };

            await api.post("/rooms", payload);

            toast.success("Study room added successfully!");
            setFormData(initialFormData);
            navigate("/my-listings");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to add the room. Please try again.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <Link
                    to="/rooms"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
                >
                    <ArrowLeft size={18} />
                    Back to rooms
                </Link>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-teal-800 px-6 py-8 text-white sm:px-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                            <BookOpen size={26} />
                        </div>

                        <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
                            Add a Study Room
                        </h1>

                        <p className="mt-3 max-w-2xl leading-7 text-teal-100">
                            Share a comfortable learning space with students. Complete the
                            room details below to list it on StudyNook.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-10">
                        {/* Basic room information */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Basic Information
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Provide a clear name and description for your room.
                            </p>

                            <div className="mt-5 space-y-5">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Room name *
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        minLength={2}
                                        maxLength={100}
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Quiet Study Room A"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Description *
                                    </label>

                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={5}
                                        minLength={10}
                                        maxLength={2000}
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the room, atmosphere, and ideal study activities..."
                                        className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />

                                    <p className="mt-1 text-right text-xs text-slate-400">
                                        {formData.description.length}/2000 characters
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100" />

                        {/* Image */}
                        <div>
                            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                                <ImagePlus size={21} className="text-teal-700" />
                                Room Image
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Enter a publicly accessible image URL. File uploads are not
                                configured in this form.
                            </p>

                            <div className="mt-5">
                                <label
                                    htmlFor="image"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Image URL
                                </label>

                                <input
                                    id="image"
                                    name="image"
                                    type="url"
                                    maxLength={2048}
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/room-image.jpg"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                />

                                {formData.image.trim() && (
                                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                        <img
                                            src={formData.image}
                                            alt="Room preview"
                                            className="h-56 w-full object-cover"
                                            onError={(event) => {
                                                event.currentTarget.style.display = "none";
                                            }}
                                            onLoad={(event) => {
                                                event.currentTarget.style.display = "block";
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-slate-100" />

                        {/* Capacity and pricing */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Location & Pricing
                            </h2>

                            <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="floor"
                                        className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                                    >
                                        <MapPin size={17} className="text-teal-700" />
                                        Floor / Location
                                    </label>

                                    <input
                                        id="floor"
                                        name="floor"
                                        type="text"
                                        maxLength={100}
                                        value={formData.floor}
                                        onChange={handleChange}
                                        placeholder="e.g. 2nd Floor"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="capacity"
                                        className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                                    >
                                        <Users size={17} className="text-teal-700" />
                                        Capacity (people) *
                                    </label>

                                    <input
                                        id="capacity"
                                        name="capacity"
                                        type="number"
                                        min="1"
                                        max="1000"
                                        step="1"
                                        required
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        placeholder="e.g. 6"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="hourlyRate"
                                        className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                                    >
                                        <DollarSign size={17} className="text-teal-700" />
                                        Hourly Rate (USD) *
                                    </label>

                                    <input
                                        id="hourlyRate"
                                        name="hourlyRate"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        required
                                        value={formData.hourlyRate}
                                        onChange={handleChange}
                                        placeholder="e.g. 12.50"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />

                                    <p className="mt-2 text-xs text-slate-500">
                                        Enter the amount charged for one hour of room use.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100" />

                        {/* Amenities */}
                        <div>
                            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                                <ListChecks size={21} className="text-teal-700" />
                                Room Amenities
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Select every facility available in this room.
                            </p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {availableAmenities.map((amenity) => {
                                    const checked = formData.amenities.includes(amenity);

                                    return (
                                        <label
                                            key={amenity}
                                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${checked
                                                    ? "border-teal-600 bg-teal-50"
                                                    : "border-slate-200 hover:border-teal-300"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => handleAmenityChange(amenity)}
                                                className="h-4 w-4 accent-teal-700"
                                            />

                                            <span className="text-sm font-medium text-slate-700">
                                                {amenity}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                to="/rooms"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle size={19} className="animate-spin" />
                                        Adding Room...
                                    </>
                                ) : (
                                    <>
                                        <BookOpen size={19} />
                                        Add Study Room
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddRoom;
