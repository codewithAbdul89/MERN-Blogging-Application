import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "./contactQuery";
import { errorHandler } from "../../utils/errorHandler";
import { showSuccess } from "../../utils/toast";

export const useSendContactMessage = () => {
  return useMutation({
    mutationFn: sendContactMessage,
    onSuccess: (data) => showSuccess(data.message),
    onError: errorHandler,
  });
};
