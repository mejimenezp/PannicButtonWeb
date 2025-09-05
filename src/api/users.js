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

export const getUserContacts = async (phone) => {
  const { data } = await api.get(`/contacts/${phone}`);
  return data;
};

//Enviar Instrucciones

export const sendInstructionsEmail = async (email) => {
  const { data } = await api.post(`/instrucciones`, { email });
  return data;
};
// 🔹 Obtener usuario por teléfono
export const getUserByPhone = async (phone) => {
  const { data } = await api.get(`/by-phone/${phone}`);
  return data;
};

// 🔹 Actualizar coordenadas de un usuario por teléfono
export const updateCoordinates = async (phone, { latitud, longitud }) => {
  const { data } = await api.put("/update-coordinates", {
    phone,
    latitud,
    longitud,
  });
  return data;
};
