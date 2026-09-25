import BlogCard from "../../components/blog/BlogCard";
import BlogCardSkeleton from "../../components/blog/BlogCardSkeleton";
import { useBookmarkedBlogs } from "../../features/blog/blogQueries";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import { getErrorMessage } from "../../utils/errorHandler";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

function LikedBlog() {
  const {
    blogs,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookmarkedBlogs();

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  useScrollAnimation({
    trigger: blogs.length,
  });

  if (isError) {
    return (
      <ErrorState
        title="Unable to load your blogs"
        message={getErrorMessage(error)}
        onRetry={refetch}
      />
    );
  }
  return (
    <div className="bg-backgroxund max-w-7xl text-text-primary sm:mt-10">
      <main>
        <section className="mt-8 mb-4 px-2 md:px-4">
          <h1 className="text-4xl text-primary font-heading px-4 mb-3 font-semibold md:px-8 ">
            Liked Blogs
          </h1>

          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8 mt-8 md:mt-10 md:px-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div>
              <EmptyState
                title="Nothing here yet"
                message="You don't have any bookmarked (saved) blogs."
                action="/#explore_blogs"
                actionText="Add Bookmark"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8 mt-8 md:mt-10 md:px-4">
              {blogs.map((blog) => (
                <div key={blog._id} className="animate-on-scroll">
                  <BlogCard blog={blog} showBookmark />
                </div>
              ))}
            </div>
          )}

           {blogs.length > 0 && hasNextPage && (
            <div ref={loadMoreRef} className="h-10" aria-hidden="true" />
          )}

          {/* Loading next page */}
          {isFetchingNextPage && (
            <div className="py-6 text-center">Loading more blogs...</div>
          )}
        </section>
      </main>
    </div>
  );
}

export default LikedBlog;
