import toast from "react-hot-toast";

export const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong."
    );
};

export const errorHandler = (error) => {
    toast.error(getErrorMessage(error));
};
