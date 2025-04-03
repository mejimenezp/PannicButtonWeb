import api from "./api";
import { jwtDecode } from "jwt-decode";

// Iniciar sesión
export const login = async (phone, email) => {
  try {
    const response = await api.post("/auth/login", { phone, email });
    const { token} = response.data;

    if (token) {

      const decoded = jwtDecode(token);
      const serv_id = decoded.serv_id;
      const role = decoded.role;
      const id = decoded.id;
      const Dpto_ID = decoded.departamento;
      const Area_ID = decoded.area;
      const Ciud_ID = decoded.ciudad;
      const Vere_ID = decoded.vereda;
      const Loca_ID = decoded.localidad;

      localStorage.setItem("token", token);
      localStorage.setItem("serv_id", serv_id);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);
      localStorage.setItem("Dpto_ID", Dpto_ID);
      localStorage.setItem("Area_ID", Area_ID);
      localStorage.setItem("Ciud_ID", Ciud_ID);
      localStorage.setItem("Vere_ID", Vere_ID);
      localStorage.setItem("Loca_ID", Loca_ID);
      return { success: true, role, token };
    }

    return { success: false };
  } catch (error) {
    console.error("❌ Error en el inicio de sesión:", error);
    return { success: false };
  }
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

// ✅ Nueva función para validar el token en el backend
export const validateToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await api.get("/auth/validate", {headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.valid;
  } catch (error) {
    console.error("❌ Error al validar el token:", error.response?.data || error.message);
    return false;
  }
};



// Verificar si el usuario está autenticado (token presente y válido)
export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  return await validateToken();
};

// Obtener el rol del usuario
export const getUserRole = () => {
  return localStorage.getItem("role");
};
export const getUserService = () => {
  return localStorage.getItem("serv_id");
};
