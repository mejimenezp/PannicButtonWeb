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
/* =========================  POST  ========================= */
// Departamento (serv_id 5)
export const createDepartamento = async (dpto_name) => {
  const { data } = await api.post("/departamentos", { dpto_name });
  return data;
};

// Área (serv_id ≥ 4)
export const createArea = async ({ dpto_id, area_name }) => {
  const { data } = await api.post("/areas", { dpto_id, area_name });
  return data;
};

// Ciudad (serv_id ≥ 3)
export const createCiudad = async ({ dpto_id, area_id, ciud_name }) => {
  const { data } = await api.post("/ciudades", { dpto_id, area_id, ciud_name });
  return data;
};

// Vereda (serv_id ≥ 2)
export const createVereda = async ({ dpto_id, area_id, ciud_id, vere_name }) => {
  const { data } = await api.post("/veredas", {
    dpto_id, area_id, ciud_id, vere_name
  });
  return data;
};

// Localidad (serv_id ≥ 1)
export const createLocalidad = async ({ dpto_id, area_id, ciud_id, vere_id, loca_name }) => {
  const { data } = await api.post("/localidades", {
    dpto_id, area_id, ciud_id, vere_id, loca_name
  });
  return data;
};
