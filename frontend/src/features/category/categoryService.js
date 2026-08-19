import api from "../../api/axios.js";

export const createCategory = async (categoryData) => {
    const response = await api.post('/category/', categoryData);
    return response.data;
};

export const updateCategory = async ({categoryId, categoryData}) => {
    const response = await api.patch(`/category/${categoryId}`, categoryData);
    return response.data;
};
  
export const deleteCategory = async (categoryId) => {
    const response = await api.delete(`/category/${categoryId}`);
    return response.data;
};

export const getAllCategories = async () => {
    const response = await api.get('/category/');
    return response.data;
};