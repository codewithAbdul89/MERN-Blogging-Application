import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import Loader from "../components/ui/Loader.jsx";

function ProtectedRoute() {
    const { authStatus } = useSelector(
        (state) => state.auth
    );

    if (authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Outlet /> 

            {authStatus === "loading" && <Loader />}
        </>
    );
}

export default ProtectedRoute;