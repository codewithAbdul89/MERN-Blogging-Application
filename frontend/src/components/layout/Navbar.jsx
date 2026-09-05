import Logo from "../ui/logo.jsx";
import DesktopNavbar from "./DesktopNavbar.jsx";
import MobileNavbar from "./MobileNavbar.jsx";

function Navbar() {
  return (
    <nav className="relative bg-primary-light py-1 px-2 flex justify-between items-center sm:px-7">
      {/* Logo */}
      <Logo
        className="h-16 rounded-lg p-px sm:h-16"
        loading="eager"
      />

      {/* Desktop */}
      <DesktopNavbar />

      {/* Mobile */}
      <MobileNavbar />
    </nav>
  );
}

export default Navbar;
