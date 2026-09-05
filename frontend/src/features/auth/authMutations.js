import { useMutation } from "@tanstack/react-query";

import { errorHandler } from "../../utils/errorHandler.js";
import {
  changePassword,
  emailLogin,
  forgotPassword,
  login,
  logout,
  register,
  resendVerificationEmail,
  resetPassword,
  verifyRegisterEmail,
  verifyEmailOtp,
} from "./authService.js";
import { useDispatch } from "react-redux";
import { logOut, setCredentials } from "./authSlice.js";
import { showSuccess } from "../../utils/toast.js";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: login,

    onError: errorHandler,

    onSuccess: (response) => {
      sessionStorage.setItem("justLoggedIn", "1");
      localStorage.setItem("hasSession", "1");
      localStorage.removeItem("email")
      dispatch(setCredentials(response.data));
      showSuccess(response.message);
    },
  });
};

export const useEmailLogin = () => {
  return useMutation({
    mutationFn: emailLogin,

    onError: errorHandler,

    onSuccess: (response, variable) => {
      sessionStorage.setItem("email", JSON.stringify(variable));
      showSuccess(response.message);
    },
  });
};

export const useVerifyEmailOtp = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: verifyEmailOtp,

    onError: errorHandler,

    onSuccess: (response) => {
      sessionStorage.setItem("justLoggedIn", "1");
      localStorage.setItem("hasSession", "1");
      sessionStorage.removeItem("email");
      dispatch(setCredentials(response.data));
      showSuccess(response.message);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,

    onError: errorHandler,

    onSuccess: (response, variables) => {
      localStorage.setItem("email", variables.email);
      showSuccess(response.message);
    },
  });
};

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: resendVerificationEmail,

    onError: errorHandler,

    onSuccess: (response) => {
      showSuccess(response.message);
    },
  });
};

export const useVerifyRegisterEmail = () => {

  return useMutation({
    mutationFn: verifyRegisterEmail,

    onError: errorHandler,

    onSuccess: (response) => {
      localStorage.removeItem("email");
      showSuccess(response.message);
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: logout,

    onError: errorHandler,

    onSuccess: (response) => {
      dispatch(logOut());
      localStorage.removeItem("hasSession");
      sessionStorage.clear();
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,

    onError: errorHandler,

    onSuccess: (response) => {
      showSuccess(response.message);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,

    onError: errorHandler,

    onSuccess: (response) => {
      showSuccess(response.message);
    },
  });
};
// token, passwordData
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,

    onError: errorHandler,

    onSuccess: (response) => {
      showSuccess(response.message);
    },
  });
};
