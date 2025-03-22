import api from "./api";

// Iniciar sesión
export const login = async (phone, email) => {
  try {
    const response = await api.post("/auth/login", { phone, email });
    const { token, role } = response.data;

    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
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
