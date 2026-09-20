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
  }, [isDashboard]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out ${isScrolled ? " sm:pt-3" : ""} `}
    >
      <nav
        className={`relative mx-auto flex items-center justify-between px-2 py-1 transition-all duration-500 ease-out sm:px-7 ${
          isScrolled
            ? `max-w-6xl rounded-t-2xl border border-white/20 bg-white/10 px-3 shadow-lg backdrop-blur-xl sm:rounded-full`
            : `bg-primary-light rounded-b-lg border-transparent shadow-none`
        } `}
      >
        {/* Logo */}
        <Logo
          className={`rounded-lg p-px ${isScrolled ? "h-14" : "h-16"} sm:h-13`}
          loading="eager"
        />

        {/* Desktop */}
        <DesktopNavbar />

        {/* Mobile */}
        <MobileNavbar />
      </nav>
    </header>
  );
}

export default Navbar;
