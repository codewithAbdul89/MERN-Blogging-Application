import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { showError } from "../utils/toast.js";

function ProfileCompleteRoute() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isProfileComplete =
    Boolean(user?.gender) &&
    Boolean(user?.cnic) &&
    Boolean(user?.contact) &&
    Boolean(user?.address?.country) &&
    Boolean(user?.address?.province) &&
    Boolean(user?.address?.city) &&
    Boolean(user?.address?.town);

  if (!isProfileComplete) {
    showError("Please complete your profile first.");
    return (
      <Navigate
        to="/user/update-profile"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProfileCompleteRoute;
