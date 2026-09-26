import toast from "react-hot-toast";

export const getErrorMessage = (error) => {
  const message =
    error?.response?.data?.message || error?.message || "Something went wrong.";

  const status = error?.response?.status;

  return message

  // return status ? `${message} (${status})` : message;
};

export const errorHandler = (error) => {
  toast.error(getErrorMessage(error));
};
