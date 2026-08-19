import api from "../../api/axios.js";

export const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
};


export const signup = async (userData) => {
    const response = await api.post("/auth/signup", userData);
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


export const resendVerificationEmail = async (emailData) => {
    const response = await api.post("/auth/resend-verification-email", emailData);
    return response.data;
};

export const verifyEmail = async (token) => {
    const response = await api.post(`/auth/verify-email/${token}`);
    return response.data;
};


export const forgotPassword = async (passwordData) => {
    const response = await api.post("/auth/forgot-password", passwordData);
    return response.data;
};


export const resetPassword = async ({token, passwordData}) => {
    const response = await api.post(`/auth/reset-password/${token}`, passwordData);
    return response.data;
};

export const googleLogin = () => {
    window.location.href =
        `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
};

export const githubLogin = () => {
    window.location.href =
        `${import.meta.env.VITE_API_BASE_URL}/auth/github`;
};