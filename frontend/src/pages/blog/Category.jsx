import { useEffect, useState } from "react";

import CategoryBadge from "../../components/blog/CategoryBadge";
import ErrorState from "../../components/ui/ErrorState";
import { useSearchedblogs } from "../../features/blog/blogQueries";
import { useCategories, usePopularCategory } from "../../features/category/categoryQueries";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { getErrorMessage } from "../../utils/errorHandler";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import BlogCardSkeleton from "../../components/blog/BlogCardSkeleton";
import BlogCard from "../../components/blog/BlogCard";
import EmptyState from "../../components/ui/EmptyState";
import { useNavigate, useParams } from "react-router-dom";
import Select from "../../components/ui/Select";

function Category() {
  const navigate = useNavigate();
  const { categorySlug } = useParams();

  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");

  const { data: categoryData } = usePopularCategory();

  const {
    blogs,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchedblogs(categorySlug ? { categorySlug } : null);

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  useScrollAnimation({
    trigger: blogs.length,
  });

  const { data: categoriesData, isPending: isCategoriesPending } = useCategories();

  const categories = categoriesData?.data?.categories ?? [];

  const categoryOptions = categories.map((category) => ({
    value: category.slug,
    label: category.name,
  }));

  // Keep select synchronized with URL
  useEffect(() => {
    setSelectedCategorySlug(categorySlug ?? "");
  }, [categorySlug]);

  // Scroll to blogs only when a category exists
  useEffect(() => {
    if (!categorySlug) return;

    const element = document.getElementById("blogs");

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [categorySlug]);

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  const handleFilter = () => {
    if (!selectedCategorySlug) return;

    navigate(`/category/${selectedCategorySlug}`);
  };

  if (isError) {
    return (
      <ErrorState
        title="Unable to load blogs."
        message={getErrorMessage(error)}
        onRetry={refetch}
      />
    );
  }

  const hasCategory = Boolean(categorySlug);

  return (
    <div className="bg-background text-text-primary max-w-7xl sm:mt-5">
      <main>
        <div className="mt-4 px-2 md:px-4">
          <h1 className="text-primary font-heading mb-8 px-3 text-4xl font-semibold">
            Popular Category
          </h1>

          {/* Popular Categories */}
          <div className="grid grid-cols-2 gap-5 px-2 sm:grid-cols-3 lg:grid-cols-4">
            {categoryData?.data?.categories?.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => handleCategoryClick(category.slug)}
                className="group border-border bg-surface hover:border-primary/40 hover:bg-primary/5 relative flex h-32 items-center justify-center overflow-hidden rounded-2xl border px-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95"
              >
                {/* Decorative background */}
                <div className="bg-primary/10 absolute -top-8 -right-8 h-24 w-24 rounded-full transition-transform duration-300 group-hover:scale-150" />

                <CategoryBadge
                  category={category?.name}
                  className="relative rounded-lg px-4 py-2 text-center text-lg transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>

          {/* Filter */}
          <div className="border-border bg-surface mt-10 rounded-2xl border p-4 shadow-sm sm:p-5">
            <h2 className="text-text-primary font-semibold">Filter Category</h2>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <Select
                value={selectedCategorySlug}
                onChange={(e) => setSelectedCategorySlug(e.target.value)}
                options={categoryOptions}
                placeholder={isCategoriesPending ? "Loading categories..." : "Select category"}
                disabled={isCategoriesPending}
                className="h-12 w-full sm:flex-1"
              />

              <button
                type="button"
                disabled={!selectedCategorySlug}
                onClick={handleFilter}
                className="bg-primary h-12 w-full rounded-lg px-12 text-sm font-medium whitespace-nowrap text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Blogs */}
          <section id="blogs" className="scroll-mt-24">
            {!hasCategory ? (
              <EmptyState
                title="Select a category"
                message="Choose a category above to view its blogs."
              />
            ) : isPending ? (
              <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 md:px-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <BlogCardSkeleton key={index} />
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <EmptyState
                title="Nothing here yet"
                message="No blog found related to this category."
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

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="h-10" />

          {isFetchingNextPage && <div className="py-6 text-center">Loading more blogs...</div>}
        </div>
      </main>
    </div>
  );
}

export default Category;
