import ApiInstance from "../services/ApiInstance";

export const addUser = async (payload) => {
  return ApiInstance.post("/users/", payload);
};

export const updateUserPassword = async (id, data) => {
  const response = await ApiInstance.post(`/change-password/${id}/`, data);
  return response.data;
};
