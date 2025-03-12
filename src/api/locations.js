import api from "./api";

export const getDepartamentos = async () => {
  const response = await api.get("/departamentos");
  return response.data;
};

export const getAreas = async (dpto_id) => {
  const response = await api.get(`/areas/${dpto_id}`);
  return response.data;
};

export const getCiudades = async (area_id) => {
  const response = await api.get(`/ciudades/${area_id}`);
  return response.data;
};

export const getVeredas = async (ciud_id) => {
  const response = await api.get(`/veredas/${ciud_id}`);
  return response.data;
};

export const getLocalidades = async (vere_id) => {
  const response = await api.get(`/localidades/${vere_id}`);
  return response.data;
};
