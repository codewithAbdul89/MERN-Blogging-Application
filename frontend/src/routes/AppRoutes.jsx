import { Route, Routes } from "react-router-dom";

import FlowRoute from "./FlowRoute.jsx";
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
import UpdateBlog from "../pages/blog/UpdateBlog.jsx";
import PublishedBlog from "../pages/blog/PublishedBlog.jsx";
import DraftBlog from "../pages/blog/DraftBlog.jsx";
import LikedBlog from "../pages/blog/LikedBlog.jsx";
import BookmarkedBlog from "../pages/blog/BookmarkedBlog.jsx";
import DeleteBlog from "../pages/blog/DeleteBlog.jsx";
import CreateBlog from "../pages/blog/CreateBlog.jsx";
import SingleBlog from "../pages/blog/SingleBlog.jsx";
import DeleteAccount from "../pages/blog/DeleteAccount.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {/* Tip  ? allow to render the commonet without parms part */}
        <Route path="/category/:categorySlug?" element={<Category />} />
        <Route path="/search/:textSearch?" element={<Search />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth Routes */}

      <Route element={<AuthLayout />}>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-login" element={<SendLoginEmailOtp />} />
          <Route element={<FlowRoute flow="verify-login-otp" />}>
            <Route path="/verify-login-otp" element={<VerifyLoginEmailOtp />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route element={<FlowRoute flow="register-verify-email" />}>
            <Route path="/register/verify-email" element={<VerifyRegistedEmail />} />
          </Route>
          <Route path="/register/verify-email/:token" element={<VerificationEmailResult />} />
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
          <Route path="/blog/:slug" element={<SingleBlog />} />
          {/* DashBoard Layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/dashboard/blogs" element={<AllBlog />} />
            <Route path="/dashboard/blogs/published" element={<PublishedBlog />} />
            <Route path="/dashboard/blogs/drafts" element={<DraftBlog />} />
            <Route path="/dashboard/liked" element={<LikedBlog />} />
            <Route path="/dashboard/bookmarked" element={<BookmarkedBlog />} />

            <Route element={<FlowRoute flow="delete-blog" />}>
              <Route path="/dashboard/delete-blog" element={<DeleteBlog />} />
            </Route>

            <Route element={<FlowRoute flow="delete-account" />}>
              <Route path="/dashboard/delete-account" element={<DeleteAccount />} />
            </Route>

            <Route path="/dashboard/blogs/create" element={<CreateBlog />} />
            <Route path="/dashboard/blog/edit/:blogId" element={<UpdateBlog />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
