import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import OAuthSuccess from "../pages/auth/OAuthSuccess.jsx";
import EmailLogin from "../pages/auth/EmailLogin.jsx";
import LoginOtp from "../pages/auth/LoginOTP.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}

      <Route element={<AuthLayout />}>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-login" element={<EmailLogin />} />
          <Route path="/verify-login-otp" element={<LoginOtp />} />
        </Route>
      </Route>

      {/* Oauth Success */}
      <Route path="/oauth/success" element={<OAuthSuccess />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
