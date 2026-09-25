import { useState } from "react";
import { useSelector } from "react-redux";
import { FiChevronDown } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

import Avatar from "../../components/ui/Avatar.jsx";
import Replies from "./Replies.jsx";
import { formatDate } from "../../utils/formatDate.js";
import Tooltip from "../../components/ui/Tooltip.jsx";
import { useDeleteComment, usePinComment } from "../../features/comment/commentMutations.js";
import Loader from "../../components/ui/Loader.jsx";
import { TbPinned, TbPinnedFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

function Comment({ comment, onReply }) {
  const [showReplies, setShowReplies] = useState(false);

  const repliesCount = comment?.replyCount ?? 0;

  const { user } = useSelector((state) => state.auth);

  const { mutateAsync: deleteComment, isPending } = useDeleteComment();

  const { mutateAsync: togglePin } = usePinComment();

  const handeleDelete = (commentId) => {
    try {
      deleteComment({ commentId });
    } catch (error) {
      console.log("Error in  the deletiion of the Comment ::", error);
    }
  };

  return (
    <article className="w-full">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Link
          to={`/userProfile/${comment?.author?.userName}/${comment?.author?._id} `}
          className="hover:opacity-80"
        >
          <Avatar
            src={comment?.author?.profilePic?.url}
            userName={comment?.author?.userName}
            className="text-xl"
            size="md"
          />
        </Link>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* User */}
          <div className="flex-wrp flex items-center gap-x-2 gap-y-1">
            <span className="text-text-primary font-semibold">
              {comment?.author?.userName || "User"}
            </span>

            {comment?.createdAt && (
              <span className="text-text-muted text-xs">{formatDate(comment.createdAt)}</span>
            )}

            <div className="flex items-center gap-2">
              {user?._id === comment?.author?._id && (
                <Tooltip text="Delete Comment">
                  <button
                    disabled={isPending}
                    type="button"
                    onClick={() => handeleDelete(comment._id)}
                    className="text-danger py-1 hover:cursor-pointer hover:opacity-80"
                  >
                    <span>
                      <MdDelete size={23} />
                    </span>
                  </button>
                </Tooltip>
              )}

              {user?._id === comment?.blog?.author && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => togglePin({ commentId: comment._id })}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Tooltip text={comment?.isPinned ? "UnPin" : "Pin"}>
                    {comment?.isPinned ? (
                      <TbPinnedFilled className="text-text-primary" size={23} />
                    ) : (
                      <TbPinned className="text-text-primary" size={23} />
                    )}
                  </Tooltip>
                </button>
              )}
            </div>
          </div>

          {/* Comment */}
          <p className="text-text-secondary mt-1 text-sm leading-6 wrap-break-word">
            {comment?.content}
          </p>

          {/* Actions */}
          <div className="mt-2 flex items-center gap-4">
            {/* Reply */}
            <button
              type="button"
              onClick={() => onReply(comment)}
              className="text-text-muted hover:text-primary cursor-pointer text-xs font-medium transition-colors"
            >
              Reply
            </button>

            {!showReplies && repliesCount > 0 && (
              <button
                type="button"
                onClick={() => setShowReplies((prev) => !prev)}
                className="text-primary hover:text-primary-hover flex cursor-pointer items-center gap-1 text-xs font-medium transition-colors"
              >
                <FiChevronDown className={`transition-transform duration-500`} /> View{" "}
                {repliesCount} {repliesCount === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {/* Replies */}
          <Replies
            commentId={comment?._id}
            repliesCount={repliesCount}
            isOpen={showReplies}
            onToggle={() => setShowReplies((prev) => !prev)}
            onDelete={handeleDelete}
          />
        </div>
      </div>
    </article>
  );
}

export default Comment;
