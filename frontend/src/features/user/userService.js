import api from "../../api/axios.js";

export const getCurrentUser = async () => {
    const response = await api.get('/user/me');
    return response.data;
}; 

export const updateProfile = async (userData) => {
    const response = await api.patch('/user/update-profile', userData);
    return response.data;
};

export const updateProfilePicture = async (pictureData) => {
    const response = await api.patch('/user/profile-picture', pictureData);
    return response.data;
};

export const removeProfilePicture = async () => {
    const response = await api.delete('/user/profile-picture');
    return response.data;
};

export const sendDeleteAccountOtp = async () => {
    const response = await api.post('/user/send-delete-account-otp');
    return response.data;
};

export const verifyDeleteAccountOtp = async (otp) => {
    const response = await api.post('/user/verify-delete-account-otp', { otp });
    return response.data;
};

export const deleteAccount = async () => {
    const response = await api.delete('/user/delete-account');
    return response.data;
};