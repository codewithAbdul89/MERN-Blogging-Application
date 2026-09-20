import { useEffect, useState } from "react";
import ErrorState from "../../components/ui/ErrorState";
import { useSearchedblogs } from "../../features/blog/blogQueries";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { getErrorMessage } from "../../utils/errorHandler";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import BlogCardSkeleton from "../../components/blog/BlogCardSkeleton";
import BlogCard from "../../components/blog/BlogCard";
import EmptyState from "../../components/ui/EmptyState";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import { useDebounce } from "../../hooks/useDebounce";

function Category() {
  const navigate = useNavigate();

  const [textSearch, setTextSearch] = useState("");

  const { debounceValue: debouncedSearch } = useDebounce({
    value: textSearch,
    delay: 300,
  });

  useEffect(() => {
    if (!debouncedSearch) {
      navigate("/search", { replace: true });
      return;
    }

    navigate(`/search/${encodeURIComponent(debouncedSearch)}`, {
      replace: true,
    });
  }, [debouncedSearch, navigate]);

  const {
    blogs,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchedblogs(debouncedSearch ? { textSearch: debouncedSearch } : null);

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  useScrollAnimation({
    trigger: blogs.length,
  });

  const hasSearch = Boolean(debouncedSearch);

  useEffect(() => {
    if (!debouncedSearch) return;

    const element = document.getElementById("blogs");

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [debouncedSearch]);

  if (isError) {
    <ErrorState
      title="Unable to load  blogs."
      message={getErrorMessage(error)}
      onRetry={refetch}
    />;
  }
  return (
    <div className="bg-backgroxund text-text-primary max-w-7xl sm:mt-5">
      <main>
        <div className="mt-4 px-2 md:px-4">
          <h1 className="text-primary font-heading mb-8 px-3 text-4xl font-semibold">
            Search Any Blog
          </h1>

          {/* Filter */}
          <div className="border-border bg-surface/30 mt-6 rounded-2xl border p-4 shadow sm:p-5">
            <h2 className="text-text-primary font-semibold">Text</h2>

            <div className="mt-4 w-full">
              <Input
                placeholder="e.g Imran Khan"
                className="h-12 w-full dark:bg-black/50"
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
              />
            </div>
          </div>
          <section id="blogs" className="scroll-mt-24">
            {!hasSearch ? (
              <EmptyState title="Search for a blog" message="Start typing above to find blogs." />
            ) : isPending ? (
              <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 md:px-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <BlogCardSkeleton key={index} />
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <EmptyState
                title="Nothing here yet"
                message={`No blog found for "${debouncedSearch}".`}
              />
            ) : (
              <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 md:px-4">
                {blogs.map((blog) => (
                  <div key={blog._id} className="animate-on-scroll">
                    <BlogCard blog={blog} showBookmark />
                  </div>
                ))}
              </div>
            )}
          </section>

          <div ref={loadMoreRef} className="h-10" />

          {/* Loading next page */}
          {isFetchingNextPage && <div className="py-6 text-center">Loading more blogs...</div>}
        </div>
      </main>
    </div>
  );
}

export default Category;
