import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { errorHandler } from "../../utils/errorHandler.js";
import {
  deleteAccount,
  removeProfilePicture,
  sendDeleteAccountOtp,
  updateBio,
  updateProfile,
  updateProfilePicture,
  verifyDeleteAccountOtp,
} from "./userService.js";
import { logOut } from "../auth/authSlice.js";
import { QUERY_KEYS } from "../../constants/queryKeys.js";
import { showSuccess } from "../../utils/toast.js";

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfilePicture,

    onError: errorHandler,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CURRENT_USER,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BLOGS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMENTS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REPLIES_ROOT,
      });

      showSuccess(data?.message || "Profile picture updated successfully.");
    },
  });
};

export const useRemoveProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProfilePicture,

    onError: errorHandler,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CURRENT_USER,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BLOGS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMENTS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REPLIES_ROOT,
      });

      showSuccess(data?.message || "Profile picture removed successfully.");
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onError: errorHandler,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CURRENT_USER,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BLOGS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMENTS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REPLIES_ROOT,
      });

      showSuccess(data?.message || "Profile updated successfully.");
    },
  });
};

export const useSendDeleteAccountOtp = () => {
  return useMutation({
    mutationFn: sendDeleteAccountOtp,

    onError: errorHandler,

    onSuccess: (data) => {
      showSuccess(data?.message);
    },
  });
};

export const useVerifyDeleteAccountOtp = () => {
  return useMutation({
    mutationFn: verifyDeleteAccountOtp,

    onError: errorHandler,

    onSuccess: (data) => {
      data.message;
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  return useMutation({
    mutationFn: deleteAccount,

    onError: errorHandler,

    onSuccess: (data) => {
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.CURRENT_USER,
      });

      dispatch(logOut());

      showSuccess(data.message);
    },
  });
};

export const useUpdateBio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBio,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CURRENT_USER,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BLOGS_ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROFILE_ROOT,
      });

      showSuccess(data?.message || "Bio updated successfully.");
    },

    onError: errorHandler,
  });
};
