import { useState } from "react";
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

function MobileNavbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { user } = useSelector((state) => state.auth);

  const imageUrl = user?.profilePic?.url?.startsWith("http")
    ? user.profilePic.url
    : `http://localhost:5000${user?.profilePic?.url}`;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const { currentTheme } = useTheme();

  return (
    <>
      {/* Mobile Navbar Buttons */}
      <div
        className={`flex md:hidden items-center  ${isAuthenticated ? "gap-2.5" : "gap-5 px-3"} `}
      >
        {/* Search */}
        <Link to="/search" onClick={() => setMobileMenuOpen(false)}>
          <IoIosSearch size={22} />
        </Link>

        <Button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="p-2 relative"
          text={
            <span className="relative block h-6.25 w-6.25">
              <FiMenu
                size={22}
                className={`absolute inset-0 transition-all duration-200 ${
                  mobileMenuOpen
                    ? "rotate-90 opacity-0"
                    : "rotate-0 opacity-100"
                }`}
              />

              <FiX
                size={22}
                className={`absolute inset-0 transition-all duration-200 ${
                  mobileMenuOpen
                    ? "rotate-0 opacity-100"
                    : "-rotate-90 opacity-0"
                }`}
              />
            </span>
          }
        />

        {isAuthenticated && (
          <Dropdown
            trigger={
              <div
                className="flex justify-center items-center  py-1.5 gap-1  transition-colors duration-200 z-1000"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Avatar src={imageUrl} size="sm" />
                <span className="text-sm">{user?.userName?.split(" ")[0]}</span>
              </div>
            }
          >
            <div className="bg-primary/80 dark:bg-primary/60 p-1 rounded-lg border border-gray-200  shadow-lg text-white/90 font-normal">
              <span className="block w-full px-3 py-1 text-left">
                {user?.userName}
                <p className="text-xs wrap-break-word">{user?.email}</p>
              </span>
              <hr />

              <Link
                to="/profile"
                className="px-3 py-1 text-left font-normal flex items-center gap-2 hover:text-primary transition-colors duration-200"
              >
                <RxAvatar />
                Profile
              </Link>

              <Link className="pl-3 py-1 text-left font-normal flex items-center gap-2 whitespace-nowrap hover:text-primary transition-colors duration-200">
                <CiImageOn />
                Update Image
              </Link>

              <hr />
              <Logout />
            </div>
          </Dropdown>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 z-50 md:hidden bg-primary-light/50 backdrop-blur-2xl border-t  border-white text-text-primary transition-all duration-300 ">
          {/* Home */}
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `${isActive ? " bg-primary/30 text-white/90" : ""} px-5 py-1 transition-all duration-200 flex  items-center  gap-2 text-lg `
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
              `${isActive ? " bg-primary/30 text-white/90" : ""} px-5 py-1 transition-all duration-200 flex  items-center  gap-2 text-lg `
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
              `${isActive ? " bg-primary/30 text-white/90" : ""} px-5 py-1 transition-all duration-200 flex  items-center  gap-2 text-lg `
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
              `${isActive ? " bg-primary/30 text-white/90" : ""} px-5 py-1 transition-all duration-200 flex  items-center  gap-2 text-lg `
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
                  `${isActive ? " bg-primary/30 text-white/90" : ""} px-5 py-1 transition-all duration-200 flex  items-center  gap-2 text-lg  `
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
                className={`px-5 py-1  flex  items-center  gap-2 text-lg  `}
              >
                <IoIosLock size={22} />
                Login
              </Link>

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className={`px-4.5 py-1  flex  items-center  gap-2 text-lg  `}
              >
                <CiLogin size={22} />
                Register
              </Link>
              <hr className="text-gray-400" />
            </>
          )}

          {/* Theme Toggle */}

          <ThemeToggle
            className="px-4.5 py-2  flex  items-center  gap-2 text-lg w-full"
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
