import { useParams } from "react-router-dom";
import { FiMapPin, FiCalendar, FiBookOpen, FiHeart, FiCheck } from "react-icons/fi";

import BlogCard from "../../components/blog/BlogCard";
import BlogCardSkeleton from "../../components/blog/BlogCardSkeleton";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";

import { useGetUserProfile } from "../../features/blog/blogQueries";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { getErrorMessage } from "../../utils/errorHandler";
import { formatDate } from "../../utils/formatDate";
import Loader from "../../components/ui/Loader.jsx";
import { useTheme } from "../../hooks/useTheme.js";
import { useScrollAnimation } from "../../hooks/useScrollAnimation.js";
import AnimatedNumber from "../../components/ui/AnimatedNumber.jsx";

function UserProfile() {
  const { userId } = useParams();

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserProfile(userId);

  const user = data?.pages[0]?.data?.userData;
  const stats = data?.pages[0]?.data?.userStats;

  const blogs = data?.pages?.flatMap((page) => page?.data?.blogs ?? []) ?? [];

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  useScrollAnimation({
    trigger: blogs.length,
  });

  const { currentTheme } = useTheme();

  const cardImageSrc =
    currentTheme === "dark"
      ? "https://i.ibb.co/VY8p6zTC/card1.png"
      : "https://i.ibb.co/FbJGMQt7/card3.png";

  if (isError) {
    return (
      <ErrorState
        title="Unable to load profile"
        message={getErrorMessage(error)}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="bg-background text-text-primary">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile header  */}

        <section className="border-border bg-surface overflow-hidden rounded-2xl border shadow-sm">
          {/* Cover */}
          <div className="relative h-36 sm:h-40">
            <img
              src={cardImageSrc}
              alt="Profile cover"
              className="bg-primary/10 h-full w-full object-cover"
            />
          </div>

          {/* Profile content */}
          <div className="relative px-5 pb-4 sm:px-8">
            {/* Profile picture */}
            <div className="-mt-16 flex justify-center sm:-mt-24 sm:justify-start">
              <div className="border-surface bg-surface h-50 w-50 overflow-hidden rounded-full border-[5px] shadow-xl">
                <Avatar
                  src={user?.profilePic?.url}
                  userName={user?.userName}
                  className="h-full w-full object-cover text-7xl"
                />
              </div>
            </div>

            {/* User information */}
            <div className="mt-5 text-center sm:mt-4 sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
                  {user?.userName || "User"}
                </h1>

                {user?.role === "ADMIN" && (
                  <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium">
                    Admin
                  </span>
                )}
              </div>

              {user?.bio && (
                <p className="text-text-secondary mx-auto mt-2 max-w-2xl text-sm leading-6 sm:mx-0 sm:text-base">
                  {user.bio}
                </p>
              )}

              {/* User meta */}
              <div className="mt-3 flex flex-wrap justify-center gap-2.5 sm:justify-start">
                {user?.address?.city && (
                  <div className="border-border bg-background text-text-secondary inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs sm:text-sm">
                    <FiMapPin className="text-primary shrink-0" />

                    <span>
                      {[user.address.city, user.address.province, user.address.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}

                {user?.createdAt && (
                  <div className="border-border bg-background text-text-secondary inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs sm:text-sm">
                    <FiCalendar className="text-primary shrink-0" />

                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Profile statistics */}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={<FiBookOpen size={20} />} label="Total Blogs" value={stats?.totalBlogs} />

          <StatCard icon={<FiCheck size={20} />} label="Published" value={stats?.publishedBlogs} />

          <StatCard icon={<FiHeart size={20} />} label="Total Likes" value={stats?.totalLikes} />
        </section>

        {/* Published Blogs */}
        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-text-primary text-2xl font-bold">Published Blogs</h2>

            <p className="text-text-muted mt-1 text-sm">
              Articles published by {user?.userName || "this user"}.
            </p>
          </div>

          {isPending ? (
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 md:px-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div>
              <EmptyState
                title="Nothing here yet"
                message="This user has not published any blogs yet."
                action="/"
                actionText="Back to Home"
              />
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 md:px-4">
              {blogs.map((blog) => (
                <div key={blog._id} className="animate-on-scroll">
                  <BlogCard blog={blog} showBookmark />
                </div>
              ))}
            </div>
          )}

          {/* Infinite scroll */}
          {blogs.length > 0 && hasNextPage && (
            <div ref={loadMoreRef} className="h-10" aria-hidden="true" />
          )}

          {isFetchingNextPage && (
            <div className="py-8 text-center">
              <p className="text-text-muted text-sm">Loading more blogs...</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="border-border bg-surface flex items-center gap-4 rounded-2xl border p-5 shadow-sm">
      <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
        {icon}
      </div>

      <div>
        <p className="text-text-primary text-2xl font-bold">
          <AnimatedNumber value={value} />
        </p>

        <p className="text-text-muted text-sm">{label}</p>
      </div>
    </div>
  );
}

export default UserProfile;
