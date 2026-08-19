import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useCurrentUser } from "../user/userQueries.js";
import { setCredentials, logOut } from "./authSlice.js";

function AuthInitializer() {

    const dispatch = useDispatch();

    const {
        data,
        isError
    } = useCurrentUser();

    useEffect(() => {

        if (data?.user) {
            dispatch(setCredentials(data));
        }

        if (isError) {
            dispatch(logOut());
        }

    }, [data, isError, dispatch]);

    return null;
}

export default AuthInitializer;