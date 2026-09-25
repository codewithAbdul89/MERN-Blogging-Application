import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiPlus,
  FiBookmark,
  FiHeart,
  FiUser,
  FiLock,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiGrid,
} from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState } from "react";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useModal } from "../../hooks/useModal";
import { useSendDeleteAccountOtp } from "../../features/user/userMutations";

function DashboardSidebar({ mobile = false, onClose }) {
  const [blogsOpen, setBlogsOpen] = useState(true);

  const { isOpen, closeModal, openModal } = useModal();

  const navigate = useNavigate();

  const { mutateAsync: sendDeleteAccountOtp, isPending } = useSendDeleteAccountOtp();

  const handleNavigation = () => {
    if (mobile) {
      onClose?.();
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
    ${
      isActive
        ? "bg-primary text-white"
        : "text-text-secondary hover:bg-background hover:text-text-primary"
    }`;

  const subNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
    ${
      isActive
        ? "bg-primary/10 text-primary font-medium"
        : "text-text-secondary hover:bg-background hover:text-text-primary"
    }`;

  return (
    <>
      <aside
        className={
          mobile
            ? "border-border bg-surface fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r shadow-xl"
            : "border-border bg-surface flex h-full w-64 shrink-0 flex-col border-r"
        }
      >
        {/* Header */}
        <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-5">
          <div className="flex items-center gap-2">
            <FiGrid className="text-primary" size={22} />

            <span className="text-text-primary text-lg font-bold">Dashboard</span>
          </div>

          {mobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dashboard menu"
              className="text-text-secondary hover:bg-background hover:text-text-primary rounded-lg p-2 transition"
            >
              <FiX size={22} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {/* Main */}
          <div>
            <p className="text-text-placeholder mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
              Main
            </p>

            <div className="space-y-1">
              <NavLink to="/dashboard" end className={navLinkClass} onClick={handleNavigation}>
                <FiHome size={18} />
                <span>Overview</span>
              </NavLink>

              {/* My Blogs */}
              <button
                type="button"
                onClick={() => setBlogsOpen((prev) => !prev)}
                className="text-text-secondary hover:bg-background hover:text-text-primary flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-3">
                  <FiFileText size={18} />
                  <span>My Blogs</span>
                </span>

                {blogsOpen ? <FiChevronDown size={17} /> : <FiChevronRight size={17} />}
              </button>

              {blogsOpen && (
                <div className="border-border ml-5 space-y-1 border-l pl-3">
                  <NavLink
                    to="/dashboard/blogs"
                    end
                    className={subNavLinkClass}
                    onClick={handleNavigation}
                  >
                    All Blogs
                  </NavLink>

                  <NavLink
                    to="/dashboard/blogs/drafts"
                    className={subNavLinkClass}
                    onClick={handleNavigation}
                  >
                    Drafts
                  </NavLink>

                  <NavLink
                    to="/dashboard/blogs/published"
                    className={subNavLinkClass}
                    onClick={handleNavigation}
                  >
                    Published
                  </NavLink>
                </div>
              )}

              <NavLink
                to="/dashboard/blogs/create"
                className={navLinkClass}
                onClick={handleNavigation}
              >
                <FiPlus size={18} />
                <span>Create Blog</span>
              </NavLink>

              <NavLink
                to="/dashboard/bookmarked"
                className={navLinkClass}
                onClick={handleNavigation}
              >
                <FiBookmark size={18} />
                <span>Saved Blogs</span>
              </NavLink>

              <NavLink to="/dashboard/liked" className={navLinkClass} onClick={handleNavigation}>
                <FiHeart size={18} />
                <span>Liked</span>
              </NavLink>
            </div>
          </div>

          {/* Account */}
          <div className="mt-8">
            <p className="text-text-placeholder mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
              Account
            </p>

            <div className="space-y-1">
              <NavLink to="/user/update-profile" className={navLinkClass} onClick={handleNavigation}>
                <FiUser size={18} />
                <span>Update Profile</span>
              </NavLink>

              <NavLink to="/change-password" className={navLinkClass} onClick={handleNavigation}>
                <FiLock size={18} />
                <span>Change Password</span>
              </NavLink>

              <button
                to="/dashboard/delete-account"
                className="bg-danger flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-400"
                onClick={() => openModal()}
              >
                <RiDeleteBin6Line size={18} />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-border shrink-0 border-t p-4">
          <NavLink
            to="/"
            className="text-text-secondary hover:bg-background hover:text-primary flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition"
            onClick={handleNavigation}
          >
            ← Back to Website
          </NavLink>
        </div>
      </aside>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={closeModal}
        heading="Delete Account"
        message="Are you sure you want to delete your Account?"
        btnText="Delete"
        usePortal
        isPending={isPending}
        onBtnClick={async () => {
          try {
            await sendDeleteAccountOtp();
            navigate("/dashboard/delete-account", {
              state: {
                flow: "delete-account",
              },
            });
          } catch (error) {
            console.error("Delete account otp send error:", error);
          }
        }}
      />
    </>
  );
}

export default DashboardSidebar;
