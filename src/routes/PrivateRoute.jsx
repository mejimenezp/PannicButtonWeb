import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../api/admin";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const isLoggedIn = isAuthenticated();
  const userRole = getUserRole();

  console.log("🔍 Validando acceso - Rol:", userRole);

  // Si el usuario no está logueado o no tiene el rol adecuado
  if (!isLoggedIn) {
    console.warn("🚫 Usuario no autenticado, redirigiendo a login.");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.warn("🚫 Acceso denegado: No tienes permisos para esta ruta.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
