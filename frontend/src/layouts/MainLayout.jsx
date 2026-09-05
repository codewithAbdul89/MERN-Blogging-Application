import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      
      <Navbar />

      <main className="flex-1 px-1">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}

export default MainLayout;