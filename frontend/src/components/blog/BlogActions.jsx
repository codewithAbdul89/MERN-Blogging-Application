import { useSelector } from "react-redux";
import { FiHeart } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaBookmark } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { TbPinned } from "react-icons/tb";
import { TbPinnedFilled } from "react-icons/tb";
import { WiDirectionUpRight } from "react-icons/wi";
import { motion, AnimatePresence } from "framer-motion";

import { showError } from "../../utils/toast";
import Tooltip from "../ui/Tooltip";
import {
  useToggleBookmark,
  useToggleLike,
  useTogglePin,
} from "../../features/blog/blogMutations";

function BlogActions({
  isshowingBookmark = false,
  isLiked = false,
  isPinned = true,
  isBookmarked = false,
  likesCount = "0",
  commentsCount = "0",
  status = "",
  slug = "",
  blogId = "",
}) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { mutateAsync: toggleLike, pending: isLikePending } = useToggleLike();

  const { mutateAsync: toggleBookmark, pending: isBookmarkPending } =
    useToggleBookmark();

  const { mutateAsync: togglePin } = useTogglePin();

  const handleLike = async () => {
    if (!isAuthenticated) {
      showError("Please sign in to your account first.");
      return;
    }
    await toggleLike({ blogId, slug, status });
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      showError("Please sign in to your account first.");
      return;
    }
    await toggleBookmark({ blogId, slug });
  };

  return (
    <div className="flex items-center justify-between  sm:px-2 mt-1">
      {/* Like */}

      <button
        type="button"
        disabled={isLikePending}
        onClick={handleLike}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Tooltip text={isLiked ? "Unlike" : "Like"}>
          <motion.div
            animate={
              isLiked
                ? {
                    scale: [1, 1.35, 0.9, 1.1, 1],
                    rotate: [0, -12, 12, -6, 0],
                  }
                : {
                    scale: 1,
                    rotate: 0,
                  }
            }
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            {isLiked ? (
              <FaHeart className="text-red-500" size={25} />
            ) : (
              <FiHeart className="text-text-primary" size={27} />
            )}
          </motion.div>
        </Tooltip>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={likesCount}
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.8,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            {likesCount}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Comments */}
      <Tooltip text="Comments">
        <div className="flex items-center gap-2">
          <FaRegCommentDots className="text-text-secondary" size={27} />
          <span>{commentsCount}</span>
        </div>
      </Tooltip>
      {/* Bookmark */}

      {isshowingBookmark && (
        <button
          type="button"
          disabled={isBookmarkPending}
          onClick={handleBookmark}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Tooltip text={isBookmarked ? "Unsaved" : "Saved"}>
            {isBookmarked ? (
              <FaBookmark className="text-text-primary/90" size={27} />
            ) : (
              <CiBookmark className=" text-text-primary" size={27} />
            )}
          </Tooltip>
        </button>
      )}

      {!isshowingBookmark && (
        <button
          type="button"
          onClick={() => togglePin({ blogId })}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Tooltip text={isPinned ? "UnPin" : "Pin"}>
            {isPinned ? (
              <TbPinnedFilled className="text-text-primary" size={28} />
            ) : (
              <TbPinned className=" text-text-primary" size={28} />
            )}
          </Tooltip>
        </button>
      )}

      <Link
        to={`/blog${slug}`}
        className="px-3 py-2 rounded-lg bg-primary/70 hover:bg-primary/50 text-white/90  group flex items-center text-center duration-500 transition-all md:px-4"
      >
        View More
        <span className="hidden group-hover:opacity-100 opacity-0 group-hover:inline">
          <WiDirectionUpRight size={20} />
        </span>
      </Link>
    </div>
  );
}

export default BlogActions;
