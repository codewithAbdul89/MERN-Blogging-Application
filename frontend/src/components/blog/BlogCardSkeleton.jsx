import Skeleton from "../ui/Skelton.jsx";

const BlogCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {/* Featured Image */}
      <Skeleton className="aspect-video w-full rounded-none" />

      <div className="space-y-4 p-5">
        {/* Category + Date */}
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-30" />
        </div>

        <div className="block md:hidden">
          {" "}
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>

        {/* Content / Excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 border-t border-border pt-2">
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between">
          {/* Likes + Comments */}
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-12" />
          </div>

          {/* View More */}
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
