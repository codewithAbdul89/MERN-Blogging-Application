import { FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";

const EmptyState = ({
  title = "Nothing here yet",
  message = "There is no data to display.",
  action,
  actionText,
}) => {
  return (
    <div className="flex min-h-100 w-full items-center justify-center px-4 py-10 bg-background">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <FiFileText className="h-10 w-10 text-primary/50" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-text-primary sm:text-2xl">
          {title}
        </h2>

        {/* Message */}
        <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary sm:text-base">
          {message}
        </p>

        {/* Optional Action */}
        {action && (
          <Link
            to={action}
            className="mt-6 rounded-lg bg-primary/70 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-primary/90 active:scale-95"
          >
            {actionText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

{
  /* <EmptyState
    title="No blogs yet"
    message="You haven't created any blogs yet."
    action={openCreateBlog}
    actionText="Create Blog"
/> */
}
