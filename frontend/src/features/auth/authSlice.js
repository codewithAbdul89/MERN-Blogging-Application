import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setCredentials: (state, action) => {
            state.user = action.payload.user,
                state.accessToken = action.payload.accessToken,
                state.isAuthenticated = true
        },

        updateAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken
        },

        logOut: (state) => {
            state.user = null,
                state.accessToken = null,
                state.isAuthenticated = false
        }

    }
});

export const { setCredentials, updateAccessToken, logOut } = authSlice.actions;

export default authSlice.reducer;