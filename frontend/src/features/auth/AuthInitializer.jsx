import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useCurrentUser } from "../user/userQueries.js";
import { setUser, logOut, setAuthError } from "./authSlice.js";
import { errorHandler } from "../../utils/errorHandler.js";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { data, isError, error } = useCurrentUser();

  useEffect(() => {
    if (data?.data?.user) {
      dispatch(setUser(data.data.user));
    } else if (isError) {
      const statusCode = error?.response?.status;

      const hadSession = localStorage.getItem("hasSession") === "1";

      if (statusCode === 401) {
        if (hadSession) {
          errorHandler(error);
        }
        dispatch(logOut());
        localStorage.removeItem("hasSession");
        return;
      }

      errorHandler(error);
      dispatch(setAuthError());
    }
  }, [data, isError, dispatch]);

  return children;
}
export default AuthInitializer;
