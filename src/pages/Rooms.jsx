
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, BookOpen } from "lucide-react";
import api from "../services/api";
import RoomCard from "../components/RoomCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedAmenity, setSelectedAmenity] = useState("");

    useEffect(() => {
        let active = true;

        const fetchRooms = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/rooms");
                const data = response.data;

                const roomList = Array.isArray(data)
                    ? data
                    : data?.rooms ?? data?.data?.rooms ?? data?.data ?? [];

                if (active) {
                    setRooms(Array.isArray(roomList) ? roomList : []);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Could not load rooms. Please try again."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchRooms();

        return () => {
            active = false;
        };
    }, []);

    // Build a list of amenities available in the loaded rooms.
    const amenities = useMemo(() => {
        const allAmenities = rooms.flatMap((room) =>
            Array.isArray(room.amenities) ? room.amenities : []
        );

        return [...new Set(allAmenities)].sort();
    }, [rooms]);

    // Filter rooms on the client.
    const filteredRooms = useMemo(() => {
        const query = search.trim().toLowerCase();

        return rooms.filter((room) => {
            const searchableText = [
                room.name,
                room.description,
                room.floor,
                ...(Array.isArray(room.amenities) ? room.amenities : []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !query || searchableText.includes(query);

            const matchesPrice =
                maxPrice === "" ||
                (Number.isFinite(Number(room.hourlyRate)) &&
                    Number(room.hourlyRate) <= Number(maxPrice));

            const matchesAmenity =
                !selectedAmenity ||
                (Array.isArray(room.amenities) &&
                    room.amenities.includes(selectedAmenity));

            return matchesSearch && matchesPrice && matchesAmenity;
        });
    }, [rooms, search, maxPrice, selectedAmenity]);

    const clearFilters = () => {
        setSearch("");
        setMaxPrice("");
        setSelectedAmenity("");
    };

    const hasFilters =
        search !== "" || maxPrice !== "" || selectedAmenity !== "";

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Page header */}
            <section className="bg-gradient-to-br from-teal-800 to-teal-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm font-bold uppercase tracking-widest text-teal-200">
                        Explore StudyNook
                    </p>

                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                        Find Your Study Room
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-teal-100">
                        Browse available study spaces, compare amenities, and
                        discover the right environment for your next study session.
                    </p>

                    <div className="mt-7 flex items-center gap-3 text-sm text-teal-100">
                        <BookOpen size={20} />
                        <span>
                            {loading
                                ? "Loading available spaces..."
                                : `${rooms.length} ${rooms.length === 1 ? "room" : "rooms"} found`}
                        </span>
                    </div>
                </div>
            </section>

            {/* Search and results */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr]">
                    {/* Filter panel */}
                    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-2 font-bold text-slate-900">
                                <SlidersHorizontal size={19} />
                                Filters
                            </h2>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-sm font-semibold text-teal-800 hover:text-teal-950"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Search */}
                        <div className="mt-6">
                            <label
                                htmlFor="room-search"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Search rooms
                            </label>

                            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
                                <Search size={18} className="shrink-0 text-slate-400" />

                                <input
                                    id="room-search"
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Name or keyword..."
                                    className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm outline-none"
                                />
                            </div>
                        </div>

                        {/* Price filter */}
                        <div className="mt-6">
                            <label
                                htmlFor="room-price"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Maximum price per hour ($)
                            </label>

                            <input
                                id="room-price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={maxPrice}
                                onChange={(event) => setMaxPrice(event.target.value)}
                                placeholder="Enter maximum price"
                                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                            />
                        </div>

                        {/* Amenities filter */}
                        {amenities.length > 0 && (
                            <div className="mt-6">
                                <label
                                    htmlFor="room-amenity"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Amenities
                                </label>

                                <select
                                    id="room-amenity"
                                    value={selectedAmenity}
                                    onChange={(event) =>
                                        setSelectedAmenity(event.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                >
                                    <option value="">All amenities</option>

                                    {amenities.map((amenity) => (
                                        <option key={amenity} value={amenity}>
                                            {amenity}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </aside>

                    {/* Room results */}
                    <div className="min-w-0">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Available Study Spaces
                                </h2>

                                {!loading && !error && (
                                    <p className="mt-1 text-sm text-slate-500">
                                        Showing {filteredRooms.length} of {rooms.length} rooms
                                    </p>
                                )}
                            </div>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                                >
                                    <X size={16} />
                                    Reset filters
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <LoadingSpinner message="Loading study rooms..." />
                        ) : error ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                                <p className="text-sm text-red-700">{error}</p>

                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : filteredRooms.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {filteredRooms.map((room) => (
                                    <RoomCard key={room._id} room={room} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                                <Search
                                    size={36}
                                    className="mx-auto text-slate-400"
                                />

                                <h3 className="mt-4 text-xl font-bold text-slate-900">
                                    No rooms found
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Try changing your search keyword or filters.
                                </p>

                                {hasFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="mt-5 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Rooms;
