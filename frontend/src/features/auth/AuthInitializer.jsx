import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useCurrentUser } from "../user/userQueries.js";
import ErrorState from "../../components/ui/ErrorState.jsx";
import { setUser, logOut, setAuthError } from "./authSlice.js";

import { errorHandler, getErrorMessage } from "../../utils/errorHandler.js";
import Loader from "../../components/ui/Loader.jsx";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  const authStatus = useSelector((state) => state.auth.authStatus);

  const { data, isPending, isError, error, refetch } = useCurrentUser();

  useEffect(() => {
    // setUser
    if (data?.data?.user) {
      dispatch(setUser(data.data.user));
      return;
    }

    if (isError) {
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
  }, [data, isError, error, dispatch]);

  // Authentication is still being determined
  if (isPending || authStatus === "loading") {
    return <Loader />;
  }
  // handle authentication initialization failure
  if (authStatus === "error") {
    return (
      <ErrorState
        title="Unable to initialize authentication"
        error={getErrorMessage(error)}
        onRetry={refetch}
      />
    );
  }

  return children;
}

export default AuthInitializer;
