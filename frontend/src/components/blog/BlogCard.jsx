import { CiCalendarDate } from "react-icons/ci";
import { MdDeleteSweep } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
import { MdPublish } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { IoEyeOutline } from "react-icons/io5";
import { BiSolidArrowToBottom } from "react-icons/bi";

import CategoryBadge from "../ui/CategoryBadge";
import Dropdown from "../ui/Dropdown";
import { formatDate, formatRelativeTime } from "../../utils/formatDate";
import BlogTags from "./BlogTags";
import Avatar from "../ui/Avatar";
import BlogActions from "./BlogActions";
import Tooltip from "../ui/Tooltip";
import BlogMenu from "./BlogMenu";

function BlogCard({
  blog = "",
  showBookmark = false,
  isMenuOpen = false,
  status = "ALL",
}) {
  return (
    <div
      className={` flex h-full flex-col  rounded-xl border border-border bg-surface transition-transform hover:scale-102 duration-200 relative ${blog?.status === "DRAFT" ? "border-red-500 border-2" : ""} `}
    >
      {/* image & menu */}
      <div className="relative">
        {/* Image */}
        <Link>
          <img
            className="w-full h-64 object-cover rounded-lg"
            src={blog?.featuredImage?.url}
            alt={blog?.title || "Featured image"}
          />
        </Link>
        {/* Menu  */}
        {isMenuOpen && (
          <div className="absolute right-3 top-2 z-10">
            <BlogMenu blog={blog} />
          </div>
        )}
      </div>
      {/* Remaining Part */}
      <div className="flex flex-1 flex-col px-3 sm:px-4 py-2 gap-2">
        {/* Category + Date */}
        <div className="flex items-center justify-between gap-1  shrink-0 md:px-2">
          {/* Category + updated */}
          <div className="flex item-center gap-3">
            <CategoryBadge category={blog?.category?.name || ""} />
          </div>
          {/* Date+readtime */}
          <div className="flex items-center gap-1 text-xs">
            <div className="flex items-center gap-1">
              <CiCalendarDate size={16} className="font-bold" />
              <span className="whitespace-nowrap text-text-muted">
                {formatDate(
                  blog.updatedAt || blog?.publishedAt || blog?.createdAt,
                )}
              </span>
            </div>
            <span className="leading-none text-xl px-1">•</span>
            <span className="whitespace-nowrap overflow-clip">
              {blog?.readTime} min read
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-2 hover:text-primary/70 hover:opacity-80 transition-colors  text-2xl  font-heading font-semibold tracking-wide leading-tight line-clamp-2 sm:text-3xl shrink-0 sm:h-20">
          <Link to={`/blog/${blog?.slug}`}>{blog?.title}</Link>
        </h1>

        {/* Content */}
        <p className="text-text-secondary line-clamp-3 h-18 shrink-0">
          {blog?.content}
        </p>

        {/* Tags */}
        <div className="shrink-0">
          <BlogTags tags={blog?.tags} />
        </div>

        <hr className="border border-gray-200 shrink-0 mb-1" />
        {/* Author  */}
        <div className="flex gap-4 items-center justify-between shrink-0 pr-2 mb-1 sm:pr-8">
          <div className="flex gap-4 items-center">
            <Avatar
              src={blog?.author?.profilePic?.url}
              alt="profile_avatar"
              size="lg"
            />

            <div
              className={`flex flex-col ${blog?.contentUpdatedAt ? " gap-px" : "gap-1"}`}
            >
              <span className="font-semibold leading-tight text-text-primary">
                {blog?.author?.userName}
              </span>

              <span className="text-xs text-text-secondary">
                {formatRelativeTime(blog?.createdAt)}
              </span>

              {blog?.isUpdated && (
                <span className="mt-0.5 flex items-center gap-1 text-xs font-medium text-green-500">
                  <span className="h-1 w-1 rounded-full bg-green-500" />
                  Updated {formatRelativeTime(blog?.contentUpdatedAt)}
                </span>
              )}
            </div>
          </div>
          {blog?.status === "DRAFT" ? (
            <Link className="font-bold font-heading tracking-wider text-danger text-2xl">
              DRAFT
            </Link>
          ) : (
            <Tooltip text="Blog Views">
              <div className="group flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-text-muted  transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary">
                <IoEyeOutline
                  size={18}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-sm font-semibold">
                  {blog?.blogViews ?? 0}
                </span>
              </div>
            </Tooltip>
          )}
        </div>
        {/* Likes,Comments,view more */}
        <BlogActions
          isshowingBookmark={showBookmark}
          isLiked={blog?.isLiked}
          isPinned={blog?.isPinned}
          isBookmarked={blog?.isBookmarked}
          likesCount={blog?.likesCount}
          commentsCount={blog?.commentsCount}
          slug={blog?.slug}
          blogId={blog?._id}
          status={status}
        />
      </div>
    </div>
  );
}

export default BlogCard;
