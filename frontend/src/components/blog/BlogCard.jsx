import { CiCalendarDate } from "react-icons/ci";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";

import CategoryBadge from "./CategoryBadge";
import { formatDate, formatRelativeTime } from "../../utils/formatDate";
import BlogTags from "./BlogTags";
import Avatar from "../ui/Avatar";
import BlogActions from "./BlogActions";
import Tooltip from "../ui/Tooltip";
import BlogMenu from "./BlogMenu";
import { usePrefetchSingleBlog } from "../../features/blog/blogQueries";
import { useSelector } from "react-redux";

function BlogCard({ blog = "", showBookmark = false, isMenuOpen = false, status = "ALL" }) {
  const getPlainText = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
  };

  const { isAuthenticated } = useSelector((state) => state.auth);
  const prefetchSingleBlog = usePrefetchSingleBlog();
  return (
    <div
      className={`border-border bg-surface relative flex h-full flex-col rounded-xl border transition-transform duration-200 hover:scale-102 ${blog?.status === "DRAFT" ? "border-2 border-red-500" : ""} `}
    >
      {/* image & menu */}
      <div className="relative">
        {/* Image */}
        <Link
          className="group relative block overflow-hidden rounded-lg"
          onMouseEnter={() => {
            if (authStatus === "authenticated") {
              prefetchSingleBlog(blog?.slug);
            }
          }}
        >
          <img
            className="h-64 w-full cursor-default object-cover transition-transform duration-500 group-hover:scale-105"
            src={blog?.featuredImage?.url}
            alt="Featured image"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
        {/* Menu  */}
        {isMenuOpen && (
          <div className="absolute top-2 right-3 z-10">
            <BlogMenu blog={blog} />
          </div>
        )}
      </div>
      {/* Remaining Part */}
      <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-2 sm:px-4">
        {/* Category + Date */}
        <div className="flex shrink-0 items-center justify-between gap-1 md:px-2">
          {/* Category + updated */}
          <div className="item-center flex gap-3">
            <CategoryBadge category={blog?.category?.name || ""} />
          </div>
          {/* Date+readtime */}
          <div className="flex items-center gap-1 text-xs">
            <div className="flex items-center gap-1">
              <CiCalendarDate size={16} className="font-bold" />
              <span className="text-text-muted whitespace-nowrap">
                {formatDate(blog?.publishedAt || blog?.createdAt)}
              </span>
            </div>
            <span className="px-1 text-xl leading-none">•</span>
            <span className="overflow-clip whitespace-nowrap">{blog?.readTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="hover:text-primary/70 font-heading mt-2 line-clamp-2 shrink-0 text-2xl leading-tight font-semibold tracking-wide transition-colors hover:opacity-80 sm:h-20 sm:text-3xl">
          <Link to={`/blog/${blog?.slug}`}>{blog?.title}</Link>
        </h1>

        {/* Content */}

        <p className="text-text-secondary line-clamp-3 h-18 shrink-0">
          {getPlainText(blog.content)}
        </p>

        {/* Tags */}
        <div className="shrink-0">
          <BlogTags tags={blog?.tags} />
        </div>

        <hr className="mb-1 shrink-0 border border-gray-200" />
        {/* Author  */}
        <div className="mb-1 flex shrink-0 items-center justify-between gap-4 pr-2 sm:pr-8">
          <div className="flex items-center gap-4">
            <Link to={`/userProfile/${blog?.author?.userName}/${blog?.author?._id} `}>
              <Avatar
                src={blog?.author?.profilePic?.url}
                userName={blog?.author?.userName}
                className="text-2xl"
                size="lg"
              />
            </Link>

            <div className={`flex flex-col ${blog?.blogUpdatedAt ? " gap-px" : "gap-1"}`}>
              <Link
                to={`/userProfile/${blog?.author?.userName}/${blog?.author?._id} `}
                className="text-text-primary leading-tight font-semibold hover:opacity-80"
              >
                {blog?.author?.userName}
              </Link>

              <span className="text-text-secondary text-xs">
                Published {formatRelativeTime(blog?.publishedAt || blog?.createdAt)}
              </span>

              {blog?.isUpdated && blog?.blogUpdatedAt && (
                <span className="mt-0.5 flex items-center gap-1 text-xs font-medium text-green-500">
                  <span className="hidden h-1 w-1 rounded-full bg-green-500 sm:block" />
                  Updated {formatRelativeTime(blog?.blogUpdatedAt)}
                </span>
              )}
            </div>
          </div>
          {blog?.status === "DRAFT" ? (
            <Link className="font-heading text-danger text-2xl font-bold tracking-wider">
              DRAFT
            </Link>
          ) : (
            <Tooltip text="Blog Views">
              <div className="group border-border bg-surface text-text-muted hover:border-primary/30 hover:bg-primary/5 hover:text-primary flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-all duration-200">
                <IoEyeOutline
                  size={18}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-sm font-semibold">{blog?.blogViews ?? 0}</span>
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
