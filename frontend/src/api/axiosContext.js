let dispatch = null;
let getAccessToken = null;



export const setAxiosContext  = ({
    dispatch: reduxDispatch,
    getAccessToken: accessTokenGetter,
}) => {
    dispatch = reduxDispatch;
    getAccessToken = accessTokenGetter;
};


export const axiosContext  = {
    get dispatch() {
        return dispatch;
    },

    getAccessToken() {
        return getAccessToken?.();
    },
};