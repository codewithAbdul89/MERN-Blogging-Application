import axios from "axios";
import { axiosContext } from "./axiosContext.js";
import { updateAccessToken, logOut } from "../features/auth/authSlice.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// Dependency Injection

api.interceptors.request.use(
    (config) => {//config mean baseURL,Credentials,headers which we can modify in the request interceptor
        const token = axiosContext.getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(config);

        return config;
    },

    (error) => {
        return Promise.reject(error)
    }
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            try {

                originalRequest._retry = true;

                const response = await api.post("/auth/refresh-token");

                axiosContext.dispatch(updateAccessToken(response.data.accessToken));

                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
                return api(originalRequest);

            } catch (error) {

                axiosContext.dispatch(logOut());

                return Promise.reject(error);
            }

        }

        return Promise.reject(error)
    }
);

export default api;