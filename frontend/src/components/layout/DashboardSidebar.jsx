import { NavLink } from "react-router-dom";
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
import { useState } from "react";

function DashboardSidebar({ mobile = false, onClose }) {
  const [blogsOpen, setBlogsOpen] = useState(true);

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
    <aside
      className={
        mobile
          ? "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface shadow-xl"
          : "sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface"
      }
    >
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
        <div className="flex items-center gap-2">
          <FiGrid className="text-primary" size={22} />

          <span className="text-lg font-bold text-text-primary">Dashboard</span>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dashboard menu"
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary"
          >
            <FiX size={22} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {/* Main */}
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-placeholder">
            Main
          </p>

          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={navLinkClass}
              onClick={handleNavigation}
            >
              <FiHome size={18} />
              <span>Overview</span>
            </NavLink>

            {/* My Blogs */}
            <button
              type="button"
              onClick={() => setBlogsOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
            >
              <span className="flex items-center gap-3">
                <FiFileText size={18} />
                <span>My Blogs</span>
              </span>

              {blogsOpen ? (
                <FiChevronDown size={17} />
              ) : (
                <FiChevronRight size={17} />
              )}
            </button>

            {blogsOpen && (
              <div className="ml-5 space-y-1 border-l border-border pl-3">
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
              <span>Bookmarked</span>
            </NavLink>

            <NavLink
              to="/dashboard/liked"
              className={navLinkClass}
              onClick={handleNavigation}
            >
              <FiHeart size={18} />
              <span>Liked</span>
            </NavLink>
          </div>
        </div>

        {/* Account */}
        <div className="mt-8">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-placeholder">
            Account
          </p>

          <div className="space-y-1">
            <NavLink
              to="/profile"
              className={navLinkClass}
              onClick={handleNavigation}
            >
              <FiUser size={18} />
              <span>Profile</span>
            </NavLink>

            <NavLink
              to="/change-password"
              className={navLinkClass}
              onClick={handleNavigation}
            >
              <FiLock size={18} />
              <span>Change Password</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t border-border p-4">
        <NavLink
          to="/"
          className="flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-background hover:text-primary"
          onClick={handleNavigation}
        >
          ← Back to Website
        </NavLink>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
