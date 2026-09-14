import { Route, Routes } from "react-router-dom";

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
import VerifyRegistedEmail from "../pages/auth/VerifyRegisteredEmail.jsx";
import VerificationEmailResult from "../pages/auth/VerificationEmailResult.jsx";
import ChangePassword from "../pages/auth/ChangePassword.jsx";

import MainLayout from "../layouts/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import Contact from "../pages/profile/Contact.jsx";
import Category from "../pages/blog/Category.jsx";
import Search from "../pages/blog/Search.jsx";
import Profile from "../pages/profile/Profile.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Overview from "../pages/dashboard/Overview.jsx";
import AllBlog from "../pages/blog/AllBlog.jsx";
import PublishedBlog from "../pages/blog/PublishedBlog.jsx";
import DraftBlog from "../pages/blog/DraftBlog.jsx";
import LikedBlog from "../pages/blog/LikedBlog.jsx";
import BookmarkedBlog from "../pages/blog/BookmarkedBlog.jsx";
import VerifyDeleteBlogOTP from "../pages/blog/VerifyDeleteBlogOTP.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth Routes */}

      <Route element={<AuthLayout />}>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-login" element={<SendLoginEmailOtp />} />
          <Route path="/verify-login-otp" element={<VerifyLoginEmailOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/register/verify-email"
            element={<VerifyRegistedEmail />}
          />
          <Route
            path="/register/verify-email/:token"
            element={<VerificationEmailResult />}
          />
        </Route>
      </Route>

      {/* Oauth Success Route */}
      <Route path="/oauth/success" element={<OAuthSuccess />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
        {/* Blogs Routes */}
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/dashboard/blogs" element={<AllBlog />} />
            <Route
              path="/dashboard/blogs/published"
              element={<PublishedBlog />}
            />
            <Route path="/dashboard/blogs/drafts" element={<DraftBlog />} />
            <Route path="/dashboard/liked" element={<LikedBlog />} />
            <Route path="/dashboard/bookmarked" element={<BookmarkedBlog />} />
            <Route
              path="/dashboard/verify-email"
              element={<VerifyDeleteBlogOTP />}
            />
            <Route
              path="/dashboard/blogs/create"
              element={<Overview />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
