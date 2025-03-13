import api from "./api";

// Obtener todos los usuarios
export const getContacts = async () => {
  const response = await api.get("/contacs");
  return response.data;
};

// Crear usuario
export const createContact = async (userData) => {
  const response = await api.post("/createcontact", userData);
  return response.data;
};

// Actualizar usuario
export const updateContact = async (id, userData) => {
  const response = await api.put(`/contacts/${id}`, userData);
  return response.data;
};

// Eliminar usuario
export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

// obtener roles 

export const getRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};
