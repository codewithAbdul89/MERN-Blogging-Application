import { FiFileText   } from "react-icons/fi";

const EmptyState = ({
    title = "Nothing here yet",
    message = "There is no data to display.",
    action,
    actionText
}) => {
    return (
        <div className="flex min-h-100 w-full items-center justify-center px-4 py-10">
            <div className="flex w-full max-w-md flex-col items-center text-center">

                {/* Icon */}
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                    <FiFileText  className="h-10 w-10 text-blue-500" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                    {title}
                </h2>

                {/* Message */}
                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
                    {message}
                </p>

                {/* Optional Action */}
                {action && (
                    <button
                        type="button"
                        onClick={action}
                        className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-blue-700 active:scale-95"
                    >
                        {actionText}
                    </button>
                )}

            </div>
        </div>
    );
};

export default EmptyState;

{/* <EmptyState
    title="No blogs yet"
    message="You haven't created any blogs yet."
    action={openCreateBlog}
    actionText="Create Blog"
/> */}