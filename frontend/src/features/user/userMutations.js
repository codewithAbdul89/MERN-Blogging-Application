import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";


import { errorHandler } from "../../utils/errorHandler.js";
import {
    deleteAccount,
    removeProfilePicture,
    sendDeleteAccountOtp,
    updateProfile,
    updateProfilePicture,
    verifyDeleteAccountOtp,
} from "./userService.js";
import { logOut } from "../auth/authSlice.js";
import { QUERY_KEYS } from "../../constants/queryKeys.js";
import { showSuccess } from "../../utils/toast.js";


export const useUpdateProfile = () => {

    return useMutation({

        mutationFn: updateProfile,

        onError: errorHandler,

        onSuccess: (data) => {
            data.message
        }

    })

};

export const useUpdateProfilePicture = () => {

    return useMutation({

        mutationFn: updateProfilePicture,

        onError: errorHandler,

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.CURRENT_USER
            });

            showSuccess(data.message);
        }

    })

};

export const useRemoveProfilePicture = () => {

    return useMutation({

        mutationFn: removeProfilePicture,

        onError: errorHandler,

        onSuccess: (data) => {
            data.message
        }

    })

};

export const useSendDeleteAccountOtp = () => {

    return useMutation({

        mutationFn: sendDeleteAccountOtp,

        onError: errorHandler,

        onSuccess: (data) => {
            data.message
        }

    })

};

export const useVerifyDeleteAccountOtp = () => {

    return useMutation({

        mutationFn: verifyDeleteAccountOtp,

        onError: errorHandler,

        onSuccess: (data) => {
            data.message
        }

    })

};

export const useDeleteAccount = () => {

    const queryClient = useQueryClient();

    const dispatch = useDispatch()

    return useMutation({

        mutationFn: deleteAccount,

        onError: errorHandler,

        onSuccess: (data) => {

            queryClient.removeQueries({
                queryKey: QUERY_KEYS.CURRENT_USER
            });

            dispatch(logOut())
            // to keep in sigup page
            window.location.href = "/signup"

            showSuccess(data.message)
        }

    })

};