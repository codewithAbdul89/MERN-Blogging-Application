import { useQuery } from "@tanstack/react-query";
import { verifyResetToken } from "./authService";

export const useVerifyResetToken = (token) => {
  return useQuery({
    queryKey: ["resetPasswordToken", token],
    queryFn: () => verifyResetToken(token),
    enabled: !!token,
    retry: false,
  });
};
