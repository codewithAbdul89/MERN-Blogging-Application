// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";
// import { Outlet } from "react-router-dom";

// import Loader from "../components/ui/Loader.jsx";
// import { showInfo } from "../utils/toast.js";

// function PublicRoute() {
//   const { authStatus } = useSelector((state) => state.auth);
//   const hadSession = localStorage.getItem("hasSession") === "1";

//   if (hadSession) {
//     showInfo("You are already logged in. Redirecting to home page.");
//   }

//   if (authStatus === "authenticated") {
//     return <Navigate to="/" replace />;
//   }

//   return (
//     <>
//       <Outlet />
//       {authStatus === "loading" && <Loader />}
//     </>
//   );
// }

// export default PublicRoute;



import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import Loader from "../components/ui/Loader.jsx";
import { showInfo } from "../utils/toast.js";

function PublicRoute() {
  const { authStatus } = useSelector((state) => state.auth);
  const [redirect, setRedirect] = useState(false);
 
  useEffect(() => {
    if (authStatus === "authenticated") {

      if (sessionStorage.getItem("justLoggedIn") === "1") {
        sessionStorage.removeItem("justLoggedIn");
      } else {
        showInfo("You are already logged in. Redirecting to home page.");
      }

      setRedirect(true);
    }
  }, [authStatus]);

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Outlet />
      {authStatus === "loading" && <Loader />}
    </>
  );
}

export default PublicRoute;