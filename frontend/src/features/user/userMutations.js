import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";


import { handleMutationError } from "../../utils/errorHandler.js";
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

        onError: handleMutationError,

        onSuccess: (data) => {
            data.message
        }

    })

};

export const useUpdateProfilePicture = () => {

    return useMutation({

        mutationFn: updateProfilePicture,

        onError: handleMutationError,

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

        onError: handleMutationError,

        onSuccess: (data) => {
            data.message
        }

    })

};

export const useSendDeleteAccountOtp = () => {

    return useMutation({

        mutationFn: sendDeleteAccountOtp,

        onError: handleMutationError,

        onSuccess: (data) => {
            data.message
        }

    })

};

export const useVerifyDeleteAccountOtp = () => {

    return useMutation({

        mutationFn: verifyDeleteAccountOtp,

        onError: handleMutationError,

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

        onError: handleMutationError,

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