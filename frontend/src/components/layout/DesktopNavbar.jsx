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

  return (
    <div className="text-text-primary hidden md:flex">
      <ul className="flex items-center justify-between gap-2 font-semibold sm:gap-5">
        {/* common Links */}
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `group flex items-center justify-center gap-1 rounded-full px-3 py-1.5 transition-all duration-200 ${isActive ? "bg-primary/70 text-white/90 ring-[1.8px] ring-white" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <IoIosHome
                  className={`transition-all duration-200 ${
                    isActive
                      ? "w-4 opacity-100"
                      : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"
                  } `}
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
              `group flex items-center justify-center gap-1 rounded-full px-3 py-1.5 transition-all duration-200 ${isActive ? "bg-primary/70 text-white/90 ring-[1.8px] ring-white" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <BiCategory
                  className={`transition-all duration-200 ${
                    isActive
                      ? "w-4 opacity-100"
                      : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"
                  } `}
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
              `group flex items-center justify-center gap-1 rounded-full px-3 py-1.5 transition-all duration-200 ${isActive ? "bg-primary/70 text-white/90 ring-[1.8px] ring-white" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <IoIosSearch
                  className={`transition-all duration-200 ${
                    isActive
                      ? "w-4 opacity-100"
                      : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"
                  } `}
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
              `group flex items-center justify-center gap-1 rounded-full px-3 py-1.5 transition-all duration-200 ${isActive ? "bg-primary/70 text-white/90 ring-[1.8px] ring-white" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <LuContact
                  className={`transition-all duration-200 ${
                    isActive
                      ? "w-4 opacity-100"
                      : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"
                  } `}
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
                  `group flex items-center justify-center gap-1 rounded-full px-3 py-1.5 transition-all duration-200 ${isActive ? "bg-primary/70 text-white/90 ring-[1.8px] ring-white" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <MdOutlineSpaceDashboard
                      className={`transition-all duration-200 ${
                        isActive
                          ? "w-4 opacity-100"
                          : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"
                      } `}
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
                  <div className="flex items-center justify-center gap-2 px-1 py-1.5 transition-colors duration-200">
                    <Avatar
                      src={user?.profilePic?.url}
                      userName={user?.userName}
                      className="text-xl"
                      size="sm"
                    />
                    <span className="text-sm">{user?.userName.split(" ")[0]}</span>
                  </div>
                }
              >
                <div className="bg-primary/90 rounded-lg border border-gray-200 p-1 font-normal text-white/90 shadow-lg">
                  <span className="block w-full px-3 py-1 text-left">
                    {user?.userName}
                    <p className="text-xs wrap-break-word">{user?.email}</p>
                  </span>
                  <hr />

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-1 text-left font-normal transition-colors duration-200 hover:opacity-50"
                  >
                    <RxAvatar />
                    Profile
                  </Link>

                  <Link
                    className="flex items-center gap-2 py-1 pl-3 text-left font-normal whitespace-nowrap transition-colors duration-200 hover:opacity-50"
                    to="/user/update-profile#avatar"
                  >
                    <CiImageOn />
                    Update Avater
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
                className="group flex items-center justify-center gap-1 rounded-full px-3 py-1.5 transition-all duration-200"
              >
                <IoIosLock className="w-0 opacity-0 transition-all duration-200 group-hover:w-4 group-hover:opacity-100" />
                Login
              </Link>
            </li>

            <li>
              <Link
                to="/register"
                className="group flex items-center justify-center gap-1 rounded-full px-3 py-1.5 transition-all duration-200"
              >
                <CiLogin className="w-0 opacity-0 transition-all duration-200 group-hover:w-4 group-hover:opacity-100" />
                Register
              </Link>
            </li>
          </>
        )}
        {/* Theme Toggle */}
        <li className="flex items-center justify-center">
          <ThemeToggle className="text-text-primary text-[25px]" />
        </li>
      </ul>
    </div>
  );
}

export default DesktopNavbar;
