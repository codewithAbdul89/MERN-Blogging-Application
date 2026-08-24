import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,

    // loading | authenticated | unauthenticated | error
    authStatus: "loading",
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        // Login
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            state.authStatus = "authenticated";
        },

        // Authentication initialization after page refresh
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.authStatus = "authenticated";
        },

        updateAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
        },

        // User is definitely NOT logged in
        logOut: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.authStatus = "unauthenticated";
        },

        // Server/network problem while checking authentication
        setAuthError: (state) => {
            state.authStatus = "error";
        },
    },
});

export const {
    setCredentials,
    setUser,
    updateAccessToken,
    logOut,
    setAuthError,
} = authSlice.actions;

export default authSlice.reducer;