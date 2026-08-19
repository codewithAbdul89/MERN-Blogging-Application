import api from "../../api/axios.js";

export const createBlog = async ({ blogData }) => {
    const response = await api.post("/blog", blogData);
    return response.data;
};

export const getBlogs = async (params) => {
    const response = await api.get("/blog/", {
        params
    });
    return response.data;
};

export const getSearchedBlogs = async (params) => {
    const response = await api.get("/blog/", {
        params
    });
    return response.data;
};

export const getSingleBlog = async (slug) => {
    const response = await api.get(`/blog/${slug}`);
    return response.data;
};

export const updateBlog = async ({ blogId, blogData }) => {
    const response = await api.patch(`/blog/${blogId}`, blogData);
    return response.data;
};

export const publishBlog = async ({ blogId }) => {
    const response = await api.patch(`/blog/${blogId}/publish`);
    return response.data;
};

export const unpublishBlog = async ({ blogId }) => {
    const response = await api.patch(`/blog/${blogId}/unpublish`);
    return response.data;
};

export const getMyBlogs = async (status) => {
    const response = await api.get(`/blog/my-blogs`, {
        params: {
            status
        }
    });
    return response.data;
};

export const pinBlog = async ({ blogId }) => {
    const response = await api.patch(`/blog/${blogId}/pin`);
    return response.data;
};

export const sendDeleteBlogOtp = async ({ blogId }) => {
    const response = await api.post(`/blog/send-delete-blog-otp/${blogId}`);
    return response.data;
};

export const verifyDeleteBlogOtp = async ({ otp }) => {
    const response = await api.post("/blog/verify-delete-blog-otp", { otp });
    return response.data;
};

export const deleteBlog = async ({ blogId }) => {
    const response = await api.delete(`/blog/${blogId}`);
    return response.data;
};


//Like Services

export const toggleLike = async ({ blogId }) => {
    const response = await api.patch(`/blog/${blogId}/like`);
    return response.data;
};

export const getLikedBlogs = async () => {
    const response = await api.get("/blog/liked-blogs");
    return response.data;
};

//Bookmark Service

export const toggleBookmark = async ({ blogId }) => {
    const response = await api.patch(`/blog/${blogId}/bookmark`);
    return response.data;
};

export const getBookmarkedBlogs = async () => {
    const response = await api.get("/blog/bookmarks");
    return response.data;
};