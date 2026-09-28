import { useEffect, useState } from "react";
import Logo from "../ui/logo.jsx";
import DesktopNavbar from "./DesktopNavbar.jsx";
import MobileNavbar from "./MobileNavbar.jsx";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isDashboard =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/blog") ||
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/category");

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isDashboard) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDashboard, location]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out ${isScrolled ? " pt-2 sm:pt-3" : ""} `}
    >
      <nav
        className={`relative mx-auto flex items-center justify-between px-4 py-1 transition-all duration-500 ease-out sm:px-7 ${
          isScrolled
            ? `max-w-6xl rounded-3xl border border-white/20 bg-white/10 px-3 shadow-lg backdrop-blur-xl sm:rounded-full`
            : `bg-primary-light rounded-b-lg border-transparent shadow-none`
        } `}
      >
        {/* Logo */}
        <Logo className={`h-13 rounded-lg p-px sm:h-14`} loading="eager" />

        {/* Desktop */}
        <DesktopNavbar />

        <div className="md:hidden">
          {/* Mobile */}
          <MobileNavbar />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
