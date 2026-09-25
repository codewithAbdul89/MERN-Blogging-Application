import { FiChevronDown } from "react-icons/fi";

import Avatar from "../../components/ui/Avatar.jsx";
import { useReplies } from "../../features/comment/commentQueries";
import { useSelector } from "react-redux";
import Tooltip from "../../components/ui/Tooltip.jsx";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

function Replies({ commentId, repliesCount = 0, isOpen, onToggle, onDelete }) {
  const { data, isPending, isFetchingNextPage, fetchNextPage, isError } = useReplies(commentId);

  const replies = data?.pages?.flatMap((page) => page?.data?.replies ?? []) ?? [];

  const loadedReplies = replies.length;

  const remainingReplies = Math.max(repliesCount - loadedReplies, 0);

  const { user } = useSelector((state) => state.auth);

  if (!repliesCount) {
    return null;
  }

  return (
    <div className="border-border mt-4 -ml-8 border-l pl-1 sm:ml-8 sm:pl-6">
      {isOpen && (
        <div className="space-y-5">
          {isPending && <p className="text-text-muted text-sm">Loading replies...</p>}

          {isError && <p className="text-danger text-sm">Unable to load replies.</p>}

          {replies.map((reply) => (
            <div key={reply._id} className="flex items-start gap-3 p-3">
              <Link
                to={`/userProfile/${reply?.author?.userName}/${reply?.author?._id} `}
                className="hover:opacity-80"
              >
                <Avatar
                  src={reply?.author?.profilePic?.url}
                  userName={reply?.author?.userName}
                  className="text-lg"
                  size="sm"
                />
              </Link>

              <div className="min-w-0">
                <p className="text-text-primary text-sm font-semibold">
                  {reply?.author?.userName || "User"}
                </p>

                <p className="text-text-secondary mt-1 text-sm leading-6 wrap-break-word">
                  {reply?.content}
                </p>
              </div>
              {user?._id === reply?.author?._id && (
                <Tooltip text="Delete Comment">
                  <button
                    type="button"
                    onClick={() => onDelete(reply._id)}
                    className="text-danger py-1 hover:cursor-pointer hover:opacity-80"
                  >
                    <span>
                      <MdDelete size={23} />
                    </span>
                  </button>
                </Tooltip>
              )}
            </div>
          ))}

          <div className="flex items-center justify-start gap-10">
            {/* View more */}
            {remainingReplies > 0 && (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-primary hover:text-primary-hover cursor-pointer text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetchingNextPage
                  ? "Loading..."
                  : `View ${remainingReplies} more ${remainingReplies === 1 ? "reply" : "replies"}`}
              </button>
            )}

            {/* Hide */}
            {loadedReplies > 0 && (
              <button
                type="button"
                onClick={onToggle}
                className="hover:text-text-primary flex items-center gap-1 text-sm text-red-500 transition-colors"
              >
                <FiChevronDown className={`rotate-180 transition-transform duration-500`} /> Hide
                replies
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Replies;
