import { Link, useLocation } from "react-router-dom";

import Logo from "../ui/logo.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

const AuthNavbar = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/register";

  return (
    <nav className="bg-primary-light flex justify-between items-center duration-400 transition-all rounded pl-2 pr-4  sm:px-5 ">
      <div>
        <Logo className="h-18 rounded-lg p-1 sm:h-16" loading="eager" />
      </div>

      <div className="flex items-center  gap-7 sm:mr-5">
        <Link
          to="/"
          className="hidden bg-background  rounded-full text-primary sm:text-sm hover:text-white/80 hover:opacity-60 duration-300  transition-all hover:bg-primary px-3 py-1.5 sm:block"
        >
          Home
        </Link>

        {isLoginPage && (
          <Link
            to="/register"
            className="bg-background rounded-full text-primary sm:text-sm hover:text-white/80 hover:opacity-60 duration-300  transition-all hover:bg-primary px-3 py-1.5"
          >
            SignUp
          </Link>
        )}

        {isSignupPage && (
          <Link
            to="/login"
            className="bg-background px-3 py-1.5 rounded-full text-primary sm:text-sm hover:text-white/80 hover:opacity-60 duration-300  transition-all hover:bg-primary"
          >
            Login
          </Link>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
};

export default AuthNavbar;


