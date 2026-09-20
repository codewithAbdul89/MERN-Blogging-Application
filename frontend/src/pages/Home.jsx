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
      <ErrorState
        title="Unable to load blogs"
        message={getErrorMessage(error)}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="bg-background max-w-7xl text-text-primary mt-8 sm:mt-10">
      {/* Top Section */}
      <section
        id="top"
        className="px-6 flex items-center justify-between  md:px-18"
      >
        {/* Text */}
        <div>
          {/* heading */}
          <h1 className="text-5xl font-heading tracking-wider leading-13">
            Share your <span className="block text-primary">thoughts.</span>
            Inspire the world.
          </h1>

          <p className="text-lg text-text-secondary max-w-md mt-7 ">
            <AnimatedText
              time="0.05"
              text=" Abdul's BlogSpace is a space where ideas come to life—share your  knowledge, express your thoughts, explore new perspectives, and inspire others."
            />
          </p>

          <div className="flex justify-center items-center mt-7 gap-8 md:justify-start  md:px-4">
            <Link to="/dashboard/blogs"
              href="#explore_blogs"
              className="w-32 text-center whitespace-nowrap px-3 py-2 rounded-lg bg-primary/70 text-white hover:bg-primary/50 "
            >
              My Blogs
            </Link>
            {isAuthenticated ? (
              <Link
                to="/dashboard/blogs/create"
                className="w-32 whitespace-nowrap  px-3 text-center py-2 rounded-lg shadow  border border-primary/10 hover:opacity-70 dark:border-primary/70 "
              >
                Create Blog
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-32 whitespace-nowrap  px-3 text-center text-text-primary/70 py-2 rounded-lg shadow  border border-primary/10 hover:opacity-70 dark:border-primary/70 font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        <div className="px-10">
          <img
            src="https://i.ibb.co/FLpbgQTJ/image.png"
            className="hidden md:block "
            loading="eager"
            alt="Main_Image"
          />
        </div>
      </section>

      {/* Blogs Section */}
      <main>
        <section className="mt-10 mb-4 px-2.5" id="explore_blogs">
          <h1 className="text-4xl text-primary font-heading px-3 mb-3 font-semibold md:px-8 ">
            Latest Blogs
          </h1>

          <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8  mt-10 md:px-4 ">
            {isPending
              ? Array.from({ length: 6 }).map((_, index) => (
                  <BlogCardSkeleton key={index} />
                ))
              : blogs.map((blog) => (
                  <div key={blog._id} className="animate-on-scroll">
                    <BlogCard blog={blog} showBookmark />
                  </div>
                ))}
          </div>

          <div ref={loadMoreRef} className="h-10" />

          {/* Loading next page */}
          {isFetchingNextPage && (
            <div className="py-6 text-center">Loading more blogs...</div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
