import Skeleton from "../ui/Skelton.jsx";

const BlogCardSkeleton = () => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white px-6">

            {/* Featured Image */}
            <Skeleton className="h-48 w-full rounded-none" />

            <div className="space-y-4 p-5">

                {/* Category */}
                <Skeleton className="h-6 w-24" />

                {/* Title */}
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">

                    <Skeleton className="h-10 w-10 rounded-full" />

                    <div className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>

                </div>

            </div>

        </div>
    );
};

export default BlogCardSkeleton;

//  {isLoading ? (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <BlogCardSkeleton key={index} />
//           ))}
//         </div>
//       ) : (
//         <BlogGrid blogs={blogs} />
//       )}