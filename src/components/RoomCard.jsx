
import { Link } from "react-router-dom";
import { MapPin, Users, ArrowUpRight } from "lucide-react";

const RoomCard = ({ room }) => {
    if (!room) return null;

    const {
        _id,
        name,
        description,
        image,
        floor,
        capacity,
        hourlyRate,
        amenities = [],
    } = room;

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Room image */}
            <div className="relative h-52 overflow-hidden bg-slate-100">
                {image ? (
                    <img
                        src={image}
                        alt={name || "Study room"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                        No room image available
                    </div>
                )}

                {hourlyRate != null && (
                    <div className="absolute bottom-3 right-3 rounded-xl bg-white px-3 py-2 shadow-md">
                        <span className="text-lg font-bold text-teal-700">
                            ${hourlyRate}
                        </span>
                        <span className="text-sm text-slate-500"> / hour</span>
                    </div>
                )}
            </div>

            {/* Room information */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-slate-900">
                    {name || "Study Room"}
                </h3>

                <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
                    {description || "A comfortable space for focused learning."}
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                    {capacity != null && (
                        <span className="flex items-center gap-1.5">
                            <Users size={16} />
                            {capacity} people
                        </span>
                    )}

                    {floor != null && (
                        <span className="flex items-center gap-1.5">
                            <MapPin size={16} />
                            Floor {floor}
                        </span>
                    )}
                </div>

                {amenities.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {amenities.slice(0, 3).map((amenity) => (
                            <span
                                key={amenity}
                                className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800"
                            >
                                {amenity}
                            </span>
                        ))}
                    </div>
                )}

                <Link
                    to={_id ? `/rooms/${_id}` : "/rooms"}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800"
                >
                    View Details
                    <ArrowUpRight size={18} />
                </Link>
            </div>
        </article>
    );
};

export default RoomCard;
