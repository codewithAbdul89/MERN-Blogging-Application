import { Outlet } from "react-router-dom";

import AuthNavbar from "../components/layout/AuthNavbar.jsx";
import { useTheme } from "../hooks/useTheme.js";

const AuthLayout = () => {
  const { currentTheme } = useTheme();

  const backgroundImage =
    currentTheme === "dark"
      ? "https://i.ibb.co/xqRgdsrZ/dark.jpg"
      : "https://i.ibb.co/KxYPJkFZ/lightf.jpg";

  return (
    <main
      className="min-h-screen bg-cover bg-no-repeat transition-all duration-400"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <AuthNavbar />

      <div className="flex w-full justify-center py-6 sm:py-8">
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
