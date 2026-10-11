
const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <div
            className="flex min-h-[240px] w-full flex-col items-center justify-center gap-4"
            role="status"
            aria-live="polite"
        >
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />

            <p className="text-sm font-medium text-slate-600">
                {message}
            </p>

            <span className="sr-only">Please wait</span>
        </div>
    );
};

export default LoadingSpinner;
