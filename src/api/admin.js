import api from "./api";

// Iniciar sesión
export const login = async (phone, email) => {
  try {
    const response = await api.post("/auth/login", { phone, email });
    const { token, role } = response.data;

    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      return { success: true, role };
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

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Obtener el rol del usuario
export const getUserRole = () => {
  return localStorage.getItem("role");
};
