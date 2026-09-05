import api from "../../api/axios.js";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.patch("/auth/change-password", passwordData);
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh-token");
  return response.data;
};

export const resendVerificationEmail = async (emailData) => {
  const response = await api.post("/auth/resend-verification-email", emailData);
  return response.data;
};

export const verifyRegisterEmail = async (token) => {
  const response = await api.post(`/auth/verify-email/${token}`);
  return response.data;
};

export const forgotPassword = async (passwordData) => {
  const response = await api.post("/auth/forgot-password", passwordData);
  return response.data;
};

export const resetPassword = async ({ token, newPassword }) => {
  console.log("token, newPassword : ", token, newPassword);
  const response = await api.post(`/auth/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};

export const googleLogin = () => {
  const width = 500;
  const height = 600;

  // left Mean how much far from left side of window(desktop) screen
  // window.screenX It tells you how far the browser window is from the left edge of the desktop/physical screen.
  // window.outerWidth total width of chrome(browser) screen

  const left = window.screenX + (window.outerWidth - width) / 2;
  //top mean how much bottom from the top of window(desktop) screen
  const top = window.screenY + (window.outerHeight - height) / 2;

  window.open(
    `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
    "GoogleLogin",
    `width=${width},height=${height},left=${left},top=${top}`,
  );
};

export const githubLogin = () => {
  const width = 500;
  const height = 500;

  const top = window.screenY + (window.outerHeight - height) / 2;
  const left = window.screenX + (window.outerWidth - width) / 2;

  window.open(
    `${import.meta.env.VITE_API_BASE_URL}/auth/github`,
    "GithubLogin",
    `width=${width},height=${height},left=${left},top=${top}`,
  );
};

export const emailLogin = async (credentials) => {
  const response = await api.post(`/auth/send-email-login-otp`, credentials);
  return response.data;
};

export const verifyEmailOtp = async ({ otp }) => {
  const response = await api.post(`/auth/verify-email-login-otp`, otp);
  return response.data;
};
