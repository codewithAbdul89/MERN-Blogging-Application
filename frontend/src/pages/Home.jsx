import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import BlogCardSkeleton from "../components/blog/BlogCardSkeleton";
import BlogCard from "../components/blog/BlogCard";
import AnimatedText from "../components/ui/AnimatedText";
import { useBlogs } from "../features/blog/blogQueries";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import ErrorState from "../components/ui/ErrorState";
import { getErrorMessage } from "../utils/errorHandler";

function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const {
    blogs,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBlogs();

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
      <ErrorState title="Unable to load blogs" message={getErrorMessage(error)} onRetry={refetch} />
    );
  }

  return (
    <div className="bg-background text-text-primary mt-8 max-w-7xl sm:mt-10">
      {/* Top Section */}
      <section id="top" className="flex items-center justify-between px-6 md:px-18">
        {/* Text */}
        <div>
          {/* heading */}
          <h1 className="font-heading text-5xl leading-13 tracking-wider">
            Share your <span className="text-primary block">thoughts.</span>
            Inspire the world.
          </h1>

          <p className="text-text-secondary mt-7 max-w-md text-lg">
            <AnimatedText
              time="0.05"
              text=" Abdul's BlogSpace is a space where ideas come to life—share your  knowledge, express your thoughts, explore new perspectives, and inspire others."
            />
          </p>

          <div className="mt-7 flex items-center justify-center gap-8 md:justify-start md:px-4">
            <Link
              to="/dashboard/blogs"
              href="#explore_blogs"
              className="bg-primary/70 hover:bg-primary/50 w-32 rounded-lg px-3 py-2 text-center whitespace-nowrap text-white"
            >
              My Blogs
            </Link>
            {isAuthenticated ? (
              <Link
                to="/dashboard/blogs/create"
                className="border-primary/10 dark:border-primary/70 w-32 rounded-lg border px-3 py-2 text-center whitespace-nowrap shadow hover:opacity-70"
              >
                Create Blog
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-text-primary/70 border-primary/10 dark:border-primary/70 w-32 rounded-lg border px-3 py-2 text-center font-semibold whitespace-nowrap shadow hover:opacity-70"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        <div className="px-10">
          <img
            src="https://i.ibb.co/FLpbgQTJ/image.png"
            className="hidden md:block"
            loading="eager"
            alt="Main_Image"
          />
        </div>
      </section>

      {/* Blogs Section */}
      <main>
        <section className="mt-10 mb-4 px-2.5" id="explore_blogs">
          <h1 className="text-primary font-heading mb-3 px-3 text-4xl font-semibold md:px-8">
            Latest Blogs
          </h1>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 md:px-4">
            {isPending
              ? Array.from({ length: 6 }).map((_, index) => <BlogCardSkeleton key={index} />)
              : blogs.map((blog) => (
                  <div key={blog._id} className="animate-on-scroll">
                    <BlogCard blog={blog} showBookmark />
                  </div>
                ))}
          </div>

          {blogs.length > 0 && hasNextPage && (
            <div ref={loadMoreRef} className="h-10" aria-hidden="true" />
          )}

          {/* Loading next page */}
          {isFetchingNextPage && <div className="py-6 text-center">Loading more blogs...</div>}
        </section>
      </main>
    </div>
  );
}

export default Home;
