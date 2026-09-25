import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiFileText, FiPlus } from "react-icons/fi";

import AnimatedNumber from "../../components/ui/AnimatedNumber";
import AnimatedText from "../../components/ui/AnimatedText";
import { useBlogStats } from "../../features/blog/blogQueries";
import Loader from "../../components/ui/Loader";
import { errorHandler } from "../../utils/errorHandler";
import ErrorState from "../../components/ui/ErrorState";

function Overview() {
  const { user } = useSelector((state) => state.auth);

  const { data: response, isPending, isError, error, refetch } = useBlogStats();

  const getPlainText = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
  };

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        message={errorHandler(error)}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="text-text-primary max-w-full px-2 pb-10 sm:max-w-7xl sm:px-8">
      <h1 className="font-heading mt-10 text-center text-3xl font-bold tracking-wider md:text-5xl">
        Welcome Back,{" "}
        <span className="text-primary block py-2 wrap-break-word md:inline md:p-0">
          {" "}
          <AnimatedText text={user?.userName || ""} />
        </span>
      </h1>

      <h2 className="text-text-secondary mt-5 p-1 text-center text-xl">
        Here's what's happening with your blog!
      </h2>
      {/* Quick Actions */}
      <div>
        <h3 className="it tracki mx-1 mt-7 px-2 py-1 text-2xl font-semibold">Quick Action</h3>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 px-6 text-white md:mt-10 md:flex-row md:gap-19 md:pl-15">
          <Link
            to="/dashboard/blogs/create"
            className="bg-primary/80 hover:bg-primary/70 flex w-full items-center justify-center rounded-lg p-2"
          >
            <div className="flex w-36 items-center gap-2">
              <FiPlus size={18} />
              <span>Create Blog</span>
            </div>
          </Link>

          <Link
            to="/dashboard/blogs"
            className="bg-primary/80 hover:bg-primary/70 flex w-full items-center justify-center rounded-lg p-2"
          >
            <div className="flex w-36 items-center gap-2">
              <FiFileText size={18} />
              <span>My Blogs</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}

      <div className="mt-10 grid grid-cols-2 justify-items-center gap-7 md:mt-15 md:grid-cols-4">
        <StatCard value={response?.data?.totalBlogsCount} label="Blogs" />
        <StatCard value={response?.data?.draftBlogsCount ?? 0} label={"Drafts"} />
        <StatCard value={response?.data?.publishedBlogsCount ?? 0} label={"Published"} />
        <StatCard value={response?.data?.totalLikesCount ?? 0} label={"Likes"} />
      </div>

      {/* Recent Blogs */}
      {response?.data?.recentBlogs?.length > 0 && (
        <div className="mt-10">
          <h3 className="font-heading mx-1 my-7 px-2 py-1 text-2xl tracking-wider">Recent Blogs</h3>

          <div className="border-primary/50 overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-primary/30 border-b">
                  <th className="text-text-primary w-[35%] px-4 py-3 text-left text-sm font-semibold">
                    Blog Title
                  </th>

                  <th className="text-text-primary w-[15%] px-4 py-3 text-left text-sm font-semibold">
                    Status
                  </th>

                  <th className="text-text-primary w-[50%] px-4 py-3 text-left text-sm font-semibold">
                    Content
                  </th>
                </tr>
              </thead>

              <tbody>
                {response?.data?.recentBlogs?.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-primary/30 hover:bg-surface/70 border-b last:border-b-0"
                  >
                    {/* Title */}
                    <td className="text-text-primary px-4 py-3 text-left">
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="hover:text-primary block max-w-42.5 truncate font-medium md:max-w-62.5"
                      >
                        {blog.title}
                      </Link>
                    </td>

                    {/* Status */}
                    <td className="text-text-primary px-4 py-3 text-left text-sm whitespace-nowrap">
                      {blog.status}
                    </td>

                    {/* Content */}
                    <td className="text-text-primary px-4 py-3 text-left">
                      <p className="max-w-70 truncate md:max-w-125">{getPlainText(blog.content)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Overview;

const StatCard = ({ value, label }) => {
  return (
    <div className="border-primary/50 bg-surface flex h-26 w-30 flex-col items-center justify-center rounded-lg border p-4 transition-transform hover:scale-105">
      <span className="text-text-primary text-2xl font-bold">
        {" "}
        <AnimatedNumber value={value} />
      </span>

      <span className="text-text-secondary mt-1 text-sm font-semibold whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};
