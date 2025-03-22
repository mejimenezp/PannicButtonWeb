import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../api/admin";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const [isValid, setIsValid] = useState(null);
  const userRole = getUserRole();

  useEffect(() => {
    const checkToken = async () => {
      const valid = await isAuthenticated();
      setIsValid(valid);
    };
    checkToken();
  }, []);

  if (isValid === null) return <div>🔄 Cargando...</div>;

  if (!isValid) {
    console.warn("🚫 Token inválido o expirado, redirigiendo a login.");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.warn("🚫 Acceso denegado: No tienes permisos para esta ruta.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
