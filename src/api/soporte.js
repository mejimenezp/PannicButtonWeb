import api from "./api";

// Obtener usuarios según el tipo de servicio y la ubicación del usuario de soporte
export const getSupportUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const serv_id = localStorage.getItem("serv_id");
    const cont_id = localStorage.getItem("id"); // Cont_ID del usuario de soporte

    if (!token || !serv_id || !cont_id) {
      throw new Error("Faltan datos en localStorage (token, serv_id o cont_id)");
    }

    const response = await api.get(`/soportUsers?serv_id=${serv_id}&cont_id=${cont_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener los usuarios de soporte:", error);
    return [];
  }
};


// Obtener contactos según el tipo de servicio y la ubicación del contacto de soporte
export const getSupportContacts = async () => {
  try {
    const token = localStorage.getItem("token");
    const serv_id = localStorage.getItem("serv_id");
    const cont_id = localStorage.getItem("id"); // Cont_ID del usuario de soporte

    if (!token || !serv_id || !cont_id) {
      throw new Error("Faltan datos en localStorage (token, serv_id o cont_id)");
    }

    const response = await api.get(`/soporteContacs?serv_id=${serv_id}&cont_id=${cont_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener los contactos de soporte:", error);
    return [];
  }
};

