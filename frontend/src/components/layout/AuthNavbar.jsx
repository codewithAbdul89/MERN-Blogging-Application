import { Link, useLocation } from "react-router-dom";

import Logo from "../ui/logo.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

const AuthNavbar = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/register";

  return (
    <nav className="bg-primary-light flex justify-between items-center pl-2  pr-3 duration-400 transition-all rounded sm:px-8 ">
      <div>
        <Logo className="h-18 rounded-lg p-1 sm:h-16" loading="eager" />
      </div>

      <div className="flex items-center  gap-5 sm:gap-8 sm:mr-5">
        {isLoginPage && (
          <Link
            to="/register"
            className="bg-background px-4 py-2 rounded-full text-primary font-semibold hover:text-primary-hover hover:opacity-60 duration-200  transition-all"
          >
            SignUp
          </Link>
        )}

        {isSignupPage && (
          <Link
            to="/login"
            className="bg-background px-4 py-2 rounded-full text-primary font-semibold hover:text-primary-hover hover:opacity-60 duration-200  transition-all"
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
