import { useNavigate, useParams } from "react-router-dom";
import { CiCalendarDate } from "react-icons/ci";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoTimeOutline, IoEyeOutline } from "react-icons/io5";
import { useState } from "react";
import { FiMaximize2, FiMinimize, FiMinimize2 } from "react-icons/fi";

import CategoryBadge from "../../components/blog/CategoryBadge";
import Avatar from "../../components/ui/Avatar";
import BlogTags from "../../components/blog/BlogTags";
import BlogActions from "../../components/blog/BlogActions";
import BlogContent from "../../components/blog/BlogContent";
import { formatDate, formatRelativeTime } from "../../utils/formatDate";
import { useSingleBlog } from "../../features/blog/blogQueries";
import Loader from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import Tooltip from "../../components/ui/Tooltip";

function SingleBlog() {
  const { slug } = useParams();

  const navigate = useNavigate();

  const [isCover, setIsCover] = useState(false);
  const [isContain, setIsContain] = useState(false);

  const { data, isPending, refetch, isError } = useSingleBlog(slug);

  const blog = data?.data?.blog;

  if (isPending) {
    return <Loader />;
  }

  if (isError || !blog) {
    return <ErrorState message="Blog not found." onRetry={refetch} />;
  }

  const publishedDate = blog?.publishedAt || blog?.updatedAt || blog?.createdAt;

  return (
    <article className="bg-background text-text-primary w-full">
      {/* HEADER */}

      <header className="mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="group border-border bg-surface text-text-secondary hover:border-primary/30 hover:bg-primary/5 hover:text-primary mb-8 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium shadow-sm transition-all sm:mb-10"
        >
          <IoArrowBackOutline
            size={17}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Back to blogs
        </button>

        {/* Header content */}
        <div className="mx-auto max-w-4xl px-4 sm:p-0">
          {/* Category */}
          <div className="mb-5">
            <CategoryBadge category={blog?.category?.name || ""} className="text-base sm:px-5" />
          </div>

          {/* Title */}
          <h1 className="font-heading text-text-primary max-w-4xl text-3xl leading-[1.12] font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          {/* Metadata */}
          <div className="text-text-muted mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:mt-6 sm:text-sm">
            <div className="flex items-center gap-1.5">
              <CiCalendarDate size={18} />
              Created At{" "}
              <span className="text-primary font-semibold">{formatDate(publishedDate)}</span>
            </div>

            <span className="hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <IoTimeOutline size={16} />

              <span>{blog?.readTime ?? 0} min read</span>
            </div>

            <span className="hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <IoEyeOutline size={16} />

              <span>{blog?.blogViews ?? 0} views</span>
            </div>
          </div>

          {/* Author */}
          <div className="border-border mt-7 flex items-center gap-3 border-t pt-6 sm:mt-8 sm:pt-7">
            <Avatar src={blog?.author?.profilePic?.url} alt="profile_avatar" size="lg" />

            <div className="min-w-0">
              <p className="text-text-primary truncate text-sm font-semibold sm:text-base">
                {blog?.author?.userName}
              </p>

              <div className="text-text-secondary mt-0.5 flex flex-wrap items-center gap-x-2 text-xs">
                <span>Published {formatRelativeTime(blog?.publishedAt || blog?.createdAt)}</span>

                {blog?.isUpdated && blog?.blogUpdatedAt && (
                  <>
                    <span>•</span>

                    <span className="font-medium text-green-500">
                      Updated {formatRelativeTime(blog.blogUpdatedAt)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURED IMAGE */}

      {blog?.featuredImage?.url && (
        <div className="mx-auto mt-8 w-full max-w-4xl px-4 sm:mt-10 sm:px-6 lg:px-8">
          <div className="border-border bg-surface relative flex justify-center overflow-hidden rounded-2xl border shadow-sm sm:rounded-3xl">
            <div className="group">
              <img
                src={blog.featuredImage.url}
                alt={blog?.title || "Featured image"}
                className={`aspect-square h-115 w-full transition-transform duration-500 group-hover:scale-105 sm:aspect-2/1 ${isContain ? "min-w-150 bg-neutral-100 object-contain md:min-w-400" : "object-cover"} `}
              />
              {/* Gradient */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <button
              title={isContain ? "Maximize" : "Minimize"}
              type="button"
              onClick={() => setIsContain((prev) => !prev)}
              aria-label={isContain ? "Switch to cropped view" : "Switch to full image view"}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
            >
              {isContain ? <FiMaximize2 className="h-4 w-4" /> : <FiMinimize className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* CONTENT AREA */}

      <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-8 px-4 pb-12 sm:mt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_230px] lg:gap-12 lg:px-8">
        {/* MAIN CONTENT */}
        <main className="min-w-0">
          <div className="border-border bg-surface rounded-2xl border px-4 py-6 shadow-sm sm:px-7 sm:py-8 md:px-10 md:py-10">
            <BlogContent content={blog?.content} />
          </div>
        </main>

        {/* SIDEBAR */}

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          {/* Actions */}
          <div className="border-border bg-surface rounded-2xl border p-3 shadow-sm sm:p-4">
            <BlogActions
              isshowingBookmark
              isLiked={blog?.isLiked}
              isPinned={blog?.isPinned}
              isBookmarked={blog?.isBookmarked}
              likesCount={blog?.likesCount}
              commentsCount={blog?.commentsCount}
              slug={blog?.slug}
              blogId={blog?._id}
              showReadLink={false}
            />
          </div>

          {/* Tags */}
          {blog?.tags?.length > 0 && (
            <div className="border-border bg-surface rounded-2xl border p-4 shadow-sm">
              <h2 className="font-heading text-text-primary mb-3 text-base font-semibold tracking-wide">
                Tags
              </h2>

              <BlogTags tags={blog.tags} showAllTags />
            </div>
          )}
        </aside>
      </div>

      {/* Comments */}
      <section className="border-border mx-auto w-full max-w-6xl border-t px-4 py-10 sm:px-6 lg:px-8">
        {/* CommentSection goes here */}
      </section>
    </article>
  );
}

export default SingleBlog;
