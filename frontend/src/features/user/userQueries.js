import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../constants/queryKeys.js";
import { getCurrentUser } from "./userService.js";

export const useCurrentUser = () => {

    return useQuery({
        queryKey: QUERY_KEYS.CURRENT_USER,
        queryFn: getCurrentUser
    });

};