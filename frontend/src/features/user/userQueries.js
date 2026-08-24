import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../constants/queryKeys.js";
import { getCurrentUser } from "./userService.js";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CURRENT_USER,
    queryFn: getCurrentUser,
    retry: false, // we don't want to retry the request if it fails, because we want to log out the user if the request fails
    refetchOnWindowFocus: false, // we don't want to refetch the data when the window is focused, because we want to log out the user if the request fails
  });
};