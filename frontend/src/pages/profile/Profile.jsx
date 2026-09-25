import { FiBookOpen, FiCalendar, FiCheck, FiHeart, FiMail, FiMapPin, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";

import Loader from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import Avatar from "../../components/ui/Avatar";
import { formatDate } from "../../utils/formatDate";
import { useBlogStats } from "../../features/blog/blogQueries";
import AnimatedNumber from "../../components/ui/AnimatedNumber";
import { useTheme } from "../../hooks/useTheme";

function Profile() {
  const { user } = useSelector((state) => state.auth);

  const { data: BlogStats, isError } = useBlogStats();

  const { currentTheme } = useTheme();

  const cardImageSrc =
    currentTheme === "dark"
      ? "https://i.ibb.co/VY8p6zTC/card1.png"
      : "https://i.ibb.co/FbJGMQt7/card3.png";

  // loader

  if (!user || isError) {
    return (
      <ErrorState
        title="Profile not available"
        message="We couldn't load your profile information. Please try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  //    User data

  const userName = user?.userName || "User";

  const totalLikes = BlogStats?.data?.totalLikesCount ?? 0;

  const totalBlogs = BlogStats?.data?.totalBlogsCount ?? 0;

  const publishedBlogs = BlogStats?.data?.publishedBlogsCount ?? 0;

  const location = [user.address?.city, user.address?.province, user.address?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page heading  */}

        <div className="mb-6">
          <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
            Profile
          </h1>

          <p className="text-text-secondary mt-1 text-sm">
            View your profile information and account details.
          </p>
        </div>

        {/* Profile header  */}

        <section className="border-border bg-surface overflow-hidden rounded-2xl border shadow-sm">
          {/* Cover */}

          <img
            src={cardImageSrc}
            alt="cardImage"
            className="bg-primary/10 h-32 w-full object-cover sm:h-40"
          />

          {/* Profile information */}

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:gap-10">
              {/* Profile picture  */}

              <div className="h-40 w-40 shrink-0 sm:h-40 sm:w-40">
                <div className="border-surface bg-background h-full w-full overflow-hidden rounded-full border-4 shadow-md">
                  <Avatar
                    src={user?.profilePic?.url}
                    userName={userName}
                    className="h-full w-full object-cover text-6xl"
                  />
                </div>
              </div>

              {/* Name */}

              <div className="pb-1">
                <h2 className="text-text-primary text-2xl font-bold">{userName}</h2>

                <p className="text-text-secondary mt-1 text-sm">{user?.email}</p>
              </div>
            </div>

            {/* Bio */}

            <div className="mt-5">
              <p className="text-text-secondary max-w-2xl text-sm leading-6">
                {user.bio || "No bio added yet."}
              </p>
            </div>
          </div>
        </section>

        {/* Profile statistics */}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ProfileStat icon={<FiBookOpen size={20} />} label="Total Blogs" value={totalBlogs} />

          <ProfileStat icon={<FiCheck size={20} />} label="Published" value={publishedBlogs} />

          <ProfileStat icon={<FiHeart size={20} />} label="Total Likes" value={totalLikes} />
        </section>

        {/* Account information*/}

        <section className="border-border bg-surface mt-6 rounded-2xl border p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h3 className="text-text-primary text-lg font-semibold">Account Information</h3>

            <p className="text-text-secondary mt-1 text-sm">Your account and profile details.</p>
          </div>

          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Username */}

            <ProfileInfo icon={<FiUser size={18} />} label="Username" value={userName} />

            {/* Email */}

            <ProfileInfo icon={<FiMail size={18} />} label="Email" value={user.email} />

            {/* Member since */}

            <ProfileInfo
              icon={<FiCalendar size={18} />}
              label="Member Since"
              value={formatDate(user?.createdAt)}
            />

            {/* Country */}

            <ProfileInfo
              icon={<FiMapPin size={18} />}
              label="Country"
              value={user.address?.country}
            />

            {/* Province */}

            <ProfileInfo
              icon={<FiMapPin size={18} />}
              label="Province / State"
              value={user.address?.province}
            />

            {/* City */}

            <ProfileInfo icon={<FiMapPin size={18} />} label="City" value={user.address?.city} />

            {/* Town */}

            <ProfileInfo
              icon={<FiMapPin size={18} />}
              label="Town / Area"
              value={user.address?.town}
            />

            {/* Email status */}

            <ProfileInfo
              icon={<FiMail size={18} />}
              label="Email Status"
              value={user.isEmailVerified ? "Verified" : "Not verified"}
              valueClassName={user.isEmailVerified ? "text-green-500" : "text-yellow-500"}
            />

            {/* Location summary */}

            <ProfileInfo icon={<FiMapPin size={18} />} label="Location" value={location} />
          </div>
        </section>
      </div>
    </div>
  );
}

/* Profile Stat                                                               */

function ProfileStat({ icon, label, value }) {
  return (
    <div className="border-border bg-surface rounded-2xl border p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
          {icon}
        </div>

        <div>
          <p className="text-text-muted text-xs font-medium">{label}</p>

          <p className="text-text-primary mt-0.5 text-xl font-bold">
            {" "}
            <AnimatedNumber value={value} />
          </p>
        </div>
      </div>
    </div>
  );
}

/* Profile Info                                                               */

function ProfileInfo({ icon, label, value, valueClassName = "text-text-primary" }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 text-primary mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-text-muted text-xs font-medium tracking-wide uppercase">{label}</p>

        <p className={`mt-1 text-sm font-medium wrap-break-word ${valueClassName}`}>
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default Profile;
