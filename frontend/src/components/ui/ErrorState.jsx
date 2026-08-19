import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

const ErrorState = ({
    title = "Something went wrong",
    message = "We couldn't load the data. Please try again.",
    onRetry
}) => {
    return (
        <div className="flex min-h-100 w-full items-center justify-center px-4 py-10">
            <div className="flex w-full max-w-md flex-col items-center text-center">

                {/* Icon */}
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                    <FiAlertTriangle className="h-10 w-10 text-red-500" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                    {title}
                </h2>

                {/* Message */}
                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
                    {message}
                </p>

                {/* Retry */}
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-gray-800 active:scale-95"
                    >
                        <FiRefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                )}

            </div>
        </div>
    );
};

export default ErrorState;

{/* <ErrorState
    message="We couldn't load the blogs."
    onRetry={refetch}
/> */}