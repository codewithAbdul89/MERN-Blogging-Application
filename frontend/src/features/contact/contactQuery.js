import api from "../../api/axios";

export const sendContactMessage = async (data) => {
  const response = await api.post("/contact", data);

  return response.data;
};
