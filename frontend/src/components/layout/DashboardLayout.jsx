import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

import DashboardSidebar from "../layout/DashboardSidebar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close dashboard menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          />

          <DashboardSidebar mobile onClose={() => setSidebarOpen(false)} />
        </>
      )}

      {/* Main Content */}
      <main className="min-w-0 flex-1 ">
        {/* Mobile Dashboard Header */}
        <div className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/95 px-5 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open dashboard menu"
            className="rounded-lg p-2 text-text-secondary transition hover:bg-surface hover:text-text-primary"
          >
            <FiMenu size={22} />
          </button>

          <h1 className="ml-3 text-base font-semibold text-text-primary">
            Dashboard
          </h1>
        </div>

        {/* Page */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
