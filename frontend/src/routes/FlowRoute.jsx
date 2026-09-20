import { Navigate, Outlet, useLocation } from "react-router-dom";

function FlowRoute({ flow }) {
  const location = useLocation();

  const allowedFlow = location.state?.flow === flow;

  if (!allowedFlow) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default FlowRoute;
