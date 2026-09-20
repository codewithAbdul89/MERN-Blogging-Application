import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import Loader from "../components/ui/Loader.jsx";

function ProtectedRoute() {
  const location = useLocation();
  const { authStatus } = useSelector((state) => state.auth);

  if (authStatus === "unauthenticated") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <>
      <Outlet />

      {authStatus === "loading" && <Loader />}
    </>
  );
}

export default ProtectedRoute;
