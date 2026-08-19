import api from "../../api/axios.js";

export const createComment = async ({blogId, commentData}) => {
    const response = await api.post(`/blog/${blogId}/comment`, commentData);
    return response.data;
};

export const updateComment = async ({commentId, commentData}) => {
    const response = await api.patch(`/comment/${commentId}`, commentData);
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await api.delete(`/comment/${commentId}`);
    return response.data;
};

export const getComments = async ({ blogId, page = 1 }) => {
    const response = await api.get(`/blog/${blogId}/comment`,
        {
            params: {
                page
            }
        }
    );
    return response.data;
};

export const getReplies = async ({
    parentCommentId,
    page = 1
}) => {

    const response = await api.get(
        `/comment/${parentCommentId}/replies`,
        {
            params: {
                page
            }
        }
    );

    return response.data;
};

export const pinComment = async (commentId) => {
    const response = await api.patch(`/comment/${commentId}/pin`);
    return response.data;
};

export const hideComment = async (commentId) => {
    const response = await api.patch(`/comment/${commentId}/hidden`);
    return response.data;
};