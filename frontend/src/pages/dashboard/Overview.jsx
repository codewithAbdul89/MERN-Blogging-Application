import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiFileText, FiPlus } from "react-icons/fi";

import AnimatedNumber from "../../components/ui/AnimatedNumber";
import AnimatedText from "../../components/ui/AnimatedText";
import { useBlogStats } from "../../features/blog/blogQueries";
import Loader from "../../components/ui/Loader";

function Overview() {
  const { user } = useSelector((state) => state.auth);

  const { data: response, isPending } = useBlogStats();

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="max-w-full sm:max-w-7xl text-text-primary pb-10">
      <h1 className="text-center text-3xl mt-10 font-bold font-heading tracking-wider md:text-5xl">
        Welcome Back,{" "}
        <span className="text-primary py-2 wrap-break-word block md:inline md:p-0">
          {" "}
          <AnimatedText text={user?.userName || ""} />
        </span>
      </h1>

      <h2 className="text-center text-xl p-1 mt-5 text-text-secondary">
        Here's what's happening with your blog!
      </h2>
      {/* Quick Actions */}
      <div>
        <h3 className="mt-7 px-2 mx-1 py-1 text-2xl  font-heading tracking-wider">
          Quick Actions
        </h3>
        <div className="flex justify-center mt-6 flex-col gap-3 items-center  text-white px-6 md:flex-row md:mt-10 md:gap-19 md:pl-15">
          <Link
            to="/dashboard/blogs/create"
            className="flex items-center justify-center rounded-lg p-2 bg-primary/80 hover:bg-primary/70 w-full "
          >
            <div className="flex w-36 items-center gap-2">
              <FiPlus size={18} />
              <span>Create Blog</span>
            </div>
          </Link>

          <Link
            to="/dashboard/blogs"
            className="flex items-center justify-center rounded-lg p-2 bg-primary/80 hover:bg-primary/70 w-full "
          >
            <div className="flex w-36 items-center gap-2">
              <FiFileText size={18} />
              <span>My Blogs</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}

      <div className="mt-10 grid grid-cols-2 gap-7 justify-items-center md:grid-cols-4 md:mt-15 ">
        <StatCard value={response?.data?.totalBlogsCount} label="Total Blogs" />
        <StatCard
          value={response?.data?.draftBlogsCount ?? 0}
          label={"Drafts"}
        />
        <StatCard
          value={response?.data?.publishedBlogsCount ?? 0}
          label={"Published"}
        />
        <StatCard
          value={response?.data?.totalLikesCount ?? 0}
          label={"Likes"}
        />
      </div>

      {/* Recent blogs */}

      {/* Recent Blogs */}
      {response?.data?.recentBlogs?.length > 0 && (
        <div className="mt-10">
          <h3 className="my-7 px-2 mx-1 py-1 text-2xl  font-heading tracking-wider">
            Recent Blogs
          </h3>

          <div className="overflow-x-auto rounded-lg border border-primary/50">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-primary/30">
                  <th className="w-[35%] px-4 py-3 text-left text-sm font-semibold text-text-primary">
                    Blog Title
                  </th>

                  <th className="w-[15%] px-4 py-3 text-left text-sm font-semibold text-text-primary">
                    Status
                  </th>

                  <th className="w-[50%] px-4 py-3 text-left text-sm font-semibold text-text-primary">
                    Content
                  </th>
                </tr>
              </thead>

              <tbody>
                {response?.data?.recentBlogs?.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b border-primary/30 last:border-b-0 hover:bg-surface/70"
                  >
                    {/* Title */}
                    <td className="px-4 py-3 text-left text-text-primary">
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="block max-w-42.5 truncate font-medium hover:text-primary md:max-w-62.5"
                      >
                        {blog.title}
                      </Link>
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-4 py-3 text-left text-sm text-text-primary">
                      {blog.status}
                    </td>

                    {/* Content */}
                    <td className="px-4 py-3 text-left text-text-primary">
                      <div className="max-w-70 truncate md:max-w-125">
                        {/* {blog.content} */}
                        <AnimatedText text={blog.content || ""} />
                      </div>
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
    <div className="flex flex-col items-center justify-center rounded-lg border border-primary/50 bg-surface p-4 w-30 h-26 transition-transform hover:scale-105">
      <span className="text-2xl font-bold text-text-primary">
        {" "}
        <AnimatedNumber value={value} />
      </span>

      <span className="mt-1 text-sm text-text-secondary font-semibold">
        {label}
      </span>
    </div>
  );
};
