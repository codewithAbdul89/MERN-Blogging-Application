import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { IoIosHome } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { CiLogin } from "react-icons/ci";
import { IoIosLock } from "react-icons/io";

import ThemeToggle from "../ui/ThemeToggle.jsx";
import Dropdown from "../ui/Dropdown.jsx";
import Avatar from "../ui/Avatar.jsx";
import Logout from "../../pages/auth/Logout.jsx";
import { LuContact } from "react-icons/lu";
function DesktopNavbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const imageUrl = user?.profilePic?.url?.startsWith("http")
    ? user.profilePic.url
    : `http://localhost:5000${user?.profilePic?.url}`;
  return (
    <div className="hidden md:flex text-text-primary">
      <ul className="flex items-center justify-between gap-2 sm:gap-5  font-semibold">
        {/* common Links */}
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `group flex items-center justify-center gap-1 px-3 py-1.5 rounded-full
     transition-all duration-200 ${isActive ? "text-white/90 ring-[1.8px] ring-white bg-primary/70" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <IoIosHome
                  className={`transition-all duration-200 ${
                    isActive
                      ? "opacity-100 w-4"
                      : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-4"
                  }
        `}
                />
                Home
              </>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/category"
            className={({ isActive }) =>
              `group flex items-center justify-center gap-1 px-3 py-1.5 rounded-full
     transition-all duration-200 ${isActive ? "text-white/90 ring-[1.8px] ring-white bg-primary/70" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <BiCategory
                  className={`transition-all duration-200 ${
                    isActive
                      ? "opacity-100 w-4"
                      : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-4"
                  }
        `}
                />
                Category
              </>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `group flex items-center justify-center gap-1 px-3 py-1.5 rounded-full
     transition-all duration-200 ${isActive ? "text-white/90 ring-[1.8px] ring-white bg-primary/70" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <IoIosSearch
                  className={`transition-all duration-200 ${
                    isActive
                      ? "opacity-100 w-4"
                      : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-4"
                  }
        `}
                />
                Search
              </>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `group flex items-center justify-center gap-1 px-3 py-1.5 rounded-full
     transition-all duration-200 ${isActive ? "text-white/90 ring-[1.8px] ring-white bg-primary/70" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <LuContact
                  className={`transition-all duration-200 ${
                    isActive
                      ? "opacity-100 w-4"
                      : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-4"
                  }
        `}
                />
                Contact
              </>
            )}
          </NavLink>
        </li>
        {/* Authenticated Only */}
        {isAuthenticated ? (
          <>
            {/* Dashboard */}
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `group flex items-center justify-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 ${isActive ? "text-white/90 ring-[1.8px] ring-white bg-primary/70" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <MdOutlineSpaceDashboard
                      className={`transition-all duration-200 ${
                        isActive
                          ? "opacity-100 w-4"
                          : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-4"
                      }
        `}
                    />
                    Dashboard
                  </>
                )}
              </NavLink>
            </li>
            {/* DropDown */}
            <li>
              <Dropdown
                trigger={
                  <div className="flex justify-center items-center px-1 py-1.5 gap-2  transition-colors duration-200 ">
                    <Avatar src={imageUrl} size="sm" />
                    <span className="text-sm">
                      {user?.userName.split(" ")[0]}
                    </span>
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
            </li>
          </>
        ) : (
          <>
            {/*  Unauthenticated Only */}
            <li>
              <Link
                to="/login"
                className="group flex items-center justify-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200"
              >
                <IoIosLock className="transition-all duration-200 opacity-0 w-0 group-hover:opacity-100 group-hover:w-4" />
                Login
              </Link>
            </li>

            <li>
              <Link
                to="/sigup"
                className="group flex items-center justify-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200"
              >
                <CiLogin className="transition-all duration-200 opacity-0 w-0 group-hover:opacity-100 group-hover:w-4" />
                Register
              </Link>
            </li>
          </>
        )}
        {/* Theme Toggle */}
        <li className="flex justify-center items-center">
          <ThemeToggle className="text-[25px] text-text-primary" />
        </li>
      </ul>
    </div>
  );
}

export default DesktopNavbar;
