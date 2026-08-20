import api from "./api";

export const registerUser = async (payload) => {
  const response = await api.post("/auth/registro", payload);

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};
