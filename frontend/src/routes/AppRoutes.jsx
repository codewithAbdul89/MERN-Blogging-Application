import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import OAuthSuccess from "../pages/auth/OAuthSuccess.jsx";
import SendLoginEmailOtp from "../pages/auth/SendLoginEmailOtp.jsx";
import VerifyLoginEmailOtp from "../pages/auth/VerifyLoginEmailOtp.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}

      <Route element={<AuthLayout />}>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-login" element={<SendLoginEmailOtp />} />
          <Route path="/verify-login-otp" element={<VerifyLoginEmailOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
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
