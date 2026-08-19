import { useMutation } from "@tanstack/react-query";

import { handleMutationError } from "../../utils/errorHandler.js";
import {
    changePassword,
    forgotPassword,
    login,
    logout,
    resendVerificationEmail,
    resetPassword,
    signup,
    verifyEmail
} from "./authService.js";
import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice.js";
import { showSuccess } from "../../utils/toast.js";

export const useLogin = () => {

    const dispatch = useDispatch();

    return useMutation({
        mutationFn: login,

        onError: handleMutationError,

        onSuccess: (data) => {
            dispatch(
                setCredentials(data)
            )

            onSuccess: (data) => {
                showSuccess(data.message)
            }

        }

    });
};

export const useSignup = () => {

    return useMutation({
        mutationFn: signup,

        onError: handleMutationError,

        onSuccess: (data) => {
            data.message
        }

    });
};

export const useLogout = () => {

    const dispatch = useDispatch();

    return useMutation({
        mutationFn: logout,

        onError: handleMutationError,

        onSuccess: (data) => {
            dispatch(logOut());

            showSuccess(data.message);
        }

    });
};

export const useChangePassword = () => {

    return useMutation({
        mutationFn: changePassword,

        onError: handleMutationError,

        onSuccess: (data) => {
            data.message
        }

    });
};

export const useResendVerificationEmail = () => {

    return useMutation({
        mutationFn: resendVerificationEmail,

        onError: handleMutationError,

        onSuccess: (data) => {
            data.message
        }

    });
};

export const useVerifyEmail = () => {

    return useMutation({
        mutationFn: verifyEmail,

        onError: handleMutationError,

        onSuccess: (data) => {
            data.message
        }

    });
};

export const useForgotPassword = () => {

    return useMutation({
        mutationFn: forgotPassword,

        onError: handleMutationError,

        onSuccess: (data) => {
            data.message
        }

    });
};
// token, passwordData
export const useResetPassword = () => {

    return useMutation({
        mutationFn: resetPassword,

        onError: handleMutationError,

        onSuccess: (data) => {
            data.message
        }

    });
};