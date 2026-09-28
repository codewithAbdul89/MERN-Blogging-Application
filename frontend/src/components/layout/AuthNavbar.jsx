import { Link, useLocation } from "react-router-dom";

import Logo from "../ui/logo.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

const AuthNavbar = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/register";

  return (
    <nav className="bg-primary-light/80 flex w-full items-center justify-between rounded-b-2xl border border-black/4 pr-4 pl-2 shadow-sm shadow-black/3 transition-all duration-400 sm:px-5 dark:border-white/6">
      <Link to="/" className="group flex items-center">
        <Logo
          className="h-18 rounded-lg p-1 transition-transform duration-300 ease-out group-active:scale-95 sm:h-16"
          loading="eager"
        />
      </Link>

      <div className="flex items-center gap-2 sm:mr-5 sm:gap-3">
        <Link
          to="/"
          className="text-primary/70 after:bg-primary/60 hover:text-primary focus-visible:text-primary relative hidden h-9 items-center px-3 text-sm font-medium transition-colors duration-300 ease-out after:absolute after:right-3 after:bottom-1.5 after:left-3 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:outline-none sm:flex"
        >
          Home
        </Link>

        {isLoginPage && (
          <Link
            to="/register"
            className="bg-primary shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/25 focus-visible:ring-primary/50 focus-visible:ring-offset-background flex h-9 items-center rounded-full px-4 text-sm font-medium text-white shadow-sm transition-all duration-300 ease-out hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
          >
            Register
          </Link>
        )}

        {isSignupPage && (
          <Link
            to="/login"
            className="bg-primary shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/25 focus-visible:ring-primary/50 focus-visible:ring-offset-background flex h-9 items-center rounded-full px-4 text-sm font-medium text-white shadow-sm transition-all duration-300 ease-out hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
          >
            Sign in
          </Link>
        )}

        <div className="bg-primary/10 ml-1 h-6 w-px" aria-hidden="true" />

        <ThemeToggle />
      </div>
    </nav>
  );
};

export default AuthNavbar;
