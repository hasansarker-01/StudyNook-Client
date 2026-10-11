
import { AlertTriangle, X, LoaderCircle } from "lucide-react";

const ConfirmModal = ({
    isOpen,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isLoading = false,
    variant = "danger",
}) => {
    if (!isOpen) return null;

    const isDanger = variant === "danger";

    const confirmButtonClass = isDanger
        ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
        : "bg-teal-700 hover:bg-teal-800 focus-visible:ring-teal-500";

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isLoading) {
                    onCancel?.();
                }
            }}
        >
            <section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
                {/* Modal heading */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isDanger
                                ? "bg-red-50 text-red-600"
                                : "bg-teal-50 text-teal-700"
                                }`}
                        >
                            <AlertTriangle size={24} />
                        </div>

                        <div>
                            <h2
                                id="confirm-modal-title"
                                className="text-lg font-bold text-slate-900"
                            >
                                {title}
                            </h2>

                            <p
                                id="confirm-modal-description"
                                className="mt-2 text-sm leading-6 text-slate-600"
                            >
                                {message}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        aria-label="Close confirmation dialog"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal actions */}
                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${confirmButtonClass}`}
                    >
                        {isLoading && (
                            <LoaderCircle size={17} className="animate-spin" />
                        )}

                        {isLoading ? "Please wait..." : confirmText}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ConfirmModal;
