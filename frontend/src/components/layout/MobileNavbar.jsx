import { useEffect, useRef, useState } from "react";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { IoIosHome } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { useSelector } from "react-redux";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { LuContact } from "react-icons/lu";
import { CiImageOn, CiLogin } from "react-icons/ci";
import { IoIosLock } from "react-icons/io";

import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";
import Logout from "../../pages/auth/Logout";
import Avatar from "../ui/Avatar";
import Dropdown from "../ui/Dropdown";
import { useTheme } from "../../hooks/useTheme";
import useOutsideClick from "../../hooks/useOutsideClick";

function MobileNavbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { user } = useSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => {
    setMobileMenuOpen(false);
  });

  useEffect(() => {
    window.addEventListener("scroll", closeMobileMenu);

    return () => {
      window.removeEventListener("scroll", closeMobileMenu);
    };
  }, []);

  const { currentTheme } = useTheme();

  return (
    <>
      {/* Mobile Navbar Buttons */}
      <div className={`flex items-center md:hidden ${isAuthenticated ? "gap-2.5" : "gap-5 px-3"} `}>
        {/* Search */}
        <Link to="/search" onClick={() => setMobileMenuOpen(false)}>
          <IoIosSearch size={22} />
        </Link>

        <Button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="relative p-2"
          text={
            <span className="relative block h-6.25 w-6.25">
              <FiMenu
                size={22}
                className={`absolute inset-0 transition-all duration-200 ${
                  mobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
              />

              <FiX
                size={22}
                className={`absolute inset-0 transition-all duration-200 ${
                  mobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
              />
            </span>
          }
        />

        {isAuthenticated && (
          <Dropdown
            trigger={
              <div
                className="z-1000 flex items-center justify-center gap-1 py-1.5 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Avatar
                  src={user?.profilePic?.url}
                  userName={user?.userName}
                  className="text-xl"
                  size="sm"
                />
                <span className="text-sm">{user?.userName?.split(" ")[0]}</span>
              </div>
            }
          >
            <div className="bg-primary rounded-lg border border-gray-200 p-1 font-normal text-white/90 shadow-lg">
              <span className="block w-full px-3 py-1 text-left">
                {user?.userName}
                <p className="text-xs wrap-break-word">{user?.email}</p>
              </span>
              <hr />

              <Link
                to="/profile"
                className="hover:text-primary flex items-center gap-2 px-3 py-1 text-left font-normal transition-colors duration-200"
              >
                <RxAvatar />
                Profile
              </Link>

              <Link
                to="/user/update-profile#avatar"
                className="hover:text-primary flex items-center gap-2 py-1 pl-3 text-left font-normal whitespace-nowrap transition-colors duration-200"
              >
                <CiImageOn />
                Update Avatar
              </Link>

              <hr />
              <Logout />
            </div>
          </Dropdown>
        )}
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className={`text-text-primary bg-primary-light/90 absolute top-full right-0 left-0 z-50 rounded-b-xl border-t border-white backdrop-blur-2xl transition-all duration-300 md:hidden`}
        >
          {/* Home */}
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `${isActive ? " bg-primary/30 text-white/90" : ""} flex items-center gap-2 px-5 py-1 text-lg transition-all duration-200`
            }
          >
            <IoIosHome size={22} />
            Home
          </NavLink>
          {/* Category */}
          <NavLink
            to="/category"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `${isActive ? " bg-primary/30 text-white/90" : ""} flex items-center gap-2 px-5 py-1 text-lg transition-all duration-200`
            }
          >
            <BiCategory size={22} />
            Category
          </NavLink>
          {/* Contact */}
          <NavLink
            to="/contact"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `${isActive ? " bg-primary/30 text-white/90" : ""} flex items-center gap-2 px-5 py-1 text-lg transition-all duration-200`
            }
          >
            <LuContact size={22} />
            Contact
          </NavLink>
          {/* Search */}
          <NavLink
            to="/search"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `${isActive ? " bg-primary/30 text-white/90" : ""} flex items-center gap-2 px-5 py-1 text-lg transition-all duration-200`
            }
          >
            <IoIosSearch size={22} />
            Search
          </NavLink>

          <hr className="text-gray-400" />
          {isAuthenticated ? (
            <>
              {/* Dashboard */}
              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `${isActive ? " bg-primary/30 text-white/90" : ""} flex items-center gap-2 px-5 py-1 text-lg transition-all duration-200`
                }
              >
                <MdOutlineSpaceDashboard size={22} />
                Dashboard
              </NavLink>
              <hr className="text-gray-400" />
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className={`flex items-center gap-2 px-5 py-1 text-lg`}
              >
                <IoIosLock size={22} />
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className={`flex items-center gap-2 px-4.5 py-1 text-lg`}
              >
                <CiLogin size={22} />
                Register
              </Link>
              <hr className="text-gray-400" />
            </>
          )}

          {/* Theme Toggle */}

          <ThemeToggle
            className="flex w-full items-center gap-2 px-4.5 py-2 text-lg"
            onclickfun={closeMobileMenu}
            children={
              currentTheme === "dark" ? (
                <>
                  <FiSun size={22} />
                  Light Mode
                </>
              ) : (
                <>
                  <FiMoon size={22} />
                  Dark Mode
                </>
              )
            }
          />
        </div>
      )}
    </>
  );
}

export default MobileNavbar;
