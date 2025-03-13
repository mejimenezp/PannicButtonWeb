import api from "./api";

// Obtener todos los usuarios
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Crear usuario
export const createUser = async (userData) => {
  const response = await api.post("/createuser", userData);
  return response.data;
};

// Actualizar usuario
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

// Eliminar usuario
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// obtener servicios 

export const getServices = async () => {
  const response = await api.get("/servicios");
  return response.data;
};